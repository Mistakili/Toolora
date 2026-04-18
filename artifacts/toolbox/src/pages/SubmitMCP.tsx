import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { CryptoCheckout } from "@/components/shared/CryptoCheckout";

const CATEGORIES = ["Productivity", "Developer Tools", "Data", "AI/LLM", "Marketing", "Finance", "Other"];

// Normalize a URL the user typed: trim whitespace; if it has a dot and no scheme, prepend https://
function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // bare domain like "acme.dev" or "acme.dev/mcp" → assume https
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(trimmed)) return "https://" + trimmed;
  return trimmed;
}

function isValidUrl(s: string): boolean {
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Build a map of human errors per field. URL fields are normalized first so
  // "acme.dev" works the same as "https://acme.dev".
  const normalizedUrl = normalizeUrl(form.url);
  const normalizedConfig = normalizeUrl(form.config_url);
  const normalizedLogo = normalizeUrl(form.logo_url);
  const errors: Record<string, string> = {};
  if (!form.name.trim()) errors.name = "Required";
  if (!form.tagline.trim()) errors.tagline = "Required";
  if (!form.url.trim()) errors.url = "Required";
  else if (!isValidUrl(normalizedUrl)) errors.url = "Enter a valid URL like https://acme.dev";
  if (form.config_url.trim() && !isValidUrl(normalizedConfig)) errors.config_url = "Must be a valid URL or leave blank";
  if (form.logo_url.trim() && !isValidUrl(normalizedLogo)) errors.logo_url = "Must be a valid URL or leave blank";
  if (!form.buyer_email.trim()) errors.buyer_email = "Required";
  else if (!isValidEmail(form.buyer_email)) errors.buyer_email = "Enter a valid email address";

  const canSubmit = Object.keys(errors).length === 0;
  const missingList = Object.entries(errors).map(([k]) => k.replace("_", " "));

  function handleContinue() {
    setSubmitAttempted(true);
    if (!canSubmit) {
      // Mark all fields touched so all errors become visible
      setTouched({ name: true, tagline: true, url: true, config_url: true, logo_url: true, buyer_email: true });
      // Scroll to first error
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        const el = document.getElementById("field-" + firstKey);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    // Auto-normalize URL fields into the form so checkout receives clean values
    setForm({
      ...form,
      url: normalizedUrl,
      config_url: normalizedConfig,
      logo_url: normalizedLogo,
    });
    setShowCheckout(true);
  }

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
              { k: "name", label: "Server name", placeholder: "Acme MCP", required: true },
              { k: "tagline", label: "One-line tagline", placeholder: "The fastest way to query Postgres from Claude", required: true },
              { k: "url", label: "Homepage URL", placeholder: "acme.dev (we'll add https:// for you)", required: true },
              { k: "config_url", label: "MCP config URL (optional)", placeholder: "acme.dev/mcp", required: false },
              { k: "logo_url", label: "Logo URL (optional)", placeholder: "acme.dev/logo.png", required: false },
              { k: "buyer_email", label: "Your email (for receipt)", placeholder: "you@acme.dev", required: true },
            ].map(({ k, label, placeholder, required }) => {
              const showErr = (touched[k] || submitAttempted) && errors[k];
              return (
                <label key={k} className="block" htmlFor={"field-" + k}>
                  <span className="text-sm text-zinc-400 mb-1 block">
                    {label}{required && <span className="text-violet-400 ml-1">*</span>}
                  </span>
                  <input
                    id={"field-" + k}
                    type={k === "buyer_email" ? "email" : "text"}
                    value={form[k as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    onBlur={() => setTouched({ ...touched, [k]: true })}
                    placeholder={placeholder}
                    aria-invalid={!!showErr}
                    aria-describedby={showErr ? "err-" + k : undefined}
                    className={"w-full rounded-lg bg-zinc-900 border px-3 py-2 text-zinc-100 outline-none transition " + (showErr ? "border-red-500/70 focus:border-red-500" : "border-zinc-800 focus:border-violet-500")}
                  />
                  {showErr && <p id={"err-" + k} className="text-xs text-red-400 mt-1">{errors[k]}</p>}
                </label>
              );
            })}
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
            onClick={handleContinue}
            className="block w-full text-center rounded-lg px-6 py-4 text-lg font-semibold transition bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30"
          >
            Continue to USDC payment →
          </button>

          {submitAttempted && !canSubmit && (
            <p className="mt-3 text-sm text-red-400 text-center">
              Please fix: {missingList.join(", ")}
            </p>
          )}

          <p className="mt-3 text-xs text-zinc-500 text-center">
            Required: name, tagline, homepage URL, email. Other fields are optional.
          </p>
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
