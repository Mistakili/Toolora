export default function Slide01Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080a0f] flex flex-col items-center justify-center text-white">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-purple-600/15 rounded-full blur-[8vw]" />
        <div className="absolute top-1/4 right-1/4 w-[20vw] h-[20vw] bg-violet-500/10 rounded-full blur-[5vw]" />
      </div>

      {/* Grid lines accent */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#9333ea 1px, transparent 1px), linear-gradient(90deg, #9333ea 1px, transparent 1px)", backgroundSize: "5vw 5vw" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-[8vw]">
        <div className="inline-block border border-white/10 bg-white/5 px-[2vw] py-[0.6vh] rounded-full mb-[3vh]">
          <span className="font-body text-[1.4vw] text-white/60 tracking-widest uppercase">Replit Hackathon Week 2</span>
        </div>

        <div className="font-display font-bold text-[9vw] leading-none tracking-tighter text-white">
          Toolora<span className="text-purple-400">.</span>
        </div>

        <div className="mt-[2vh] font-display font-semibold text-[2.4vw] text-white/80 tracking-tight">
          Tools that work entirely in your browser
        </div>

        <div className="mt-[3vh] flex items-center justify-center gap-[3vw]">
          <div className="flex items-center gap-[0.6vw]">
            <div className="w-[0.4vw] h-[0.4vw] bg-purple-400 rounded-full" />
            <span className="font-body text-[1.5vw] text-white/50">20+ free tools</span>
          </div>
          <div className="flex items-center gap-[0.6vw]">
            <div className="w-[0.4vw] h-[0.4vw] bg-purple-400 rounded-full" />
            <span className="font-body text-[1.5vw] text-white/50">Zero uploads</span>
          </div>
          <div className="flex items-center gap-[0.6vw]">
            <div className="w-[0.4vw] h-[0.4vw] bg-purple-400 rounded-full" />
            <span className="font-body text-[1.5vw] text-white/50">100% private</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-[4vh] left-[4vw] right-[4vw] flex items-center justify-between">
        <span className="font-body text-[1.3vw] text-white/30">toolora.dev</span>
        <span className="font-body text-[1.3vw] text-white/30">April 2026</span>
      </div>
    </div>
  );
}
