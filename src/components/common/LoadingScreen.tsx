import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GeovaLogo } from '../GeovaLogo';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  duration = 2000,
}) => {
  const [visible, setVisible] = useState(true);
  const [isZooming, setIsZooming] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress counter
    const stepMs = 30;
    const increment = 100 / (duration / stepMs);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(100, prev + increment);
      });
    }, stepMs);

    // Zoom-through phase
    const zoomTimer = setTimeout(() => {
      setIsZooming(true);

      const completeTimer = setTimeout(() => {
        setVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, 750);

      return () => clearTimeout(completeTimer);
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(zoomTimer);
    };
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="loading-screen"
          className="fixed inset-0 z-[9999] bg-[#030712] flex flex-col items-center justify-center p-6 overflow-hidden select-none"
          initial={{ opacity: 1 }}
          animate={{
            opacity: isZooming ? 0 : 1,
            pointerEvents: isZooming ? 'none' : 'auto',
          }}
          transition={{
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Animated Background Mesh & Glow Rays */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl"
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
          </div>

          <div className="relative flex flex-col items-center max-w-sm w-full text-center space-y-10 z-10">
            {/* Logo container with reactive luminescence */}
            <div className="relative flex items-center justify-center">
              {/* Radial aura behind logo */}
              <motion.div
                className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-indigo-500/25 to-sky-400/20 blur-3xl"
                animate={
                  isZooming
                    ? {
                        scale: 4,
                        opacity: 0,
                      }
                    : {
                        scale: [1, 1.15, 1],
                        opacity: [0.5, 0.85, 0.5],
                      }
                }
                transition={
                  isZooming
                    ? { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
                    : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                }
              />

              {/* GEOVA Emblem */}
              <motion.div
                animate={
                  isZooming
                    ? {
                        scale: 24,
                        rotate: 6,
                        opacity: [1, 0.7, 0],
                      }
                    : {
                        scale: 1,
                        rotate: 0,
                        opacity: 1,
                      }
                }
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="z-10 origin-center"
              >
                <GeovaLogo
                  size="xl"
                  loading={!isZooming}
                  className="filter drop-shadow-[0_12px_32px_rgba(99,102,241,0.35)]"
                />
              </motion.div>
            </div>

            {/* Typography & Liquid Progress Bar */}
            <motion.div
              className="space-y-6 w-full"
              animate={
                isZooming
                  ? {
                      opacity: 0,
                      y: 12,
                      scale: 0.95,
                    }
                  : {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }
              }
              transition={{
                duration: 0.4,
                ease: 'easeOut',
              }}
            >
              <div className="space-y-1.5">
                <motion.h1
                  className="font-display font-black text-3xl tracking-tight text-white drop-shadow-sm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  GEOVA ECOSYSTEM
                </motion.h1>
                <p className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                  Technical Talent & Preparation Platform
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2.5">
                <div className="w-56 bg-zinc-900 h-1.5 rounded-full overflow-hidden relative border border-zinc-800 shadow-inner">
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-500 via-sky-400 to-violet-500 rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>

                <div className="flex items-center justify-between w-56 text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                  <span className="text-indigo-400 animate-pulse">
                    {progress < 100 ? 'Initialising Cohort...' : 'Ready'}
                  </span>
                  <span className="font-mono text-zinc-400">{Math.round(progress)}%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
