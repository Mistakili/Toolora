import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { authMiddleware } from "./middlewares/authMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";
import { RECEIVER_ADDRESS, NETWORK, PRICE_XLM } from "./middlewares/x402";
import { WebhookHandlers } from "./webhookHandlers";

const app: Express = express();

// ── Stripe webhook: must be registered BEFORE express.json() ─────────────────
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) { res.status(400).json({ error: "Missing stripe-signature" }); return; }
    try {
      const signature = Array.isArray(sig) ? sig[0] : sig;
      await WebhookHandlers.processWebhook(req.body as Buffer, signature);
      res.status(200).json({ received: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Webhook error";
      logger.error({ err }, "Stripe webhook error");
      res.status(400).json({ error: msg });
    }
  },
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use("/api", router);

// ── Agent discovery routes ──────────────────────────────────────────────────
// Agents and crawlers look here first. Always free, no auth required.

app.get("/.well-known/agent.json", (_req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    name: "Toolora Agent API",
    version: "1.0.0",
    manifestUrl: `${_req.protocol}://${_req.get("host")}/api/agent`,
    docsUrl: `${_req.protocol}://${_req.get("host")}/api-docs`,
    payment: { protocol: "x402", network: `stellar:${NETWORK}`, asset: "XLM", pricePerRequest: PRICE_XLM, payTo: RECEIVER_ADDRESS },
    endpoints: [
      { id: "pdf.text", method: "POST", path: "/api/agent/pdf/text", paid: true },
      { id: "url.read", method: "POST", path: "/api/agent/url/read", paid: true },
    ],
  });
});

app.get("/robots.txt", (_req: Request, res: Response) => {
  res.type("text/plain").send([
    "User-agent: *",
    "Allow: /api/agent",
    "Allow: /.well-known/agent.json",
    "",
    "# Toolora Agent API — paid document processing endpoints for AI agents",
    "# Discovery: GET /api/agent",
    "# Full docs: /api-docs",
  ].join("\n"));
});

export default app;
