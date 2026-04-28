import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { authMiddleware } from "./middlewares/authMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";
import { RECEIVER_ADDRESS, NETWORK, PRICE_XLM } from "./middlewares/x402";
import { WebhookHandlers } from "./webhookHandlers";
import { db, tooloraUsersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { getUncachableStripeClient } from "./stripeClient";

const app: Express = express();

// ── Trust Replit's proxy so rate limiting and IP detection work correctly ─────
// Without this, all users appear to come from the same IP (the proxy),
// causing rate limits to fire globally instead of per-user.
app.set("trust proxy", 1);

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

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// ── Rate limiting ─────────────────────────────────────────────────────────────
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many subscription attempts. Please wait before trying again." },
});

const agentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Rate limit exceeded. Agent endpoints allow 30 requests/minute." },
});

app.use("/api/subscribe", subscribeLimiter);
app.use("/api/agent", agentLimiter);
app.use("/api", standardLimiter);

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
// Capture raw body before JSON parsing for webhook signature verification.
app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as Request & { rawBody?: string }).rawBody = buf.toString("utf8");
    },
  }),
);
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

app.get("/.well-known/mcp.json", (_req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.json({
    name: "toolora",
    displayName: "Toolora",
    description:
      "Privacy-first MCP server with 25 free tools — PDF/DOCX/Excel reading, OCR, audio transcription, JS-rendered web scraping, structured data extraction, and developer utilities. Free with no API key and no signup; 200 calls/day per client. Files are processed in memory and never stored on disk; only anonymous, salted-hash request metadata is retained for 30 days.",
    longDescription:
      "Toolora replaces a stack of paid agent tools (Firecrawl, Mistral OCR, Whisper API, Adobe PDF Services) with a single free MCP. Built for AI agents that need to read documents, scrape modern web apps, transcribe audio, or extract structured data without an API key. Pro tier ($19/mo) lifts the 200/day limit. Two additional on-chain-paid tools are available for agents that want untraceable execution (private_execute_tool via MagicBlock PER) or paid Solana DEX signals (get_arc_trading_signal via x402).",
    version: "1.0.0",
    protocolVersion: "2025-03-26",
    transport: "streamable-http",
    endpoint: "https://toolora.dev/api/mcp",
    homepage: "https://toolora.dev",
    documentation: "https://toolora.dev/mcp",
    repository: "https://github.com/wesleyolis/toolora",
    license: "MIT",
    author: { name: "Toolora", url: "https://toolora.dev", email: "support@toolora.dev" },
    pricing: {
      model: "freemium",
      freeTier: { callsPerDay: 200, requiresAuth: false },
      pro: { price: "$19/mo", calls: "unlimited", url: "https://toolora.dev/pricing" },
      team: { price: "custom", url: "https://toolora.dev/pricing" },
    },
    privacy: {
      dataRetention: "none",
      filesStored: false,
      logsRetained: "30 days (anonymous, salted-hash client IDs only)",
      gdprCompliant: true,
    },
    categories: [
      "document-processing", "file-conversion", "web-scraping", "data-extraction",
      "ocr", "transcription", "developer-tools", "productivity", "ai-tools",
    ],
    keywords: [
      "pdf", "docx", "excel", "ocr", "qr-code", "audio-transcription", "whisper",
      "csv", "json", "web-scraping", "headless-browser", "readability", "markdown",
      "html", "regex", "hash", "tokens", "chunking", "rag", "structured-extraction",
      "memory", "paste", "diff", "privacy-first",
    ],
    tools: [
      { name: "extract_pdf_text", category: "document-processing" },
      { name: "merge_pdfs", category: "document-processing" },
      { name: "generate_pdf_from_text", category: "document-processing" },
      { name: "extract_docx_text", category: "document-processing" },
      { name: "excel_to_json", category: "document-processing" },
      { name: "ocr_image", category: "ocr" },
      { name: "transcribe_audio", category: "transcription" },
      { name: "read_url", category: "web-scraping" },
      { name: "scrape_url_js", category: "web-scraping" },
      { name: "extract_structured_data", category: "data-extraction" },
      { name: "csv_to_json", category: "file-conversion" },
      { name: "json_to_csv", category: "file-conversion" },
      { name: "markdown_to_html", category: "file-conversion" },
      { name: "html_to_markdown", category: "file-conversion" },
      { name: "generate_qr_code", category: "productivity" },
      { name: "count_words", category: "productivity" },
      { name: "create_shareable_paste", category: "productivity" },
      { name: "save_memory", category: "productivity" },
      { name: "recall_memory", category: "productivity" },
      { name: "list_memories", category: "productivity" },
      { name: "chunk_text", category: "developer-tools" },
      { name: "estimate_tokens", category: "developer-tools" },
      { name: "diff_texts", category: "developer-tools" },
      { name: "run_regex", category: "developer-tools" },
      { name: "hash_text", category: "developer-tools" },
    ],
    install: {
      "claude-desktop": {
        config: {
          mcpServers: {
            toolora: {
              command: "npx",
              args: ["-y", "mcp-remote", "https://toolora.dev/api/mcp"],
            },
          },
        },
      },
      cursor: {
        config: {
          mcpServers: {
            toolora: {
              url: "https://toolora.dev/api/mcp",
              transport: "http",
            },
          },
        },
      },
      cline: {
        config: {
          mcpServers: {
            toolora: {
              url: "https://toolora.dev/api/mcp",
              transport: "http",
            },
          },
        },
      },
      "replit-agent": {
        // In Replit Agent, add the URL via the MCP integration UI
        // (Tools → MCP Servers → Add Server). No CLI install required.
        url: "https://toolora.dev/api/mcp",
        instructions: "Add this URL via Replit Agent's MCP server settings panel.",
      },
    },
  });
});

app.get("/robots.txt", (_req: Request, res: Response) => {
  res.type("text/plain").send([
    "User-agent: *",
    "Allow: /api/agent",
    "Allow: /api/mcp",
    "Allow: /.well-known/agent.json",
    "Allow: /.well-known/mcp.json",
    "",
    "# Toolora Agent API — paid document processing endpoints for AI agents",
    "# Discovery: GET /api/agent",
    "# Full docs: /api-docs",
    "",
    "# Toolora MCP Server — 12 free tools for Claude Desktop / Cursor",
    "# Endpoint: /api/mcp",
    "# Discovery: /.well-known/mcp.json",
  ].join("\n"));
});

export default app;
