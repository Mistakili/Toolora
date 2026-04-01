export default function Slide03Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080a0f] flex flex-col justify-center px-[8vw] text-white">
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-purple-900/15 rounded-full blur-[8vw] pointer-events-none" />

      {/* Label */}
      <div className="relative z-10 mb-[2.5vh]">
        <span className="font-body text-[1.3vw] text-purple-400 uppercase tracking-widest font-semibold">The Solution</span>
      </div>

      {/* Headline */}
      <div className="relative z-10 mb-[4vh]">
        <div className="font-display font-bold text-[5vw] leading-[1.05] tracking-tight text-white">
          20+ tools. Zero uploads.
        </div>
        <div className="font-display font-semibold text-[2.2vw] text-white/50 mt-[1vh]">
          Every tool runs entirely in your browser via WebAssembly.
        </div>
      </div>

      {/* Tool categories */}
      <div className="relative z-10 flex gap-[1.5vw]">
        <div className="flex-1 rounded-[1.2vw] border border-purple-500/25 bg-purple-500/8 p-[1.8vw]">
          <div className="font-body text-[1.1vw] text-purple-400 uppercase tracking-widest mb-[1vh]">Documents</div>
          <div className="font-display font-bold text-[2.2vw] text-white mb-[0.8vh]">PDF tools</div>
          <div className="font-body text-[1.4vw] text-white/50">Merge, split, extract text</div>
        </div>
        <div className="flex-1 rounded-[1.2vw] border border-white/8 bg-white/3 p-[1.8vw]">
          <div className="font-body text-[1.1vw] text-purple-400 uppercase tracking-widest mb-[1vh]">Images</div>
          <div className="font-display font-bold text-[2.2vw] text-white mb-[0.8vh]">Image tools</div>
          <div className="font-body text-[1.4vw] text-white/50">Compress, resize, convert</div>
        </div>
        <div className="flex-1 rounded-[1.2vw] border border-white/8 bg-white/3 p-[1.8vw]">
          <div className="font-body text-[1.1vw] text-purple-400 uppercase tracking-widest mb-[1vh]">Developer</div>
          <div className="font-display font-bold text-[2.2vw] text-white mb-[0.8vh]">Dev tools</div>
          <div className="font-body text-[1.4vw] text-white/50">JSON, Base64, Hash, UUID</div>
        </div>
        <div className="flex-1 rounded-[1.2vw] border border-white/8 bg-white/3 p-[1.8vw]">
          <div className="font-body text-[1.1vw] text-purple-400 uppercase tracking-widest mb-[1vh]">Text</div>
          <div className="font-display font-bold text-[2.2vw] text-white mb-[0.8vh]">Text tools</div>
          <div className="font-body text-[1.4vw] text-white/50">Word count, diff, markdown</div>
        </div>
        <div className="flex-1 rounded-[1.2vw] border border-white/8 bg-white/3 p-[1.8vw]">
          <div className="font-body text-[1.1vw] text-purple-400 uppercase tracking-widest mb-[1vh]">Productivity</div>
          <div className="font-display font-bold text-[2.2vw] text-white mb-[0.8vh]">Utilities</div>
          <div className="font-body text-[1.4vw] text-white/50">QR, Password, Converter</div>
        </div>
      </div>

      {/* Privacy badge */}
      <div className="relative z-10 mt-[3vh] flex items-center gap-[1.5vw]">
        <div className="flex items-center gap-[0.8vw] bg-green-500/10 border border-green-500/20 rounded-full px-[1.5vw] py-[0.5vh]">
          <div className="w-[0.6vw] h-[0.6vw] bg-green-400 rounded-full" />
          <span className="font-body text-[1.3vw] text-green-400">0 bytes of your data ever leave your device</span>
        </div>
        <div className="flex items-center gap-[0.8vw] bg-purple-500/10 border border-purple-500/20 rounded-full px-[1.5vw] py-[0.5vh]">
          <div className="w-[0.6vw] h-[0.6vw] bg-purple-400 rounded-full" />
          <span className="font-body text-[1.3vw] text-purple-400">No account required. Ever.</span>
        </div>
      </div>

      <div className="absolute bottom-[4vh] left-[8vw]">
        <span className="font-body text-[1.3vw] text-white/30">toolora.dev</span>
      </div>
    </div>
  );
}
