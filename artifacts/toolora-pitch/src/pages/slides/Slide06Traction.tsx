export default function Slide06Traction() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080a0f] flex flex-col justify-center items-center text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] bg-purple-900/12 rounded-full blur-[10vw] pointer-events-none" />

      <div className="relative z-10 mb-[3vh] text-center">
        <span className="font-body text-[1.3vw] text-purple-400 uppercase tracking-widest font-semibold">Traction</span>
      </div>

      <div className="relative z-10 grid grid-cols-4 gap-[2vw] w-full px-[8vw] mb-[3.5vh]">
        {[
          { val: "41",  label: "free tools live",   color: "text-white",     border: "border-white/8 bg-white/3" },
          { val: "0",   label: "uploads required",  color: "text-purple-400", border: "border-purple-500/25 bg-purple-500/8" },
          { val: "757", label: "page views",         color: "text-green-400", border: "border-green-500/20 bg-green-500/6" },
          { val: "594", label: "MCP calls / week",   color: "text-blue-400",  border: "border-blue-500/20 bg-blue-500/6" },
        ].map(({ val, label, color, border }) => (
          <div key={label} className={`text-center border rounded-[1.5vw] py-[3vh] px-[1vw] ${border}`}>
            <div className={`font-display font-bold leading-none mb-[1vh] ${color}`} style={{ fontSize: "9vw" }}>{val}</div>
            <div className="font-body text-[1.5vw] text-white/50">{label}</div>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-wrap gap-x-[3vw] gap-y-[1.2vh] items-center justify-center px-[8vw]">
        {[
          "Chrome extension live on Web Store",
          "MCP server: agents connect within hours of launch",
          "Bing + Google organic traffic growing",
          "SEO blog active — tool pages ranking",
          "Enterprise self-serve checkout ($199/mo)",
          "30-day money-back guarantee",
          "HackerNoon article — technical audience reach",
          "Product Hunt listed",
        ].map(item => (
          <div key={item} className="flex items-center gap-[0.8vw]">
            <div className="w-[0.5vw] h-[0.5vw] bg-green-400 rounded-full shrink-0" />
            <span className="font-body text-[1.4vw] text-white/55">{item}</span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-[4vh] left-[8vw]">
        <span className="font-body text-[1.3vw] text-white/30">toolora.dev</span>
      </div>
    </div>
  );
}
