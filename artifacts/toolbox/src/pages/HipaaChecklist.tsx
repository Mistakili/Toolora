import { useState } from "react";
import { Link } from "wouter";
import { ShieldCheck, Download, Printer, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Lock, Building2, Mail } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const CHECKLIST = [
  {
    section: "Data Residency & Transmission",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    items: [
      {
        id: 1,
        question: "Does the tool upload your files to a remote server?",
        detail: "Open DevTools → Network tab, then use the tool. If you see a POST request with your file payload, the file is leaving your device. This is the single most important check for HIPAA compliance.",
        passIf: "No network requests carry file content. All processing is local (WebAssembly, File API).",
        failIf: "Any upload request to the vendor's servers, even over HTTPS.",
        risk: "high",
      },
      {
        id: 2,
        question: "Does the tool process data entirely in the browser?",
        detail: "Legitimate browser-side tools use WebAssembly or native browser APIs (Canvas, FileReader, Web Workers). You can verify this by disconnecting from the internet — the tool should still work.",
        passIf: "Tool functions fully offline after initial page load.",
        failIf: "Tool fails or produces errors when network is disconnected.",
        risk: "high",
      },
      {
        id: 3,
        question: "Does the tool transmit metadata (filename, file size, user agent) to a tracking backend?",
        detail: "Many 'privacy-friendly' tools still phone home with metadata. Filename alone can reveal sensitive context. Filter Network tab for XHR/Fetch requests and inspect their payloads.",
        passIf: "No metadata about processed files is sent to any third-party server.",
        failIf: "Tracking beacons or analytics events contain file names, sizes, or content hashes.",
        risk: "medium",
      },
      {
        id: 4,
        question: "Are third-party analytics scripts (Google Analytics, Hotjar, Mixpanel) present that could inadvertently capture PHI?",
        detail: "Session-recording tools like Hotjar can capture form inputs and file interaction. Audit the tool's Content Security Policy and loaded scripts.",
        passIf: "No third-party session recording or behavioral analytics scripts are loaded.",
        failIf: "Hotjar, FullStory, Mouseflow, or similar session recorders are present.",
        risk: "medium",
      },
    ],
  },
  {
    section: "Third-Party Risk & Legal",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    items: [
      {
        id: 5,
        question: "Does the tool use third-party CDNs or APIs that could receive data?",
        detail: "Some tools route file processing through third-party APIs (OCR services, compression APIs, conversion services). These sub-processors inherit your HIPAA liability.",
        passIf: "Processing is self-contained. No third-party APIs receive file content.",
        failIf: "Files are forwarded to sub-processors (e.g., AWS Lambda, Google Vision API, Cloudinary).",
        risk: "high",
      },
      {
        id: 6,
        question: "Has the vendor signed or offered a Business Associate Agreement (BAA)?",
        detail: "Under HIPAA, any vendor that handles PHI on your behalf must sign a BAA. Without it, you bear full liability for any breach. Note: tools that never receive PHI (browser-side) do not require a BAA.",
        passIf: "Vendor offers a BAA, OR the tool is provably browser-side and never receives PHI.",
        failIf: "Vendor receives PHI but has no BAA or refuses to sign one.",
        risk: "high",
      },
      {
        id: 7,
        question: "Does the privacy policy explicitly address PHI and healthcare data?",
        detail: "Generic privacy policies that don't mention healthcare data are a red flag. Look for explicit statements about HIPAA, PHI, and how health data is handled differently from consumer data.",
        passIf: "Policy explicitly addresses PHI, HIPAA compliance posture, and healthcare use cases.",
        failIf: "Privacy policy is generic, mentions selling/sharing data with 'partners', or is silent on healthcare.",
        risk: "medium",
      },
      {
        id: 8,
        question: "Are sub-processors (downstream vendors) disclosed and auditable?",
        detail: "HIPAA-covered entities need to know where their data flows. Vendors that rely on AWS, Azure, or Google infrastructure must have DPAs with those providers — and should disclose it.",
        passIf: "Sub-processor list is published and kept current. All sub-processors have appropriate agreements.",
        failIf: "Sub-processors are undisclosed or the vendor refuses to provide a list.",
        risk: "medium",
      },
    ],
  },
  {
    section: "Access Controls & Audit Logging",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    items: [
      {
        id: 9,
        question: "Does the tool require authentication before accessing patient or client data?",
        detail: "HIPAA requires access controls for PHI. Tools accessible without login and usable by anyone with the URL present a risk if used with real patient data.",
        passIf: "Tool requires SSO or organizational authentication for team use.",
        failIf: "Anyone with the link can use the tool, no audit trail of who processed what.",
        risk: "medium",
      },
      {
        id: 10,
        question: "Can tool access be restricted by role or user within your organization?",
        detail: "The minimum necessary standard under HIPAA requires limiting access to PHI to only those who need it. RBAC (role-based access control) is expected in enterprise HIPAA-covered workflows.",
        passIf: "Admin can provision/revoke access per user or role.",
        failIf: "All-or-nothing access — no ability to restrict specific users.",
        risk: "medium",
      },
      {
        id: 11,
        question: "Does the tool support audit logging of who accessed or processed which files?",
        detail: "HIPAA's Security Rule requires audit controls — records of activity in systems containing PHI. If the tool processes files server-side, it must log access. Browser-side tools shift this responsibility to your own device logs.",
        passIf: "Tamper-evident audit logs available showing user, timestamp, and action.",
        failIf: "No audit trail. No way to determine who processed what and when.",
        risk: "high",
      },
      {
        id: 12,
        question: "Can you revoke access and request data deletion on demand?",
        detail: "Your organization must be able to terminate a business relationship and ensure PHI is deleted from vendor systems. This is part of BAA termination clauses.",
        passIf: "Vendor commits to deletion within a specified timeframe (typically 30–60 days) upon BAA termination.",
        failIf: "No deletion SLA. Vendor retains data indefinitely or has no formal offboarding process.",
        risk: "high",
      },
    ],
  },
  {
    section: "Data Retention & Disposal",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    items: [
      {
        id: 13,
        question: "How long does the tool retain uploaded files on its servers?",
        detail: "Many free tools retain files for 1–24 hours, sometimes longer. Even temporary retention creates risk exposure. Check the privacy policy or terms for explicit retention windows.",
        passIf: "Files are processed and immediately discarded in memory, OR retention is under 1 hour with automatic deletion.",
        failIf: "Retention period is unclear, greater than 24 hours, or not stated.",
        risk: "high",
      },
      {
        id: 14,
        question: "Is there an explicit data deletion SLA in the Terms of Service?",
        detail: "Vague terms like 'we delete files periodically' are not sufficient for HIPAA compliance. Look for specific time commitments.",
        passIf: "Terms state an explicit retention cap (e.g., 'files deleted within 2 hours of processing').",
        failIf: "Terms are vague, silent on retention, or give the vendor discretion over retention periods.",
        risk: "medium",
      },
      {
        id: 15,
        question: "Can you manually trigger immediate deletion of processed files?",
        detail: "In the event of an accidental PHI upload, you need a way to immediately delete the data. A 'delete my file now' function or a documented emergency deletion request process is essential.",
        passIf: "In-app deletion button, OR a documented emergency deletion contact with guaranteed response SLA.",
        failIf: "No deletion mechanism. You must wait for automatic retention window expiry.",
        risk: "high",
      },
    ],
  },
  {
    section: "Encryption",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-200 dark:border-indigo-800",
    items: [
      {
        id: 16,
        question: "Is data encrypted in transit (TLS 1.2 or higher)?",
        detail: "HIPAA requires encryption for PHI in transit. Check that the tool uses HTTPS and verify the TLS version. TLS 1.0 and 1.1 are deprecated and insufficient.",
        passIf: "HTTPS with TLS 1.2+. Verify via browser padlock or SSL Labs test.",
        failIf: "HTTP (no encryption), or TLS 1.0/1.1 which are no longer considered secure.",
        risk: "high",
      },
      {
        id: 17,
        question: "Is data encrypted at rest on the vendor's servers?",
        detail: "PHI stored on vendor infrastructure must be encrypted at rest. AES-256 is the standard. Ask the vendor for their encryption specification.",
        passIf: "AES-256 encryption at rest documented in security whitepaper or BAA.",
        failIf: "Vendor cannot confirm encryption at rest, or documentation is unavailable.",
        risk: "high",
      },
      {
        id: 18,
        question: "Does the vendor share their encryption key management practices?",
        detail: "Who holds the encryption keys matters. If the vendor holds the keys and experiences a breach, your data is exposed. Customer-managed keys (CMKs) give you more control.",
        passIf: "Vendor uses HSMs or dedicated key management infrastructure. CMKs available for enterprise plans.",
        failIf: "Vendor cannot explain key management, or uses shared/software-based key storage.",
        risk: "medium",
      },
    ],
  },
  {
    section: "Incident Response",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    items: [
      {
        id: 19,
        question: "Does the vendor have a documented breach notification procedure meeting HIPAA's 60-day requirement?",
        detail: "HIPAA requires business associates to notify covered entities within 60 days of discovering a breach of PHI. This must be in your BAA and the vendor must have an internal IR plan.",
        passIf: "BAA includes breach notification clause with ≤60-day window. Vendor has a documented IR plan.",
        failIf: "BAA has no notification clause, or notification window exceeds 60 days.",
        risk: "high",
      },
      {
        id: 20,
        question: "Is there a security contact or responsible disclosure policy for reporting vulnerabilities?",
        detail: "Vendors without a security contact or bug bounty program are less likely to have a mature security posture. This is a proxy indicator of overall security culture.",
        passIf: "security@[vendor].com exists, OR HackerOne/Bugcrowd program, OR responsible disclosure policy published.",
        failIf: "No security contact. Vulnerabilities would need to be reported through general support.",
        risk: "low",
      },
    ],
  },
];

