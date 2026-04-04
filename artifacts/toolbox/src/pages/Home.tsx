import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Shield, Zap, Bot, FileText, Globe, BarChart2, Bell, Building2, Server, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { CATEGORIES, TOOLS } from "@/lib/tools-config";
import { ToolCard } from "@/components/shared/ToolCard";
import { useGetPopularTools } from "@workspace/api-client-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "already" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "homepage" }),
      });
      const data = await res.json() as { ok?: boolean; alreadySubscribed?: boolean; error?: string };
      if (!res.ok) { setSubStatus("error"); return; }
      setSubStatus(data.alreadySubscribed ? "already" : "success");
    } catch {
      setSubStatus("error");
    }
  }

  // Graceful fallback if API is not available
  const { data: popularData, isLoading: isLoadingPopular } = useGetPopularTools({
    query: { retry: false }
  });

  // Blend hardcoded popular tools with API data if available
  let popularTools = TOOLS.filter(t => t.isPopular).slice(0, 6);
  
  if (popularData?.tools && popularData.tools.length > 0) {
    const apiPopularSlugs = popularData.tools.map((t: any) => t.slug);
    const apiTools = apiPopularSlugs.map((slug: string) => TOOLS.find(t => t.slug === slug)).filter(Boolean);
    if (apiTools.length > 0) {
      popularTools = apiTools.slice(0, 6);
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="" 
            className="w-full h-full object-cover opacity-20 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Orb image — appears above text on mobile for drama */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex items-center justify-center order-first lg:order-last"
            >
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px]">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-90 animate-pulse" />
                <img
                  src={`${import.meta.env.BASE_URL}images/hero-visual.png`}
                  alt="Your data stays in your browser — contained, never uploaded"
                  className="relative z-10 w-full h-full object-cover rounded-full drop-shadow-[0_0_60px_rgba(139,92,246,0.4)]"
                />
              </div>
            </motion.div>

            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left order-last lg:order-first"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
                <Sparkles className="w-4 h-4" /> MCP-ready &middot; Claude Desktop &middot; Cursor &middot; Windsurf
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
                Free tools for AI builders.
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                28 browser tools + a free MCP server for Claude Desktop and Cursor. Format JSON, convert PDFs, transcribe audio, read URLs — processed in your browser. Files never leave your device. No uploads, no accounts, no tracking.
              </p>
              
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border-0"
                >
                  Explore Tools
                </button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground px-6 py-4">
                  <Shield className="w-5 h-5 text-green-500" />
                  100% Client-Side Processing
                </div>
              </div>

              {/* MCP callout */}
              <div className="mt-6 flex items-center justify-center">
                <Link href="/mcp-hub" className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Also an MCP server for Claude Desktop &amp; Cursor
                  </span>
                  <span className="text-primary font-medium group-hover:underline">15 tools, no API key →</span>
                </Link>
              </div>

            </motion.div>
          </div>

          {/* Stats bar — full width below grid */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-8 border-t border-border/40">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{TOOLS.length}+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Free Tools</div>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {popularData?.tools
                  ? (popularData.tools.reduce((sum: number, t: any) => sum + (t.usageCount ?? 0), 0)).toLocaleString()
                  : "—"}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Tools Used</div>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">0kb</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Data Uploaded</div>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">Free</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-20 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">One privacy guarantee.<br className="hidden sm:block" /> Three ways to use it.</h2>
          </div>

          {/* MCP visual — cinematic split */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-20 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-transparent p-8 overflow-hidden">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-75" />
              <img
                src={`${import.meta.env.BASE_URL}images/mcp-visual.png`}
                alt="AI agents connecting to Toolora's MCP server — a network of tools"
                className="relative z-10 w-full max-w-sm rounded-2xl drop-shadow-[0_0_40px_rgba(139,92,246,0.35)]"
              />
            </div>
            <div>
              <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">MCP Server</p>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 leading-snug">
                Your AI agent.<br/>Our tools.
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                One config block connects Claude Desktop, Cursor, or Windsurf to 17 real server-side tools. PDF extraction, OCR, audio transcription, web reading, QR generation, and persistent memory — all callable by your AI in a single session.
              </p>
              <Link href="/mcp" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                Set it up in 60 seconds <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0 relative">
            {/* Connector lines on desktop */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-border via-primary/30 to-border" />

            {[
              {
                num: "01",
                color: "text-green-400",
                border: "border-green-500/20",
                bg: "bg-green-500/5",
                dot: "bg-green-500",
                title: "Browser Tools",
                sub: "Zero-upload processing",
                desc: "28 tools run entirely in WebAssembly inside your browser tab. Files are never transmitted anywhere — not even to us.",
                bullets: ["PDF · OCR · Image · Audio", "Works offline after load", "No account required", "Verifiable in DevTools"],
              },
              {
                num: "02",
                color: "text-primary",
                border: "border-primary/20",
                bg: "bg-primary/5",
                dot: "bg-primary",
                title: "MCP Server",
                sub: "Claude · Cursor · Windsurf",
                desc: "12 of those same tools available as an MCP server. Paste one config block and your AI client can call them directly.",
                bullets: ["Free · No API key", "Listed in Anthropic Registry", "Streamable HTTP transport", "toolora.dev/api/mcp"],
              },
              {
                num: "03",
                color: "text-amber-400",
                border: "border-amber-500/20",
                bg: "bg-amber-500/5",
                dot: "bg-amber-500",
                title: "Agent API",
                sub: "For autonomous workflows",
                desc: "A metered REST API for agents and pipelines. Pay per use via x402 micropayments or subscribe for a monthly call budget.",
                bullets: ["x402 USDC micropayments", "Pro $19 · Team $79 · Ent $199", "OpenAPI spec included", "Same privacy, at scale"],
              },
            ].map((layer, i) => (
              <div key={layer.num} className={`relative flex flex-col p-8 ${i === 1 ? `border border-x-0 md:border-x md:border-y-0 ${layer.border} ${layer.bg}` : ""}`}>
                <div className="flex items-center gap-3 mb-5">
                  <span className={`font-mono text-xs font-bold ${layer.color} opacity-60`}>{layer.num}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${layer.dot}`} />
                  <span className="text-xs text-muted-foreground font-medium">{layer.sub}</span>
                </div>
                <h3 className={`text-xl font-display font-bold mb-3 ${layer.color}`}>{layer.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{layer.desc}</p>
                <ul className="space-y-1.5 mt-auto">
                  {layer.bullets.map(b => (
                    <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`w-1 h-1 rounded-full shrink-0 ${layer.dot}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-muted-foreground font-mono">
              Every layer shares the same guarantee: <span className="text-foreground">your content is never stored or logged on our servers.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Most Popular Tools</h2>
              <p className="text-muted-foreground">The tools our community uses the most.</p>
            </div>
            <Link href="/tools/developer" className="hidden sm:flex items-center text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool, idx) => (
              <ToolCard key={tool.id} tool={tool} delay={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-16 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">More than just free tools</h2>
            <p className="text-muted-foreground">Toolora is a full privacy-first platform — for individuals, developers, and regulated teams.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Enterprise */}
            <Link href="/enterprise">
              <div className="group relative rounded-2xl border border-border bg-card hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300 p-6 cursor-pointer h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">$199/mo</span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-amber-500 transition-colors">Enterprise Plan</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  Built for law firms, healthcare teams, and financial services. Privacy by architecture — no BAA, no server uploads, full compliance story.
                </p>
                <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-amber-500">
                  Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* MCP Hub */}
            <Link href="/mcp-hub">
              <div className="group relative rounded-2xl border border-border bg-card hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 p-6 cursor-pointer h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Server className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">Free</span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-purple-500 transition-colors">MCP Server Hub</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  A curated directory of privacy-first MCP servers. Drop Toolora's endpoint into Claude or Cursor and get 15 tools instantly — plus find other vetted local-first servers.
                </p>
                <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-purple-500">
                  Browse the hub <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Blog */}
            <Link href="/blog">
              <div className="group relative rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 p-6 cursor-pointer h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">16 posts</span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Privacy & Dev Blog</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  Deep dives on HIPAA compliance, JWT security, hashing vs encryption, MCP servers, and why most "free" tools are a data risk. Written for developers and compliance teams.
                </p>
                <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-primary">
                  Read the blog <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* For AI Agents Section */}
      <section className="py-20 border-y border-border/50 bg-gradient-to-br from-yellow-500/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: copy */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-5 border border-yellow-500/20">
                <Bot className="w-3.5 h-3.5" /> For AI Agents
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                A paid API built for autonomous agents.
              </h2>
              <p className="text-muted-foreground text-lg mb-4 leading-relaxed max-w-xl">
                Three server-side endpoints that agents can discover, pay for, and use. Pay per-call with Solana USDC or Stellar XLM via x402 — or subscribe monthly via Stripe for higher volume.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {[["Free", "200 calls/mo"], ["Pro", "$19/mo · 5k calls"], ["Team", "$79/mo · 50k calls"]].map(([plan, desc]) => (
                  <span key={plan} className="text-xs px-3 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 font-semibold">
                    {plan} <span className="font-normal text-muted-foreground">— {desc}</span>
                  </span>
                ))}
              </div>
              <div className="space-y-3 mb-8">
                {[
                  { icon: FileText, label: "PDF → raw text", desc: "Clean text, page count, word count, PDF metadata" },
                  { icon: FileText, label: "PDF → structured JSON", desc: "Headings, sections, hierarchy — ideal for RAG ingestion" },
                  { icon: Globe, label: "URL → readable text", desc: "Boilerplate-stripped article text via Mozilla Readability" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="mt-0.5 w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-yellow-400" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm">{item.label}</span>
                      <span className="text-muted-foreground text-sm"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/api-docs" className="px-5 py-2.5 bg-yellow-500 text-black font-semibold rounded-full text-sm hover:bg-yellow-400 transition-colors">
                  Read the Docs
                </Link>
                <a
                  href="/api/agent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 border border-yellow-500/30 text-yellow-400 font-semibold rounded-full text-sm hover:bg-yellow-500/10 transition-colors flex items-center gap-2"
                >
                  <Bot className="w-4 h-4" /> Agent Manifest
                </a>
              </div>
            </div>

            {/* Right: quick-start code box */}
            <div className="flex-1 w-full max-w-lg">
              <div className="rounded-2xl border border-border bg-[#0d1117] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">agent_example.py</span>
                </div>
                <pre className="p-5 text-xs font-mono text-green-400/90 leading-relaxed overflow-x-auto">
{`import requests, base64, json

# 1. Call the endpoint — receive 402 with payment details
r = requests.post("https://api.toolora.dev/api/agent/pdf/text",
                  files={"file": open("report.pdf","rb")})
# r.status_code == 402  ← pay to continue

# 2. Send 0.5 XLM to payTo address on Stellar, get txHash

# 3. Retry with proof of payment
payment = base64.b64encode(json.dumps({
  "txHash":  "<stellar_tx_hash>",
  "from":    "<your_wallet>",
  "amount":  "0.5",
  "network": "stellar:mainnet"
}).encode()).decode()

r = requests.post(
  "https://api.toolora.dev/api/agent/pdf/text",
  headers={"X-PAYMENT": payment},
  files={"file": open("report.pdf","rb")}
)
print(r.json()["text"])  # ← full PDF text`}
                </pre>
              </div>
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Usage stats at</span>
                  <a
                    href="/api/agent/stats"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-mono"
                  >
                    /api/agent/stats
                  </a>
                </div>
                <span className="text-xs text-muted-foreground">
                  <Zap className="w-3 h-3 inline mr-1 text-yellow-400" />
                  x402 · Stellar XLM
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">We have a growing collection of {TOOLS.length}+ tools to help you get things done faster.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((category, idx) => {
              const Icon = category.icon;
              const count = TOOLS.filter(t => t.category === category.id).length;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Link href={`/tools/${category.id}`}>
                    <div className="group block p-8 rounded-3xl border border-border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {count} Tools
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{category.name}</h3>
                      <p className="text-muted-foreground mb-6 line-clamp-2">{category.description}</p>
                      <div className="text-primary font-medium flex items-center group-hover:gap-2 transition-all">
                        Browse Tools <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-4xl font-display font-bold mb-6">Privacy is not a feature.<br/>It's our foundation.</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl leading-relaxed">
                When you use our PDF manipulation, image conversion, or developer tools, your files never leave your device. All processing is powered by modern WebAssembly and browser APIs directly on your machine.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 font-medium"><Shield className="w-5 h-5 text-green-300" /> Zero server uploads</li>
                <li className="flex items-center gap-3 font-medium"><Zap className="w-5 h-5 text-yellow-300" /> Lightning fast local execution</li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64 md:w-96 md:h-96">
                 <img 
                  src={`${import.meta.env.BASE_URL}images/privacy-shield.png`} 
                  alt="Privacy Shield" 
                  className="w-full h-full object-contain animate-in fade-in zoom-in duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">From the Blog</h2>
              <p className="text-muted-foreground">Privacy, security, and developer deep dives.</p>
            </div>
            <Link href="/blog" className="hidden sm:flex items-center text-sm font-medium text-primary hover:underline">
              View all 16 posts <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                slug: "hipaa-compliant-online-document-tools",
                category: "Privacy",
                date: "Apr 3",
                title: "Why Most Online Document Tools Are a HIPAA Liability",
                desc: "Most 'free' tools upload your files to servers you don't control. Here's why that matters for regulated industries.",
                color: "text-red-500",
                bg: "bg-red-500/10",
              },
              {
                slug: "stop-pasting-jwts-into-random-websites",
                category: "Security",
                date: "Apr 3",
                title: "Stop Pasting JWT Tokens Into Random Websites",
                desc: "JWT.io is great — but pasting tokens into any third-party site is a security risk. Here's the safer alternative.",
                color: "text-orange-500",
                bg: "bg-orange-500/10",
              },
              {
                slug: "competitor-research-claude-mcp",
                category: "Developer Tools",
                date: "Apr 1",
                title: "How to Research Any Competitor Using Claude and an MCP Server",
                desc: "Use Claude Desktop + Toolora's free MCP server to automate competitor research without touching a spreadsheet.",
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
            ].map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="group rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-muted/40 transition-all duration-300 p-6 h-full flex flex-col cursor-pointer">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${post.bg} ${post.color}`}>{post.category}</span>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="font-bold text-base mb-2 leading-snug group-hover:text-primary transition-colors flex-1">{post.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.desc}</p>
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                    Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-20 border-t border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <Bell className="w-3.5 h-3.5" />
            Stay in the loop
          </div>
          <h2 className="text-3xl font-display font-bold mb-3">New tools, every week</h2>
          <p className="text-muted-foreground mb-8">
            Get notified when we add new tools. No spam, unsubscribe any time.
          </p>

          {subStatus === "success" ? (
            <p className="text-green-500 font-semibold text-lg">You're in! We'll let you know when new tools drop.</p>
          ) : subStatus === "already" ? (
            <p className="text-muted-foreground font-semibold text-lg">You're already subscribed — we've got your email.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <label htmlFor="subscribe-email" className="sr-only">Email address</label>
              <input
                id="subscribe-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                disabled={subStatus === "loading"}
                className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {subStatus === "loading" ? "..." : "Notify me"}
              </button>
            </form>
          )}
          {subStatus === "error" && (
            <p className="text-destructive text-sm mt-3">Something went wrong — please try again.</p>
          )}
        </div>
      </section>
    </div>
  );
}
