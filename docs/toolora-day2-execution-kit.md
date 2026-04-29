# Day 2 — Execution Kit (Apr 29, 2026)

**Goal:** ship 11 manual submissions in ~60 minutes total. n8n npm publish is **already done** (`n8n-nodes-toolora@0.1.1` live).

Each item below is a self-contained packet: open the URL, paste the block, hit submit. No thinking required.

> **Two reusable variables to keep on your clipboard between submissions:**
> - **Manifest URL** → `https://toolora.dev/.well-known/mcp.json`
> - **MCP Endpoint** → `https://toolora.dev/api/mcp`

---

## Suggested order (open all 11 tabs first, then walk down the list)

1. https://smithery.ai/server/new
2. https://glama.ai/mcp/servers/submit
3. https://mcp.so/submit
4. https://mcphub.io/submit
5. https://github.com/wong2/awesome-mcp-servers/edit/main/README.md
6. https://github.com/punkpeye/awesome-mcp-servers/edit/main/README.md
7. https://github.com/appcypher/awesome-mcp-servers/edit/main/README.md
8. https://github.com/modelcontextprotocol/servers/edit/main/README.md
9. https://github.com/cline/mcp-marketplace (repo entrance — nav to right file)
10. mailto:partners@apify.com (template below)
11. https://replit.com/templates → "Create Template" (you, from Replit UI)

---

## #1 — Smithery (smithery.ai) — 2 min

**URL:** https://smithery.ai/server/new

Fill the form. **Tip:** if Smithery prompts for a YAML URL, paste this and it will auto-pull the rest:
```
https://toolora.dev/smithery.yaml
```

Manual fallback fields:

| Field | Value |
|---|---|
| Server name | `toolora` |
| Display name | `Toolora` |
| Transport | `Streamable HTTP` |
| URL | `https://toolora.dev/api/mcp` |
| Repository | `https://github.com/wesleyolis/toolora` |
| Categories | `document-processing, ocr, web-scraping, data-extraction, transcription, developer-tools, productivity, ai-tools` |

**Description (paste verbatim):**
```
The privacy-first marketplace and billing layer for the MCP economy. Two halves in one platform: (1) 25 free agent tools — PDF/DOCX/Excel reading, OCR, Whisper audio transcription, JS-rendered web scraping, structured data extraction, and developer utilities. No API key, no signup. 200 free calls/day per client; Pro $19/mo unlimited. (2) A public hub of third-party MCP servers, with optional USDC billing for any listed MCP via Toolora Gateway (launching May 2, 2026 — 5% take rate, instant on-chain settlement). Files processed in memory and never stored on disk; only anonymous, salted-hash request metadata is retained for 30 days. Replaces a stack of paid tools (Firecrawl, Mistral OCR, Whisper API, Adobe PDF Services) with one MCP and gives builders a way to bill agents in fractions of a cent.
```

---

## #2 — Glama (glama.ai) — 1 min

**URL:** https://glama.ai/mcp/servers/submit

| Field | Value |
|---|---|
| URL | `https://toolora.dev/api/mcp` |
| Manifest | `https://toolora.dev/.well-known/mcp.json` |
| Source | `https://toolora.dev` |
| Description | (same as Smithery above) |

> Glama auto-discovers from `.well-known/mcp.json` so categories, tools and pricing populate automatically.

---

## #3 — mcp.so — 2 min

**URL:** https://mcp.so/submit

Same fields as Smithery. Paste this Chinese description in the localized field if offered:
```
隐私优先的 MCP 服务器，提供 25 个免费 AI 智能体工具 — PDF/DOCX/Excel 读取、OCR、Whisper 音频转录、JavaScript 网页抓取、结构化数据提取等。无需 API key，每天 200 次免费调用。文件不存储。
```

---

## #4 — mcphub.io — 1 min

**URL:** https://mcphub.io/submit

Paste **only** the manifest URL — mcphub auto-pulls the rest:
```
https://toolora.dev/.well-known/mcp.json
```

---

## #5 — wong2/awesome-mcp-servers — 3 min

**URL (opens GitHub web editor for you to fork-and-edit):**
https://github.com/wong2/awesome-mcp-servers/edit/main/README.md

**Where to paste:** scroll to `## Community Servers` (alphabetical). Insert this line **between "Token Metrics" and "Trade Agent"** (search for `Token Metrics` to land in the right spot):

