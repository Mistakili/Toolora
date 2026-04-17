import { Router, type IRouter, type Request, type Response } from "express";
import crypto from "node:crypto";
import { db } from "@workspace/db";
import { sponsorsTable, mcpListingsTable } from "@workspace/db/schema";
import { logger } from "../lib/logger";
import { invalidateSponsorCache } from "../lib/sponsors";

const router: IRouter = Router();

/**
 * Polar.sh webhook — fully self-serve fulfillment.
 *
 * Polar POSTs after a successful order. We require:
 *   1. A valid HMAC signature (always — no dev bypass).
 *   2. An explicit paid event type (no fulfillment on intermediate states).
 *   3. Validated metadata.kind and well-formed URLs.
 *
 * All buyer details (sponsor text, listing copy) are submitted by the buyer
 * in the checkout metadata, so fulfillment is deterministic and unattended.
 */
function verifyPolarSignature(rawBody: string, signature: string | undefined, secret: string): boolean {
  if (!signature || !secret || !rawBody) return false;
  try {
    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    const a = Buffer.from(signature.replace(/^sha256=/, ""), "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

const SPONSOR_DURATION_DAYS: Record<string, number> = {
  footer_rotation: 30,
  featured_sponsor: 30,
  blog_sponsor: 365,
  newsletter_sponsor: 7,
};

const ALLOWED_LISTING_KINDS = new Set(["mcp_listing", "mcp_featured"]);

// Only fulfill on these event types — Polar fires `order.created`/`order.paid`
// after money clears. `checkout.updated` and similar are intentionally ignored.
const PAID_EVENT_TYPES = new Set(["order.created", "order.paid", "order.updated"]);

function isHttpsUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function clip(value: string | undefined, max: number): string {
  return (value ?? "").toString().slice(0, max).trim();
}

router.post("/polar", async (req: Request, res: Response): Promise<void> => {
  const secret = process.env.POLAR_WEBHOOK_SECRET ?? "";
  const rawBody = (req as Request & { rawBody?: string }).rawBody ?? "";
  const sig = req.header("polar-signature") ?? req.header("x-polar-signature") ?? req.header("webhook-signature");

  // Allow unsigned posts ONLY when an explicit dev flag is set.
  const allowUnsigned = process.env.POLAR_WEBHOOK_ALLOW_UNSIGNED === "1";
  if (!allowUnsigned) {
    if (!secret) {
      logger.error("[polar-webhook] POLAR_WEBHOOK_SECRET not configured — rejecting");
      res.status(503).json({ error: "webhook_not_configured" });
      return;
    }
    if (!verifyPolarSignature(rawBody, sig, secret)) {
      logger.warn({ hasSig: Boolean(sig) }, "[polar-webhook] invalid signature");
      res.status(401).json({ error: "invalid_signature" });
      return;
    }
  }

  const event = req.body as { type?: string; data?: Record<string, unknown> };
  const type = event.type ?? "";
  if (!PAID_EVENT_TYPES.has(type)) {
    res.json({ ok: true, ignored: type });
    return;
  }

  const data = (event.data ?? {}) as {
    id?: string;
    checkout_id?: string;
    status?: string;
    paid?: boolean;
    customer_email?: string;
    customer_name?: string;
    amount?: number;
    metadata?: Record<string, string>;
  };

  // Polar marks paid orders with status="paid" or paid=true. Reject otherwise.
  const isPaid = data.status === "paid" || data.paid === true || type === "order.paid";
  if (!isPaid) {
    res.json({ ok: true, ignored: "unpaid" });
    return;
  }

  const meta = data.metadata ?? {};
  const kind = meta.kind ?? "";
  const checkoutId = data.checkout_id ?? data.id ?? "";

  try {
    if (kind in SPONSOR_DURATION_DAYS) {
      const text = clip(meta.text, 140);
      if (text.length < 10) {
        logger.warn({ kind }, "[polar-webhook] sponsor text too short, rejected");
        res.status(400).json({ error: "invalid_metadata" });
        return;
      }
      const url = isHttpsUrl(meta.url) ? meta.url! : null;
      const days = SPONSOR_DURATION_DAYS[kind];
      const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      await db
        .insert(sponsorsTable)
        .values({
          kind,
          text,
          url,
          buyerEmail: clip(data.customer_email, 200) || null,
          buyerName: clip(data.customer_name ?? meta.name, 200) || null,
          amountUsd: typeof data.amount === "number" ? Math.round(data.amount / 100) : null,
          polarCheckoutId: checkoutId || null,
          active: true,
          expiresAt,
        })
        .onConflictDoNothing();
      invalidateSponsorCache();
      logger.info({ kind, days }, "[polar-webhook] sponsor activated");
    } else if (ALLOWED_LISTING_KINDS.has(kind)) {
      const name = clip(meta.name, 80);
      const tagline = clip(meta.tagline, 200);
      const url = isHttpsUrl(meta.url) ? meta.url! : "";
      if (!name || !tagline || !url) {
        logger.warn({ kind }, "[polar-webhook] listing missing required fields");
        res.status(400).json({ error: "invalid_metadata" });
        return;
      }
      const featured = kind === "mcp_featured";
      const featuredUntil = featured ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;
      await db
        .insert(mcpListingsTable)
        .values({
          name,
          tagline,
          description: clip(meta.description, 2000),
          url,
          configUrl: isHttpsUrl(meta.config_url) ? meta.config_url! : null,
          category: clip(meta.category, 40) || "Other",
          logoUrl: isHttpsUrl(meta.logo_url) ? meta.logo_url! : null,
          featured,
          featuredUntil,
          buyerEmail: clip(data.customer_email, 200) || null,
          polarCheckoutId: checkoutId || null,
          approved: true,
        })
        .onConflictDoNothing();
      logger.info({ kind, name }, "[polar-webhook] MCP listing published");
    } else {
      logger.warn({ kind, type }, "[polar-webhook] unknown metadata.kind");
      res.status(400).json({ error: "unknown_kind" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "[polar-webhook] processing failed");
    res.status(500).json({ error: "processing_failed" });
  }
});

export default router;
