# Solana Support — Scope

> **TL;DR**: Solana support is **~70% built**. The remaining work is one weekend, not 1-2 weeks. The blocker is **operational** (a funded wallet + a couple of secrets), not engineering.

---

## What already exists in the codebase

I was wrong when I said this was a multi-week project. Going through the code, here's what's already shipped and working:

| Component | Status | File |
|---|---|---|
| Solana Pay strict verifier | ✅ shipped | `artifacts/api-server/src/lib/solanaPayVerify.ts` (138 lines) |
| x402 middleware advertises Solana USDC | ✅ shipped | `artifacts/api-server/src/middlewares/x402.ts` (lines 71-86) |
| Multi-RPC fallback (magicblock + official) | ✅ shipped | `solanaPayVerify.ts` ENDPOINTS map |
| Reference-pubkey + memo verification | ✅ shipped | Solana Pay convention, with memo fallback |
| Replay protection (used-tx-hash cache) | ✅ shipped | `x402.ts` `pruneExpiredHashes` |
| `usdcSplitter` 95/5 abstraction | ✅ shipped | `lib/usdcSplitter.ts` |
| Stub payout mode (dev) | ✅ shipped | `usdcSplitter.ts` lines 36-58 |
| Gateway listing `payoutNetwork` field | ✅ shipped | `routes/gateway.ts` line 439 (defaults to `solana`) |
| Self-serve checkout with USDC | ✅ shipped | `routes/checkout.ts` |
| USDC mainnet + devnet mint addresses | ✅ shipped | `middlewares/x402.ts` |
| Vault address env var | ✅ shipped | `SOLANA_VAULT_ADDRESS` |
| Per-listing `payoutTxHash` recording | ✅ shipped | `gateway.ts` line 360 |

**The plumbing is there. The pipes just aren't connected to the pump.**

---

## What's actually missing

Three things, in order of difficulty.

### 1. `usdcSplitter.ts` broadcast mode (engineering — ~4 hours)

Currently `splitUsdc()` returns a synthetic `stub_payout_…` tx hash and logs the intended split. The `// TODO when TOOLORA_PLATFORM_WALLET is funded` block in lines 60-72 already documents exactly what needs to happen:

```
1. pnpm --filter @workspace/api-server add @solana/web3.js @solana/spl-token
2. Load TOOLORA_PLATFORM_WALLET_SECRET (base58 secret key) from env
3. Build SPL-USDC TransferChecked: platform ATA → owner ATA, amount=ownerShare,
   memo=payment_tx_hash
4. Sign + sendTransaction (commitment=processed for fast return)
5. Return { ok: true, payoutTxHash: signature, status: "settled" }
6. On throw → { ok: false, status: "failed", errorReason: e.message }
```

That's a real implementation plan, already written by past-you. About 50-80 lines of code in one function. The hardest part is the ATA-derivation dance, which `@solana/spl-token` does for you.

**Risk**: low. The verifier already handles failure modes; the splitter just needs to translate intent → broadcast.

### 2. `gatewayRefunds.ts` broadcast mode (engineering — ~2 hours)

Same shape as the splitter. Currently stubs the refund. When the platform wallet is funded, the same `@solana/web3.js` flow applies but in reverse: vault → caller. The TODO is at line 174.

### 3. Operational setup (no code — ~30 minutes, but blocking)

| Action | Owner | Notes |
|---|---|---|
| Generate Solana keypair for `TOOLORA_PLATFORM_WALLET` | you | `solana-keygen new` (CLI, off-Replit) |
| Fund it with USDC + a small SOL float for fees | you | Start with $20 USDC + 0.05 SOL on mainnet |
| Add `TOOLORA_PLATFORM_WALLET_SECRET` to Replit secrets | you (via env-secrets skill) | base58 secret key |
| Add `SOLANA_VAULT_ADDRESS` (already defaults but should be explicit prod value) | you | pubkey of the vault that receives caller payments |
| Set `GATEWAY_PAYOUT_MODE=broadcast` | you | flips the splitter from stub → real |
| Optional: set `SOLANA_RPC_URL` to a paid Helius/Triton endpoint | you | mainnet-beta is rate-limited; $20/mo tier is fine to start |

**This is the actual blocker.** The code is ready; the wallet isn't.

---

## The pay.sh angle — separate question

Pay.sh is a **hosted intent broker** — Solana Foundation runs the URL, signs the intent, and handles the wallet UX. Your existing `solanaPayVerify.ts` is a **direct on-chain verifier** — caller pays directly to the vault, you verify the tx landed.

These are **complementary, not competing**:

- **Direct Solana** (what you have): caller's agent signs and sends, you verify. Lower fees, more control, no third-party dependency.
- **Pay.sh integration**: caller's agent calls `pay.sh` to mediate the payment, pay.sh handles wallet UX and returns a verified receipt. Easier UX for callers who don't want to manage a Solana wallet.

