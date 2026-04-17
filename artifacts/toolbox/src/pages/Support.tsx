import { useSEO } from "@/hooks/useSEO";

const SOLANA_TIP_ADDRESS = "59wUbJWMiBK737srMxPjtKFJDrcuh28Uezj9xjtMimQF";

export default function Support() {
  useSEO({
    title: "Support Toolora — Tip jar, sponsors, and ways to help",
    description: "Toolora is free and privacy-first. If our tools save you time, here are ways to support us — no signup required.",
    canonical: "https://toolora.dev/support",
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">Support Toolora</h1>
      <p className="text-lg text-zinc-400 mb-12">
        Toolora&apos;s 35+ browser tools and MCP server are free forever. If they&apos;ve saved you time,
        here are ways to chip in — pick whichever doesn&apos;t require a card if you don&apos;t want one.
      </p>

      <section className="grid md:grid-cols-2 gap-4 mb-12">
        <a
          href="https://buymeacoffee.com/toolora"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-zinc-800 hover:border-yellow-500 bg-zinc-900/50 p-6 transition"
        >
          <div className="text-2xl mb-2">☕</div>
          <h3 className="text-lg font-semibold text-zinc-100">Buy us a coffee</h3>
          <p className="text-sm text-zinc-400 mt-1">$5 one-time tip via BuyMeACoffee. No account needed.</p>
        </a>

        <a
          href="https://github.com/sponsors/toolora"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-zinc-800 hover:border-pink-500 bg-zinc-900/50 p-6 transition"
        >
          <div className="text-2xl mb-2">💖</div>
          <h3 className="text-lg font-semibold text-zinc-100">GitHub Sponsors</h3>
          <p className="text-sm text-zinc-400 mt-1">$5–$50/mo recurring. GitHub matches first $5k.</p>
        </a>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="text-2xl mb-2">◎</div>
          <h3 className="text-lg font-semibold text-zinc-100">Solana / USDC tip</h3>
          <p className="text-sm text-zinc-400 mt-1 mb-3">Send any amount of SOL or USDC to:</p>
          <code className="block text-xs text-violet-300 break-all bg-zinc-950 p-2 rounded">{SOLANA_TIP_ADDRESS}</code>
        </div>

        <a
          href="https://polar.sh/toolora"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-zinc-800 hover:border-blue-500 bg-zinc-900/50 p-6 transition"
        >
          <div className="text-2xl mb-2">🛟</div>
          <h3 className="text-lg font-semibold text-zinc-100">Subscribe on Polar</h3>
          <p className="text-sm text-zinc-400 mt-1">Open-source Stripe alternative. 4% flat, MoR.</p>
        </a>
      </section>

      <section className="rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-950/40 to-zinc-900/40 p-8 mb-12">
        <h2 className="text-2xl font-semibold text-zinc-100 mb-3">Or: get something useful</h2>
        <p className="text-zinc-400 mb-6">
          The MCP Cookbook — every Toolora blog post, edited and bundled into a single PDF + EPUB.
          108 essays on MCP servers, AI agents, and privacy-first tooling.
        </p>
        <a
          href="https://toolora.gumroad.com/l/mcp-cookbook"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 font-semibold transition"
        >
          Get the MCP Cookbook · $19 →
        </a>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
        <h2 className="text-2xl font-semibold text-zinc-100 mb-3">Run a company? Sponsor us.</h2>
        <p className="text-zinc-400 mb-6">
          Reach 1,400+ AI agent users with native, tasteful sponsorship slots in the MCP server,
          blog, and newsletter. Way more effective than display ads.
        </p>
        <a
          href="/sponsor"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 hover:border-violet-500 text-zinc-100 px-6 py-3 font-semibold transition"
        >
          See sponsorship slots →
        </a>
      </section>
    </main>
  );
}
