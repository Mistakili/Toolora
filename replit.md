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

Accessible at `GET|POST /api/mcp`, this service implements the MCP Streamable HTTP transport, offering 25 tools with free and optional paid tiers. It supports tool discoverability with detailed metadata, features in-memory rate-limiting, and ensures privacy by hashing client IDs and stripping referrers.

## Monetization System

Manages API keys, subscription tiers (Free, Pro, Team), and one-time API credit packs.
-   **Database**: Uses `toolora_users`, `api_keys`, `api_usage` tables.
-   **Stripe Integration**: Utilizes Replit connector v2 for checkout, customer portal, subscription management, and webhook processing.
-   **API Key Middleware**: Enforces SHA-256 hashed API keys, tier-based rate limiting, monthly usage tracking, and credit deduction.
-   **x402 Payments**: Supports per-call payments via Stellar XLM and Solana USDC.

## AI Brochure Generation

A service at **POST `/api/brochure/generate`** uses AI to create print-ready HTML brochures from user-provided HTML and optional images. It integrates with Replit AI via OpenAI APIs, offering a free tier based on session tokens, with further usage requiring a `pro_required` status.

# External Dependencies

-   **Database**: PostgreSQL
-   **Payment Processing**: Stripe, Solana, Stellar
-   **AI Integration**: OpenAI
-   **Authentication**: Replit Auth
-   **Frontend Libraries**: qrcode, crypto-js, marked, react-dropzone, uuid, date-fns, pdf-lib, framer-motion, tesseract.js, mammoth, xlsx