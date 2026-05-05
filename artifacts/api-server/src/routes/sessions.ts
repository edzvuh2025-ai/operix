import { Router } from "express";
import { db, sessionsTable, groupsTable, staffTable } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { logActivity } from "../lib/activity-logger";
import { CreateSessionBody } from "@workspace/api-zod";

const router = Router();

const ownsGroup = async (userId: string, groupId: number): Promise<boolean> => {
  const [g] = await db.select().from(groupsTable).where(and(eq(groupsTable.id, groupId), eq(groupsTable.clerkUserId, userId)));
  return !!g;
};

const formatSession = (s: typeof sessionsTable.$inferSelect) => ({
  ...s,
  startedAt: s.startedAt?.toISOString(),
  endedAt: s.endedAt?.toISOString() ?? null,
});

router.get("/groups/:groupId/sessions", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  const limit = parseInt(String(req.query.limit ?? "50"));
  const activeOnly = req.query.active === "true";
  try {
    let sessions = await db.select().from(sessionsTable).where(eq(sessionsTable.groupId, groupId)).orderBy(desc(sessionsTable.startedAt)).limit(limit);
    if (activeOnly) sessions = sessions.filter(s => s.active);
    res.json(sessions.map(formatSession));
  } catch (err) {
    req.log.error({ err }, "listSessions error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/groups/:groupId/sessions", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error }); return; }
  try {
    let staffId: number | undefined = parsed.data.staffId;
    const staffUsername = parsed.data.robloxUsername;
    if (!staffId && parsed.data.robloxUsername) {
      const [staff] = await db.select().from(staffTable).where(and(eq(staffTable.groupId, groupId), eq(staffTable.robloxUsername, parsed.data.robloxUsername)));
      if (staff) staffId = staff.id;
    }
    const [session] = await db.insert(sessionsTable).values({ groupId, staffId: staffId ?? null, staffUsername, serverName: parsed.data.serverName, active: true }).returning();
    await logActivity({
      groupId,
      type: "session_started",
      message: `${staffUsername} started a session on ${parsed.data.serverName}`,
      staffUsername: staffUsername || undefined,
    });
    res.status(201).json(formatSession(session));
  } catch (err) {
    req.log.error({ err }, "createSession error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/groups/:groupId/sessions/:sessionId/end", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  const sessionId = parseInt(String(req.params.sessionId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const [existing] = await db.select().from(sessionsTable).where(and(eq(sessionsTable.id, sessionId), eq(sessionsTable.groupId, groupId)));
    if (!existing) { res.status(404).json({ error: "Not found" }); return; }
    const endedAt = new Date();
    const durationMinutes = Math.floor((endedAt.getTime() - existing.startedAt.getTime()) / 60000);
    const [session] = await db.update(sessionsTable).set({ active: false, endedAt, durationMinutes }).where(eq(sessionsTable.id, sessionId)).returning();
    if (session.staffId) {
      await db.update(staffTable)
        .set({ totalActivityMinutes: sql`${staffTable.totalActivityMinutes} + ${durationMinutes}`, lastSeenAt: endedAt })
        .where(eq(staffTable.id, session.staffId));
    }
    await logActivity({
      groupId,
      type: "session_ended",
      message: `${existing.staffUsername} ended session on ${existing.serverName} (${durationMinutes}m)`,
      staffUsername: existing.staffUsername || undefined,
    });
    res.json(formatSession(session));
  } catch (err) {
    req.log.error({ err }, "endSession error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
