import React from 'react';
import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  label: string;
  status?: 'active' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  label, 
  status = 'active', 
  className 
}) => {
  const statusColors = {
    active: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    neutral: "bg-primary",
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.15em] font-mono text-muted",
      className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", statusColors[status])} />
      {label}
    </div>
  );
};
