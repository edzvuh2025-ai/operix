import {Router, Request, Response} from "express";
import {client, groups} from "@operix/db";
import {requireAuth} from "../middleware/auth.js";
import {logActivity} from "../lib/activity.js";
import {CreateGroupSchema} from "@operix/api-zod";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next) => {
  try {
    const userId = req.auth!.userId;
    const data = await client.query.groups.findMany({where: (g, {eq}) => eq(g.userId, userId)});
    res.json(data);
  } catch (e) {next(e);}
});

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const userId = req.auth!.userId;
    const {name, robloxId} = CreateGroupSchema.parse(req.body);
    const [g] = await client.insert(groups).values({userId, name, robloxId}).returning();
    await logActivity(g.id, userId, "create", "group", g.id, "Created group");
    res.status(201).json(g);
  } catch (e) {next(e);}
});

router.get("/:id", async (req: Request, res: Response, next) => {
  try {
    const g = await client.query.groups.findFirst({where: (groups, {eq}) => eq(groups.id, parseInt(req.params.id))});
    if (!g) return res.status(404).json({error: "Not found"});
    res.json(g);
  } catch (e) {next(e);}
});

router.put("/:id", async (req: Request, res: Response, next) => {
  try {
    const userId = req.auth!.userId;
    const {name, robloxId} = CreateGroupSchema.parse(req.body);
    const [g] = await client.update(groups).set({name, robloxId, updatedAt: new Date()}).where((groups, {eq}) => eq(groups.id, parseInt(req.params.id))).returning();
    await logActivity(g.id, userId, "update", "group", g.id, "Updated group");
    res.json(g);
  } catch (e) {next(e);}
});

router.delete("/:id", async (req: Request, res: Response, next) => {
  try {
    const userId = req.auth!.userId;
    const id = parseInt(req.params.id);
    await client.delete(groups).where((g, {eq}) => eq(g.id, id));
    await logActivity(id, userId, "delete", "group", id, "Deleted group");
    res.status(204).send();
  } catch (e) {next(e);}
});

export default router;
