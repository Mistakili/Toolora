import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Shield, Zap, Bot, FileText, Globe, BarChart2, Bell, Building2, Server, BookOpen, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { CATEGORIES, TOOLS } from "@/lib/tools-config";
import { ToolCard } from "@/components/shared/ToolCard";
import { useGetPopularTools } from "@workspace/api-client-react";
import { BLOG_POSTS, getPostImage } from "@/lib/blog-posts";
import { GLOSSARY } from "@/lib/glossary";

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
                  src={import.meta.env.BASE_URL + "images/hero-visual-new.png"}
                  alt="Toolora — a box of digital tools for everyone"
                  className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_60px_rgba(139,92,246,0.5)]"
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
                <Shield className="w-4 h-4" /> Privacy-first &middot; MCP-ready &middot; Enterprise-ready
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
                Your files never leave your device.
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                {TOOLS.length} tools. All local. Zero uploads. Nothing ever stored.
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

              {/* MCP + Chrome callouts */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/mcp-hub" className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Free MCP server — 17 tools
                  </span>
                  <span className="text-primary font-medium group-hover:underline">No API key needed →</span>
                </Link>
                <a
                  href="https://chromewebstore.google.com/detail/lpbbnmhnmbccfiipolepbahphffdoine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-muted/30 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-200 text-sm"
                >
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="4" fill="#4285F4"/>
                      <path d="M12 8h8.6a10 10 0 1 0-1.1 9.3L15 12" stroke="#34A853" strokeWidth="2" fill="none"/>
                      <path d="M12 8H3.4A10 10 0 0 0 12 22v-5.4" stroke="#FBBC05" strokeWidth="2" fill="none"/>
                      <path d="M15 12l4.5 7.3A10 10 0 0 0 20.6 8H12" stroke="#EA4335" strokeWidth="2" fill="none"/>
                    </svg>
                    Chrome Extension — live
                  </span>
                  <span className="text-blue-400 font-medium group-hover:underline">Add to Chrome →</span>
                </a>
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
              <div className="text-2xl font-bold text-foreground">{BLOG_POSTS.length}+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Blog Posts</div>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{GLOSSARY.length}+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Glossary Terms</div>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">0 bytes</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Ever Uploaded</div>
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
                desc: TOOLS.length + " tools — all run in your browser. Files never leave your device.",
                img: "mcp-tools-visual.png",
                bullets: ["PDF · OCR · Image · Audio", "Works offline", "No account required"],
              },
              {
                num: "02",
                color: "text-primary",
                border: "border-primary/20",
                bg: "bg-primary/5",
                dot: "bg-primary",
                title: "MCP Server",
                sub: "Claude · Cursor · Windsurf",
                desc: "17 tools as an MCP server. One config block — your AI calls them directly.",
                img: "mcp-server-room.png",
                bullets: ["Free · No API key", "Anthropic Registry", "toolora.dev/api/mcp"],
              },
              {
                num: "03",
                color: "text-amber-400",
                border: "border-amber-500/20",
                bg: "bg-amber-500/5",
                dot: "bg-amber-500",
                title: "Agent API",
                sub: "For autonomous workflows",
                desc: "Pay-per-call REST API for agents. x402 micropayments or monthly subscription.",
                img: "mcp-memory-visual.png",
                bullets: ["x402 USDC micropayments", "Pro $19 · Team $79", "OpenAPI spec included"],
              },
            ].map((layer, i) => (
              <div key={layer.num} className={"relative flex flex-col overflow-hidden rounded-xl " + (i === 1 ? "border " + layer.border + " " + layer.bg : "")}>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={import.meta.env.BASE_URL + "images/" + layer.img}
                    alt={layer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <span className={"font-mono text-xs font-bold " + layer.color + " opacity-60"}>{layer.num}</span>
                    <span className={"w-1.5 h-1.5 rounded-full " + layer.dot} />
                    <span className="text-xs text-muted-foreground font-medium">{layer.sub}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={"text-xl font-display font-bold mb-2 " + layer.color}>{layer.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{layer.desc}</p>
                  <ul className="space-y-1.5">
                    {layer.bullets.map(b => (
                      <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={"w-1 h-1 rounded-full shrink-0 " + layer.dot} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Enterprise */}
            <Link href="/enterprise">
              <div className="group relative rounded-2xl border border-border bg-card hover:border-amber-500/50 transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img src={import.meta.env.BASE_URL + "images/enterprise-hero.png"} alt="Enterprise" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/90 text-black">$199/mo</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-1.5 group-hover:text-amber-500 transition-colors">Enterprise Plan</h3>
                  <p className="text-muted-foreground text-sm flex-1">Law firms, healthcare & finance. Privacy by architecture.</p>
                  <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-amber-500">
                    Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* MCP Hub */}
            <Link href="/mcp-hub">
              <div className="group relative rounded-2xl border border-border bg-card hover:border-purple-500/50 transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img src={import.meta.env.BASE_URL + "images/mcp-hub-hero.png"} alt="MCP Hub" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/90 text-white">17 tools · Free</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-1.5 group-hover:text-purple-500 transition-colors">MCP Server Hub</h3>
                  <p className="text-muted-foreground text-sm flex-1">One config block. Claude, Cursor, Windsurf — ready instantly.</p>
                  <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-purple-500">
                    Browse the hub <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Knowledge Hub */}
            <Link href="/glossary">
              <div className="group relative rounded-2xl border border-border bg-card hover:border-green-500/50 transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img src={import.meta.env.BASE_URL + "images/about-privacy-visual.png"} alt="Glossary" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/90 text-black">{GLOSSARY.length} terms</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-1.5 group-hover:text-green-500 transition-colors">Developer Glossary</h3>
                  <p className="text-muted-foreground text-sm flex-1">Plain-English definitions for privacy, AI, cloud & security.</p>
                  <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-green-500">
                    Browse the glossary <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Blog */}
            <Link href="/blog">
              <div className="group relative rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img src={import.meta.env.BASE_URL + "images/blog-hero.png"} alt="Blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-primary/90 text-white">{BLOG_POSTS.length} posts</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-1.5 group-hover:text-primary transition-colors">Privacy & Dev Blog</h3>
                  <p className="text-muted-foreground text-sm flex-1">HIPAA, JWT, MCP servers, and why "free" tools are a data risk.</p>
                  <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-primary">
                    Read the blog <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
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

            {/* Right: cinematic visual */}
            <div className="flex-1 w-full max-w-lg">
              <div className="relative rounded-2xl overflow-hidden border border-yellow-500/20 shadow-2xl shadow-yellow-500/10">
                <img
                  src={import.meta.env.BASE_URL + "images/api-keys-hero.png"}
                  alt="Agent API — x402 micropayments"
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="font-mono text-xs text-green-400/80 mb-2">POST /api/agent/pdf/text → 402 → pay → retry → result</div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">x402 · Stellar XLM</span>
                    <span className="px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">USDC · Solana</span>
                    <a href="/api/agent/stats" target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <BarChart2 className="w-3 h-3" /> stats
                    </a>
                  </div>
                </div>
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
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="grid md:grid-cols-2 min-h-[420px]">
          {/* Image — full bleed left column */}
          <div className="relative order-last md:order-first min-h-[300px] md:min-h-0">
            <img
              src={import.meta.env.BASE_URL + "images/privacy-shield-new.png"}
              alt="Privacy by architecture"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/80 hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent md:hidden" />
          </div>
          {/* Text column */}
          <div className="relative z-10 flex flex-col justify-center px-8 md:px-14 py-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">Privacy is not a feature.<br/>It's our foundation.</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 font-medium text-lg"><Shield className="w-5 h-5 text-green-300 shrink-0" /> Zero server uploads</li>
              <li className="flex items-center gap-3 font-medium text-lg"><Zap className="w-5 h-5 text-yellow-300 shrink-0" /> WebAssembly in your browser</li>
              <li className="flex items-center gap-3 font-medium text-lg"><Sparkles className="w-5 h-5 text-blue-300 shrink-0" /> Verifiable in DevTools</li>
            </ul>
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
              View all {BLOG_POSTS.length} posts <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <Link key={post.slug} href={"/blog/" + post.slug}>
                <div className="group rounded-2xl border border-border bg-card hover:border-primary/40 transition-all duration-300 h-full flex flex-col cursor-pointer overflow-hidden">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={getPostImage(post.slug, post.category)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/90 text-white">{post.category}</span>
                      <span className="text-xs text-white/70 bg-black/40 px-2 py-0.5 rounded-full">{post.readTime}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-base mb-3 leading-snug group-hover:text-primary transition-colors flex-1">{post.title}</h3>
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                      Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section — substantive prose for AI and search indexing */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">What is Toolora?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete suite of free online tools that run entirely in your browser — no file uploads, no accounts, no data ever leaving your device.
            </p>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 text-sm font-bold shrink-0">PDF</span>
                  PDF Tools
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Merge multiple PDF files into a single document by dragging them into order. Split any PDF into individual pages or extract specific page ranges. All PDF processing runs client-side using WebAssembly — your documents never touch a server, making these tools safe for contracts, medical records, and legal filings.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 text-sm font-bold shrink-0">IMG</span>
                  Image Tools
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Compress JPG, PNG, and WebP images without visible quality loss. Resize by pixel dimensions or percentage while locking aspect ratio. Convert between image formats instantly. All image processing uses the browser's Canvas API — your photos are never transmitted anywhere.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">&lt;/&gt;</span>
                  Developer Tools
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Format and validate JSON, generate MD5, SHA-256, and SHA-512 hashes, decode JWT tokens, test regex patterns with live highlighting, convert between YAML and JSON, parse cron expressions, convert number bases, escape strings for JSON and SQL, and generate UUIDs in bulk. The Token Counter supports GPT-4o, Claude, and Llama tokenizers so you know your API cost before you send a request.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 text-sm font-bold shrink-0">TXT</span>
                  Text Tools
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Count words, characters, and reading time. Convert case (camelCase, snake_case, title case, and more). Sort and deduplicate lines. Compare two texts and see a line-by-line diff. Calculate Flesch–Kincaid readability scores. Generate Lorem Ipsum placeholder text. Convert Markdown to HTML with a live preview, or clean HTML back into readable Markdown.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 space-y-4">
              <h3 className="text-xl font-bold">AI and RAG Workflow Tools</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The <strong className="text-foreground">Text Chunker</strong> splits long documents into overlapping segments ready for vector database ingestion — choose paragraph, sentence, or fixed-size chunking, set the chunk size and overlap, and download as JSONL with token estimates per chunk. The <strong className="text-foreground">HTML to Markdown Converter</strong> cleans scraped web content into LLM-readable Markdown, handling tables, code blocks, and nested lists. The <strong className="text-foreground">AI Data Extractor</strong> pulls structured JSON from any unstructured text — describe what fields to extract in plain English and get clean output from emails, contracts, or meeting notes. The <strong className="text-foreground">Document Memory Loader</strong> chunks an entire PDF or Word document and saves it to Claude-accessible persistent memory so you can ask questions about it in any future session without re-uploading.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Why Your Files Should Never Leave Your Browser</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Most free online tools upload your files to a remote server to process them. That means sensitive documents — financial reports, healthcare records, legal contracts, private photos — are transmitted over the internet and stored, however briefly, on infrastructure you do not control and cannot audit. Toolora is built differently: all browser-tool processing runs in WebAssembly and native browser APIs inside your own tab. You can verify this yourself by opening DevTools and watching the Network tab while using any tool. You will see no outbound file upload.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This architecture makes Toolora suitable for regulated industries. Healthcare teams can process patient documents without violating HIPAA upload restrictions. Legal professionals can work with privileged materials. Financial analysts can handle non-public information. Developers can test with real credentials and API keys without worrying about those values appearing in server logs.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold">Free MCP Server for Claude, Cursor, and Windsurf</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Beyond the browser tools, Toolora runs a free Model Context Protocol server with 25 tools. Paste one configuration block into Claude Desktop, Cursor, or Windsurf and your AI agent can immediately call PDF extraction, HTML to Markdown conversion, text chunking, regex execution, hash generation, token estimation, structured data extraction, QR code generation, web page reading, and persistent memory — all without an API key. The server is listed in the Anthropic MCP registry and uses the streamable HTTP transport format.
              </p>
            </div>

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
