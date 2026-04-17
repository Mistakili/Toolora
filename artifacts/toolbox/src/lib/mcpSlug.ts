export function mcpSlugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const MCP_CATEGORIES: { slug: string; label: string; blurb: string }[] = [
  { slug: "developer-tools", label: "Developer Tools", blurb: "MCP servers for code, git, CI, and infrastructure. The largest category — anything an engineer would wire into Claude or Cursor lives here." },
  { slug: "data", label: "Data", blurb: "Databases, vector stores, scrapers, and data warehouses you can query directly from your AI agent." },
  { slug: "ai-llm", label: "AI/LLM", blurb: "Search, retrieval, reasoning, and image-gen MCP servers. The brain extensions for your agent." },
  { slug: "productivity", label: "Productivity", blurb: "Notion, Slack, Drive, Linear — task and document tools that turn AI into a real coworker." },
  { slug: "marketing", label: "Marketing", blurb: "Email, analytics, CRM. Wire your AI into the growth stack." },
  { slug: "finance", label: "Finance", blurb: "Stripe, Shopify, payments. Let agents read and act on revenue data." },
  { slug: "other", label: "Other", blurb: "Time, utilities, and one-off tools that don't fit a bucket but still pull weight." },
];

const SLUG_TO_DB: Record<string, string> = {
  "developer-tools": "Developer Tools",
  "data": "Data",
  "ai-llm": "AI/LLM",
  "productivity": "Productivity",
  "marketing": "Marketing",
  "finance": "Finance",
  "other": "Other",
};

export function categorySlugToDb(slug: string): string | null {
  return SLUG_TO_DB[slug] ?? null;
}

export const MCP_BEST_OF: {
  slug: string;
  title: string;
  intro: string;
  picks: { name: string; why: string }[];
}[] = [
  {
    slug: "best-mcp-for-databases",
    title: "Best MCP servers for databases (Postgres, SQLite, vector DBs)",
    intro: "If your AI agent needs to read or write to a real database, these are the MCP servers that actually work in production. Ranked by how often they show up in real Claude/Cursor configs.",
    picks: [
      { name: "PostgreSQL", why: "The default for any agent that needs SQL. Read-only by default, opt-in writes." },
      { name: "SQLite", why: "When you want zero-config local storage. Great for prototypes." },
      { name: "Supabase MCP", why: "If you're already on Supabase, this gives Claude full project access." },
      { name: "Chroma MCP", why: "Vector search for RAG. Open source, runs anywhere." },
      { name: "Pinecone MCP", why: "Managed vector DB if you don't want to run Chroma yourself." },
    ],
  },
  {
    slug: "best-mcp-for-search",
    title: "Best MCP servers for web search (real-time, AI-native)",
    intro: "Out-of-the-box LLMs can't browse the web. These MCP servers give your agent live search with citations.",
    picks: [
      { name: "Brave Search", why: "Privacy-respecting, no Google tracking, generous free tier." },
      { name: "Perplexity MCP", why: "Returns answers with citations. Best for research workflows." },
      { name: "Exa MCP", why: "Neural search optimized for agents — semantic, not keyword." },
      { name: "Tavily MCP", why: "Built for AI from day one. Cheap, fast, predictable." },
      { name: "Firecrawl MCP", why: "When search isn't enough and you need to actually crawl pages." },
    ],
  },
  {
    slug: "best-mcp-for-developer-workflows",
    title: "Best MCP servers for developers (git, GitHub, CI)",
    intro: "These are the MCP servers I'd install on day one if I wanted Claude or Cursor to act like a real teammate inside my dev workflow.",
    picks: [
      { name: "GitHub", why: "Repos, issues, PRs, code review — full GitHub from your agent." },
      { name: "Filesystem", why: "Read and write local files. Restrict to specific dirs for safety." },
      { name: "Git", why: "Inspect history, diffs, blame without leaving your editor." },
      { name: "Sentry", why: "Pull stack traces directly into your debugging session." },
      { name: "Cloudflare MCP", why: "Manage Workers, R2, KV, D1 if you ship on Cloudflare." },
    ],
  },
  {
    slug: "best-mcp-for-productivity",
    title: "Best MCP servers for knowledge work (Notion, Slack, Drive)",
    intro: "Wire your AI into the apps you actually use all day. These MCP servers let Claude or ChatGPT act on Notion docs, send Slack messages, and read Drive files.",
    picks: [
      { name: "Notion MCP", why: "Read, create, update Notion pages and databases. Basically a Notion second brain for AI." },
      { name: "Linear MCP", why: "Manage issues and cycles without context-switching." },
      { name: "Slack", why: "Read channels and post messages — great for status updates and async standups." },
      { name: "Google Drive", why: "Search and read Drive files. Pairs well with summarization workflows." },
      { name: "Resend MCP", why: "Send transactional emails from your agent. Good for outbound automation." },
    ],
  },
  {
    slug: "best-mcp-for-scraping",
    title: "Best MCP servers for web scraping and crawling",
    intro: "When the agent needs to actually browse the web — fill forms, click buttons, scrape structured data — these are the production-grade options.",
    picks: [
      { name: "Puppeteer", why: "Local Chrome automation. Free, but you manage the runtime." },
      { name: "Browserbase MCP", why: "Cloud browsers with stealth + proxy. Best for serious scraping at scale." },
      { name: "Apify MCP", why: "4,000+ ready-made scrapers. Don't reinvent the wheel." },
      { name: "Firecrawl MCP", why: "Markdown-formatted page extraction tuned for LLM context." },
      { name: "Fetch", why: "Lightweight HTML→Markdown for simple cases." },
    ],
  },
  {
    slug: "best-mcp-free",
    title: "Best free MCP servers (no API key required)",
    intro: "Want to try MCP today without signing up for anything? These servers run locally or hit free tiers — copy-paste the config and go.",
    picks: [
      { name: "Toolora MCP", why: "12 tools (PDF, OCR, QR, audio transcription) — no auth, no API key, hosted free." },
      { name: "Filesystem", why: "Pure local. Just point it at a directory." },
      { name: "SQLite", why: "Pure local. Point it at a .db file." },
      { name: "Memory", why: "Persistent knowledge graph stored on your machine." },
      { name: "Sequential Thinking", why: "Reasoning helper. No network calls of any kind." },
      { name: "Time", why: "Tiny but essential. Timezone math made trivial." },
    ],
  },
];
