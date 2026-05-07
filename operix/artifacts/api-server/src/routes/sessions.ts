import {Router, Request, Response} from "express";
import {client, sessions} from "@operix/db";
import {requireAuth} from "../middleware/auth.js";
import {logActivity} from "../lib/activity.js";

const router = Router({mergeParams: true});
router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next) => {
  try {
    const groupId = parseInt(req.params.groupId);
    const data = await client.query.sessions.findMany({where: (s, {eq}) => eq(s.groupId, groupId)});
    res.json(data);
  } catch (e) {next(e);}
});

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const userId = req.auth!.userId;
    const groupId = parseInt(req.params.groupId);
    const {staffRobloxId} = req.body;
    const [s] = await client.insert(sessions).values({groupId, staffRobloxId}).returning();
    await logActivity(groupId, userId, "create", "session", s.id, "Started session");
    res.status(201).json(s);
  } catch (e) {next(e);}
});

router.delete("/:id", async (req: Request, res: Response, next) => {
  try {
    const userId = req.auth!.userId;
    const groupId = parseInt(req.params.groupId);
    const id = parseInt(req.params.id);
    const [s] = await client.update(sessions).set({endedAt: new Date()}).where((sessions, {eq}) => eq(sessions.id, id)).returning();
    await logActivity(groupId, userId, "delete", "session", id, "Ended session");
    res.json(s);
  } catch (e) {next(e);}
});

export default router;
