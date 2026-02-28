import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  accent?: 'cyan' | 'magenta' | 'emerald' | 'amber';
  hover?: boolean;
  onClick?: () => void;
}

const accentStyles = {
  cyan: {
    border: 'border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-500/70',
    glow: 'hover:shadow-glow-cyan',
    bg: 'bg-navy-600',
  },
  magenta: {
    border: 'border-techmagenta-500/30',
    hoverBorder: 'hover:border-techmagenta-500/70',
    glow: 'hover:shadow-glow-magenta',
    bg: 'bg-navy-600',
  },
  emerald: {
    border: 'border-techemerald-500/30',
    hoverBorder: 'hover:border-techemerald-500/70',
    glow: 'hover:shadow-glow-emerald',
    bg: 'bg-navy-600',
  },
  amber: {
    border: 'border-techamber-500/30',
    hoverBorder: 'hover:border-techamber-500/70',
    glow: 'hover:shadow-glow-amber',
    bg: 'bg-navy-600',
  },
};

export default function GlassCard({
  children,
  className,
  accent = 'cyan',
  hover = true,
  onClick,
}: GlassCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-card border shadow-card-dark',
        'bg-gradient-to-br from-navy-600 to-navy-700',
        styles.border,
        hover && [styles.hoverBorder, styles.glow, 'hover:-translate-y-1'],
        'transition-all duration-300 ease-out',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
