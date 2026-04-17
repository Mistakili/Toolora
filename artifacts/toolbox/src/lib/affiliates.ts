export interface Affiliate {
  id: string;
  title: string;
  blurb: string;
  url: string;
  cta: string;
  tags: string[];
}

export const AFFILIATES: Affiliate[] = [
  {
    id: "linear",
    title: "Linear — issue tracker AI agents love",
    blurb: "Native MCP integration. Used by Vercel, Cash App, Ramp.",
    url: "https://linear.app/?ref=toolora",
    cta: "Try Linear free",
    tags: ["mcp", "agents", "productivity", "tools"],
  },
  {
    id: "raycast",
    title: "Raycast — productivity command bar",
    blurb: "Run Toolora MCP tools right from your launcher.",
    url: "https://www.raycast.com/?via=toolora",
    cta: "Get Raycast",
    tags: ["productivity", "mac", "tools", "cli"],
  },
  {
    id: "cursor",
    title: "Cursor — AI code editor",
    blurb: "Native MCP support. Add Toolora in 30 seconds.",
    url: "https://cursor.com/?ref=toolora",
    cta: "Download Cursor",
    tags: ["mcp", "agents", "ai", "developer", "code"],
  },
  {
    id: "notion",
    title: "Notion — docs that grow with you",
    blurb: "Pair with Toolora's PDF + DOCX extractors for instant ingest.",
    url: "https://affiliate.notion.so/toolora",
    cta: "Try Notion free",
    tags: ["pdf", "docx", "documents", "productivity", "writing"],
  },
  {
    id: "polar",
    title: "Polar — payments for indie devs",
    blurb: "Open-source Stripe alternative. 4% flat, MoR included.",
    url: "https://polar.sh/?ref=toolora",
    cta: "Try Polar",
    tags: ["payments", "saas", "indie", "developer"],
  },
];

export function pickAffiliate(tags: string[]): Affiliate | null {
  const lowered = tags.map((t) => t.toLowerCase());
  const scored = AFFILIATES.map((a) => ({
    affiliate: a,
    score: a.tags.filter((t) => lowered.includes(t)).length,
  })).filter((s) => s.score > 0);
  if (scored.length === 0) return AFFILIATES[Math.floor(Math.random() * AFFILIATES.length)];
  scored.sort((a, b) => b.score - a.score);
  return scored[0].affiliate;
}
