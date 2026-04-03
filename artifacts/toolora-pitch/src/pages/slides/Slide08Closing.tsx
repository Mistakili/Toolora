export default function Slide08Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080a0f] flex flex-col items-center justify-center text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-purple-600/12 rounded-full blur-[12vw]" />
        <div className="absolute bottom-0 left-1/4 w-[30vw] h-[30vw] bg-violet-700/10 rounded-full blur-[6vw]" />
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#9333ea 1px, transparent 1px), linear-gradient(90deg, #9333ea 1px, transparent 1px)", backgroundSize: "5vw 5vw" }} />

      <div className="relative z-10 text-center px-[8vw]">
        <div className="inline-flex items-center gap-[0.8vw] border border-green-500/25 bg-green-500/8 px-[2vw] py-[0.8vh] rounded-full mb-[4vh]">
          <div className="w-[0.5vw] h-[0.5vw] bg-green-400 rounded-full" />
          <span className="font-body text-[1.4vw] text-green-400 font-semibold">Privacy by Architecture</span>
        </div>

        <div className="font-display font-bold text-[5vw] leading-[1.1] tracking-tight text-white mb-[1.5vh]">
          Free tools that never upload.
        </div>
        <div className="font-display font-bold text-[5vw] leading-[1.1] tracking-tight text-purple-400 mb-[1.5vh]">
          An API developers pay for.
        </div>
        <div className="font-display font-bold text-[5vw] leading-[1.1] tracking-tight text-white mb-[1.5vh]">
          An enterprise tier that sells itself.
        </div>
        <div className="font-display font-bold text-[5vw] leading-[1.1] tracking-tight text-white/40 mb-[4vh]">
          An MCP ecosystem that compounds.
        </div>

        <div className="font-body text-[1.8vw] text-white/40 max-w-[50vw] mx-auto leading-relaxed">
          One architecture. Four revenue streams. Every layer reinforces the next.
        </div>

        <div className="mt-[5vh] font-display font-bold text-[2.5vw] text-white/80">
          toolora.dev
        </div>

        <div className="mt-[1.5vh] flex items-center justify-center gap-[2vw]">
          <span className="font-body text-[1.3vw] text-white/30">support@toolora.dev</span>
        </div>
      </div>

      <div className="absolute bottom-[4vh] left-[4vw] right-[4vw] flex items-center justify-between">
        <span className="font-body text-[1.3vw] text-white/20">April 2026</span>
        <span className="font-body text-[1.3vw] text-white/20">28 tools · 15 countries · $199/mo enterprise</span>
      </div>
    </div>
  );
}
