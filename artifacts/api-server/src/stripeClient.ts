import Stripe from "stripe";
import { StripeSync } from "stripe-replit-sync";

let _stripeSync: StripeSync | null = null;

async function getStripeSecretKey(): Promise<string> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  if (hostname) {
    try {
      const identity = process.env.REPL_IDENTITY ?? "";
      const url = `https://${hostname}/api/v1/connectors/stripe/secret_key`;
      const resp = await fetch(url, { headers: { Authorization: `Bearer ${identity}` } });
      if (resp.ok) {
        const data = await resp.json() as { value?: string };
        if (data.value) return data.value;
      }
    } catch {}
  }
  const key = process.env.STRIPE_SECRET_KEY;
  if (key) return key;
  throw new Error("Stripe not configured. Connect the Stripe integration or set STRIPE_SECRET_KEY.");
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  const secretKey = await getStripeSecretKey();
  return new Stripe(secretKey, { apiVersion: "2025-02-24.acacia" });
}

export async function getStripeSync(): Promise<StripeSync> {
  if (_stripeSync) return _stripeSync;
  const stripeSecretKey = await getStripeSecretKey();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL required for Stripe sync.");
  _stripeSync = new StripeSync({ stripeSecretKey, databaseUrl });
  return _stripeSync;
}
