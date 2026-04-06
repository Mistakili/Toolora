import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Zap, FileText, Code2, Sparkles, Shield } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";
import { useSEO } from "@/hooks/useSEO";

const QUICK_STARTS = [
  {
    icon: FileText,
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
    label: "Word Editor",
    description: "Write, format, and export documents — no sign-in needed.",
    href: "/tools/docx-editor",
  },
  {
    icon: Zap,
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    label: "PDF Tools",
    description: "Merge, split, or extract text from PDFs — all in your browser.",
    href: "/tools/pdf-merge",
  },
  {
    icon: Code2,
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    label: "Developer Tools",
    description: "JSON formatter, Base64, UUID generator, and more.",
    href: "/tools/json-formatter",
  },
];

export default function Welcome() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  useSEO({
    title: "Welcome to Toolora",
    description: "You're in. Start using your privacy-first tools.",
  });

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 60);
    return () => clearTimeout(t);
  }, []);

  const firstName = user?.firstName || user?.email?.split("@")[0] || null;

  return (
    <div
      className={`min-h-screen bg-zinc-950 text-white transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-2xl mx-auto px-4 py-20">

        {/* Top badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 bg-green-900/30 border border-green-700/40 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            You're in
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-3 leading-tight">
          {firstName ? (
            <>Welcome, {firstName}.</>
          ) : (
            <>Welcome to Toolora.</>
          )}
        </h1>
        <p className="text-zinc-400 text-center text-lg mb-12 max-w-md mx-auto leading-relaxed">
          37 tools. All free to use. Your files never leave your device — everything runs right here in your browser.
        </p>

        {/* Quick start cards */}
        <div className="space-y-3 mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
            Popular starting points
          </p>
          {QUICK_STARTS.map(({ icon: Icon, color, iconColor, label, description, href }) => (
            <a
              key={label}
              href={`${BASE}${href}`}
              className={`flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r ${color} hover:scale-[1.01] active:scale-[0.99] transition-all group`}
            >
              <div className={`shrink-0 w-10 h-10 rounded-lg bg-zinc-900/60 flex items-center justify-center ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm">{label}</div>
                <div className="text-zinc-400 text-xs mt-0.5 truncate">{description}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
            </a>
          ))}
        </div>

        {/* Explore all tools */}
        <div className="flex flex-col sm:flex-row gap-3 mb-14">
          <a
            href={`${BASE}/`}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Explore all 37 tools
          </a>
          <a
            href={`${BASE}/api-keys`}
            className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <Code2 className="w-4 h-4" />
            Set up API access
          </a>
        </div>

        {/* Privacy note */}
        <div className="flex items-start gap-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <Shield className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-zinc-200 mb-0.5">Your privacy is the whole point</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Files you process never leave your browser. We don't read them, store them, or send them to a server. Every tool runs locally — that's what makes Toolora different.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
