# @toolora/mcp

One-line installer for the [Toolora](https://toolora.dev) hosted MCP server.

```bash
npx @toolora/mcp
```

Auto-configures Toolora's 32+ free MCP tools in:

- **Claude Desktop** (macOS, Windows, Linux) — config file written automatically
- **Cursor** — config file written automatically
- **Codex CLI** — paste-ready TOML snippet printed (Codex uses TOML, not JSON)

After install, restart your AI client. **No account. No API key. No signup.**

If your existing client config file is malformed JSON, the installer **refuses to write** rather than risk losing your other MCP servers. Fix or move the file aside, then re-run.

## What you get

32+ stateless MCP tools, all served from a single endpoint:

- **Text analysis** — `analyze_text` (Flesch, Gunning-Fog, SMOG, Coleman-Liau in one call), `find_repetition`, `detect_jargon`, `tone_score`, `compare_versions`
- **Token counting** — `count_tokens_multi` (estimates across GPT-4o, Claude 3.5, Gemini 1.5, Llama 3, o1, and 6 more in one call)
- **Privacy & safety** — `detect_pii` (email, phone, SSN, Luhn-validated cards, OpenAI/Anthropic/GitHub/AWS/Stripe API keys, JWTs)
- **Developer utilities** — `format_json`, `hash_text` (md5/sha1/sha256/sha512), `generate_uuid`, `encode_base64`, `decode_jwt`, `generate_qr`, `test_regex`
- **And 20+ more** — case conversion, URL encoding, password generation, time conversion, and more

Browse the full catalog at [toolora.dev](https://toolora.dev).

## Commands

```bash
npx @toolora/mcp                 # install to all detected clients
npx @toolora/mcp install         # same as above
npx @toolora/mcp install claude  # install only to Claude Desktop
npx @toolora/mcp install cursor  # install only to Cursor
npx @toolora/mcp uninstall       # remove from all clients
npx @toolora/mcp uninstall cursor  # remove from one client
npx @toolora/mcp doctor          # show installation status
```

## What it does

Adds an entry to your client's MCP config that proxies to `https://toolora.dev/api/mcp` via the standard [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) bridge:

```json
{
  "mcpServers": {
    "toolora": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://toolora.dev/api/mcp"]
    }
  }
}
```

Config file locations:

- **Claude Desktop**
  - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
  - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
  - Linux: `~/.config/Claude/claude_desktop_config.json`
- **Cursor**: `~/.cursor/mcp.json`

## Codex CLI

Codex uses TOML, so the installer prints this snippet for you to paste into `~/.codex/config.toml`:

```toml
[mcp_servers.toolora]
command = "npx"
args = ["-y", "mcp-remote", "https://toolora.dev/api/mcp"]
```

## Self-hosting

Override the server URL:

```bash
TOOLORA_MCP_URL=https://your-host/api/mcp npx @toolora/mcp
```

## Privacy

All Toolora tools run **client-side in the user's browser** for the web product. The MCP server is the same code, hosted. No file contents are stored. Bot/usage analytics exclude blob payloads.

## License

MIT
