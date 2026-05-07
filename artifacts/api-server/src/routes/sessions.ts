import { Router, Request, Response } from "express";
import { client, sessions } from "@operix/db";
import { getAuth } from "@clerk/express";
import { requireAuth } from "../middleware/auth.js";
import { logActivity } from "../lib/activity.js";
import { eq } from "drizzle-orm";

const router = Router({ mergeParams: true });
router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next) => {
  try {
    const groupId = parseInt(String(req.params.groupId));
    const data = await client.select().from(sessions).where(eq(sessions.groupId, groupId));
    res.json(data);
  } catch (e) { next(e); }
});

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const { userId } = getAuth(req);
    const groupId = parseInt(String(req.params.groupId));
    const { staffRobloxId } = req.body;
    const [s] = await client.insert(sessions).values({ groupId, staffRobloxId }).returning();
    await logActivity(groupId, userId!, "create", "session", s.id, "Started session");
    res.status(201).json(s);
  } catch (e) { next(e); }
});

router.delete("/:id", async (req: Request, res: Response, next) => {
  try {
    const { userId } = getAuth(req);
    const groupId = parseInt(String(req.params.groupId));
    const id = parseInt(String(req.params.id));
    const [s] = await client.update(sessions).set({ endedAt: new Date() }).where(eq(sessions.id, id)).returning();
    await logActivity(groupId, userId!, "delete", "session", id, "Ended session");
    res.json(s);
  } catch (e) { next(e); }
});

export default router;
