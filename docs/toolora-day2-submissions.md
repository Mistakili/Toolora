# Day 2 — MCP Directory Submissions (Apr 29, 2026)

12 submission packets ready to copy-paste. Order: highest-traffic and easiest-to-merge first.

Endpoint we're submitting: `https://toolora.dev/api/mcp` (Streamable HTTP, MCP 2025-03-26)
Manifest: `https://toolora.dev/.well-known/mcp.json`
Smithery YAML: `https://toolora.dev/smithery.yaml`

---

## 1. Smithery (smithery.ai) — single biggest source of MCP traffic

**Action:** Go to https://smithery.ai/server/new and submit Toolora.

**Form fields:**
- Repository / source: `https://toolora.dev` (or paste smithery.yaml URL above)
- Server name: `toolora`
- Display name: `Toolora`
- Transport: `Streamable HTTP`
- URL: `https://toolora.dev/api/mcp`
- Categories: document-processing, file-conversion, web-scraping, data-extraction, ocr, transcription, developer-tools, productivity, ai-tools

**Description (paste verbatim):**
> Privacy-first MCP with 25 free tools — PDF/DOCX/Excel reading, OCR, audio transcription (Whisper), JS-rendered web scraping, structured data extraction, and developer utilities. No API key, no signup. 200 free calls/day per client; Pro $19/mo unlimited. Files processed in memory and never stored. Replaces a stack of paid tools (Firecrawl, Mistral OCR, Whisper API, Adobe PDF Services) with one MCP.

---

## 2. mcpservers.org (the wong2 curated list — ~12k stars)

**Action:** Open a PR against https://github.com/wong2/awesome-mcp-servers

**File to edit:** `README.md` — add a new line under the most relevant category (likely "🛠️ Productivity" or "📊 Data Science").

**PR title:** `Add Toolora — privacy-first MCP, 25 free tools, no API key`

**PR body:**
```markdown
Adds [Toolora](https://toolora.dev) — a single MCP server that bundles 25 free
agent tools: PDF/DOCX/Excel reading, OCR, audio transcription (Whisper),
JS-rendered web scraping (Playwright), structured data extraction, plus 15
developer utilities. No API key, no signup; 200 calls/day per client.

Endpoint: `https://toolora.dev/api/mcp` (Streamable HTTP, MCP 2025-03-26)
Manifest: `https://toolora.dev/.well-known/mcp.json`

