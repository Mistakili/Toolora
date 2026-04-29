# May 2, 2026 — Toolora Big-Bang Launch Runbook

**Operator:** solo (you).
**Window:** Replit Agent's 24-hour free day. Use Agent for the heavy build lifting; you drive prompts, reviews, deploys, posts.
**Mission:** ship the Gateway MVP **and** the surge package, take 1 real USDC payment, capture peak metrics, kick off the YC W26 narrative.

> **Read the night before.** Sleep at least 6 hours before May 2. You can't out-coffee a 24-hour solo sprint.

---

## Pre-flight (May 1, evening — ~2.5 hours total)

A short evening checklist. None of this is public-facing shipping — it's all infrastructure prep so May 2 morning isn't chaos. Several items moved here after architect review flagged hidden time-eaters that would otherwise burn the first 90 minutes of the sprint.

**Reading & mental load:**
- [ ] Read this runbook end-to-end. No surprises tomorrow.
- [ ] Read `docs/toolora-gateway-spec.md` — especially the SSRF section and W5 prereq notes.
- [ ] Read `docs/toolora-may2-launch-copy.md` — copy is all ready, you just paste.

**Infrastructure pre-applied (the new architect-flagged items):**
- [ ] **Apply Gateway DB schema via direct SQL** (avoid the `db push` sponsors-prompt hang). Run the two `CREATE TABLE` statements from `docs/toolora-gateway-spec.md` against production Postgres. Confirm `\d gateway_configs` and `\d gateway_billing_events` both list correctly.
- [ ] **Confirm `gateway.toolora.dev` DNS** resolves to the api-server. If not, add the CNAME / wildcard via the deployment skill *now* — DNS propagation is the sneakiest morning blocker.
- [ ] **Seed the smoke-test listing via SQL** (the `INSERT INTO mcp_listings ...` from W5 prereq). Save the returned UUID as `seedListingId` in your password manager.
- [ ] **Mint your owner token** via a one-line `signOwnerToken(seedListingId, "gh:wesleyolis")` script. Save the JWT in your password manager next to the listingId.
- [ ] **Spin up the dummy "echo" upstream MCP** on a side Replit Repl. Confirm `curl <upstream>/health` returns 200. Note the URL — that's what goes into the smoke-test gateway config tomorrow.
- [ ] **Plan for `/x402` page**: it currently advertises 10% take rate + waitlist, contradicting the new positioning. Decision pre-locked: turn it into a `<Navigate to="/gateway" replace />` redirect during Block 7. (Do NOT push the change tonight — that's shipping.)

**Tabs & tools (~25 tabs):**
- [ ] 11 directory submission URLs from `docs/toolora-day2-execution-kit.md` — only if any unsent
- [ ] GitHub repo creation page → https://github.com/new
- [ ] HN submit → https://news.ycombinator.com/submit
- [ ] Reddit posts → r/LocalLLaMA, r/ClaudeAI (r/replit + r/SideProject only if cut-list permits)
- [ ] Twitter Drafts (paste tweet thread skeleton from launch-copy doc)
- [ ] Apify email composer (template pre-pasted)
- [ ] Replit Templates → "Create"
- [ ] Toolora dashboard (live KPI view)
- [ ] api-server logs viewer
- [ ] Postgres console
- [ ] Solana explorer (for verifying the smoke-test payout tx tomorrow)

**Logistics:**
- [ ] Confirm secrets/env vars all present in production (Polar/Stripe, x402 wallet keys, Solana RPC, Toolora's own SOL+USDC funding wallet for the splitter, Postgres URL, NPM_TOKEN).
- [ ] Confirm Toolora's payout-source wallet has enough SOL for ~500 splits (~$0.005 of SOL covers it — trivial — but check anyway).
- [ ] Fund your personal USDC test wallet with ~$5 (the "first Gateway customer" funds).
- [ ] Phone on charger, slack/discord notifications muted, calendar blocked.

---

## Time blocks (Pacific Time)

> **All times PT.** If Replit Agent's free day starts in a different timezone, shift the whole schedule.

### Block 1 — 06:00 – 07:00 — Wake & sanity

- Coffee. Re-read the cut-list at the bottom of this doc.
- Confirm api-server is healthy: hit the healthz endpoint, `/.well-known/mcp.json` returns 25 tools.
- Confirm last night's pre-flights are still in place: `psql -c "SELECT id FROM mcp_listings WHERE polar_checkout_id = 'manual-smoke-2026-05-02'"` returns the seed UUID; `gateway.toolora.dev` resolves; `gateway_configs` and `gateway_billing_events` tables visible.
- Open Replit Agent in a fresh prompt window. Paste the W2 work item from the Gateway spec verbatim.

### Block 2 — 07:00 – 12:30 — GATEWAY MVP BUILD (the must-ship)

The biggest, longest block of the day. Realistic estimates per architect review (was 4h, now 5.5h):

| Sub-block | Item | Time |
|---|---|---|
| 07:00 – 07:10 | W1 — confirm DB tables present | 10 min |
| 07:10 – 09:40 | W2 — Gateway proxy route + SSRF guard | 150 min |
| 09:40 – 11:40 | W3 — `McpOwnerDashboard` Billing tab | 120 min |
| 11:40 – 12:25 | W4 — `/gateway` landing + `/x402` redirect | 45 min |
| 12:25 – 12:30 | Sanity-check breath, transition to W5 (smoke moves to Block 5) | 5 min |

- **Hard deadline: 12:30 — Gateway shows a live "Enable Billing" toggle in `McpOwnerDashboard`, accepts the SSRF-validated config, and the proxy returns 402 for unpaid calls.** (W5 smoke happens in Block 5 — moving it preserves the "we just did this live" narrative for the launch.)
- If behind by 12:30 on W2 or W3: trigger the **Gateway-as-Waitlist downgrade** (see Gateway spec). Do *not* skip W4 — the landing page is essential to the launch story even if proxy isn't live.
- If ahead: tighten the W3 events table polish, no new scope.

### Block 3 — 12:30 – 13:30 — Public GitHub repo

- Create `github.com/wesleyolis/toolora` (personal repo is faster than creating an org today). Move to `github.com/toolora/toolora` post-launch.
- **Subset push, NOT full monorepo** (avoids exposing secret history). Curated paths:
  - `lib/n8n-nodes-toolora/`
  - `artifacts/api-server/src/routes/mcp.ts` + `gateway.ts`
  - `lib/db/src/schema/mcpCalls.ts` + the two new gateway schemas
  - `artifacts/api-server/src/routes/directory.ts` (proves the marketplace is real)
  - Public docs from `artifacts/toolbox/public/`
  - `examples/hello-mcp-client/` — minimal Node script that calls one Toolora tool
- Pre-flight gut-check: `git log --all -p | grep -iE "(api[_-]?key|secret|password|sk-)" | head` — if anything matches, scrub before pushing.
- Paste the **README from `docs/toolora-may2-launch-copy.md`** verbatim into root.
- Add `LICENSE` (MIT), `CONTRIBUTING.md` (1-paragraph stub), `.github/FUNDING.yml` with the Solana wallet.
- Push, verify it renders. Star your own repo (everyone does, no shame).

### Block 4 — 13:30 – 14:00 — `/replit` landing page + Replit Template

- 30 min total — tight, deliberately. The Replit Template is the bigger of the two.
- Create `artifacts/toolbox/src/pages/Replit.tsx` from the spec in launch-copy doc. Route added to `App.tsx`.
- Create the Replit Template via Replit UI:
  - Title, description, tags from launch-copy doc
  - Pre-configured `[[agent.mcp]]` block in `.replit`
- One quick smoke: install the template into a fresh Replit, confirm Toolora MCP loads in Agent. Don't deep-test — the deep deploy + smoke is in Block 5.

### Block 5 — 14:00 – 15:00 — Deploy + Gateway smoke test + lunch

- **Stand up. 10 min away from screen mandatory.** Make the food while waiting on deploys.
- Deploy api-server + toolbox to production. Wait for green health checks.
- Smoke test from a clean browser:
  - `toolora.dev/` loads
  - `toolora.dev/replit` loads
  - `toolora.dev/gateway` loads
  - `toolora.dev/mcp/hub` loads with the seed listing visible
  - `toolora.dev/.well-known/mcp.json` returns 25 tools
  - `gateway.toolora.dev/mcp/<seedListingId>` returns 402 with x402 challenge
  - GitHub repo loads, README renders
- **W5 — Gateway end-to-end smoke (the proof shot):**
  - Open `McpOwnerDashboard`, paste your `seedListingId` + `ownerToken`, claim ownership.
  - Billing tab → enable, set $0.001/call, paste payout wallet, paste upstream URL. Save.
  - From terminal, hit `gateway.toolora.dev/mcp/<seedListingId>` with no payment → 402.
  - Pay the x402 challenge from your funded USDC wallet → replay → 200 + upstream response.
  - Verify the new `gateway_billing_events` row + the Solana payout tx on explorer.
  - **Screenshot the dashboard event row + Solana explorer payout side-by-side.** Save to `docs/may2-results/first-payment.png`. This is the YC application opener.
- If any red, fix before moving to Block 6. **Do not launch broken.**

### Block 6 — 15:00 – 16:30 — `/vs/*` pages + Pro upgrade nudge (SCOPE CUT)

Architect cut: dropped `/vs/whisper-api` (lowest intent of the three) and the entire account creation flow (B3 from roadmap pushes to May 5). 90 minutes total now, not 120:

- 15:00 – 15:50 — `/vs/firecrawl` + `/vs/mistral-ocr` (~25 min each). One route, one component, one feature-comparison table, one "switch to Toolora" CTA per page. Both keyed off the same `<VsPage>` template — share code.
- 15:50 – 16:30 — Pro upgrade nudge: when API returns 429 (free-tier exhausted), include `upgrade_url` in the JSON error body and add a banner in the toolbox UI. ~40 min for both ends.

### Block 7 — 16:30 – 17:30 — KPI dashboard + `/x402` redirect

- 16:30 – 17:10 — Add `client_name` segmentation chart to existing KPI dashboard (uses Day 1 columns). Add live-counter on `Home.tsx`: "X MCP calls in the last hour, Y unique agents."
- 17:10 – 17:30 — Replace `artifacts/toolbox/src/pages/X402.tsx` body with `<Navigate to="/gateway" replace />`. Quick smoke: `toolora.dev/x402` redirects to `/gateway`. Removes the conflicting "10% / waitlist" narrative before launch goes live.

### Block 8 — 17:30 – 18:30 — Final smoke + dinner

- Re-run the Block 5 smoke list against production.
- Verify `/x402` now redirects to `/gateway`.
- Pull up the Gateway smoke screenshots; verify they're attached and ready to drop into the tweet thread.
- Eat dinner. **Walk again. 10 min mandatory.** Mental reset before the launch hour.

### Block 9 — 18:30 — 🚀 LAUNCH WINDOW STARTS

Pushed 30 min later vs. original plan to absorb the realistic timing. Order matters — top-down.

| Time | Action | Source |
|---|---|---|
| 18:30 | Tweet thread goes live (with smoke screenshot in tweet 5) | launch-copy: `## Tweet thread` |
| 18:31 | Pin the thread to your profile | — |
| 18:32 | Post Show HN (with toolora.dev URL) | launch-copy: `## Show HN post` |
| 18:35 | Post r/LocalLLaMA | launch-copy: `## Reddit r/LocalLLaMA` |
| 18:38 | Post r/ClaudeAI | launch-copy: `## Reddit r/ClaudeAI` |
| 18:41 | Send 5 builder DMs | launch-copy: `## Builder DMs` |
| 18:46 | Send Apify email | launch-copy: `## Apify email` |
| 18:50 | Submit remaining directory submissions if any unsent | day-2-execution-kit |
| 18:55 | (cut-list permitting) Post r/replit | launch-copy: `## Reddit r/replit` |
| 19:00 | (cut-list permitting) Post in Replit Discord | — |
| 19:05 | (cut-list permitting) Post r/SideProject | launch-copy: `## Reddit r/SideProject` |
| 19:10 | (cut-list permitting) Submit Product Hunt for tomorrow | — |

### Block 10 — 19:10 – 23:00 — Live monitoring + reactive tweets

- Watch HN front page rank every 5 min for first hour. If you crack top 30, tweet a screenshot.
- Watch the live counter on Home.tsx. Tweet milestones: "100 calls in the last hour", "1,000 unique agents today", "first Gateway USDC payment for [pilot MCP]".
- Respond to every HN comment, reddit comment, Twitter reply within 10 min for the first **2 hours** (was 4 — solo can't do 4 + everything else).
- If `client_name` segmentation shows Replit Agent dominating, tweet a screenshot tagging @Replit.
- Watch for bug reports. Hot-fix only true bugs (not feature requests). Add feature requests to a `docs/may2-feedback.md` file for May 3.

### Block 11 — 23:00 – 23:30 — End-of-day capture

- Screenshot KPI dashboard. Save to `docs/may2-results/`.
- Note final numbers: total connections, total tool calls, total Pro signups, total Gateway sign-ups, peak HN rank, top 3 HN comments.
- Write a 1-paragraph "what happened" note to `docs/may2-results/summary.md` for tomorrow's blog post and the YC application.
- Tweet "wrapping up day one" thank-you — readers love this and it primes them for tomorrow.
- Sleep. May 3 is for follow-through; you can't follow through tired.

---

## Cut-list (drop in this order if behind)

Architect-revised order: **launch-extras get dropped before any core build item.** A second tweet in week 2 covers a missed Discord post; a missed Gateway MVP cannot be recovered.

If at any block you're ≥45 min behind schedule, drop in this exact order:

**Tier 1 — launch extras (drop first, zero core impact):**
1. Submit Product Hunt for tomorrow (do May 3 morning; missing PH today doesn't matter)
2. Post in MCP Discord (cap is small, easy to do May 3)
3. Post in Replit Discord (#share-your-builds) — Replit also gets reached via the `/replit` page + tweet
4. Post r/SideProject (lowest signal-to-noise of the four reddits)
5. Post r/replit (overlap with Replit Discord coverage)
6. Reactive monitoring window — cap at 1 hour instead of 2 (still respond to high-signal HN/Twitter, ignore lower-tier replies)

**Tier 2 — supporting build (drop only if Tier 1 dropped + still behind):**
7. KPI live counter on `Home.tsx` (a static snapshot tweet covers it)
8. `/vs/mistral-ocr` (keep `/vs/firecrawl`; it's the highest-intent comparison)
9. Pro upgrade nudge (existing 429 still works; banner-only edit takes 10 min, full nudge takes 40)
10. `/x402` redirect (leave the contradictory page up rather than skip Gateway work; the new positioning still wins)
11. Replit Template (push to May 3 — but try VERY hard to keep this; it's the May 2 Replit-Agent-free-day unlock)

**Permanently cut from May 2 (already off the table, do NOT add back today):**
- `/vs/whisper-api` (lowest intent of the three /vs pages)
- Account creation flow / email magic link (entire B3 roadmap item — pushes to May 5)

**Never drop, no matter how late:**
- Gateway MVP (the whole point of the day — at minimum the Gateway-as-Waitlist downgrade)
- Gateway smoke test (W5) — without the screenshot the launch story is hollow
- GitHub repo + README (compounding asset, biggest "honey" gap)
- `/replit` landing page (the Replit-Agent-day moment)
- `/gateway` landing page (the new core positioning)
- Tweet thread + Show HN + r/LocalLLaMA + r/ClaudeAI + 5 builder DMs (the launch itself)
- Apify email (highest-leverage single outreach)

---

## Rollback plans

| If this breaks | Do this |
|---|---|
| api-server deploys but `/api/mcp` returns 500s under load | Roll back to last known-good revision via deployment skill. Keep website up; only the MCP endpoint matters. |
| Gateway smoke test fails (no payment goes through) | Hide `/gateway` route, keep "Coming May 31" stub on `McpOwnerDashboard`. Launch surge package without Gateway. The Gateway story stays in the README and tweet thread (now framed as "shipping in 4 weeks"). |
| HN flags the post | Don't argue. Move launch energy to LocalLLaMA / ClaudeAI / Twitter. HN is bonus, not core. |
| Twitter rate-limits the thread | Switch to a single image+CTA tweet, link to a blog post version on toolora.dev/blog/may-2-launch. |
| Replit Agent free day extends or starts late | Match the schedule to the actual window. Don't launch before Agent is free. |
| You hit a wall mentally at 18:00 | Push launch to 21:00 PT. The audience is global; evening PT is afternoon Europe and morning Asia — both are fine windows. |

---

## End-of-day target metrics

| Metric | Floor (sprint succeeded) | Stretch | YC-narrative |
|---|---|---|---|
| Unique MCP connections | 5,000 | 15,000 | "5x our 30-day baseline in 24 hours" |
| Tool calls served | 10,000 | 50,000 | "20x our 30-day baseline in 24 hours" |
| Pro signups | 10 | 50 | "$200/mo new MRR from one launch day" |
| Gateway sign-ups (waitlist) | 20 | 100 | "20+ MCP builders want to bill via us" |
| Gateway live customers | 1 | 3 | "First USDC payment processed live" |
| GitHub stars | 50 | 200 | "Trending in the privacy-tech tag" |
| HN points | 100 | 500 | "Front page" |
| Tweet thread impressions | 50K | 250K | — |
| New email subscribers | 50 | 250 | Future Pro upsell channel |

If you hit floor on 6+ of 9, the day was a clear win and the YC application has its lead paragraph.
