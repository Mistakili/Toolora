import { useState } from "react";
import { Link } from "wouter";
import {
  ShieldCheck, Copy, Check, ExternalLink,
  Zap, Database, FolderOpen, GitBranch, Brain,
  Globe, Terminal, FileText, Search, ChevronDown, ChevronUp, Mail, Monitor, Coins,
  MessageSquare, Layers, ArrowRight, Eye, Hand, Wallet
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ code, lang = "json" }: { code: string; lang?: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/60">
        <span className="font-mono text-muted-foreground">{lang}</span>
        <CopyBtn text={code} />
      </div>
      <pre className="p-3 font-mono overflow-x-auto leading-relaxed text-foreground">{code}</pre>
    </div>
  );
}

function PrivacyBadge({ level }: { level: "local" | "self-hosted" | "api" }) {
  const styles = {
    local:       "bg-green-500/10 text-green-400 border-green-500/20",
    "self-hosted": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    api:         "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  const labels = {
    local:       "Fully local",
    "self-hosted": "Self-hostable",
    api:         "Privacy-respecting API",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${styles[level]}`}>
      <ShieldCheck className="w-3 h-3" />
      {labels[level]}
    </span>
  );
}

type ServerEntry = {
  id: string;
  name: string;
  tagline: string;
  icon: React.ElementType;
  privacyLevel: "local" | "self-hosted" | "api";
  stars?: string;
  github?: string;
  openSource?: boolean;
  verifyNote: string;
  installNote?: string;
  featured?: boolean;
  claudeConfig: string;
  cursorConfig?: string;
  tags: string[];
};

const SERVERS: ServerEntry[] = [
  {
    id: "toolora",
    name: "Toolora MCP",
    tagline: "12 document & utility tools: PDF extraction, OCR, QR codes, CSV↔JSON, word count, URL reader, audio transcription, and more.",
    icon: Zap,
    privacyLevel: "api",
    featured: true,
    installNote: "Free, no auth required. Works instantly with Claude Desktop and Cursor.",
    verifyNote: "Tool calls are processed by toolora.dev servers. Content is not logged or retained beyond the request. To verify: open DevTools → Network tab → trigger a tool call → inspect the request payload to see exactly what is sent.",
    claudeConfig: JSON.stringify({
      mcpServers: {
        toolora: {
          command: "npx",
          args: ["-y", "mcp-remote", "https://toolora.dev/api/mcp"],
        },
      },
    }, null, 2),
    cursorConfig: JSON.stringify({
      mcpServers: {
        toolora: { url: "https://toolora.dev/api/mcp", type: "http" },
      },
    }, null, 2),
    tags: ["PDF", "OCR", "CSV", "utilities", "audio"],
  },
  {
    id: "soliris",
    name: "Soliris MCP",
    tagline: "Eyes, hands, and wallet for AI agents on Solana. 23 tools across three tiers: 12 Eyes (read anything — explain transactions in plain English, score wallet risk, decode accounts, no key needed), 7 Hands (write on-chain — Jupiter swaps with MEV risk scoring, SOL/token transfers, session P&L), and 4 Wallet tools (autonomous x402 USDC micropayments — pay any 402-gated endpoint, track spend, check balance). Built for the Solana x402 Hackathon. Mainnet-ready.",
    icon: Coins,
    privacyLevel: "api",
    github: "https://www.npmjs.com/package/soliris-mcp",
    installNote: "Eyes tools are free and need no private key. Hands and Wallet tools require a funded wallet. Key never leaves your machine — only signed transactions hit the RPC.",
    verifyNote: "Your private key is read locally by the npx process and never transmitted — only signed transactions reach the RPC endpoint. To verify: monitor your network traffic and confirm no key material appears in outbound requests. Set MAX_PAYMENT_USDC to cap autonomous x402 spend per call.",
    claudeConfig: JSON.stringify({
      mcpServers: {
        soliris: {
          command: "npx",
          args: ["-y", "soliris-mcp"],
          env: {
            RPC_URL: "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY",
            SOLANA_PRIVATE_KEY: "your_base58_private_key",
            SOLANA_NETWORK: "mainnet-beta",
            MAX_PAYMENT_USDC: "1.0",
            PLATFORM_FEE_BPS: "20",
            PLATFORM_FEE_ACCOUNT: "your_fee_ata",
            SOLIRIS_API_URL: "https://soliris.replit.app",
          },
        },
      },
    }, null, 2),
    tags: ["Solana", "DeFi", "x402", "payments", "swaps", "risk scoring", "MEV"],
  },
  {
    id: "filesystem",
    name: "Filesystem",
    tagline: "Read, write, and search files on your local machine. Restrict access to specific directories. The most commonly used MCP server.",
    icon: FolderOpen,
    privacyLevel: "local",
    openSource: true,
    stars: "28k",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    verifyNote: "Runs as a local subprocess via npx — no remote server involved. To verify: open DevTools → Network tab → trigger a file read call → confirm zero outbound requests fire. Everything stays on your machine.",
    claudeConfig: JSON.stringify({
      mcpServers: {
        filesystem: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"],
        },
      },
    }, null, 2),
    tags: ["files", "local", "read/write", "search"],
  },
  {
    id: "sqlite",
    name: "SQLite",
    tagline: "Query and modify a local SQLite database. Runs entirely on your machine — your data never leaves.",
    icon: Database,
    privacyLevel: "local",
    openSource: true,
    stars: "28k",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite",
    verifyNote: "Runs locally via uvx against a .db file on your machine. No network access of any kind. To verify: open DevTools → Network tab → run a query → confirm zero outbound requests.",
    claudeConfig: JSON.stringify({
      mcpServers: {
        sqlite: {
          command: "uvx",
          args: ["mcp-server-sqlite", "--db-path", "/path/to/your/database.db"],
        },
      },
    }, null, 2),
    tags: ["database", "SQL", "local", "sqlite"],
  },
  {
    id: "git",
    name: "Git",
    tagline: "Inspect git history, commits, branches, diffs, and blame output from your local repositories. No remote access needed.",
    icon: GitBranch,
    privacyLevel: "local",
    openSource: true,
    stars: "28k",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/git",
    verifyNote: "Reads your local git repository directly via uvx. Makes no outbound network requests. To verify: open DevTools → Network tab → inspect a commit or diff → confirm zero requests fire.",
    claudeConfig: JSON.stringify({
      mcpServers: {
        git: {
          command: "uvx",
          args: ["mcp-server-git", "--repository", "/path/to/your/repo"],
        },
      },
    }, null, 2),
    tags: ["git", "version control", "local", "code"],
  },
  {
    id: "memory",
    name: "Memory",
    tagline: "Persistent knowledge graph that lives on your machine. Lets Claude remember entities, relations, and observations across sessions.",
    icon: Brain,
    privacyLevel: "local",
    openSource: true,
    stars: "28k",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
    verifyNote: "Stores all data as a local JSON file on your machine — typically at ~/.claude/memory.json. No network requests made. To verify: find the file and confirm all your stored memories are there in plain text.",
    claudeConfig: JSON.stringify({
      mcpServers: {
        memory: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-memory"],
        },
      },
    }, null, 2),
    tags: ["memory", "knowledge graph", "persistence", "local"],
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    tagline: "Query a local or self-hosted Postgres database. Read-only by default — no writes unless you explicitly enable them.",
    icon: Database,
    privacyLevel: "self-hosted",
    openSource: true,
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
    verifyNote: "Connects to whatever PostgreSQL instance you specify in the connection string. Ensure that string points to your own host (localhost or a server you control) — not a third-party database provider.",
    claudeConfig: JSON.stringify({
      mcpServers: {
        postgres: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"],
        },
      },
    }, null, 2),
    tags: ["database", "postgres", "SQL", "self-hosted"],
  },
  {
    id: "puppeteer",
    name: "Puppeteer",
    tagline: "Browser automation running locally via Puppeteer. Navigate pages, take screenshots, extract content — all on your machine.",
    icon: Globe,
    privacyLevel: "local",
    openSource: true,
    stars: "28k",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer",
    verifyNote: "Launches a real Chrome browser on your machine. All browsing activity is local — the server makes no separate requests to any third party. To verify: watch the Chrome window that opens; everything visible there is what's being processed.",
    claudeConfig: JSON.stringify({
      mcpServers: {
        puppeteer: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-puppeteer"],
        },
      },
    }, null, 2),
    tags: ["browser", "automation", "screenshots", "scraping"],
  },
  {
    id: "sequential-thinking",
    name: "Sequential Thinking",
    tagline: "Structured multi-step reasoning tool. Helps Claude break down complex problems into thought chains. Runs fully in-process.",
    icon: Brain,
    privacyLevel: "local",
    openSource: true,
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking",
    verifyNote: "Runs entirely in-process as a local subprocess — no network calls of any kind. Your reasoning steps and data never leave your machine. Fully auditable open source code on GitHub.",
    claudeConfig: JSON.stringify({
      mcpServers: {
        sequentialthinking: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
        },
      },
    }, null, 2),
    tags: ["reasoning", "thinking", "planning", "local"],
  },
];

function OpenSourceBadge({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 font-medium hover:bg-blue-500/20 transition-colors">
      <GitBranch className="w-3 h-3" />
      Open source
    </a>
  );
}

function ServerCard({ server }: { server: ServerEntry }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = server.icon;

  return (
    <div className={`rounded-2xl border p-5 space-y-4 transition-colors ${server.featured ? "border-primary/40 bg-primary/5" : "border-border bg-muted/10 hover:border-border/80"}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${server.featured ? "bg-primary/20" : "bg-muted"}`}>
          <Icon className={`w-5 h-5 ${server.featured ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold">{server.name}</h3>
            {server.featured && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-medium">Featured</span>
            )}
            <PrivacyBadge level={server.privacyLevel} />
            {server.openSource && server.github && (
              <OpenSourceBadge href={server.github} />
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{server.tagline}</p>
          {server.installNote && (
            <p className="text-xs text-green-400 mt-1.5">{server.installNote}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {server.tags.map(t => (
          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-background border border-border text-muted-foreground">{t}</span>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {server.github && (
          <a href={server.github} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
            {server.stars ? `GitHub · ${server.stars} stars` : "GitHub"}
          </a>
        )}
        {server.featured && (
          <Link href="/mcp" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            Full setup guide →
          </Link>
        )}
        <button
          onClick={() => setExpanded(v => !v)}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
        >
          {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Hide config</> : <><ChevronDown className="w-3.5 h-3.5" /> Show install config</>}
        </button>
      </div>

      {expanded && (
        <div className="space-y-3 pt-1">
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
            <p className="text-xs font-medium text-green-400 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> How to verify
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{server.verifyNote}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5 font-medium">Claude Desktop (claude_desktop_config.json)</p>
            <CodeBlock code={server.claudeConfig} lang="json" />
          </div>
          {server.cursorConfig && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">Cursor (.cursor/mcp.json)</p>
              <CodeBlock code={server.cursorConfig} lang="json" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const CRITERIA = [
  { icon: ShieldCheck, label: "No third-party data transmission", desc: "Processing happens on your machine or the server you control." },
  { icon: FolderOpen,  label: "Local-first or self-hostable",    desc: "Runs on localhost, reads local files, or can be deployed to your own infra." },
  { icon: FileText,    label: "Open source preferred",           desc: "Code is auditable. You can verify what the server actually does with your data." },
  { icon: Terminal,    label: "Actively maintained",             desc: "Has recent commits or is part of the official modelcontextprotocol/servers repo." },
];

const INSTALL_TABS = [
  {
    id: "claude",
    label: "Claude Desktop",
    file: "claude_desktop_config.json",
    hint: "Open Claude Desktop → Settings → Developer → Edit Config",
    config: JSON.stringify({
      mcpServers: {
        toolora: {
          command: "npx",
          args: ["-y", "mcp-remote", "https://toolora.dev/api/mcp"],
        },
      },
    }, null, 2),
  },
  {
    id: "cursor",
    label: "Cursor",
    file: ".cursor/mcp.json",
    hint: "Open Cursor → Settings → MCP → Add Server, or edit .cursor/mcp.json",
    config: JSON.stringify({
      mcpServers: {
        toolora: { url: "https://toolora.dev/api/mcp", type: "http" },
      },
    }, null, 2),
  },
  {
    id: "windsurf",
    label: "Windsurf",
    file: "~/.codeium/windsurf/mcp_config.json",
    hint: "Open Windsurf → Cascade → Click the hammer icon → Configure MCP",
    config: JSON.stringify({
      mcpServers: {
        toolora: {
          serverUrl: "https://toolora.dev/api/mcp",
        },
      },
    }, null, 2),
  },
];

const EXAMPLE_PROMPTS = [
  {
    label: "Read an article",
    prompt: "Use the toolora read_url tool to fetch and summarise this article for me: https://example.com/article",
    icon: Globe,
  },
  {
    label: "Extract PDF text",
    prompt: "Use toolora to extract all the text from this PDF file so I can read it [attach your PDF]",
    icon: FileText,
  },
  {
    label: "Transcribe audio",
    prompt: "Use the toolora transcribe_audio tool to transcribe this voice note / recording for me [attach audio file]",
    icon: Terminal,
  },
  {
    label: "Share output as a link",
    prompt: "Use toolora create_shareable_paste to turn your response into a public link I can share",
    icon: Globe,
  },
  {
    label: "Readability check",
    prompt: "Use the toolora count_words tool to check the readability score and top keywords of this text: [paste your text]",
    icon: FileText,
  },
  {
    label: "CSV → JSON",
    prompt: "Use toolora csv_to_json to convert this CSV data into JSON: [paste CSV]",
    icon: Terminal,
  },
  {
    label: "Generate a PDF",
    prompt: "Use toolora generate_pdf_from_text to turn your summary into a downloadable PDF",
    icon: FileText,
  },
  {
    label: "Remember something",
    prompt: "Use toolora save_memory with key 'project-brief' to remember the following for our future sessions: [paste content]",
    icon: Brain,
  },
];

function PromptCard({ label, prompt, icon: Icon }: { label: string; prompt: string; icon: React.ElementType }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl border border-border bg-muted/10 hover:border-border/80 hover:bg-muted/20 transition-colors p-4 space-y-2.5">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed font-mono">{prompt}</p>
      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 bg-muted rounded-md border border-border"
      >
        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
        {copied ? "Copied" : "Copy prompt"}
      </button>
    </div>
  );
}

function TryThese() {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
          <MessageSquare className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-sm">What to say to your AI after installing</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Copy any of these into Claude, Cursor, or Windsurf to make your first tool call.
            Your AI will pick up the toolora tools automatically.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {EXAMPLE_PROMPTS.map(p => (
          <PromptCard key={p.label} {...p} />
        ))}
      </div>
    </div>
  );
}

function QuickInstall() {
  const [tab, setTab] = useState("claude");
  const active = INSTALL_TABS.find(t => t.id === tab)!;
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Add Toolora to your AI client</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 font-medium">Free · No API key</span>
          </div>
          <p className="text-xs text-muted-foreground">15 tools: PDF, OCR, QR codes, audio transcription, URL reader, CSV↔JSON and more</p>
        </div>
        <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-1 self-start sm:self-auto">
          {INSTALL_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <CodeBlock code={active.config} lang="json" />
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
        <Monitor className="w-3.5 h-3.5 shrink-0 hidden sm:block" />
        <span><span className="text-foreground font-medium">Paste into</span> <code className="font-mono bg-muted px-1 py-0.5 rounded">{active.file}</code> — {active.hint}</span>
      </div>
    </div>
  );
}

export default function McpHub() {
  useSEO({
    title: "Privacy-First MCP Servers — Curated Local & Self-Hosted Directory",
    description: "A curated directory of MCP servers that don't upload your data to third-party services. Local-first and self-hostable servers for Claude Desktop, Cursor, and Cline.",
    canonical: "https://toolora.dev/mcp-hub",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": "https://toolora.dev/mcp-hub",
          name: "Privacy-First MCP Server Directory",
          url: "https://toolora.dev/mcp-hub",
          description: "A curated directory of MCP servers that don't upload your data. Local-first and self-hostable servers for Claude Desktop, Cursor, and Cline.",
          publisher: { "@type": "Organization", name: "Toolora", url: "https://toolora.dev" },
        },
        {
          "@type": "ItemList",
          name: "Privacy-First MCP Servers",
          numberOfItems: SERVERS.length,
          itemListElement: SERVERS.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.name,
            description: s.tagline,
          })),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://toolora.dev" },
            { "@type": "ListItem", position: 2, name: "MCP Hub", item: "https://toolora.dev/mcp-hub" },
          ],
        },
      ],
    },
  });

  return (
    <div className="w-full">

      {/* ── IMAGE 1: Full-bleed hero ──────────────────────────────────────── */}
      <section className="relative h-[540px] overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}images/mcp-hub-hero.png`}
          alt="MCP server hub — spoke network of privacy-first servers"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient: dark top (nav blend) → transparent middle → dark bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/10 to-background/90" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4" />
            Privacy-First MCP Directory
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold leading-tight max-w-2xl drop-shadow-lg">
            MCP servers that keep<br className="hidden sm:block" />
            <span className="text-primary"> your data on your machine</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
            A curated list of Model Context Protocol servers that are local-first,
            self-hostable, or privacy-respecting by design — vetted for Claude
            Desktop, Cursor, and Cline.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> {SERVERS.filter(s => s.privacyLevel === "local").length} fully local</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> {SERVERS.filter(s => s.privacyLevel === "self-hosted").length} self-hostable</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> {SERVERS.filter(s => s.privacyLevel === "api").length} privacy-respecting API</span>
          </div>
        </div>
      </section>

      {/* ── Quick Install + Criteria ──────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">
        <QuickInstall />

        <TryThese />

        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-display font-bold">How we vet servers</h2>
            <p className="text-sm text-muted-foreground">Every server in this directory meets all four criteria.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CRITERIA.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                <Icon className="w-5 h-5 text-primary" />
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── IMAGE 2: Server room — full-bleed cinematic break ────────────── */}
      <div className="relative overflow-hidden h-[340px]">
        <img
          src={`${import.meta.env.BASE_URL}images/mcp-server-room.png`}
          alt="Server rack corridor — local-first infrastructure, data never leaves your machine"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/50 to-background/10" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-4xl mx-auto px-8 w-full">
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Local-first architecture</p>
            <p className="text-3xl font-display font-bold leading-tight max-w-sm">
              Every byte stays<br />on your machine.
            </p>
            <p className="text-sm text-muted-foreground mt-3 max-w-sm leading-relaxed">
              No server receives your files. No third party sees your data.
              That's not a feature — it's the baseline requirement.
            </p>
          </div>
        </div>
      </div>

      {/* ── Agent Stack Feature ──────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-amber-500/5 p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-primary uppercase tracking-widest">Featured stack</span>
              </div>
              <h2 className="text-2xl font-display font-bold">The Agent Stack</h2>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed max-w-xl">
                Toolora + Soliris in one config. Your AI agent gets complete information processing
                and autonomous financial execution — 40+ tools, two revenue streams, zero server custody.
              </p>
            </div>
          </div>

          {/* Capability tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-background/60 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10"><FileText className="w-4 h-4 text-blue-400" /></div>
                <span className="text-sm font-semibold">Toolora — 17 tools</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Read PDFs, count words, check readability, generate QR codes, convert files, share pastes.
                Runs on Toolora's hosted server — no local install needed.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/60 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10"><Coins className="w-4 h-4 text-amber-400" /></div>
                <span className="text-sm font-semibold">Soliris — 23 tools</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Explain any Solana transaction, score wallet risk, execute Jupiter swaps with MEV protection,
                pay any x402 endpoint autonomously. 12 read tools need no wallet.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/60 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-green-500/10"><Brain className="w-4 h-4 text-green-400" /></div>
                <span className="text-sm font-semibold">Together — full autonomy</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Agent reads a whitepaper (Toolora), profiles the team wallets (Soliris), checks smart money overlap,
                and executes — all in one session, no human in the loop.
              </p>
            </div>
          </div>

          {/* Combined config */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Claude Desktop — combined config
            </p>
            <CodeBlock lang="json" code={JSON.stringify({
              mcpServers: {
                toolora: {
                  command: "npx",
                  args: ["-y", "mcp-remote", "https://toolora.dev/api/mcp"],
                },
                soliris: {
                  command: "npx",
                  args: ["-y", "soliris-mcp"],
                  env: {
                    RPC_URL: "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY",
                    SOLANA_PRIVATE_KEY: "your_base58_private_key",
                    SOLANA_NETWORK: "mainnet-beta",
                    MAX_PAYMENT_USDC: "1.0",
                    SOLIRIS_API_URL: "https://soliris.replit.app",
                  },
                },
              },
            }, null, 2)} />
            <p className="text-xs text-muted-foreground">
              Read-only Soliris tools (wallet lookup, transaction explain, token price) work without a private key.
              Add <code className="text-xs bg-muted px-1 py-0.5 rounded">SOLANA_PRIVATE_KEY</code> only when you want swap execution.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/mcp" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              <Zap className="w-3.5 h-3.5" /> Toolora MCP setup guide
            </Link>
            <a href="https://www.npmjs.com/package/soliris-mcp" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:underline">
              <ExternalLink className="w-3.5 h-3.5" /> Soliris on npm
            </a>
            <Link href="/blog/ai-agent-on-chain-decision-ledger-soliris" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline">
              <ArrowRight className="w-3.5 h-3.5" /> How Soliris logs decisions on-chain
            </Link>
          </div>
        </section>
      </div>

      {/* ── Server list ──────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Vetted servers</h2>
            <span className="text-sm text-muted-foreground">{SERVERS.length} servers</span>
          </div>
          <div className="space-y-4">
            {SERVERS.map(s => <ServerCard key={s.id} server={s} />)}
          </div>
        </section>
      </div>

      {/* ── What MCP is ──────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <section className="rounded-2xl border border-border bg-muted/20 p-8 space-y-4">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> What is MCP?
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The Model Context Protocol (MCP) is an open standard that lets AI assistants like Claude
            connect to external tools and data sources. Instead of the AI knowing only what's in its training data,
            MCP lets it call tools: read your files, query databases, run searches, and more.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The privacy question matters because an MCP server sits between your AI assistant and your data.
            If that server uploads your files to a third party, you've lost control of your data in exchange for a capability.
            Local-first MCP servers give you the capability without the trade-off.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              <ExternalLink className="w-3.5 h-3.5" /> Official MCP documentation
            </a>
            <Link href="/mcp" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              <Zap className="w-3.5 h-3.5" /> Toolora MCP setup guide
            </Link>
          </div>
        </section>
      </div>

      {/* ── IMAGE 3: Tools visual — full-bleed closing banner ────────────── */}
      <div className="relative overflow-hidden h-[300px]">
        <img
          src={`${import.meta.env.BASE_URL}images/mcp-tools-visual.png`}
          alt="MCP tools connecting AI to your local environment"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/50 to-background/10" />
        <div className="relative z-10 h-full flex items-center justify-end">
          <div className="max-w-4xl mx-auto px-8 w-full flex justify-end">
            <div className="max-w-xs text-right">
              <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">The directory standard</p>
              <p className="text-2xl font-display font-bold leading-snug">
                Privacy isn't a tier.<br />It's the requirement.
              </p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Every server listed here meets our vetting criteria — no exceptions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit ───────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <section className="text-center space-y-5">
          <h2 className="text-2xl font-display font-bold">Submit your server</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            Built an MCP server that's local-first, self-hostable, or privacy-respecting? Send us a link
            and a short description. If it meets the criteria above, we'll add it to the directory.
          </p>
          <a
            href="mailto:support@toolora.dev?subject=MCP%20Server%20Submission&body=Server%20name%3A%0AGitHub%20URL%3A%0APrivacy%20model%20(local%20%2F%20self-hosted%20%2F%20API)%3A%0AShort%20description%3A"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm"
          >
            <Mail className="w-4 h-4" /> Submit a server — support@toolora.dev
          </a>
          <p className="text-xs text-muted-foreground">No backlink required. We list servers on merit.</p>
        </section>
      </div>

    </div>
  );
}
