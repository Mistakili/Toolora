# Toolora Pay — Strategy Roadmap

_Last updated: April 18, 2026 — based on strategy thread (April 2026)._

## TL;DR

Toolora's biggest opportunity is **not** more free tools or another MCP directory. It is to become **the USDC-billed backend for the agent era** — a single gateway that lets MCP builders consume search, scrape, LLM, sandbox, and other primitives with one wallet, one bill, no Stripe.

We resell best-in-class providers (Brave, Firecrawl, Anthropic, etc.) at a 25% markup, settling in USDC on Solana. Customer is the **MCP builder**, not the agent and not the end user. Agents discover us indirectly by calling MCPs that are built on top of our primitives.

---

## The vision

**Toolora is the picks-and-shovels infrastructure for the next 10,000 MCPs.**

- Free tier: existing 41 client-side privacy-first tools (top of funnel, brand, SEO).
- Pro tier: **Toolora Pay Gateway** — paid, USDC-billed primitives MCP builders need to ship production tools.

We don't compete with Tavily / Firecrawl / E2B. We resell them with unified billing and an agent-native API surface. They're features, not competitors.

---

## Why this beats alternatives

| Alternative | Why we're not doing it |
|---|---|
| Build more free client-side tools | Doesn't generate revenue, agents don't run in browsers |
| Be the payment rail for third-party MCPs | Trust + custody risk, distribution to agent side is hard, race-to-the-bottom on free alternatives |
| Compete with Tavily / Firecrawl directly | 2-year head start, well-funded, brand recognition, hard fight |
| Be the directory only | No revenue capture, mcp.so / Smithery / PulseMCP already have 10k+ servers |
| **Be the USDC-billed gateway for MCP builders** | ✅ No incumbent owns this, leverages our existing USDC rails, indie devs need it urgently |

---

## ToS findings (April 2026 research)

| Provider | Resale clause | Verdict |
|---|---|---|
| **Tavily** | Prohibits derivative works / copying. Need written reseller agreement. | ⚠️ Negotiate before launch |
| **Firecrawl** | Only restricts FCRA-regulated resale. General resale OK. | ✅ Ship day one (with FCRA passthrough clause) |
| **E2B** | Hard prohibition without written authorization. | ❌ Blocked at launch — negotiate or swap (Daytona) |
| **Brave Search** | $5/1k requests. No explicit resale ban. | ✅ Probably fine, confirm in writing |
| **Browserbase** | Standard ToS, partner terms ambiguous. | ⚠️ Confirm before launch |
| **Anthropic / OpenAI** | Allow end-user resale at agent-runtime layer. | ✅ Ship day one |

**Implication:** Launch with Brave + Firecrawl + LLM passthrough. Add Tavily + sandbox after written agreements (60–90 days).

---

## Unit economics (April 2026)

Wholesale prices and Toolora retail at 25% markup:

| Primitive | Wholesale | Toolora retail |
|---|---|---|
| Search (Brave) | $0.005 / call | $0.00625 |
| Scrape (Firecrawl) | $0.006 / page | $0.0075 |
| Sandbox 60s (E2B) | $0.0025 / session | $0.003 |
| LLM call (Sonnet-class, ~1k tok) | $0.018 | $0.022 |

### Sample MCP profitability (margin to MCP builder using our gateway)

| MCP | Per-call cost | Builder retail | Builder margin | Verdict |
|---|---|---|---|---|
| Research Assistant (3 search + 5 scrape + 1 LLM) | $0.078 | $0.15 | **48%** | ✅ Works |
| Lead Enrichment (2 search + 3 scrape + 2 LLM) | $0.079 | $0.30–0.50 | **70–84%** | ✅✅ Killer use case |
| Real-time News (1 search) | $0.00625 | $0.01 | 38%, low absolute $ | ⚠️ High volume only |
| Code Sandbox passthrough | $0.003 | $0.01–0.02 | 70–85% | ⚠️ ToS-blocked at launch |
| Scrape-batch for AI training (50 pages) | $0.375 | $1.00 | **62%** | ✅✅ Works very well |

**Target verticals first:** Research, Lead Enrichment, Scrape-batch. Skip commodity single-call MCPs at launch.

---

## Roadmap

### Phase 0 — Customer discovery (next 1–2 weeks, BEFORE building)
**Distribution-first.** Do not build the gateway until at least 4 of 10 builders say yes.

