import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";
import { Zap, Key, Code2, ArrowRight, CheckCircle2, Terminal, Globe, FileText, Image, Database } from "lucide-react";

const N8N_SNIPPET = `// 1. Install the community node in your n8n instance
// Settings → Community Nodes → Install → "n8n-nodes-toolora"

// 2. Add credentials: your Toolora API key
// Credentials → New → Toolora API → paste sk_toolora_...

// 3. Add a Toolora node to any workflow
// Search "Toolora" in the node panel → choose Resource + Operation`;

const ZAPIER_SNIPPET = `// Use "Webhooks by Zapier" or the built-in HTTP action:
POST https://toolora.dev/api/agent/pdf/text
Authorization: Bearer sk_toolora_your_key_here
Content-Type: multipart/form-data
Body: file=<your PDF>

// Response:
{ "text": "...", "pages": 12, "words": 3847, "chars": 21400 }`;

const MAKE_SNIPPET = `// Use Make's HTTP module:
Method: POST
URL: https://toolora.dev/api/agent/url/read
Headers: Authorization: Bearer sk_toolora_your_key_here
Body Type: Raw (JSON)
Body: { "url": "https://example.com/article" }

// Response:
{ "title": "...", "content": "...", "excerpt": "..." }`;

const CURL_SNIPPET = `# Extract text from a PDF
curl -X POST https://toolora.dev/api/agent/pdf/text \\
  -H "Authorization: Bearer sk_toolora_your_key_here" \\
  -F "file=@document.pdf"

# Generate a QR code
curl -X POST https://toolora.dev/api/agent/qr \\
  -H "Authorization: Bearer sk_toolora_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "https://toolora.dev", "size": 300}'

# Convert CSV to JSON
curl -X POST https://toolora.dev/api/agent/csv/to-json \\
  -H "Authorization: Bearer sk_toolora_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"csv": "name,age\\nAlice,30\\nBob,25"}'`;

const tools = [
  { icon: FileText, label: "PDF Extract Text", endpoint: "/api/agent/pdf/text", method: "POST", input: "PDF file (multipart)" },
  { icon: FileText, label: "PDF Extract Structure", endpoint: "/api/agent/pdf/extract", method: "POST", input: "PDF file (multipart)" },
  { icon: Image, label: "OCR Image", endpoint: "/api/agent/ocr", method: "POST", input: "Image file (multipart)" },
  { icon: FileText, label: "DOCX Extract Text", endpoint: "/api/agent/docx/text", method: "POST", input: "DOCX file (multipart)" },
  { icon: Database, label: "Excel to JSON", endpoint: "/api/agent/excel/to-json", method: "POST", input: "XLSX/CSV file (multipart)" },
  { icon: Globe, label: "Read URL", endpoint: "/api/agent/url/read", method: "POST", input: '{"url": "..."}' },
  { icon: Globe, label: "Scrape URL (JS)", endpoint: "/api/agent/url/scrape", method: "POST", input: '{"url": "...", "format": "markdown"}' },
  { icon: Database, label: "CSV to JSON", endpoint: "/api/agent/csv/to-json", method: "POST", input: '{"csv": "..."}' },
  { icon: Database, label: "JSON to CSV", endpoint: "/api/agent/json/to-csv", method: "POST", input: '{"data": [...]}' },
  { icon: Code2, label: "Generate QR Code", endpoint: "/api/agent/qr", method: "POST", input: '{"text": "...", "size": 300}' },
];

const integrations = [
  {
    name: "n8n",
    logo: "🔴",
    badge: "Community Node",
    badgeColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    headline: "Install the official Toolora community node",
    description: "One-click install from n8n's community node registry. Exposes all Toolora API tools as native n8n actions — no HTTP configuration needed.",
    steps: [
      "Go to Settings → Community Nodes → Install",
      'Search for "n8n-nodes-toolora" and install',
      "Add your Toolora API key under Credentials → Toolora API",
      "Drop a Toolora node into any workflow",
    ],
    code: N8N_SNIPPET,
    cta: "View on npm",
    ctaHref: "https://www.npmjs.com/package/n8n-nodes-toolora",
  },
  {
    name: "Zapier",
    logo: "🔶",
    badge: "HTTP Action",
    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    headline: "Use Toolora in any Zap via HTTP Request",
    description: 'Add a "Webhooks by Zapier" or "HTTP Request" action to any Zap and point it at any Toolora endpoint. No custom integration required.',
    steps: [
      "Add a Zap action: Webhooks by Zapier → POST",
      "Set URL to https://toolora.dev/api/agent/<endpoint>",
      "Add header: Authorization: Bearer sk_toolora_...",
      "Map your Zap data to the request body",
    ],
    code: ZAPIER_SNIPPET,
    cta: "See all endpoints",
    ctaHref: "/api-docs",
  },
  {
    name: "Make",
    logo: "🟣",
    badge: "HTTP Module",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    headline: "Call Toolora from any Make scenario",
    description: "Use Make's HTTP module to call any Toolora endpoint. Works with every module that can send an HTTP request — drag, drop, connect.",
    steps: [
      "Add a module: HTTP → Make a Request",
      "Set method to POST, URL to the Toolora endpoint",
      "Add header Authorization with your API key",
      "Map your scenario data to the JSON body",
    ],
    code: MAKE_SNIPPET,
    cta: "Get an API key",
    ctaHref: "/api-keys",
  },
];

