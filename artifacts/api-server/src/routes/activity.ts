import {Router, Request, Response} from "express";
import {client} from "@operix/db";
import {requireAuth} from "../middleware/auth.js";

const router = Router({mergeParams: true});
router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next) => {
  try {
    const groupId = parseInt(req.params.groupId);
    const data = await client.query.activityLog.findMany({where: (a, {eq}) => eq(a.groupId, groupId)});
    res.json(data.reverse());
  } catch (e) {next(e);}
});

export default router;
