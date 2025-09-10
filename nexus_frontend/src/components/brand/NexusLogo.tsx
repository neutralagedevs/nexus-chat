'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NexusLogoProps {
  variant?: 'full' | 'symbol' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'gradient';
  animated?: boolean;
  className?: string;
}

export const NexusLogo: React.FC<NexusLogoProps> = ({ 
  variant = 'full',
  size = 'md', 
  theme = 'light',
  animated = false,
  className = ''
}) => {
  
  const sizeMap = {
    sm: { width: 120, height: 32, symbolSize: 32, textSize: 'text-xl' },
    md: { width: 160, height: 40, symbolSize: 40, textSize: 'text-2xl' },
    lg: { width: 200, height: 50, symbolSize: 50, textSize: 'text-3xl' },
    xl: { width: 280, height: 70, symbolSize: 70, textSize: 'text-4xl' }
  };

  const dimensions = sizeMap[size];

  const colorMap = {
    light: {
      primary: '#6366f1',
      secondary: '#8b5cf6', 
      text: '#0f172a',
      nodes: '#6366f1'
    },
    dark: {
      primary: '#818cf8',
      secondary: '#a78bfa',
      text: '#f8fafc',
      nodes: '#818cf8'
    },
    gradient: {
      primary: 'url(#nexusGradient)',
      secondary: 'url(#nexusGradient)',
      text: '#0f172a',
      nodes: 'url(#nexusGradient)'
    }
  };

  const colors = colorMap[theme];

  // Animation variants
  const nodeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const connectionVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 0.6,
      transition: { 
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4,
        delay: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Nexus symbol - interconnected nodes forming an "N"
  const NexusSymbol = () => (
    <svg 
      width={dimensions.symbolSize} 
      height={dimensions.symbolSize} 
      viewBox="0 0 40 40"
      className="inline-block"
    >
      <defs>
        <linearGradient id="nexusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      
      {/* Connection lines */}
      <motion.path
        d="M8 8 L32 8 M8 8 L8 32 M32 8 L32 32 M8 32 L32 32 M8 8 L32 32"
        stroke={colors.nodes}
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
        variants={animated ? connectionVariants : {}}
        initial={animated ? "initial" : false}
        animate={animated ? "animate" : false}
      />
      
      {/* Main nodes forming "N" pattern */}
      <motion.circle
        cx="8" cy="8" r="3"
        fill={colors.primary}
        variants={animated ? nodeVariants : {}}
        initial={animated ? "initial" : false}
        animate={animated ? (animated ? "pulse" : "animate") : false}
        style={{ animationDelay: '0ms' }}
      />
      <motion.circle
        cx="32" cy="8" r="3"
        fill={colors.primary}
        variants={animated ? nodeVariants : {}}
        initial={animated ? "initial" : false}
        animate={animated ? (animated ? "pulse" : "animate") : false}
        style={{ animationDelay: '100ms' }}
      />
      <motion.circle
        cx="20" cy="20" r="3"
        fill={colors.secondary}
        variants={animated ? nodeVariants : {}}
        initial={animated ? "initial" : false}
        animate={animated ? (animated ? "pulse" : "animate") : false}
        style={{ animationDelay: '200ms' }}
      />
      <motion.circle
        cx="8" cy="32" r="3"
        fill={colors.primary}
        variants={animated ? nodeVariants : {}}
        initial={animated ? "initial" : false}
        animate={animated ? (animated ? "pulse" : "animate") : false}
        style={{ animationDelay: '300ms' }}
      />
      <motion.circle
        cx="32" cy="32" r="3"
        fill={colors.primary}
        variants={animated ? nodeVariants : {}}
        initial={animated ? "initial" : false}
        animate={animated ? (animated ? "pulse" : "animate") : false}
        style={{ animationDelay: '400ms' }}
      />
    </svg>
  );

  // Wordmark component
  const NexusWordmark = () => (
    <motion.div
      className={`font-bold tracking-tight ${dimensions.textSize}`}
      style={{ color: colors.text }}
      variants={animated ? textVariants : {}}
      initial={animated ? "initial" : false}
      animate={animated ? "animate" : false}
    >
      NEXUS
    </motion.div>
  );

  // Render based on variant
  const renderLogo = () => {
    switch (variant) {
      case 'symbol':
        return <NexusSymbol />;
      
      case 'wordmark':
        return <NexusWordmark />;
      
      case 'full':
      default:
        return (
          <div className="flex items-center space-x-3">
            <NexusSymbol />
            <NexusWordmark />
          </div>
        );
    }
  };

  return (
    <motion.div
      className={`inline-flex items-center ${className}`}
      style={{ 
        width: variant === 'symbol' ? dimensions.symbolSize : dimensions.width,
        height: dimensions.height 
      }}
      whileHover={animated ? { scale: 1.05 } : {}}
      transition={{ duration: 0.2 }}
    >
      {renderLogo()}
    </motion.div>
  );
};

// Convenience components for common use cases
export const NexusSymbolOnly: React.FC<Omit<NexusLogoProps, 'variant'>> = (props) => (
  <NexusLogo {...props} variant="symbol" />
);

export const NexusWordmarkOnly: React.FC<Omit<NexusLogoProps, 'variant'>> = (props) => (
  <NexusLogo {...props} variant="wordmark" />
);

export const NexusFullLogo: React.FC<Omit<NexusLogoProps, 'variant'>> = (props) => (
  <NexusLogo {...props} variant="full" />
);

// Loading indicator using the Nexus symbol
export const NexusLoadingIndicator: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'gradient';
}> = ({ size = 'md', theme = 'light' }) => (
  <div className="flex items-center justify-center">
    <NexusLogo 
      variant="symbol" 
      size={size} 
      theme={theme} 
      animated={true}
    />
  </div>
);

export default NexusLogo;