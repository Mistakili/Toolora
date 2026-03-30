import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Code2, ChevronRight, Home, Copy, Check, Zap, Bot, Globe, FileText, Lock } from "lucide-react";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative group">
      <pre className="bg-[#0d1117] rounded-xl p-4 text-sm font-mono overflow-x-auto border border-border text-green-400/90 leading-relaxed">
        <code>{code}</code>
      </pre>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute top-3 right-3 px-2 py-1 text-xs rounded-lg bg-background border border-border opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-foreground"
      >
        {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
      </button>
    </div>
  );
}

function MethodBadge({ method, paid }: { method: string; paid?: boolean }) {
  const colors: Record<string, string> = {
    GET: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    POST: "bg-green-500/10 text-green-400 border-green-500/30",
  };
  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-0.5 text-xs font-bold rounded border ${colors[method]}`}>{method}</span>
      {paid && (
        <span className="px-2 py-0.5 text-xs font-bold rounded border bg-yellow-500/10 text-yellow-400 border-yellow-500/30 flex items-center gap-1">
          <Zap className="w-3 h-3" /> x402 Paid
        </span>
      )}
    </div>
  );
}

function Endpoint({ method, path, desc, paid }: { method: string; path: string; desc: string; paid?: boolean }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${paid ? "bg-yellow-500/5 border-yellow-500/20" : "bg-muted/30 border-border"}`}>
      <div className="shrink-0 pt-0.5">
        <MethodBadge method={method} paid={paid} />
      </div>
      <div>
        <code className="text-sm font-mono text-foreground">{path}</code>
        <div className="text-xs text-muted-foreground mt-1">{desc}</div>
      </div>
    </div>
  );
}

