import type React from "react";
import { cn } from "../lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className,
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl transition-all duration-300 ease-material-standard",
        hover && "hover:translate-y-[-2px] cursor-default",
        className,
      )}
    >
      {children}
    </div>
  );
}
