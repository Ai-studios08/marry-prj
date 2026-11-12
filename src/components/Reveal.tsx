import type { ReactNode } from 'react';
import { useReveal } from '../lib/useReveal';

export function Reveal({
  children,
  delayMs = 0,
  className = '',
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>(delayMs);
  return (
    <div ref={ref} className={`reveal-item ${className}`}>
      {children}
    </div>
  );
}
