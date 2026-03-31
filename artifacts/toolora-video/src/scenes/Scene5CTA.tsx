import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Scene5CTA() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500); // Domain reveals
    const t2 = setTimeout(() => setPhase(2), 1500); // Subtitle
    const t3 = setTimeout(() => setPhase(3), 2500); // Product hunt
    const t4 = setTimeout(() => setPhase(4), 4500); // Pulse / exit
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
      {/* Background massive glow */}
      <motion.div
        className="absolute w-[60vw] h-[60vw] rounded-full bg-primary/20 blur-[100px] -z-10"
        initial={{ scale: 0 }}
        animate={phase >= 1 ? { scale: 1 } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <motion.div
        className="font-display font-bold text-[8vw] text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tighter leading-none"
        initial={{ y: 50, opacity: 0, rotateX: 45 }}
        animate={phase >= 1 ? { y: 0, opacity: 1, rotateX: 0 } : {}}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        toolora.dev
      </motion.div>

      <motion.div
        className="font-mono text-[2.5vw] text-accent mt-4 tracking-widest"
        initial={{ opacity: 0, letterSpacing: '0em' }}
        animate={phase >= 2 ? { opacity: 1, letterSpacing: '0.2em' } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        FREE. FOREVER.
      </motion.div>

      <motion.div
        className="mt-12 border border-white/10 bg-white/5 rounded-xl p-4 px-8 flex items-center gap-4 backdrop-blur-sm relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, type: "spring" }}
      >
        {/* Shine effect */}
        <motion.div 
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
          initial={{ x: '-200%' }}
          animate={phase >= 3 ? { x: '300%' } : {}}
          transition={{ duration: 1.5, delay: 3, ease: "easeInOut" }}
        />
        
        <div className="w-[3vw] h-[3vw] bg-[#FF6154] rounded-full flex items-center justify-center font-bold text-white text-[1.5vw]">
          P
        </div>
        <div className="flex flex-col">
          <span className="text-[1vw] text-gray-400 font-mono uppercase tracking-wider text-left">Featured on</span>
          <span className="text-[1.8vw] font-bold leading-none">Product Hunt</span>
        </div>
      </motion.div>
    </motion.div>
  );
}