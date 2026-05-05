import { Router } from "express";
import { db, groupsTable, staffTable, sessionsTable, casesTable, aiInsightsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

const ownsGroup = async (userId: string, groupId: number): Promise<boolean> => {
  const [g] = await db.select().from(groupsTable).where(and(eq(groupsTable.id, groupId), eq(groupsTable.clerkUserId, userId)));
  return !!g;
};

router.get("/groups/:groupId/ai/insights", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const insights = await db.select().from(aiInsightsTable).where(eq(aiInsightsTable.groupId, groupId)).orderBy(desc(aiInsightsTable.createdAt)).limit(20);
    res.json(insights.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "getInsights error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/groups/:groupId/staff/:staffId/ai/summary", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  const staffId = parseInt(String(req.params.staffId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const [staff] = await db.select().from(staffTable).where(and(eq(staffTable.id, staffId), eq(staffTable.groupId, groupId)));
    if (!staff) { res.status(404).json({ error: "Not found" }); return; }
    const recentSessions = await db.select().from(sessionsTable).where(eq(sessionsTable.staffId, staffId)).limit(10);
    const recentCases = await db.select().from(casesTable).where(eq(casesTable.staffId, staffId)).limit(5);

    const prompt = `You are an AI assistant analyzing Roblox group staff performance. Generate a concise performance summary for staff member "${staff.robloxUsername}" with rank "${staff.rank ?? "Unknown"}".

Stats:
- Total activity: ${staff.totalActivityMinutes} minutes
- Sessions: ${staff.sessionsCount}
- Warnings: ${staff.warningsCount}
- Cases: ${staff.casesCount}
- Status: ${staff.status}
- Recent sessions: ${recentSessions.length} sessions in history
- Recent cases: ${recentCases.length} cases

Respond in JSON format:
{
  "summary": "2-3 sentence performance summary",
  "recommendation": "specific actionable recommendation (promote/maintain/review/warn/demote)",
  "performanceScore": <0-100>,
  "highlights": ["key point 1", "key point 2", "key point 3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");
    res.json({ staffId, ...result });
  } catch (err) {
    req.log.error({ err }, "generateStaffSummary error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/groups/:groupId/cases/:caseId/ai/summarize", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const groupId = parseInt(String(req.params.groupId));
  const caseId = parseInt(String(req.params.caseId));
  if (!(await ownsGroup(userId, groupId))) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const [c] = await db.select().from(casesTable).where(and(eq(casesTable.id, caseId), eq(casesTable.groupId, groupId)));
    if (!c) { res.status(404).json({ error: "Not found" }); return; }

    const prompt = `You are an AI assistant for Roblox group moderation. Analyze this case and provide a summary.

Case: "${c.title}"
Severity: ${c.severity}
Status: ${c.status}
Description: ${c.description ?? "No description provided"}
Staff involved: ${c.staffUsername ?? "Unknown"}
Evidence count: ${c.evidenceCount}

Respond in JSON format:
{
  "summary": "2-3 sentence objective case summary",
  "suggestedAction": "specific recommended action",
  "severity": "low|medium|high|critical"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const result = JSON.parse(response.choices[0]?.message?.content ?? "{}");
    await db.update(casesTable).set({ aiSummary: result.summary, suggestedAction: result.suggestedAction, updatedAt: new Date() }).where(eq(casesTable.id, caseId));
    res.json({ caseId, ...result });
  } catch (err) {
    req.log.error({ err }, "summarizeCase error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
