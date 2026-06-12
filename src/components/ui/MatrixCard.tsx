import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface MatrixCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const MatrixCard: React.FC<MatrixCardProps> = ({ 
  title, 
  subtitle, 
  children, 
  className,
  delay = 0,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className={cn(
        "glass-card p-6 relative group",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[1px] h-4 bg-primary/40 group-hover:h-full transition-all duration-500" />
        <div className="absolute top-0 right-0 w-4 h-[1px] bg-primary/40 group-hover:w-full transition-all duration-500" />
      </div>

      {(title || subtitle) && (
        <div className="mb-6">
          {subtitle && (
            <span className="text-[10px] text-primary/70 font-mono uppercase tracking-[0.3em] mb-1 block">
              {subtitle}
            </span>
          )}
          {title && (
            <h3 className="text-xl font-display font-bold tracking-tight text-white group-hover:text-primary transition-colors">
              {title}
            </h3>
          )}
        </div>
      )}

      <div className="relative z-10">
        {children}
      </div>

      {/* Grid background subtleness */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-[0.03] pointer-events-none" />
    </motion.div>
  );
};
