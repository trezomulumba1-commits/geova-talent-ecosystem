import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GeovaLogo } from '../GeovaLogo';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number; // duration in milliseconds
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  duration = 2400
}) => {
  const [visible, setVisible] = useState(true);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    // Phase 1: Wait for progress to fill up
    const zoomTimer = setTimeout(() => {
      setIsZooming(true);
      
      // Phase 2: After the zoom animation completes, unmount completely
      const completeTimer = setTimeout(() => {
        setVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, 1000); // 1s zoom animation

      return () => clearTimeout(completeTimer);
    }, duration);

    return () => clearTimeout(zoomTimer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="loading-screen"
          className="fixed inset-0 z-[9999] bg-[#040406] flex flex-col items-center justify-center p-6 overflow-hidden select-none"
          initial={{ opacity: 1 }}
          animate={{ 
            opacity: isZooming ? 0 : 1,
            pointerEvents: isZooming ? 'none' : 'auto'
          }}
          transition={{ 
            duration: 0.9, 
            ease: [0.76, 0, 0.24, 1] 
          }}
        >
          {/* Main loader container */}
          <div className="flex flex-col items-center max-w-sm w-full text-center space-y-12">
            
            {/* Pulsing glow ring behind logo - fades out on zoom */}
            <div className="relative flex items-center justify-center">
              <motion.div 
                className="absolute w-48 h-48 rounded-full bg-indigo-500/20 blur-2xl"
                animate={isZooming ? {
                  scale: 3,
                  opacity: 0,
                  filter: 'blur(40px)'
                } : {
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={isZooming ? {
                  duration: 0.8,
                  ease: 'easeOut'
                } : {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              
              {/* Geova Logo with rhythmic loading and cinematic zoom-through */}
              <motion.div
                animate={isZooming ? {
                  scale: 32, // Massively scale up to dive through the spaces
                  rotate: 8, // Subtle rotation on zoom for added dimensional physics
                  opacity: [1, 0.8, 0], // Fast fade out near the end of zoom
                } : {
                  scale: 1,
                  rotate: 0,
                  opacity: 1
                }}
                transition={{
                  duration: 0.95,
                  ease: [0.85, 0, 0.15, 1] // Apple-style cinematic ease-in-out curve
                }}
                className="z-10 origin-center"
              >
                <GeovaLogo 
                  size="xl" 
                  loading={!isZooming} // Disable rhythm bounce during exit zoom
                  className="filter drop-shadow-[0_10px_25px_rgba(99,102,241,0.25)]"
                />
              </motion.div>
            </div>

            {/* Loading text and UI elements - fade out when zoom starts */}
            <motion.div 
              className="space-y-6 z-10 w-full"
              animate={isZooming ? {
                opacity: 0,
                y: 15,
                scale: 0.9
              } : {
                opacity: 1,
                y: 0,
                scale: 1
              }}
              transition={{
                duration: 0.45,
                ease: 'easeInOut'
              }}
            >
              {/* Title */}
              <div className="space-y-2">
                <motion.h2 
                  className="font-display font-black text-3xl tracking-tight text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  GEOVA ECOSYSTEM
                </motion.h2>
                
                <p className="text-xs font-bold text-zinc-400 tracking-wider uppercase">
                  Technical Cohort Workspace
                </p>
              </div>

              {/* Progress bar container */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-52 bg-zinc-800/80 h-1 rounded-full overflow-hidden relative border border-zinc-700/30">
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-500 to-violet-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: duration / 1000, ease: 'easeInOut' }}
                  />
                </div>
                
                <span className="text-[10px] font-bold text-indigo-400/85 tracking-widest uppercase animate-pulse">
                  Synchronizing Systems...
                </span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
