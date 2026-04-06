import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";
import { ShieldCheck, XCircle, CheckCircle2, AlertTriangle, ArrowRight, Lock, Building2, FileText, Scale } from "lucide-react";

const risks = [
  {
    title: "File uploads to foreign servers",
    description:
      "When a document tool uploads your files to a US or non-EU server, any processing of personal data (names, IDs, medical records) constitutes a cross-border data transfer under GDPR Art. 44. Without a valid transfer mechanism (SCCs, adequacy decision), this is a violation.",
    severity: "high",
  },
  {
    title: "Data retention without consent",
    description:
      "Most cloud document tools retain uploaded files — sometimes for 24h, sometimes indefinitely. Under GDPR Art. 5(1)(e), personal data may not be kept longer than necessary. Without explicit retention policies and user consent, this is non-compliant.",
    severity: "high",
  },
  {
    title: "Third-party analytics capturing PHI/PII",
    description:
      "Tools embedding Google Analytics, Hotjar, or Mixpanel may capture file names, metadata, or form interactions containing personal data and send it to third-party processors — often without a DPA in place, violating Art. 28.",
    severity: "medium",
  },
  {
    title: "No Data Processing Agreement (DPA)",
    description:
      "GDPR Art. 28 requires a signed DPA with any third-party processor handling personal data on your behalf. Most free online tools don't offer DPAs — making any use of them for personal data processing technically non-compliant.",
    severity: "medium",
  },
  {
    title: "Opaque processing locations",
    description:
      "If you can't verify where a tool processes your data (EU vs. US vs. APAC), you can't ensure GDPR compliance. 'We're secure' is not a legal basis.",
    severity: "medium",
  },
];

const howTooloraWorks = [
  {
    icon: Lock,
    title: "Files never leave your device",
    description:
      "Every Toolora tool runs entirely in your browser using WebAssembly. Your PDF, image, or document is processed locally — it is never transmitted to any server. There is no upload.",
  },
  {
    icon: ShieldCheck,
    title: "Zero data retention",
    description:
      "Because nothing is uploaded, nothing is retained. Toolora cannot store your data because it never receives it. This isn't a policy — it's the architecture.",
  },
  {
    icon: FileText,
    title: "No third-party analytics on file content",
    description:
      "Toolora does not use session-recording tools or analytics that capture file interactions. Tool usage is tracked by type (e.g. 'PDF merge used') — never by content.",
  },
  {
    icon: Scale,
    title: "Verifiable by inspection",
    description:
      "Open DevTools → Network tab → use any Toolora tool → observe zero outbound file requests. GDPR compliance is verifiable in seconds, not via an audit.",
  },
];

const comparisons = [
  {
    category: "File upload required",
    toolora: false,
    cloud: true,
    note: "Toolora processes in the browser; cloud tools upload to servers",
  },
  {
    category: "Data crosses international borders",
    toolora: false,
    cloud: true,
    note: "Most cloud tools use US-based servers",
  },
  {
    category: "Server-side data retention",
    toolora: false,
    cloud: true,
    note: "Cloud tools often retain files 24h–indefinitely",
  },
  {
    category: "DPA (Data Processing Agreement) required",
    toolora: false,
    cloud: true,
    note: "No server processing = no DPA needed",
  },
  {
    category: "Third-party analytics on file interactions",
    toolora: false,
    cloud: "Maybe",
    note: "Many free tools embed analytics",
  },
  {
    category: "Works offline after load",
    toolora: true,
    cloud: false,
    note: "Verifiable proof of local processing",
  },
  {
    category: "GDPR-safe for personal data",
    toolora: true,
    cloud: "Depends",
    note: "Check each vendor's DPA and retention policy",
  },
];

const useCases = [
  { role: "Legal & Law Firms", task: "Redacting client documents, extracting clauses from contracts" },
  { role: "HR Departments", task: "Processing CVs, employee documents, and ID scans" },
  { role: "Healthcare (non-HIPAA)", task: "Merging patient intake forms, OCR of handwritten notes" },
  { role: "Finance & Accounting", task: "Extracting data from invoices, bank statements, financial reports" },
  { role: "Government & Public Sector", task: "Processing citizen documents without cloud transfer" },
  { role: "Education", task: "Handling student records, exam documents, and transcripts" },
];