- [ ] Identify 10 indie MCP builders in Research / Lead-Enrichment / Scrape verticals
- [ ] Reach out 1:1 (Twitter, GitHub issues, MCP Discord). Pitch:
  > *"You've got an MCP that calls Tavily/Firecrawl/OpenAI. I'm building a single USDC-billed gateway for those primitives — one wallet, one bill, works globally. Would you switch if it cost the same and saved you 4 signups?"*
- [ ] Goal: 4+ enthusiastic yeses → green-light Phase 1
- [ ] If <4 yeses: thesis is wrong or pitch needs sharpening; iterate before any code

### Phase 1 — Gateway MVP (3–4 weeks after Phase 0 validation)
- [ ] Single endpoint: `gateway.toolora.dev/v1/{search,scrape,llm}`
- [ ] Auth: Solana wallet signature OR API key
- [ ] Billing: per-call USDC deduction from on-chain pre-funded balance
- [ ] Three primitives: Brave Search, Firecrawl scrape, OpenAI/Anthropic LLM router
- [ ] Builder dashboard: API key, balance, call log, top tools
- [ ] Free $5 starter credit for first 100 builders

### Phase 2 — First paying builders (weeks 4–8)
- [ ] Onboard the 4+ Phase 0 yeses for free month
- [ ] Collect case studies: "MCP X earned $Y/mo on Toolora Gateway"
- [ ] Iterate on API ergonomics, output formats, error handling
- [ ] Target: 10 active monetized MCPs by week 8

### Phase 3 — Reseller agreements (parallel to Phase 2, weeks 4–12)
- [ ] Tavily partner program — reach out
- [ ] E2B / Daytona — pick one, sign reseller deal
- [ ] Browserbase — confirm partner terms in writing
- [ ] Add primitives to gateway as deals close

### Phase 4 — Public launch (month 3)
- [ ] HN + X launch with 3+ real case studies showing builder margins
- [ ] Headline: "USDC-billed backend for the agent era"
- [ ] Submit to MCP newsletters, indie hacker channels
- [ ] Bounty program: "Build an MCP on Toolora Gateway, get $100 + featured placement"

### Phase 5 — Distribution flywheel (months 3–6)
- [ ] "Powered by Toolora Gateway" badge in every MCP using us (free attribution = free distribution)
- [ ] Pre-installed defaults in agent frameworks (Cursor, Cline, Continue partnerships)
- [ ] SEO: rank #1 for "USDC billing for MCP", "Tavily alternative crypto", "MCP backend infra"
- [ ] Open-source the x402 / Solana split-payment program → become the reference implementation

### Phase 6 — Vertical depth (months 6–12)
- [ ] Add primitives demanded by paying builders (geocoding, OCR, embeddings, email)
- [ ] Privacy mesh: optional anonymized routing for sensitive queries (leans into brand)
- [ ] Enterprise tier: custom SLAs, white-label, dedicated wallets

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Anthropic launches official MCP marketplace with native billing | Move fast (12-month window). Position to be a certified payment provider, not a competitor. |
| Upstream providers cut prices or build their own crypto billing | Always layer real value (USDC, unified API, observability), not just price arbitrage. |
| Money transmitter / regulatory exposure from custodying funds | Use atomic on-chain split payments — never custody. Single most important architectural decision. |
| Bad upstream causes outage that gets blamed on Toolora | Per-provider health checks, circuit breakers, branded error attribution. |
| Builders churn after free month | Focus on verticals where margins are 40%+ (Research, Lead Enrichment) — they have real reason to stay. |
| **No agents are paying yet** | Build the buyer side too: Toolora Wallet pre-funded budget extension for popular agent frameworks. |

---

## Open questions / decisions needed

- [ ] Markup percentage: 25% baseline confirmed reasonable, but should premium primitives (sandbox, real-time data) carry 30–40%?
- [ ] Custodial vs non-custodial settlement: **strongly leaning non-custodial** via on-chain split-payment Solana program. Need to scope.
- [ ] Free tier on the gateway itself? Probably $5 starter credit per builder, no recurring free tier.
- [ ] Sandbox at launch: negotiate E2B or build/use Daytona? Daytona is faster but less mature.
- [ ] Branding: "Toolora Pay" vs "Toolora Gateway" vs "Toolora Infra"? "Gateway" reads most like infra to devs.

---

## North Star metrics

- **Active monetized MCPs** (target: 10 by month 2, 50 by month 6, 200 by month 12)
- **Gross gateway volume in USDC** (target: $1k/mo by month 3, $10k/mo by month 6, $100k/mo by month 12)
- **Builder margin median** (target: stay above 40% — if it drops, builders churn)
- **Time-from-signup to first paid call** (target: <10 minutes — this is the magic moment)
