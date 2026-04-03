export default function Slide03Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080a0f] flex flex-col justify-center px-[8vw] text-white">
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-purple-900/15 rounded-full blur-[8vw] pointer-events-none" />

      <div className="relative z-10 mb-[2.5vh]">
        <span className="font-body text-[1.3vw] text-purple-400 uppercase tracking-widest font-semibold">The Solution</span>
      </div>

      <div className="relative z-10 mb-[4vh]">
        <div className="font-display font-bold text-[5vw] leading-[1.05] tracking-tight text-white">
          28 tools. Zero uploads.
        </div>
        <div className="font-display font-semibold text-[2.2vw] text-white/50 mt-[1vh]">
          Every tool runs entirely in your browser via WebAssembly.
        </div>
      </div>

      <div className="relative z-10 flex gap-[1.5vw]">
        {[
          { label: "Documents", color: "border-purple-500/25 bg-purple-500/8", textColor: "text-purple-400", title: "PDF tools", sub: "Merge, split, extract, OCR" },
          { label: "Images",    color: "border-white/8 bg-white/3",            textColor: "text-purple-400", title: "Image tools", sub: "Compress, resize, convert" },
          { label: "Developer", color: "border-white/8 bg-white/3",            textColor: "text-purple-400", title: "Dev tools", sub: "JSON, JWT, Base64, Hash, UUID" },
          { label: "Text",      color: "border-white/8 bg-white/3",            textColor: "text-purple-400", title: "Text tools", sub: "Word count, diff, markdown" },
          { label: "Security",  color: "border-white/8 bg-white/3",            textColor: "text-purple-400", title: "Security", sub: "Password gen, hash, encrypt" },
        ].map(({ label, color, textColor, title, sub }) => (
          <div key={label} className={`flex-1 rounded-[1.2vw] border p-[1.8vw] ${color}`}>
            <div className={`font-body text-[1.1vw] uppercase tracking-widest mb-[1vh] ${textColor}`}>{label}</div>
            <div className="font-display font-bold text-[2.2vw] text-white mb-[0.8vh]">{title}</div>
            <div className="font-body text-[1.4vw] text-white/50">{sub}</div>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-[3vh] flex items-center gap-[1.5vw]">
        <div className="flex items-center gap-[0.8vw] bg-green-500/10 border border-green-500/20 rounded-full px-[1.5vw] py-[0.5vh]">
          <div className="w-[0.6vw] h-[0.6vw] bg-green-400 rounded-full" />
          <span className="font-body text-[1.3vw] text-green-400">0 bytes of your data ever leave your device</span>
        </div>
        <div className="flex items-center gap-[0.8vw] bg-purple-500/10 border border-purple-500/20 rounded-full px-[1.5vw] py-[0.5vh]">
          <div className="w-[0.6vw] h-[0.6vw] bg-purple-400 rounded-full" />
          <span className="font-body text-[1.3vw] text-purple-400">Verifiable in DevTools — zero upload requests</span>
        </div>
      </div>

      <div className="absolute bottom-[4vh] left-[8vw]">
        <span className="font-body text-[1.3vw] text-white/30">toolora.dev</span>
      </div>
    </div>
  );
}
