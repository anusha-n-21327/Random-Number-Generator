import React from 'react';
import { cn } from '@/lib/utils';

interface BubbleProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Bubble: React.FC<BubbleProps> = ({ className, style }) => {
  return (
    <div
      className={cn(
        'absolute rounded-full bg-primary/20 animate-bubble-pop',
        className
      )}
      style={style}
    />
  );
};