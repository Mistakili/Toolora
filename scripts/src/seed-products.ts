import Stripe from "stripe";

async function getStripeClient(): Promise<Stripe> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  if (hostname) {
    try {
      const identity = process.env.REPL_IDENTITY ?? "";
      const url = `https://${hostname}/api/v1/connectors/stripe/secret_key`;
      const resp = await fetch(url, { headers: { Authorization: `Bearer ${identity}` } });
      if (resp.ok) {
        const data = await resp.json() as { value?: string };
        if (data.value) return new Stripe(data.value, { apiVersion: "2025-02-24.acacia" });
      }
    } catch {}
  }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Set STRIPE_SECRET_KEY or connect the Stripe integration.");
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

async function createProducts() {
  const stripe = await getStripeClient();
  console.log("Creating Toolora subscription products...");

  const plans = [
    { name: "Toolora Pro", description: "5,000 API calls/month. OCR, DOCX, Excel, and all standard tools.", price: 1900, tier: "pro" },
    { name: "Toolora Team", description: "50,000 API calls/month. Team usage dashboard + SLA support.", price: 7900, tier: "team" },
  ];

  for (const plan of plans) {
    const existing = await stripe.products.search({ query: `name:'${plan.name}' AND active:'true'` });
    if (existing.data.length > 0) {
      console.log(`  ${plan.name}: already exists (${existing.data[0].id})`);
      const prices = await stripe.prices.list({ product: existing.data[0].id, active: true });
      if (prices.data.length > 0) console.log(`    price: ${prices.data[0].id} — $${plan.price / 100}/month`);
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

    console.log(`  Created: ${product.name} (${product.id}) → $${plan.price / 100}/month (${price.id})`);
  }

  console.log("\nDone! Webhooks will sync these to the database automatically.");
  console.log("Add the price IDs above to your Pricing.tsx component's priceId fields.");
}

createProducts().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
