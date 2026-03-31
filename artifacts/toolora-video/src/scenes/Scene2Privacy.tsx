import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, UploadCloud, ShieldCheck } from 'lucide-react';

export default function Scene2Privacy() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500); // Shield reveal
    const t2 = setTimeout(() => setPhase(2), 2000); // No uploads
    const t3 = setTimeout(() => setPhase(3), 3500); // No servers
    const t4 = setTimeout(() => setPhase(4), 5000); // No tracking
    const t5 = setTimeout(() => setPhase(5), 7000); // Comparison
    const t6 = setTimeout(() => setPhase(6), 9000); // Exit
    return () => { [t1, t2, t3, t4, t5, t6].forEach(clearTimeout); };
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10 w-full h-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: phase === 6 ? 0 : 1, y: phase === 6 ? -50 : 0 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top Section: Icon & Headline */}
      <div className="flex flex-col items-center mb-12 relative z-20">
        <motion.div
          initial={{ scale: 0, rotateX: 90 }}
          animate={phase >= 1 ? { scale: 1, rotateX: 0 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-[12vw] h-[12vw] rounded-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center mb-8 border border-primary/30 glow-primary"
        >
          {/* We use our generated shield image here */}
          <img src="/src/assets/images/shield.png" alt="Shield" className="w-[80%] h-[80%] object-contain" />
        </motion.div>

        <div className="flex flex-col items-center space-y-4 font-mono text-[3vw] font-bold text-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center space-x-4"
          >
            <span className="text-red-400">{"//"}</span>
            <span>No uploads.</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center space-x-4"
          >
            <span className="text-red-400">{"//"}</span>
            <span>No servers.</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center space-x-4 text-accent"
          >
            <span className="text-primary">{"//"}</span>
            <span>No tracking.</span>
          </motion.div>
        </div>
      </div>

      {/* Comparison Section */}
      <motion.div 
        className="w-[60vw] h-[15vw] flex gap-8 items-center justify-center mt-8 relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={phase >= 5 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Competitor */}
        <div className="flex-1 h-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-red-500/50" />
          <UploadCloud className="w-[4vw] h-[4vw] text-red-400 mb-4" />
          <span className="text-[1.5vw] font-mono text-gray-400">Other Tools</span>
          <div className="mt-4 flex items-center space-x-2 text-red-400 text-[1vw]">
            <XCircle className="w-[1.2vw] h-[1.2vw]" />
            <span>Data sent to cloud</span>
          </div>
        </div>

        <div className="text-[2vw] text-gray-500 font-mono italic">VS</div>

        {/* Toolora */}
        <div className="flex-1 h-full bg-primary/10 border border-primary/30 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden glow-primary">
          <div className="absolute top-0 w-full h-1 bg-primary" />
          <ShieldCheck className="w-[4vw] h-[4vw] text-primary mb-4" />
          <span className="text-[1.5vw] font-display font-bold text-white">Toolora</span>
          <div className="mt-4 flex items-center space-x-2 text-green-400 text-[1vw]">
            <CheckCircle2 className="w-[1.2vw] h-[1.2vw]" />
            <span>Processed locally</span>
          </div>
          
          {/* Matrix green rain effect inside Toolora card */}
          <motion.div 
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent,rgba(124,58,237,0.2),transparent)]"
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}