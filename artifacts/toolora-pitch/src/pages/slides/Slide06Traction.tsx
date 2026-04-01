export default function Slide06Traction() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080a0f] flex flex-col justify-center items-center text-white">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] bg-purple-900/12 rounded-full blur-[10vw] pointer-events-none" />

      {/* Label */}
      <div className="relative z-10 mb-[4vh] text-center">
        <span className="font-body text-[1.3vw] text-purple-400 uppercase tracking-widest font-semibold">Week 1 — Built on Replit</span>
      </div>

      {/* Big stats grid */}
      <div className="relative z-10 grid grid-cols-4 gap-[2vw] w-full px-[8vw] mb-[4vh]">
        <div className="text-center border border-white/8 bg-white/3 rounded-[1.5vw] py-[3vh] px-[1vw]">
          <div className="font-display font-bold text-white leading-none mb-[1vh]" style={{ fontSize: "9vw" }}>20+</div>
          <div className="font-body text-[1.5vw] text-white/50">free tools</div>
        </div>
        <div className="text-center border border-purple-500/25 bg-purple-500/8 rounded-[1.5vw] py-[3vh] px-[1vw]">
          <div className="font-display font-bold text-purple-400 leading-none mb-[1vh]" style={{ fontSize: "9vw" }}>0</div>
          <div className="font-body text-[1.5vw] text-white/50">uploads required</div>
        </div>
        <div className="text-center border border-white/8 bg-white/3 rounded-[1.5vw] py-[3vh] px-[1vw]">
          <div className="font-display font-bold text-white leading-none mb-[1vh]" style={{ fontSize: "9vw" }}>12</div>
          <div className="font-body text-[1.5vw] text-white/50">MCP tools</div>
        </div>
        <div className="text-center border border-white/8 bg-white/3 rounded-[1.5vw] py-[3vh] px-[1vw]">
          <div className="font-display font-bold text-white leading-none mb-[1vh]" style={{ fontSize: "9vw" }}>3</div>
          <div className="font-body text-[1.5vw] text-white/50">continents, day 1</div>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="relative z-10 flex gap-[3vw] items-center">
        <div className="flex items-center gap-[0.8vw]">
          <div className="w-[0.6vw] h-[0.6vw] bg-green-400 rounded-full" />
          <span className="font-body text-[1.5vw] text-white/60">Replit.com — top traffic source</span>
        </div>
        <div className="w-[0.15vw] h-[2vh] bg-white/15" />
        <div className="flex items-center gap-[0.8vw]">
          <div className="w-[0.6vw] h-[0.6vw] bg-green-400 rounded-full" />
          <span className="font-body text-[1.5vw] text-white/60">Bing organic traffic, week 1</span>
        </div>
        <div className="w-[0.15vw] h-[2vh] bg-white/15" />
        <div className="flex items-center gap-[0.8vw]">
          <div className="w-[0.6vw] h-[0.6vw] bg-green-400 rounded-full" />
          <span className="font-body text-[1.5vw] text-white/60">Chrome extension submitted</span>
        </div>
      </div>

      <div className="absolute bottom-[4vh] left-[8vw]">
        <span className="font-body text-[1.3vw] text-white/30">toolora.dev</span>
      </div>
    </div>
  );
}
