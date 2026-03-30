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
    ? window.location.origin.replace(/toolora\.dev/, "api.toolora.dev").replace(/:\d+$/, ":8080")
    : "https://api.toolora.dev";

  const PRICE_XLM  = "0.5";
  const PRICE_USDC = "0.01";
  const STELLAR_NETWORK = "stellar:mainnet";
  const SOLANA_NETWORK  = "solana:mainnet";

  // ── Stellar examples ──────────────────────────────────────────────────────

  const stellarPayloadExample = `{
  "txHash": "<your_stellar_tx_hash>",
  "from":   "<your_stellar_address>",
  "amount": "${PRICE_XLM}",
  "network": "${STELLAR_NETWORK}"
}`;

  const stellarCurlExample = `# 1. Base64-encode the payment payload:
PAYLOAD=$(echo '{"txHash":"<hash>","from":"<addr>","amount":"${PRICE_XLM}","network":"${STELLAR_NETWORK}"}' | base64 -w 0)

# 2. Send request with X-PAYMENT header:
curl -X POST ${apiBase}/api/agent/pdf/text \\
  -H "X-PAYMENT: $PAYLOAD" \\
  -F "file=@your_document.pdf"`;

  const stellarPythonExample = `import requests, base64, json

# After sending XLM on Stellar, build the payment payload
payment = base64.b64encode(json.dumps({
    "txHash":  "<stellar_tx_hash>",
    "from":    "<your_stellar_wallet>",
    "amount":  "${PRICE_XLM}",
    "network": "${STELLAR_NETWORK}"
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

  const stellarUrlExample = `import requests, base64, json

payment = base64.b64encode(json.dumps({
    "txHash":  "<stellar_tx_hash>",
    "from":    "<your_stellar_wallet>",
    "amount":  "${PRICE_XLM}",
    "network": "${STELLAR_NETWORK}"
}).encode()).decode()

