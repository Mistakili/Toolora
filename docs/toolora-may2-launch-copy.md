# May 2 Launch Copy — Pre-written, Paste-Ready

All copy below is final. Don't rewrite on May 2 — paste verbatim.

> **Master positioning (one paragraph — paste this anywhere short):**
> *Toolora is the privacy-first marketplace and billing layer for the MCP economy. 25 free agent tools (PDF/OCR/Whisper/scraping/structured extraction — no API key, no signup, 200 free calls/day) bootstrap demand. A public hub of third-party MCP servers makes us the discovery surface. The Gateway lets any MCP builder bill in USDC and keep 95%. We're the App Store + Stripe for MCP, and both halves are live.*

---

## GitHub README (paste into root of new public repo)

```markdown
# Toolora — Marketplace & Billing for the MCP Economy

> **Privacy-first MCP server with 25 free tools, plus a public hub of third-party MCPs, plus USDC billing for any listed server. App Store + Stripe for MCP — both halves are live.**

[![Live MCP](https://img.shields.io/badge/MCP-live-brightgreen)](https://toolora.dev/api/mcp)
[![Tools](https://img.shields.io/badge/tools-25%20free-blue)](https://toolora.dev/.well-known/mcp.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![HackerNoon](https://img.shields.io/badge/featured-HackerNoon-00FF7F)](https://hackernoon.com/i-added-an-mcp-server-to-my-browser-based-tool-suite-agents-found-it-immediately)

## Press

- **HackerNoon** — *[I Added an MCP Server to My Browser-Based Tool Suite. Agents Found It Immediately.](https://hackernoon.com/i-added-an-mcp-server-to-my-browser-based-tool-suite-agents-found-it-immediately)* (April 2026, 4M+ readership)

## What is Toolora?

Toolora is two things in one platform:

1. **A free, privacy-first MCP server** with 25 production tools (PDF/DOCX/Excel reading, OCR, audio transcription via Whisper, JS-rendered web scraping, structured data extraction, plus 15 dev utilities). No API key. No signup. 200 free calls per day per agent. Files are processed in memory and never written to disk.

2. **A marketplace + billing layer** for *other* MCP servers. List your MCP on `toolora.dev/mcp/hub`. Enable Gateway billing. Charge per-call in USDC. We take 5%, you keep 95%. Settlement is on-chain — no escrow, no chargebacks, no waiting 30 days for a payout.

## One-line install

For any MCP-compatible client (Claude Desktop, Cursor, Cline, Replit Agent, Continue):

```
https://toolora.dev/api/mcp
```

That's it. No API key, no environment variable.

### Claude Desktop / Cursor / Cline JSON

```json
{
  "mcpServers": {
    "toolora": {
      "url": "https://toolora.dev/api/mcp",
      "transport": "http"
    }
  }
}
```

### Replit Agent

Add the URL via your Replit Agent's MCP server settings panel.

## Why "privacy-first"?

- Files you upload (PDFs, audio, images) are processed in RAM and never persisted to disk.
- We retain anonymous, salted-hash request metadata for 30 days for abuse prevention. We never log raw IPs, file contents, or session tokens.
- Open-source server code is in this repo — audit anything.

## What replaces what

| Tool | Toolora alternative | Free tier savings |
|---|---|---|
| Firecrawl ($83/mo) | `read_url` + `scrape_url_js` | 100% |
| Mistral OCR ($1/1k pages) | `ocr_image` | 100% |
| OpenAI Whisper API ($0.006/min) | `transcribe_audio` | 100% |
| Adobe PDF Services ($150/mo) | `extract_pdf_text` + `merge_pdfs` | 100% |
| **Combined replacement** | One MCP server | **~$300+/mo** |

## Pricing

| Tier | Calls/day | Price |
|---|---|---|
| Free | 200/day per client | $0 |
| Pro | Unlimited | $19/mo |
| Gateway (for MCP builders) | Per-call USDC | 5% take rate |

## The Gateway — for MCP builders

Built an MCP and want to charge for it?

1. List on [toolora.dev/mcp/hub](https://toolora.dev/mcp/hub)
2. Enable Gateway billing in your owner dashboard
3. Set price per call (e.g. $0.001 per `extract_invoice_data` call)
4. Paste your Solana USDC payout wallet
5. Get a `gateway.toolora.dev/mcp/<your-slug>` proxy URL — point your users at it

We handle: x402 payment challenges, USDC settlement, billing dashboard for your users, refund logic. You handle: shipping a great MCP. We take 5% of revenue.

[Read the Gateway docs →](https://toolora.dev/gateway/docs)

## Architecture

```
agents → toolora.dev/api/mcp ─────────► 25 in-house free tools
                                         │
