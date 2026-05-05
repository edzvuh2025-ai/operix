import { Router, type IRouter } from "express";
import healthRouter from "./health";
import groupsRouter from "./groups";
import staffRouter from "./staff";
import sessionsRouter from "./sessions";
import casesRouter from "./cases";
import automationRouter from "./automation";
import dashboardRouter from "./dashboard";
import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(groupsRouter);
router.use(staffRouter);
router.use(sessionsRouter);
router.use(casesRouter);
router.use(automationRouter);
router.use(dashboardRouter);
router.use(aiRouter);

export default router;
