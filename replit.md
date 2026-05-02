# Overview

This project is a pnpm monorepo using TypeScript, designed for building a platform called Toolora. Toolora offers a suite of free online tools, a Microservice Control Plane (MCP) server, and an AI-powered brochure generation service. The platform aims to provide privacy-first, client-side processing for its tools, alongside robust monetization features like API keys, subscriptions, and per-call payments. A key strategic focus is enabling stablecoin payments for agents and integrating with platforms like Replit Agent, positioning Toolora as a crucial infrastructure for the agent economy.

# User Preferences

I want iterative development.
Ask before making major changes.

# System Architecture

## Monorepo Structure and Tooling

The project is structured as a pnpm workspace monorepo, organizing applications (`artifacts/`) and shared libraries (`lib/`) into distinct packages. It leverages Node.js 24, pnpm, and TypeScript 5.9. Core tools include Express 5 for the API, PostgreSQL with Drizzle ORM for data persistence, Zod for validation, and Orval for API codegen from an OpenAPI specification. Esbuild is used for CJS bundling.

## Core Services

### API Server (`@workspace/api-server`)

An Express 5 server handling all API endpoints. It uses `@workspace/api-zod` for request/response validation and `@workspace/db` for database interactions. Routes are organized under `/api`, with health checks at `/api/health`.

### Database Layer (`@workspace/db`)

Manages PostgreSQL interactions using Drizzle ORM. It defines schema models and provides a Drizzle client instance. Migrations are handled by Replit for production, and Drizzle Kit is used for development.

### OpenAPI Specification and Codegen (`@workspace/api-spec`)

Contains the OpenAPI 3.1 specification (`openapi.yaml`) and Orval configuration. It generates:
- React Query hooks and a fetch client for the frontend (`@workspace/api-client-react`).
- Zod schemas for API validation (`@workspace/api-zod`).

## Frontend (`@workspace/toolbox`)

A React + Vite application that serves as the main user interface for Toolora.

- **Design**: Dark mode first, responsive.
- **Privacy**: All tool processing is 100% client-side.
- **Tools**: Offers 20 fully functional tools across categories like Text, Developer, Productivity, Image, and PDF.
- **Monetization UI**: Includes pages for pricing, API key management, and subscription/credit pack purchases.
- **SEO**: Implements comprehensive SEO features including sitemap, robots.txt, dynamic meta tags via `useSEO` hook, and JSON-LD structured data. The architecture supports a large number of indexable pages (tools, how-to guides, blog posts, glossary, comparisons) with an interconnected cross-linking system.
- **"100x" Features**:
    - **Embed/Share**: Provides direct URLs and iframe embed codes for tools.
    - **Authentication**: Integrates Replit Auth (OIDC).
    - **History**: Tracks and displays recent tool usage per user.
    - **Tool Chaining**: Allows passing output from one tool as input to another via URL parameters.
    - **Browser Extension**: Accompanied by a Manifest V3 Chrome extension.
    - **API Docs**: Publicly documents all API endpoints.

## Gateway Service

The Toolora Gateway (`/api/gateway`) is the stablecoin payments rail for agent interactions: agents pay per-call in USDC via x402, the gateway proxies to the owner's MCP server, then splits the payment 95% owner / 5% Toolora and writes a ledger row.

**Routes** (`artifacts/api-server/src/routes/gateway.ts`):
- `ALL /proxy/:listingId` — public proxy. Verifies x402 payment header, validates upstream URL (SSRF), forwards request, splits USDC, records billing event.
- `POST|PATCH|GET /configs/:listingId` — owner-token-authenticated CRUD for gateway config (price, payout wallet, upstream URL, enabled).
- `GET /billing-events/:listingId` — paginated event log.
- `GET /summary/:listingId` — 24h / 7d / all-time call counts and owner earnings.
- `POST /echo` — stub upstream for smoke testing.

**Operating modes** (env-controlled, default to `stub` for pre-flight):
- `GATEWAY_PAYMENT_MODE` — `stub` (accept any X-PAYMENT) | `verify` (validate x402 challenge against on-chain settlement).
- `GATEWAY_PAYOUT_MODE` — `stub` (no on-chain work) | `broadcast` (real Solana USDC transfers).
- `GATEWAY_SSRF_ALLOWLIST` — comma-separated host suffixes that bypass the IP-blocklist + DNS-pinning (defaults to `replit.dev,replit.app` in dev so the gateway can call its own echo).

