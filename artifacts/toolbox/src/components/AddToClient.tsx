import { useState } from "react";
import { Check, Copy, Download, Terminal } from "lucide-react";

type Client = "claude" | "cursor" | "windsurf" | "vscode" | "continue";

interface Props {
  serverName: string;
  serverUrl: string;
  configUrl?: string | null;
  packageHint?: string | null;
  slug?: string;
}

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

function trackInstall(slug: string | undefined, client: Client) {
  if (!slug) return;
  const map: Record<Client, string> = {
    claude: "install_claude",
    cursor: "install_cursor",
    windsurf: "install_other",
    vscode: "install_other",
    continue: "install_continue",
  };
  try {
    fetch(API + "/api/directory/listings/" + encodeURIComponent(slug) + "/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: map[client] }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* noop */
  }
}

const CLIENTS: { id: Client; label: string; configFile: string }[] = [
  { id: "claude", label: "Claude Desktop", configFile: "claude_desktop_config.json" },
  { id: "cursor", label: "Cursor", configFile: ".cursor/mcp.json" },
  { id: "windsurf", label: "Windsurf", configFile: "~/.codeium/windsurf/mcp_config.json" },
  { id: "vscode", label: "VS Code", configFile: ".vscode/mcp.json" },
  { id: "continue", label: "Continue", configFile: "~/.continue/config.json" },
];

function slugKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildConfig(client: Client, name: string, url: string, configUrl?: string | null): string {
  const key = slugKey(name);
  const endpoint = configUrl || url;
  // Use mcp-remote bridge for HTTP servers; fall back to npx for npm-style names.
  const isHttp = /^https?:\/\//.test(endpoint);
  const server = isHttp
    ? { command: "npx", args: ["-y", "mcp-remote", endpoint] }
    : { command: "npx", args: ["-y", endpoint.replace(/^npm:/, "")] };

  switch (client) {
    case "claude":
    case "cursor":
    case "windsurf":
      return JSON.stringify({ mcpServers: { [key]: server } }, null, 2);
    case "vscode":
      return JSON.stringify({ servers: { [key]: server } }, null, 2);
    case "continue":
      return JSON.stringify({ experimental: { modelContextProtocolServers: [{ name: key, transport: { type: "stdio", ...server } }] } }, null, 2);
  }
}

export function AddToClient({ serverName, serverUrl, configUrl, slug }: Props) {
  const [client, setClient] = useState<Client>("claude");
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const cfg = buildConfig(client, serverName, serverUrl, configUrl);
  const meta = CLIENTS.find((c) => c.id === client)!;

  const copy = async () => {
    await navigator.clipboard.writeText(cfg);
    trackInstall(slug, client);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    trackInstall(slug, client);
    const blob = new Blob([cfg], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = meta.configFile.split("/").pop() || "mcp_config.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <section id="install" className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-zinc-900/60 to-zinc-950/60 p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-violet-400" /> One-click install
        </h2>
        <div className="flex gap-1.5 flex-wrap">
          {CLIENTS.map((c) => (
            <button
              key={c.id}
              onClick={() => setClient(c.id)}
              className={
                "text-xs px-2.5 py-1 rounded-md font-medium transition border " +
                (client === c.id
                  ? "bg-violet-500/25 text-violet-100 border-violet-500/50"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200")
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <pre className="text-xs text-zinc-200 font-mono overflow-x-auto bg-zinc-950 p-4 rounded-lg border border-zinc-800 mb-4 leading-relaxed">{cfg}</pre>

      <div className="flex gap-2 flex-wrap mb-3">
        <button
          onClick={download}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-4 py-2 text-sm font-semibold shadow-lg shadow-violet-500/30 transition"
        >
          {downloaded ? <><Check className="w-4 h-4" /> Saved!</> : <><Download className="w-4 h-4" /> Download config</>}
        </button>
        <button
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 px-4 py-2 text-sm font-medium transition"
        >
          {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy JSON</>}
        </button>
      </div>

      <p className="text-xs text-zinc-500 leading-relaxed">
        Save the file to <code className="text-violet-300 bg-zinc-950 px-1.5 py-0.5 rounded">{meta.configFile}</code>,
        then restart {meta.label}. Tools appear automatically.
      </p>
    </section>
  );
}
