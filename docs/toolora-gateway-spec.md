# Toolora Gateway — May 2 MVP Spec

**North Star for May 2:** Take **one real USDC payment** for a third-party MCP tool call before midnight PT. That single transaction is the YC application's lead asset.

**Why this scope:** anything more than this can't ship in one solo day. Anything less doesn't credibly differentiate us from "free MCP that maybe wants to bill someday."

---

## What we already have (reuse, do not rebuild)

Verified by reading the actual code on Apr 29:

| Existing piece | Real shape | What it gives us |
|---|---|---|
| `lib/db/src/schema/sponsors.ts` → `mcpListingsTable` (table `mcp_listings`) | `id: text` UUID, `name`, `tagline`, `description`, `url`, `category`, `featured`, `buyerEmail`, `polarCheckoutId`, `approved`, `verifiedGithubOwner`, `createdAt` | Listing source of truth — Gateway configs FK here. **PK is `text` UUID, not serial.** |
| `lib/db/src/schema/mcpListingEvents.ts` → `mcpListingEventsTable` | `id: text`, `listingId: text`, `kind`, telemetry | Event log pattern to copy for `gateway_billing_events` |
| `lib/db/src/schema/mcpCalls.ts` | `id: serial` (frozen — never change) | Reference for our own MCP call billing — DO NOT touch |
| `artifacts/api-server/src/routes/directory.ts` | `GET /api/directory/listings` returns rows from `mcp_listings` | Hub data API — already works |
| `artifacts/api-server/src/routes/directoryEvents.ts` | `signOwnerToken(listingId, ownerKey)` + `verifyOwnerToken(token, listingId)` (HMAC) | **This is the auth model we use** — token-based, not session middleware |
| `artifacts/api-server/src/routes/checkout.ts` + Polar | 49 USDC standard / 99 USDC featured listing fee | Existing paid path. **For smoke test, we bypass via direct SQL insert (see W5).** |
| `artifacts/toolbox/src/pages/McpHub.tsx` + `McpServerDetail.tsx` + `McpOwnerDashboard.tsx` + `SubmitMCP.tsx` | All wired to the routes above | UI surface to extend |
| `artifacts/toolbox/src/pages/X402.tsx` | **Says "10% take, building now, waitlist"** — directly contradicts new positioning | **Must be redirected to `/gateway` or rewritten on May 2** (added to runbook Block 7) |

**The Gateway is mostly glue between things we already shipped.** A 1-day MVP is realistic *if* we respect these existing shapes (text UUIDs, `verifyOwnerToken`, Polar paywall workaround).

---

## Architecture (1 page)

```
┌─────────┐     1. POST /mcp        ┌─────────────────────────┐
│  Agent  │ ──────────────────────► │  gateway.toolora.dev    │
│ (Claude,│                          │  proxy at /mcp/:listingId
│ Cursor, │                          │                         │
│  ...)   │                          │  • lookup gateway_config│
└─────────┘                          │  • verify x402 payment  │
     ▲                               │  • SSRF-validate upstream
     │  4. response                  │  • forward to upstream  │
     │                               │  • split USDC 95/5 now  │
     │                               │  • log billing event    │
     │                               └────────────┬────────────┘
     │                                            │ 2. proxy (timeout 30s)
     │                                            ▼
     │                               ┌─────────────────────────┐
     │                               │  3rd-party MCP server   │
     │                               │  (owner-supplied URL,   │
     │                               │   pre-validated SSRF)   │
     │                               └────────────┬────────────┘
     │                                            │ 3. response
     │                                            ▼
     │                               ┌─────────────────────────┐
     │                               │  Splitter (sync, in-req) │
     │                               │  95% → owner wallet     │
     │                               │  5% → Toolora wallet    │
     │                               │  Solana SPL USDC ~$0.000005 gas
     │                               └─────────────────────────┘
```

Three key design decisions, all deliberate:

