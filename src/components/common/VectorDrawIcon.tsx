import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

export type VectorIconType = 
  | 'home'
  | 'dashboard'
  | 'hub'
  | 'discover'
  | 'compass'
  | 'collab'
  | 'users'
  | 'profile'
  | 'user'
  | 'student'
  | 'arena'
  | 'video'
  | 'library'
  | 'book'
  | 'architecture'
  | 'network'
  | 'review'
  | 'chart'
  | 'bell'
  | 'settings'
  | 'sun'
  | 'moon'
  | 'build'
  | 'showcase'
  | 'connect'
  | 'trending'
  | 'shield-check'
  | 'zap'
  | 'briefcase'
  | 'target'
  | 'sparkle';

export interface VectorDrawIconProps {
  name: VectorIconType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  badge?: boolean;
  badgeTheme?: 'neutral' | 'indigo' | 'emerald' | 'amber' | 'violet' | 'dark' | 'blue';
  strokeColor?: string;
  delay?: number;
  interactive?: boolean;
  active?: boolean;
  triggerKey?: string | number | boolean;
  onClick?: () => void;
}

export const VectorDrawIcon: React.FC<VectorDrawIconProps> = ({
  name,
  size = 'lg',
  className = '',
  badge = false,
  badgeTheme = 'neutral',
  strokeColor,
  delay = 0,
  interactive = true,
  active = false,
  triggerKey,
  onClick,
}) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (triggerKey !== undefined) {
      setAnimKey(prev => prev + 1);
    }
  }, [triggerKey]);

  // Animate on explicit user tap/click or mount
  const handleClick = (e: React.MouseEvent) => {
    setAnimKey(prev => prev + 1);
    if (onClick) onClick();
  };

  const dimMap = {
    xs: { box: 28, icon: 20, p: 'p-1', r: 'rounded-lg' },
    sm: { box: 34, icon: 20, p: 'p-1.5', r: 'rounded-xl' },
    md: { box: 42, icon: 24, p: 'p-2', r: 'rounded-xl' },
    lg: { box: 52, icon: 28, p: 'p-2.5', r: 'rounded-2xl' },
    xl: { box: 68, icon: 38, p: 'p-3.5', r: 'rounded-3xl' },
    '2xl': { box: 92, icon: 52, p: 'p-4.5', r: 'rounded-3xl' },
  }[size];

  // High contrast monochrome stroke calculation
  let stroke = strokeColor;
  if (!stroke) {
    if (active) {
      stroke = '#ffffff'; // Active buttons have dark/black backgrounds, so icon is white
    } else {
      stroke = isDark ? '#e4e4e7' : '#27272a'; // Dynamic crisp contrast for light (#27272a) and dark (#e4e4e7) modes
    }
  }

  const accent = isDark ? '#ffffff' : '#000000';
  const fill = active ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : 'none';

  const pathTransition = (pathDelay: number, duration: number = 19.0) => ({
    pathLength: {
      duration,
      ease: [0.25, 1, 0.5, 1],
      delay: delay + pathDelay * 5.0,
    },
    opacity: {
      duration: 3.5,
      delay: delay + pathDelay * 5.0,
    },
  });

  const renderIconPaths = () => {
    switch (name) {
      case 'home':
        return (
          <g key={`home-${animKey}`}>
            <motion.path
              d="M3 10.5L12 3l9 7.5"
              fill="none"
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.02, 0.4)}
            />
            <motion.path
              d="M5 9.5V20a1 1 0 001 1h12a1 1 0 001-1V9.5"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.1, 0.4)}
            />
            <motion.path
              d="M9 21v-6a1 1 0 011-1h4a1 1 0 011 1v6"
              fill="none"
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.2, 0.3)}
            />
          </g>
        );

      case 'dashboard':
      case 'hub':
        return (
          <g key={`dash-${animKey}`}>
            <motion.rect
              x="3"
              y="3"
              width="7.5"
              height="7.5"
              rx="2"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.02, 0.4)}
            />
            <motion.rect
              x="13.5"
              y="3"
              width="7.5"
              height="5"
              rx="2"
              fill="none"
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.08, 0.4)}
            />
            <motion.rect
              x="13.5"
              y="11"
              width="7.5"
              height="10"
              rx="2"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.14, 0.4)}
            />
            <motion.rect
              x="3"
              y="13.5"
              width="7.5"
              height="7.5"
              rx="2"
              fill="none"
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.2, 0.4)}
            />
          </g>
        );

      case 'discover':
      case 'compass':
        return (
          <g key={`disc-${animKey}`}>
            <motion.circle
              cx="12"
              cy="12"
              r="9"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.02, 0.4)}
            />
            <motion.polygon
              points="15.5,8.5 13.5,13.5 8.5,15.5 10.5,10.5"
              fill={fill}
              stroke={stroke}
              strokeWidth="2"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.1, 0.4)}
            />
            <motion.circle
              cx="12"
              cy="12"
              r="1.5"
              fill={stroke}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, duration: 0.2 }}
            />
          </g>
        );

      case 'collab':
      case 'users':
        return (
          <g key={`collab-${animKey}`}>
            <motion.circle
              cx="9"
              cy="7"
              r="3.5"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.05 }}
            />
            <motion.path
              d="M3 19a6 6 0 0112 0"
              fill="none"
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.1, 0.4)}
            />
            <motion.circle
              cx="16.5"
              cy="8"
              r="2.8"
              fill="none"
              stroke={stroke}
              strokeWidth="2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.15 }}
            />
            <motion.path
              d="M16 14.5a5 5 0 015 4.5"
              fill="none"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.2, 0.3)}
            />
          </g>
        );

      case 'profile':
      case 'user':
      case 'student':
        return (
          <g key={`prof-${animKey}`}>
            <motion.circle
              cx="12"
              cy="8"
              r="4.5"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.05 }}
            />
            <motion.path
              d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"
              fill="none"
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.1, 0.4)}
            />
          </g>
        );

      case 'arena':
      case 'video':
        return (
          <g key={`arena-${animKey}`}>
            <motion.rect
              x="2"
              y="5"
              width="14"
              height="14"
              rx="3"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.02, 0.4)}
            />
            <motion.path
              d="M16 10l5-3.5v11l-5-3.5"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.1, 0.4)}
            />
          </g>
        );

      case 'library':
      case 'book':
        return (
          <g key={`lib-${animKey}`}>
            <motion.path
              d="M4 19.5v-15A2.5 2.5 0 016.5 2H12v18H6.5A2.5 2.5 0 004 22z"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.02, 0.4)}
            />
            <motion.path
              d="M20 19.5v-15A2.5 2.5 0 0017.5 2H12v18h5.5a2.5 2.5 0 012.5 2z"
              fill="none"
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.1, 0.4)}
            />
          </g>
        );

      case 'architecture':
      case 'network':
        return (
          <g key={`arch-${animKey}`}>
            <motion.rect
              x="3"
              y="3"
              width="6"
              height="6"
              rx="1.5"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            />
            <motion.rect
              x="15"
              y="3"
              width="6"
              height="6"
              rx="1.5"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            />
            <motion.rect
              x="9"
              y="15"
              width="6"
              height="6"
              rx="1.5"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            />
            <motion.path
              d="M6 9v3h12V9 M12 12v3"
              fill="none"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.1, 0.3)}
            />
          </g>
        );

      case 'review':
      case 'chart':
        return (
          <g key={`rev-${animKey}`}>
            <motion.path
              d="M3 20h18"
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: 0.2 }}
              animate={{ pathLength: 1 }}
            />
            <motion.path
              d="M4 16l6-6 4 3 6-8"
              fill="none"
              stroke={stroke}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.05, 0.4)}
            />
            <motion.path
              d="M16 5h4v4"
              fill="none"
              stroke={stroke}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2 }}
              animate={{ pathLength: 1 }}
              transition={pathTransition(0.2, 0.3)}
            />
          </g>
        );

      case 'bell':
        return (
          <g key={`bell-${animKey}`}>
            <motion.path
              d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.02, 0.4)}
            />
            <motion.path
              d="M13.73 21a2 2 0 01-3.46 0"
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: 0.2 }}
              animate={{ pathLength: 1 }}
              transition={pathTransition(0.1, 0.3)}
            />
          </g>
        );

      case 'settings':
        return (
          <g key={`set-${animKey}`}>
            <motion.circle
              cx="12"
              cy="12"
              r="3"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            />
            <motion.path
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
              fill="none"
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.02, 0.5)}
            />
          </g>
        );

      case 'sun':
        return (
          <g key={`sun-${animKey}`}>
            <motion.circle
              cx="12"
              cy="12"
              r="4.5"
              fill={active ? stroke : 'none'}
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            />
            <motion.path
              d="M12 2v2.5 M12 19.5v2.5 M4.93 4.93l1.77 1.77 M17.3 17.3l1.77 1.77 M2 12h2.5 M19.5 12h2.5 M4.93 19.07l1.77-1.77 M17.3 6.7l1.77-1.77"
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.05, 0.4)}
            />
          </g>
        );

      case 'moon':
        return (
          <g key={`moon-${animKey}`}>
            <motion.path
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={pathTransition(0.02, 0.4)}
            />
          </g>
        );

      case 'target':
        return (
          <g key={`target-${animKey}`}>
            <motion.circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            />
            <motion.circle
              cx="12"
              cy="12"
              r="5"
              fill="none"
              stroke={stroke}
              strokeWidth="2.2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            />
            <motion.circle
              cx="12"
              cy="12"
              r="2"
              fill={stroke}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
            />
          </g>
        );

      default:
        return (
          <g key={`default-${animKey}`}>
            <motion.circle
              cx="12"
              cy="12"
              r="8"
              stroke={stroke}
              strokeWidth="2.2"
              fill="none"
              initial={{ pathLength: 0.2 }}
              animate={{ pathLength: 1 }}
            />
          </g>
        );
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer transition-transform duration-150 active:scale-95 ${className}`}
    >
      <svg
        width={dimMap.icon}
        height={dimMap.icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible pointer-events-none shrink-0"
      >
        {renderIconPaths()}
      </svg>
    </div>
  );
};
