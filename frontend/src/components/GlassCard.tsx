import React from 'react';
import { cn } from '../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-border shadow-card',
        hover && 'transition-shadow duration-200 hover:shadow-card-hover',
        className
      )}
    >
      {children}
    </div>
  );
}
