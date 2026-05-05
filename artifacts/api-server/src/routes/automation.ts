import { Router } from "express";
import { db, automationRulesTable, groupsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { CreateAutomationRuleBody, UpdateAutomationRuleBody } from "@workspace/api-zod";

const router = Router();

const ownsGroup = async (userId: string, groupId: number): Promise<boolean> => {
  const [g] = await db.select().from(groupsTable).where(and(eq(groupsTable.id, groupId), eq(groupsTable.clerkUserId, userId)));
  return !!g;
};

const formatRule = (r: typeof automationRulesTable.$inferSelect) => ({
  ...r,
  createdAt: r.createdAt?.toISOString(),
});

router.get("/groups/:groupId/automation", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const rules = await db.select().from(automationRulesTable).where(eq(automationRulesTable.groupId, groupId));
    res.json(rules.map(formatRule));
  } catch (err) {
    req.log.error({ err }, "listAutomation error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/groups/:groupId/automation", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  const parsed = CreateAutomationRuleBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error }); return; }
  try {
    const [rule] = await db.insert(automationRulesTable).values({ ...parsed.data, groupId, enabled: true, firedCount: 0 }).returning();
    res.status(201).json(formatRule(rule));
  } catch (err) {
    req.log.error({ err }, "createAutomation error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/groups/:groupId/automation/:ruleId", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  const ruleId = parseInt(String(req.params.ruleId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  const parsed = UpdateAutomationRuleBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error }); return; }
  try {
    const [rule] = await db.update(automationRulesTable).set(parsed.data).where(and(eq(automationRulesTable.id, ruleId), eq(automationRulesTable.groupId, groupId))).returning();
    if (!rule) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatRule(rule));
  } catch (err) {
    req.log.error({ err }, "updateAutomation error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/groups/:groupId/automation/:ruleId", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  const ruleId = parseInt(String(req.params.ruleId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    await db.delete(automationRulesTable).where(and(eq(automationRulesTable.id, ruleId), eq(automationRulesTable.groupId, groupId)));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "deleteAutomation error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
