export default function Slide07Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080a0f] flex flex-col items-center justify-center text-white">
      {/* Background glow — stronger on closing */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-purple-600/12 rounded-full blur-[12vw]" />
        <div className="absolute bottom-0 left-1/4 w-[30vw] h-[30vw] bg-violet-700/10 rounded-full blur-[6vw]" />
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#9333ea 1px, transparent 1px), linear-gradient(90deg, #9333ea 1px, transparent 1px)", backgroundSize: "5vw 5vw" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-[8vw]">
        {/* Built on Replit badge */}
        <div className="inline-block border border-purple-500/30 bg-purple-500/10 px-[2vw] py-[0.8vh] rounded-full mb-[4vh]">
          <span className="font-body text-[1.5vw] text-purple-300 font-semibold">Built entirely on Replit</span>
        </div>

        <div className="font-display font-bold text-[5.5vw] leading-[1.05] tracking-tight text-white mb-[2vh]">
          One week.
        </div>
        <div className="font-display font-bold text-[5.5vw] leading-[1.05] tracking-tight text-purple-400 mb-[2vh]">
          20+ tools.
        </div>
        <div className="font-display font-bold text-[5.5vw] leading-[1.05] tracking-tight text-white mb-[4vh]">
          With AI.
        </div>

        <div className="font-body text-[1.8vw] text-white/50 max-w-[45vw] mx-auto leading-relaxed">
          Toolora proves that browser-side privacy and developer productivity don't have to be a tradeoff.
        </div>

        <div className="mt-[5vh] font-display font-bold text-[2.5vw] text-white/80">
          toolora.dev
        </div>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-[4vh] left-[4vw] right-[4vw] flex items-center justify-between">
        <span className="font-body text-[1.3vw] text-white/25">Replit Hackathon Week 2 · April 2026</span>
        <span className="font-body text-[1.3vw] text-white/25">Privacy-first tools platform</span>
      </div>
    </div>
  );
}
