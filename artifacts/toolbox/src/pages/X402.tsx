import { Link } from "wouter";
import { ArrowLeft, Coins, Zap, Bot, ArrowRight, Check } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { NewsletterCapture } from "@/components/NewsletterCapture";

export default function X402() {
  useSEO({
    title: "x402 Marketplace — Pay-per-call MCP servers in USDC",
    description: "The first marketplace for MCP servers that charge per API call. Built on x402 (HTTP 402 micropayments). Server creators earn USDC, Toolora takes 10%.",
    canonical: "https://toolora.dev/x402",
  });

  return (
    <main className="relative">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[15%] w-[600px] h-[600px] rounded-full bg-yellow-500/15 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Link href="/mcp-hub" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to MCP Hub
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3.5 py-1 mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-300">Building now · Early access waitlist</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5 bg-gradient-to-br from-zinc-50 to-zinc-400 bg-clip-text text-transparent leading-[1.05]">
          The toll booth for<br />
          <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">AI agent calls</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Built on <a href="https://x402.org" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">x402</a> — the new HTTP 402 standard for AI-agent micropayments. Set a price per tool call. Agents auto-pay in USDC. You earn from every invocation. Toolora takes 10%.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Coins, title: "Per-call pricing", desc: "Set $0.001 per query, $0.10 per file conversion. Your tool, your rate card." },
            { icon: Bot, title: "Agent-native checkout", desc: "Claude, Cursor, OpenAI agents auto-pay via HTTP 402. No credit cards, no signup forms." },
            { icon: Zap, title: "Instant USDC settlement", desc: "Funds land in your Solana wallet within seconds of the call. No 30-day terms." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <f.icon className="w-6 h-6 text-yellow-400 mb-3" />
              <h3 className="font-semibold text-zinc-100 mb-1.5">{f.title}</h3>
              <p className="text-sm text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
          <h3 className="font-semibold text-zinc-100 mb-4">How it works</h3>
          <ol className="space-y-4">
            {[
              { n: 1, t: "Wrap your MCP server", d: "Add @toolora/x402-middleware. Define prices per tool. Done." },
              { n: 2, t: "List on the marketplace", d: "Free listing in the Toolora MCP Hub. Show your price card right on the detail page." },
              { n: 3, t: "Agents discover & call", d: "Claude/Cursor/agents browse the directory, install your server, and auto-pay per call." },
              { n: 4, t: "USDC lands in your wallet", d: "Toolora keeps 10% to cover infra. You keep 90%, settled per-call to your Solana address." },
            ].map((s) => (
              <li key={s.n} className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-300 flex items-center justify-center font-bold shrink-0">{s.n}</div>
                <div>
                  <div className="font-semibold text-zinc-100 mb-0.5">{s.t}</div>
                  <p className="text-sm text-zinc-400">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-10">
          <h3 className="font-semibold text-zinc-100 mb-3">Built for the agent economy</h3>
          <ul className="space-y-2 text-sm text-zinc-300">
            {[
              "Anthropic and OpenAI both ship agent runtimes that natively spend money",
              "Stripe announced AI-native billing in 2026; x402 is the open alternative",
              "Toolora is the only MCP directory wired for crypto-first, no-merchant-account payments",
              "First mover advantage: most directories don't even have a payment layer",
            ].map((b) => (
              <li key={b} className="flex gap-2.5"><Check className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" /><span>{b}</span></li>
            ))}
          </ul>
        </div>

        <NewsletterCapture source="x402-waitlist" />

        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <Link href="/host" className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition">
            <h3 className="font-semibold text-zinc-100 mb-1.5">Hosted MCP servers</h3>
            <p className="text-sm text-zinc-400 mb-3">Skip the laptop. Run any server on Toolora.</p>
            <span className="text-xs text-yellow-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">See the platform <ArrowRight className="w-3 h-3" /></span>
          </Link>
          <Link href="/mcp-hub" className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition">
            <h3 className="font-semibold text-zinc-100 mb-1.5">Browse 340+ servers</h3>
            <p className="text-sm text-zinc-400 mb-3">See what's already in the directory today.</p>
            <span className="text-xs text-yellow-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">Open directory <ArrowRight className="w-3 h-3" /></span>
          </Link>
        </div>
      </div>
    </main>
  );
}
