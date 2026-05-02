# Overview

This project, Toolora, is a pnpm monorepo using TypeScript to build a platform offering free online tools, a Microservice Control Plane (MCP) server, and an AI-powered brochure generation service. Toolora emphasizes privacy-first, client-side tool processing and robust monetization through API keys, subscriptions, and per-call stablecoin payments. It aims to be a key infrastructure provider for the agent economy, integrating with platforms like Replit Agent.

# User Preferences

I want iterative development.
Ask before making major changes.

# System Architecture

## Monorepo Structure and Tooling

The project is a pnpm workspace monorepo, separating applications (`artifacts/`) from shared libraries (`lib/`). It uses Node.js 24, pnpm, TypeScript 5.9, Express 5 for the API, PostgreSQL with Drizzle ORM, Zod for validation, and Orval for OpenAPI codegen. Esbuild handles CJS bundling.

## Core Services

### API Server (`@workspace/api-server`)

An Express 5 server managing all API endpoints, utilizing `@workspace/api-zod` for validation and `@workspace/db` for database interactions.

### Database Layer (`@workspace/db`)

Manages PostgreSQL interactions with Drizzle ORM, defining schema models and providing a Drizzle client.

### OpenAPI Specification and Codegen (`@workspace/api-spec`)

Contains the OpenAPI 3.1 specification, generating React Query hooks, a fetch client (`@workspace/api-client-react`), and Zod schemas (`@workspace/api-zod`) for API validation.

## Frontend (`@workspace/toolbox`)

A React + Vite application serving as Toolora's main UI.

-   **Design**: Dark mode first and responsive.
-   **Privacy**: All tool processing occurs client-side.
-   **Tools**: Provides 20 functional tools across various categories.
-   **Monetization UI**: Includes pricing, API key management, subscription, and credit pack purchase pages.
-   **SEO**: Features sitemap, robots.txt, dynamic meta tags, and JSON-LD structured data to support a large number of indexable pages with cross-linking.
-   **"100x" Features**: Embeddable tools, Replit Auth integration, user history tracking, tool chaining via URL parameters, a Manifest V3 Chrome extension, and public API documentation.

## Gateway Service

The Toolora Gateway (`/api/gateway`) enables stablecoin payments for agent interactions. Agents pay per-call in USDC via x402, which proxies to the owner's MCP server, splits the payment (95% owner / 5% Toolora), and records ledger entries. It includes public proxy endpoints, CRUD for gateway configurations, billing event logs, summary statistics, and public proof pages for transparency.

Key Gateway Features:
-   **Payment Handling**: Verifies x402 payments, forwards requests, splits USDC, and records billing events.
-   **Configuration**: Owner-authenticated CRUD for listing configurations (price, payout wallet, upstream URL, distribution flags).
-   **Reporting**: Provides billing event logs, summary stats, and a public leaderboard.
-   **SSRF Defense**: Implements two layers of protection: pre-fetch validation blocking private IPs and DNS pinning to prevent DNS rebinding attacks.
-   **Accounting Integrity**: Ensures a ledger row is always written post-payment, regardless of upstream success, with a refund worker for failed calls.

## MCP Server

Accessible at `GET|POST /api/mcp`, this service implements the MCP Streamable HTTP transport, offering **34 tools** (32 free + 2 on-chain-paid: `private_execute_tool`, `get_arc_trading_signal`). It supports tool discoverability with detailed metadata, features in-memory rate-limiting (200 calls/day free, unlimited Pro), and ensures privacy by hashing client IDs and stripping referrers.

-   **Public manifest**: `GET /.well-known/mcp.json` — registry-ready manifest with categories, keywords, install snippets, and the full tool list. Source of truth for Anthropic registry / Smithery / mcp.so / Glama / mcphub submissions (see `artifacts/api-server/SUBMISSIONS.md`).
-   **Writing-quality bundle** (added May 2026): 7 stateless tools designed for the writing-agent loop — `analyze_text` (Flesch + Gunning-Fog + SMOG + Coleman-Liau + ARI in one call), `count_tokens_multi` (11-model token + cost estimate in one call), `find_repetition` (top words / bigrams / trigrams), `detect_jargon` (Plain Language scorer + suggested swaps), `detect_pii` (email, phone, SSN, Luhn-validated cards, OpenAI/Anthropic/GitHub/AWS/Stripe keys, JWTs), `tone_score` (formal/casual/technical/urgent dimensions), `compare_versions` (readability + tone delta diff). Pure functions live in `artifacts/api-server/src/lib/writingQuality.ts`. No new npm deps.

## Inbound Funnel — `/publish`

