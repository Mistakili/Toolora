# Toolora — Distribution Playbook

The product is shipped. The bottleneck is now *who knows it exists*. This file
is the playbook for the next 14 days.

---

## 0. The "one-liner" that changed everything

After this sprint, anyone can install the entire Toolora MCP surface in one
command:

```bash
npx @toolora/mcp
```

It auto-configures Claude Desktop, Cursor, and (with a printed snippet)
Codex CLI. This is the single most important distribution lever — every post,
email, and registry submission below should lead with it.

> **Action required before shipping any of the below**: publish the
> `@toolora/mcp` package to npm. The code lives in `lib/cli/`. From a logged-in
> npm session: `cd lib/cli && npm publish --access public` (you may need to
> claim the `@toolora` org first via `npm org create toolora`).

---

## 1. pay.sh partnership outreach

**Why**: Solana Foundation just shipped `pay.sh` (the Solana-native sibling of
Coinbase's x402). They are infra; we are a marketplace. A genuine integration
makes us "chain-neutral" and them "marketplace-distributed" — both win.

**Channel**: Find the maintainer on the pay.sh GitHub or via the Solana
Foundation contact form. Twitter/X DM works too.

**Email (paste-ready)**:

```
Subject: Toolora × pay.sh — marketplace integration?

Hi [name],

Saw pay.sh hit 1.5k stars — congrats. The Solana-native angle is the right
play; x402 has been Base-only for too long.

I'm building Toolora — an MCP marketplace for AI agents. Publishers list
APIs through /publish, agents discover and pay for them in stablecoins, we
take 5%. Currently settling on Base via x402; ~32 free tools live and
indexed in Anthropic's MCP registry submission queue.

Two questions:

1. Would you be open to Toolora marketplace listings being settled in
   Solana USDC via pay.sh? You'd get marketplace-side distribution from us;
   we'd get chain neutrality and the Solana Foundation halo.

2. If you're open in principle, what does an integration look like from your
   side? I'd ship the Solana payment verifier into our gateway and route
   listing-tagged calls through pay.sh.

Happy to jump on a 20-min call this week or next. Marketplace + rail beats
either alone.

— [your name]
toolora.dev · github.com/[handle]
```

**If they say no**: ship the Solana adapter anyway. We're chain-neutral with
or without their blessing.

---

## 2. MCP registry submissions

The manifest at `https://toolora.dev/.well-known/mcp.json` is registry-ready.
Source-of-truth checklist is in `artifacts/api-server/SUBMISSIONS.md`.

| Registry | URL | Submission type | Time |
|---|---|---|---|
| **Smithery** | smithery.ai | Form + GitHub repo link | ~10 min |
| **mcp.so** | mcp.so | PR to their repo | ~15 min |
| **Glama** | glama.ai/mcp | Form + manifest URL | ~10 min |
| **Anthropic MCP Registry** | github.com/modelcontextprotocol/registry | PR with structured index entry | ~20 min |
| **mcphub** | mcphub.io | Form | ~5 min |

**Do all five in one sitting.** Total time: ~60 min. Each one adds a
discovery surface that compounds over months.

Lead every submission with: *"Install with `npx @toolora/mcp` — auto-configures
Claude/Cursor in one command."*

---

## 3. Reddit launch posts

### r/LocalLLaMA — primary target

**Title**: I built an MCP server with 32 free tools — installs in Claude/Cursor with one command

**Body**:

```
Hey r/LocalLLaMA,

Spent the last few months building Toolora — a hosted MCP server with 32
stateless tools designed for the agent loop. Released a one-line installer
today and figured this is the right room to share it.

Install:

    npx @toolora/mcp

Auto-configures Claude Desktop, Cursor, and prints a Codex CLI snippet.
Restart your client and the tools show up. No account. No API key. No signup.

What's in it:

- analyze_text — Flesch + Gunning-Fog + SMOG + Coleman-Liau in one call
- count_tokens_multi — estimates across 11 models in one call
  (GPT-4o, Claude 3.5, Gemini 1.5, Llama 3, o1, etc.)
- detect_pii — emails, phones, SSNs, Luhn-validated cards,
  OpenAI/Anthropic/GitHub/AWS/Stripe keys, JWTs
- find_repetition, detect_jargon, tone_score, compare_versions
- The usual: format_json, hash_text, generate_uuid, generate_qr,
  test_regex, decode_jwt, encode_base64, etc.

All stateless, all client-side hashing, no payloads stored. Privacy was the
design constraint from day one.

Source for the writing-quality bundle is open:
[link to specific file in repo]

Manifest at toolora.dev/.well-known/mcp.json if you want to wire it up
manually.

Feedback welcome — especially on tools you wish existed. The roadmap is
demand-driven.
```

### r/ClaudeAI — secondary

Title: **One-line MCP install for Claude Desktop — 32 free tools, no setup**

Shorter version of the above, lead with the install command, screenshot of
Claude Desktop with Toolora tools loaded.

### r/cursor — tertiary

Same shape as r/ClaudeAI but lead with `npx @toolora/mcp install cursor`.

---

## 4. Hacker News — Show HN

**Wait for momentum** — post after Reddit has 50+ upvotes and you have at
least one screenshot of an external user successfully installing.

**Title**: `Show HN: Toolora – One-line install for 32 free MCP tools (Claude, Cursor, Codex)`

**Text**:

```
Toolora is a hosted MCP server with 32 stateless tools — text analysis,
multi-model token counting, PII detection, JSON/regex/hash/QR utilities, etc.
All client-side processing, no accounts, no API keys.

The one-line install was the missing piece — most MCP onboarding requires
hand-editing JSON config files. This installer (`npx @toolora/mcp`) writes
the right config for Claude Desktop and Cursor automatically.

The bigger bet behind it: Toolora is becoming a marketplace for paid MCP
tools. Publishers list APIs via /publish, agents pay per-call in USDC via
x402 (95% to publisher, 5% to us). Currently Base-only; Solana via pay.sh
on the roadmap.

The free tools are the on-ramp. The marketplace is the business.

Source for the writing-quality tool bundle (representative of how the rest
is built): [link]

Would love feedback on:
- Tool ideas the agent loop is missing
- The marketplace pricing model (5% feel right?)
- Whether anyone has shipped a real production agent that pays for API
  calls programmatically — would love to compare notes
```

---

## 5. X / Twitter thread

**Tweet 1** (with screenshot of Claude Desktop showing Toolora tools loaded):

> 32 free MCP tools. One command. No signup.
>
> npx @toolora/mcp
>
> Auto-configures Claude Desktop, Cursor, Codex CLI. Restart your client and
> the tools show up.

**Tweet 2**:

> What's in the box:
>
> • analyze_text — Flesch + Gunning-Fog + SMOG + Coleman-Liau in one call
> • count_tokens_multi — 11-model estimates in one call
> • detect_pii — emails, phones, SSNs, Luhn cards, 6 API key formats, JWTs
> • find_repetition, tone_score, detect_jargon, compare_versions
> • + 20 more (json, hash, qr, regex, base64, jwt…)

**Tweet 3**:

> Why it exists: most MCP onboarding is hand-editing JSON. Most "agent
> tools" are wrapped REST APIs that need keys. We wanted the opposite —
> stateless, free, privacy-first, one-line install.

**Tweet 4** (the marketplace tease):

> The free tools are the on-ramp.
>
> Toolora is also a marketplace — publishers list paid APIs at /publish,
> agents pay per-call in USDC via x402 (95/5 split). Settling on Base now,
> Solana via pay.sh next.
>
> Marketplace > rail.

**Tag**: @AnthropicAI, @cursor_ai, the MCP community accounts.

---

## 6. Cold DMs — the highest-leverage channel

The 50 people most likely to publish through `/publish`:

- Indie API builders on X (search "shipped my API" / "launched API" past 30 days)
- Hugging Face Spaces owners with public APIs
- RapidAPI top 100 publishers (browse their gallery)
- Replit's own "Bounty" winners with deployed API artifacts

**Template**:

```
Hey — saw your [API name]. Genuine question: would you publish it on Toolora
if it took you 60 seconds and you got paid in USDC per call (you keep 95%,
we take 5%)?

We're a privacy-first MCP marketplace. Agents discover paid APIs through us,
pay you per-call. No contracts, no Stripe setup, no account needed for
testing.

Try it: paste your OpenAPI spec at toolora.dev/publish.

Worth a swing?

— [your name]
```

50 DMs → realistic 5-10 replies → 1-3 actually try it. **One real publisher
is the entire YC W26 application.**

---

## 7. The 14-day calendar

| Day | Action |
|---|---|
| 1 | Publish `@toolora/mcp` to npm. Verify install works on a clean machine. |
| 1 | Submit to all 5 MCP registries. |
| 2 | Resubmit sitemap.xml in Google Search Console (separate sprint). |
| 2 | Email pay.sh maintainer. |
| 3 | Post to r/LocalLLaMA. |
| 4 | Post to r/ClaudeAI + r/cursor. |
| 5-7 | Send 50 cold DMs to potential `/publish` users. |
| 8 | If r/LocalLLaMA hit 50+ upvotes, post Show HN. |
| 9-14 | Reply to every comment, every DM, every registry follow-up. |

---

## 8. The one metric that matters

Open `/admin` daily. Track exactly two numbers:

1. **`/publish` page views** (top funnel — are we getting attention?)
2. **External gateway settlements** (bottom funnel — is anyone paying?)

If #1 climbs but #2 doesn't → form/UX problem on `/publish`.
If neither moves → distribution problem upstream (more posts, more DMs).
If both move → start the YC W26 application.

Everything else is noise.
