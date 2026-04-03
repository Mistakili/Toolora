import { Router, type IRouter, type Request, type Response } from "express";
import { db, tooloraUsersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { getUncachableStripeClient } from "../stripeClient";

// Credit packs: name → { credits, price in cents }
export const CREDIT_PACKS = [
  { id: "starter",  label: "Starter",  credits: 500,   priceCents: 500,   description: "$5 — 500 API calls" },
  { id: "growth",   label: "Growth",   credits: 2500,  priceCents: 2000,  description: "$20 — 2,500 API calls" },
  { id: "scale",    label: "Scale",    credits: 10000, priceCents: 5000,  description: "$50 — 10,000 API calls" },
] as const;

export type CreditPackId = typeof CREDIT_PACKS[number]["id"];

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): boolean {
  if (!req.isAuthenticated?.() || !req.user) {
    res.status(401).json({ error: "Sign in required." });
    return false;
  }
  return true;
}

async function upsertUser(email: string): Promise<{ id: string; stripeCustomerId: string | null; tier: string }> {
  const [existing] = await db
    .select({ id: tooloraUsersTable.id, stripeCustomerId: tooloraUsersTable.stripeCustomerId, tier: tooloraUsersTable.tier })
    .from(tooloraUsersTable)
    .where(eq(tooloraUsersTable.email, email));

  if (existing) return existing;

  const [row] = await db
    .insert(tooloraUsersTable)
    .values({ email, tier: "free" })
    .returning({ id: tooloraUsersTable.id, stripeCustomerId: tooloraUsersTable.stripeCustomerId, tier: tooloraUsersTable.tier });
  return row;
}

// GET /api/stripe/plans — public: list products/prices from Stripe DB
router.get("/plans", async (_req: Request, res: Response) => {
  try {
    const stripe = await getUncachableStripeClient();
    const products = await stripe.products.list({ active: true, expand: ["data.default_price"] });
    res.json({ plans: products.data });
  } catch {
    res.status(503).json({ error: "Stripe not configured yet." });
  }
});

// POST /api/stripe/checkout — create Stripe Checkout session
router.post("/checkout", async (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;
  const { priceId, returnPath } = req.body as { priceId?: string; returnPath?: string };
  if (!priceId) { res.status(400).json({ error: "priceId required." }); return; }

  // Validate returnPath is a safe relative path
  const safePath = returnPath && /^\/[a-zA-Z0-9\-_/?=&]*$/.test(returnPath) ? returnPath : "/pricing";

  try {
    const email = req.user!.email;
    const user = await upsertUser(email);
    const stripe = await getUncachableStripeClient();

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email, metadata: { userId: user.id } });
      await db.update(tooloraUsersTable).set({ stripeCustomerId: customer.id }).where(eq(tooloraUsersTable.id, user.id));
      customerId = customer.id;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${baseUrl}${safePath}${safePath.includes("?") ? "&" : "?"}success=1`,
      cancel_url: `${baseUrl}${safePath}${safePath.includes("?") ? "&" : "?"}canceled=1`,
    });

    res.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Checkout failed.";
    res.status(500).json({ error: msg });
  }
});

// POST /api/stripe/portal — customer portal for managing subscription
router.post("/portal", async (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;

  try {
    const email = req.user!.email;
    const user = await upsertUser(email);
    if (!user.stripeCustomerId) { res.status(400).json({ error: "No subscription found." }); return; }

    const stripe = await getUncachableStripeClient();
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/pricing`,
    });

    res.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Portal unavailable.";
    res.status(500).json({ error: msg });
  }
});

// GET /api/stripe/credits/packs — list available credit packs
router.get("/credits/packs", (_req: Request, res: Response) => {
  res.json({ packs: CREDIT_PACKS });
});

// POST /api/stripe/credits/checkout — buy a one-time credit pack
router.post("/credits/checkout", async (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;
  const { packId } = req.body as { packId?: string };
  const pack = CREDIT_PACKS.find(p => p.id === packId);
  if (!pack) { res.status(400).json({ error: "Invalid pack ID. Valid: starter, growth, scale." }); return; }

  try {
    const email = req.user!.email;
    const user = await upsertUser(email);
    const stripe = await getUncachableStripeClient();

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email, metadata: { userId: user.id } });
      await db.update(tooloraUsersTable).set({ stripeCustomerId: customer.id }).where(eq(tooloraUsersTable.id, user.id));
      customerId = customer.id;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: pack.priceCents,
          product_data: {
            name: `Toolora API Credits — ${pack.label}`,
            description: `${pack.credits.toLocaleString()} API calls. Never expire. Use with any Toolora API endpoint.`,
          },
        },
        quantity: 1,
      }],
      metadata: { userId: user.id, credits: String(pack.credits), packId: pack.id },
      success_url: `${baseUrl}/api-keys?credits=added`,
      cancel_url: `${baseUrl}/pricing?canceled=1`,
    });

    res.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Checkout failed.";
    res.status(500).json({ error: msg });
  }
});

// GET /api/stripe/credits/balance — get current user's credit balance
router.get("/credits/balance", async (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;
  try {
    const email = req.user!.email;
    const [user] = await db
      .select({ creditsBalance: tooloraUsersTable.creditsBalance })
      .from(tooloraUsersTable)
      .where(eq(tooloraUsersTable.email, email));
    res.json({ creditsBalance: user?.creditsBalance ?? 0 });
  } catch {
    res.status(500).json({ error: "Failed to fetch balance." });
  }
});

// GET /api/stripe/subscription — current user's subscription status
router.get("/subscription", async (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;

  try {
    const email = req.user!.email;
    const [user] = await db
      .select({ tier: tooloraUsersTable.tier, stripeSubscriptionId: tooloraUsersTable.stripeSubscriptionId })
      .from(tooloraUsersTable)
      .where(eq(tooloraUsersTable.email, email));

    res.json({ tier: user?.tier ?? "free", subscriptionId: user?.stripeSubscriptionId ?? null });
  } catch {
    res.status(500).json({ error: "Failed to fetch subscription." });
  }
});

export default router;
