# Hello World MCP — billed through Toolora Gateway

The smallest possible MCP server, ready to be monetized in **under 5 minutes**.

## What you get

- A single Node.js file (`server.js`, ~100 lines, zero dependencies)
- One JSON-RPC tool — `hello(name)` — that returns a greeting
- A working `/mcp` endpoint that any AI agent (Claude, Cursor, OpenAI, Replit Agent) can call
- Full Toolora Gateway compatibility — every call is billed in USDC, you keep 95 %

## Run it locally

```bash
cd examples/hello-world-mcp
node server.js
# → hello-world-mcp listening on http://localhost:8787/mcp
```

Test it:

```bash
curl -X POST http://localhost:8787/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

curl -X POST http://localhost:8787/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"hello","arguments":{"name":"Toolora"}}}'
```

## Deploy it (one click on Replit)

1. Click **[Run on Replit](https://replit.com/github/wesleyolis/toolora?path=examples/hello-world-mcp)** (or fork this repo).
2. Hit **Run**. The server is now live on a public `*.replit.app` URL.
3. Note your URL — it looks like `https://hello-world-mcp.<your-handle>.replit.app/mcp`.

## Bill it through Toolora Gateway

1. Submit your MCP at **[toolora.dev/submit-mcp](https://toolora.dev/submit-mcp)**.
2. Open the **Owner dashboard → Gateway billing** tab.
3. Set:
   - **Upstream MCP URL**: your `*.replit.app/mcp` URL from step 3 above
   - **Price per call**: `0.001` USDC (or whatever you want — sub-cent is supported)
   - **Payout wallet**: any Solana address you control
   - **Enabled**: ✅
4. Save. Done.

Now every call to `https://gateway.toolora.dev/mcp/<your-listing-id>` will:

- Verify the agent's x402 USDC payment
- Forward to your upstream MCP
- Split the payment 95 / 5 (you / Toolora)
- Settle on-chain the same block
- Write a ledger row you can see in your dashboard

## Why this exists

Most "build an MCP server" tutorials skip the hardest part: **how do you get
paid for it?** This example is the _shortest path_ from "I have an idea for
an MCP tool" to "an AI agent just paid me USDC for it."

Fork this, change the `hello` tool to whatever your service does, and ship.
