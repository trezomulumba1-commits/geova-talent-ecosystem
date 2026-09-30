import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GeovaLogo } from '../GeovaLogo';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  duration = 1800,
}) => {
  const [visible, setVisible] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    // Trigger cinematic reveal transition
    const revealTimer = setTimeout(() => {
      setIsRevealing(true);

      const unmountTimer = setTimeout(() => {
        setVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, 700); // 700ms smooth curtain fade

      return () => clearTimeout(unmountTimer);
    }, duration);

    return () => clearTimeout(revealTimer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="loading-screen"
          className="fixed inset-0 z-[9999] pointer-events-none select-none flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Top Curtain / Backdrop Slide */}
          <motion.div
            className="absolute inset-0 bg-[#030712] z-0"
            animate={
              isRevealing
                ? {
                    opacity: 0,
                    scale: 1.05,
                    filter: 'blur(16px)',
                  }
                : {
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                  }
            }
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Ambient Luminescence Glow behind Logo */}
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-600/30 via-indigo-400/20 to-violet-600/30 blur-3xl z-10"
            animate={
              isRevealing
                ? {
                    scale: 2.2,
                    opacity: 0,
                  }
                : {
                    scale: [0.95, 1.2, 0.95],
                    opacity: [0.4, 0.85, 0.4],
                  }
            }
            transition={
              isRevealing
                ? { duration: 0.6, ease: 'easeOut' }
                : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }
          />

          {/* Main Logo Container - Pure Logo as the Loader */}
          <div className="relative z-20 flex flex-col items-center justify-center space-y-6">
            <motion.div
              animate={
                isRevealing
                  ? {
                      scale: 0.85,
                      y: -24,
                      opacity: 0,
                      filter: 'blur(10px)',
                    }
                  : {
                      scale: 1,
                      y: 0,
                      opacity: 1,
                      filter: 'blur(0px)',
                    }
              }
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="origin-center"
            >
              {/* Geova Emblem acting as the live rhythmic loader */}
              <GeovaLogo
                size="2xl"
                loading={!isRevealing}
                className="filter drop-shadow-[0_16px_40px_rgba(99,102,241,0.45)]"
              />
            </motion.div>

            {/* Elegant Minimalist Title */}
            <motion.div
              className="text-center space-y-1"
              animate={
                isRevealing
                  ? { opacity: 0, y: 10 }
                  : { opacity: 1, y: 0 }
              }
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white drop-shadow-md">
                GEOVA
              </h1>
              <p className="text-[11px] font-bold text-indigo-400/90 tracking-widest uppercase">
                Talent & Technical Ecosystem
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
