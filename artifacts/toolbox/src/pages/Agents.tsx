import { Link } from "wouter";
import { ArrowLeft, Bot, Code2, Zap, Database } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function Agents() {
  useSEO({
    title: "Agent-readable MCP directory — Toolora",
    description: "Programmatic access to 340+ MCP servers. JSON feed sorted by quality signals. Free, no auth, CORS-enabled.",
    canonical: "https://toolora.dev/agents",
  });

  const sample = `{
  "$schema": "https://toolora.dev/schemas/mcp-directory-v1.json",
  "version": "1.0",
  "generated_at": "2026-04-18T00:00:00.000Z",
  "total": 342,
  "sort": "quality",
  "servers": [
    {
      "id": "abc...",
      "slug": "playwright-mcp",
      "name": "Playwright MCP",
      "tagline": "Browser automation for AI agents",
      "category": "Developer Tools",
      "featured": true,
      "project_url": "https://github.com/...",
      "config_url": "https://...",
      "detail_url": "https://toolora.dev/mcp-hub/server/playwright-mcp",
      "install_url": "https://toolora.dev/mcp-hub/server/playwright-mcp#install",
      "installs_30d": 412,
      "listed_at": "2026-03-12T00:00:00.000Z"
    }
  ]
}`;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/mcp-hub" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to MCP Hub
      </Link>

      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 mb-5">
        <Bot className="w-3.5 h-3.5 text-cyan-300" />
        <span className="text-[11px] uppercase tracking-widest font-semibold text-cyan-300">For AI agents</span>
      </div>

      <h1 className="text-4xl font-bold text-zinc-100 mb-4 tracking-tight">The MCP directory<br />agents can read.</h1>
      <p className="text-lg text-zinc-400 leading-relaxed mb-10">
        One JSON endpoint. 340+ MCP servers. Sorted by install count, featured status, and recency — so an agent can pick the right server without scraping HTML. Free, no auth, CORS-enabled, cached at the edge.
      </p>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="text-sm font-mono text-zinc-300">GET /api/directory/agents.json</div>
          <a href="/api/directory/agents.json" target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:underline">Try it →</a>
        </div>
        <p className="text-xs text-zinc-500 mb-3">Query params: <code className="text-zinc-300">?sort=quality</code> (default) or <code className="text-zinc-300">?sort=recent</code>.</p>
        <pre className="text-[11px] text-zinc-300 font-mono overflow-x-auto bg-zinc-950 border border-zinc-800 rounded-lg p-4 leading-relaxed">{sample}</pre>
      </div>

      <h2 className="text-lg font-semibold text-zinc-100 mb-4">Why this exists</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {[
          { icon: Bot, title: "Agents discover servers", desc: "Most directories assume a human is browsing. Agents need a stable JSON contract — that's what this is." },
          { icon: Zap, title: "Quality-ranked", desc: "Sorted by featured status, then 30-day install count, then recency. New servers don't get buried." },
          { icon: Code2, title: "Stable schema", desc: "v1.0 contract. Versioned $schema URL. Backward-compatible changes only." },
          { icon: Database, title: "Free + CORS-enabled", desc: "No API key, no rate limit beyond fair use. 5-minute edge cache." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <f.icon className="w-5 h-5 text-cyan-400 mb-2.5" />
            <h3 className="font-semibold text-zinc-100 mb-1 text-sm">{f.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-zinc-100 mb-4">For server authors</h2>
      <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/30 to-zinc-900/40 p-6 mb-10">
        <p className="text-sm text-zinc-300 leading-relaxed mb-3">
          Every install we record contributes to your <code className="text-violet-300 bg-zinc-950 px-1.5 py-0.5 rounded text-xs">installs_30d</code> count, which lifts you up the agent feed. Add the README badge to capture install events from GitHub readers too.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/submit-mcp" className="inline-flex rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 text-sm font-semibold">List your server</Link>
          <Link href="/mcp-hub" className="inline-flex rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 px-4 py-2 text-sm font-medium">Browse the directory</Link>
        </div>
      </div>

      <p className="text-xs text-zinc-500">
        Want a different sort order, filter, or webhook subscription? <a href="mailto:hello@toolora.dev" className="text-violet-400 hover:underline">Tell us what you need.</a>
      </p>
    </main>
  );
}