const riskBadge: Record<string, { label: string; color: string }> = {
  high: { label: "High Risk", color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" },
  medium: { label: "Medium Risk", color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" },
  low: { label: "Low Risk", color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" },
};

function ChecklistItem({ item }: { item: typeof CHECKLIST[0]["items"][0] }) {
  const [checked, setChecked] = useState<"pass" | "fail" | "na" | null>(null);
  const badge = riskBadge[item.risk];
  return (
    <div className={`rounded-xl border p-5 transition-colors ${checked === "pass" ? "border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20" : checked === "fail" ? "border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20" : "border-border bg-card"}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <span className="font-bold text-muted-foreground text-sm w-6 shrink-0 mt-0.5">{item.id}.</span>
          <p className="font-semibold text-sm leading-snug">{item.question}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${badge.color}`}>{badge.label}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed ml-9 mb-3">{item.detail}</p>
      <div className="ml-9 space-y-1 mb-4">
        <div className="flex items-start gap-2 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
          <span className="text-green-700 dark:text-green-400"><strong>Pass if:</strong> {item.passIf}</span>
        </div>
        <div className="flex items-start gap-2 text-xs">
          <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
          <span className="text-red-700 dark:text-red-400"><strong>Fail if:</strong> {item.failIf}</span>
        </div>
      </div>
      <div className="ml-9 flex gap-2 print:hidden">
        {(["pass", "fail", "na"] as const).map(v => (
          <button
            key={v}
            onClick={() => setChecked(checked === v ? null : v)}
            className={`text-xs px-3 py-1 rounded-full border font-semibold transition-colors ${checked === v
              ? v === "pass" ? "bg-green-500 text-white border-green-500"
              : v === "fail" ? "bg-red-500 text-white border-red-500"
              : "bg-muted text-muted-foreground border-border"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
          >
            {v === "pass" ? "✓ Pass" : v === "fail" ? "✗ Fail" : "N/A"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HipaaChecklist() {
  useSEO({
    title: "HIPAA Compliance Audit Checklist for Online Tools — Free Download | Toolora",
    description: "A 20-point checklist for compliance officers and IT security teams to audit any online tool for HIPAA compliance. Covers data residency, BAA, encryption, audit logging, and incident response.",
  });

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "unlocked" | "already" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source: "hipaa-checklist" }),
      });
      const data = await res.json() as { ok?: boolean; alreadySubscribed?: boolean };
      if (!res.ok) { setStatus("error"); return; }
      setStatus(data.alreadySubscribed ? "already" : "unlocked");
    } catch {
      setStatus("error");
    }
  }

  const unlocked = status === "unlocked" || status === "already";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-5 border border-red-500/20">
          <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Compliance Resource
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
          The HIPAA Compliance Audit Checklist for Online Tools
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          20 audit points for compliance officers and IT security teams to evaluate any browser-based tool before allowing it to process protected health information (PHI). Covers data residency, BAAs, encryption, access controls, and incident response.
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          {["20 audit checkpoints", "6 risk categories", "Pass / Fail criteria for each", "Interactive — mark items as you audit"].map(tag => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">{tag}</span>
          ))}
        </div>
      </div>

      {/* Preview items — always visible */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Preview — first 4 items</h2>
        <div className="space-y-3 pointer-events-none opacity-80">
          {CHECKLIST[0].items.slice(0, 2).map(item => <ChecklistItem key={item.id} item={item} />)}
        </div>
        <div className="relative mt-3">
          <div className="space-y-3 blur-sm pointer-events-none">
            {CHECKLIST[0].items.slice(2, 4).map(item => <ChecklistItem key={item.id} item={item} />)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
      </div>

      {/* Email gate */}
      {!unlocked ? (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-8 text-center mb-10">
          <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Get the full 20-point checklist</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Enter your email to unlock all 20 audit checkpoints — covering encryption, incident response, data retention, and access controls. Free. No spam.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
            <label htmlFor="checklist-email" className="sr-only">Email address</label>
            <input
              id="checklist-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="compliance@yourorg.com"
              required
              autoComplete="email"
              className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 whitespace-nowrap flex items-center gap-2"
            >
              {status === "loading" ? "..." : <><Download className="w-4 h-4" /> Unlock</>}
            </button>
          </form>
          {status === "error" && <p className="text-destructive text-xs mt-3">Something went wrong — try again or email support@toolora.dev</p>}
          <p className="text-xs text-muted-foreground mt-3">No spam. Unsubscribe any time.</p>
        </div>
      ) : (
        <>
          {/* Unlocked banner */}
          <div className="rounded-xl border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-4 flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                {status === "already" ? "Welcome back — you're already subscribed. Checklist unlocked." : "Checklist unlocked — and you're subscribed for future resources."}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors shrink-0 print:hidden"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
          </div>

          {/* Full checklist */}
          <div className="space-y-10">
            {CHECKLIST.map(section => (
              <div key={section.section}>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 border ${section.bg} ${section.color} ${section.border}`}>
                  {section.section}
                </div>
                <div className="space-y-3">
                  {section.items.map(item => <ChecklistItem key={item.id} item={item} />)}
                </div>
              </div>
            ))}
          </div>

          {/* Verdict box */}
          <div className="mt-10 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-1">The shortcut verdict</h3>
                <p className="text-sm text-amber-800 dark:text-amber-400 leading-relaxed">
                  If a tool uploads files to any server — even temporarily, even encrypted — and it hasn't signed a BAA with your organization, you cannot legally use it for PHI under HIPAA. Items 1, 6, 11, 13, and 19 are your hard stops. Everything else is defense-in-depth.
                </p>
              </div>
            </div>
          </div>

          {/* Enterprise CTA */}
          <div className="mt-10 rounded-2xl border-2 border-primary/20 bg-primary/5 p-8 text-center print:hidden">
            <Building2 className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Need a tool that passes every item on this list?</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Toolora processes everything in your browser. Files never leave your device — so there's nothing to upload, no BAA required, and no server-side retention risk. It's privacy by architecture.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {["Zero file uploads, ever", "No BAA required", "Verifiable in DevTools", "28 tools for docs, images & data"].map(f => (
                <div key={f} className="flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/enterprise">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors cursor-pointer">
                  <Building2 className="w-4 h-4" /> See Enterprise Plan <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
              <a
                href="mailto:enterprise@toolora.dev?subject=HIPAA%20Compliance%20Inquiry&body=Hi%2C%20I%20downloaded%20the%20HIPAA%20checklist%20and%20would%20like%20to%20learn%20more%20about%20Toolora%20Enterprise.%0A%0AOrganization%3A%0AUse%20case%3A%0ATeam%20size%3A"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full font-semibold text-sm hover:bg-muted transition-colors"
              >
                <Mail className="w-4 h-4" /> Talk to us
              </a>
            </div>
          </div>
        </>
      )}

      {/* Back links */}
      <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-4 text-sm print:hidden">
        <Link href="/enterprise" className="text-primary hover:underline flex items-center gap-1">
          <ArrowRight className="w-3.5 h-3.5" /> Enterprise Plan
        </Link>
        <Link href="/blog/hipaa-compliant-online-document-tools" className="text-primary hover:underline flex items-center gap-1">
          <ArrowRight className="w-3.5 h-3.5" /> HIPAA Liability Blog Post
        </Link>
        <Link href="/" className="text-primary hover:underline flex items-center gap-1">
          <ArrowRight className="w-3.5 h-3.5" /> Browse Free Tools
        </Link>
      </div>
    </div>
  );
}
