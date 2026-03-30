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
│   └── db/                 # Drizzle ORM schema + DB connection
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

### MCP Server

Exposed at `GET|POST /api/mcp` on the API server. Implements MCP Streamable HTTP transport (2025-03-26). Three free tools: `extract_pdf_text`, `count_words`, `read_url`. No auth required. Add to Claude Desktop via `mcpServers.toolora.url = https://toolora-api.replit.app/api/mcp`.

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
