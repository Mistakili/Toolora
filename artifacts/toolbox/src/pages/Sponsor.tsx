import { useSEO } from "@/hooks/useSEO";

const SLOTS = [
  { name: "Footer Rotation", price: "$299/mo", desc: "Your one-line plug rotated into every MCP tool response. ~50,000 impressions/mo across Claude, Cursor, ChatGPT users." },
  { name: "Featured Sponsor", price: "$999/mo", desc: "Top of every MCP tool response. ~150,000 impressions/mo. Limited to 1 brand at a time." },
  { name: "Blog Sponsor", price: "$199/post", desc: "Native sponsored card inside one of our top-traffic blog posts. Permanent placement, evergreen SEO." },
  { name: "Newsletter Sponsor", price: "$149/issue", desc: "Single dedicated link in our weekly digest to 1,400+ MCP devs and AI agent builders." },
];

const STATS = [
  { value: "1,400+", label: "MCP clients connected" },
  { value: "500+", label: "Tool calls per day" },
  { value: "108", label: "SEO blog posts" },
  { value: "50k+", label: "Monthly tool footer impressions" },
];

export default function Sponsor() {
  useSEO({
    title: "Sponsor Toolora — Reach 1,400+ AI agents and developers",
    description: "Sponsorship slots in the Toolora MCP server, blog, and newsletter. Native, dev-friendly placements seen by Claude, Cursor, and ChatGPT users.",
    canonical: "https://toolora.dev/sponsor",
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">Sponsor Toolora</h1>
      <p className="text-lg text-zinc-400 mb-12">
        Native, tasteful placements in the AI agent workflow. Your tool, surfaced to the developers
        and agents using Claude, Cursor, ChatGPT, and 30+ other MCP clients.
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
            <p className="text-zinc-400">{slot.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-zinc-100 mb-6">How payment works</h2>
      <p className="text-zinc-400 mb-4">
        Pay however you like — we don&apos;t use Stripe by default for sponsorships. Pick your rail:
      </p>
      <ul className="space-y-2 text-zinc-400 mb-12 list-disc pl-6">
        <li><strong className="text-zinc-200">USDC on Solana</strong> — fastest, 0% fees. Tx confirms in &lt;1s.</li>
        <li><strong className="text-zinc-200">Wire / SEPA</strong> — for invoices and EU compliance.</li>
        <li><strong className="text-zinc-200">PayPal</strong> — for one-off blog/newsletter slots.</li>
        <li><strong className="text-zinc-200">Polar.sh</strong> — for monthly recurring (open-source, MoR).</li>
      </ul>

      <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-950/40 to-zinc-900/40 p-8 text-center">
        <h2 className="text-2xl font-semibold text-zinc-100 mb-3">Reserve a slot</h2>
        <p className="text-zinc-400 mb-6">
          First-come, first-served. We approve sponsors manually to keep the bar high.
        </p>
        <a
          href="mailto:sponsor@toolora.dev?subject=Toolora%20sponsorship%20interest"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 font-semibold transition"
        >
          Email sponsor@toolora.dev →
        </a>
      </div>
    </main>
  );
}