export default function GdprCompliance() {
  useSEO({
    title: "GDPR-Compliant Document Processing — Toolora",
    description:
      "Process PDFs, images, and documents without GDPR risk. Toolora runs entirely in the browser — no uploads, no servers, no data retention. Verifiable in DevTools.",
    canonical: "https://toolora.dev/gdpr",
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4 text-center border-b border-border/50 bg-gradient-to-b from-green-500/5 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium mb-6 border border-green-500/20">
            <ShieldCheck className="w-4 h-4" />
            GDPR-Compliant by Architecture
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Document tools that are<br className="hidden md:block" /> actually GDPR-safe
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Most online document tools upload your files to foreign servers — which is a GDPR problem by default.
            Toolora processes everything in the browser. No uploads. No servers. No legal grey area.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/">
              <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
                <ShieldCheck className="w-4 h-4" /> Try the Tools — Free
              </button>
            </Link>
            <a href="mailto:hello@toolora.dev" className="flex items-center gap-2 px-6 py-3 bg-muted border border-border rounded-xl font-semibold hover:bg-muted/80 transition-colors">
              <Building2 className="w-4 h-4" /> Enterprise Inquiry
            </a>
          </div>
        </div>
      </section>

      {/* The GDPR problem with cloud tools */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-2xl font-bold">Why most document tools create GDPR risk</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            If your team uses cloud-based PDF, OCR, or image tools for documents containing personal data — names, IDs, contracts, health records — you may already have a compliance problem.
          </p>
          <div className="space-y-4">
            {risks.map((risk, i) => (
              <div key={i} className={`border rounded-xl p-5 flex gap-4 ${risk.severity === "high"
                ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
                : "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20"
                }`}>
                <div className="shrink-0 mt-0.5">
                  {risk.severity === "high"
                    ? <XCircle className="w-5 h-5 text-red-500" />
                    : <AlertTriangle className="w-5 h-5 text-amber-500" />
                  }
                </div>
                <div>
                  <div className="font-semibold mb-1 flex items-center gap-2">
                    {risk.title}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${risk.severity === "high"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                      }`}>
                      {risk.severity === "high" ? "High Risk" : "Medium Risk"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Toolora solves this */}
      <section className="py-16 px-4 bg-muted/20 border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">How Toolora eliminates these risks</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            The solution isn't a better privacy policy — it's a different architecture. Browser-side processing removes the risk vector entirely.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {howTooloraWorks.map((item, i) => (
              <div key={i} className="bg-background border border-green-200 dark:border-green-900/40 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-700 dark:text-green-400 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              <strong>How to verify:</strong> Open any Toolora tool → open DevTools (F12) → Network tab → process a document → observe: zero outbound requests carrying your file content. GDPR compliance is auditable in 30 seconds.
            </span>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Toolora vs. cloud document tools</h2>
          <p className="text-muted-foreground mb-8">GDPR compliance factors side by side.</p>
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Factor</th>
                  <th className="text-center px-4 py-3 font-semibold text-primary">Toolora</th>
                  <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Cloud tools</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={i} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-background" : "bg-muted/10"}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{row.category}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{row.note}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.toolora === true
                        ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                        : row.toolora === false
                          ? <XCircle className="w-5 h-5 text-green-500 mx-auto" />
                          : <span className="text-amber-500 font-medium text-xs">{row.toolora}</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.cloud === true
                        ? <CheckCircle2 className="w-5 h-5 text-red-400 mx-auto" />
                        : row.cloud === false
                          ? <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          : <span className="text-amber-500 font-medium text-xs">{row.cloud}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Note: "Cloud tools" refers to typical free online tools (ilovepdf, smallpdf, adobe online, etc.). Enterprise tools with proper DPAs may address some of these points contractually but not architecturally.
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-16 px-4 bg-muted/20 border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Who uses Toolora for compliance</h2>
          <p className="text-muted-foreground mb-8">Any team that handles personal data in documents and needs a defensible processing solution.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((uc, i) => (
              <div key={i} className="bg-background border border-border rounded-xl p-4">
                <div className="font-semibold text-sm mb-1">{uc.role}</div>
                <div className="text-xs text-muted-foreground">{uc.task}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIPAA crosslink */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="border border-border rounded-xl p-6 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">Also need HIPAA compliance?</div>
              <p className="text-sm text-muted-foreground mb-3">
                If you're in healthcare (US), we also publish a detailed HIPAA evaluation checklist for online document tools — the same principles apply.
              </p>
              <Link href="/hipaa-checklist" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                View HIPAA Checklist <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 px-4 border-t border-border/50 bg-gradient-to-b from-transparent to-green-500/5">
        <div className="max-w-2xl mx-auto text-center">
          <Building2 className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Need enterprise support or a formal compliance review?</h2>
          <p className="text-muted-foreground mb-6">
            We can provide technical documentation, architecture diagrams, and written attestations for your legal or compliance team.
            Custom deployment options available.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/enterprise">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
                <Building2 className="w-4 h-4" /> Enterprise Options
              </button>
            </Link>
            <a href="mailto:hello@toolora.dev" className="flex items-center gap-2 px-6 py-3 bg-muted border border-border rounded-xl font-semibold hover:bg-muted/80 transition-colors">
              Contact Us <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
