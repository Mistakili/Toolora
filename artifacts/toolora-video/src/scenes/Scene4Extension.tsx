import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Shield, Zap, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { icon: Wallet, label: 'Connect Phantom', desc: 'No signup. No email.', color: '#a78bfa' },
  { icon: Shield, label: 'Deposit USDC to PER', desc: 'MagicBlock ephemeral rollup', color: '#818cf8' },
  { icon: Zap, label: 'Sign private transfer', desc: '0.01 USDC — untraceable', color: '#6366f1' },
  { icon: CheckCircle2, label: 'Tool executes', desc: 'Result delivered. No logs.', color: '#4ade80' },
];

export default function Scene4Extension() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2400);
    const t4 = setTimeout(() => setPhase(4), 3600);
    const t5 = setTimeout(() => setPhase(5), 4800);
    const t6 = setTimeout(() => setPhase(6), 9000);
    return () => { [t1, t2, t3, t4, t5, t6].forEach(clearTimeout); };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 6 ? 0 : 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="text-center mb-[4vw]"
        initial={{ y: -40, opacity: 0 }}
        animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-[3vw] font-bold tracking-tight">
          <span className="text-gray-400">Pay privately. </span>
          <span className="text-gradient">Per call.</span>
        </div>
        <div className="font-mono text-[1.2vw] text-gray-500 mt-2">
          MagicBlock Private Ephemeral Rollup
        </div>
      </motion.div>

      {/* Step cards */}
      <div className="flex gap-[2vw] items-stretch w-[80vw]">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = phase >= i + 2;
          const isCurrent = phase === i + 2;
          return (
            <motion.div
              key={step.label}
              className="flex-1 rounded-[1.5vw] border flex flex-col items-center justify-center p-[2vw] gap-[1vw] relative overflow-hidden"
              style={{
                borderColor: isActive ? `${step.color}60` : 'rgba(255,255,255,0.07)',
                backgroundColor: isActive ? `${step.color}08` : 'rgba(255,255,255,0.02)',
              }}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.2, y: 20, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Pulse ring for current step */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-[1.5vw]"
                  style={{ boxShadow: `0 0 40px ${step.color}30` }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <div
                className="p-[1vw] rounded-[1vw]"
                style={{ backgroundColor: `${step.color}20`, color: step.color }}
              >
                <Icon className="w-[3vw] h-[3vw]" />
              </div>
              <div className="font-mono font-bold text-[1.2vw] text-center text-white">{step.label}</div>
              <div className="font-mono text-[0.9vw] text-gray-400 text-center">{step.desc}</div>

              {/* Number indicator */}
              <div
                className="absolute top-[1vw] right-[1vw] font-mono text-[0.8vw] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${step.color}20`, color: step.color }}
              >
                {i + 1}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Confirm banner */}
      <AnimatePresence>
        {phase >= 6 && (
          <motion.div
            className="mt-[3vw] flex items-center gap-3 px-6 py-3 rounded-full border border-green-400/30 bg-green-400/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle2 className="w-[1.5vw] h-[1.5vw] text-green-400" />
            <span className="font-mono text-[1.2vw] text-green-400">Payment verified on-chain · Tool executed · No logs</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
