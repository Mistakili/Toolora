import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toolsRouter from "./tools";
import authRouter from "./auth";
import userRouter from "./user";
import agentRouter from "./agent";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/tools", toolsRouter);
router.use(authRouter);
router.use("/user", userRouter);
router.use("/agent", agentRouter);
router.use("/admin", adminRouter);

export default router;
