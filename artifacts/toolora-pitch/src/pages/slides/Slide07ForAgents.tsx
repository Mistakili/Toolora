export default function Slide07ForAgents() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080a0f] flex flex-col justify-center px-[8vw] text-white">
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-violet-900/15 rounded-full blur-[8vw] pointer-events-none" />

      <div className="relative z-10 mb-[2.5vh]">
        <span className="font-body text-[1.3vw] text-purple-400 uppercase tracking-widest font-semibold">For AI Agents & Developers</span>
      </div>

      <div className="relative z-10 mb-[4vh]">
        <div className="font-display font-bold text-[4vw] leading-[1.1] tracking-tight text-white">
          Tools AI agents
        </div>
        <div className="font-display font-bold text-[4vw] leading-[1.1] tracking-tight text-purple-400">
          can't self-execute.
        </div>
        <div className="font-body text-[1.8vw] text-white/50 mt-[1.5vh]">
          LLMs reason. They can't open a PDF or hash a file. Toolora gives agents real tool-use.
        </div>
      </div>

      <div className="relative z-10 flex gap-[2vw]">
        {/* Agent API */}
        <div className="flex-1 rounded-[1.5vw] border border-blue-500/20 bg-blue-500/6 p-[2.5vw]">
          <div className="font-body text-[1.1vw] text-blue-400 uppercase tracking-widest mb-[1.5vh]">Agent API</div>
          <div className="font-display font-bold text-[2.2vw] text-white mb-[1vh]">Stripe + x402 Crypto</div>
          <div className="font-body text-[1.4vw] text-white/50 mb-[2vh] leading-relaxed">Monthly subscriptions via Stripe, or per-call with Solana USDC / Stellar XLM. Agents pay without a billing account.</div>
          <div className="space-y-[0.6vh] border border-white/8 rounded-[0.8vw] px-[1.5vw] py-[1vh]">
            {[["Free", "200 calls/mo"], ["Pro $19/mo", "5,000 calls"], ["Team $79/mo", "50,000 calls"]].map(([plan, calls]) => (
              <div key={plan} className="flex justify-between">
                <span className="font-body text-[1.2vw] text-white/40">{plan}</span>
                <span className="font-display font-bold text-[1.4vw] text-white">{calls}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MCP Server */}
        <div className="flex-1 rounded-[1.5vw] border border-purple-500/25 bg-purple-500/8 p-[2.5vw]">
          <div className="font-body text-[1.1vw] text-purple-400 uppercase tracking-widest mb-[1.5vh]">MCP Server</div>
          <div className="font-display font-bold text-[2.2vw] text-white mb-[1vh]">Free. 25 Tools.</div>
          <div className="font-body text-[1.4vw] text-white/50 mb-[2vh] leading-relaxed">Drop the endpoint into Claude Desktop or Cursor. Your AI gets Toolora's tools instantly. No API key required.</div>
          <div className="bg-black/40 border border-white/8 rounded-[0.8vw] px-[1.5vw] py-[1.2vh] mb-[1.5vh]">
            <span className="font-body text-[1.2vw] text-purple-300">toolora.dev/api/mcp</span>
          </div>
          <div className="space-y-[0.6vh]">
            {["PDF merge, split & extraction", "Word count, hash, Base64, JWT decode", "Token counting, text chunking for RAG", "594 agent calls in first week live"].map(item => (
              <div key={item} className="flex items-center gap-[0.8vw]">
                <div className="w-[0.5vw] h-[0.5vw] bg-purple-400 rounded-full shrink-0" />
                <span className="font-body text-[1.4vw] text-white/60">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise */}
        <div className="flex-1 rounded-[1.5vw] border border-amber-500/20 bg-amber-500/6 p-[2.5vw]">
          <div className="font-body text-[1.1vw] text-amber-400 uppercase tracking-widest mb-[1.5vh]">Enterprise</div>
          <div className="font-display font-bold text-[2.2vw] text-white mb-[1vh]">Private by Default</div>
          <div className="font-body text-[1.4vw] text-white/50 mb-[2vh] leading-relaxed">Law firms, healthcare, financial services. No BAA required — data never leaves the browser. Self-serve checkout.</div>
          <div className="border border-white/8 rounded-[0.8vw] px-[1.5vw] py-[1vh] mb-[1.5vh]">
            <div className="flex justify-between items-baseline">
              <span className="font-body text-[1.2vw] text-white/40">Enterprise</span>
              <span className="font-display font-bold text-[2vw] text-amber-400">$199<span className="text-[1.2vw] text-white/30">/mo</span></span>
            </div>
          </div>
          <div className="space-y-[0.6vh]">
            {["Unlimited team members", "Compliance documentation", "30-day money-back guarantee"].map(item => (
              <div key={item} className="flex items-center gap-[0.8vw]">
                <div className="w-[0.5vw] h-[0.5vw] bg-amber-400 rounded-full shrink-0" />
                <span className="font-body text-[1.4vw] text-white/60">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-[4vh] left-[8vw]">
        <span className="font-body text-[1.3vw] text-white/30">toolora.dev</span>
      </div>
    </div>
  );
}
