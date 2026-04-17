import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { CryptoCheckout } from "@/components/shared/CryptoCheckout";

const STATS = [
  { value: "1,400+", label: "MCP clients connected" },
  { value: "500+", label: "Tool calls per day" },
  { value: "108", label: "SEO blog posts" },
  { value: "50k+", label: "Monthly footer impressions" },
];

const SLOTS = [
  { kind: "footer_rotation", name: "Footer Rotation", price: "299 USDC / 30 days", desc: "Your one-line plug rotated into every MCP tool response. ~50,000 impressions/mo across Claude, Cursor, ChatGPT users." },
  { kind: "featured_sponsor", name: "Featured Sponsor", price: "999 USDC / 30 days", desc: "Top of every MCP tool response. ~150,000 impressions/mo. Limited to 1 brand at a time." },
  { kind: "blog_sponsor", name: "Blog Sponsor", price: "199 USDC / year", desc: "Native sponsored card inside one of our top-traffic blog posts. Permanent placement, evergreen SEO." },
  { kind: "newsletter_sponsor", name: "Newsletter Sponsor", price: "149 USDC / issue", desc: "Single dedicated link in our weekly digest to 1,400+ MCP devs and AI agent builders." },
];

function SlotPanel({ slot }: { slot: typeof SLOTS[number] }) {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const ready = text.length > 10 && url.startsWith("http") && email.includes("@");

  if (showCheckout) {
    return (
      <CryptoCheckout
        kind={slot.kind}
        metadata={{ text, url, name: email }}
        buyerEmail={email}
      />
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your sponsor line (max 140 chars)"
        maxLength={140}
        className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-violet-500 outline-none"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-site.com"
          className="rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-violet-500 outline-none"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Receipt email"
          className="rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-violet-500 outline-none"
        />
      </div>
      <button
        onClick={() => setShowCheckout(true)}
        disabled={!ready}
        className={"block w-full text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition " + (ready ? "bg-violet-600 hover:bg-violet-500 text-white" : "bg-zinc-800 text-zinc-500 cursor-not-allowed")}
      >
        {ready ? "Continue to USDC payment →" : "Fill all 3 fields above"}
      </button>
    </div>
  );
}

export default function Sponsor() {
  useSEO({
    title: "Sponsor Toolora — Reach 1,400+ AI agents · Pay in USDC",
    description: "Self-serve sponsorship in the Toolora MCP server, blog, and newsletter. Pay in USDC on Solana — instant settlement, no merchant accounts, no chargebacks.",
    canonical: "https://toolora.dev/sponsor",
  });

  const [openSlot, setOpenSlot] = useState<string | null>(null);

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">Sponsor Toolora</h1>
      <p className="text-lg text-zinc-400 mb-2">
        Native, tasteful placements in the AI agent workflow.
      </p>
      <p className="text-sm text-violet-400 mb-12">
        Self-serve via USDC on Solana. Pay → tx confirms in &lt;1s → your placement is live. No emails, no review, no chargebacks.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="text-2xl font-bold text-violet-400">{s.value}</div>
            <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-zinc-100 mb-6">Sponsorship slots</h2>
      <div className="space-y-4 mb-12">
        {SLOTS.map((slot) => (
          <div key={slot.name} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xl font-semibold text-zinc-100">{slot.name}</h3>
              <span className="text-violet-400 font-mono text-sm">{slot.price}</span>
            </div>
            <p className="text-zinc-400 text-sm">{slot.desc}</p>
            <button
              onClick={() => setOpenSlot(openSlot === slot.kind ? null : slot.kind)}
              className="mt-3 text-sm text-violet-400 hover:text-violet-300"
            >
              {openSlot === slot.kind ? "Cancel" : "Buy this slot →"}
            </button>
            {openSlot === slot.kind && <SlotPanel slot={slot} />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-sm text-zinc-400 space-y-3">
        <div>
          <strong className="text-zinc-200">No crypto?</strong> We can also accept payment via Wise, Payoneer, or Paystack (cards, including Naira and global cards). Email <a href="mailto:support@toolora.dev" className="text-violet-400 hover:underline">support@toolora.dev</a> for an invoice.
        </div>
        <div>
          <strong className="text-zinc-200">Need a custom deal?</strong> Annual rates, exclusivity, custom placements — same email.
        </div>
      </div>
    </main>
  );
}
