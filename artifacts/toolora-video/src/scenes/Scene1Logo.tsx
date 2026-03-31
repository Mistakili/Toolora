import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Scene1Logo() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1000); // Logo forms
    const t2 = setTimeout(() => setPhase(2), 2500); // Tagline types
    const t3 = setTimeout(() => setPhase(3), 6000); // Exit starts
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const tagline = "Your data never leaves your browser";

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 3 ? 0 : 1, scale: phase === 3 ? 1.5 : 1, filter: phase === 3 ? 'blur(20px)' : 'blur(0px)' }}
      exit={{ opacity: 0, scale: 2, filter: 'blur(30px)' }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, letterSpacing: '0.2em' }}
          animate={phase >= 1 ? { scale: 1, opacity: 1, letterSpacing: '-0.02em' } : {}}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-[8vw] font-bold tracking-tighter"
        >
          Toolora<span className="text-accent">.</span>
        </motion.div>
        
        {/* Glow behind text */}
        <motion.div
          className="absolute inset-0 bg-primary blur-[80px] -z-10"
          initial={{ opacity: 0, scale: 0 }}
          animate={phase >= 1 ? { opacity: 0.3, scale: 1.2 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>

      <div className="mt-6 h-[2vw] flex overflow-hidden font-mono text-[1.5vw] text-gray-400">
        {tagline.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.1, delay: i * 0.03 + (phase >= 2 ? 0 : 5) }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>
      
      {/* Particle effect around logo */}
      {phase >= 1 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary"
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{ 
                x: (Math.random() - 0.5) * 600, 
                y: (Math.random() - 0.5) * 400,
                scale: [0, Math.random() * 2 + 1, 0],
                opacity: [1, 0]
              }}
              transition={{ duration: 2 + Math.random() * 2, ease: "easeOut" }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}