```markdown
- **[Toolora](https://toolora.dev)** - Privacy-first MCP marketplace + 25 free tools (PDF/OCR/Whisper/scraping/structured extraction). Public hub of 3rd-party MCPs with optional USDC billing via Toolora Gateway (May 2026). No API key, 200 calls/day free. Endpoint: `https://toolora.dev/api/mcp`
```

**Commit message:**
```
Add Toolora — privacy-first MCP, 25 free tools, no API key
```

**PR title:** same as commit message.

**PR body:**
```
Adds [Toolora](https://toolora.dev) — a single MCP server that bundles 25 free
agent tools: PDF/DOCX/Excel reading, OCR, audio transcription (Whisper),
JS-rendered web scraping (Playwright), structured data extraction, plus 15
developer utilities. No API key, no signup; 200 calls/day per client.

- Endpoint: `https://toolora.dev/api/mcp` (Streamable HTTP, MCP 2025-03-26)
- Manifest: `https://toolora.dev/.well-known/mcp.json`
- Privacy: files processed in-memory and never written to disk; only anonymous,
  salted-hash request metadata is retained for 30 days.
```

---

## #6 — punkpeye/awesome-mcp-servers — 3 min

**URL:** https://github.com/punkpeye/awesome-mcp-servers/edit/main/README.md

This list is split by category. Toolora is multi-purpose, so file the **primary** listing under **Browser Automation** (the highest-traffic category that fits) and skip cross-listing — punkpeye usually rejects double-entries.

Search for `### 📂 <a name="browser-automation"></a>Browser Automation` and insert this line alphabetically (look for the `T` slot — likely between any existing T entries; if none, just at end of T-block):

```markdown
- [Toolora](https://toolora.dev) 📇 ☁️ - Privacy-first MCP marketplace + 25 free tools: PDF/DOCX/Excel reading, OCR, Whisper transcription, JS-rendered web scraping, structured data extraction. Public hub of 3rd-party MCPs with optional USDC billing via Toolora Gateway (May 2026, 5% take rate). No API key, 200 calls/day free, files never persisted to disk. Replaces Firecrawl + Mistral OCR + Whisper API + Adobe PDF in one server.
```

**Legend used:** `📇` = TypeScript, `☁️` = cloud-hosted. (See punkpeye's `## Legend` section.)

**Commit + PR body:** same as #5.

---

## #7 — appcypher/awesome-mcp-servers — 2 min

**URL:** https://github.com/appcypher/awesome-mcp-servers/edit/main/README.md

This list is also category-based and alphabetised. File under **Browser Automation** (or `Productivity` if Browser Automation isn't present) with the same line as #6 (drop the legend emojis if appcypher's section doesn't use them):

```markdown
- [Toolora](https://toolora.dev) - Privacy-first MCP marketplace + 25 free tools (PDF/OCR/Whisper/scraping/structured extraction). Public hub of 3rd-party MCPs with optional USDC billing via Toolora Gateway (May 2026). No API key, 200 calls/day free.
```

**Commit + PR body:** same as #5.

---

## #8 — modelcontextprotocol/servers (the official Anthropic-curated list) — 3 min

**URL:** https://github.com/modelcontextprotocol/servers/edit/main/README.md

Scroll to `## 🌎 Community Servers` (or whatever it's called in the latest version) and insert alphabetically:

```markdown
- **[Toolora](https://toolora.dev)** - Privacy-first MCP marketplace + 25 free tools (PDF/OCR/Whisper/scraping/structured extraction). Public hub of 3rd-party MCPs with optional USDC billing via Toolora Gateway (May 2026). No API key, 200 calls/day free. Endpoint: `https://toolora.dev/api/mcp`
```

**Commit + PR body:** same as #5.

---

## #9 — cline/mcp-marketplace — 4 min

**URL:** https://github.com/cline/mcp-marketplace

The contribution flow varies — typically you fork, add a JSON entry under `marketplace.json` (or a `servers/` subfolder), and PR. Open the repo, read the latest `CONTRIBUTING.md`, and add this entry:

```json
{
  "id": "toolora",
  "name": "Toolora",
  "description": "Privacy-first MCP marketplace + 25 free tools for PDF/OCR/scraping/Whisper/structured extraction, plus a public hub of 3rd-party MCPs with USDC billing via Toolora Gateway (May 2026). No API key, 200 calls/day free.",
  "url": "https://toolora.dev/api/mcp",
  "transport": "http",
  "homepage": "https://toolora.dev",
  "categories": ["document-processing", "ocr", "web-scraping", "developer-tools"],
  "license": "MIT"
}
```

**Commit + PR body:** same as #5.

---

## #10 — Apify (email) — 2 min

**To:** `partners@apify.com`

**Subject:**
```
Toolora MCP — privacy-first agent tools, free tier, would fit Apify Store
```

**Body:**
```
Hi Apify team,

I'm reaching out from Toolora (https://toolora.dev) — we run a privacy-first
MCP server with 25 free agent tools (PDF/OCR/Whisper/JS scraping/structured
extraction). 3,019 unique MCP connections in the past 30 days, and we expect
a meaningful spike on May 2 for the Replit Agent free day.

I see Apify Store carries MCP integrations now. Would Toolora be a fit as a
featured listing? Happy to deep-link our `extract_structured_data` and
`scrape_url_js` tools alongside your scrapers — they're complementary
(we handle the post-scrape cleanup and structured-data layer).

- Manifest: https://toolora.dev/.well-known/mcp.json
- One-line install:  npx -y mcp-remote https://toolora.dev/api/mcp

Happy to jump on a call if useful.

Thanks,
[your name]
```

---

## #11 — Replit Templates (highest May 2 leverage) — 10–15 min

This needs your Replit account UI — I can't create templates here.

**Steps:**
1. Open Replit → **Templates** → **Create Template**
2. Use the existing `artifacts/toolbox` repo (or fork it minimal — just the MCP-config bits) as the source
3. Settings:
   - **Title:** `Toolora MCP — Free Agent Tools (PDF, OCR, Scraping, Whisper)`
   - **Tags:** `mcp`, `agent`, `tools`, `pdf`, `ocr`, `scraping`, `whisper`, `privacy`
   - **Description:**
     ```
     One-click install for Toolora MCP — 25 free agent tools for any Replit
     Agent project. PDF reading, OCR, audio transcription (Whisper), JS-
     rendered web scraping, structured data extraction. No API key, no signup.
     200 free calls/day per agent. Files never stored on disk.
     ```
4. **Pre-configure the MCP server in the template** — add to `.replit` (or wherever Replit Agent reads MCP config):
   ```toml
   [[agent.mcp]]
   name = "toolora"
   url = "https://toolora.dev/api/mcp"
   ```
5. Add a `README.md` at template root explaining the 25 tools (link to https://toolora.dev/mcp).

> **Why this matters for May 2:** when Replit Agent free-day users browse templates for inspiration, Toolora gets one-click install with zero config. This is the single biggest May 2 conversion lever.

---

## #12 — n8n community node — DONE ✅

`n8n-nodes-toolora@0.1.1` is live on npm:
- https://www.npmjs.com/package/n8n-nodes-toolora
- n8n auto-indexes the community-node directory nightly; expect appearance in n8n's "Install Community Node" search within 24–48 h.
- No further action needed today.

---

## Estimated total time

| Category | Items | Per item | Total |
|---|---|---|---|
| Web forms (#1–#4) | 4 | 1–2 min | ~6 min |
| GitHub PRs (#5–#9) | 5 | 3 min | ~15 min |
| Email (#10) | 1 | 2 min | ~2 min |
| Replit Template (#11) | 1 | 15 min | ~15 min |
| **TOTAL** | **11** | | **~38 min** |

---

## After-submission verification (do this end-of-day)

- [ ] Smithery: visit `https://smithery.ai/server/toolora` → confirms 25 tools, not 12
- [ ] Glama: visit `https://glama.ai/mcp/servers/toolora` → confirm `_meta` pulled (categories show)
- [ ] mcphub: search "toolora"
- [ ] npm: `npm view n8n-nodes-toolora` shows `0.1.1` (already verified)
- [ ] PR queue: bookmark all 5 PR URLs to track merge status (typical merge: 24–72 h)
- [ ] Add `Smithery`, `Glama`, `mcphub`, `Cursor`, `Cline` to the KPI dashboard's referrer-segment view (uses the new `client_name` column)

---

## What to ping me with when you're done

Just paste back the 5 PR URLs (the GitHub ones — Smithery/Glama/mcphub/mcp.so are fire-and-forget) and I'll add them to the KPI dashboard for monitoring on May 2.
