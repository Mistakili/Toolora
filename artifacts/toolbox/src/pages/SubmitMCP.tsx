import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";

const POLAR_BUY_LISTING = (import.meta.env.VITE_POLAR_BUY_MCP_LISTING as string | undefined) ?? "https://buy.polar.sh/REPLACE_ME_LISTING";
const POLAR_BUY_FEATURED = (import.meta.env.VITE_POLAR_BUY_MCP_FEATURED as string | undefined) ?? "https://buy.polar.sh/REPLACE_ME_FEATURED";

const CATEGORIES = ["Productivity", "Developer Tools", "Data", "AI/LLM", "Marketing", "Finance", "Other"];

export default function SubmitMCP() {
  useSEO({
    title: "Submit your MCP server — Toolora MCP Hub directory",
    description: "List your MCP server in the Toolora directory. $49 one-time, $99/mo for Featured. Auto-published on payment.",
    canonical: "https://toolora.dev/submit-mcp",
  });

  const [form, setForm] = useState({ name: "", tagline: "", description: "", url: "", config_url: "", category: "Other", logo_url: "", buyer_email: "" });
  const [tier, setTier] = useState<"listing" | "featured">("listing");

  const checkoutUrl = tier === "listing" ? POLAR_BUY_LISTING : POLAR_BUY_FEATURED;
  const params = new URLSearchParams();
  params.set("metadata[kind]", tier === "listing" ? "mcp_listing" : "mcp_featured");
  Object.entries(form).forEach(([k, v]) => { if (v) params.set("metadata[" + k + "]", v); });
  if (form.buyer_email) params.set("customer_email", form.buyer_email);
  const buyHref = checkoutUrl + "?" + params.toString();

  const canSubmit = form.name && form.tagline && form.url && form.buyer_email;

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <p className="text-sm uppercase tracking-wider text-violet-400 mb-3">Toolora MCP Hub</p>
      <h1 className="text-4xl font-bold text-zinc-100 mb-3">List your MCP server</h1>
      <p className="text-zinc-400 mb-10">
        Reach 1,400+ AI agent developers searching for MCP servers. Pay once, your listing
        auto-publishes the moment payment confirms — no review queue, no waiting.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <button onClick={() => setTier("listing")} className={"rounded-xl border p-4 text-left transition " + (tier === "listing" ? "border-violet-500 bg-violet-950/30" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700")}>
          <div className="font-semibold text-zinc-100">Standard</div>
          <div className="text-2xl font-bold text-violet-400 my-1">$49</div>
          <div className="text-xs text-zinc-500">One-time. Permanent listing.</div>
        </button>
        <button onClick={() => setTier("featured")} className={"rounded-xl border p-4 text-left transition " + (tier === "featured" ? "border-violet-500 bg-violet-950/30" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700")}>
          <div className="font-semibold text-zinc-100">Featured</div>
          <div className="text-2xl font-bold text-violet-400 my-1">$99/mo</div>
          <div className="text-xs text-zinc-500">Top of directory + homepage card.</div>
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {[
          { k: "name", label: "Server name", placeholder: "Acme MCP" },
          { k: "tagline", label: "One-line tagline", placeholder: "The fastest way to query Postgres from Claude" },
          { k: "url", label: "Homepage URL", placeholder: "https://acme.dev" },
          { k: "config_url", label: "MCP config URL (optional)", placeholder: "https://acme.dev/mcp" },
          { k: "logo_url", label: "Logo URL (optional)", placeholder: "https://acme.dev/logo.png" },
          { k: "buyer_email", label: "Your email (for receipt)", placeholder: "you@acme.dev" },
        ].map(({ k, label, placeholder }) => (
          <label key={k} className="block">
            <span className="text-sm text-zinc-400 mb-1 block">{label}</span>
            <input
              type={k === "buyer_email" ? "email" : "text"}
              value={form[k as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              placeholder={placeholder}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100 focus:border-violet-500 outline-none"
            />
          </label>
        ))}

        <label className="block">
          <span className="text-sm text-zinc-400 mb-1 block">Category</span>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-zinc-400 mb-1 block">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="What does your MCP server do? Who is it for?"
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100 focus:border-violet-500 outline-none"
          />
        </label>
      </div>

      <a
        href={canSubmit ? buyHref : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={"block w-full text-center rounded-lg px-6 py-4 text-lg font-semibold transition " + (canSubmit ? "bg-violet-600 hover:bg-violet-500 text-white" : "bg-zinc-800 text-zinc-500 cursor-not-allowed")}
      >
        {canSubmit ? "Pay & publish instantly →" : "Fill required fields above"}
      </a>
      <p className="text-xs text-zinc-500 text-center mt-3">
        Pay with card, PayPal, or crypto via Polar. Your listing goes live within 60 seconds of payment.
      </p>
    </main>
  );
}
