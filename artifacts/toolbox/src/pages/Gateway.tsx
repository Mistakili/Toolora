import { Link } from "wouter";
import { ArrowLeft, Coins, Zap, Bot, ArrowRight, Check, Github, ExternalLink } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function Gateway() {
  useSEO({
    title: "Toolora Gateway — Stablecoin payments rail for MCP servers",
    description:
      "Bill your AI-agent users in USDC. List on Toolora's marketplace, enable Gateway billing, charge per call, get paid the same block. 5% take rate, sub-cent unit economics, no Stripe accounts to manage.",
    canonical: "https://toolora.dev/gateway",
  });

  return (
    <main className="relative">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[15%] w-[600px] h-[600px] rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Link href="/mcp-hub" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to MCP Hub
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Live · Settled on-chain</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5 bg-gradient-to-br from-zinc-50 to-zinc-400 bg-clip-text text-transparent leading-[1.05]">
          The stablecoin payments<br />
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">rail for MCP servers</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-4 leading-relaxed">
          Bill your AI-agent users in USDC. List on Toolora's marketplace, enable Gateway billing, charge per call, get paid the same block.
          5% take rate, sub-cent unit economics, no Stripe accounts to manage. <span className="text-zinc-300">(Think: Stripe for MCP, on a USDC rail.)</span>
        </p>

        <p className="text-xs text-zinc-500 mb-10">
          As featured in{" "}
          <a
            href="https://hackernoon.com/i-added-an-mcp-server-to-my-browser-based-tool-suite-agents-found-it-immediately"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline"
          >
            HackerNoon
          </a>{" "}
          — "Agents Found It Immediately."
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: Coins,
              title: "Sub-cent per-call pricing",
              desc: "Charge $0.0001 per query, $0.10 per file conversion. USDC fees are fractions of a cent — economics that don't work on Visa work here.",
            },
            {
              icon: Bot,
              title: "Agent-native checkout",
              desc: "Claude, Cursor, OpenAI, Replit Agent auto-pay via HTTP 402 + x402. No credit cards, no signup forms, no merchant account.",
            },
            {
              icon: Zap,
              title: "Instant on-chain settlement",
              desc: "Funds land in your Solana wallet the same block as the call. No 30-day terms. No chargebacks. No Stripe payout delay.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <f.icon className="w-6 h-6 text-emerald-400 mb-3" />
              <h3 className="font-semibold text-zinc-100 mb-1.5">{f.title}</h3>
              <p className="text-sm text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
          <h3 className="font-semibold text-zinc-100 mb-4">How it works</h3>
          <ol className="space-y-4">
            {[
              { n: 1, t: "List your MCP server", d: "Submit at toolora.dev/submit-mcp. Free if your MCP is open-source on GitHub; $49 paid listing otherwise." },
              { n: 2, t: "Enable Gateway billing", d: "Open your owner dashboard, switch to the Billing tab, set price-per-call, paste your Solana payout wallet, paste your upstream MCP URL." },
              { n: 3, t: "Agents discover & call", d: "Claude / Cursor / OpenAI / Replit Agent browse the directory and call your MCP via gateway.toolora.dev/mcp/<your-id>. They auto-pay per call." },
              { n: 4, t: "USDC lands in your wallet", d: "Toolora keeps 5% to cover infra, fraud screening, and the directory surface. You keep 95%, settled per-call directly to your Solana address." },
            ].map((s) => (
              <li key={s.n} className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0">{s.n}</div>
                <div>
                  <div className="font-semibold text-zinc-100 mb-0.5">{s.t}</div>
                  <p className="text-sm text-zinc-400">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
          <h3 className="font-semibold text-zinc-100 mb-3">For the agent economy, by an agent-economy team</h3>
          <ul className="space-y-2 text-sm text-zinc-300">
            {[
              "Anthropic and OpenAI both ship agent runtimes that natively spend money — sub-cent unit economics is now table stakes",
              "x402 (HTTP 402 micropayments) is the open standard agents already use; we route it",
              "Toolora is the only MCP directory wired for crypto-first, no-merchant-account payments — first mover",
              "5% take rate vs. Stripe's 2.9% + $0.30 — but at $0.001/call, Stripe's flat fee is a 30,000% markup. Sub-cent is impossible without a stablecoin rail.",
            ].map((b) => (
              <li key={b} className="flex gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
          <h3 className="font-semibold text-zinc-100 mb-3">Integration (3 lines)</h3>
          <p className="text-xs text-zinc-400 mb-3">
            Once you've enabled billing in your dashboard, your existing MCP server doesn't change. Agents call you through the gateway URL:
          </p>
          <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 text-xs text-emerald-300 font-mono overflow-x-auto">
{`# Before
{ "url": "https://your-mcp.example.com/mcp" }

# After (you keep your server, gateway just routes + bills)
{ "url": "https://gateway.toolora.dev/mcp/<your-listing-id>" }`}
          </pre>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-10">
          <h3 className="font-semibold text-zinc-100 mb-3">Pricing (you set it)</h3>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-zinc-950 p-4">
              <div className="text-xs text-zinc-500 mb-1">Caller pays</div>
              <div className="text-2xl font-bold text-zinc-100 tabular-nums">$0.001</div>
              <div className="text-xs text-zinc-500 mt-1">per call (you choose)</div>
            </div>
            <div className="rounded-lg bg-zinc-950 p-4">
              <div className="text-xs text-zinc-500 mb-1">You earn</div>
              <div className="text-2xl font-bold text-emerald-400 tabular-nums">$0.00095</div>
              <div className="text-xs text-zinc-500 mt-1">95% — settled instantly</div>
            </div>
            <div className="rounded-lg bg-zinc-950 p-4">
              <div className="text-xs text-zinc-500 mb-1">Toolora keeps</div>
              <div className="text-2xl font-bold text-violet-400 tabular-nums">$0.00005</div>
              <div className="text-xs text-zinc-500 mt-1">5% — infra + directory</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/submit-mcp"
            className="group rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-zinc-900/40 p-6 hover:border-emerald-500/60 transition"
          >
            <h3 className="font-semibold text-zinc-100 mb-1.5">List your MCP</h3>
            <p className="text-sm text-zinc-400 mb-3">Free for open-source MCPs. Set up Gateway billing right after.</p>
            <span className="text-xs text-emerald-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Submit your server <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
          <Link href="/mcp-hub" className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition">
            <h3 className="font-semibold text-zinc-100 mb-1.5">Browse 340+ servers</h3>
            <p className="text-sm text-zinc-400 mb-3">See what's already in the directory today.</p>
            <span className="text-xs text-emerald-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Open directory <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
          <a href="https://github.com/wesleyolis/toolora" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-zinc-300">
            <Github className="w-3.5 h-3.5" /> Open source
          </a>
          <a href="https://x402.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-zinc-300">
            x402 spec <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://hackernoon.com/i-added-an-mcp-server-to-my-browser-based-tool-suite-agents-found-it-immediately"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-zinc-300"
          >
            HackerNoon coverage <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </main>
  );
}
