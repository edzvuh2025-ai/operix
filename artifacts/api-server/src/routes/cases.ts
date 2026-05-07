import {Router, Request, Response} from "express";
import {client, cases} from "@operix/db";
import {requireAuth} from "../middleware/auth.js";
import {logActivity} from "../lib/activity.js";
import {CreateCaseSchema} from "@operix/api-zod";

const router = Router({mergeParams: true});
router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next) => {
  try {
    const groupId = parseInt(req.params.groupId);
    const data = await client.query.cases.findMany({where: (c, {eq}) => eq(c.groupId, groupId)});
    res.json(data);
  } catch (e) {next(e);}
});

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const userId = req.auth!.userId;
    const groupId = parseInt(req.params.groupId);
    const body = CreateCaseSchema.parse(req.body);
    const [c] = await client.insert(cases).values({groupId, ...body, status: "open"}).returning();
    await logActivity(groupId, userId, "create", "case", c.id, `Created case: ${body.reason}`);
    res.status(201).json(c);
  } catch (e) {next(e);}
});

router.put("/:id", async (req: Request, res: Response, next) => {
  try {
    const userId = req.auth!.userId;
    const groupId = parseInt(req.params.groupId);
    const id = parseInt(req.params.id);
    const {status} = req.body;
    const [c] = await client.update(cases).set({status, closedAt: status === "closed" ? new Date() : null}).where((cases, {eq}) => eq(cases.id, id)).returning();
    await logActivity(groupId, userId, "update", "case", id, `Updated case status: ${status}`);
    res.json(c);
  } catch (e) {next(e);}
});

export default router;
