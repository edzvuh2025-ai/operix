import { Router, Request, Response } from "express";
import { client, activityLog } from "@operix/db";
import { requireAuth } from "../middleware/auth.js";
import { eq } from "drizzle-orm";

const router = Router({ mergeParams: true });
router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next) => {
  try {
    const groupId = parseInt(String(req.params.groupId));
    const data = await client.select().from(activityLog).where(eq(activityLog.groupId, groupId));
    res.json(data.reverse());
  } catch (e) { next(e); }
});

export default router;