You can ship direct Solana **first** (the existing code path) without ever touching pay.sh. Then add pay.sh as a second `accepts:` entry in the x402 middleware — maybe 2 hours of work — once your direct flow is proven.

**Recommended sequencing**:

1. Ship direct Solana (the work above) → validates settlement works end-to-end on mainnet
2. Email pay.sh from `OUTREACH.md` → see if there's a partnership angle
3. Decide whether pay.sh integration is worth the extra surface area or whether direct + their email response settles it

---

## Effort estimate (revised)

| Phase | Effort | Calendar |
|---|---|---|
| Engineering (splitter + refund broadcast) | 4-6 hours | One focused afternoon |
| Operational (wallet, secrets, RPC) | 30 min - 2 hours | Depends on how fast you can buy a Helius plan |
| Testing on devnet (free) | 2 hours | First with stub, then real broadcast |
| Smoke test on mainnet (one $1 listing) | 30 min | $1-2 of USDC at risk |
| **Total** | **~8 hours** | **One weekend** |

This was never a 1-2 week project. The previous estimate was based on assuming greenfield Solana integration; the codebase already has the verifier, splitter abstraction, and listing schema in place.

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `TOOLORA_PLATFORM_WALLET_SECRET` leaks | low | catastrophic (drained) | Use Replit secrets exclusively; never log; rotate quarterly; cap wallet float at 2-week settlement volume |
| Mainnet RPC rate-limits during burst traffic | medium | settlements queue, callers see "pending" | Start on Helius free tier, upgrade to paid before launch posts |
| Owner ATA doesn't exist for new owners | high (every new payout) | first payout fails | `getOrCreateAssociatedTokenAccount` from spl-token handles this; test it explicitly |
| Tx confirmation lag on mainnet | medium | "settled" too eager (UX confusion) | Use `commitment=processed` for return + reconciler upgrades to `confirmed` async (already noted in TODO) |
| pay.sh ships features that make direct Solana feel obsolete | low | positioning weakens | Direct + pay.sh can coexist; you keep margin on direct path |
| Funded wallet attracts attention from drainers | medium | small loss | Cap the wallet at ~$200; sweep settled fees to a cold wallet weekly |

---

## Decision points for you

1. **Do you want to build it now, or finish the distribution sprint first?**
   The distribution sprint just shipped. There's a strong argument for waiting 7-14 days to see if the `npx @toolora/mcp` install + outreach generate any settlement volume on the existing Stellar/x402 path before adding a second chain. **My recommendation: wait 7 days, then build.** No volume = positioning problem, not a chain problem.

2. **Mainnet or devnet first?**
   Always devnet first. Free, identical API surface, free USDC from `https://faucet.circle.com`. One-line config flip to mainnet.

3. **Do you want pay.sh integration in scope, or just direct Solana?**
   My recommendation: direct Solana only for v1. Add pay.sh in v2 only if their team replies positively to the OUTREACH email. Don't pre-build for a partnership that may not happen.

4. **Who funds the platform wallet?**
   You. ~$20 USDC + 0.05 SOL is enough to start. Set up a 2-week settlement cap and sweep weekly to a cold wallet.

---

## What I would NOT do

- **Don't build a custodial flow.** You're not a custodian; you're a payment splitter. The splitter holds funds for milliseconds, not days.
- **Don't add Solana to the homepage hero copy yet.** Wait until first mainnet settlement is observable on `/admin`, then add a "Settles on Solana" badge with a link to the on-chain proof.
- **Don't ship this as a separate `/publish` flow.** The existing `/publish` page already accepts `payoutNetwork` — Solana is just a value in that field. Don't fragment the funnel.
- **Don't put `TOOLORA_PLATFORM_WALLET_SECRET` in `.env`, replit.md, or any committed file.** Replit secrets only. Use the `environment-secrets` skill.

---

## If you want me to build it

Say the word. The session plan would be:

1. Install `@solana/web3.js` + `@solana/spl-token` (1 min)
2. Implement `splitUsdc` broadcast mode in `usdcSplitter.ts` (60 min)
3. Implement refund broadcast in `gatewayRefunds.ts` (30 min)
4. Add a `splitUsdc.test.ts` against devnet that actually broadcasts a tiny payout (45 min)
5. Document `TOOLORA_PLATFORM_WALLET_SECRET` requirement + setup steps in `replit.md` (10 min)
6. Architect review (10 min)
7. Hand back to you for the operational steps (wallet generation + secret upload + `GATEWAY_PAYOUT_MODE=broadcast`)

Total: one focused 2.5-hour session, all engineering, no operational work.

Or — if you'd rather wait until the distribution sprint generates response signal before committing to a second chain — that's the more disciplined call. Your move.
