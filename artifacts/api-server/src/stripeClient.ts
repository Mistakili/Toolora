// Stripe client using Replit Connector v2 API
// Do NOT cache the client — tokens expire. Call getUncachableStripeClient() fresh each time.
import Stripe from "stripe";
import { StripeSync } from "stripe-replit-sync";

async function getCredentials(): Promise<{ publishableKey: string; secretKey: string }> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (hostname && xReplitToken) {
    try {
      const isProduction = process.env.REPLIT_DEPLOYMENT === "1";
      const targetEnvironment = isProduction ? "production" : "development";

      const url = new URL(`https://${hostname}/api/v2/connection`);
      url.searchParams.set("include_secrets", "true");
      url.searchParams.set("connector_names", "stripe");
      url.searchParams.set("environment", targetEnvironment);

      const response = await fetch(url.toString(), {
        headers: { Accept: "application/json", "X-Replit-Token": xReplitToken },
      });

      const data = await response.json() as { items?: Array<{ settings: { publishable?: string; secret?: string } }> };
      const conn = data.items?.[0];

      if (conn?.settings?.publishable && conn?.settings?.secret) {
        return { publishableKey: conn.settings.publishable, secretKey: conn.settings.secret };
      }
    } catch {}
  }

  // Fallback to env vars
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY ?? "";
  if (secretKey) return { publishableKey, secretKey };

  throw new Error("Stripe not configured. Connect the Stripe integration or set STRIPE_SECRET_KEY.");
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await getCredentials();
  return new Stripe(secretKey, { apiVersion: "2025-08-27.basil" as never });
}

export async function getStripePublishableKey(): Promise<string> {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}

export async function getStripeSecretKey(): Promise<string> {
  const { secretKey } = await getCredentials();
  return secretKey;
}

let _stripeSync: StripeSync | null = null;

export async function getStripeSync(): Promise<StripeSync> {
  if (_stripeSync) return _stripeSync;
  const stripeSecretKey = await getStripeSecretKey();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL required for Stripe sync.");
  _stripeSync = new StripeSync({
    poolConfig: { connectionString: databaseUrl, max: 2 },
    stripeSecretKey,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  });
  return _stripeSync;
}
