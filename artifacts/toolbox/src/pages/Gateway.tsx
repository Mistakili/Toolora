import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Coins, Zap, Bot, ArrowRight, Check, Github, ExternalLink, Copy, Trophy, Rocket, Code2 } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import GatewayLiveTicker from "@/components/GatewayLiveTicker";

const TRY_IT_CURL = `# Try the live demo MCP — stub-mode, no wallet required
curl -X POST https://toolora.dev/api/gateway/proxy/9f733346-228b-483e-a704-669be72c398d \\
  -H "Content-Type: application/json" \\
  -H "X-PAYMENT: stub-tryit-$(date +%s)" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"echo"}}'

# Response includes X-Toolora-Gateway-Status: settled (or failed)
# and a real ledger row in the public stats above.`;

export default function Gateway() {
  useSEO({
    title: "Toolora Gateway — Stablecoin payments rail for the agent economy",
    description:
      "Bill AI agents in USDC. List on Toolora's marketplace, enable Gateway billing, charge per call, settle on-chain the same block. 5% take rate, sub-cent unit economics, agent-native checkout via x402.",
    canonical: "https://toolora.dev/gateway",
  });

  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(TRY_IT_CURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

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
          The stablecoin payments rail<br />
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">for the agent economy</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-4 leading-relaxed">
          Bill AI agents in USDC for every MCP call. Same-block settlement, sub-cent unit
          economics, agent-native checkout via HTTP 402 + x402 — no Stripe account, no
          chargebacks, no merchant onboarding. <span className="text-zinc-300">Stripe for the agent economy, on a USDC rail.</span>
        </p>

        <p className="text-xs text-zinc-500 mb-8">
          Built for YC W26 RFS: <span className="text-zinc-400">Stablecoin payments rail for the agent economy</span>. Featured in{" "}
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

        <GatewayLiveTicker />

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-10">
          <div className="flex items-center justify-between mb-3 gap-3">
            <h3 className="font-semibold text-zinc-100">Try it now (no wallet required)</h3>
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 transition"
              aria-label="Copy curl command"
            >
              <Copy className="w-3 h-3" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 text-[11px] md:text-xs text-emerald-300 font-mono overflow-x-auto leading-relaxed">
{TRY_IT_CURL}
          </pre>
          <p className="text-xs text-zinc-500 mt-3">
            Hits the seeded demo MCP through the live gateway. Watch the ticker
            above tick up on a successful call.
          </p>
        </div>

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

        <EarningsCalculator />

        <HelloWorldSection />

        <EmbedBadgeSection />

        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-zinc-900/40 p-6 mb-6 flex items-start gap-4">
          <Trophy className="w-6 h-6 text-amber-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-zinc-100 mb-1">Compete on the Toolora Index</h3>
            <p className="text-sm text-zinc-400 mb-3">
              Top-earning gateway listings ranked publicly by USDC paid (opt-in only — your numbers stay private until
              you flip the switch). Free distribution + social proof.
            </p>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 hover:text-amber-200"
            >
              See the index <ArrowRight className="w-3 h-3" />
            </Link>
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

/**
 * "What you'd earn" calculator.
 *
 * The single highest-leverage piece of copy on this page — turns the abstract
 * "5% take rate, sub-cent unit economics" pitch into a concrete monthly USDC
 * number the visitor's CFO brain can latch onto. Pure JSX, no backend.
 */
function EarningsCalculator() {
  const [callsPerDay, setCallsPerDay] = useState(1000);
  const [pricePerCallUsd, setPricePerCallUsd] = useState(0.001);

  const numbers = useMemo(() => {
    const dailyGross = callsPerDay * pricePerCallUsd;
    const dailyOwner = dailyGross * 0.95;
    const dailyToolora = dailyGross * 0.05;
    return {
      dailyGross,
      dailyOwner,
      monthlyOwner: dailyOwner * 30,
      yearlyOwner: dailyOwner * 365,
      dailyToolora,
    };
  }, [callsPerDay, pricePerCallUsd]);

  const fmt = (n: number) => {
    if (n >= 1000) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (n >= 1) return `$${n.toFixed(2)}`;
    if (n >= 0.01) return `$${n.toFixed(4)}`;
    return `$${n.toFixed(6)}`;
  };

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-zinc-900/40 p-6 mb-6">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <h3 className="font-semibold text-zinc-100">What you'd earn</h3>
        <span className="text-[10px] uppercase tracking-wider text-emerald-300/80">95% to you · settled per-call</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="flex items-center justify-between text-xs text-zinc-300 mb-2">
            <span>Calls per day</span>
            <span className="font-mono text-zinc-100 tabular-nums">{callsPerDay.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min={10}
            max={100000}
            step={10}
            value={callsPerDay}
            onChange={(e) => setCallsPerDay(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500"
            aria-label="Calls per day"
          />
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
            <span>10</span>
            <span>100k</span>
          </div>
        </div>
        <div>
          <label className="flex items-center justify-between text-xs text-zinc-300 mb-2">
            <span>Price per call (USD)</span>
            <span className="font-mono text-zinc-100 tabular-nums">${pricePerCallUsd.toFixed(4)}</span>
          </label>
          <input
            type="range"
            min={0.0001}
            max={0.5}
            step={0.0001}
            value={pricePerCallUsd}
            onChange={(e) => setPricePerCallUsd(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
            aria-label="Price per call"
          />
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
            <span>$0.0001</span>
            <span>$0.50</span>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-zinc-950 p-4">
          <div className="text-xs text-zinc-500 mb-1">Daily</div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">{fmt(numbers.dailyOwner)}</div>
          <div className="text-[10px] text-zinc-500 mt-1">{callsPerDay.toLocaleString()} calls × {fmt(pricePerCallUsd)} × 95%</div>
        </div>
        <div className="rounded-lg bg-zinc-950 p-4 border border-emerald-500/30">
          <div className="text-xs text-zinc-500 mb-1">Monthly</div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">{fmt(numbers.monthlyOwner)}</div>
          <div className="text-[10px] text-zinc-500 mt-1">USDC, settled to your wallet</div>
        </div>
        <div className="rounded-lg bg-zinc-950 p-4">
          <div className="text-xs text-zinc-500 mb-1">Yearly</div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">{fmt(numbers.yearlyOwner)}</div>
          <div className="text-[10px] text-zinc-500 mt-1">no Stripe, no chargebacks</div>
        </div>
      </div>

      <p className="text-[11px] text-zinc-600 mt-3">
        Toolora keeps 5% (~{fmt(numbers.dailyToolora)}/day at this volume). Sub-cent calls are economically
        impossible on Stripe — the flat $0.30 fee alone would be a 30,000% markup on a $0.001 call.
      </p>
    </div>
  );
}

/**
 * Hello World MCP — the activation-friction killer.
 *
 * Most "build an MCP" tutorials assume you already have one. This section
 * gives the visitor the smallest possible working example pre-wired for
 * gateway billing: clone, run, list, get paid.
 */
function HelloWorldSection() {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-zinc-900/40 p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <Rocket className="w-6 h-6 text-cyan-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-zinc-100 mb-1">Don't have an MCP yet? Ship one in 5 minutes.</h3>
          <p className="text-sm text-zinc-400">
            We maintain a self-contained <code className="text-cyan-300 text-xs">hello-world-mcp</code> example —
            ~100 lines of Node.js, zero dependencies, one tool. Fork it, point Toolora at it, and you're billing
            agents in USDC.
          </p>
        </div>
      </div>

      <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 text-[11px] md:text-xs text-cyan-300 font-mono overflow-x-auto leading-relaxed mb-3">
{`# 1. Clone & run locally
git clone https://github.com/wesleyolis/toolora.git
cd toolora/examples/hello-world-mcp
node server.js
# → hello-world-mcp listening on http://localhost:8787/mcp

# 2. Deploy anywhere with a public HTTPS URL (Replit, Render, Fly, your VPS)

# 3. List on Toolora and point Gateway billing at it`}
      </pre>

      <div className="flex items-center gap-3 flex-wrap">
        <a
          href="https://github.com/wesleyolis/toolora/tree/main/examples/hello-world-mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-300 hover:text-cyan-200"
        >
          <Github className="w-3.5 h-3.5" /> View source
        </a>
        <Link
          href="/submit-mcp"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300 hover:text-emerald-200"
        >
          List your deployed copy <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

/**
 * Embed-badge marketing — shows owners they get a free distribution surface
 * in their MCP's GitHub README. The actual snippet (with their listing id)
 * appears in the dashboard once they enable embed_enabled.
 */
function EmbedBadgeSection() {
  return (
    <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/20 to-zinc-900/40 p-6 mb-6">
      <div className="flex items-start gap-3 mb-3">
        <Code2 className="w-6 h-6 text-violet-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-zinc-100 mb-1">Free distribution: drop a live badge in your README</h3>
          <p className="text-sm text-zinc-400">
            Every owner gets an iframe snippet that ticks up live as agents pay them. Pin it on your GitHub
            README, your docs site, your Stripe-replacement comparison post — wherever your potential customers
            already are.
          </p>
        </div>
      </div>

      <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 text-[11px] md:text-xs text-violet-300 font-mono overflow-x-auto leading-relaxed">
{`<iframe src="https://toolora.dev/embed/gateway-badge/<your-listing-id>"
        width="320" height="120" frameborder="0"
        style="border:0; border-radius:12px;">
</iframe>`}
      </pre>

      <p className="text-[11px] text-zinc-600 mt-3">
        Aggregate-only (call count + USDC paid). No caller addresses, no per-tool detail. Your real listing id
        + working snippet appears in your dashboard as soon as you enable "Embeddable live badge" in Gateway billing.
      </p>
    </div>
  );
}