1. **Owners register their upstream MCP URL with us.** We proxy; they keep their own server. Zero hosting cost for us, owners keep total control, we earn on the billing layer alone. *This is the marketplace shape.*
2. **Payment check is pre-call. USDC split is in-flight, same request.** Caller must present a valid x402 payment proof before we forward. After upstream returns, we split 95/5 in the same request lifecycle (Solana fees are ~$0.000005 — affordable per call). The "instant payout" claim in launch copy is honest because the on-chain transfer initiates within seconds of the call. No batching, no daily worker, no payout delay.
3. **SSRF is a first-class concern.** Owner-supplied `upstreamMcpUrl` is the highest-risk attack surface in this whole system. See the dedicated SSRF section below — it's not optional.

---

## Database additions

Two new tables. **Zero changes to existing tables.** PKs are `text` UUIDs to match the `mcpListingsTable` and `mcpListingEventsTable` convention (and to avoid touching `mcp_calls.id` which is `serial` and frozen).

```typescript
// lib/db/src/schema/gatewayConfigs.ts
import { pgTable, text, integer, boolean, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { mcpListingsTable } from "./sponsors";

export const gatewayConfigsTable = pgTable("gateway_configs", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: text("listing_id").notNull().references(() => mcpListingsTable.id, { onDelete: "cascade" }),
  enabled: boolean("enabled").notNull().default(false),
  pricePerCallUsdcMicros: integer("price_per_call_usdc_micros").notNull(),
    // micros = 1/1,000,000 USDC, lets us price at $0.0001 per call
  payoutWalletAddress: text("payout_wallet_address").notNull(),
  payoutNetwork: text("payout_network").notNull().default("solana"),
    // 'solana' | 'stellar'
  upstreamMcpUrl: text("upstream_mcp_url").notNull(),
    // The actual MCP server we proxy to. SSRF-validated on write AND on every call.
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  listingIdx: uniqueIndex("gw_configs_listing_idx").on(table.listingId),
  enabledIdx: index("gw_configs_enabled_idx").on(table.enabled),
}));

// lib/db/src/schema/gatewayBillingEvents.ts
export const gatewayBillingEventsTable = pgTable("gateway_billing_events", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  gatewayConfigId: text("gateway_config_id").notNull().references(() => gatewayConfigsTable.id, { onDelete: "cascade" }),
  listingId: text("listing_id").notNull(),  // denormalized for fast owner queries
  callerPaymentRef: text("caller_payment_ref"),
    // x402 payment proof identifier OR sha256 hash of caller API key
  toolName: text("tool_name"),
  amountUsdcMicros: integer("amount_usdc_micros").notNull(),
  tooloraFeeUsdcMicros: integer("toolora_fee_usdc_micros").notNull(),
    // = round(amount * 0.05)
  paymentTxHash: text("payment_tx_hash"),       // caller → toolora wallet
  payoutTxHash: text("payout_tx_hash"),         // toolora wallet → owner wallet (95%)
  status: text("status").notNull().default("pending"),
    // 'pending' | 'settled' | 'failed' | 'refunded'
  errorReason: text("error_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  settledAt: timestamp("settled_at", { withTimezone: true }),
}, (table) => ({
  configIdx: index("gw_events_config_idx").on(table.gatewayConfigId),
  listingIdx: index("gw_events_listing_idx").on(table.listingId),
  statusIdx: index("gw_events_status_idx").on(table.status),
  createdAtIdx: index("gw_events_created_idx").on(table.createdAt),
}));
```

> **Database safety (per existing rules):**
> - PKs are `text` UUIDs (matches `mcp_listings`, `mcp_listing_events`). Never changed to serial.
> - FK to `mcp_listings.id` (text). Compatible.
> - `mcp_calls.id` (serial) is **never touched** — it's the existing payments table; we use a separate Gateway billing log instead.
> - `pnpm --filter @workspace/db run push-force` is the canonical apply path — but it has hung historically on the sponsors interactive prompt. **Pre-apply via direct SQL on May 1 evening** using the database skill so May 2 morning starts with the schema already live.

---

## API contract

### Public proxy endpoint

```
POST  https://gateway.toolora.dev/mcp/:listingId
GET   https://gateway.toolora.dev/mcp/:listingId
```

