import Stripe from "stripe";

async function getStripeClient(): Promise<Stripe> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (hostname && xReplitToken) {
    try {
      const url = new URL(`https://${hostname}/api/v2/connection`);
      url.searchParams.set("include_secrets", "true");
      url.searchParams.set("connector_names", "stripe");
      url.searchParams.set("environment", "development");

      const response = await fetch(url.toString(), {
        headers: { Accept: "application/json", "X-Replit-Token": xReplitToken },
      });
      const data = await response.json() as { items?: Array<{ settings: { secret?: string } }> };
      const secretKey = data.items?.[0]?.settings?.secret;
      if (secretKey) {
        console.log("Using Replit Stripe connector (development)");
        return new Stripe(secretKey, { apiVersion: "2025-08-27.basil" as never });
      }
    } catch (e) {
      console.warn("Connector API failed:", e);
    }
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Set STRIPE_SECRET_KEY or connect the Stripe integration.");
  console.log("Using STRIPE_SECRET_KEY env var");
  return new Stripe(key, { apiVersion: "2025-08-27.basil" as never });
}

async function createProducts() {
  const stripe = await getStripeClient();
  console.log("Creating Toolora subscription products...\n");

  const plans = [
    {
      name: "Toolora Pro",
      description: "5,000 API calls/month. OCR, DOCX, Excel, and all standard tools.",
      price: 1900,
      tier: "pro",
    },
    {
      name: "Toolora Team",
      description: "50,000 API calls/month. Team usage dashboard + SLA support.",
      price: 7900,
      tier: "team",
    },
  ];

  const results: Array<{ tier: string; productId: string; priceId: string; amount: number }> = [];

  for (const plan of plans) {
    const existing = await stripe.products.search({
      query: `name:'${plan.name}' AND active:'true'`,
    });

    if (existing.data.length > 0) {
      const product = existing.data[0];
      console.log(`  ${plan.name}: already exists (${product.id})`);
      const prices = await stripe.prices.list({ product: product.id, active: true });
      if (prices.data.length > 0) {
        const price = prices.data[0];
        console.log(`    price: ${price.id} — $${(price.unit_amount ?? 0) / 100}/month`);
        results.push({ tier: plan.tier, productId: product.id, priceId: price.id, amount: price.unit_amount ?? 0 });
      }
      continue;
    }

    const product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
      metadata: { tier: plan.tier, app: "toolora" },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.price,
      currency: "usd",
      recurring: { interval: "month" },
      metadata: { tier: plan.tier },
    });

    console.log(`  Created: ${product.name}`);
    console.log(`    product: ${product.id}`);
    console.log(`    price:   ${price.id}  ($${plan.price / 100}/month)`);
    results.push({ tier: plan.tier, productId: product.id, priceId: price.id, amount: plan.price });
  }

  console.log("\n─── Update Pricing.tsx with these price IDs ───");
  for (const r of results) {
    console.log(`  ${r.tier}: priceId = "${r.priceId}"`);
  }
  console.log("\nDone!");
  return results;
}

createProducts().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
