import { Shield, Zap, Globe, Lock, Bot, FileText, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

const STATS = [
  { label: "Free browser tools", value: "28" },
  { label: "MCP server tools", value: "17" },
  { label: "Countries reached", value: "15+" },
  { label: "API key required", value: "None" },
];

const VALUES = [
  {
    icon: Shield,
    title: "Architecturally private",
    body: "Browser tools run 100% client-side. Your files, passwords, and documents never touch our servers. This isn't a policy — it's how the code works.",
  },
  {
    icon: Zap,
    title: "No friction",
    body: "No account. No email. No onboarding flow. Every tool opens instantly and works. The free MCP server needs one config line — nothing else.",
  },
  {
    icon: Bot,
    title: "Built for AI workflows",
    body: "The MCP server gives Claude, Cursor, and other AI agents real server-side tools — PDF, OCR, memory, transcription — not prompt wrappers.",
  },
  {
    icon: Globe,
    title: "Open infrastructure",
    body: "Listed in the Anthropic MCP Registry. Indexed in Smithery. The llms.txt and toolora-skill.md are public and machine-readable. AI agents can discover and use Toolora without human intervention.",
  },
];

export default function About() {
  useSEO({
    title: "About Toolora — Privacy-First Tools for Developers & AI Agents",
    description: "Toolora is a privacy-first utility platform — 28 browser tools that run on your device and a free MCP server with 17 tools for Claude, Cursor, and AI agents. No API key required.",
    canonical: "https://toolora.dev/about",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "AboutPage",
          "@id": "https://toolora.dev/about",
          name: "About Toolora",
          url: "https://toolora.dev/about",
          description: "Toolora is a privacy-first utility platform — 28 browser tools that run on your device and a free MCP server with 17 tools for Claude, Cursor, and AI agents.",
          publisher: { "@type": "Organization", name: "Toolora", url: "https://toolora.dev" },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://toolora.dev" },
            { "@type": "ListItem", position: 2, name: "About", item: "https://toolora.dev/about" },
          ],
        },
      ],
    },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">

      {/* Hero */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-5">
          <FileText className="h-3.5 w-3.5" />
          About
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
          We built the tools we wanted to exist.
        </h1>
        <div className="space-y-4 text-lg text-muted-foreground max-w-3xl">
          <p>
            Toolora is a privacy-first utility platform built for developers and AI workflows — 28 browser tools that run entirely on your device, and a free MCP server that gives Claude, Cursor, and any AI agent{" "}
            <strong className="text-foreground">17 real server-side capabilities</strong>{" "}
            including PDF processing, OCR, audio transcription, and cross-session memory.
          </p>
          <p>
            Every browser tool is architecturally private: your files, passwords, and documents are never uploaded, never logged, and never stored —{" "}
            <strong className="text-foreground">they stay on your machine.</strong>
          </p>
          <p>
            For teams that need more, the Agent API powers programmatic document workflows with per-request billing, and the free MCP server requires no API key, no account, and is{" "}
            <strong className="text-foreground">listed in the Anthropic MCP Registry.</strong>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 text-center">
            <p className="text-3xl font-display font-bold text-primary mb-1">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Developer human visual */}
      <div className="relative rounded-2xl overflow-hidden border border-border/50 mb-14">
        <img
          src={`${import.meta.env.BASE_URL}images/about-human.png`}
          alt="Developer at work — the humans behind Toolora"
          className="w-full object-cover max-h-64 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 px-8 pb-6">
          <p className="text-sm text-muted-foreground italic">"We build the tools we wished existed."</p>
        </div>
      </div>

      {/* Values */}
      <section className="mb-14">
        <div className="grid md:grid-cols-2 gap-10 items-center mb-10">
          <div>
            <h2 className="text-2xl font-display font-bold mb-3">How we think about this</h2>
            <p className="text-muted-foreground leading-relaxed">Privacy isn't a setting you toggle or a policy you write — it's an architectural decision. Every browser tool on Toolora runs in WebAssembly inside your tab. There is no server receiving your files. You can verify this in DevTools: open the Network tab and watch nothing upload while you process a PDF.</p>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-75" />
            <img
              src={`${import.meta.env.BASE_URL}images/about-privacy-visual.png`}
              alt="Privacy shield — data contained and protected"
              className="relative z-10 w-full max-w-xs rounded-2xl drop-shadow-[0_0_40px_rgba(139,92,246,0.35)]"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {VALUES.map((v) => (
            <div key={v.title} className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <v.icon className="h-4 w-4" />
                </div>
                <p className="font-semibold">{v.title}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we offer */}
      <section className="mb-14">
        <h2 className="text-2xl font-display font-bold mb-6">What's here</h2>
        <div className="space-y-4">
          <div className="flex gap-4 p-5 rounded-xl border border-border bg-card items-start">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
              <Lock className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-semibold mb-1">28 free browser tools</p>
              <p className="text-sm text-muted-foreground">PDF, image, text, developer, and productivity tools that run entirely in your browser. No uploads. No install. No account.</p>
              <Link href="/tools/pdf" className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline">
                Browse tools <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="flex gap-4 p-5 rounded-xl border border-border bg-card items-start">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-semibold mb-1">Free MCP server — 17 tools</p>
              <p className="text-sm text-muted-foreground">One config line connects Claude, Cursor, or any MCP-compatible agent to real server-side tools. No API key. No auth. Nothing stored.</p>
              <Link href="/mcp" className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline">
                Set up MCP <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="flex gap-4 p-5 rounded-xl border border-border bg-card items-start">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-semibold mb-1">Agent API — pay per request</p>
              <p className="text-sm text-muted-foreground">For programmatic integrations and scripts. Supports Stripe subscriptions (Free / Pro / Team / Enterprise) and x402 micropayments for per-call billing.</p>
              <Link href="/pricing" className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline">
                See pricing <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-violet-500/5 p-8 text-center">
        <h2 className="text-xl font-display font-bold mb-2">Get in touch</h2>
        <p className="text-muted-foreground mb-4 text-sm">Questions, feedback, enterprise inquiries, or just want to say what you built with it.</p>
        <a
          href="mailto:support@toolora.dev"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          support@toolora.dev
        </a>
      </section>
    </div>
  );
}
