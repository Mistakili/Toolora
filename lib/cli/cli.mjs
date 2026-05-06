#!/usr/bin/env node
// @toolora/mcp — one-line installer for the Toolora hosted MCP server.
//
// Reads/writes the standard MCP client config files (Claude Desktop, Cursor)
// and inserts a `toolora` server entry that proxies to the Toolora HTTP MCP
// endpoint via `mcp-remote` (the canonical stdio↔HTTP bridge most clients
// already auto-install). No accounts, no API keys, no signup.
//
// Inspired by pay.sh's `npx @solana/pay` but for the entire 32-tool MCP
// surface and registered into multiple clients in one shot.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join, dirname } from "node:path";
import { argv, exit, env } from "node:process";

const TOOLORA_URL = env.TOOLORA_MCP_URL ?? "https://toolora.dev/api/mcp";
const SERVER_NAME = "toolora";
const VERSION = "0.1.0";

// ─── Client registry ─────────────────────────────────────────────────────────
//
// Both Claude Desktop and Cursor accept the same `mcpServers` JSON shape.
// Codex CLI uses TOML and a slightly different layout, so we print manual
// instructions for it instead of mutating its config silently.

function claudeConfigPath() {
  const home = homedir();
  switch (platform()) {
    case "darwin":
      return join(home, "Library", "Application Support", "Claude", "claude_desktop_config.json");
    case "win32":
      return join(env.APPDATA ?? home, "Claude", "claude_desktop_config.json");
    default:
      return join(home, ".config", "Claude", "claude_desktop_config.json");
  }
}

function cursorConfigPath() {
  return join(homedir(), ".cursor", "mcp.json");
}

const CLIENTS = {
  claude: { label: "Claude Desktop", path: claudeConfigPath() },
  cursor: { label: "Cursor", path: cursorConfigPath() },
};

// ─── JSON helpers ────────────────────────────────────────────────────────────

// Sentinel returned by readJson when an existing file is unparseable JSON.
// Surfaced as a hard error to the install/uninstall caller — we MUST NOT
// silently overwrite a malformed config and lose the user's other servers.
const PARSE_ERROR = Symbol("config-parse-error");

function readJson(path) {
  if (!existsSync(path)) return {};
  const raw = readFileSync(path, "utf8");
  if (raw.trim() === "") return {};
  try {
    return JSON.parse(raw);
  } catch {
    return PARSE_ERROR;
  }
}

function backupPath(path) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${path}.toolora-backup-${stamp}`;
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function serverEntry() {
  return {
    command: "npx",
    args: ["-y", "mcp-remote", TOOLORA_URL],
  };
}

// ─── Actions ─────────────────────────────────────────────────────────────────

function installToClient(key) {
  const client = CLIENTS[key];
  if (!client) return { ok: false, reason: `unknown client "${key}"` };
  const cfg = readJson(client.path);
  if (cfg === PARSE_ERROR) {
    // Refuse to write — overwriting would destroy the user's other MCP
    // servers. Tell them exactly how to recover.
    return {
      ok: false,
      reason: `existing config is not valid JSON. Refusing to overwrite. Inspect ${client.path} or move it aside, then re-run.`,
    };
  }
  cfg.mcpServers = cfg.mcpServers ?? {};
  const existed = Boolean(cfg.mcpServers[SERVER_NAME]);
  cfg.mcpServers[SERVER_NAME] = serverEntry();
  writeJson(client.path, cfg);
  return { ok: true, existed, path: client.path };
}

function uninstallFromClient(key) {
  const client = CLIENTS[key];
  if (!client) return { ok: false, reason: `unknown client "${key}"` };
  if (!existsSync(client.path)) return { ok: false, reason: "no config file" };
  const cfg = readJson(client.path);
  if (cfg === PARSE_ERROR) {
    return {
      ok: false,
      reason: `existing config is not valid JSON. Refusing to modify. Inspect ${client.path}.`,
    };
  }
  if (!cfg.mcpServers?.[SERVER_NAME]) return { ok: false, reason: "not installed" };
  delete cfg.mcpServers[SERVER_NAME];
  writeJson(client.path, cfg);
  return { ok: true, path: client.path };
}

function doctor() {
  console.log(`Toolora MCP installer v${VERSION}`);
  console.log(`Server URL: ${TOOLORA_URL}\n`);
  for (const [, client] of Object.entries(CLIENTS)) {
    const exists = existsSync(client.path);
    const cfg = readJson(client.path);
    let status;
    if (cfg === PARSE_ERROR) {
      status = "⚠️  config exists but is not valid JSON";
    } else if (cfg.mcpServers?.[SERVER_NAME]) {
      status = "✅ installed";
    } else if (exists) {
      status = "○  not installed (config exists)";
    } else {
      status = "—  no config file yet";
    }
    console.log(`  ${client.label.padEnd(16)} ${status}`);
    console.log(`  ${" ".repeat(18)}${client.path}\n`);
  }
}

function printCodexSnippet() {
  console.log("");
  console.log("Codex CLI users — the installer cannot edit TOML for you.");
  console.log("Paste this into ~/.codex/config.toml manually:");
  console.log("");
  console.log("  [mcp_servers.toolora]");
  console.log("  command = \"npx\"");
  console.log(`  args = ["-y", "mcp-remote", "${TOOLORA_URL}"]`);
}

function help() {
  console.log(`@toolora/mcp v${VERSION} — install the Toolora hosted MCP server.

