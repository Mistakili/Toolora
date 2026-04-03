export default function Slide01Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080a0f] flex flex-col items-center justify-center text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-purple-600/15 rounded-full blur-[8vw]" />
        <div className="absolute top-1/4 right-1/4 w-[20vw] h-[20vw] bg-violet-500/10 rounded-full blur-[5vw]" />
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#9333ea 1px, transparent 1px), linear-gradient(90deg, #9333ea 1px, transparent 1px)", backgroundSize: "5vw 5vw" }} />

      <div className="relative z-10 text-center px-[8vw]">
        <div className="inline-flex items-center gap-[0.8vw] border border-green-500/25 bg-green-500/8 px-[2vw] py-[0.6vh] rounded-full mb-[3vh]">
          <div className="w-[0.5vw] h-[0.5vw] bg-green-400 rounded-full" />
          <span className="font-body text-[1.3vw] text-green-400 tracking-wider">Privacy-First Tools Platform</span>
        </div>

        <div className="font-display font-bold text-[9vw] leading-none tracking-tighter text-white">
          Toolora<span className="text-purple-400">.</span>
        </div>

        <div className="mt-[2vh] font-display font-semibold text-[2.4vw] text-white/80 tracking-tight">
          28 free browser-side tools. A developer API. Enterprise compliance. An MCP ecosystem.
        </div>

        <div className="mt-[3.5vh] flex items-center justify-center gap-[3vw]">
          {[
            ["28", "free tools"],
            ["0", "uploads ever"],
            ["15", "countries"],
            ["$199", "enterprise/mo"],
          ].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="font-display font-bold text-[3vw] text-purple-400 leading-none">{num}</div>
              <div className="font-body text-[1.2vw] text-white/40 mt-[0.3vh]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[4vh] left-[4vw] right-[4vw] flex items-center justify-between">
        <span className="font-body text-[1.3vw] text-white/30">toolora.dev</span>
        <span className="font-body text-[1.3vw] text-white/30">April 2026</span>
      </div>
    </div>
  );
}
