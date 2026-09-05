import React, { useState } from 'react';
import { motion } from 'motion/react';

interface GeovaLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  width?: number;
  height?: number;
  animated?: boolean;
  isScrolled?: boolean;
  loading?: boolean;
}

export const GeovaLogo: React.FC<GeovaLogoProps> = ({
  className = '',
  size = 'md',
  width,
  height,
  animated = true,
  isScrolled = false,
  loading = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Preset pixel dimensions for the 3-strip emblem
  const dimensions = {
    xs: { w: 24, h: 27 },
    sm: { w: 36, h: 40 },
    md: { w: 52, h: 58 },
    lg: { w: 80, h: 88 },
    xl: { w: 120, h: 132 },
    '2xl': { w: 180, h: 198 },
    custom: { w: width || 52, h: height || 58 },
  }[size];

  const w = width || dimensions.w;
  const h = height || dimensions.h;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none group cursor-pointer ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={
        isHovered
          ? { scale: 1.06, y: -2 }
          : isScrolled
          ? { scale: 0.95, y: 0 }
          : { scale: 1, y: 0 }
      }
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
    >
      {/* Dynamic Iris Glow Aura on Hover */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 via-sky-400/20 to-violet-500/20 blur-xl pointer-events-none"
        animate={{
          opacity: isHovered ? 0.9 : 0.25,
          scale: isHovered ? 1.4 : 1,
        }}
        transition={{ duration: 0.35 }}
      />
      <motion.svg
        width={w}
        height={h}
        viewBox="0 0 120 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block shrink-0 overflow-visible"
        aria-label="GEOVA Logo"
      >
        <defs>
          {/* Strip 1 (Left): Light Silver Gray to Medium Gray */}
          <linearGradient id="geova-strip1-face" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3f4f6" />
            <stop offset="50%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          <linearGradient id="geova-strip1-side" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>

          {/* Strip 2 (Center): Neutral Charcoal Gray to Dark Slate */}
          <linearGradient id="geova-strip2-face" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="50%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>
          <linearGradient id="geova-strip2-side" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>

          {/* Strip 3 (Right): Dark Slate to Pitch Black */}
          <linearGradient id="geova-strip3-face" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="50%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          <linearGradient id="geova-strip3-side" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          {/* Laser Contour Gradient for Line Drawing Animation */}
          <linearGradient id="geova-laser-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3525cd" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          {/* Subtle drop shadow */}
          <filter id="geova-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodOpacity="0.25" />
          </filter>
        </defs>

        <motion.g filter="url(#geova-shadow)">
          {/* STRIP 1 (Left - Light Gray) */}
          <motion.g
            initial={animated ? { y: 20, opacity: 0 } : false}
            animate={
              loading
                ? {
                    y: [0, -18, 0],
                    opacity: 1,
                  }
                : {
                    y: isHovered ? -5 : 0,
                    opacity: 1,
                  }
            }
            transition={
              loading
                ? {
                    duration: 1.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0,
                  }
                : {
                    type: 'spring',
                    stiffness: 280,
                    damping: 18,
                    delay: 0.05,
                  }
            }
          >
            {/* 3D Side Bevel */}
            <polygon
              points="44,22 52,28 36,116 28,110"
              fill="url(#geova-strip1-side)"
            />
            {/* Front Face */}
            <polygon
              points="28,34 44,22 28,110 12,122"
              fill="url(#geova-strip1-face)"
            />

            {/* Glowing Laser Outline Drawing on Strip 1 */}
            {animated && (
              <motion.polygon
                points="28,34 44,22 28,110 12,122"
                fill="none"
                stroke="url(#geova-laser-line)"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 1],
                  opacity: [0, 1, isHovered ? 1 : 0.2],
                }}
                transition={{
                  duration: 1.2,
                  ease: 'easeInOut',
                  delay: 0.1,
                }}
              />
            )}
          </motion.g>

          {/* STRIP 2 (Center - Charcoal) */}
          <motion.g
            initial={animated ? { y: 20, opacity: 0 } : false}
            animate={
              loading
                ? {
                    y: [0, -18, 0],
                    opacity: 1,
                  }
                : {
                    y: isHovered ? -8 : 0,
                    opacity: 1,
                  }
            }
            transition={
              loading
                ? {
                    duration: 1.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.2, // Staggered delay
                  }
                : {
                    type: 'spring',
                    stiffness: 280,
                    damping: 18,
                    delay: 0.12,
                  }
            }
          >
            {/* 3D Side Bevel */}
            <polygon
              points="74,8 82,14 66,106 58,100"
              fill="url(#geova-strip2-side)"
            />
            {/* Front Face */}
            <polygon
              points="58,20 74,8 58,100 42,112"
              fill="url(#geova-strip2-face)"
            />

            {/* Glowing Laser Outline Drawing on Strip 2 */}
            {animated && (
              <motion.polygon
                points="58,20 74,8 58,100 42,112"
                fill="none"
                stroke="url(#geova-laser-line)"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 1],
                  opacity: [0, 1, isHovered ? 1 : 0.2],
                }}
                transition={{
                  duration: 1.2,
                  ease: 'easeInOut',
                  delay: 0.2,
                }}
              />
            )}
          </motion.g>

          {/* STRIP 3 (Right - Dark to Black) */}
          <motion.g
            initial={animated ? { y: 20, opacity: 0 } : false}
            animate={
              loading
                ? {
                    y: [0, -18, 0],
                    opacity: 1,
                  }
                : {
                    y: isHovered ? -4 : 0,
                    opacity: 1,
                  }
            }
            transition={
              loading
                ? {
                    duration: 1.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.4, // Staggered delay
                  }
                : {
                    type: 'spring',
                    stiffness: 280,
                    damping: 18,
                    delay: 0.19,
                  }
            }
          >
            {/* 3D Side Bevel */}
            <polygon
              points="104,2 112,8 96,98 88,92"
              fill="url(#geova-strip3-side)"
            />
            {/* Front Face */}
            <polygon
              points="88,14 104,2 88,92 72,104"
              fill="url(#geova-strip3-face)"
            />

            {/* Glowing Laser Outline Drawing on Strip 3 */}
            {animated && (
              <motion.polygon
                points="88,14 104,2 88,92 72,104"
                fill="none"
                stroke="url(#geova-laser-line)"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 1],
                  opacity: [0, 1, isHovered ? 1 : 0.2],
                }}
                transition={{
                  duration: 1.2,
                  ease: 'easeInOut',
                  delay: 0.28,
                }}
              />
            )}
          </motion.g>
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};
