export default function Slide04HowItWorks() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0d0f1a] flex flex-col items-center justify-center px-[8vw] text-white">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[30vw] bg-purple-800/12 rounded-full blur-[8vw] pointer-events-none" />

      {/* Label */}
      <div className="relative z-10 mb-[3vh] text-center">
        <span className="font-body text-[1.3vw] text-purple-400 uppercase tracking-widest font-semibold">How It Works</span>
      </div>

      {/* Headline */}
      <div className="relative z-10 text-center mb-[6vh]">
        <div className="font-display font-bold text-[4.5vw] tracking-tight text-white">
          Your browser is the server.
        </div>
      </div>

      {/* Steps */}
      <div className="relative z-10 flex items-start gap-[0] w-full max-w-[70vw]">
        {/* Step 1 */}
        <div className="flex-1 text-center px-[2vw]">
          <div className="w-[5vw] h-[5vw] rounded-full border-2 border-purple-500 bg-purple-500/15 flex items-center justify-center mx-auto mb-[2vh]">
            <span className="font-display font-bold text-[2vw] text-purple-400">1</span>
          </div>
          <div className="font-display font-bold text-[1.8vw] text-white mb-[1vh]">Open a tool</div>
          <div className="font-body text-[1.4vw] text-white/50 leading-relaxed">Choose from 20+ tools. No account needed. Instant load.</div>
        </div>

        {/* Arrow */}
        <div className="flex items-center pt-[4vh]">
          <div className="w-[3vw] h-[0.15vw] bg-purple-500/40" />
          <div className="border-t-[0.5vw] border-b-[0.5vw] border-l-[0.8vw] border-t-transparent border-b-transparent border-l-purple-500/40" />
        </div>

        {/* Step 2 */}
        <div className="flex-1 text-center px-[2vw]">
          <div className="w-[5vw] h-[5vw] rounded-full border-2 border-purple-500 bg-purple-500/15 flex items-center justify-center mx-auto mb-[2vh]">
            <span className="font-display font-bold text-[2vw] text-purple-400">2</span>
          </div>
          <div className="font-display font-bold text-[1.8vw] text-white mb-[1vh]">Browser processes it</div>
          <div className="font-body text-[1.4vw] text-white/50 leading-relaxed">WebAssembly runs near-native code locally. Your data stays on your device.</div>
        </div>

        {/* Arrow */}
        <div className="flex items-center pt-[4vh]">
          <div className="w-[3vw] h-[0.15vw] bg-purple-500/40" />
          <div className="border-t-[0.5vw] border-b-[0.5vw] border-l-[0.8vw] border-t-transparent border-b-transparent border-l-purple-500/40" />
        </div>

        {/* Step 3 */}
        <div className="flex-1 text-center px-[2vw]">
          <div className="w-[5vw] h-[5vw] rounded-full border-2 border-purple-500 bg-purple-500/15 flex items-center justify-center mx-auto mb-[2vh]">
            <span className="font-display font-bold text-[2vw] text-purple-400">3</span>
          </div>
          <div className="font-display font-bold text-[1.8vw] text-white mb-[1vh]">Download result</div>
          <div className="font-body text-[1.4vw] text-white/50 leading-relaxed">Output delivered directly from browser memory. Zero server involvement.</div>
        </div>
      </div>

      {/* Tech note */}
      <div className="relative z-10 mt-[5vh] border border-white/8 bg-white/3 rounded-[1vw] px-[2.5vw] py-[1.5vh]">
        <span className="font-body text-[1.4vw] text-white/40">Powered by </span>
        <span className="font-body text-[1.4vw] text-purple-300">WebAssembly</span>
        <span className="font-body text-[1.4vw] text-white/40"> + </span>
        <span className="font-body text-[1.4vw] text-purple-300">Browser File APIs</span>
        <span className="font-body text-[1.4vw] text-white/40"> — no server required, ever</span>
      </div>

      <div className="absolute bottom-[4vh] left-[8vw]">
        <span className="font-body text-[1.3vw] text-white/30">toolora.dev</span>
      </div>
    </div>
  );
}
