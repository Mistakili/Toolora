#!/usr/bin/env node
/**
 * Hello World MCP — the smallest possible MCP server, ready to be billed
 * through the Toolora Gateway.
 *
 * Usage:
 *   PORT=8787 node server.js
 *
 * The server speaks JSON-RPC 2.0 over HTTP at POST /mcp and exposes a
 * single tool, "hello", that takes a `name` argument and returns a
 * personalised greeting.
 *
 * Deploy this anywhere with a public HTTPS URL, then in your Toolora owner
 * dashboard set:
 *
 *   Upstream MCP URL: https://<your-host>/mcp
 *   Price per call:   0.001 (USDC)
 *
 * Agents will hit gateway.toolora.dev/mcp/<your-listing-id> and Toolora
 * routes + bills + splits the payment for you.
 */

import { createServer } from "node:http";

const PORT = Number(process.env.PORT ?? 8787);

const TOOLS = [
  {
    name: "hello",
    description: "Return a friendly greeting for the given name.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "The name to greet." },
      },
      required: ["name"],
    },
  },
];

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function jsonRpcResult(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function jsonRpcError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

async function handleRpc(body) {
  const { id = null, method, params = {} } = body ?? {};
  switch (method) {
    case "tools/list":
      return jsonRpcResult(id, { tools: TOOLS });
    case "tools/call": {
      const toolName = params?.name;
      const args = params?.arguments ?? {};
      if (toolName === "hello") {
        const who = String(args.name ?? "world").slice(0, 80);
        return jsonRpcResult(id, {
          content: [{ type: "text", text: `Hello, ${who}! 👋 (served by hello-world-mcp via Toolora Gateway)` }],
        });
      }
      return jsonRpcError(id, -32601, `Unknown tool: ${toolName}`);
    }
    case "ping":
    case "initialize":
      return jsonRpcResult(id, { ok: true });
    default:
      return jsonRpcError(id, -32601, `Unknown method: ${method}`);
  }
}

const server = createServer(async (req, res) => {
  // CORS + content negotiation — keep this lax so the gateway can proxy
  // anything an agent might send.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "hello-world-mcp" }));
    return;
  }

  if (req.method === "GET" && (req.url === "/" || req.url === "/mcp")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        service: "hello-world-mcp",
        hint: "POST a JSON-RPC body to /mcp. tools/list returns the catalog; tools/call invokes a tool.",
        tools: TOOLS.map((t) => t.name),
      }),
    );
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "method_not_allowed" }));
    return;
  }

  try {
    const body = await readBody(req);
    const reply = await handleRpc(body);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(reply));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "bad_request", detail: err?.message ?? String(err) }));
  }
});

server.listen(PORT, () => {
  console.log(`hello-world-mcp listening on http://localhost:${PORT}/mcp`);
});