Privacy: files processed in-memory and never written to disk; only anonymous, salted-hash request metadata is retained for 30 days.
```

**Line to add to README.md** (insert alphabetically under the right category):
```markdown
- [Toolora](https://toolora.dev) — Privacy-first MCP with 25 free tools (PDF, OCR, Whisper, web scraping, structured extraction). No API key, 200 calls/day free.
```

---

## 3. Glama (glama.ai/mcp/servers)

**Action:** https://glama.ai/mcp/servers/submit

**Fields:**
- URL: `https://toolora.dev/api/mcp`
- Manifest: `https://toolora.dev/.well-known/mcp.json`
- Source: `https://toolora.dev`
- Description: same as Smithery (above)

Glama auto-discovers from `.well-known/mcp.json` so the rich manifest will populate categories, tools, and pricing automatically.

---

## 4. punkpeye/awesome-mcp-servers (the punkpeye curated list)

**Action:** PR against https://github.com/punkpeye/awesome-mcp-servers

**Same line + PR body as #2 above.** Different category structure — file under "Document & File Management" + cross-reference under "Web Scraping".

---

## 5. appcypher/awesome-mcp-servers (the appcypher curated list)

**Action:** PR against https://github.com/appcypher/awesome-mcp-servers

**Same line as #2.** This list is alphabetised under each category — slot in correctly.

---

## 6. modelcontextprotocol/servers (the official Anthropic-curated list)

**Action:** PR against https://github.com/modelcontextprotocol/servers — add to the "Community Servers" section in README.md.

**Line:**
```markdown
- **[Toolora](https://toolora.dev)** — Privacy-first MCP with 25 free tools: PDF/DOCX/Excel, OCR, Whisper transcription, JS-rendered scraping, structured extraction. No API key. `https://toolora.dev/api/mcp`
```

---

## 7. mcp.so (Chinese-language directory, fast-growing)

**Action:** https://mcp.so/submit

Fill in the form with the same description and endpoint. Translation of description (use DeepL or paste English — they accept both):
> 隐私优先的 MCP 服务器，提供 25 个免费 AI 智能体工具 — PDF/DOCX/Excel 读取、OCR、Whisper 音频转录、JavaScript 网页抓取、结构化数据提取等。无需 API key，每天 200 次免费调用。文件不存储。

---

## 8. mcphub.io

**Action:** https://mcphub.io/submit

Same fields. Auto-pulls from `.well-known/mcp.json`.

---

## 9. cline/mcp-marketplace (built into the Cline VS Code extension)

**Action:** PR against https://github.com/cline/mcp-marketplace

**Add to `marketplace.json`:**
```json
{
  "id": "toolora",
  "name": "Toolora",
  "description": "Privacy-first MCP — 25 free tools for PDF/OCR/scraping/transcription. No API key, 200 calls/day free.",
  "url": "https://toolora.dev/api/mcp",
  "transport": "http",
  "homepage": "https://toolora.dev",
  "categories": ["document-processing", "ocr", "web-scraping", "developer-tools"],
  "license": "MIT"
}
```

---

## 10. n8n community node directory

**Action:** Already have `lib/n8n-nodes-toolora` in the monorepo. Push to npm with the `@workspace/n8n-nodes-toolora` package — n8n auto-indexes. Confirm `package.json` keywords include `n8n-community-node-package`.

```bash
pnpm --filter @workspace/n8n-nodes-toolora publish --access public
```

---

## 11. Apify Store (MCP integration listing)

**Action:** Email partners@apify.com (already on the verified-emails list from Day 0):

> Subject: Toolora MCP — privacy-first agent tools, free tier, would fit Apify Store
>
> Hi Apify team,
>
> I'm reaching out from Toolora (toolora.dev) — we run a privacy-first MCP server with 25 free agent tools (PDF/OCR/Whisper/JS scraping/structured extraction). 3,019 unique MCP connections in the past 30 days, climbing fast for the May 2 Replit Agent free day.
>
> I see Apify Store carries MCP integrations now. Would Toolora be a fit as a featured listing? Happy to deep-link our `extract_structured_data` and `scrape_url_js` tools alongside your scrapers — they're complementary (we handle the post-scrape cleanup).
>
> Manifest: https://toolora.dev/.well-known/mcp.json
> One-line install: `npx -y mcp-remote https://toolora.dev/api/mcp`
>
> Thanks,
> [name]

---

## 12. Replit Templates (highest May 2 leverage)

**Action:** Create a Replit Template called "Toolora MCP — Free agent tools" that auto-installs Toolora as an MCP server in any Replit Agent project. Template should:
- Add `https://toolora.dev/api/mcp` to `.agent.toml` or equivalent
- Include a README explaining the 25 free tools
- Set tags: `mcp`, `agent`, `tools`, `pdf`, `ocr`, `scraping`

This is the single biggest May 2 lever — agents on the free day will browse templates and Toolora gets one-click install.

---

## Submission timing (Day 2 — Apr 29)

| Time | Action |
|------|--------|
| 9 AM | Smithery (#1) — instant indexing |
| 10 AM | Glama (#3) — auto-pulls manifest |
| 10:30 AM | mcp.so (#7) + mcphub.io (#8) |
| 11 AM | PRs: wong2 (#2), punkpeye (#4), appcypher (#5), official (#6), cline (#9) |
| 1 PM | Apify email (#11) |
| 2 PM | Replit Template (#12) — needs the most prep, do last |
| End of day | n8n npm publish (#10) |

PR merges typically land in 24-72h on the major lists, so submitting Apr 29 lands them on Apr 30–May 1, just in time for May 2.

---

## After-submission checklist

- [ ] Confirm Smithery listing is live and shows 25 tools (not 12)
- [ ] Verify Glama auto-pulled the rich `_meta` from `/.well-known/mcp.json`
- [ ] Tweet Smithery listing link (queues the Day 4 thread)
- [ ] Add to KPI dashboard: "directory referrers" segment using new `client_name` column (Smithery, Glama, mcphub UAs)
