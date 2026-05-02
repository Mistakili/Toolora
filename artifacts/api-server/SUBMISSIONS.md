# Toolora MCP — registry submissions checklist

Live manifest: <https://toolora.dev/.well-known/mcp.json>
Transport: streamable-http
Endpoint: <https://toolora.dev/api/mcp>

## Pre-submission checklist

- [ ] `/.well-known/mcp.json` returns 200 and lists every tool exposed by `tools/list`
- [ ] `tools/list` count matches `tools/list` in the manifest
- [ ] Each tool has a multi-sentence `description` with concrete trigger phrases (Anthropic registry rejects one-liners)
- [ ] Free-tier limit (200 calls/day) is documented in both the manifest and the homepage
- [ ] OAuth/2.0 authorization metadata is reachable at `/.well-known/oauth-authorization-server`
- [ ] `agent.json` is current at `/.well-known/agent.json`
- [ ] Per-listing public proof + leaderboard endpoints return 200 with at least one demo entry

## Registries to submit to

### 1. Anthropic MCP Registry (the canonical one)

- URL: <https://github.com/modelcontextprotocol/registry>
- Submission: Open a PR adding an entry to the registry index that points at `https://toolora.dev/.well-known/mcp.json`.
- Required fields: `name`, `displayName`, `description`, `transport`, `endpoint`, `homepage`, `pricing`, `categories`, `keywords`, `tools`.
- Review SLA: typically 7–14 days. Anthropic team reviews each PR.

### 2. Smithery (smithery.ai)

- URL: <https://smithery.ai/new>
- Submission: Sign in with GitHub → "Add server" → paste the manifest URL.
- Smithery auto-discovers `tools/list` and renders per-tool documentation. Make sure tool descriptions read well in isolation.
- Pro tip: their search ranks on description quality + recent install count. Tweet the Smithery URL the day it goes live.

### 3. mcp.so

- URL: <https://mcp.so/submit>
- Submission: Form-based. Asks for transport, endpoint, repo URL, and a short description. Paste the same manifest URL.
- Indexing typically <24h.

### 4. Glama (glama.ai)

- URL: <https://glama.ai/mcp/servers/add>
- Submission: Form-based. Glama also asks for an example `tools/call` invocation per tool — keep one curl handy for each.
- Glama runs an automated probe against your endpoint after submission to validate the schema, so make sure the server is up when you submit.

### 5. mcphub.io

- URL: <https://mcphub.io/submit>
- Submission: Open a PR against the `mcphub/registry` GitHub repo. Add an entry under `/servers/toolora.json` pointing at the manifest URL.

## Quality gates each registry checks

| Check                              | Anthropic | Smithery | mcp.so | Glama | mcphub |
| ---                                | :-:       | :-:      | :-:    | :-:   | :-:    |
| Manifest reachable                 | ✓         | ✓        | ✓      | ✓     | ✓      |
| `tools/list` returns ≥1 tool       | ✓         | ✓        | ✓      | ✓     | ✓      |
| Each tool has JSON schema          | ✓         | ✓        |        | ✓     |        |
| Working `tools/call` example       | ✓         |          |        | ✓     |        |
| Open-source repo URL               | ✓         |          |        |       |        |
| OAuth metadata (if auth required)  | ✓         | ✓        |        | ✓     |        |
| Privacy policy URL                 | ✓         |          |        |       |        |

## Post-submission

- [ ] Tweet each registry listing the day it goes live (registries cross-promote what gets traction)
- [ ] Add a "find us on" row on `/mcp` and `/gateway` pages listing each registry badge
- [ ] Monitor `tools/call` 4xx rate weekly — registries down-rank servers with high error rates
- [ ] Update `/.well-known/mcp.json` whenever a tool is added/removed (registries re-crawl every 24–72h)
- [ ] When the writing-quality bundle (analyze_text, count_tokens_multi, etc.) ships, re-submit the manifest to refresh tool counts in each registry
