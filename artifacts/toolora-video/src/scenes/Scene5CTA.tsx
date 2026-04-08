import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Scene5CTA() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2200);
    const t4 = setTimeout(() => setPhase(4), 3400);
    return () => { [t1, t2, t3, t4].forEach(clearTimeout); };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 w-full h-full bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
      transition={{ duration: 1 }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute w-[60vw] h-[60vw] rounded-full blur-[120px] -z-10"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(99,102,241,0.1) 50%, transparent 70%)' }}
        initial={{ scale: 0 }}
        animate={phase >= 1 ? { scale: 1 } : {}}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      {/* Hackathon badge */}
      <motion.div
        className="mb-[2vw] px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 font-mono text-[1vw] text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        ⚡ Colosseum Frontier Hackathon · Privacy Track · MagicBlock
      </motion.div>

      {/* Main title */}
      <motion.div
        className="font-bold text-[5.5vw] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tighter leading-none text-center"
        initial={{ y: 50, opacity: 0, rotateX: 45 }}
        animate={phase >= 1 ? { y: 0, opacity: 1, rotateX: 0 } : {}}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        Toolora Private
      </motion.div>

      <motion.div
        className="font-mono text-[1.8vw] text-gray-400 mt-3 tracking-wide text-center"
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        Privacy-first · Pay per call · MCP-ready
      </motion.div>

      {/* URL pill */}
      <motion.div
        className="mt-[3vw] px-8 py-3 rounded-xl border border-primary/40 bg-primary/10 font-mono text-[2vw] text-primary font-bold"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={phase >= 3 ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        toolora.dev/private
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mt-[2.5vw] flex gap-[3vw] items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {[
          { value: '11', label: 'private tools' },
          { value: '0.01', label: 'USDC per call' },
          { value: 'MCP', label: 'AI agent ready' },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="font-mono text-[2.5vw] font-bold text-white">{value}</div>
            <div className="font-mono text-[1vw] text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
