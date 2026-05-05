import { Router } from "express";
import { db, groupsTable, staffTable, sessionsTable, casesTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { CreateGroupBody, UpdateGroupBody } from "@workspace/api-zod";

const router = Router();

router.get("/groups", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  try {
    const groups = await db.select().from(groupsTable).where(eq(groupsTable.clerkUserId, userId));
    const result = await Promise.all(
      groups.map(async (g) => {
        const [staffCount] = await db.select({ count: sql<number>`count(*)::int` }).from(staffTable).where(eq(staffTable.groupId, g.id));
        const [activeSessions] = await db.select({ count: sql<number>`count(*)::int` }).from(sessionsTable).where(and(eq(sessionsTable.groupId, g.id), eq(sessionsTable.active, true)));
        const [openCases] = await db.select({ count: sql<number>`count(*)::int` }).from(casesTable).where(and(eq(casesTable.groupId, g.id), eq(casesTable.status, "open")));
        return { ...g, staffCount: staffCount?.count ?? 0, activeSessions: activeSessions?.count ?? 0, openCases: openCases?.count ?? 0, createdAt: g.createdAt.toISOString() };
      })
    );
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "listGroups error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/groups", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const parsed = CreateGroupBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error }); return; }
  try {
    const [group] = await db.insert(groupsTable).values({ ...parsed.data, clerkUserId: userId }).returning();
    res.status(201).json({ ...group, staffCount: 0, activeSessions: 0, openCases: 0, createdAt: group.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "createGroup error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/groups/:groupId", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  try {
    const [group] = await db.select().from(groupsTable).where(and(eq(groupsTable.id, groupId), eq(groupsTable.clerkUserId, userId)));
    if (!group) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ ...group, createdAt: group.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "getGroup error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/groups/:groupId", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  const parsed = UpdateGroupBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error }); return; }
  try {
    const [group] = await db.update(groupsTable).set(parsed.data).where(and(eq(groupsTable.id, groupId), eq(groupsTable.clerkUserId, userId))).returning();
    if (!group) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ ...group, createdAt: group.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "updateGroup error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/groups/:groupId", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  try {
    await db.delete(groupsTable).where(and(eq(groupsTable.id, groupId), eq(groupsTable.clerkUserId, userId)));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "deleteGroup error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
