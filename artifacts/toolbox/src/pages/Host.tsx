import { Link } from "wouter";
import { ArrowLeft, Server, Zap, Shield, Globe, Check, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { NewsletterCapture } from "@/components/NewsletterCapture";

export default function Host() {
  useSEO({
    title: "Host Your MCP Server — Free 1k calls/mo, $9 unlimited",
    description: "Skip the laptop. Host any open-source MCP server on Toolora with auth, rate limiting, and a public URL. Free tier + paid pro from $9/mo.",
    canonical: "https://toolora.dev/host",
  });

  return (
    <main className="relative">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-600/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Link href="/mcp-hub" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to MCP Hub
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Coming Q2 · Join the waitlist</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5 bg-gradient-to-br from-zinc-50 to-zinc-400 bg-clip-text text-transparent leading-[1.05]">
          Vercel for<br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">MCP servers</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Most MCP servers need to run on your laptop. We'll host them for you — public URL, auth, rate limiting, analytics. One-click deploy from any GitHub repo.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Globe, title: "Public URL in 30s", desc: "Pick a server from the directory, click Deploy. Get an https endpoint with valid TLS." },
            { icon: Zap, title: "Free 1k calls/month", desc: "Generous free tier for hobbyists. Upgrade to $9/mo when you need more." },
            { icon: Shield, title: "Auth + rate limits built in", desc: "Per-key throttling, OAuth, IP allowlists. Don't roll your own." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <f.icon className="w-6 h-6 text-emerald-400 mb-3" />
              <h3 className="font-semibold text-zinc-100 mb-1.5">{f.title}</h3>
              <p className="text-sm text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-10">
          <h3 className="font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" /> What you get on launch day
          </h3>
          <ul className="space-y-2.5 text-sm text-zinc-300">
            {[
              "One-click deploy of any MCP server from the Toolora directory",
              "Custom domains + automatic TLS",
              "Per-API-key rate limiting and request logs",
              "USDC payments — pay $9/mo from any Solana wallet, no credit card needed",
              "Multi-region deploys (US, EU, Asia)",
              "Public dashboard so users see uptime + latency before installing",
            ].map((b) => (
              <li key={b} className="flex gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <NewsletterCapture source="host-waitlist" />

        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <Link href="/mcp-hub" className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition">
            <h3 className="font-semibold text-zinc-100 mb-1.5">Browse the directory</h3>
            <p className="text-sm text-zinc-400 mb-3">340+ servers ready to install today.</p>
            <span className="text-xs text-emerald-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">View all servers <ArrowRight className="w-3 h-3" /></span>
          </Link>
          <Link href="/x402" className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition">
            <h3 className="font-semibold text-zinc-100 mb-1.5">Pay-per-call marketplace</h3>
            <p className="text-sm text-zinc-400 mb-3">Earn USDC from every API call to your MCP server.</p>
            <span className="text-xs text-emerald-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">Learn about x402 <ArrowRight className="w-3 h-3" /></span>
          </Link>
        </div>
      </div>
    </main>
  );
}
