import { useState } from "react";
import { Link } from "wouter";
import {
  ShieldCheck, Lock, FileText, Scale, Heart, Building2,
  CheckCircle2, ArrowRight, Server, Wifi, Eye, Database,
  ChevronDown, ChevronUp, Mail, Zap, Globe, Loader2,
  RotateCcw, CreditCard
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const ENTERPRISE_PRICE_ID = "price_1TI6JODcOSNqIPi8pQChuQIm";
const TEAM_PRICE_ID = "price_1TGWCgDcOSNqIPi8KrXcEcCf";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(v => !v)}
      className="w-full text-left border border-border rounded-xl overflow-hidden hover:border-border/80 transition-colors"
    >
      <div className="flex items-center justify-between px-5 py-4 gap-4">
        <span className="font-medium text-sm sm:text-base">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />}
      </div>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border bg-muted/20">
          <p className="pt-4">{a}</p>
        </div>
      )}
    </button>
  );
}

const USE_CASES = [
  {
    icon: Scale,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    title: "Law Firms & Legal Teams",
    problem: "Attorney-client privilege means client documents cannot touch third-party servers.",
    solution: "Toolora processes every document — contracts, briefs, discovery files — entirely in your browser. No upload, no log, no liability.",
    tools: ["PDF merge & split", "Word extraction", "Document redaction", "OCR for scanned filings"],
  },
  {
    icon: Heart,
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    title: "Healthcare & Medical",
    problem: "HIPAA requires strict controls over where patient data travels and who can access it.",
    solution: "PHI stays on the clinician's device. Toolora never sees it. There's nothing to audit on our side because there's nothing there.",
    tools: ["Medical document extraction", "Image processing for scans", "CSV/spreadsheet parsing", "Secure file conversion"],
  },
  {
    icon: Building2,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    title: "Financial Services",
    problem: "SEC, FCA, and MiFID II create strict rules around where client financial data can be processed.",
    solution: "Trade confirmations, client statements, and financial models never leave your workstation. Toolora is a browser app, not a cloud service.",
    tools: ["Excel & spreadsheet parsing", "PDF statement extraction", "CSV data transformation", "Batch document processing"],
  },
  {
    icon: Globe,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    title: "Government & Defense",
    problem: "ITAR, CMMC, and data sovereignty rules restrict what can touch commercial cloud infrastructure.",
    solution: "Toolora runs entirely in the browser runtime — no cloud dependency for document processing. Works on air-gapped networks after initial page load.",
    tools: ["Classified document handling", "Offline operation", "No telemetry mode", "Self-hosted option"],
  },
];

const FEATURES = [
  { icon: Lock, label: "Zero data transmission", desc: "Files and text are processed in the browser's JavaScript runtime. Nothing is sent to our servers." },
  { icon: Server, label: "No server logs of your content", desc: "We can't log what we never receive. Your documents are invisible to us by architecture." },
  { icon: Wifi, label: "Works offline", desc: "After the initial page load, document processing tools function with no internet connection." },
  { icon: Eye, label: "No compliance risk on our side", desc: "You don't need to audit Toolora's SOC2 because we're not a data processor for your content." },
  { icon: Database, label: "No data retention", desc: "There is no database of your files. Browser memory is cleared when the tab closes." },
  { icon: RotateCcw, label: "30-day money-back guarantee", desc: "If Toolora doesn't work for your team for any reason, we'll refund in full. No questions." },
];

const FAQS = [
  {
    q: "Does Toolora qualify as a HIPAA Business Associate?",
    a: "No — and that's the point. A Business Associate Agreement is required when a vendor handles PHI on your behalf. Because Toolora never receives your files (all processing happens in the browser), we are not a business associate and no BAA is needed. Your documents stay on your device.",
  },
  {
    q: "Can Toolora be used with attorney-client privileged documents?",
    a: "Yes. Since files are processed locally in your browser without being transmitted to any server, using Toolora does not constitute disclosure of privileged communications to a third party. We recommend verifying this with your firm's ethics counsel, but the client-side architecture eliminates the primary legal risk of cloud-based document tools.",
  },
  {
    q: "How can I verify that files aren't being uploaded?",
    a: "Open your browser's DevTools (F12), go to the Network tab, and use any Toolora document tool. You'll see no file upload request because there isn't one. All processing happens in WebAssembly and JavaScript running in the browser tab itself.",
  },
  {
    q: "Does the enterprise plan work on air-gapped networks?",
    a: "The tools themselves function offline once the page has loaded, since processing is browser-based. The Agent API requires internet connectivity. For fully air-gapped deployments, contact us about a self-hosted option.",
  },
  {
    q: "What data does Toolora collect at all?",
    a: "We collect anonymized page view analytics (path visited, browser type, country — no PII), email addresses of users who sign up, and API usage counts (number of calls, not content). We do not collect, store, or process the content of any files you use with the browser tools.",
  },
  {
    q: "How does the 30-day money-back guarantee work?",
    a: "If you're not satisfied for any reason within 30 days of subscribing, email enterprise@toolora.dev and we'll issue a full refund. No forms, no questions, no hoops.",
  },
  {
    q: "Is there a self-hosted option for maximum control?",
    a: "We are evaluating a self-hosted enterprise tier for organizations that require all infrastructure to run within their own environment. Contact us at enterprise@toolora.dev to discuss requirements.",
  },
];

