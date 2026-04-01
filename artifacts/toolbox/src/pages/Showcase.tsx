import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import {
  Shield, Zap, Globe, Lock, Code2, FileText, Image, Hash, Key,
  QrCode, Type, ArrowRight, Check, Terminal, Server, ChevronDown,
  Cpu, Wifi, WifiOff, Star, Users, BarChart2,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return { ref, inView };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, inView } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-purple-400 border border-purple-500/30 bg-purple-500/10 px-3 py-1 rounded-full">
      {children}
    </span>
  );
}

const TOOLS = [
  { icon: FileText,  label: "PDF Merge",         desc: "Merge PDFs in-browser, zero upload",     href: "/tools/documents/pdf-merge",        cat: "Documents" },
  { icon: Image,     label: "Image Compress",     desc: "Shrink images locally, no cloud needed", href: "/tools/images/image-compress",       cat: "Images" },
  { icon: Code2,     label: "JSON Formatter",     desc: "Format & validate JSON instantly",        href: "/tools/developer/json-formatter",    cat: "Developer" },
  { icon: Hash,      label: "Hash Generator",     desc: "MD5, SHA-256, SHA-512 hashes",           href: "/tools/developer/hash-generator",    cat: "Security" },
  { icon: Key,       label: "Password Generator", desc: "Cryptographically random passwords",      href: "/tools/developer/password-generator",cat: "Security" },
  { icon: QrCode,    label: "QR Code Generator",  desc: "Clean QR codes, no watermarks ever",     href: "/tools/productivity/qr-generator",   cat: "Productivity" },
  { icon: Type,      label: "Word Counter",        desc: "Words, chars, reading time instant",     href: "/tools/text/word-counter",           cat: "Text" },
  { icon: Lock,      label: "Base64 Encoder",      desc: "Encode & decode without a server",       href: "/tools/developer/base64",            cat: "Developer" },
];

const PROMISES = [
  { icon: WifiOff, title: "Nothing leaves your browser", desc: "Every tool runs via WebAssembly and browser APIs. Zero network calls for your data." },
  { icon: Shield,  title: "No accounts required",        desc: "Use every tool instantly. No sign-in, no email, no tracking. Ever." },
  { icon: Zap,     title: "Faster than server-side",     desc: "Local processing beats a round-trip to any cloud. No queues, no rate limits." },
  { icon: Globe,   title: "Works offline",               desc: "Once loaded, tools keep working even with no internet connection." },
];

const STATS = [
  { value: "20+",    label: "Free tools" },
  { value: "0",      label: "Uploads required" },
  { value: "100%",   label: "Browser-side" },
  { value: "12",     label: "MCP tools" },
];

