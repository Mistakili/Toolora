# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   └── n8n-nodes-toolora/  # n8n community node (publishable npm package)
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Artifacts

### MCP Sprint — May 2 Replit Agent Surge

**4-day sprint Apr 28–May 1, 2026** to harden Toolora MCP for the May 2 Replit Agent free-day spike.

**Day 1 (Apr 28) — DONE**:
- Added 5 nullable telemetry columns to `mcp_calls` (`user_agent`, `client_id`, `client_name`, `client_version`, `referrer`) + 2 indexes (`created_at`, `client_name`). Wired into all 4 insert sites in `mcp.ts`.
- New `getMcpTelemetry(req, params)` helper segments callers by MCP `clientInfo.name` (spec) with UA-string fallback (Replit Agent, Claude, Cursor, Cline, Smithery, MCP Inspector, Python, Node, curl, Postman).
- **Privacy hardening**: client IDs are SHA-256 hashed with a per-process random salt (raw IP/session never stored). Referrers stripped to origin+path (drops query/fragment that may carry tokens). UA truncated to 200 chars.
- **Surge resilience**: in-memory rate-limit map bounded to 50K entries with LRU eviction.
- **Discoverability**: `initialize` response now carries directory metadata (description, homepage, docs, categories, pricing, privacy) under spec-compliant `_meta` field. `serverInfo` kept spec-clean for strict clients. `instructions` rewritten to lead with "privacy-first, free, no API key, files never stored". Brand-pitch suffixes added to descriptions of 5 strategic tools (`extract_pdf_text`, `ocr_image`, `transcribe_audio`, `read_url`, `scrape_url_js`, `extract_structured_data`) to win agent ranking against paid alternatives.

**Day 2 (Apr 29) — DONE (code/docs)**:
- Upgraded `/.well-known/mcp.json` from a stale 12-tool listing to a comprehensive manifest: 25 tools with categories, 9 server-level categories, freemium pricing block, privacy attestation, install configs for Claude Desktop / Cursor / Cline / Replit Agent, repository URL, and longDescription positioning Toolora as a free replacement for Firecrawl / Mistral OCR / Whisper API / Adobe PDF Services. CORS open, 5-min cache.
- Rewrote `artifacts/toolbox/public/smithery.yaml` from 7 stale tools to all 25 with grouped categories, brand-pitch tagline, pricing, full keyword set.
- Created `docs/toolora-day2-submissions.md` (12 ready-to-paste directory submission packets: Smithery, mcpservers.org, Glama, wong2/punkpeye/appcypher, official, mcp.so, mcphub, cline marketplace, n8n, Apify, Replit Template) and `docs/toolora-yc-strategy.md` (W26 application timeline, narrative, Q&A prep).
- Architect-flagged corrections: removed unresolvable `$schema` URL, removed invented `replit-agent.autoDiscover` flag (replaced with explicit UI instructions), aligned tool counts everywhere to "25 free + 2 optional paid", softened privacy claims to match the 30-day anonymous telemetry retention, and softened YC narrative superlatives ("most-installed", "0 downtime", "entirely organic") to verifiable phrasing.
- **User-side action remaining**: execute the 12 PRs/emails in `docs/toolora-day2-submissions.md` (cannot be done from this environment).

Day 3: `/replit` landing + Replit Template.
Day 4: Twitter thread + DM 5 builders + live KPI dashboard surfacing the new `client_name` segmentation.

### MCP Server

Exposed at `GET|POST /api/mcp` on the API server. Implements MCP Streamable HTTP transport (2025-03-26). 12 tools: `extract_pdf_text`, `merge_pdfs`, `generate_qr_code`, `csv_to_json`, `json_to_csv`, `ocr_image`, `extract_docx_text`, `excel_to_json`, `transcribe_audio`, `scrape_url_js`, `count_words`, `read_url`. No auth required.

**MCP Promotion Page**: `/mcp` — dedicated page with Quick Start tabs for Claude Desktop/Cursor/Cline (copy-paste JSON configs), list of all 12 tools, Python/Node.js direct API usage examples, FAQ, and CTA. Listed in footer and mobile nav.

### Monetization

**API Key + Subscription system:**
- DB tables: `toolora_users`, `api_keys`, `api_usage` (created via raw SQL + Drizzle schema in `lib/db/src/schema/`)
- Tiers: Free (50 calls/mo), Pro ($19/mo — 5,000 calls), Team ($79/mo — 50,000 calls)
- Stripe products seeded in sandbox: `prod_UF0D1YUfACNb5a` (Pro, `price_1TGWCfDcOSNqIPi8ziL5zLJH`) and `prod_UF0Drk7Q7z1eEC` (Team, `price_1TGWCgDcOSNqIPi8KrXcEcCf`)
- Stripe integration: Replit connector v2 via `getUncachableStripeClient()` in `stripeClient.ts`
- Routes: `GET /api/stripe/plans`, `POST /api/stripe/checkout`, `POST /api/stripe/portal`, `GET /api/stripe/subscription`
- **API Credits (one-time)**: `GET /api/stripe/credits/packs`, `POST /api/stripe/credits/checkout`, `GET /api/stripe/credits/balance`
  - Credit packs: Starter ($5/500 calls), Growth ($20/2500 calls), Scale ($50/10000 calls)
  - Credits stored in `tooloraUsers.creditsBalance` (integer, never expire)
  - Webhook (`checkout.session.completed` with `mode=payment`) atomically adds credits to user
  - API middleware auto-deducts 1 credit when monthly limit hit; responds with `X-Toolora-Credits-Remaining` header
- Webhook: `POST /api/stripe/webhook` (registered BEFORE `express.json()` to preserve raw body for signature verification)
  - Handles both subscription sync (via `getStripeSync()`) AND credit purchase events
