import { Router } from "express";
import { db, groupsTable, staffTable, sessionsTable, casesTable, activityTable, alertsTable, aiInsightsTable } from "@workspace/db";
import { eq, and, sql, desc, gte } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router = Router();

const ownsGroup = async (userId: string, groupId: number): Promise<boolean> => {
  const [g] = await db.select().from(groupsTable).where(and(eq(groupsTable.id, groupId), eq(groupsTable.clerkUserId, userId)));
  return !!g;
};

router.get("/groups/:groupId/dashboard", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalStaff] = await db.select({ count: sql<number>`count(*)::int` }).from(staffTable).where(eq(staffTable.groupId, groupId));
    const [activeStaff] = await db.select({ count: sql<number>`count(*)::int` }).from(staffTable).where(and(eq(staffTable.groupId, groupId), eq(staffTable.status, "active")));
    const [inactiveStaff] = await db.select({ count: sql<number>`count(*)::int` }).from(staffTable).where(and(eq(staffTable.groupId, groupId), eq(staffTable.status, "inactive")));
    const [flaggedStaff] = await db.select({ count: sql<number>`count(*)::int` }).from(staffTable).where(and(eq(staffTable.groupId, groupId), eq(staffTable.status, "flagged")));
    const [activeSessions] = await db.select({ count: sql<number>`count(*)::int` }).from(sessionsTable).where(and(eq(sessionsTable.groupId, groupId), eq(sessionsTable.active, true)));
    const [totalSessionsToday] = await db.select({ count: sql<number>`count(*)::int` }).from(sessionsTable).where(and(eq(sessionsTable.groupId, groupId), gte(sessionsTable.startedAt, today)));
    const [activityToday] = await db.select({ total: sql<number>`coalesce(sum(duration_minutes), 0)::int` }).from(sessionsTable).where(and(eq(sessionsTable.groupId, groupId), gte(sessionsTable.startedAt, today)));
    const [openCases] = await db.select({ count: sql<number>`count(*)::int` }).from(casesTable).where(and(eq(casesTable.groupId, groupId), eq(casesTable.status, "open")));
    const [pendingAlerts] = await db.select({ count: sql<number>`count(*)::int` }).from(alertsTable).where(and(eq(alertsTable.groupId, groupId), eq(alertsTable.read, false)));

    const topPerformers = await db.select().from(staffTable).where(and(eq(staffTable.groupId, groupId), eq(staffTable.status, "active"))).orderBy(desc(staffTable.totalActivityMinutes)).limit(5);
    const recentInsights = await db.select().from(aiInsightsTable).where(and(eq(aiInsightsTable.groupId, groupId), eq(aiInsightsTable.resolved, false))).orderBy(desc(aiInsightsTable.createdAt)).limit(5);

    res.json({
      totalStaff: totalStaff?.count ?? 0,
      activeStaff: activeStaff?.count ?? 0,
      inactiveStaff: inactiveStaff?.count ?? 0,
      flaggedStaff: flaggedStaff?.count ?? 0,
      activeSessions: activeSessions?.count ?? 0,
      totalSessionsToday: totalSessionsToday?.count ?? 0,
      totalActivityMinutesToday: activityToday?.total ?? 0,
      openCases: openCases?.count ?? 0,
      closedCasesThisWeek: 0,
      pendingAlerts: pendingAlerts?.count ?? 0,
      automationRulesFired: 0,
      topPerformers: topPerformers.map(s => ({ ...s, joinedAt: s.joinedAt.toISOString(), lastSeenAt: s.lastSeenAt?.toISOString() ?? null })),
      recentInsights: recentInsights.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })),
    });
  } catch (err) {
    req.log.error({ err }, "getDashboard error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/groups/:groupId/activity", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  const limit = parseInt(String(req.query.limit ?? "20"));
  try {
    const activity = await db.select().from(activityTable).where(eq(activityTable.groupId, groupId)).orderBy(desc(activityTable.createdAt)).limit(limit);
    res.json(activity.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "getActivity error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/groups/:groupId/alerts", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  const unreadOnly = req.query.unreadOnly === "true";
  try {
    let alerts = await db.select().from(alertsTable).where(eq(alertsTable.groupId, groupId)).orderBy(desc(alertsTable.createdAt)).limit(50);
    if (unreadOnly) alerts = alerts.filter(a => !a.read);
    res.json(alerts.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "listAlerts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/groups/:groupId/alerts/:alertId/read", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  const alertId = parseInt(String(req.params.alertId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const [alert] = await db.update(alertsTable).set({ read: true }).where(and(eq(alertsTable.id, alertId), eq(alertsTable.groupId, groupId))).returning();
    if (!alert) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ ...alert, createdAt: alert.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "markAlertRead error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
