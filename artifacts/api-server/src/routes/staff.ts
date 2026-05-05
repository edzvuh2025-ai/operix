import { Router } from "express";
import { db, staffTable, groupsTable, sessionsTable, casesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { logActivity } from "../lib/activity-logger";
import { CreateStaffMemberBody, UpdateStaffMemberBody } from "@workspace/api-zod";

const router = Router();

const ownsGroup = async (userId: string, groupId: number): Promise<boolean> => {
  const [g] = await db.select().from(groupsTable).where(and(eq(groupsTable.id, groupId), eq(groupsTable.clerkUserId, userId)));
  return !!g;
};

const formatStaff = (s: typeof staffTable.$inferSelect) => ({
  ...s,
  joinedAt: s.joinedAt?.toISOString(),
  lastSeenAt: s.lastSeenAt?.toISOString() ?? null,
});

router.get("/groups/:groupId/staff", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  const search = String(req.query.search ?? "");
  const role = req.query.role ? String(req.query.role) : "";
  const status = req.query.status ? String(req.query.status) : "";
  try {
    let staff = await db.select().from(staffTable).where(eq(staffTable.groupId, groupId));
    if (search) staff = staff.filter(s => s.robloxUsername.toLowerCase().includes(search.toLowerCase()));
    if (role) staff = staff.filter(s => s.role === role);
    if (status) staff = staff.filter(s => s.status === status);
    res.json(staff.map(formatStaff));
  } catch (err) {
    req.log.error({ err }, "listStaff error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/groups/:groupId/staff", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  const parsed = CreateStaffMemberBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error }); return; }
  try {
    const avatarUrl = `https://www.gravatar.com/avatar/${Math.random().toString(36).slice(2)}?d=identicon`;
    const [staff] = await db.insert(staffTable).values({ ...parsed.data, groupId, avatarUrl }).returning();
    await logActivity({
      groupId,
      type: "staff_added",
      message: `Added staff member ${staff.robloxUsername}`,
      staffUsername: staff.robloxUsername,
      
    });
    res.status(201).json(formatStaff(staff));
  } catch (err) {
    req.log.error({ err }, "createStaff error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/groups/:groupId/staff/:staffId", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  const staffId = parseInt(String(req.params.staffId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const [staff] = await db.select().from(staffTable).where(and(eq(staffTable.id, staffId), eq(staffTable.groupId, groupId)));
    if (!staff) { res.status(404).json({ error: "Not found" }); return; }
    const recentSessions = await db.select().from(sessionsTable).where(eq(sessionsTable.staffId, staffId)).limit(5);
    const recentCases = await db.select().from(casesTable).where(eq(casesTable.staffId, staffId)).limit(5);
    res.json({
      ...formatStaff(staff),
      recentSessions: recentSessions.map(s => ({ ...s, startedAt: s.startedAt.toISOString(), endedAt: s.endedAt?.toISOString() ?? null })),
      recentCases: recentCases.map(c => ({ ...c, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString() })),
    });
  } catch (err) {
    req.log.error({ err }, "getStaff error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/groups/:groupId/staff/:staffId", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  const staffId = parseInt(String(req.params.staffId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  const parsed = UpdateStaffMemberBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error }); return; }
  try {
    const [staff] = await db.update(staffTable).set(parsed.data).where(and(eq(staffTable.id, staffId), eq(staffTable.groupId, groupId))).returning();
    if (!staff) { res.status(404).json({ error: "Not found" }); return; }
    await logActivity({
      groupId,
      type: "staff_updated",
      message: `Updated staff member ${staff.robloxUsername}`,
      staffUsername: staff.robloxUsername,
      
    });
    res.json(formatStaff(staff));
  } catch (err) {
    req.log.error({ err }, "updateStaff error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/groups/:groupId/staff/:staffId", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  const staffId = parseInt(String(req.params.staffId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const [existing] = await db.select().from(staffTable).where(and(eq(staffTable.id, staffId), eq(staffTable.groupId, groupId)));
    if (existing) {
      await logActivity({
        groupId,
        type: "staff_deleted",
        message: `Removed staff member ${existing.robloxUsername}`,
        staffUsername: existing.robloxUsername,
        
      });
    }
    await db.delete(staffTable).where(and(eq(staffTable.id, staffId), eq(staffTable.groupId, groupId)));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "deleteStaff error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
