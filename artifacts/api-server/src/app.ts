import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { authMiddleware } from "./middlewares/authMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";
import { RECEIVER_ADDRESS, NETWORK, PRICE_XLM } from "./middlewares/x402";
import { WebhookHandlers } from "./webhookHandlers";
import { db, tooloraUsersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { getUncachableStripeClient } from "./stripeClient";

const app: Express = express();

// ── Stripe webhook: must be registered BEFORE express.json() ─────────────────
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) { res.status(400).json({ error: "Missing stripe-signature" }); return; }
    const signature = Array.isArray(sig) ? sig[0] : sig;
    const payload = req.body as Buffer;

    // Handle credit purchases (checkout.session.completed with mode=payment)
    try {
      const stripe = await getUncachableStripeClient();
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (webhookSecret) {
        const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as { mode: string; metadata?: Record<string, string | null> };
          if (session.mode === "payment" && session.metadata?.credits && session.metadata?.userId) {
            const credits = parseInt(session.metadata.credits, 10);
            const userId = session.metadata.userId;
            if (!isNaN(credits) && credits > 0 && userId) {
              await db
                .update(tooloraUsersTable)
                .set({ creditsBalance: sql`${tooloraUsersTable.creditsBalance} + ${credits}` })
                .where(eq(tooloraUsersTable.id, userId));
              logger.info({ userId, credits }, "API credits added via Stripe payment");
            }
          }
        }
      }
    } catch (err) {
      logger.warn({ err }, "Credit webhook handler failed (non-fatal)");
    }

    // Also run the standard sync handler (handles subscriptions)
    try {
      await WebhookHandlers.processWebhook(payload, signature);
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
