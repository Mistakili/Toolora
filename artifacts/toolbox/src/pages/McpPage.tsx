import { useEffect, useState } from "react";
import { Copy, Check, Zap, Terminal, Bot, Code2, FileText, QrCode, Hash, Lock, Globe, Binary, Braces, FileJson, Type } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  return (
    <div className="relative rounded-xl border border-border bg-muted/40 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/60">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 text-sm font-mono overflow-x-auto text-foreground leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const MCP_TOOLS = [
  { icon: FileText,  name: "extract_pdf_text",    desc: "Extract all text from a PDF (base64 input). Returns content, page count, word count." },
  { icon: FileText,  name: "merge_pdfs",           desc: "Merge 2–20 PDFs into one. All files provided as base64." },
  { icon: FileText,  name: "split_pdf",            desc: "Split a PDF into individual pages or page ranges." },
  { icon: QrCode,    name: "generate_qr_code",     desc: "Generate a QR code PNG for any URL or text. Returns base64 image." },
  { icon: QrCode,    name: "read_qr_code",         desc: "Decode a QR code from an image. Returns the embedded text/URL." },
  { icon: Terminal,  name: "run_ocr",              desc: "Extract text from any image using Tesseract OCR. Supports 50+ languages." },
  { icon: FileText,  name: "convert_docx_to_text", desc: "Extract plain text or Markdown from a .docx Word file." },
  { icon: FileText,  name: "convert_excel_to_json",desc: "Parse .xlsx files and return each sheet as structured JSON." },
  { icon: Bot,       name: "ask_openai",           desc: "Send a prompt to GPT-4o and get a completion. Requires OPENAI_API_KEY in your environment." },
  { icon: Globe,     name: "fetch_url",            desc: "Fetch any public URL and return the HTML or JSON content." },
  { icon: Hash,      name: "generate_hash",        desc: "Generate MD5, SHA-1, SHA-256, or SHA-512 hash of any string." },
  { icon: QrCode,    name: "convert_image",        desc: "Convert images between PNG, JPEG, WebP, and AVIF formats." },
];

const MCP_ENDPOINT = "https://toolora.replit.app/api/mcp";

const CLAUDE_CONFIG = JSON.stringify({
  mcpServers: {
    toolora: {
      command: "npx",
      args: ["-y", "mcp-remote", MCP_ENDPOINT],
    },
  },
}, null, 2);

const CURSOR_CONFIG = JSON.stringify({
  mcpServers: {
    toolora: {
      url: MCP_ENDPOINT,
      type: "sse",
    },
  },
}, null, 2);

const CLINE_CONFIG = JSON.stringify({
  mcpServers: {
    "toolora-mcp": {
      disabled: false,
      timeout: 60,
      url: MCP_ENDPOINT,
      transportType: "sse",
    },
  },
}, null, 2);

const PYTHON_EXAMPLE = `import httpx, json

MCP = "https://toolora.replit.app/api/mcp"
session = httpx.Client()

# Initialize the MCP session
init = session.post(MCP, json={
    "jsonrpc": "2.0", "method": "initialize", "id": 1,
    "params": {"protocolVersion": "2025-03-26", "capabilities": {}, "clientInfo": {"name": "my-app", "version": "1.0"}}
})

# Call a tool — generate a QR code
result = session.post(MCP, json={
    "jsonrpc": "2.0", "method": "tools/call", "id": 2,
    "params": {"name": "generate_qr_code", "arguments": {"text": "https://toolora.dev", "size": 300}}
})
data = result.json()
# data["result"]["content"][0]["text"] contains the base64 PNG`;

const NODE_EXAMPLE = `import fetch from "node-fetch";

const MCP = "https://toolora.replit.app/api/mcp";

// Call the generate_hash tool
const res = await fetch(MCP, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "tools/call",
    id: 1,
    params: {
      name: "generate_hash",
      arguments: { text: "Hello, world!", algorithm: "sha256" }
    }
  })
});

const { result } = await res.json();
console.log(result.content[0].text);
// → { "algorithm": "sha256", "hash": "315f5bdb..." }`;

export default function McpPage() {
  useSEO({
    title: "Free MCP Server — 12 Tools for Claude, Cursor & AI Agents",
    description: "Toolora's free MCP server gives Claude, Cursor, Cline, and any MCP-compatible AI agent access to 12 tools: PDF extraction, OCR, QR codes, hash generation, and more. No auth required.",
    canonical: "https://toolora.dev/mcp",
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-5">
          <Zap className="h-3.5 w-3.5" />
          Model Context Protocol
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
          Free MCP Server
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          12 tools — PDF processing, OCR, QR codes, file conversion, and more — ready for Claude, Cursor, Cline, or any MCP-compatible agent.{" "}
          <strong className="text-foreground">No API key. No auth. Completely free.</strong>
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <code className="text-sm bg-muted border border-border rounded-lg px-4 py-2 font-mono text-primary">
            {MCP_ENDPOINT}
          </code>
          <CopyButton text={MCP_ENDPOINT} />
        </div>
      </div>

      {/* Quick-start tabs */}
      <QuickStart />

      {/* Tool list */}
      <section className="mt-12">
        <h2 className="text-2xl font-display font-bold mb-2">Available Tools</h2>
        <p className="text-muted-foreground mb-6">All 12 tools are free with no rate limits for MCP usage.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MCP_TOOLS.map((t) => (
            <div key={t.name} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <t.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-mono font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direct API usage */}
      <section className="mt-12">
        <h2 className="text-2xl font-display font-bold mb-2">Use Without an AI Client</h2>
        <p className="text-muted-foreground mb-6">
          The MCP server speaks JSON-RPC 2.0 over HTTP. You can call it directly from any language — no MCP SDK required.
        </p>
        <div className="space-y-4">
          <CodeBlock code={PYTHON_EXAMPLE} language="python" />
          <CodeBlock code={NODE_EXAMPLE} language="javascript" />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-2xl font-display font-bold mb-6">Common Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Is there a rate limit?",
              a: "No hard rate limit for normal usage. If you're processing thousands of files per day, consider self-hosting or reaching out — we're happy to discuss options.",
            },
            {
              q: "Do you store my files?",
              a: "No. Files sent to the MCP server are processed in memory and discarded immediately. We don't log file contents.",
            },
            {
              q: "What's the max file size?",
              a: "10 MB per file. For larger files, the browser-side tools on toolora.dev have no server-side limit since everything runs locally.",
            },
            {
              q: "How is this different from the paid Agent API?",
              a: "The MCP server is free and designed for interactive AI assistants (Claude, Cursor). The Agent API is for programmatic integrations and scripts, supports x402 micropayments, and requires an API key.",
            },
            {
              q: "Can I self-host this?",
              a: "The MCP server is part of Toolora's open infrastructure. Email us if you'd like the server code for self-hosting.",
            },
          ].map((faq) => (
            <div key={faq.q} className="p-5 rounded-xl border border-border bg-card">
              <p className="font-semibold mb-1.5">{faq.q}</p>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 text-center py-10 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-violet-500/5">
        <h2 className="text-2xl font-display font-bold mb-2">Ready to connect?</h2>
        <p className="text-muted-foreground mb-5">Copy the endpoint, add it to your AI client, and start using 12 tools immediately.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-4 py-2">
            <code className="text-sm font-mono text-primary">{MCP_ENDPOINT}</code>
            <CopyButton text={MCP_ENDPOINT} />
          </div>
          <a
            href="/api-keys"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Lock className="h-4 w-4" />
            Get an Agent API key →
          </a>
        </div>
      </section>
    </div>
  );
}

type ClientKey = "claude" | "cursor" | "cline";

const CONFIGS: Record<ClientKey, { label: string; filename: string; config: string; instructions: string }> = {
  claude: {
    label: "Claude Desktop",
    filename: "claude_desktop_config.json",
    config: CLAUDE_CONFIG,
    instructions: 'Open Claude Desktop → Settings → Developer → Edit Config. Add the block below, save, and restart Claude.',
  },
  cursor: {
    label: "Cursor",
    filename: ".cursor/mcp.json",
    config: CURSOR_CONFIG,
    instructions: "In Cursor, open Settings → MCP → Add Server. Or create .cursor/mcp.json at your project root with the config below.",
  },
  cline: {
    label: "Cline / Windsurf",
    filename: "cline_mcp_settings.json",
    config: CLINE_CONFIG,
    instructions: "In Cline's settings, open the MCP Servers tab and add a new remote server with the config below.",
  },
};

function QuickStart() {
  const [active, setActive] = useState<ClientKey>("claude");
  const cfg = CONFIGS[active];

  return (
    <section>
      <h2 className="text-2xl font-display font-bold mb-2">Quick Start</h2>
      <p className="text-muted-foreground mb-5">Pick your AI client and paste the config. No API key required.</p>
      <div className="flex gap-2 mb-4 flex-wrap">
        {(Object.keys(CONFIGS) as ClientKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              active === key
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {CONFIGS[key].label}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <p className="text-sm text-muted-foreground">{cfg.instructions}</p>
        <CodeBlock code={cfg.config} language={cfg.filename} />
      </div>
    </section>
  );
}
