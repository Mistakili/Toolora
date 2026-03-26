import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toolsRouter from "./tools";
import authRouter from "./auth";
import userRouter from "./user";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/tools", toolsRouter);
router.use(authRouter);
router.use("/user", userRouter);

export default router;