const API_FEATURES = [
  "PDF text extraction from URL or file",
  "Image metadata analysis",
  "Web scraping & structured extraction",
  "SHA-256 / MD5 hash computation",
  "QR code generation as base64 PNG",
  "JSON validation and schema checking",
  "Token & character counting (LLM-aware)",
  "URL safety scanning",
  "Base64 encode / decode",
  "Markdown-to-HTML rendering",
  "Diff computation between two texts",
  "Password strength scoring",
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Showcase() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  const [copied, setCopied] = useState(false);
  const mcpEndpoint = "https://toolora.replit.app/api/mcp";

  useEffect(() => { document.title = "Toolora — Free Browser-Side Tools Platform"; }, []);

  function copy() {
    navigator.clipboard.writeText(mcpEndpoint).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="min-h-screen bg-[#080a0f] text-white overflow-x-hidden">

      {/* ── Sticky nav ───────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 bg-[#080a0f]/80 backdrop-blur border-b border-white/5">
        <Link href="/">
          <span className="font-bold text-lg tracking-tight">
            Toolora<span className="text-purple-400">.</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing">
            <span className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">Pricing</span>
          </Link>
          <Link href="/api-docs">
            <span className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer">API</span>
          </Link>
          <Link href="/">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold bg-purple-600 hover:bg-purple-500 transition-colors text-white px-4 py-1.5 rounded-full cursor-pointer">
              Try it free <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20"
      >
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative max-w-4xl mx-auto"
        >
          <p className="text-base sm:text-xl font-extrabold text-white mb-6 border border-white/10 bg-white/5 rounded-2xl px-6 py-3 inline-block">
            I built a full privacy-first SaaS —&nbsp;
            <span className="text-purple-400">20+ tools</span>, an Agent API, and an MCP server —&nbsp;
            in&nbsp;<span className="text-purple-400">one week</span>, using Replit AI.
          </p>

          <Tag><Shield className="w-3 h-3" /> Privacy First · No Uploads · 100% Free</Tag>

          <h1 className="mt-6 text-5xl sm:text-7xl font-extrabold leading-[1.05] tracking-tight">
            Tools that work{" "}
            <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">
              entirely
            </span>
            <br className="hidden sm:block" />
            {" "}in your browser
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            20+ free tools — PDF merge, image compression, hash generation, QR codes,
            JSON formatting, and more. Your files never leave your device. Not even for a millisecond.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-7 py-3.5 rounded-full text-base cursor-pointer transition-colors"
              >
                Explore all tools <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
            <Link href="/api-docs">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium px-7 py-3.5 rounded-full text-base cursor-pointer transition-colors"
              >
                Agent API <Code2 className="w-4 h-4" />
              </motion.span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 text-xs"
        >
          <ChevronDown className="w-4 h-4 animate-bounce" />
          scroll
        </motion.div>
      </motion.section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="text-4xl font-extrabold text-white">{s.value}</div>
              <div className="mt-1 text-sm text-white/40">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Video section ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <Reveal className="text-center mb-10">
          <Tag><Zap className="w-3 h-3" /> See it in action</Tag>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold">Watch the intro</h2>
          <p className="mt-3 text-white/50 text-base max-w-lg mx-auto">
            Two minutes. Everything you need to know about why Toolora exists and how it works.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-purple-900/20" style={{ aspectRatio: "16/9" }}>
            <iframe
              src={`${window.location.origin}/toolora-video`}
              className="w-full h-full"
              allow="autoplay"
              title="Toolora Intro Video"
            />
          </div>
          <p className="mt-4 text-center text-xs text-white/30">
            Produced entirely with code — no screen recording, no talking head
          </p>
        </Reveal>
      </section>

      {/* ── Privacy promises ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <Reveal>
          <Tag><Lock className="w-3 h-3" /> How it works</Tag>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold">Privacy isn't a feature.<br />It's the architecture.</h2>
          <p className="mt-3 text-white/50 max-w-xl">
            Most "free" tools upload your files to servers, store them, and use them for ad targeting.
            Toolora is built differently — every tool runs locally using WebAssembly and browser APIs.
          </p>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {PROMISES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center mb-4">
                  <p.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="font-semibold text-white">{p.title}</div>
                <div className="mt-1.5 text-sm text-white/50 leading-relaxed">{p.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Tool grid ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white/[0.015] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <Tag><Zap className="w-3 h-3" /> The tools</Tag>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold">Everything runs locally.<br />Nothing waits for a server.</h2>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOOLS.map((tool, i) => (
              <Reveal key={tool.label} delay={i * 0.07}>
                <Link href={tool.href}>
                  <motion.div
                    whileHover={{ y: -3, borderColor: "rgba(147,51,234,0.4)" }}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 cursor-pointer transition-colors h-full"
                  >
                    <span className="inline-block text-xs text-purple-400 font-semibold bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full mb-3">
                      {tool.cat}
                    </span>
                    <tool.icon className="w-6 h-6 text-white/70 mb-3" />
                    <div className="font-semibold text-white text-sm">{tool.label}</div>
                    <div className="mt-1 text-xs text-white/45 leading-relaxed">{tool.desc}</div>
                  </motion.div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-8 text-center">
            <Link href="/">
              <span className="text-sm text-purple-400 hover:text-purple-300 transition-colors cursor-pointer inline-flex items-center gap-1">
                See all 20+ tools <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── For agents / devs ────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <Reveal>
          <Tag><Cpu className="w-3 h-3" /> For AI agents & developers</Tag>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold">Tools AI agents<br />can't self-execute.</h2>
          <p className="mt-3 text-white/50 max-w-xl">
            Language models can reason about files, but they can't open a PDF, read an image, or hash a file.
            The Toolora Agent API gives agents real tool-use capabilities — with x402 micropayment support built in.
          </p>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {/* API card */}
          <Reveal>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-bold text-white">Agent API</div>
                  <div className="text-xs text-white/40">x402 + API key auth</div>
                </div>
              </div>
              <div className="space-y-2">
                {API_FEATURES.slice(0, 6).map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-white/60">
                    <Check className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                    {f}
                  </div>
                ))}
                <div className="text-xs text-white/30 pt-1">+ 6 more endpoints</div>
              </div>
              <div className="mt-5 space-y-2">
                <div className="text-xs text-white/40 font-medium">Plans</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[["Free","200/mo"],["Pro","5k/mo"],["Team","50k/mo"]].map(([name, calls]) => (
                    <div key={name} className="rounded-lg border border-white/8 bg-white/[0.03] py-2 px-1">
                      <div className="text-xs font-bold text-white">{name}</div>
                      <div className="text-xs text-white/40">{calls}</div>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/api-docs">
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                  View API docs <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </Reveal>

          {/* MCP card */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="font-bold text-white">MCP Server</div>
                  <div className="text-xs text-purple-400">Free · 12 tools · Claude / Cursor</div>
                </div>
              </div>
              <p className="text-sm text-white/55 leading-relaxed mb-5">
                Drop the Toolora MCP endpoint into Claude Desktop or Cursor and your AI assistant
                gains direct access to 12 browser-grade tools — no API key required.
              </p>

              {/* Endpoint box */}
              <div className="rounded-xl bg-black/40 border border-white/8 p-3 font-mono text-xs text-white/70 flex items-center justify-between gap-2">
                <span className="truncate">{mcpEndpoint}</span>
                <button
                  onClick={copy}
                  className="shrink-0 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="mt-5 space-y-1.5">
                {["PDF text extraction","Image analysis","QR generation","Hash & encode","Web scraping","+ 7 more"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-white/55">
                    <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Built for Replit / hackathon note ────────────────────────────── */}
      <section className="py-16 px-6 border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <Tag><Star className="w-3 h-3" /> Replit Hackathon Week 2</Tag>
            <h2 className="mt-5 text-3xl font-bold">Built entirely on Replit.</h2>
            <p className="mt-3 text-white/50 leading-relaxed">
              Toolora was designed, built, deployed, and iterated on inside Replit — from the React
              frontend to the Express API server to the PostgreSQL database. Replit is the #1 source
              of traffic to toolora.dev, which says everything about where the builder community lives.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { icon: Users,    value: "Active users",  sub: "in week 1" },
                { icon: BarChart2,value: "#1 referrer",   sub: "replit.com" },
                { icon: Globe,    value: "3 continents",  sub: "day 1 traffic" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
                  <s.icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                  <div className="font-bold text-sm text-white">{s.value}</div>
                  <div className="text-xs text-white/40">{s.sub}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/12 rounded-full blur-[100px]" />
        </div>
        <Reveal className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Your files.{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Your browser.
            </span>
            <br />Your choice.
          </h2>
          <p className="mt-5 text-white/50 text-lg">
            No sign-up. No uploads. No ads. Just tools that work.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-4 rounded-full text-base cursor-pointer transition-colors"
              >
                Open Toolora <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
            <Link href="/pricing">
              <span className="text-sm text-white/50 hover:text-white transition-colors cursor-pointer">
                View API pricing →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
        <span>Toolora · toolora.dev · Free browser tools, forever</span>
        <div className="flex gap-6">
          <Link href="/privacy"><span className="hover:text-white/60 transition-colors cursor-pointer">Privacy</span></Link>
          <Link href="/terms"><span className="hover:text-white/60 transition-colors cursor-pointer">Terms</span></Link>
          <Link href="/blog"><span className="hover:text-white/60 transition-colors cursor-pointer">Blog</span></Link>
        </div>
      </footer>
    </div>
  );
}
