import { useState } from "react";
import { Link } from "wouter";
import {
  ShieldCheck, Copy, Check, ExternalLink, Star,
  Zap, Database, FolderOpen, GitBranch, Brain,
  Globe, Terminal, FileText, Search, ChevronDown, ChevronUp, Mail
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
    claudeConfig: JSON.stringify({
      mcpServers: {
        toolora: {
          command: "npx",
          args: ["-y", "mcp-remote", "https://toolora.replit.app/api/mcp"],
        },
      },
    }, null, 2),
    cursorConfig: JSON.stringify({
      mcpServers: {
        toolora: { url: "https://toolora.replit.app/api/mcp", type: "sse" },
      },
    }, null, 2),
    tags: ["PDF", "OCR", "CSV", "utilities", "audio"],
  },
  {
    id: "filesystem",
    name: "Filesystem",
    tagline: "Read, write, and search files on your local machine. Restrict access to specific directories. The most commonly used MCP server.",
    icon: FolderOpen,
    privacyLevel: "local",
    stars: "28k",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
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
    stars: "28k",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite",
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
    stars: "28k",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/git",
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
    stars: "28k",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
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
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
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
    stars: "28k",
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer",
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
    github: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking",
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

export default function McpHub() {
  useSEO({
    title: "Privacy-First MCP Servers — Curated Local & Self-Hosted Directory",
    description: "A curated directory of MCP servers that don't upload your data to third-party services. Local-first and self-hostable servers for Claude Desktop, Cursor, and Cline.",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          Privacy-First MCP Directory
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold leading-tight">
          MCP servers that keep<br className="hidden sm:block" />
          <span className="text-primary"> your data on your machine</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          A curated list of Model Context Protocol servers that are local-first,
          self-hostable, or privacy-respecting by design — vetted for use with
          Claude Desktop, Cursor, and Cline.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> {SERVERS.filter(s => s.privacyLevel === "local").length} fully local</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> {SERVERS.filter(s => s.privacyLevel === "self-hosted").length} self-hostable</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> {SERVERS.filter(s => s.privacyLevel === "api").length} privacy-respecting API</span>
        </div>
      </section>

      {/* ── Criteria ─────────────────────────────────────────────────────── */}
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

      {/* ── Server list ──────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Vetted servers</h2>
          <span className="text-sm text-muted-foreground">{SERVERS.length} servers</span>
        </div>
        <div className="space-y-4">
          {SERVERS.map(s => <ServerCard key={s.id} server={s} />)}
        </div>
      </section>

      {/* ── What MCP is ──────────────────────────────────────────────────── */}
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

      {/* ── Submit ───────────────────────────────────────────────────────── */}
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
  );
}