Where `:listingId` is the `mcp_listings.id` UUID. (We considered slugs, but `mcp_listings` doesn't currently have a slug column — adding one is post-MVP. UUIDs in URLs are uglier but ship today.)

**Request headers (must include x402 payment, day-1):**
- `X-PAYMENT: <x402 payment proof>` — pay-as-you-go. Required on every request. (No pre-paid credit accounts in MVP — adds W6 we can't afford today.)

**Response codes:**
- `200` — proxied successfully, billing event row created with `status='settled'` after USDC split confirms.
- `402` Payment Required — no valid `X-PAYMENT` header, returns x402 challenge containing `pricePerCallUsdcMicros` from `gateway_configs`.
- `403` — owner-supplied upstream URL fails SSRF validation (private IP / cloud metadata / disallowed scheme).
- `404` — listing not found OR `gateway_configs.enabled = false`.
- `502` — upstream MCP unreachable or returned non-2xx within timeout. **No billing event created. No charge to caller. No payout to owner.**
- `504` — upstream timeout > 30s. Same: no billing, no charge.

### Owner-facing API (called by McpOwnerDashboard "Billing" tab)

All endpoints below require `Authorization: Bearer <ownerToken>` where `ownerToken` is minted by the existing `signOwnerToken(listingId, ownerKey)` helper from `directoryEvents.ts`. **We do not introduce a new auth system** — owners already get a token from the email-claim or GitHub-claim flow they completed when they paid for their listing. The handler middleware calls `verifyOwnerToken(token, listingId)` exactly like `directoryEvents.ts` does.

```
POST   /api/gateway/configs/:listingId             create or upsert config
PATCH  /api/gateway/configs/:listingId             partial update (enable, price, wallet, upstream URL)
GET    /api/gateway/configs/:listingId             read mine
GET    /api/gateway/billing-events/:listingId      paginated list, my events only
```

> **No `payouts` endpoint in MVP.** Settlement is per-call in-flight; the billing-events feed *is* the payout feed. The owner dashboard derives "today's earnings" by summing `amountUsdcMicros - tooloraFeeUsdcMicros` over the last 24h client-side.

---

## Five work items (May 2 morning, ~5 hours of agent time)

> **Pre-applied on May 1 evening (NOT May 2 morning):**
> - Schema migration via direct SQL (avoids the sponsors-prompt hang)
> - Smoke-test listing seeded in `mcp_listings` (see W5 prereq section)
> - Owner token minted via a one-line `signOwnerToken(seedListingId, "gh:wesleyolis")` script and saved to your password manager
>
> Without these three pre-flights, May 2 morning's first hour evaporates wrestling with infrastructure. **Do them May 1 evening, even though it feels like "shipping early" — it's not, no public surface changes.**

### W1 — Confirm DB live (~10 min)

- The migration was applied May 1 evening. This step is just `psql \d gateway_configs` and `\d gateway_billing_events` to confirm both tables exist with the expected columns.
- If anything's missing, re-apply the SQL from W1's pre-flight script.

### W2 — Gateway proxy route (~150 min)

- New file: `artifacts/api-server/src/routes/gateway.ts`.
- New Express route mounted at `/mcp/:listingId` — exposed on a separate host (`gateway.toolora.dev`) so MCP clients see a clean URL. (Subdomain routing in production via the deployment skill; in dev, mount at `/api/gateway/proxy/:listingId`.)
- **DNS pre-check May 1 evening:** confirm `gateway.toolora.dev` CNAME / wildcard is in place. If not, add to pre-flight.
- Pseudocode:

```typescript
router.all("/mcp/:listingId", async (req, res) => {
  const config = await getEnabledConfigByListingId(req.params.listingId);
  if (!config) return res.status(404).json({ error: "not_found_or_disabled" });

  // SSRF gate — re-check on every call (URL could've been changed since last validation)
  const ssrf = await validateUpstreamUrl(config.upstreamMcpUrl);
  if (!ssrf.ok) return res.status(403).json({ error: "upstream_blocked", reason: ssrf.reason });

  const payment = await verifyX402Payment(req, config.pricePerCallUsdcMicros);
  if (!payment.ok) return res.status(402).json(buildX402Challenge(config));

  const upstream = await proxyToUpstream(config.upstreamMcpUrl, req, { timeoutMs: 30_000 });
  if (upstream.timedOut) return res.status(504).json({ error: "upstream_timeout" });
  if (!upstream.ok)      return res.status(502).json({ error: "upstream_unreachable" });

  // In-flight USDC split (95% to owner, 5% to Toolora). Awaits tx broadcast, not full confirmation.
  const split = await splitUsdc({
    amountMicros: config.pricePerCallUsdcMicros,
    feeMicros: Math.round(config.pricePerCallUsdcMicros * 0.05),
    payoutWallet: config.payoutWalletAddress,
    payoutNetwork: config.payoutNetwork,
    paymentTxHash: payment.txHash,
  });

  await recordBillingEvent({
    gatewayConfigId: config.id,
    listingId: config.listingId,
    callerPaymentRef: payment.callerRef,
    toolName: extractToolName(req.body),
    amountUsdcMicros: config.pricePerCallUsdcMicros,
    tooloraFeeUsdcMicros: Math.round(config.pricePerCallUsdcMicros * 0.05),
    paymentTxHash: payment.txHash,
    payoutTxHash: split.payoutTxHash,
    status: split.ok ? "settled" : "pending",
    errorReason: split.errorReason,
  });

  return res.status(upstream.status).set(upstream.headers).send(upstream.body);
});
```

- `verifyX402Payment` reuses the x402 wiring already in the existing `X402.tsx`-related route handlers.
- `proxyToUpstream` is a `fetch` wrapper with a 30s timeout. Only `http://` and `https://` schemes allowed; no redirects followed automatically (each redirect triggers a fresh SSRF check).
- `splitUsdc` issues two SPL-USDC transfers in one transaction on Solana (or two op tx on Stellar). If broadcast fails, status stays `pending` and a (post-MVP) reconciler retries.

**Why W2 grew from 90 → 150 minutes:** the original estimate ignored SSRF validation, payout-tx broadcasting in-band, error-status semantics for 502/504/403, and subdomain/dev-mode dual mounting. None are optional.

### W3 — `McpOwnerDashboard` UI (~120 min)

- Add "Billing" tab to existing dashboard layout (existing tab pattern in `McpOwnerDashboard.tsx`).
- The dashboard already has the owner's `listingId` and `ownerToken` in client state from the existing claim flow — reuse these directly. **Do not introduce new auth.** Pass `Authorization: Bearer ${ownerToken}` on every Gateway API call.
- Form fields:
  - **Enable Gateway billing** (toggle, defaults off)
  - **Upstream MCP URL** (text input — client-side validates as a URL; server re-validates with full SSRF check)
  - **Price per call (USD)** (number input, 4-decimal precision; converted to USDC micros server-side)
  - **Payout wallet address** (text input)
  - **Payout network** (select: Solana / Stellar)
  - **Generated proxy URL** (read-only): `gateway.toolora.dev/mcp/${listingId}` — copy button
- Save calls `POST /api/gateway/configs/${listingId}` (upsert). PATCH for partial updates.
- Below the form: a live table of the last 50 `gateway_billing_events` for this listing. Columns: time, tool, amount (USD), your share (USD), Toolora fee (USD), status, payout tx (link to Solana/Stellar explorer).
- Polls every 10s while the tab is open.

**Why W3 grew from 75 → 120 minutes:** the original estimate assumed session-auth middleware that doesn't exist. Threading `ownerToken` through the existing claim flow + adding the events polling table + handling the `enabled-but-misconfigured` edge cases costs the extra 45 minutes.

### W4 — `/gateway` landing + docs (~45 min)

- New file: `artifacts/toolbox/src/pages/Gateway.tsx`.
- Hero, three-feature grid, integration code snippet, pricing block, FAQ. Copy lives in `docs/toolora-may2-launch-copy.md` under `## /gateway landing`.
- Route: add `/gateway` to `App.tsx` router.
- Brief docs page at `/gateway/docs` — just the integration steps for owners.
- **Also:** redirect or rewrite `/x402` to point to `/gateway` (existing X402.tsx claims 10% take rate and "waitlist" — directly contradicts the new launch story). Cheapest move: replace `X402.tsx`'s body with `<Navigate to="/gateway" replace />` so the old page becomes a permanent redirect. Logged in runbook Block 7.

### W5 — End-to-end smoke test (~45 min on May 2 + ~20 min prereq on May 1 evening)

This is the proof shot for Twitter and the YC application. Don't skip it.

**Prereq on May 1 evening (~20 min):**

1. Spin up a one-file Express "echo" MCP server on a side Replit Repl. URL it back to yourself. Confirm `curl <upstream>/health` returns 200.
2. Run a one-line script to seed the listing directly via SQL (bypassing the 49 USDC paywall — this is a Toolora-owned demo listing, comp is fine):
   ```sql
   INSERT INTO mcp_listings
     (id, name, tagline, description, url, category, approved, buyer_email, polar_checkout_id, verified_github_owner)
   VALUES
     (gen_random_uuid(), 'Toolora Gateway Demo MCP',
      'Echo server for Gateway smoke test',
      'Internal demo listing used to demonstrate USDC billing for the May 2 launch.',
      '<your upstream URL>', 'Developer Tools', true,
      'demo@toolora.dev', 'manual-smoke-2026-05-02', 'wesleyolis')
   RETURNING id;
   ```
   Save the returned UUID — that's your `seedListingId`.
3. Run a one-line script to mint your owner token: `console.log(signOwnerToken(seedListingId, "gh:wesleyolis"))`. Save it in your password manager.
4. **Do not enable Gateway billing tonight.** That happens May 2 during the smoke test, on the live UI, so the screenshot is honest.

**On May 2 (~45 min, after W1–W4):**

1. Open `McpOwnerDashboard` → paste your `seedListingId` and `ownerToken` to claim → Billing tab.
2. Toggle "Enable Gateway billing" on. Set price = $0.001/call. Paste payout wallet (your real Solana wallet). Paste upstream URL.
3. From terminal: `curl gateway.toolora.dev/mcp/<seedListingId>` with no payment header. Confirm 402 + x402 challenge body.
4. Pay the x402 challenge from your USDC test wallet (the $5 you funded May 1). Replay the same request with `X-PAYMENT: <proof>`.
5. Confirm 200 from the upstream + a new `gateway_billing_events` row with `status='settled'`, real `paymentTxHash`, real `payoutTxHash`.
6. Verify on Solana explorer: 0.00095 USDC arrived in your payout wallet, 0.00005 in Toolora's wallet.
7. **Screenshot the dashboard with the live event row + the Solana explorer payout tx.** That dual screenshot is the YC application opener.

**Why W5 grew from 30 → 45 min on May 2 + 20 min prereq:** the original estimate assumed `SubmitMCP` was free and instant. It's not — it's a 49 USDC paid checkout via Polar. Bypassing it via SQL on May 1 evening is the only way to fit the smoke test in the May 2 budget.

---

## SSRF guardrails (non-negotiable)

The Gateway proxy accepts an owner-supplied URL and fetches it. Without strict validation this is a textbook SSRF (Server-Side Request Forgery) attack — an owner could point us at internal endpoints, cloud-metadata services, or Postgres-on-localhost and read responses through our infra. Every check below must be implemented in `validateUpstreamUrl`:

**Scheme allowlist:**
- ✅ `http://`, `https://`
- ❌ `file://`, `gopher://`, `ftp://`, `ssh://`, `data://`, `javascript:`, anything else

**Host validation (DNS-resolved, not just textually):**
- Resolve hostname via DNS; check **the resolved IPs**, not the literal string (`127.0.0.1.nip.io` resolves to `127.0.0.1` — a textual check would miss it).
- Block all of:
  - Loopback: `127.0.0.0/8`, `::1`
  - Link-local: `169.254.0.0/16`, `fe80::/10` (covers AWS/GCP/Azure metadata at `169.254.169.254`)
  - Private RFC1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
  - Carrier-grade NAT: `100.64.0.0/10`
  - Multicast: `224.0.0.0/4`
  - Reserved: `0.0.0.0/8`, `240.0.0.0/4`
  - Unique-local IPv6: `fc00::/7`
  - IPv4-mapped IPv6 of any of the above
- Reject if hostname resolves to ≥1 blocked IP (don't pick the "good" one — the next DNS query may return only blocked).

**Other hardening:**
- Hard 30s timeout on the upstream fetch.
- Max response size: 10 MB. Larger → 502.
- **Do not follow redirects automatically.** If upstream returns 3xx, surface it to the caller as-is. (Auto-following would let an attacker register a public URL that 302s to internal.)
- Strip incoming `Host`, `X-Forwarded-*`, `Cookie` headers before forwarding (don't leak Toolora session info to the upstream).
- Don't forward Toolora's own internal headers either.

**Validate twice:**
- On `POST/PATCH /api/gateway/configs/:listingId` (so a misconfigured URL is rejected at save time with a clear error).
- On every proxied call (DNS may have changed since save; rebinding attacks are real).

**Library suggestion:** there's no good standalone npm SSRF lib. Implement `validateUpstreamUrl` in ~50 lines using Node's built-in `dns.promises.resolve` + the `ipaddr.js` package for CIDR matching. Budget 30 min of W2's 150 to write + test it. **Add a unit test that asserts at least the 169.254.169.254 case is blocked** — that's the single highest-value test in this codebase right now.

---

## Out of scope (push to May 11–31 phase 2)

Don't build these on May 2. They're real but they're not the MVP:

- ❌ Pre-paid credits balance (only x402 pay-as-you-go on day 1)
- ❌ Stripe-funded credits top-up flow
- ❌ Multi-currency pricing (USDC only)
- ❌ Refunds / disputes UI
- ❌ Tax / 1099-K / VAT handling
- ❌ Webhooks to owners (success/fail callbacks)
- ❌ Rate limiting per caller per config
- ❌ A/B-test pricing
- ❌ Builder analytics dashboard beyond the basic event list
- ❌ Usage-based pricing (only flat per-call on day 1)
- ❌ White-label proxy domains for builders

---

## Success criteria

By 23:00 PT on May 2:

- [ ] `gateway_configs` and `gateway_billing_events` tables exist in production
- [ ] At least 1 row in `gateway_configs` with `enabled = true`
- [ ] At least 1 row in `gateway_billing_events` with `status = "settled"` AND a real Solana tx hash
- [ ] `/gateway` landing renders publicly
- [ ] `McpOwnerDashboard` Billing tab is functional in production
- [ ] Screenshot of the smoke test transaction is captured for tweet + YC app

If 4 of 6 are green, MVP shipped. If <4, ship what works and time-box the rest into May 3.

---

## Cut-down version (if behind by Block 5)

If at 11:00 PT W2 isn't done, downgrade to **"Gateway-as-Waitlist"**:

1. Skip W2 entirely.
2. W3 becomes a single "Join Gateway waitlist" button (email capture) on `McpOwnerDashboard`.
3. W4 stays — just a landing page with the same feature framing + waitlist CTA.
4. W5 skipped.
5. Tweet thread reframes from "we just shipped Gateway" → "Gateway opens for early-access tomorrow, sign up at toolora.dev/gateway".

This still credibly tells the marketplace+billing story for May 2 launch energy. The risk is purely the YC application loses its strongest opener (no real transaction). Shoot for full version; this is the parachute, not the plan.

---

## Day-after-May-2 plan (May 3)

If MVP shipped:
- Email everyone who hit the Gateway waitlist (collected from the landing form).
- Onboard 2 more 3rd-party MCPs by hand (offer to pre-fill their config).
- Write the "we did $X in Gateway revenue on day one" tweet/blog. Even $0.10 in real revenue is huge narrative.

If MVP didn't ship and Gateway-as-Waitlist did:
- All May 3 morning is W2 (the proxy) and W5 (the smoke test). Same playbook, slipped 24h.

---

## Pre-decided: tech choices, no thinking on May 2

These are decided now so May 2 has zero decision overhead:

- **Subdomain:** `gateway.toolora.dev` (configure DNS in deployment skill before May 2 evening).
- **Take rate:** flat 5%, hardcoded constant. No tiering.
- **Pricing units:** internally micros of USDC (`integer`); UI shows USD with 4-decimal precision.
- **Settlement cadence:** instant per-call (no batching). Batch optimization waits for >100 calls/day per owner.
- **Wallet types accepted:** Solana SPL USDC + Stellar USDC. No Ethereum on day 1 (gas kills the unit economics).
- **Owner identity:** existing toolbox auth. No separate Gateway login.
- **Upstream timeout:** 30 seconds. After that, 502 + no billing.
- **Idempotency:** caller can include `X-Idempotency-Key`; we cache the response for 60s. Prevents double-billing on retries.
