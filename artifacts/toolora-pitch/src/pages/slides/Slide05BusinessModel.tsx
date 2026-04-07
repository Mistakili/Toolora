export default function Slide05BusinessModel() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080a0f] flex flex-col justify-center px-[8vw] text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] bg-purple-900/10 rounded-full blur-[10vw] pointer-events-none" />

      <div className="relative z-10 mb-[2.5vh]">
        <span className="font-body text-[1.3vw] text-purple-400 uppercase tracking-widest font-semibold">Business Model</span>
      </div>

      <div className="relative z-10 mb-[4vh]">
        <div className="font-display font-bold text-[4vw] leading-[1.1] tracking-tight text-white">
          Four revenue layers.<span className="text-purple-400"> One flywheel.</span>
        </div>
        <div className="font-body text-[1.6vw] text-white/40 mt-[1vh]">
          Free tools drive discovery → discovery monetises up the stack.
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-4 gap-[1.5vw]">
        {/* Tier 1 */}
        <div className="rounded-[1.2vw] border border-white/8 bg-white/3 p-[2vw] flex flex-col">
          <div className="font-body text-[1vw] text-white/30 uppercase tracking-widest mb-[1vh]">Layer 1 · Acquisition</div>
          <div className="font-display font-bold text-[2vw] text-white mb-[0.8vh]">Free Tools</div>
          <div className="font-body text-[1.3vw] text-white/40 mb-[2vh] leading-relaxed flex-1">41 browser-side tools. No account. No paywall. Chrome extension + SEO flywheel generate organic traffic 24/7.</div>
          <div className="border-t border-white/8 pt-[1.2vh]">
            <div className="font-display font-bold text-[2.5vw] text-white">$0</div>
            <div className="font-body text-[1.2vw] text-white/30">Converts to API users</div>
          </div>
        </div>

        {/* Tier 2 */}
        <div className="rounded-[1.2vw] border border-blue-500/20 bg-blue-500/6 p-[2vw] flex flex-col">
          <div className="font-body text-[1vw] text-blue-400/70 uppercase tracking-widest mb-[1vh]">Layer 2 · Developers</div>
          <div className="font-display font-bold text-[2vw] text-white mb-[0.8vh]">Agent API</div>
          <div className="font-body text-[1.3vw] text-white/40 mb-[2vh] leading-relaxed flex-1">Stripe subscriptions + x402 crypto micropayments. AI agents pay per call — no billing setup needed.</div>
          <div className="border-t border-white/8 pt-[1.2vh]">
            <div className="font-display font-bold text-[2.5vw] text-blue-400">$19–$79<span className="text-[1.4vw] text-white/30">/mo</span></div>
            <div className="font-body text-[1.2vw] text-white/30">Pro · Team plans</div>
          </div>
        </div>

        {/* Tier 3 */}
        <div className="rounded-[1.2vw] border border-purple-500/30 bg-purple-500/8 p-[2vw] flex flex-col">
          <div className="font-body text-[1vw] text-purple-400 uppercase tracking-widest mb-[1vh]">Layer 3 · Enterprise ★</div>
          <div className="font-display font-bold text-[2vw] text-white mb-[0.8vh]">Private by Default</div>
          <div className="font-body text-[1.3vw] text-white/40 mb-[2vh] leading-relaxed flex-1">Law firms, healthcare, financial services. No BAA needed — data never leaves the device. Self-serve Stripe checkout.</div>
          <div className="border-t border-white/8 pt-[1.2vh]">
            <div className="font-display font-bold text-[2.5vw] text-purple-400">$199<span className="text-[1.4vw] text-white/30">/mo</span></div>
            <div className="font-body text-[1.2vw] text-white/30">Unlimited team members</div>
          </div>
        </div>

        {/* Tier 4 */}
        <div className="rounded-[1.2vw] border border-white/8 bg-white/3 p-[2vw] flex flex-col">
          <div className="font-body text-[1vw] text-white/30 uppercase tracking-widest mb-[1vh]">Layer 4 · Ecosystem</div>
          <div className="font-display font-bold text-[2vw] text-white mb-[0.8vh]">MCP Server</div>
          <div className="font-body text-[1.3vw] text-white/40 mb-[2vh] leading-relaxed flex-1">25-tool MCP server agents discover automatically. 594 calls in week 1. Listed in Claude Desktop, Cursor, and MCP directories.</div>
          <div className="border-t border-white/8 pt-[1.2vh]">
            <div className="font-display font-bold text-[2.5vw] text-white/60">Growing</div>
            <div className="font-body text-[1.2vw] text-white/30">Agent distribution flywheel</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[4vh] left-[8vw]">
        <span className="font-body text-[1.3vw] text-white/30">toolora.dev</span>
      </div>
    </div>
  );
}
