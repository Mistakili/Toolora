import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Shield, Zap, Search, Bot, FileText, Globe, BarChart2, Bell } from "lucide-react";
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
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="" 
            className="w-full h-full object-cover opacity-20 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
                <Sparkles className="w-4 h-4" /> The Ultimate Collection
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
                Free online tools for <span className="gradient-text">every workflow.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Format JSON, convert PDFs, resize images, and generate passwords. All processing happens locally in your browser for maximum privacy and speed.
              </p>
              
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="#categories" className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                  Explore Tools
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground px-6 py-4">
                  <Shield className="w-5 h-5 text-green-500" />
                  100% Client-Side Processing
                </div>
              </div>

              {/* Stats bar */}
              <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-border/40">
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
            </motion.div>
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
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed max-w-xl">
                Three server-side endpoints that agents can discover, pay for, and use — no API key, no signup. Just send <span className="text-foreground font-semibold">0.5 XLM per request</span> via Stellar and get the data.
              </p>
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
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
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
