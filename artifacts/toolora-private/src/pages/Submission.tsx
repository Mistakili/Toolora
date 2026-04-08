import { useState } from "react";

const DEMO_URL = "https://toolora.dev/private/";
const PRIVATE_MCP_URL = "https://toolora.dev/api/private-mcp";
const PRIVATE_EXECUTE_URL = "https://toolora.dev/api/private-execute";
const MAGICBLOCK_DOCS = "https://docs.magicblock.gg/pages/private-ephemeral-rollups-pers/api-reference/per/introduction";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="ml-auto text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors shrink-0"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <span>{icon}</span>{title}
      </h2>
      {children}
    </section>
  );
}

function Code({ children, copy }: { children: string; copy?: boolean }) {
  return (
    <div className="flex items-start gap-2 font-mono text-xs bg-background border border-border rounded-lg px-3 py-2.5 text-muted-foreground leading-relaxed">
      <span className="flex-1 whitespace-pre-wrap break-all">{children}</span>
      {copy && <CopyButton text={children} />}
    </div>
  );
}

export default function Submission() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/private/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
              <span className="text-xl">🛡️</span>
              <span className="font-bold text-lg tracking-tight">Toolora</span>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/25 ml-1">PRIVATE</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/private/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Live Demo</a>
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium">
              Try It Live ↗
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            <span>⚡</span>
            <span>Colosseum Frontier Hackathon · Privacy Track · MagicBlock</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Toolora Private
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Privacy-preserving, pay-per-call online tool execution powered by MagicBlock's Private Ephemeral Rollup
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
              🔒 Live Demo
            </a>
            <a href={PRIVATE_MCP_URL} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors">
              🤖 MCP Endpoint
            </a>
            <a href={MAGICBLOCK_DOCS} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-border text-muted-foreground font-medium text-sm hover:bg-muted transition-colors">
              MagicBlock Docs ↗
            </a>
          </div>
        </div>

        {/* TL;DR */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="font-bold text-foreground mb-3 text-lg">TL;DR</h2>
          <p className="text-muted-foreground leading-relaxed">
            Toolora is a suite of 44+ browser-based privacy tools (word counter, JSON formatter, JWT decoder, etc.).
            With <span className="text-primary font-medium">Toolora Private</span>, every tool call is payment-gated via MagicBlock's Private Ephemeral Rollup.
            Users pay <span className="text-primary font-medium">0.01 USDC per execution</span> with zero identity exposure —
            no account, no logs, no on-chain link between the payer and what tool they used.
            AI agents can access all tools via a standard MCP server with payment proofs.
          </p>
        </div>

        {/* The Problem */}
        <Section title="The Problem" icon="🔍">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "📋", title: "Tools handle sensitive data", body: "JWT tokens, private JSON configs, internal documents, proprietary code — pasted into tools that log everything." },
              { icon: "🔗", title: "Payments link your identity", body: "Stripe subscriptions, Google accounts, and email signups tie your tool usage to your real identity — forever." },
              { icon: "🤖", title: "AI agents have no private payment rail", body: "AI agents calling tools can't pay anonymously per-call. They either need a subscription or expose API keys tied to an identity." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="rounded-lg border border-border bg-card p-4">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="font-semibold text-foreground text-sm mb-1">{title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{body}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* The Solution */}
        <Section title="The Solution" icon="🛡️">
          <p className="text-muted-foreground leading-relaxed">
            MagicBlock's Private Ephemeral Rollup (PER) enables USDC payments that are shielded from the base chain.
            We use PER as the payment rail for every Toolora tool call:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {[
              { step: "1", label: "Connect Phantom wallet", body: "No signup, no email, no account creation. Just connect." },
              { step: "2", label: "Deposit USDC into PER", body: "Funds enter MagicBlock's TEE-secured ephemeral rollup. From this point on, transfers are shielded." },
              { step: "3", label: "Sign a private transfer", body: "MagicBlock builds an unsigned tx, Phantom signs it. 0.01 USDC moves to Toolora's vault on the PER." },
              { step: "4", label: "Tool executes & delivers result", body: "The signed tx proves payment. Tool runs server-side — input never logged. Result returned." },
            ].map(({ step, label, body }) => (
              <div key={step} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                <div className="text-2xl font-bold text-primary/30 font-mono shrink-0">{step}</div>
                <div>
                  <div className="font-semibold text-foreground text-sm mb-1">{label}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{body}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Technical Architecture */}
        <Section title="Technical Architecture" icon="⚙️">
          <div className="space-y-3">
            {[
              {
                layer: "Frontend",
                tech: "React + Vite + @solana/web3.js",
                details: "Phantom wallet integration, MagicBlock Payments API client (deposit/transfer/withdraw/balance), client-side tool execution fallback, animated privacy flow diagram, demo mode for no-wallet access.",
              },
              {
                layer: "Payment Layer",
                tech: "MagicBlock Private Ephemeral Rollup",
                details: "POST /v1/spl/deposit → lock USDC into PER. POST /v1/spl/transfer → private USDC transfer from user → Toolora vault on PER. Signed via Phantom. Shielded from base chain observers.",
              },
              {
                layer: "Backend",
                tech: "Express + TypeScript",
                details: "POST /api/private-execute: receives tool slug + input + txSignature, verifies tx on-chain via Solana getSignatureStatuses (checks MagicBlock PER cluster then standard devnet/mainnet), executes tool, returns result. POST /api/private-mcp: full MCP JSON-RPC 2.0 server with payment verification gating.",
              },
              {
                layer: "Privacy Guarantee",
                tech: "No logs + ephemeral state",
                details: "Tool inputs are NOT logged or stored. The PER deletes ephemeral rollup state after settlement. The on-chain tx record shows USDC moved to a vault — it does NOT show which tool was called or what data was processed.",
              },
              {
                layer: "On-chain Verification",
                tech: "Solana JSON-RPC getSignatureStatuses",
                details: "Before every tool execution, the backend independently verifies the payment tx is confirmed. Checks MagicBlock PER cluster first (devnet.magicblock.app), falls back to standard devnet/mainnet RPC. Demo signatures (demo_*) skip verification for hackathon demos.",
              },
            ].map(({ layer, tech, details }) => (
              <div key={layer} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-semibold text-foreground text-sm">{layer}</span>
                  <span className="text-xs text-primary font-mono">{tech}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{details}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* MCP Integration */}
        <Section title="MCP Integration for AI Agents" icon="🤖">
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            Toolora Private exposes a standard MCP (Model Context Protocol) server. AI agents can call any of the 11 private tools
            by including a MagicBlock PER payment signature. Each call is independently verified on-chain before execution.
          </p>

          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">MCP Discovery (GET)</div>
            <Code copy>{PRIVATE_MCP_URL}</Code>

            <div className="text-xs font-medium text-muted-foreground mt-3">Initialize</div>
            <Code copy>{`POST ${PRIVATE_MCP_URL}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-03-26",
    "capabilities": { "tools": {} },
    "clientInfo": { "name": "my-agent", "version": "1.0.0" }
  }
}`}</Code>

            <div className="text-xs font-medium text-muted-foreground mt-3">Call a tool (with payment proof)</div>
            <Code copy>{`POST ${PRIVATE_MCP_URL}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "jwt_decoder",
    "arguments": {
      "input": "eyJhbGciOiJIUzI1NiJ9...",
      "txSignature": "<MagicBlock PER tx signature>",
      "payer": "<Solana public key>",
      "cluster": "devnet"
    }
  }
}`}</Code>

            <div className="text-xs font-medium text-muted-foreground mt-3">Direct REST execution</div>
            <Code copy>{`POST ${PRIVATE_EXECUTE_URL}
Content-Type: application/json

{
  "tool": "word-counter",
  "input": "confidential document text...",
  "txSignature": "<MagicBlock PER tx signature>",
  "payer": "<Solana public key>",
  "cluster": "devnet"
}`}</Code>
          </div>
        </Section>

        {/* Judging Criteria */}
        <Section title="Judging Criteria" icon="🏆">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                criteria: "Technology",
                weight: "40%",
                color: "text-violet-400 border-violet-500/20 bg-violet-500/5",
                points: [
                  "Full Solana wallet + MagicBlock PER integration",
                  "On-chain tx verification before execution",
                  "MCP JSON-RPC 2.0 server with payment gates",
                  "Devnet + mainnet cluster support",
                  "Deposit / transfer / withdraw flow",
                ],
              },
              {
                criteria: "Impact",
                weight: "30%",
                color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
                points: [
                  "Sustainable revenue model: no subscription, per-call micropayments",
                  "Privacy-first SaaS alternative for 44+ tools",
                  "AI agent payment rail via MCP + PER",
                  "Targets privacy-conscious users, enterprises, and AI pipelines",
                  "Extensible to any pay-per-use API",
                ],
              },
              {
                criteria: "Creativity / UX",
                weight: "30%",
                color: "text-sky-400 border-sky-500/20 bg-sky-500/5",
                points: [
                  "Demo mode — full flow simulation, no wallet needed",
                  "Animated privacy architecture diagram (live during payments)",
                  "11 tools with privacy-first descriptions",
                  "Solana Explorer links for real tx signatures",
                  "Mainnet / devnet cluster switcher",
                ],
              },
            ].map(({ criteria, weight, color, points }) => (
              <div key={criteria} className={`rounded-lg border p-4 ${color}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm">{criteria}</span>
                  <span className="text-xs font-mono opacity-70">{weight}</span>
                </div>
                <ul className="space-y-1.5">
                  {points.map((p) => (
                    <li key={p} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="shrink-0 mt-0.5">•</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Privacy Guarantees */}
        <Section title="Privacy Guarantees" icon="🔒">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">What</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Traditional SaaS</th>
                  <th className="text-left px-4 py-2.5 font-medium text-primary">Toolora Private + PER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Identity required", "✗ Email + credit card", "✅ Just a wallet pubkey"],
                  ["Tool inputs logged", "✗ Yes, server logs everything", "✅ Never stored server-side"],
                  ["Payment linked to usage", "✗ Stripe ties card to tool call", "✅ PER payment is untraceable"],
                  ["Account needed", "✗ Yes — login, session, cookie", "✅ No account, no session"],
                  ["Vendor lock-in", "✗ Cancel subscription to leave", "✅ Pay per call, walk away anytime"],
                  ["AI agent privacy", "✗ API key tied to org identity", "✅ Anonymous per-call payments"],
                ].map(([what, old, neu]) => (
                  <tr key={what} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-foreground">{what}</td>
                    <td className="px-4 py-2.5 text-muted-foreground/70">{old}</td>
                    <td className="px-4 py-2.5 text-emerald-400">{neu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Tools */}
        <Section title="Available Tools (11)" icon="🧰">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { icon: "📝", name: "Word Counter", cat: "Text" },
              { icon: "🔤", name: "Text Case Converter", cat: "Text" },
              { icon: "{}", name: "JSON Formatter", cat: "Developer" },
              { icon: "🔐", name: "Base64 Encoder", cat: "Developer" },
              { icon: "🎫", name: "JWT Decoder", cat: "Developer" },
              { icon: "🔗", name: "URL Encoder", cat: "Developer" },
              { icon: "🔍", name: "Regex Tester", cat: "Developer" },
              { icon: "#️⃣", name: "Hash Generator", cat: "Developer" },
              { icon: "⚙️", name: "HTML → Markdown", cat: "AI & RAG" },
              { icon: "✂️", name: "Text Chunker", cat: "AI & RAG" },
              { icon: "📊", name: "CSV → JSON", cat: "Data" },
            ].map(({ icon, name, cat }) => (
              <div key={name} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                <span className="text-base shrink-0">{icon}</span>
                <div>
                  <div className="text-xs font-medium text-foreground leading-tight">{name}</div>
                  <div className="text-[10px] text-muted-foreground/70">{cat}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Hackathon info */}
        <Section title="Submission Details" icon="📋">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: "Hackathon", value: "Colosseum Frontier Hackathon" },
              { label: "Track", value: "Privacy Track (MagicBlock)" },
              { label: "Prize", value: "$5,000" },
              { label: "Winners announced", value: "May 27, 2026" },
              { label: "Live demo", value: DEMO_URL },
              { label: "MCP endpoint", value: PRIVATE_MCP_URL },
              { label: "REST endpoint", value: PRIVATE_EXECUTE_URL },
              { label: "Network", value: "Devnet (mainnet-ready)" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-2 rounded-lg border border-border bg-card px-4 py-2.5">
                <span className="text-muted-foreground text-xs shrink-0">{label}</span>
                <span className="text-foreground text-xs font-medium text-right break-all">{value}</span>
              </div>
            ))}
          </div>
        </Section>

        <footer className="text-center py-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">toolora.dev/private</a>
            {" "}·{" "}Built for the Colosseum Privacy Track Hackathon{" "}·{" "}Powered by{" "}
            <a href="https://magicblock.gg" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">MagicBlock</a>
          </p>
        </footer>
      </main>
    </div>
  );
}
