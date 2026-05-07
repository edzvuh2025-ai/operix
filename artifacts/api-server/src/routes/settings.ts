import {Router, Request, Response} from "express";
import {requireAuth} from "../middleware/auth.js";
import {UpdateSettingsSchema} from "@operix/api-zod";

const router = Router({mergeParams: true});
router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  res.json({description: "", discord: "", website: ""});
});

router.put("/", async (req: Request, res: Response, next) => {
  try {
    const settings = UpdateSettingsSchema.parse(req.body);
    res.json(settings);
  } catch (e) {next(e);}
});

export default router;