- API key middleware: `middlewares/apiKey.ts` — SHA-256 hashing, tier-based rate limiting, monthly usage tracking, credit fallback
- API key CRUD: `GET/POST /api/keys`, `DELETE /api/keys/:id`
- Frontend: `/pricing` page (three-tier, upgrade CTAs, credit packs section with `#credits` anchor, manage subscription link), `/api-keys` page (create/revoke keys, usage bar)
- Seed script: `scripts/src/seed-products.ts`

**x402 per-call payments (existing):**
- Stellar XLM + Solana USDC via `requirePayment` middleware
- Additive: API key middleware (`requireApiKey`) is alternative auth path

### AI Brochure (GPT-4o)

**POST `/api/brochure/generate`** — AI-powered brochure generation from document HTML.
- Request: `{ html: string, images?: string[] (data URIs, max 4), fileName?: string, sessionToken?: string }`
- Response: `{ html: string }` — complete print-ready HTML document
- Free tier: first 2 unique session tokens globally; after that, 402 `pro_required`
- Same session token used twice: 402 `free_used`
- DB table: `brochure_generations` (schema: `lib/db/src/schema/brochureGenerations.ts`)
- Uses `AI_INTEGRATIONS_OPENAI_BASE_URL` / `AI_INTEGRATIONS_OPENAI_API_KEY` (Replit AI integration)
- Frontend: `DocxEditor.tsx` — "✦ AI Brochure" gradient button calls endpoint; strips images from HTML, sends them separately; replaces `__IMG_N__` placeholders in response; opens print dialog

### SEO

- `artifacts/toolbox/public/sitemap.xml` — full sitemap for all 20 tools + category/static pages
- `artifacts/toolbox/public/robots.txt` — allows all bots, points to sitemap
- `artifacts/toolbox/index.html` — includes default OG + Twitter Card + canonical meta tags
- `artifacts/toolbox/src/hooks/useSEO.ts` — React hook that sets per-page title, description, OG tags, Twitter cards, canonical URL, and JSON-LD structured data
- `ToolView.tsx` uses `useSEO` with tool-specific `seoTitle`/`seoDescription` from tools-config and injects `WebApplication` JSON-LD schema

### `artifacts/toolbox` (`@workspace/toolbox`)

React + Vite frontend for **Toolora** — a free online tools platform with 20 fully functional tools.

- **URL**: served at `/` (root preview path)
- **Dark mode first**, responsive design
- **All processing is 100% client-side (privacy-first)**
- **Tool categories**: Text, Developer, Productivity, Image, PDF
- **Fully built tools (20)**:
  - Text: Word Counter, Case Converter, Markdown Preview, Lorem Ipsum, Text Diff
  - Developer: JSON Formatter, Base64 Encoder/Decoder, URL Encoder/Decoder, Hash Generator, UUID Generator
  - Productivity: QR Code Generator, Password Generator, Unit Converter, Color Converter, Timestamp Converter
  - Image: Image Resizer, Image Compressor, Image Converter (JPG/PNG/WebP)
  - PDF: PDF Merge, PDF Split
- **Usage tracking**: fires POST `/api/tools/{slug}/use` on every tool visit
- **"100x" features**:
  - **Embed/Share**: `ShareModal.tsx` — direct URL tab + iframe embed code tab; Share button on all tool pages
  - **Auth**: Replit Auth (OIDC) via `@workspace/replit-auth-web`; Sign In button / user avatar + dropdown in navbar
  - **History**: `/history` page shows recent tool usage per user (stored in `toolHistoryTable`)
  - **Tool Chaining**: `ChainToolButton` + `useChainedInput` hook; Word Counter + JSON Formatter have chain button; target tool receives output via `?input=` URL param
  - **Browser Extension**: Manifest V3 Chrome extension lives in `artifacts/extension/`; install page at `/extension`
  - **API Docs**: `/api-docs` page documents all public endpoints; no key required
- **Key files**:
  - `src/lib/tools-config.ts` — TOOLS array (must match ToolView dispatcher)
  - `src/pages/ToolView.tsx` — TOOL_COMPONENTS map + renders tool pages
  - `src/components/tools/` — individual tool components
  - `src/components/shared/ChainToolButton.tsx` — chain tool button
  - `src/components/shared/ShareModal.tsx` — share/embed modal
  - `src/hooks/useChainedInput.ts` — reads `?input=` URL param on mount
- **Key packages**: qrcode, crypto-js, marked, react-dropzone, uuid, date-fns, pdf-lib, framer-motion
- **Monetization pages**: `/pricing` (3-tier: Free/Pro/Team, Stripe checkout), `/api-keys` (create/revoke keys, usage bar)
- **Agent API tools (Pro+)**: OCR via tesseract.js, DOCX via mammoth, Excel via xlsx — all in `routes/agent.ts` and MCP
- **SEO content architecture (~501 indexable pages)**:
  - 36 tools (including `og-preview` in developer category)
  - 36 how-to guides at `/how-to/:slug` with FAQ+HowTo JSON-LD schema (`ToolHowToPage.tsx`, `tool-how-to.ts`)
  - 106 blog posts at `/blog/:slug` (`blog-posts.ts`)
  - 283 glossary entries at `/glossary/:slug` (`glossary.ts`, `GlossaryPage.tsx`)
  - 20 comparison/alternative pages at `/compare/:slug` (`comparisons.ts`, `ComparisonPage.tsx`)
  - **Cross-linking system** (`cross-links.ts`): maps tool→comparisons, tool→glossary terms, comparison→how-tos; auto-renders "Key Concepts", "See How We Compare", and "Step-by-Step Guides" sections on every page

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
