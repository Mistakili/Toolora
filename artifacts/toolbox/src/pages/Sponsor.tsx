import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";

const STATS = [
  { value: "1,400+", label: "MCP clients connected" },
  { value: "500+", label: "Tool calls per day" },
  { value: "108", label: "SEO blog posts" },
  { value: "50k+", label: "Monthly footer impressions" },
];

const POLAR_URLS: Record<string, string> = {
  footer_rotation: (import.meta.env.VITE_POLAR_BUY_FOOTER as string | undefined) ?? "https://buy.polar.sh/REPLACE_ME_FOOTER",
  featured_sponsor: (import.meta.env.VITE_POLAR_BUY_FEATURED_SPONSOR as string | undefined) ?? "https://buy.polar.sh/REPLACE_ME_FEATURED",
  blog_sponsor: (import.meta.env.VITE_POLAR_BUY_BLOG as string | undefined) ?? "https://buy.polar.sh/REPLACE_ME_BLOG",
  newsletter_sponsor: (import.meta.env.VITE_POLAR_BUY_NEWSLETTER as string | undefined) ?? "https://buy.polar.sh/REPLACE_ME_NEWSLETTER",
};

const SLOTS = [
  { kind: "footer_rotation", name: "Footer Rotation", price: "$299/mo", desc: "Your one-line plug rotated into every MCP tool response. ~50,000 impressions/mo across Claude, Cursor, ChatGPT users." },
  { kind: "featured_sponsor", name: "Featured Sponsor", price: "$999/mo", desc: "Top of every MCP tool response. ~150,000 impressions/mo. Limited to 1 brand at a time." },
  { kind: "blog_sponsor", name: "Blog Sponsor", price: "$199/post", desc: "Native sponsored card inside one of our top-traffic blog posts. Permanent placement, evergreen SEO." },
  { kind: "newsletter_sponsor", name: "Newsletter Sponsor", price: "$149/issue", desc: "Single dedicated link in our weekly digest to 1,400+ MCP devs and AI agent builders." },
];

function SlotForm({ slot }: { slot: typeof SLOTS[number] }) {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");

  const ready = text.length > 10 && url && email;
  const params = new URLSearchParams();
  params.set("metadata[kind]", slot.kind);
  if (text) params.set("metadata[text]", text);
  if (url) params.set("metadata[url]", url);
  if (email) params.set("customer_email", email);
  const href = POLAR_URLS[slot.kind] + "?" + params.toString();

  return (
    <div className="space-y-3 mt-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your sponsor line (e.g. 'Acme — the fastest Postgres for Claude · acme.dev')"
        maxLength={120}
        className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-violet-500 outline-none"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Your URL"
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
      <a
        href={ready ? href : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={"block w-full text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition " + (ready ? "bg-violet-600 hover:bg-violet-500 text-white" : "bg-zinc-800 text-zinc-500 cursor-not-allowed")}
      >
        {ready ? "Pay & go live instantly →" : "Fill all 3 fields above"}
      </a>
    </div>
  );
}

export default function Sponsor() {
  useSEO({
    title: "Sponsor Toolora — Reach 1,400+ AI agents and developers",
    description: "Self-serve sponsorship slots in the Toolora MCP server, blog, and newsletter. Auto-published on payment. No emails, no review queue.",
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
        Fully self-serve — fill the form, pay with card or crypto, your placement is live within 60 seconds. No emails, no review.
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
              <span className="text-violet-400 font-mono">{slot.price}</span>
            </div>
            <p className="text-zinc-400 text-sm">{slot.desc}</p>
            <button
              onClick={() => setOpenSlot(openSlot === slot.kind ? null : slot.kind)}
              className="mt-3 text-sm text-violet-400 hover:text-violet-300"
            >
              {openSlot === slot.kind ? "Hide form ↑" : "Buy this slot →"}
            </button>
            {openSlot === slot.kind && <SlotForm slot={slot} />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-sm text-zinc-400">
        <strong className="text-zinc-200">Prefer a custom deal?</strong> Annual rates, exclusivity,
        custom placements — email <a href="mailto:sponsor@toolora.dev" className="text-violet-400 hover:underline">sponsor@toolora.dev</a>.
      </div>
    </main>
  );
}
