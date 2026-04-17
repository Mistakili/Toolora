import { useSEO } from "@/hooks/useSEO";

const CHAPTERS = [
  "What is MCP and why does it matter?",
  "Building your first MCP server (TypeScript + Express)",
  "MCP OAuth: connecting to Claude.ai web in 5 minutes",
  "Cursor MCP setup: every config option explained",
  "The 10 best MCP servers in 2026",
  "Privacy-first AI agents: design patterns",
  "x402 micropayments: how AI agents pay each other",
  "Prompt injection attacks and how to defend",
  "GDPR-compliant document processing for agents",
  "PDF to Word without uploading: the local-first stack",
];

export default function Ebook() {
  useSEO({
    title: "The MCP Cookbook — 108 essays on AI agents and MCP servers · Toolora",
    description: "Every Toolora blog post, edited and bundled. PDF + EPUB. $19 on Gumroad. Zero ops.",
    canonical: "https://toolora.dev/ebook",
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-wider text-violet-400 mb-3">Toolora Press</p>
        <h1 className="text-4xl md:text-6xl font-bold text-zinc-100 mb-4">The MCP Cookbook</h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          108 essays on Model Context Protocol, AI agents, and privacy-first tooling.
          Edited, indexed, and bundled into a single PDF + EPUB.
        </p>
      </div>

      <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-950/40 to-zinc-900/40 p-8 mb-12 text-center">
        <div className="text-5xl font-bold text-zinc-100 mb-2">$19</div>
        <p className="text-zinc-400 mb-6">One-time. Yours forever. Free updates for life.</p>
        <a
          href="https://toolora.gumroad.com/l/mcp-cookbook"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 text-lg font-semibold transition"
        >
          Buy on Gumroad →
        </a>
        <p className="text-xs text-zinc-500 mt-4">Pay with card, PayPal, or Apple Pay. No signup required.</p>
      </div>

      <h2 className="text-2xl font-semibold text-zinc-100 mb-6">What&apos;s inside</h2>
      <ul className="space-y-2 mb-12">
        {CHAPTERS.map((c, i) => (
          <li key={c} className="flex gap-3 text-zinc-400">
            <span className="text-violet-400 font-mono text-sm pt-0.5">{String(i + 1).padStart(2, "0")}</span>
            <span>{c}</span>
          </li>
        ))}
        <li className="text-zinc-500 italic pl-9">…and 98 more.</li>
      </ul>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-2">Or read everything free</h3>
        <p className="text-sm text-zinc-400 mb-4">
          All 108 posts are on the blog, free forever. The book is a convenience —
          one searchable PDF, no internet required, supports the project.
        </p>
        <a
          href="/blog"
          className="text-violet-300 hover:text-violet-200 text-sm underline-offset-2 hover:underline"
        >
          Browse the free blog →
        </a>
      </div>
    </main>
  );
}
