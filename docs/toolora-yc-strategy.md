# Toolora — Y Combinator Application Strategy (Apr 28, 2026)

## TL;DR

Apply to **YC W26** (deadline ~Sept 2026). The May 2 Replit Agent surge is the
single best inflection moment to capture traction proof for the application.
Don't apply to S26 — applications closed; there's nothing yet to show that's
distinct enough to warrant a late submission.

---

## Why YC fits Toolora right now

YC's 2025–2026 batches have been heavily weighted toward agent infrastructure
(MCP servers, LLM-orchestration layers, payments-for-agents). Toolora sits at
the intersection of three of their explicit thesis areas:

1. **MCP infrastructure** — the protocol is becoming TCP/IP for agents and
   most YC-backed plays so far are vertical (Stripe MCP, Linear MCP).
   Toolora is a horizontal *primitives* layer.
2. **Agentic payments** — the planned Toolora Gateway (USDC/x402 billing for
   MCP builders) maps directly to YC's bet on Circle/Solana/agent commerce.
3. **Privacy-preserving compute** — "files never stored" + MagicBlock PER
   integration is a story they'll find differentiated against the dominant
   "send everything to OpenAI" pattern.

## The narrative we want to tell

> "Stripe for MCPs."
>
> Toolora started as a free, privacy-first MCP with 25 agent tools. In our
> first 30 days post-launch we hit 3,019 unique MCP connections from Claude,
> Cursor, Cline, and Replit Agent — driven primarily by directory listings,
> with no paid advertising spend.
>
> Agents loved the *tools* but builders kept asking the same question:
> *"How do I bill my agent users for tool calls?"*
>
> So we're building Toolora Gateway: USDC-billed primitives that any MCP
> builder can resell. We take 5%, the builder keeps the rest, the agent pays
> in fractional cents per call. Free tools become the demand-gen funnel for
> a billing rail that captures the entire MCP economy.

This is the kind of story YC will fund — clear product/market fit signal, an
obvious wedge, and a much bigger second act.

## What we need to claim in the application — and what to build now to back it

### Traction we already have (verifiable)
- **3,019 unique MCP connections / 30d** (use `client_id` segmentation)
- **1,482 dashboard views / 30d**
- **553 tool calls / 30d** (and we're about to find out the May 2 multiplier)
- **25 production tools, served from a single autoscale deployment with no
  reported user-facing outages to date**
- **Multi-protocol payment rail already wired**: Stripe (USD), x402 (Stellar XLM),
  MagicBlock PER (Solana USDC).

### Traction we will have after the 4-day sprint
- **May 2 spike numbers** — segmented by `client_name` (Replit Agent vs Claude vs
  Cursor). Day-1 telemetry is in place to capture this.
- **Directory presence** — listed on Smithery, Glama, mcp.so, mcphub, plus the
  three big GitHub-curated lists (wong2, punkpeye, appcypher).
- **Replit Template** — one-click install for any Replit Agent project.
- **Outreach receipts** — DMs / GitHub-issue threads with 5 named MCP builders
  (proof we're closing the loop into the builder community).

### Founder demo we should record before applying
Two-minute Loom showing:
1. Open Claude Desktop → ask it to read a PDF and transcribe an audio file.
   Both calls hit Toolora MCP. Total cost to the user: $0.
2. Open the KPI dashboard → show live `client_name` segmentation.
3. Open the Toolora Gateway prototype (Day 5+ work) → show a third-party MCP
   builder enabling USDC billing on their tools in 60 seconds.

## Concrete preparation timeline

| When | What |
|------|------|
| **Apr 29 (Day 2)** | Directory submissions live (this week's work). |
| **May 2** | Replit Agent free day — capture peak metrics. |
| **May 3–10** | Write up the May 2 traction story. Decide whether the spike is sustained. |
| **May 11–31** | Build Toolora Gateway MVP — single-page builder dashboard + USDC payout flow + 1 paying design partner. |
| **Jun–Jul** | Recruit 5–10 paying Gateway design partners. Need at least 3 for credible "we have customers" line in YC app. |
| **Aug** | Founder calls with 3 YC partners (warm intros via existing portfolio companies — Stripe MCP team, MagicBlock, Circle dev rel). |
| **Sept (~mid)** | Submit YC W26 application. |
| **Oct–Nov** | YC interviews if shortlisted. |

## Questions YC will ask — draft answers we should rehearse

**1. "Why now?"**
> MCP shipped Nov 2024. The protocol is 18 months old, the directory ecosystem
> is just forming, and there's no billing rail yet — the same gap Stripe filled
> for the web in 2010. The first MCP that becomes the default billing layer
> wins by default.

**2. "Why you?"**
> We're already running a privacy-first MCP that thousands of agents have
> connected to in the first 30 days. Builders ask us
> for billing every week. We have on-chain payment infra (USDC/Stellar/Solana)
> already wired into the same codebase. Anyone else has to build both the
> distribution and the rails — we just have to connect what's already shipping.

**3. "What's the moat?"**
> Network effects on both sides: more agents → more agent traffic → more
> attractive to MCP builders → more tools available → more reasons for agents
> to default to Toolora. Plus the brand wedge: "the privacy-first MCP" is a
> single brand position competitors can't easily copy without rearchitecting.

**4. "How do you make money long-term?"**
> 5% take rate on Gateway-billed calls. At industry-standard agent volumes
> (1B+ tool calls/year/large agent platform), 5% of a $0.001-$0.01 average
> bill is a $0.5–5M ARR per integrated platform. We need 5–10 platforms to
> hit the YC growth bar.

## Risks YC will probe — answers to prepare

- **"What if Anthropic or OpenAI ship a competing billing layer?"** — They
  will. We need to be the *neutral* rail (works for any agent, any model)
  and ship before they do. Hence the May 2 capture sprint.
- **"Why would MCP builders trust you with their revenue?"** — On-chain
  settlement = no escrow risk. They get paid in USDC the same block as the
  call settles.
- **"Why Solana/USDC over Stripe?"** — We support both. Stripe for fiat
  builders, USDC for agent-to-agent (sub-cent costs make Stripe uneconomic).

## What we should NOT do

- Don't apply to S26 — too early, no Gateway built, just looks like a
  side-project from outside.
- Don't burn time on a slide deck before the May 2 numbers are in. The
  numbers ARE the deck.
- Don't pivot the Toolora brand to "Gateway" before YC. Two product names is
  fine; rebranding burns the existing 3K-connection moat.

## Decision needed from founder

- **Confirm the W26 timeline above** — we'll plan the Gateway sprint
  (May 11–31) to slot directly after the surge sprint.
- **Approve the demo recording in early May** so we can iterate on the pitch
  while the May 2 traction is fresh.
- **Decide whether to take a small angel round before YC** — could fund the
  Gateway build but adds dilution before Demo Day. Default: bootstrap to YC.
