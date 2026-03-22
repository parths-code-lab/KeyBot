import React from 'react';
import { cn } from './ui/utils';

interface GlassmorphCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle';
}

export function GlassmorphCard({ 
  children, 
  className, 
  variant = 'default',
  onClick,
  ...props
}: GlassmorphCardProps) {
  const baseClasses = "backdrop-blur-xl border border-white/20 dark:border-white/10";
  
  const variantClasses = {
    default: "bg-white/10 dark:bg-white/5",
    elevated: "bg-white/20 dark:bg-white/10 shadow-xl",
    subtle: "bg-white/5 dark:bg-white/5"
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        "rounded-3xl overflow-hidden",
        className
      )}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}