**Accounting integrity** — the agent has ALREADY paid via x402 by the time we forward the request, so we MUST always write a ledger row, regardless of what happens upstream. Three post-payment paths all funnel into a billing event:
- **2xx upstream** → `splitUsdc()` runs (in try/catch). Status reflects actual split result (`settled` | `pending` | `failed`). Caller receives upstream response. Ledger row records `tooloraFeeUsdcMicros=50` (5%).
- **non-2xx / unreachable** → 502 to caller. Ledger row with `status='failed'`, `errorReason='upstream_status:NNN'` or `'upstream_unreachable:...'`, `tooloraFeeUsdcMicros=0` (no fee retained — caller didn't get a response). Reconciliation job can refund the agent's prepayment.
- **timeout** (>30s) → 504 to caller. Same ledger semantics with `errorReason='upstream_timeout:30000ms'`.
All three paths are factored through a single `recordFailedCallAndRespond()` helper. DB-insert failures log `CRITICAL` but don't block the response.

**SSRF defense** — two layers:
1. Pre-fetch validation (`lib/ssrf.ts`) blocks loopback, link-local (incl. cloud metadata 169.254.169.254), private RFC1918, multicast, ULA. Resolves DNS for both A and AAAA records.
2. DNS pinning at connect-time (`pinnedDispatcher()`) — uses `undici.fetch` (NOT global fetch, since global fetch's internal undici won't accept dispatchers from a separately-installed undici instance) with a custom `connect.lookup` that returns the pre-validated IP. Closes the validation-vs-connect TOCTOU window so a malicious owner can't use DNS rebinding to exfiltrate cloud metadata. Lookup callback honors both `options.all=true` (array form) and `options.all=false` (single form). Allowlisted hosts intentionally bypass pinning so Replit's loopback works.

**Owner token** — bearer token gating per-listing config CRUD. HMAC-SHA256 over `${listingId}:${ownerEmail}` keyed by `OWNER_SECRET`. Verifier anchors on the LAST 2 dot-segments of the email so addresses like `a.b.c@toolora.dev` work (a previous bug split-by-dot which mangled emails with dots in the local part).

**Frontend**:
- `/gateway` — landing page explaining the rail (toolbox).
- `/x402` — backwards-compat redirect → `/gateway`.
- McpOwnerDashboard "Gateway billing" tab — config form + 24h/7d/all-time earnings cards + paginated events table. The `dirty` flag on the config form prevents the 10s polling refresh from clobbering in-progress edits (poll only refreshes events+summary, never form state).

**Verified end-to-end** (smoke + e2e): pinned dispatcher works against external public hosts (httpbin.org returns 200 settled), failed-upstream calls record ledger rows with paymentTx + errorReason populated, happy path produces 95/5 split, owner-token CRUD works.

## MCP Server

Exposed at `GET|POST /api/mcp`, implementing the MCP Streamable HTTP transport. It offers 25 tools, with free and optional paid tiers, and collects anonymous telemetry. Key features include:
- **Discoverability**: `initialize` response includes detailed metadata (`_meta` field), directory information, pricing, and privacy attestations.
- **Resilience**: In-memory rate-limiting for surge protection.
- **Privacy**: Client IDs are SHA-256 hashed with per-process salts; referrers are stripped.

## Monetization System

Integrates API key management, subscription tiers (Free, Pro, Team), and one-time API credit packs.
- **Database**: `toolora_users`, `api_keys`, `api_usage` tables.
- **Stripe Integration**: Utilizes Replit connector v2 for checkout, customer portal, subscription management, and webhook processing for subscription and credit purchases.
- **API Key Middleware**: Enforces SHA-256 hashed API keys, tier-based rate limiting, monthly usage tracking, and credit deduction.
- **x402 Payments**: Continues to support per-call payments via Stellar XLM and Solana USDC as an alternative authentication path.

## AI Brochure Generation

**POST `/api/brochure/generate`** provides an AI-powered service to generate print-ready HTML brochures from input HTML and optional images. It integrates with Replit AI via OpenAI APIs and offers a free tier based on unique session tokens, with subsequent usage requiring a `pro_required` status.

# External Dependencies

- **Database**: PostgreSQL (via Drizzle ORM)
- **Payment Processing**: Stripe (for subscriptions and API credits), Solana (for USDC payments), Stellar (for XLM payments)
- **AI Integration**: OpenAI (via Replit AI integration for brochure generation)
- **Authentication**: Replit Auth (OIDC)
- **Frontend Libraries**: qrcode, crypto-js, marked, react-dropzone, uuid, date-fns, pdf-lib, framer-motion, tesseract.js, mammoth, xlsx