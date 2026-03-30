import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toolsRouter from "./tools";
import authRouter from "./auth";
import userRouter from "./user";
import agentRouter from "./agent";
import adminRouter from "./admin";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/tools", toolsRouter);
router.use(authRouter);
router.use("/user", userRouter);
router.use("/agent", agentRouter);
router.use("/admin", adminRouter);
router.use("/analytics", analyticsRouter);

export default router;
