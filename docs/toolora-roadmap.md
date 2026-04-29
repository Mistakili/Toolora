# Toolora — Master Roadmap (as of Apr 29, 2026)

Single source of truth. Everything else (sprint notes, YC strategy, submission kit) feeds into this.

**North Star:** ship Toolora Gateway, hit ≥1 paying Gateway customer, submit YC W26 in mid-September 2026.

---

## Priority bands

### 🔥 BAND A — This week (Apr 29 – May 2): Surge sprint

**Goal:** maximize the May 2 Replit Agent free-day spike. Every hour spent here returns 10–100x in distribution proof for YC.

| # | Item | Owner | Status |
|---|---|---|---|
| A1 | **Day 2 manual submissions (11 left)** — Smithery, Glama, mcp.so, mcphub, 5 GitHub PRs, Apify email, Replit Template | YOU (~40 min, kit ready) | ▶ in progress |
| A2 | **Day 3 — `/replit` landing page** (Replit Agent install JSON, "made for Replit" framing) | ME | ⏳ next |
| A3 | **Day 3 — Replit Template** (one-click install for any Replit Agent project) | YOU + ME | ⏳ paired with A1 #11 |
| A4 | **Day 4 — KPI dashboard upgrade** surfacing the new `client_name` segmentation (Replit Agent / Claude / Cursor / Cline split) | ME | ⏳ |
| A5 | **Day 4 — Twitter thread + DM 5 builders** about MCP free-day | YOU + ME drafts | ⏳ |
| A6 | **May 2 — live monitoring + reactive tweets** capturing peak numbers | YOU | ⏳ |

### 🟧 BAND B — Next 2 weeks (May 3 – May 10): Post-surge consolidation

**Goal:** turn the surge into permanent infrastructure. The 3 new items go here because they multiply *all* future traffic, not just May 2.

| # | Item | Owner | Why it matters |
|---|---|---|---|
| **B1** | **⭐ NEW — Public GitHub repo + killer README** (toolora/toolora) | ME | Devs trust GitHub stars more than directory listings. Lets us collect stars from May 2 traffic. Closes the biggest "honey" gap. |
| **B2** | **⭐ NEW — `/vs/*` comparison landing pages** (Firecrawl, Mistral OCR, Whisper API, Adobe PDF) | ME | Captures bottom-of-funnel intent traffic ("Firecrawl alternative") forever. SEO compounds. |
| **B3** | **⭐ NEW — Optional account creation flow** ("create account to see your usage history") | ME | Solves the no-CRM problem. Unlocks email upsell for Pro tier. Doesn't break the no-friction promise. |
| B4 | **May 2 retro + numbers writeup** — the YC traction story | YOU | Becomes the application's lead paragraph. |

### 🟦 BAND C — Gateway sprint (May 11 – May 31): The actual business

**Goal:** ship Toolora Gateway MVP. This is the single most important thing this quarter — without it you're a free MCP, with it you're Stripe-for-MCPs.

| # | Item | Owner |
|---|---|---|
| C1 | Builder dashboard (signup, get API key, configure pricing per tool) | ME |
| C2 | USDC payout pipeline (route 95% to builder, keep 5% take rate) | ME |
| C3 | Drop-in Gateway middleware (5 lines of code for any MCP server) | ME |
| C4 | Public docs + Stripe-style pricing page | ME |
| C5 | One paying pilot — captured *organically* from the May 2 surge if a builder asks; do not chase | YOU + ME |

### 🟪 BAND D — YC W26 prep (Jun – mid-Sep)

| # | Item | When |
|---|---|---|
| D1 | Recruit 3+ paying Gateway customers (organic + light outreach) | Jun – Jul |
| D2 | Founder Loom video (2 min) — Claude using Toolora + dashboard + Gateway demo | early May while metrics are hot |
| D3 | Warm intros to YC partners via Stripe MCP team / MagicBlock / Circle dev rel | Aug |
| D4 | Submit YC W26 application | mid-Sept |
| D5 | YC interviews if shortlisted | Oct – Nov |

### 🟫 BAND E — Always-on (defensive)

| # | Item |
|---|---|
| E1 | Watch Anthropic / OpenAI / Google for native MCP billing announcements (clock is 6–12 months) |
| E2 | Track free→Pro conversion. If <1% by end of May, lower the 200/day cap to 50–100 |
| E3 | Track every MCP spec update; ship within 7 days of each |
| E4 | Quarterly security/privacy review (anonymous telemetry retention, salt rotation) |

---

## What we are NOT doing (intentionally)

- ❌ S26 application (closed, and we'd be undercooked)
- ❌ Rebrand to Gateway (burns the 3K-connection moat)
- ❌ Pre-YC angel round (dilution gets expensive at Demo Day)
- ❌ Slide deck before May 2 (the numbers ARE the deck)
- ❌ Chasing design partners (organic is enough, chasing wastes time and signals weakness)
- ❌ Multi-language localization (English-only is fine for YC)
- ❌ A free mobile app (zero leverage for the agent buyer; come back to this in 2027)

---

## Decisions locked

- ✅ YC W26 timeline (confirmed Apr 29)
- ✅ No design partner dependency — Gateway ships standalone
- ✅ 5% Gateway take rate (industry-comparable; Stripe is 2.9% + $0.30, x402 is ~1%)
- ✅ Bootstrap to YC — no angel round
- ✅ Privacy claim: "files processed in memory and never stored on disk; only anonymous, salted-hash request metadata is retained for 30 days" (lawyer-safe)

---

## Decisions still open

- ⏳ Should the GitHub repo be `toolora/toolora` (one mega-repo) or split (`toolora/mcp`, `toolora/gateway`)? *Default: mono-repo, easier to grow stars.*
- ⏳ When to launch a referral program (free Pro month for each builder you refer)? *Default: post-Gateway, Q3.*
- ⏳ Pricing tier above Pro — Team ($99/mo)? Enterprise ($500+/mo)? *Default: introduce Team in June, Enterprise after first inbound enterprise lead.*