export default function Integrations() {
  useSEO({
    title: "Integrations — Use Toolora in n8n, Zapier & Make",
    description:
      "Connect Toolora's PDF, OCR, and data tools to n8n, Zapier, Make, and any REST client. Official n8n community node available. API key required.",
    canonical: "https://toolora.dev/integrations",
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4 text-center border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
            <Zap className="w-4 h-4" />
            Automation-ready REST API
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Use Toolora inside your<br className="hidden md:block" /> automation workflows
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            10 API endpoints for PDF extraction, OCR, URL reading, data conversion, and QR code generation.
            Native n8n community node. Works with Zapier, Make, and any HTTP client.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/api-keys">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
                <Key className="w-4 h-4" /> Get a Free API Key
              </button>
            </Link>
            <Link href="/api-docs">
              <button className="flex items-center gap-2 px-6 py-3 bg-muted border border-border rounded-xl font-semibold hover:bg-muted/80 transition-colors">
                <Code2 className="w-4 h-4" /> API Reference
              </button>
            </Link>
          </div>
          <div className="mt-12 rounded-2xl overflow-hidden border border-border/40 shadow-2xl max-w-3xl mx-auto">
            <img
              src="/images/integrations-hero.png"
              alt="Toolora automation workflow connectors for n8n, Zapier, and Make"
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* API Endpoints table */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Available Endpoints</h2>
          <p className="text-muted-foreground mb-8">All endpoints are at <code className="text-xs bg-muted px-1.5 py-0.5 rounded">https://toolora.dev/api/agent/</code> and accept an API key via <code className="text-xs bg-muted px-1.5 py-0.5 rounded">Authorization: Bearer sk_toolora_...</code></p>
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Tool</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Endpoint</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Input</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((t, i) => (
                  <tr key={t.endpoint} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <t.icon className="w-4 h-4 text-primary shrink-0" />
                      {t.label}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <code className="text-xs text-primary">{t.endpoint}</code>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">{t.input}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Integration guides */}
      <section className="py-8 px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-2xl font-bold">Integration Guides</h2>

          {integrations.map((integration) => (
            <div key={integration.name} className="border border-border rounded-2xl overflow-hidden">
              <div className="p-6 md:p-8 border-b border-border bg-muted/20">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{integration.logo}</span>
                      <h3 className="text-xl font-bold">{integration.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${integration.badgeColor}`}>
                        {integration.badge}
                      </span>
                    </div>
                    <p className="font-semibold text-foreground mb-1">{integration.headline}</p>
                    <p className="text-muted-foreground text-sm max-w-2xl">{integration.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Setup Steps</h4>
                  <ol className="space-y-2">
                    {integration.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold mt-0.5">
                          {idx + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-6">
                    {integration.ctaHref.startsWith("http") ? (
                      <a
                        href={integration.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        {integration.cta} <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <Link href={integration.ctaHref} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                        {integration.cta} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Example</h4>
                  <pre className="bg-muted/60 border border-border rounded-xl p-4 text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
                    <code>{integration.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}

          {/* Generic REST */}
          <div className="border border-border rounded-2xl overflow-hidden">
            <div className="p-6 md:p-8 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🖥️</span>
                <h3 className="text-xl font-bold">Any HTTP Client</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted border border-border">cURL / Fetch / Axios / etc.</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-2xl">
                The Toolora API is plain REST — it works anywhere you can make an HTTP request. No SDK needed.
              </p>
            </div>
            <div className="p-6 md:p-8">
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Examples</h4>
              <pre className="bg-muted/60 border border-border rounded-xl p-4 text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
                <code>{CURL_SNIPPET}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-border/50 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to automate?</h2>
          <p className="text-muted-foreground mb-6">Get a free API key and start calling Toolora from your workflows today. No credit card required to start.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/api-keys">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
                <Key className="w-4 h-4" /> Get API Key — Free
              </button>
            </Link>
            <Link href="/pricing">
              <button className="flex items-center gap-2 px-6 py-3 bg-muted border border-border rounded-xl font-semibold hover:bg-muted/80 transition-colors">
                View Pricing <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
            {["Free tier available", "No credit card to start", "10 endpoints", "JSON responses"].map(f => (
              <span key={f} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