export default function ApiDocs() {
  useEffect(() => {
    document.title = "API Docs | Toolora";
  }, []);

  const apiBase = typeof window !== "undefined"
    ? window.location.origin.replace(/toolora\.replit\.app/, "toolora-api.replit.app").replace(/:\d+$/, ":8080")
    : "https://toolora-api.replit.app";

  const PRICE = "0.5";
  const NETWORK = "stellar:testnet";

  const paymentPayloadExample = `{
  "txHash": "<your_stellar_tx_hash>",
  "from":   "<your_stellar_address>",
  "amount": "${PRICE}",
  "network": "${NETWORK}"
}`;

  const paymentHeaderExample = `# 1. Base64-encode the payment payload:
PAYLOAD=$(echo '${paymentPayloadExample.replace(/\n/g, " ")}' | base64 -w 0)

# 2. Send request with X-PAYMENT header:
curl -X POST ${apiBase}/api/agent/pdf/text \\
  -H "X-PAYMENT: $PAYLOAD" \\
  -F "file=@your_document.pdf"`;

  const pythonExample = `import requests, base64, json

# After sending XLM on Stellar, build the payment payload
payment = base64.b64encode(json.dumps({
    "txHash":  "<stellar_tx_hash>",
    "from":    "<your_stellar_wallet>",
    "amount":  "${PRICE}",
    "network": "${NETWORK}"
}).encode()).decode()

# Extract text from a PDF
with open("document.pdf", "rb") as f:
    r = requests.post(
        "${apiBase}/api/agent/pdf/text",
        headers={"X-PAYMENT": payment},
        files={"file": f}
    )
print(r.json())
# → {"text": "...", "pages": 12, "words": 4820, "chars": 29100, "info": {...}}`;

  const urlExample = `import requests, base64, json

payment = base64.b64encode(json.dumps({
    "txHash":  "<stellar_tx_hash>",
    "from":    "<your_stellar_wallet>",
    "amount":  "${PRICE}",
    "network": "${NETWORK}"
}).encode()).decode()

# Clean article text from any URL
r = requests.post(
    "${apiBase}/api/agent/url/read",
    headers={"Content-Type": "application/json", "X-PAYMENT": payment},
    json={"url": "https://example.com/some-article"}
)
print(r.json())
# → {"title": "...", "content": "...", "wordCount": 1200, "byline": "..."}`;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center"><Home className="w-4 h-4 mr-1" /> Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">API Docs</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <Code2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold">API Docs</h1>
          <p className="text-muted-foreground text-sm mt-1">Free endpoints for humans · Paid agent endpoints via x402 + Stellar</p>
        </div>
      </div>

      <div className="space-y-12">

        {/* ── Agent API Hero ── */}
        <section className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">For AI Agents</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Agent API — pay per request, no key needed</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Two powerful server-side endpoints built specifically for AI agents. Pay <strong className="text-foreground">{PRICE} XLM per request</strong> using the x402 protocol on Stellar. No signup, no subscription — just send the payment and get the data.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {[
              { icon: Zap, label: "x402 Protocol" },
              { icon: Globe, label: "Stellar Network" },
              { icon: Lock, label: "No API Key" },
              { icon: FileText, label: "PDF + URL Processing" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-1.5 bg-background/50 border border-border rounded-lg px-3 py-1.5">
                <f.icon className="w-3.5 h-3.5 text-yellow-400" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Discovery ── */}
        <section>
          <h2 className="text-lg font-bold mb-1">Discovery</h2>
          <p className="text-sm text-muted-foreground mb-4">Agents can auto-discover all endpoints from two well-known locations:</p>
          <div className="space-y-2">
            <Endpoint method="GET" path={`${apiBase}/.well-known/agent.json`} desc="Machine-readable capability manifest — start here" />
            <Endpoint method="GET" path={`${apiBase}/api/agent`} desc="Full manifest with endpoint schemas, pricing, and curl/Python examples" />
          </div>
        </section>

        {/* ── How x402 works ── */}
        <section>
          <h2 className="text-lg font-bold mb-4">How x402 Payment Works</h2>
          <div className="space-y-3 mb-5">
            {[
              { n: "1", t: "Call the endpoint", d: "Send a request to any paid endpoint without payment. You'll get a 402 response with payment instructions." },
              { n: "2", t: "Pay on Stellar", d: `Send exactly ${PRICE} XLM to the Toolora wallet address shown in the 402 response. Use any Stellar wallet.` },
              { n: "3", t: "Build the X-PAYMENT header", d: "Base64-encode a JSON payload with your transaction hash, wallet address, amount, and network." },
              { n: "4", t: "Retry the request", d: "Resend the original request with the X-PAYMENT header. Server verifies on-chain and responds." },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{step.n}</div>
                <div>
                  <div className="font-medium text-sm">{step.t}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{step.d}</div>
                </div>
              </div>
            ))}
          </div>
          <CodeBlock code={paymentHeaderExample} />
        </section>

        {/* ── Paid Endpoints ── */}
        <section>
          <h2 className="text-lg font-bold mb-4">Paid Agent Endpoints</h2>
          <div className="space-y-6">

            <div className="border border-yellow-500/20 rounded-2xl p-5 bg-yellow-500/5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <MethodBadge method="POST" paid />
                  <h3 className="font-bold mt-2">/api/agent/pdf/text</h3>
                  <p className="text-sm text-muted-foreground mt-1">Extract all text from a PDF. Returns clean text, page count, word count, and PDF metadata. Works on research papers, contracts, reports — any standard PDF up to 20MB.</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Request</div>
              <CodeBlock code={`Content-Type: multipart/form-data\nField: file (PDF, max 20MB)\nHeader: X-PAYMENT: <base64_payload>`} />
              <div className="text-xs text-muted-foreground mt-4 mb-2 font-medium uppercase tracking-wider">Python Example</div>
              <CodeBlock code={pythonExample} />
            </div>

            <div className="border border-yellow-500/20 rounded-2xl p-5 bg-yellow-500/5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <MethodBadge method="POST" paid />
                  <h3 className="font-bold mt-2">/api/agent/url/read</h3>
                  <p className="text-sm text-muted-foreground mt-1">Fetch a URL and return clean readable text with nav/ads/boilerplate stripped — same algorithm as Firefox Reader View. Ideal for web research agents and content pipelines.</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Request</div>
              <CodeBlock code={`Content-Type: application/json\nBody: { "url": "https://example.com/article" }\nHeader: X-PAYMENT: <base64_payload>`} />
              <div className="text-xs text-muted-foreground mt-4 mb-2 font-medium uppercase tracking-wider">Python Example</div>
              <CodeBlock code={urlExample} />
            </div>
          </div>
        </section>

        {/* ── Free Endpoints ── */}
        <section>
          <h2 className="text-lg font-bold mb-2">Free Endpoints</h2>
          <p className="text-sm text-muted-foreground mb-4">No payment, no auth required. Rate limit: 60 req/min per IP.</p>
          <div className="space-y-2">
            <Endpoint method="GET" path="/api/healthz" desc="Health check — returns server status" />
            <Endpoint method="GET" path="/api/tools/popular" desc="Most-used tools with usage counts" />
            <Endpoint method="POST" path="/api/tools/{slug}/use" desc="Increment usage counter for a tool" />
            <Endpoint method="GET" path="/api/auth/user" desc="Current authenticated user (null if not signed in)" />
            <Endpoint method="GET" path="/api/user/history" desc="Signed-in user's recent tool history" />
          </div>
        </section>

        {/* ── Payment Payload ── */}
        <section>
          <h2 className="text-lg font-bold mb-2">X-PAYMENT Header Format</h2>
          <p className="text-sm text-muted-foreground mb-3">Base64-encode this JSON and send it as the <code className="text-xs bg-muted px-1 py-0.5 rounded">X-PAYMENT</code> request header:</p>
          <CodeBlock code={paymentPayloadExample} />
          <div className="mt-3 p-3 bg-muted/30 rounded-xl text-xs text-muted-foreground border border-border">
            Each <code>txHash</code> can only be used once — the server tracks used transactions to prevent replays. One Stellar payment = one API call.
          </div>
        </section>

      </div>
    </div>
  );
}
