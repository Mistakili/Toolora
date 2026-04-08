import { useEffect, useState } from "react";

interface FlowStep {
  id: string;
  icon: string;
  label: string;
  sublabel: string;
  color: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    id: "wallet",
    icon: "🔮",
    label: "Your Wallet",
    sublabel: "Signs tx locally",
    color: "text-violet-400",
  },
  {
    id: "per",
    icon: "🛡️",
    label: "MagicBlock PER",
    sublabel: "Private Ephemeral Rollup",
    color: "text-primary",
  },
  {
    id: "tee",
    icon: "🔒",
    label: "TEE Enclave",
    sublabel: "Shielded execution",
    color: "text-emerald-400",
  },
  {
    id: "result",
    icon: "✅",
    label: "Tool Result",
    sublabel: "Only visible to you",
    color: "text-sky-400",
  },
];

interface Particle {
  id: number;
  x: number;
  step: number;
  active: boolean;
}

export function PrivacyFlow({ animating = false }: { animating?: boolean }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!animating) {
      setActiveStep(-1);
      setParticles([]);
      return;
    }

    let step = 0;
    const stepInterval = setInterval(() => {
      setActiveStep(step);
      step = (step + 1) % FLOW_STEPS.length;
    }, 600);

    let pid = 0;
    const particleInterval = setInterval(() => {
      const newParticle: Particle = {
        id: pid++,
        x: 0,
        step: 0,
        active: true,
      };
      setParticles((prev) => [...prev.slice(-8), newParticle]);
    }, 800);

    return () => {
      clearInterval(stepInterval);
      clearInterval(particleInterval);
    };
  }, [animating]);

  return (
    <div className="rounded-xl border border-primary/20 bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary">🛡️</span>
          <span className="text-sm font-medium text-foreground">Privacy Architecture</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${animating ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground/30"}`} />
          <span className="text-xs text-muted-foreground">
            {animating ? "Transaction in progress" : "Idle"}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Flow diagram */}
        <div className="relative flex items-center justify-between gap-2">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1">
              {/* Node */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-300 ${
                    activeStep === i
                      ? "border-primary bg-primary/20 scale-110 shadow-lg shadow-primary/30"
                      : "border-border bg-muted/50"
                  }`}
                >
                  {step.icon}
                  {activeStep === i && (
                    <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-30" />
                  )}
                </div>
                <div className={`text-xs font-medium mt-2 text-center transition-colors duration-300 ${activeStep === i ? step.color : "text-muted-foreground"}`}>
                  {step.label}
                </div>
                <div className="text-[10px] text-muted-foreground/60 text-center leading-tight mt-0.5">
                  {step.sublabel}
                </div>
              </div>

              {/* Arrow connector */}
              {i < FLOW_STEPS.length - 1 && (
                <div className="relative flex items-center justify-center w-8 shrink-0">
                  <div className={`h-px w-full transition-colors duration-300 ${
                    animating && (activeStep >= i || activeStep === -1)
                      ? "bg-primary/60"
                      : "bg-border"
                  }`} />
                  {/* Animated dot on the arrow */}
                  {animating && (
                    <div
                      className="absolute w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary/50"
                      style={{
                        animation: "slide-arrow 1.2s linear infinite",
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                  )}
                  <span className={`absolute text-[8px] transition-colors duration-300 ${animating ? "text-primary/80" : "text-muted-foreground/40"}`}>›</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Properties list */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { icon: "🔒", label: "Zero-knowledge payment", desc: "No on-chain link between payer & tool" },
            { icon: "🛡️", label: "TEE-shielded", desc: "Execution inside hardware enclave" },
            { icon: "💨", label: "Ephemeral state", desc: "PER state is deleted after each call" },
            { icon: "📵", label: "No logs", desc: "Tool inputs never touch our servers" },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="bg-muted/30 rounded-lg p-2.5 border border-border">
              <div className="text-base mb-1">{icon}</div>
              <div className="text-xs font-medium text-foreground leading-tight">{label}</div>
              <div className="text-[10px] text-muted-foreground/70 leading-tight mt-0.5">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slide-arrow {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(200%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
