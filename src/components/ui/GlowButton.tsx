import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlowButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const GlowButton: React.FC<GlowButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className,
  ...props 
}) => {
  const variants = {
    primary: "bg-primary text-background hover:bg-white",
    outline: "bg-transparent border border-primary/50 text-primary hover:bg-primary/10",
    ghost: "bg-transparent text-muted hover:text-white hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative px-6 py-2.5 rounded-lg font-display text-sm font-bold uppercase tracking-widest transition-all duration-300",
        variants[variant],
        variant === 'primary' && "shadow-[0_0_20px_rgba(0,245,255,0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
