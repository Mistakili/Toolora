import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { CryptoCheckout } from "@/components/shared/CryptoCheckout";

const CATEGORIES = ["Productivity", "Developer Tools", "Data", "AI/LLM", "Marketing", "Finance", "Other"];

export default function SubmitMCP() {
  useSEO({
    title: "Submit your MCP server — Toolora MCP Hub directory",
    description: "List your MCP server in the Toolora directory. 49 USDC standard, 99 USDC/mo Featured. Auto-published the moment payment confirms on Solana.",
    canonical: "https://toolora.dev/submit-mcp",
  });

  const [form, setForm] = useState({
    name: "", tagline: "", description: "", url: "", config_url: "",
    category: "Other", logo_url: "", buyer_email: "",
  });
  const [tier, setTier] = useState<"mcp_listing" | "mcp_featured">("mcp_listing");
  const [showCheckout, setShowCheckout] = useState(false);

  const canSubmit = form.name && form.tagline && form.url.startsWith("http") && form.buyer_email.includes("@");

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <p className="text-sm uppercase tracking-wider text-violet-400 mb-3">Toolora MCP Hub</p>
      <h1 className="text-4xl font-bold text-zinc-100 mb-3">List your MCP server</h1>
      <p className="text-zinc-400 mb-10">
        Reach 1,400+ AI agent developers searching for MCP servers. Pay in USDC on Solana,
        your listing auto-publishes the moment your transaction confirms — no review queue.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <button onClick={() => setTier("mcp_listing")} className={"rounded-xl border p-4 text-left transition " + (tier === "mcp_listing" ? "border-violet-500 bg-violet-950/30" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700")}>
          <div className="font-semibold text-zinc-100">Standard</div>
          <div className="text-2xl font-bold text-violet-400 my-1">49 USDC</div>
          <div className="text-xs text-zinc-500">One-time. Permanent listing.</div>
        </button>
        <button onClick={() => setTier("mcp_featured")} className={"rounded-xl border p-4 text-left transition " + (tier === "mcp_featured" ? "border-violet-500 bg-violet-950/30" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700")}>
          <div className="font-semibold text-zinc-100">Featured</div>
          <div className="text-2xl font-bold text-violet-400 my-1">99 USDC</div>
          <div className="text-xs text-zinc-500">30 days · Top of directory.</div>
        </button>
      </div>

      {!showCheckout && (
        <>
          <div className="space-y-4 mb-8">
            {[
              { k: "name", label: "Server name", placeholder: "Acme MCP" },
              { k: "tagline", label: "One-line tagline", placeholder: "The fastest way to query Postgres from Claude" },
              { k: "url", label: "Homepage URL (https://)", placeholder: "https://acme.dev" },
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

          <button
            onClick={() => setShowCheckout(true)}
            disabled={!canSubmit}
            className={"block w-full text-center rounded-lg px-6 py-4 text-lg font-semibold transition " + (canSubmit ? "bg-violet-600 hover:bg-violet-500 text-white" : "bg-zinc-800 text-zinc-500 cursor-not-allowed")}
          >
            {canSubmit ? "Continue to USDC payment →" : "Fill required fields above"}
          </button>
        </>
      )}

      {showCheckout && (
        <CryptoCheckout
          kind={tier}
          metadata={{
            name: form.name,
            tagline: form.tagline,
            description: form.description,
            url: form.url,
            config_url: form.config_url,
            category: form.category,
            logo_url: form.logo_url,
          }}
          buyerEmail={form.buyer_email}
          onFulfilled={() => {/* CryptoCheckout shows success state */}}
        />
      )}
    </main>
  );
}