Usage
  npx @toolora/mcp                 install to Claude Desktop and Cursor
  npx @toolora/mcp install         same as above
  npx @toolora/mcp install claude  install only to Claude Desktop
  npx @toolora/mcp install cursor  install only to Cursor
  npx @toolora/mcp uninstall       remove from Claude Desktop and Cursor
  npx @toolora/mcp uninstall cursor  remove from a single client
  npx @toolora/mcp doctor          show installation status
  npx @toolora/mcp --help          this message

Note: Claude Desktop and Cursor configs are written automatically. Codex CLI
uses TOML and is not auto-edited — a paste-ready snippet is printed instead.

What you get
  32+ free MCP tools — text analysis, JSON formatting, hashing, QR codes,
  regex testing, jargon detection, PII scanning, multi-model token counting,
  and more. No account, no API key, no signup.

Server URL: ${TOOLORA_URL}
Override:   TOOLORA_MCP_URL=<url> npx @toolora/mcp

After install, restart your AI client.

Codex CLI users — add this to ~/.codex/config.toml manually:

  [mcp_servers.toolora]
  command = "npx"
  args = ["-y", "mcp-remote", "${TOOLORA_URL}"]

Learn more: https://toolora.dev`);
}

// ─── Entry ───────────────────────────────────────────────────────────────────

function main() {
  if (argv.includes("--help") || argv.includes("-h")) {
    help();
    return;
  }
  if (argv.includes("--version") || argv.includes("-v")) {
    console.log(VERSION);
    return;
  }

  const positional = argv.slice(2).filter((a) => !a.startsWith("-"));
  const cmd = positional[0] ?? "install";
  const target = positional[1];

  if (cmd === "help") {
    help();
    return;
  }
  if (cmd === "doctor") {
    doctor();
    return;
  }

  const targets = target ? [target] : Object.keys(CLIENTS);

  if (cmd === "install") {
    console.log(`@toolora/mcp v${VERSION}`);
    console.log(`Installing Toolora MCP → ${TOOLORA_URL}\n`);
    let any = false;
    for (const key of targets) {
      const result = installToClient(key);
      const label = CLIENTS[key]?.label ?? key;
      if (result.ok) {
        any = true;
        console.log(`  ✅ ${label} — ${result.existed ? "updated" : "installed"}`);
        console.log(`     ${result.path}`);
      } else {
        console.log(`  ⚠️  ${label} — ${result.reason}`);
      }
    }
    console.log("");
    if (any) {
      console.log("Done. Restart your AI client to load the Toolora server.");
      console.log("Verify any time with:  npx @toolora/mcp doctor");
      // Codex uses TOML — we can't auto-edit it, so always print the snippet
      // after a successful install. Keeps the docs honest about what the
      // installer actually does for each client.
      printCodexSnippet();
    } else {
      console.log("Nothing was installed. Run `npx @toolora/mcp doctor` for details.");
      exit(1);
    }
    return;
  }

  if (cmd === "uninstall") {
    let any = false;
    for (const key of targets) {
      const result = uninstallFromClient(key);
      const label = CLIENTS[key]?.label ?? key;
      if (result.ok) {
        any = true;
        console.log(`  ✅ removed from ${label}`);
      } else {
        console.log(`  ○  ${label} — ${result.reason}`);
      }
    }
    if (!any) exit(1);
    return;
  }

  console.error(`Unknown command: ${cmd}\n`);
  help();
  exit(2);
}

main();