r = requests.post(
    "${apiBase}/api/agent/url/read",
    headers={"Content-Type": "application/json", "X-PAYMENT": payment},
    json={"url": "https://example.com/some-article"}
)
print(r.json())
# → {"title": "...", "content": "...", "wordCount": 1200, "byline": "..."}`;

  // ── Solana examples ───────────────────────────────────────────────────────

  const solanaPayloadExample = `{
  "txHash": "<your_solana_tx_signature>",
  "from":   "<your_solana_wallet>",
  "amount": "${PRICE_USDC}",
  "network": "${SOLANA_NETWORK}"
}`;

  const solanaPythonExample = `import requests, base64, json
from solana.rpc.api import Client
from solders.pubkey import Pubkey
from solders.keypair import Keypair
from spl.token.instructions import transfer_checked, TransferCheckedParams

# USDC mint on Solana mainnet
USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

# 1. Send 0.01 USDC to the Toolora Solana wallet
#    (see /api/agent for the live payTo address)
#    tx_sig = "<your transaction signature from Solana>"

# 2. Build the X-PAYMENT header
payment = base64.b64encode(json.dumps({
    "txHash":  "<solana_tx_signature>",
    "from":    "<your_solana_wallet>",
    "amount":  "${PRICE_USDC}",
    "network": "${SOLANA_NETWORK}"
}).encode()).decode()

# 3. Call the endpoint
with open("document.pdf", "rb") as f:
    r = requests.post(
        "${apiBase}/api/agent/pdf/text",
        headers={"X-PAYMENT": payment},
        files={"file": f}
    )
print(r.json())`;

  const solanaUrlExample = `import requests, base64, json

# After sending 0.01 USDC on Solana:
payment = base64.b64encode(json.dumps({
    "txHash":  "<solana_tx_signature>",
    "from":    "<your_solana_wallet>",
    "amount":  "${PRICE_USDC}",
    "network": "${SOLANA_NETWORK}"
}).encode()).decode()

r = requests.post(
    "${apiBase}/api/agent/url/read",
    headers={"Content-Type": "application/json", "X-PAYMENT": payment},
    json={"url": "https://example.com/article"}
)
print(r.json())
# → {"title": "...", "content": "...", "wordCount": 1200, "fetchedAt": "..."}`;

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
          <p className="text-muted-foreground text-sm mt-1">Free endpoints for humans · Paid agent endpoints via x402 on Stellar & Solana</p>
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
            Three powerful server-side endpoints built for AI agents. Pay using the x402 protocol — <strong className="text-foreground">{PRICE_XLM} XLM on Stellar</strong> or <strong className="text-foreground">{PRICE_USDC} USDC on Solana</strong>. No signup, no subscription.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {[
              { icon: Zap,      label: "x402 Protocol" },
              { icon: Globe,    label: "Stellar + Solana" },
              { icon: Lock,     label: "No API Key" },
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
          <p className="text-sm text-muted-foreground mb-4">Agents can auto-discover all endpoints and pricing from these well-known locations:</p>
          <div className="space-y-2">
            <Endpoint method="GET" path={`${apiBase}/.well-known/agent.json`} desc="Machine-readable capability manifest — start here" />
            <Endpoint method="GET" path={`${apiBase}/api/agent`} desc="Full manifest with endpoint schemas, pricing for both chains, and examples" />
            <Endpoint method="GET" path={`${apiBase}/api/agent/stats`} desc="Live revenue + usage stats — total calls, earnings, recent payments" />
            <Endpoint method="GET" path={`${apiBase}/llms.txt`} desc="LLM-readable summary of Toolora tools and agent APIs" />
          </div>
        </section>

        {/* ── How x402 works ── */}
        <section>
          <h2 className="text-lg font-bold mb-4">How x402 Payment Works</h2>
          <div className="space-y-3 mb-5">
            {[
              { n: "1", t: "Call the endpoint", d: "Send a request to any paid endpoint without payment. You'll get a 402 response with an 'accepts' array listing both Stellar and Solana payment options." },
              { n: "2", t: "Choose your chain and pay", d: `Send ${PRICE_XLM} XLM on Stellar — or — ${PRICE_USDC} USDC on Solana to the address shown in the 402 response. Both are accepted per-request.` },
              { n: "3", t: "Build the X-PAYMENT header", d: "Base64-encode a JSON payload with your transaction hash (or signature), wallet address, amount, and network." },
              { n: "4", t: "Retry the request", d: "Resend the original request with the X-PAYMENT header. The server verifies on-chain and responds with your data." },
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
          <CodeBlock code={stellarCurlExample} />
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
              <div className="text-xs text-muted-foreground mt-4 mb-2 font-medium uppercase tracking-wider">Python (Stellar)</div>
              <CodeBlock code={stellarPythonExample} />
            </div>

            <div className="border border-yellow-500/20 rounded-2xl p-5 bg-yellow-500/5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <MethodBadge method="POST" paid />
                  <h3 className="font-bold mt-2">/api/agent/pdf/extract</h3>
                  <p className="text-sm text-muted-foreground mt-1">Extract structured content from a PDF — sections with headings, paragraphs grouped by hierarchy. Better than raw text for RAG ingestion, knowledge graphs, and document analysis. Returns each section with its heading level and word count.</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Request</div>
              <CodeBlock code={`Content-Type: multipart/form-data\nField: file (PDF, max 20MB)\nHeader: X-PAYMENT: <base64_payload>`} />
              <div className="text-xs text-muted-foreground mt-4 mb-2 font-medium uppercase tracking-wider">Response Shape</div>
              <CodeBlock code={`{\n  "title": "Annual Report 2024",\n  "pages": 42,\n  "totalWords": 18200,\n  "sections": [\n    { "heading": "EXECUTIVE SUMMARY", "level": 1, "content": "...", "wordCount": 320 },\n    { "heading": "1. FINANCIAL OVERVIEW", "level": 1, "content": "...", "wordCount": 840 },\n    { "heading": "1.1 Revenue", "level": 2, "content": "...", "wordCount": 210 }\n  ],\n  "info": { "Author": "...", "CreationDate": "..." }\n}`} />
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
              <div className="text-xs text-muted-foreground mt-4 mb-2 font-medium uppercase tracking-wider">Python (Stellar)</div>
              <CodeBlock code={stellarUrlExample} />
            </div>
          </div>
        </section>

        {/* ── Solana USDC Payment ── */}
        <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-bold text-sm uppercase tracking-wider">Solana USDC</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Pay with USDC on Solana</h2>
          <p className="text-muted-foreground text-sm mb-5">
            The same three endpoints accept payment in <strong className="text-foreground">USDC on Solana mainnet</strong> — a stablecoin, so no price risk.
            Price: <strong className="text-foreground">{PRICE_USDC} USDC per request</strong>. All verification is done on-chain via Solana RPC.
          </p>

          <div className="space-y-3 mb-5">
            <div className="p-3 bg-background/50 border border-border rounded-xl text-xs">
              <span className="text-muted-foreground font-medium uppercase tracking-wider">USDC Mint (mainnet)</span>
              <code className="block mt-1 text-foreground font-mono break-all">EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v</code>
            </div>
            <div className="p-3 bg-background/50 border border-border rounded-xl text-xs">
              <span className="text-muted-foreground font-medium uppercase tracking-wider">Receiver address</span>
              <code className="block mt-1 text-foreground font-mono">See live 402 response or <a href={`${apiBase}/api/agent`} className="text-purple-400 underline" target="_blank" rel="noreferrer">/api/agent</a></code>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">X-PAYMENT payload (Solana)</div>
          <CodeBlock code={solanaPayloadExample} />
          <div className="text-xs text-muted-foreground mt-4 mb-2 font-medium uppercase tracking-wider">Python — PDF extraction via Solana USDC</div>
          <CodeBlock code={solanaPythonExample} />
          <div className="text-xs text-muted-foreground mt-4 mb-2 font-medium uppercase tracking-wider">Python — URL reading via Solana USDC</div>
          <CodeBlock code={solanaUrlExample} />
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

        {/* ── Payment Payload Format ── */}
        <section>
          <h2 className="text-lg font-bold mb-2">X-PAYMENT Header Format</h2>
          <p className="text-sm text-muted-foreground mb-3">Base64-encode one of these JSON objects and send it as the <code className="text-xs bg-muted px-1 py-0.5 rounded">X-PAYMENT</code> header:</p>

          <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Stellar XLM</div>
          <CodeBlock code={stellarPayloadExample} />

          <div className="text-xs text-muted-foreground mt-4 mb-2 font-medium uppercase tracking-wider">Solana USDC</div>
          <CodeBlock code={solanaPayloadExample} />

          <div className="mt-4 p-3 bg-muted/30 rounded-xl text-xs text-muted-foreground border border-border">
            Each <code>txHash</code> (or Solana signature) can only be used once — the server tracks used transactions to prevent replays. One payment = one API call.
          </div>
        </section>

      </div>
    </div>
  );
}
