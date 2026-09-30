import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { VectorDrawIcon, VectorIconType } from './VectorDrawIcon';
import { useTheme } from '../../context/ThemeContext';

interface AnimatedIconProps {
  icon?: LucideIcon;
  vectorName?: VectorIconType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  variant?: 'outline-draw' | 'blueprint' | 'badge' | 'minimal' | 'pulse';
  badgeColor?: 'indigo' | 'blue' | 'emerald' | 'amber' | 'violet' | 'dark' | 'none';
  strokeColor?: string;
  delay?: number;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon: IconComponent,
  vectorName,
  size = 'md',
  className = '',
  variant = 'outline-draw',
  badgeColor = 'none',
  strokeColor,
  delay = 0,
}) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
  }[size];

  const badgeSizes = {
    xs: 'w-6 h-6 p-1 rounded-md',
    sm: 'w-8 h-8 p-1.5 rounded-lg',
    md: 'w-10 h-10 p-2 rounded-xl',
    lg: 'w-12 h-12 p-2.5 rounded-2xl',
    xl: 'w-16 h-16 p-3.5 rounded-3xl',
    '2xl': 'w-20 h-20 p-4 rounded-3xl',
  }[size];

  const badgeBgMap = {
    indigo: 'bg-gradient-to-br from-[#eff4ff] to-[#e0e7ff] text-[#3525cd] dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-100 border border-[#c7d2fe] dark:border-zinc-700 shadow-[0_4px_16px_rgba(53,37,205,0.12)]',
    blue: 'bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-100 border border-sky-200 dark:border-zinc-700 shadow-[0_4px_16px_rgba(2,132,199,0.12)]',
    emerald: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-100 border border-emerald-200 dark:border-zinc-700 shadow-[0_4px_16px_rgba(5,150,105,0.12)]',
    amber: 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-100 border border-amber-200 dark:border-zinc-700 shadow-[0_4px_16px_rgba(217,119,6,0.12)]',
    violet: 'bg-gradient-to-br from-violet-50 to-violet-100 text-violet-600 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-100 border border-violet-200 dark:border-zinc-700 shadow-[0_4px_16px_rgba(124,58,237,0.12)]',
    dark: 'bg-gradient-to-br from-[#0b1c30] to-[#1e293b] text-white border border-[#334155] shadow-[0_4px_16px_rgba(11,28,48,0.3)]',
    none: '',
  }[badgeColor];

  const boxDim = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    '2xl': 80,
  }[size];

  const activeStroke = strokeColor || (isDark ? '#e4e4e7' : '#3525cd');

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-10px', amount: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center select-none ${
        badgeColor !== 'none' ? `${badgeSizes} ${badgeBgMap}` : ''
      } ${className}`}
    >
      {/* SVG Line-Drawing Laser Outline Trace */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox={`0 0 ${boxDim} ${boxDim}`}
        fill="none"
      >
        {variant !== 'minimal' && (
          <motion.rect
            x="1.5"
            y="1.5"
            width={boxDim - 3}
            height={boxDim - 3}
            rx={size === 'xl' || size === '2xl' ? 20 : size === 'lg' ? 14 : 8}
            fill="none"
            stroke={activeStroke}
            strokeWidth="1.5"
            strokeDasharray="80"
            variants={{
              hidden: {
                pathLength: 0,
                strokeDashoffset: 80,
                opacity: 0,
              },
              visible: {
                pathLength: 1,
                strokeDashoffset: 0,
                opacity: [0, 0.9, 0.3],
                transition: {
                  pathLength: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
                  strokeDashoffset: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
                  opacity: { duration: 1.2, delay },
                },
              },
            }}
          />
        )}
      </svg>

      {/* Main Icon Body with Entrance Scale & Smooth Drawing settling */}
      <motion.div
        variants={{
          hidden: {
            scale: 0.5,
            opacity: 0,
            filter: 'blur(2px)',
          },
          visible: {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
              type: 'spring',
              stiffness: 320,
              damping: 22,
              delay: delay + 0.1,
            },
          },
        }}
        whileHover={{
          scale: 1.15,
          rotate: [0, -6, 6, 0],
          transition: { duration: 0.3 },
        }}
        className="relative z-10 flex items-center justify-center"
      >
        {IconComponent ? (
          <IconComponent className={`${iconSizes} transition-colors duration-200`} />
        ) : vectorName ? (
          <VectorDrawIcon
            name={vectorName}
            size={size === 'xs' ? 'sm' : size}
            strokeColor={isDark ? '#e4e4e7' : '#3525cd'}
            delay={delay}
          />
        ) : null}
      </motion.div>
    </motion.div>
  );
};

