import {Router, Request, Response} from "express";
import {client, staff} from "@operix/db";
import {requireAuth} from "../middleware/auth.js";
import {logActivity} from "../lib/activity.js";
import {CreateStaffSchema} from "@operix/api-zod";

const router = Router({mergeParams: true});
router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next) => {
  try {
    const groupId = parseInt(req.params.groupId);
    const data = await client.query.staff.findMany({where: (s, {eq}) => eq(s.groupId, groupId)});
    res.json(data);
  } catch (e) {next(e);}
});

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const userId = req.auth!.userId;
    const groupId = parseInt(req.params.groupId);
    const {robloxId, username, role} = CreateStaffSchema.parse(req.body);
    const [s] = await client.insert(staff).values({groupId, robloxId, username, role}).returning();
    await logActivity(groupId, userId, "create", "staff", s.id, `Added staff: ${username}`);
    res.status(201).json(s);
  } catch (e) {next(e);}
});

router.delete("/:id", async (req: Request, res: Response, next) => {
  try {
    const userId = req.auth!.userId;
    const groupId = parseInt(req.params.groupId);
    const id = parseInt(req.params.id);
    await client.delete(staff).where((s, {eq}) => eq(s.id, id));
    await logActivity(groupId, userId, "delete", "staff", id, "Removed staff");
    res.status(204).send();
  } catch (e) {next(e);}
});

export default router;
