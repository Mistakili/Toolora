import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Image as ImageIcon, Key, QrCode, Binary, FileText } from 'lucide-react';

const tools = [
  { name: 'JSON Formatter', icon: Code2, color: '#3b82f6' },
  { name: 'PDF Merger', icon: FileText, color: '#ef4444' },
  { name: 'Image Compressor', icon: ImageIcon, color: '#10b981' },
  { name: 'Password Gen', icon: Key, color: '#f59e0b' },
  { name: 'QR Generator', icon: QrCode, color: '#8b5cf6' },
  { name: 'Base64 Encoder', icon: Binary, color: '#ec4899' },
];

export default function Scene3Tools() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500); // Title
    const t2 = setTimeout(() => setPhase(2), 1500); // Cards fly in
    const t3 = setTimeout(() => setPhase(3), 8500); // Highlight all / pulse
    const t4 = setTimeout(() => setPhase(4), 11000); // Exit
    return () => { [t1, t2, t3, t4].forEach(clearTimeout); };
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10 w-full h-full"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: phase === 4 ? 0 : 1, scale: phase === 4 ? 0.9 : 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="text-[4vw] font-display font-bold mb-12 tracking-tight text-center"
        initial={{ y: 50, opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
        animate={phase >= 1 ? { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)' } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-gray-400">100+ tools. </span>
        <span className="text-gradient">Zero wait time.</span>
      </motion.div>

      <div className="grid grid-cols-3 gap-[2vw] w-[80vw] mx-auto perspective-[1200px]">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.name}
              initial={{ 
                opacity: 0, 
                z: -500, 
                rotateX: Math.random() * 60 - 30,
                rotateY: Math.random() * 60 - 30,
                x: (Math.random() - 0.5) * 500,
                y: (Math.random() - 0.5) * 500
              }}
              animate={phase >= 2 ? { 
                opacity: 1, 
                z: 0, 
                rotateX: 0, 
                rotateY: 0,
                x: 0,
                y: 0,
                scale: phase >= 3 ? 1.05 : 1,
                boxShadow: phase >= 3 ? `0 0 30px ${tool.color}40` : '0 0 0px transparent'
              } : {}}
              transition={{ 
                duration: 1.2, 
                delay: index * 0.15 + (phase >= 2 && phase < 3 ? 0 : 0),
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="bg-white/[0.03] border border-white/10 rounded-[1.5vw] p-[2vw] flex flex-col items-center justify-center gap-[1vw] backdrop-blur-md"
              style={{
                transformStyle: 'preserve-3d'
              }}
            >
              <div 
                className="p-[1vw] rounded-xl"
                style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
              >
                <Icon className="w-[3vw] h-[3vw]" />
              </div>
              <span className="font-mono text-[1.2vw] font-medium text-white">{tool.name}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}