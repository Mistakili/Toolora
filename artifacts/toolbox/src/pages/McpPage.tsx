import { useState } from "react";
import { Copy, Check, Zap, Terminal, Bot, FileText, QrCode, Lock, Globe, FileJson, Mic, AlignLeft, Hash, FileCode2, Link2, Download } from "lucide-react";
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
  { icon: FileText,  name: "extract_pdf_text",       desc: "Extract all plain text from a PDF (base64 input). Returns content, page count, word count." },
  { icon: FileText,  name: "merge_pdfs",             desc: "Merge 2–20 PDFs into one document. Each file provided as base64." },
  { icon: QrCode,    name: "generate_qr_code",       desc: "Generate a QR code PNG for any URL or text. Returns base64 image." },
  { icon: FileJson,  name: "csv_to_json",            desc: "Convert a CSV string into a JSON array of objects. First row = column headers." },
  { icon: FileJson,  name: "json_to_csv",            desc: "Convert a JSON array of objects into a CSV string." },
  { icon: Terminal,  name: "ocr_image",              desc: "Extract text from any image using OCR. Supports 50+ languages via Tesseract." },
  { icon: FileText,  name: "extract_docx_text",      desc: "Extract all plain text from a Microsoft Word (.docx) file." },
  { icon: FileText,  name: "excel_to_json",          desc: "Parse .xlsx/.xls/.csv files and return all sheets as structured JSON." },
  { icon: Mic,       name: "transcribe_audio",       desc: "Transcribe speech from an audio file using OpenAI Whisper (gpt-4o-mini-transcribe)." },
  { icon: Globe,     name: "scrape_url_js",          desc: "Fetch and extract content from pages that require JavaScript rendering (SPAs)." },
  { icon: AlignLeft, name: "count_words",            desc: "Count words, characters, sentences, and paragraphs. Returns reading time estimate." },
  { icon: Globe,     name: "read_url",               desc: "Fetch any public URL and return its main readable content as plain text." },
  { icon: FileCode2, name: "generate_pdf_from_text", desc: "Render plain text or markdown into a formatted, downloadable PDF. Returns base64." },
  { icon: Hash,      name: "markdown_to_html",       desc: "Convert markdown to a complete styled HTML document with all standard syntax supported." },
  { icon: Link2,     name: "create_shareable_paste", desc: "Store text and get a public link (toolora.dev/p/[id]). Expires in 7 days." },
  { icon: Bot,       name: "save_memory",            desc: "Persist any text under a named key across sessions. Claude's notepad — no setup, 30-day expiry." },
  { icon: Bot,       name: "recall_memory",          desc: "Retrieve text saved with save_memory. Pass the same key to get your content back." },
];

const MCP_ENDPOINT = "https://toolora.dev/api/mcp";

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

MCP = "https://toolora.dev/api/mcp"
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

const MCP = "https://toolora.dev/api/mcp";

// Call the count_words tool
const res = await fetch(MCP, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "tools/call",
    id: 1,
    params: {
      name: "count_words",
      arguments: { text: "Hello, world! This is a Toolora MCP test." }
    }
  })
});

const { result } = await res.json();
console.log(result.content[0].text);
// → { "words": 8, "chars": 41, "sentences": 2, "paragraphs": 1, "readingTimeMin": 1 }`;

export default function McpPage() {
  useSEO({
    title: "Free MCP Server — 17 Tools for Claude, Cursor & AI Agents",
    description: "Toolora's free MCP server gives Claude, Cursor, Cline, and any MCP-compatible AI agent 17 real server-side tools: PDF, OCR, QR codes, memory, markdown, pastes, and more. No API key. Listed in the Anthropic MCP Registry.",
    canonical: "https://toolora.dev/mcp",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "@id": "https://toolora.dev/mcp#app",
          name: "Toolora MCP Server",
          url: "https://toolora.dev/mcp",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          description: "Free Model Context Protocol (MCP) server with 17 tools: PDF extraction, OCR, QR codes, audio transcription, web reading, CSV/JSON conversion, persistent memory, and more. No API key required.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          provider: { "@type": "Organization", name: "Toolora", url: "https://toolora.dev" },
          featureList: MCP_TOOLS.map(t => t.name),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://toolora.dev" },
            { "@type": "ListItem", position: 2, name: "MCP Server", item: "https://toolora.dev/mcp" },
          ],
        },
      ],
    },
  });

  return (
    <div className="w-full">

      {/* ── Full-bleed hero ──────────────────────────────────────────────── */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}images/mcp-visual.png`}
          alt="MCP server network visualization"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/90" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5" />
            Model Context Protocol
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight drop-shadow-lg">
            Free MCP Server
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Not a prompt wrapper.{" "}
            <strong className="text-foreground">A real server</strong>{" "}
            that processes files, generates PDFs, runs OCR, and returns structured results — used in Claude workflows across 15 countries.{" "}
            <strong className="text-foreground">No API key. No auth. Nothing stored.</strong>
          </p>
          <div className="flex items-center justify-center gap-2">
            <code className="text-sm bg-muted/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 font-mono text-primary">
              {MCP_ENDPOINT}
            </code>
            <CopyButton text={MCP_ENDPOINT} />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-green-500" /> Listed in Anthropic MCP Registry</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-green-500" /> Smithery verified</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-green-500" /> 15 countries</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-green-500" /> 17 tools, no rate limits</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl">

      {/* Cinematic tools visual */}
      <div className="relative rounded-2xl overflow-hidden mb-12 border border-border/50">
        <img
          src={`${import.meta.env.BASE_URL}images/mcp-server-room.png`}
          alt="Professional data center — the infrastructure powering Toolora MCP"
          className="w-full object-cover max-h-72 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent flex items-center">
          <div className="px-8 max-w-xs">
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">17 tools. One config line.</p>
            <p className="text-lg font-display font-bold leading-snug">Real server infrastructure. Not a prompt wrapper.</p>
          </div>
        </div>
      </div>

      {/* Quick-start tabs */}
      <QuickStart />

      {/* Tool list */}
      <section className="mt-12">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold mb-2">Available Tools</h2>
            <p className="text-muted-foreground">All 17 tools are free with no rate limits for MCP usage. Two of them — <code className="text-primary text-sm">save_memory</code> and <code className="text-primary text-sm">recall_memory</code> — give Claude persistent key-value memory across sessions.</p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
            <img
              src={`${import.meta.env.BASE_URL}images/mcp-memory-visual.png`}
              alt="Persistent memory nodes visualization"
              className="relative z-10 w-full rounded-2xl border border-primary/20 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]"
            />
          </div>
        </div>
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
        <p className="text-muted-foreground mb-5">Copy the endpoint, add it to your AI client, and start using 15 tools immediately.</p>
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
    </div>
  );
}

type ClientKey = "claude" | "cursor" | "cline" | "claudecode";

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
  claudecode: {
    label: "Claude Code",
    filename: ".claude/skills/toolora.md",
    config: "",
    instructions: "Download the Toolora skill file and drop it into your project's .claude/skills/ folder. Claude Code will automatically pick it up and know how to use all 15 tools.",
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
        {active === "claudecode" ? (
          <a
            href="/toolora-skill.md"
            download="toolora.md"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download toolora.md skill file
          </a>
        ) : (
          <CodeBlock code={cfg.config} language={cfg.filename} />
        )}
      </div>
    </section>
  );
}
