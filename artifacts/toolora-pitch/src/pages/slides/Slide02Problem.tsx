export default function Slide02Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080a0f] flex flex-col justify-center px-[8vw] text-white">
      {/* Accent bar */}
      <div className="absolute left-0 top-0 w-[0.4vw] h-full bg-gradient-to-b from-purple-600 via-violet-400 to-transparent" />

      {/* Background subtle glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[40vw] h-[40vw] bg-purple-900/15 rounded-full blur-[8vw] pointer-events-none" />

      {/* Label */}
      <div className="relative z-10 mb-[3vh]">
        <span className="font-body text-[1.3vw] text-purple-400 uppercase tracking-widest font-semibold">The Problem</span>
      </div>

      {/* Headline */}
      <div className="relative z-10 mb-[5vh]">
        <div className="font-display font-bold text-[4.5vw] leading-[1.1] tracking-tight text-white">
          Most "free" tools
        </div>
        <div className="font-display font-bold text-[4.5vw] leading-[1.1] tracking-tight text-purple-400">
          upload your files
        </div>
        <div className="font-display font-bold text-[4.5vw] leading-[1.1] tracking-tight text-white">
          to servers you don't control.
        </div>
      </div>

      {/* Three pain points */}
      <div className="relative z-10 flex gap-[3vw]">
        <div className="flex-1 border border-white/8 bg-white/3 rounded-[1.5vw] p-[2vw]">
          <div className="font-display font-bold text-[1.8vw] text-white mb-[1vh]">Privacy risk</div>
          <div className="font-body text-[1.4vw] text-white/50 leading-relaxed">PDFs, images, and documents sent to third-party servers. Stored, analyzed, used for ads.</div>
        </div>
        <div className="flex-1 border border-white/8 bg-white/3 rounded-[1.5vw] p-[2vw]">
          <div className="font-display font-bold text-[1.8vw] text-white mb-[1vh]">Slow round-trips</div>
          <div className="font-body text-[1.4vw] text-white/50 leading-relaxed">Upload, wait for server, download. A task that takes milliseconds locally takes seconds over a network.</div>
        </div>
        <div className="flex-1 border border-white/8 bg-white/3 rounded-[1.5vw] p-[2vw]">
          <div className="font-display font-bold text-[1.8vw] text-white mb-[1vh]">Paywalls everywhere</div>
          <div className="font-body text-[1.4vw] text-white/50 leading-relaxed">Free tiers with file size limits, watermarks, rate limits. Basic utilities shouldn't require a subscription.</div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-[4vh] left-[8vw]">
        <span className="font-body text-[1.3vw] text-white/30">toolora.dev</span>
      </div>
    </div>
  );
}
