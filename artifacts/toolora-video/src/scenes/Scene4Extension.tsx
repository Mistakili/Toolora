import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MousePointer2 } from 'lucide-react';

export default function Scene4Extension() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500); // Browser appears
    const t2 = setTimeout(() => setPhase(2), 2000); // Text selected
    const t3 = setTimeout(() => setPhase(3), 3500); // Right click menu appears
    const t4 = setTimeout(() => setPhase(4), 5500); // Hover over "Open in Toolora"
    const t5 = setTimeout(() => setPhase(5), 6500); // Click and transition to popup
    const t6 = setTimeout(() => setPhase(6), 9000); // Exit
    return () => { [t1, t2, t3, t4, t5, t6].forEach(clearTimeout); };
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10 w-full h-full perspective-[1500px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 6 ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="text-center absolute top-[8%] w-full z-20"
        initial={{ y: -50, opacity: 0 }}
        animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
      >
        <h2 className="text-[3vw] font-display font-bold">Always at your fingertips.</h2>
      </motion.div>

      {/* Browser Mockup */}
      <motion.div
        className="w-[70vw] h-[40vw] bg-[#1a1a1a] rounded-xl border border-white/20 shadow-2xl overflow-hidden relative"
        initial={{ rotateX: 20, y: 100, opacity: 0, scale: 0.8 }}
        animate={phase >= 1 ? { 
          rotateX: phase >= 5 ? 0 : 5, 
          y: phase >= 5 ? 20 : 0, 
          opacity: 1, 
          scale: phase >= 5 ? 1.1 : 1 
        } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Browser Header */}
        <div className="h-[3vw] bg-[#2a2a2a] flex items-center px-4 border-b border-white/10 gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 mx-4 bg-[#1a1a1a] rounded-md h-[2vw] flex items-center px-4 text-white/50 font-mono text-[0.8vw]">
            https://example.com/api-response
          </div>
          <div className="w-[2vw] h-[2vw] bg-primary/20 rounded flex items-center justify-center text-primary font-bold font-mono text-[1vw]">
            T.
          </div>
        </div>

        {/* Browser Content */}
        <div className="p-8 font-mono text-[1.2vw] text-white/80 leading-relaxed">
          <pre>
            {`{
  "user": {
    "id": "usr_98237492",`}
            <motion.span 
              className="inline-block relative"
              animate={phase >= 2 ? { backgroundColor: 'rgba(59, 130, 246, 0.4)' } : {}}
              transition={{ duration: 0.3 }}
            >
              {"    \"token\": \"eyJo...\","}
              {/* Context Menu */}
              <AnimatePresence>
                {phase >= 3 && phase < 5 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 50, y: 10 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute z-50 bg-[#2d2d2d] border border-white/10 rounded-lg shadow-xl w-[15vw] py-2 overflow-hidden"
                  >
                    <div className="px-4 py-2 text-[1vw] text-white/80 hover:bg-white/10 cursor-default">Copy</div>
                    <div className="px-4 py-2 text-[1vw] text-white/80 hover:bg-white/10 cursor-default">Inspect</div>
                    <div className="h-px bg-white/10 my-1"></div>
                    <motion.div 
                      className="px-4 py-2 text-[1vw] flex items-center gap-2 cursor-default"
                      animate={phase >= 4 ? { backgroundColor: 'rgba(124, 58, 237, 1)', color: '#fff' } : { backgroundColor: 'transparent', color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center font-bold text-[0.6vw]">T</div>
                      Open in Toolora
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.span>
            {`
    "role": "admin"
  }
}`}
          </pre>
        </div>

        {/* Fake Cursor */}
        <motion.div 
          className="absolute z-50 text-white drop-shadow-lg"
          initial={{ x: '60vw', y: '30vw', opacity: 0 }}
          animate={
            phase === 0 ? { x: '60vw', y: '30vw', opacity: 0 } :
            phase === 1 ? { x: '40vw', y: '20vw', opacity: 1 } :
            phase === 2 ? { x: '20vw', y: '12vw', opacity: 1 } :
            phase === 3 ? { x: '20vw', y: '12vw', opacity: 1 } :
            phase === 4 ? { x: '25vw', y: '16vw', opacity: 1 } :
            { x: '25vw', y: '16vw', opacity: 0 }
          }
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <MousePointer2 className="w-[2vw] h-[2vw] fill-white" />
        </motion.div>

        {/* Toolora Extension Popup Reveal */}
        <AnimatePresence>
          {phase >= 5 && (
            <motion.div
              className="absolute right-4 top-2 z-50 w-[24vw] h-[32vw] bg-[#09090b] border border-white/20 rounded-xl shadow-2xl flex flex-col"
              initial={{ opacity: 0, y: -20, scale: 0.9, originX: 1, originY: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-[2vw] h-[2vw] bg-primary rounded flex items-center justify-center font-bold text-white text-[1.2vw]">T</div>
                <span className="font-display font-bold text-[1.2vw]">Toolora</span>
              </div>
              {/* Search */}
              <div className="p-3">
                <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center gap-2">
                  <Search className="w-[1vw] h-[1vw] text-white/50" />
                  <span className="font-mono text-[0.9vw] text-white/50">Search tools...</span>
                </div>
              </div>
              {/* Tool Auto-opened */}
              <div className="flex-1 p-3 pt-0 flex flex-col gap-2">
                <div className="text-[0.9vw] font-mono text-primary mb-1">JWT Decoder</div>
                <div className="flex-1 bg-[#1a1a1a] rounded border border-white/10 p-2 font-mono text-[0.7vw] text-green-400 break-all overflow-hidden">
                  {"{\n  \"alg\": \"HS256\",\n  \"typ\": \"JWT\"\n}\n\n{\n  \"sub\": \"1234567890\",\n  \"name\": \"John Doe\",\n  \"iat\": 1516239022\n}"}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}