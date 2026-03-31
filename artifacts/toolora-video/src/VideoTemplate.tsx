import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Scene1Logo from './scenes/Scene1Logo';
import Scene2Privacy from './scenes/Scene2Privacy';
import Scene3Tools from './scenes/Scene3Tools';
import Scene4Extension from './scenes/Scene4Extension';
import Scene5CTA from './scenes/Scene5CTA';

const SCENE_DURATIONS = [8000, 10000, 12000, 10000, 5000];

export default function VideoTemplate() {
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentScene((prev) => (prev + 1) % SCENE_DURATIONS.length);
    }, SCENE_DURATIONS[currentScene]);

    return () => clearTimeout(timeout);
  }, [currentScene]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background font-display text-text flex items-center justify-center perspective-[1000px]">
      {/* Cinematic persistent background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          scale: [1, 1.05, 1],
          opacity: currentScene === 1 ? 0.2 : currentScene === 3 ? 0.1 : 0.3
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <video 
          src="/src/assets/videos/dark-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Noise grain overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      ></div>

      {/* Global persistent brand accent */}
      <motion.div
        className="absolute rounded-full blur-[120px] pointer-events-none"
        animate={{
          width: currentScene === 0 ? '40vw' : currentScene === 4 ? '60vw' : '20vw',
          height: currentScene === 0 ? '40vw' : currentScene === 4 ? '60vw' : '20vw',
          background: currentScene % 2 === 0 ? 'rgba(124, 58, 237, 0.15)' : 'rgba(236, 72, 153, 0.15)',
          top: currentScene === 2 ? '10%' : currentScene === 4 ? '50%' : '50%',
          left: currentScene === 3 ? '80%' : '50%',
          x: '-50%',
          y: '-50%'
        }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Scene Content */}
      <AnimatePresence mode="sync">
        {currentScene === 0 && <Scene1Logo key="scene1" />}
        {currentScene === 1 && <Scene2Privacy key="scene2" />}
        {currentScene === 2 && <Scene3Tools key="scene3" />}
        {currentScene === 3 && <Scene4Extension key="scene4" />}
        {currentScene === 4 && <Scene5CTA key="scene5" />}
      </AnimatePresence>
    </div>
  );
}