Toolbox page that lets API owners self-serve onto the Gateway in 60s. They paste a public OpenAPI 3 JSON URL → Toolora calls `POST /api/gateway/openapi-to-mcp/init` (SSRF-validated, IP rate-limited to 10/hour) → page renders the resulting MCP URL with copy-to-clipboard + Claude Desktop config snippet + curl test snippet. Linked from the API mega-menu and footer Resources column in `AppLayout.tsx`. Page lives at `artifacts/toolbox/src/pages/Publish.tsx`. Tested end-to-end with the Swagger Petstore spec (parses 19 operations into MCP tools).

**Hardening (May 2026):**
-   **Client + server URL pre-validation**: rejects non-`http(s)://` schemes, malformed URLs, and >2048-char payloads at both layers.
-   **In-memory IP rate limit**: 10 init requests / hour / IP, bounded map (≤5k IPs, evicts oldest 1k on overflow). Returns `429` with `Retry-After`.
-   **Relative `servers[].url` resolution** (bug fix): `fetchAndParseSpec` now resolves relative server URLs against the spec URL's origin via `new URL(rawServerUrl, specUrl)`. Without this, real-world specs like Petstore (which use `/api/v3` rather than absolute URLs) failed SSRF validation. After SSRF validation passes on the resolved URL, the spec is parsed.
-   **Known limitation**: every submission creates a "claim-less" spec row — there's no way for the original submitter to come back and edit price / payout wallet. Acceptable for the YC W26 demo (the value prop is "test it instantly without signup"); a follow-up sprint should add an opaque ownership token on submission and a `/publish/claim/:token` route.

## Live Global Ticker

`GET /api/gateway/global-stats?window=1h|24h|7d|all` aggregates settled USDC volume across ALL leaderboard-opt-in listings. Cached 20s. Public CORS (`Access-Control-Allow-Origin: *`) so embedded ticker widgets and third-party dashboards can poll directly. Uses parameterized `make_interval(secs => $1)` binding (no `sql.raw`) for defense-in-depth. Powers `HomepageGlobalTicker` (mounted in `Home.tsx` hero) which polls every 20s with **adaptive window fallback** (1h → 24h → 7d → all-time): the first window with any calls wins, so the ticker is never empty on a quiet hour but always shows the freshest live data. Click-through goes to `/gateway`.

## Monetization System

Two parallel rails. The **primary** rail (and the YC W26 RFS pitch surface) is the **Toolora Gateway** — agents pay per-call in Solana USDC / Stellar XLM via x402, owners keep 95%, settlement is on-chain. The **secondary/legacy** rail is a Stripe-backed Free/Pro/Team SaaS subscription for human users; it remains fully wired in the backend but is **intentionally hidden from the primary navigation** (header menu, user dropdown, mobile menu, footer Resources column, Home page CTA) so the demo path stays focused on the agent-economy story.
-   **Database**: `toolora_users` (incl. `stripe_customer_id` / `stripe_subscription_id`, harmless when null), `api_keys`, `api_usage`.
-   **Stripe Integration** (dormant on demo path, fully functional): Replit connector v2 for checkout, customer portal, subscriptions, and webhook processing. Lives in `artifacts/api-server/src/{stripeClient,webhookHandlers}.ts` + `routes/stripeRoutes.ts`. The `/pricing` route is still mounted (so inbound links from blog posts / how-to pages don't 404), but no in-app navigation surfaces it. **To restore Stripe-as-primary-rail**: (a) re-add the "Pricing" entry in `artifacts/toolbox/src/components/layout/AppLayout.tsx` in 4 spots (API mega-menu items array near line 82 + featured card near line 90 + user-dropdown menu near line 342 + mobile menu near line 415 + footer Resources `<li>` near line 539); (b) revert the Home.tsx hero copy in two blocks — the agent-economy CTA section near line 444 (currently lists `x402 / Solana / Stellar` pill badges) AND the three-layer "Agent API" card near line 281 (currently says "no card, no contract, no invoice"); (c) revert `ApiUpgradeBanner.tsx` hrefs from `/api-docs` back to `/pricing#api`. Backend code is untouched, so re-enabling is purely a copy/link revert.
-   **API Key Middleware**: SHA-256 hashed keys, tier-based rate limiting, monthly usage tracking, credit deduction.
-   **x402 Payments**: Per-call billing in Solana USDC and Stellar XLM. **This is the primary monetization story** and powers the Toolora Gateway.

## AI Brochure Generation

A service at **POST `/api/brochure/generate`** uses AI to create print-ready HTML brochures from user-provided HTML and optional images. It integrates with Replit AI via OpenAI APIs, offering a free tier based on session tokens, with further usage requiring a `pro_required` status.

# External Dependencies

-   **Database**: PostgreSQL
-   **Payment Processing**: Stripe, Solana, Stellar
-   **AI Integration**: OpenAI
-   **Authentication**: Replit Auth
-   **Frontend Libraries**: qrcode, crypto-js, marked, react-dropzone, uuid, date-fns, pdf-lib, framer-motion, tesseract.js, mammoth, xlsx