export default function Enterprise() {
  const [loading, setLoading] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useSEO({
    title: "Toolora for Enterprise — Private-by-Default Tools for Regulated Industries",
    description: "Browser-side document tools for law firms, healthcare, financial services, and government. No uploads. No HIPAA risk. No BAA required. 30-day money-back guarantee.",
  });

  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
  const params = new URLSearchParams(window.location.search);
  const justSucceeded = params.get("success") === "1";
  const justCanceled = params.get("canceled") === "1";

  async function handleCheckout(priceId: string, tierId: string) {
    setLoading(tierId);
    setErrMsg(null);
    try {
      const res = await fetch(`${BASE}/api/stripe/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ priceId, returnPath: "/enterprise" }),
      });
      if (res.status === 401) {
        window.location.href = `${BASE}/api/auth/login?returnTo=/enterprise`;
        return;
      }
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
      else setErrMsg(data.error ?? "Something went wrong. Try again or email enterprise@toolora.dev.");
    } catch {
      setErrMsg("Could not start checkout. Try again or email enterprise@toolora.dev.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-24">

      {/* ── Success / canceled banners ────────────────────────────────────── */}
      {justSucceeded && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-900/90 border border-green-600 text-green-200 text-sm rounded-xl px-6 py-3 shadow-xl backdrop-blur">
          🎉 Enterprise plan activated — welcome aboard. Check your email for next steps.
        </div>
      )}
      {justCanceled && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 border border-zinc-600 text-zinc-300 text-sm rounded-xl px-6 py-3 shadow-xl backdrop-blur">
          Checkout canceled — no charge was made.
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-2">
          <ShieldCheck className="w-4 h-4" />
          Private by Architecture, Not Policy
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight">
          Document tools your compliance team<br className="hidden sm:block" />
          <span className="text-primary"> will actually approve</span>
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Toolora processes every file in your browser. Nothing is uploaded.
          Nothing hits our servers. There's no data to breach, audit, or regulate on our side.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => handleCheckout(ENTERPRISE_PRICE_ID, "enterprise-hero")}
            disabled={!!loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm disabled:opacity-60"
          >
            {loading === "enterprise-hero" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            Start Enterprise — $199/month
          </button>
          <a
            href="mailto:enterprise@toolora.dev?subject=Enterprise%20Inquiry&body=Hi%2C%20I%27m%20interested%20in%20Toolora%20for%20my%20organization.%0A%0AOrganization%3A%0ATeam%20size%3A%0AUse%20case%3A"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
          >
            <Mail className="w-4 h-4" /> Questions? Email us
          </a>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <RotateCcw className="w-3.5 h-3.5 text-green-500" />
          <span>30-day money-back guarantee — no questions asked</span>
        </div>
        {errMsg && <p className="text-sm text-red-400">{errMsg}</p>}
      </section>

      {/* ── The core difference ──────────────────────────────────────────── */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
              <Server className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="font-semibold text-red-400">Every other online tool</h3>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {[
              "Uploads your file to their cloud servers",
              "Stores it temporarily (sometimes permanently)",
              "Logs access and content for debugging",
              "Requires a BAA for HIPAA-covered data",
              "Creates a data processor relationship",
              "Your file is someone else's problem now",
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✕</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-semibold text-green-400">Toolora</h3>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {[
              "Runs entirely in your browser tab",
              "Files are never transmitted anywhere",
              "No server logs of your content — ever",
              "No BAA needed (we're not a data processor)",
              "Works offline after initial page load",
              "Nothing to breach on our side",
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Use cases ────────────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold">Built for regulated industries</h2>
          <p className="text-muted-foreground">The same architecture that makes Toolora free for individuals makes it uniquely suitable for compliance-sensitive organizations.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {USE_CASES.map(({ icon: Icon, color, bg, title, problem, solution, tools }) => (
            <div key={title} className={`rounded-2xl border p-6 space-y-4 ${bg}`}>
              <div className="flex items-center gap-3">
                <Icon className={`w-6 h-6 ${color}`} />
                <h3 className="font-semibold">{title}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground"><span className="text-foreground font-medium">The problem: </span>{problem}</p>
                <p className="text-muted-foreground"><span className="text-foreground font-medium">How Toolora helps: </span>{solution}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tools.map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-background/60 border border-border text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold">What you get</h2>
          <p className="text-muted-foreground">28 browser-side tools, an Agent API, and an MCP server — all with the same privacy guarantee.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-xl border border-border bg-muted/20 p-5 space-y-2 hover:border-primary/30 transition-colors">
              <Icon className="w-5 h-5 text-primary" />
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold">Get started in 60 seconds</h2>
          <p className="text-muted-foreground">Pick a plan, pay with card, and your team has access immediately.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              id: "team",
              priceId: TEAM_PRICE_ID,
              name: "Team",
              price: "$79",
              period: "/month",
              desc: "Up to 10 users. All tools, API access, MCP server.",
              features: ["50,000 API calls/month", "All 28 browser tools", "MCP server access", "Team dashboard", "Priority support"],
              cta: "Start Team Plan",
              highlight: false,
            },
            {
              id: "enterprise",
              priceId: ENTERPRISE_PRICE_ID,
              name: "Enterprise",
              price: "$199",
              period: "/month",
              desc: "Unlimited users. Compliance-ready documentation included.",
              features: ["Unlimited API calls", "All browser tools + API", "Architecture docs for auditors", "Usage audit log", "Dedicated support", "Custom invoicing"],
              cta: "Start Enterprise Plan",
              highlight: true,
            },
            {
              id: "selfhosted",
              priceId: null,
              name: "Self-Hosted",
              price: "Custom",
              period: "",
              desc: "Run Toolora entirely within your own infrastructure.",
              features: ["Air-gap compatible", "Your servers, your logs", "Meets strictest data sovereignty", "On-premise deployment", "ITAR / CMMC compatible"],
              cta: "Email us",
              highlight: false,
            },
          ].map(tier => (
            <div key={tier.id} className={`rounded-2xl border p-6 space-y-5 flex flex-col ${tier.highlight ? "border-primary bg-primary/10" : "border-border bg-background/60"}`}>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{tier.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-bold">{tier.price}</span>
                  <span className="text-muted-foreground text-sm">{tier.period}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{tier.desc}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {tier.priceId ? (
                <button
                  onClick={() => handleCheckout(tier.priceId!, tier.id)}
                  disabled={!!loading}
                  className={`w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 ${tier.highlight ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`}
                >
                  {loading === tier.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading === tier.id ? "Redirecting…" : tier.cta}
                </button>
              ) : (
                <a
                  href="mailto:enterprise@toolora.dev?subject=Self-Hosted%20Inquiry"
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-colors"
                >
                  {tier.cta}
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="text-center flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <RotateCcw className="w-4 h-4 text-green-500" />
          All paid plans include a <strong className="text-foreground">30-day money-back guarantee</strong>. No questions asked.
        </div>
        {errMsg && <p className="text-sm text-red-400 text-center">{errMsg}</p>}
      </section>

      {/* ── Verification block ───────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-muted/20 p-8 space-y-4">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" /> Verify it yourself in 30 seconds
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Open any Toolora document tool. Open your browser's DevTools (F12). Click the Network tab. Use the tool.
          You'll see zero upload requests — because there are none. The processing happens in the tab itself,
          using WebAssembly and browser-native APIs.
        </p>
        <p className="text-sm text-muted-foreground">
          This isn't a policy claim backed by a privacy policy page. It's a verifiable architectural property.
          Your IT security team can confirm it in minutes.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/tools/pdf/pdf-merge" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <FileText className="w-3.5 h-3.5" /> Try PDF Merge <ArrowRight className="w-3 h-3" />
          </Link>
          <Link href="/tools/developer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <Zap className="w-3.5 h-3.5" /> Try Developer Tools <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold">Compliance questions answered</h2>
          <p className="text-muted-foreground">The questions your legal and security teams will ask.</p>
        </div>
        <div className="space-y-3">
          {FAQS.map(faq => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="text-center space-y-6 py-4">
        <h2 className="text-2xl sm:text-3xl font-display font-bold">Ready to get your team set up?</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Self-serve setup. Instant access. 30-day money-back if it's not the right fit.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => handleCheckout(ENTERPRISE_PRICE_ID, "enterprise-bottom")}
            disabled={!!loading}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading === "enterprise-bottom" ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
            Start Enterprise Plan — $199/mo
          </button>
          <a
            href="mailto:enterprise@toolora.dev?subject=Enterprise%20Inquiry&body=Hi%2C%20I%27m%20interested%20in%20Toolora%20for%20my%20organization.%0A%0AOrganization%3A%0ATeam%20size%3A%0AUse%20case%3A%0ACompliance%20requirements%3A"
            className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-xl font-semibold hover:bg-muted transition-colors text-sm"
          >
            <Mail className="w-4 h-4" /> Questions first? Email us
          </a>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <RotateCcw className="w-3.5 h-3.5 text-green-500" />
          30-day money-back guarantee on all plans
        </div>
        {errMsg && <p className="text-sm text-red-400">{errMsg}</p>}
        <p className="text-xs text-muted-foreground">
          Or explore the tools yourself first —{" "}
          <Link href="/" className="text-primary hover:underline">start with the free plan →</Link>
        </p>
      </section>

    </div>
  );
}