agents → gateway.toolora.dev/mcp/X ─────► proxy to 3rd-party MCP
                                         │ checks payment, forwards,
                                         │ logs billing event,
                                         └─► settles 95/5 USDC daily
```

## Repos in this monorepo

- `artifacts/api-server` — MCP endpoint, Gateway proxy, REST API
- `artifacts/toolbox` — public website, Hub, Owner Dashboard, Gateway landing
- `lib/db` — Drizzle Postgres schemas
- `lib/n8n-nodes-toolora` — npm-published n8n community node ([npmjs.com](https://www.npmjs.com/package/n8n-nodes-toolora))

## Contributing

PRs welcome — especially new tools for the free tier and improvements to the Gateway proxy. See `CONTRIBUTING.md`.

## License

MIT. Use it for anything.

---

Built with ❤️ for the agent economy. Star this repo if you want sub-cent USDC billing to be the default for MCP.
```

---

## `/replit` landing page (web copy)

**Hero (h1):** *One-click MCP for any Replit Agent project*
**Subhero:** 25 free agent tools, no API key, no signup. Plus: list your own MCP and bill your users in USDC.

**Press strip (small, just under subhero):** *As featured in [HackerNoon](https://hackernoon.com/i-added-an-mcp-server-to-my-browser-based-tool-suite-agents-found-it-immediately) — "Agents Found It Immediately."*

**Three-feature row:**

| 🛠️ 25 free tools | 🛒 List your own MCP | 💸 Bill in USDC |
|---|---|---|
| PDF/OCR/Whisper/scraping/structured extraction. 200 free calls/day per agent, no API key. | Add your MCP to our public hub. Get discovered by agents on Claude, Cursor, Cline, and Replit. | Enable Gateway billing on your listing. Charge per call. We take 5%, you keep 95%. Settled instantly in USDC. |

**One-click install for Replit Agent:**

```toml
# .replit
[[agent.mcp]]
name = "toolora"
url = "https://toolora.dev/api/mcp"
```

**Or fork the template:** [replit.com/@toolora/toolora-mcp](https://replit.com/templates) → "Use Template" → done.

**Bottom CTA:** *Built for Replit Agent free day. List your MCP today, get billed users tomorrow.* [Submit your MCP →](https://toolora.dev/mcp/submit)

---

## `/gateway` landing page (web copy)

**Hero (h1):** *Stripe for MCP servers. Bill your users in USDC.*
**Subhero:** List on Toolora's marketplace. Enable Gateway billing. Charge per call. Get paid in USDC, instantly. We take 5%, you keep 95%.

**Press strip (small, just under subhero):** *As featured in [HackerNoon](https://hackernoon.com/i-added-an-mcp-server-to-my-browser-based-tool-suite-agents-found-it-immediately) — "Agents Found It Immediately."*

**Three-feature row:**

| 🪪 No accounts to manage | 💸 Sub-cent unit economics | 🔐 Settled on-chain |
|---|---|---|
| Your callers pay via x402 payment challenges. No credit cards, no Stripe accounts, no chargebacks. | Charge $0.001 per call if you want. USDC fees are negligible — try that on Stripe. | Payouts settle to your Solana or Stellar wallet the same block as the call. No escrow, no 30-day waits. |

**Integration in 60 seconds:**

```
1. Visit your Owner Dashboard → Billing
2. Enable Gateway, paste your upstream MCP URL, set a price
3. Connect your USDC payout wallet
4. Point your users at gateway.toolora.dev/mcp/<your-slug>
That's it.
```

**Pricing block:**

| What you charge per call | What you keep | Toolora fee |
|---|---|---|
| $0.001 | $0.00095 (95%) | $0.00005 (5%) |
| $0.01 | $0.0095 | $0.0005 |
| $0.10 | $0.095 | $0.005 |

**FAQ (4 q's):**

- *"What's an MCP?"* → Model Context Protocol. The standard way AI agents (Claude, Cursor, Replit Agent) call tools. Anthropic shipped it Nov 2024.
- *"Why USDC, not Stripe?"* → Stripe's 2.9% + $0.30 makes sub-cent calls uneconomic. USDC is fractions of a cent. We support both eventually; USDC ships first.
- *"Can I use my own domain?"* → Custom proxy domains coming after May 31. For now, `gateway.toolora.dev/mcp/<slug>` works fine.
- *"What if my upstream goes down?"* → We return 502 to the caller and don't bill. You keep 100% control of your server.

**Bottom CTA:** *Get your first paying agent today.* [Open Owner Dashboard →](https://toolora.dev/dashboard/mcp-owner)

---

## Tweet thread (15 tweets)

> **Post at the launch hour. Pin to profile. Reply with screenshots in real time.**

**1/15** Today is Replit Agent free day. So we shipped something we've been building for 5 months in a single 24-hour push.

Toolora is now the privacy-first marketplace + billing layer for the MCP economy. App Store + Stripe for MCP. Both halves are live. 🧵

**2/15** What's an MCP? It's how Claude, Cursor, Cline, Replit Agent, and Continue talk to external tools. Anthropic shipped it Nov 2024. 18 months in, the protocol has tools but no marketplace and no billing rail.

We just shipped both.

**3/15** Half one — 25 free agent tools, no API key, no signup, 200 calls/day per agent.

PDF reading. OCR. Whisper transcription. JS-rendered web scraping. Structured data extraction. Replaces ~$300/mo of Firecrawl + Mistral OCR + Whisper API + Adobe PDF.

One URL: `https://toolora.dev/api/mcp`

**4/15** Half two — a public hub at `toolora.dev/mcp/hub` where any MCP builder can list their server. We've already curated [N] community MCPs. Browse, install, use.

Discovery is half of every marketplace. We just brought it to MCP.

**5/15** The unlock — Toolora Gateway. List your MCP on the hub, enable Gateway billing, charge per call in USDC. We take 5%, you keep 95%. Payouts settle on-chain the same block.

[Screenshot of first real Gateway transaction]

**6/15** Why USDC instead of Stripe? Math.

Stripe is 2.9% + $0.30 per transaction. A $0.001 MCP call costs you $0.30 to bill. Uneconomic.

USDC fees on Solana are fractions of a cent. Sub-cent agent billing finally works.

**7/15** Privacy is structural. Every file you upload is processed in RAM and never persisted. We retain anonymous salted-hash metadata for 30 days. No raw IPs. No file contents. No session tokens. Open-source server code on GitHub today.

[link to GitHub]

**8/15** Why "today"? Because Replit Agent is free for 24 hours and the agents using it deserve a free MCP that just works.

Add to your Replit Agent project in one line:
`url = "https://toolora.dev/api/mcp"`

Or fork our template: [link]

**9/15** Momentum check, first hour:
- [X] unique MCP connections
- [Y] tool calls served
- Top clients: Replit Agent, Claude Desktop, Cursor

(HackerNoon featured the build last week — 4M+ readers — so a chunk of you already know the free tools side. Today's news is the marketplace + USDC half going live.)

Live KPI dashboard: [link]

[update with real numbers as they come in]

**10/15** For MCP builders watching this — we want you on the hub.

Submit at `toolora.dev/mcp/submit`. Takes 90 seconds. Once listed, enable Gateway billing and start earning USDC from agent traffic the same day.

We've built the demand. You bring the supply.

**11/15** What we're not yet: 
- A model provider (we don't compete with Anthropic/OpenAI)
- A coding agent (we don't compete with Cursor/Cline/Replit Agent)
- A scraping vendor (we don't compete with Firecrawl)

We're the marketplace and billing rail underneath all of them.

**12/15** Long-term: as the agent economy scales to billions of tool calls/year, the company that owns billing becomes a $10B platform. Stripe-for-the-web played out in 7 years. MCP-billing will play out in 2.

We started in February. We're shipping fast.

**13/15** What's next:
- This week: scale through Replit Agent surge
- Two weeks: 5+ paying Gateway design partners
- Six weeks: Y Combinator W26 application
- Q4: 50+ MCPs on Gateway, $10K+ MRR

Everything is open in `docs/toolora-roadmap.md`. Public roadmap from day one.

**14/15** Huge thanks to everyone who connected to Toolora MCP this past month. 3,000+ unique agents in 30 days, no marketing, just directory listings. You showed us this market exists.

Today is the day we go from free tool to actual platform.

**15/15** Try it. Star the repo. Reply with what you'd want billed via Gateway. Submit your MCP.

🔗 toolora.dev
📦 github.com/toolora/toolora
💸 toolora.dev/gateway
🛒 toolora.dev/mcp/hub

Let's make MCP a real economy.

---

## Show HN post

**Title:** `Show HN: Toolora – Marketplace and USDC billing layer for MCP servers`

**URL:** `https://toolora.dev`

**Text:**
```
Hi HN — I built Toolora as a free, privacy-first MCP server (PDF reading, OCR, Whisper transcription, JS scraping, structured data extraction). 25 tools, no API key, 200 calls/day free per agent. HackerNoon ran a piece on the build last week [1] which was a good gut-check that the free side resonates.

Over the past 30 days it picked up 3,000+ unique MCP connections from Claude, Cursor, Cline, and Replit Agent — purely from directory listings. Builders kept asking the same question: "How do I bill my own MCP users for tool calls?"

So today I shipped Toolora Gateway: any MCP builder can list their server on toolora.dev/mcp/hub, enable per-call USDC billing in their dashboard, and start collecting payments the same day. We take 5%, builder keeps 95%, settlement is on-chain same-block via Solana SPL USDC. No accounts, no chargebacks.

Why USDC instead of Stripe? Stripe is 2.9% + $0.30 per call. Sub-cent MCP calls are uneconomic on fiat rails. USDC on Solana is fractions of a cent — sub-cent agent billing finally works.

The whole server is open-source: github.com/toolora/toolora — including the Gateway proxy code. Files are processed in memory and never persisted; we keep anonymous salted-hash request metadata for 30 days for abuse prevention.

Today is Replit Agent's free-use day, so this is also a stress test. Live KPI dashboard at toolora.dev (with the new client_name segmentation by agent).

Happy to answer anything about MCP economics, x402 payments, why USDC, or how a one-person team ships a marketplace + billing rail in a single day.

[1] https://hackernoon.com/i-added-an-mcp-server-to-my-browser-based-tool-suite-agents-found-it-immediately
```

---

## Reddit r/LocalLLaMA

**Title:** `[Show] Toolora — privacy-first MCP server (25 free tools) + a hub where you can list your own MCP and bill in USDC`

**Body:**
```
For folks running local LLMs that support MCP — I built Toolora as the missing privacy layer.

25 free tools (PDF, OCR, Whisper, JS-rendered scraping, structured extraction). No API key, no signup, files never written to disk. Add to any MCP-aware client:

  https://toolora.dev/api/mcp

Why this matters for r/LocalLLaMA: even if you're running everything else locally, document parsing and OCR usually still go to a paid cloud (Mistral OCR, Adobe PDF, OpenAI Whisper). Toolora's free tier covers all of that with one URL and 200 calls/day per client. We log only anonymous salted hashes, never the documents themselves.

Also today: launched Toolora Gateway — any third-party MCP can list on our hub and bill its users per-call in USDC. We take 5%. Useful if you've built a niche MCP and want to start earning without setting up Stripe.

Open source: github.com/toolora/toolora

Happy to answer anything about MCP, the privacy model, or local-first agent setups.
```

---

## Reddit r/ClaudeAI

**Title:** `Free MCP server with 25 tools (PDF, OCR, Whisper, scraping) — no API key, just one URL`

**Body:**
```
Built this for Claude Desktop and other MCP-aware agents. 25 tools, all free, no signup, 200 calls/day per client.

Add to claude_desktop_config.json:

{
  "mcpServers": {
    "toolora": {
      "url": "https://toolora.dev/api/mcp",
      "transport": "http"
    }
  }
}

Tools include: extract_pdf_text, ocr_image, transcribe_audio (Whisper), scrape_url_js (Playwright, JS-rendered), extract_structured_data, merge_pdfs, csv_to_json, generate_qr_code, plus 17 more.

Privacy: files are processed in RAM and never written to disk. Server is open source.

Today is Replit Agent's free-use day so we're also showing the same MCP works one-click for Replit projects: just paste the URL into Agent settings.

Drop questions / feature requests below.
```

---

## Reddit r/replit

**Title:** `Toolora MCP — one-click install for Replit Agent (PDF, OCR, Whisper, scraping, all free)`

**Body:**
```
Since today is the Replit Agent free day — built a Replit Template that pre-installs Toolora MCP into any new Agent project.

Use Template: [link to Replit template]

What you get: 25 free agent tools (PDF/DOCX/Excel reading, OCR, Whisper transcription, JS-rendered web scraping, structured data extraction, plus 15 dev utilities). No API key. 200 free calls per day per agent.

If you'd rather configure manually, add this to your .replit:

[[agent.mcp]]
name = "toolora"
url = "https://toolora.dev/api/mcp"

We also launched a marketplace today where any developer can list their own MCP and start billing users in USDC. If you've shipped anything Replit-Agent-flavored, we'd love to feature you.

Repo: github.com/toolora/toolora
```

---

## Reddit r/SideProject

**Title:** `Day-in-the-life of building a 2-sided marketplace solo in 24 hours`

**Body:**
```
Today I shipped Toolora Gateway in a single 24-hour solo sprint, on top of the existing Toolora MCP that's been running for 5 months. Going to live-tweet the day if anyone wants to follow along.

What it is: a marketplace + billing layer for MCP servers (the protocol Claude, Cursor, Cline, and Replit Agent use to call tools). 25 free tools to bootstrap demand, plus a public hub where third-party MCP builders can list and bill in USDC.

Tech stack:
- pnpm monorepo (Express + React + Postgres + Drizzle + Solana)
- Replit deployment (autoscale)
- x402 payment proofs for the Gateway proxy
- Existing MCP server (~$0 infra cost) handling 3K+ connections/month

Why today specifically: Replit Agent is free to use for 24 hours and we wanted maximum surface area when the audience is biggest. Pure timing arbitrage.

Live numbers: toolora.dev (KPI dashboard updates in real time). Twitter thread: [link]

Happy to answer build/scope/launch questions.
```

---

## 5 Builder DMs

These need a real Twitter/X handle. The opening line is what matters — keep it short, name-drop their MCP, ask for a 1-line favor or quote.

**Template — fill the [BRACKETS] from your 15-name outreach list:**

```
Hey [NAME] — saw your [THEIR MCP] last week, sharp work. We're shipping
Toolora's MCP marketplace + Gateway billing today (Replit free day for
amplification, HackerNoon ran a piece on us last week). 5% take rate,
instant USDC payouts on Solana. Want a free slot in the launch tweet
thread for [THEIR MCP]? Even a quote would help.

HN piece: hackernoon.com/i-added-an-mcp-server-to-my-browser-based-tool-suite-agents-found-it-immediately
Gateway docs: [link]
```

If they reply, the 30-second pitch:
> *"You list on the hub for free, agents discover you, and if you flip the Gateway toggle you start earning per-call USDC from anyone who uses your MCP. We're hand-onboarding the first 5 builders this weekend — yours would be #2 if you want in."*

---

## Apify email (refresh of the Day-2 kit version)

**To:** `partners@apify.com`
**Subject:** `Toolora launched MCP marketplace + USDC billing today — co-feature opportunity`

**Body:**
```
Hi Apify team,

Quick one — Toolora (toolora.dev) launched today as the privacy-first
marketplace + USDC billing layer for the MCP economy. HackerNoon ran a
piece on the build last week that's already driving solid agent traffic:
hackernoon.com/i-added-an-mcp-server-to-my-browser-based-tool-suite-agents-found-it-immediately

Two halves are live:
• 25 free agent tools (PDF/OCR/Whisper/JS scraping/structured extraction)
• Public hub of 3rd-party MCPs with optional Gateway billing in USDC,
  5% take rate, instant on-chain settlement

Your scrapers and our structured-extraction layer are complementary — the
agent uses Apify to fetch, then Toolora to clean and structure. Would love
to explore:

1. Featuring Apify in our /vs/firecrawl page as the "for-pay heavy lifter"
   that pairs with Toolora's free post-processing
2. Listing your most-MCP-friendly Actors on toolora.dev/mcp/hub with
   Gateway billing
3. Any MCP-related promo Apify has running for the Replit free day

Manifest: https://toolora.dev/.well-known/mcp.json
Gateway docs: https://toolora.dev/gateway/docs
Live KPI dashboard: https://toolora.dev

Open to a 15-min call this week.

Thanks,
[your name]
```

---

## Replit Template README (root of the template repo)

```markdown
# Toolora MCP — Free Agent Tools (PDF, OCR, Whisper, Scraping)

One-click install for Toolora MCP into any Replit Agent project.

## What's included

This template pre-configures Toolora as an MCP server in your Replit Agent.
You instantly get 25 free agent tools — PDF reading, OCR, Whisper audio
transcription, JS-rendered web scraping, structured data extraction, and
15 dev utilities. No API key. 200 free calls per day per agent.

## How to use

1. Click "Use Template"
2. Open your new Repl
3. The MCP is already wired in `.replit` — just open Agent and start asking
   it to read PDFs, transcribe audio, scrape JS-rendered pages, etc.

## Want unlimited?

Pro is $19/mo and lifts the 200/day cap. [Upgrade →](https://toolora.dev/pricing)

## Building your own MCP?

List it on our public hub at toolora.dev/mcp/hub and (optionally) bill your
users per call in USDC via Toolora Gateway. 5% take rate, instant on-chain
settlement. [Gateway docs →](https://toolora.dev/gateway/docs)

## Privacy

Files are processed in memory and never written to disk. Anonymous,
salted-hash request metadata is retained for 30 days for abuse prevention.
That's it.

Open source: github.com/toolora/toolora
```

---

## End-of-day blog post outline (write May 3 morning, not May 2)

`/blog/may-2-launch` post structure for the YC application's "see our launch traction" link:

1. **The setup** — Replit Agent's free day, 24-hour window, what we shipped before launch.
2. **The numbers** — peak hourly connections, total tool calls by client, total Gateway sign-ups, first paying customer.
3. **What worked** — top traffic sources (HN rank, reddit subs, twitter impressions), best-performing tweet, best-performing CTA.
4. **What didn't** — anything from the cut-list that bit us.
5. **What's next** — Gateway full launch May 31, YC W26 application September.
6. **Thank-yous** — by name to anyone who shouted us out.
