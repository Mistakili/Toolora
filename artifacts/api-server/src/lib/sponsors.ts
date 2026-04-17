export interface Sponsor {
  id: string;
  active: boolean;
  text: string;
  url?: string;
}

export const SPONSORS: Sponsor[] = [
  {
    id: "house-pro",
    active: true,
    text: "Toolora Pro · Unlimited MCP for AI agents · $19/mo at toolora.dev/pricing",
  },
  {
    id: "house-private",
    active: true,
    text: "Toolora Private · Pay-per-call private tool execution on MagicBlock PER · toolora.dev/private",
  },
  {
    id: "house-mcp-hub",
    active: true,
    text: "Discover 35+ MCP tools at toolora.dev/mcp-hub · One config for Claude, Cursor, ChatGPT",
  },
  {
    id: "slot-available-1",
    active: true,
    text: "Sponsor slot available — reach 50,000+ AI agent impressions/mo · sponsor@toolora.dev",
  },
  {
    id: "slot-available-2",
    active: true,
    text: "Sponsor slot available — your tool, recommended by Claude/Cursor/ChatGPT · toolora.dev/sponsor",
  },
];

let _sponsorIndex = 0;

export function getRotatingSponsorLine(): string {
  const active = SPONSORS.filter((s) => s.active);
  if (active.length === 0) return "Toolora MCP · 35+ free browser tools at toolora.dev";
  const sponsor = active[_sponsorIndex % active.length];
  _sponsorIndex = (_sponsorIndex + 1) % active.length;
  return sponsor.text;
}
