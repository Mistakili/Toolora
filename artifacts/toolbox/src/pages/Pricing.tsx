import { useState } from "react";
import { Check, Zap, Loader2 } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const CREDIT_PACKS = [
  { id: "starter", label: "Starter",  credits: 500,   price: 5,  perCall: "$0.010", badge: "" },
  { id: "growth",  label: "Growth",   credits: 2500,  price: 20, perCall: "$0.008", badge: "Best value" },
  { id: "scale",   label: "Scale",    credits: 10000, price: 50, perCall: "$0.005", badge: "" },
];

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    calls: 200,
    color: "border-zinc-700",
    badge: "",
    features: [
      "200 API calls / month",
      "10 MCP tools (Claude, Cursor)",
      "All standard tools",
      "PDF text extraction",
      "URL reader",
      "CSV ↔ JSON conversion",
    ],
    cta: "Get started free",
    ctaStyle: "bg-zinc-800 hover:bg-zinc-700 text-white",
    priceId: null,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    calls: 5000,
    color: "border-violet-500",
    badge: "Most popular",
    features: [
      "5,000 API calls / month",
      "Everything in Free",
      "OCR (images + scanned docs)",
      "DOCX / Word extraction",
      "Excel / spreadsheet parsing",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white",
    priceId: "price_1TGWCfDcOSNqIPi8ziL5zLJH",
  },
  {
    id: "team",
    name: "Team",
    price: 79,
    calls: 50000,
    color: "border-amber-500",
    badge: "",
    features: [
      "50,000 API calls / month",
      "Everything in Pro",
      "Team usage dashboard",
      "Shared API key management",
      "SLA support",
      "Custom limits on request",
    ],
    cta: "Upgrade to Team",
    ctaStyle: "bg-amber-600 hover:bg-amber-500 text-white",
    priceId: "price_1TGWCgDcOSNqIPi8KrXcEcCf",
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [creditLoading, setCreditLoading] = useState<string | null>(null);
  const [creditMsg, setCreditMsg] = useState<string | null>(null);

  useSEO({
    title: "Pricing — Toolora API",
    description: "Free tier with 200 calls/month. Pro at $19/month for 5,000 calls. OCR, DOCX, Excel, audio transcription, and more.",
    canonical: "https://toolora.dev/pricing",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://toolora.dev/pricing",
          name: "Toolora API Pricing",
          url: "https://toolora.dev/pricing",
          description: "API access pricing: Free (200 calls/mo), Pro $19/mo (5,000 calls), Team $79/mo (50,000 calls), Enterprise $199/mo (unlimited).",
          publisher: { "@type": "Organization", name: "Toolora", url: "https://toolora.dev" },
        },
        {
          "@type": "ItemList",
          name: "Toolora API Pricing Plans",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@type": "Offer",
                name: "Free",
                description: "200 API calls per month — no credit card required.",
                price: "0",
                priceCurrency: "USD",
                seller: { "@type": "Organization", name: "Toolora" },
              },
            },
            {
              "@type": "ListItem",
              position: 2,
              item: {
                "@type": "Offer",
                name: "Pro",
                description: "5,000 API calls per month.",
                price: "19",
                priceCurrency: "USD",
                priceSpecification: { "@type": "UnitPriceSpecification", price: "19", priceCurrency: "USD", billingDuration: "P1M" },
                seller: { "@type": "Organization", name: "Toolora" },
              },
            },
            {
              "@type": "ListItem",
              position: 3,
              item: {
                "@type": "Offer",
                name: "Team",
                description: "50,000 API calls per month.",
                price: "79",
                priceCurrency: "USD",
                priceSpecification: { "@type": "UnitPriceSpecification", price: "79", priceCurrency: "USD", billingDuration: "P1M" },
                seller: { "@type": "Organization", name: "Toolora" },
              },
            },
            {
              "@type": "ListItem",
              position: 4,
              item: {
                "@type": "Offer",
                name: "Enterprise",
                description: "Unlimited API calls, priority support, invoice billing.",
                price: "199",
                priceCurrency: "USD",
                priceSpecification: { "@type": "UnitPriceSpecification", price: "199", priceCurrency: "USD", billingDuration: "P1M" },
                seller: { "@type": "Organization", name: "Toolora" },
              },
            },
          ],
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://toolora.dev" },
            { "@type": "ListItem", position: 2, name: "Pricing", item: "https://toolora.dev/pricing" },
          ],
        },
      ],
    },
  });

  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
  const params = new URLSearchParams(window.location.search);
  const justSucceeded = params.get("success") === "1";
  const justCanceled = params.get("canceled") === "1";

  async function openPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch(`${BASE}/api/stripe/portal`, { method: "POST", credentials: "include" });
      if (res.status === 401) { window.location.href = `${BASE}/api/login?returnTo=/pricing`; return; }
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
      else setMsg(data.error ?? "Could not open billing portal.");
    } catch { setMsg("Could not open billing portal."); }
    finally { setPortalLoading(false); }
  }

  async function handleBuyCredits(packId: string) {
    setCreditLoading(packId);
    setCreditMsg(null);
    try {
      const res = await fetch(`${BASE}/api/stripe/credits/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packId }),
      });
      if (res.status === 401) {
        window.location.href = `${BASE}/api/login?returnTo=/pricing`;
        return;
      }
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
      else setCreditMsg(data.error ?? "Something went wrong.");
    } catch {
      setCreditMsg("Could not start checkout. Try again.");
    } finally {
      setCreditLoading(null);
    }
  }

  async function handleUpgrade(priceId: string | null, tierId: string) {
    if (!priceId) {
      window.location.href = `${BASE}/api-keys`;
      return;
    }
    setLoading(tierId);
    setMsg(null);
    try {
      const res = await fetch(`${BASE}/api/stripe/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ priceId }),
      });
      if (res.status === 401) {
        window.location.href = `${BASE}/api/login?returnTo=/pricing`;
        return;
      }
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
      else setMsg(data.error ?? "Something went wrong.");
    } catch {
      setMsg("Could not start checkout. Try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Simple, transparent pricing</h1>
          <p className="text-zinc-400 text-lg">
            Start free. Upgrade when you need more calls or heavier tools.
          </p>
          <p className="text-zinc-500 text-sm mt-2">
            All plans include the free MCP server for Claude Desktop and Cursor.
          </p>
        </div>

        {/* Tiers visual */}
        <div className="relative rounded-2xl overflow-hidden mb-10 border border-zinc-800">
          <img
            src={`${import.meta.env.BASE_URL}images/pricing-tiers-visual.png`}
            alt="Toolora pricing tiers — Free to Enterprise"
            className="w-full object-cover max-h-60 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent flex items-end">
            <div className="px-8 pb-6">
              <p className="text-zinc-400 text-sm">Start at $0. Scale as your agents grow.</p>
            </div>
          </div>
        </div>

        {justSucceeded && (
          <div className="mb-6 text-center text-green-400 text-sm bg-green-900/20 border border-green-800 rounded-lg py-3 px-4">
            🎉 Subscription activated! Your new plan is live. Generate API keys below.{" "}
            <a href={`${BASE}/api-keys`} className="font-semibold underline">Go to API Keys →</a>
          </div>
        )}
        {justCanceled && (
          <div className="mb-6 text-center text-zinc-400 text-sm bg-zinc-800/40 border border-zinc-700 rounded-lg py-3 px-4">
            Checkout canceled — no charge was made.
          </div>
        )}
        {msg && (
          <div className="mb-6 text-center text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg py-3 px-4">
            {msg}
          </div>
        )}
        <div className="mb-6 text-right">
          <button
            onClick={openPortal}
            disabled={portalLoading}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline"
          >
            {portalLoading ? "Opening…" : "Manage existing subscription →"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border-2 ${tier.color} bg-zinc-900 p-6 flex flex-col`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">{tier.name}</h2>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-zinc-400 mb-1">/month</span>
                </div>
                <p className="text-zinc-500 text-sm mt-1">
                  {tier.calls.toLocaleString()} API calls / month
                </p>
              </div>

              <ul className="space-y-2 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(tier.priceId, tier.id)}
                disabled={loading === tier.id}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${tier.ctaStyle} disabled:opacity-60`}
              >
                {loading === tier.id ? "Loading…" : tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* API Credits — pay-as-you-go */}
        <div id="credits" className="mt-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-3">
              <Zap className="h-3.5 w-3.5" />
              API Credits — Pay Once, Never Expire
            </div>
            <h2 className="text-2xl font-bold mb-2">Need calls beyond your monthly limit?</h2>
            <p className="text-zinc-400">
              Buy a credit pack. Credits roll over forever and are used automatically when you hit your subscription limit.
            </p>
          </div>

          {creditMsg && (
            <div className="mb-4 text-center text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg py-3 px-4">
              {creditMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CREDIT_PACKS.map((pack) => (
              <div key={pack.id} className={`relative rounded-2xl border-2 bg-zinc-900 p-6 flex flex-col ${pack.badge ? "border-violet-500" : "border-zinc-700"}`}>
                {pack.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {pack.badge}
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">{pack.label}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">${pack.price}</span>
                    <span className="text-zinc-400 mb-1">one-time</span>
                  </div>
                  <p className="text-zinc-500 text-sm mt-1">
                    {pack.credits.toLocaleString()} API calls · {pack.perCall}/call
                  </p>
                </div>
                <ul className="space-y-1.5 mb-6 flex-1 text-sm text-zinc-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" />Credits never expire</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" />Works with any plan</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" />Auto-used when limit hit</li>
                </ul>
                <button
                  onClick={() => handleBuyCredits(pack.id)}
                  disabled={creditLoading === pack.id}
                  className="w-full py-2.5 rounded-lg font-semibold text-sm transition-colors bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {creditLoading === pack.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {creditLoading === pack.id ? "Loading…" : `Buy ${pack.credits.toLocaleString()} credits`}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-zinc-800 pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-zinc-400">
          <div>
            <h3 className="text-white font-semibold mb-1">Free MCP server</h3>
            <p>All plans include the MCP server for Claude Desktop, Cursor, and Windsurf. No API key required for MCP tools.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">x402 payments</h3>
            <p>Pay per call with Stellar XLM or Solana USDC — no subscription needed. Use the API without an account.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Cancel anytime</h3>
            <p>No lock-in. Downgrade or cancel through your billing portal at any time. Unused calls don't roll over.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
