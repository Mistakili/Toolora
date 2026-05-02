import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { getGatewayHealth } from "../lib/gatewayHealth.js";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  // Validate the core { status } envelope against the published API schema so
  // any downstream client / generated SDK keeps working unchanged. Then attach
  // gateway-health diagnostics as additional fields. If the gateway has logged
  // any CRITICAL billing-event-insert failures since boot, status flips to
  // 'degraded' so external uptime monitors page on it.
  const gateway = getGatewayHealth();
  const core = HealthCheckResponse.parse({ status: "ok" });
  res.json({
    ...core,
    status: gateway.status === "degraded" ? "degraded" : core.status,
    gateway,
  });
});

export default router;
