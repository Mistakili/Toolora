export default function Slide05ForAgents() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080a0f] flex flex-col justify-center px-[8vw] text-white">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-violet-900/15 rounded-full blur-[8vw] pointer-events-none" />

      {/* Label */}
      <div className="relative z-10 mb-[2.5vh]">
        <span className="font-body text-[1.3vw] text-purple-400 uppercase tracking-widest font-semibold">For AI Agents</span>
      </div>

      {/* Headline */}
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

      {/* Two columns */}
      <div className="relative z-10 flex gap-[2vw]">
        {/* Agent API */}
        <div className="flex-1 rounded-[1.5vw] border border-white/8 bg-white/3 p-[2.5vw]">
          <div className="font-body text-[1.1vw] text-blue-400 uppercase tracking-widest mb-[1.5vh]">Agent API</div>
          <div className="font-display font-bold text-[2.2vw] text-white mb-[1vh]">x402 Micropayments</div>
          <div className="font-body text-[1.4vw] text-white/50 mb-[2vh] leading-relaxed">Agents pay per request with Solana USDC or Stellar XLM. No pre-auth, no billing setup.</div>
          <div className="space-y-[0.8vh]">
            <div className="flex items-center gap-[0.8vw]">
              <div className="w-[0.5vw] h-[0.5vw] bg-blue-400 rounded-full shrink-0" />
              <span className="font-body text-[1.4vw] text-white/60">PDF text extraction</span>
            </div>
            <div className="flex items-center gap-[0.8vw]">
              <div className="w-[0.5vw] h-[0.5vw] bg-blue-400 rounded-full shrink-0" />
              <span className="font-body text-[1.4vw] text-white/60">Web scraping (Readability)</span>
            </div>
            <div className="flex items-center gap-[0.8vw]">
              <div className="w-[0.5vw] h-[0.5vw] bg-blue-400 rounded-full shrink-0" />
              <span className="font-body text-[1.4vw] text-white/60">QR code generation</span>
            </div>
            <div className="flex items-center gap-[0.8vw]">
              <div className="w-[0.5vw] h-[0.5vw] bg-blue-400 rounded-full shrink-0" />
              <span className="font-body text-[1.4vw] text-white/60">CSV/JSON conversion</span>
            </div>
          </div>
          <div className="mt-[2vh] border border-white/8 rounded-[0.8vw] px-[1.5vw] py-[1vh]">
            <div className="flex justify-between mb-[0.5vh]">
              <span className="font-body text-[1.2vw] text-white/40">Free</span>
              <span className="font-display font-bold text-[1.4vw] text-white">200 calls/mo</span>
            </div>
            <div className="flex justify-between mb-[0.5vh]">
              <span className="font-body text-[1.2vw] text-white/40">Pro $19/mo</span>
              <span className="font-display font-bold text-[1.4vw] text-white">5k calls/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="font-body text-[1.2vw] text-white/40">Team $79/mo</span>
              <span className="font-display font-bold text-[1.4vw] text-white">50k calls/mo</span>
            </div>
          </div>
        </div>

        {/* MCP Server */}
        <div className="flex-1 rounded-[1.5vw] border border-purple-500/25 bg-purple-500/8 p-[2.5vw]">
          <div className="font-body text-[1.1vw] text-purple-400 uppercase tracking-widest mb-[1.5vh]">MCP Server</div>
          <div className="font-display font-bold text-[2.2vw] text-white mb-[1vh]">Free. 12 Tools.</div>
          <div className="font-body text-[1.4vw] text-white/50 mb-[2vh] leading-relaxed">Drop the endpoint into Claude Desktop or Cursor. Your AI gets Toolora's tools instantly.</div>
          <div className="bg-black/40 border border-white/8 rounded-[0.8vw] px-[1.5vw] py-[1.2vh] mb-[2vh]">
            <span className="font-body text-[1.2vw] text-purple-300">toolora.replit.app/api/mcp</span>
          </div>
          <div className="space-y-[0.8vh]">
            <div className="flex items-center gap-[0.8vw]">
              <div className="w-[0.5vw] h-[0.5vw] bg-purple-400 rounded-full shrink-0" />
              <span className="font-body text-[1.4vw] text-white/60">PDF extraction, OCR, DOCX</span>
            </div>
            <div className="flex items-center gap-[0.8vw]">
              <div className="w-[0.5vw] h-[0.5vw] bg-purple-400 rounded-full shrink-0" />
              <span className="font-body text-[1.4vw] text-white/60">Audio transcription</span>
            </div>
            <div className="flex items-center gap-[0.8vw]">
              <div className="w-[0.5vw] h-[0.5vw] bg-purple-400 rounded-full shrink-0" />
              <span className="font-body text-[1.4vw] text-white/60">Excel to JSON, CSV tools</span>
            </div>
            <div className="flex items-center gap-[0.8vw]">
              <div className="w-[0.5vw] h-[0.5vw] bg-purple-400 rounded-full shrink-0" />
              <span className="font-body text-[1.4vw] text-white/60">QR generation, word count</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[4vh] left-[8vw]">
        <span className="font-body text-[1.3vw] text-white/30">toolora.dev</span>
      </div>
    </div>
  );
}
