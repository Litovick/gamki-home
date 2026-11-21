import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { shouldRevealFromEntries } from '../utils/revealLogic';

interface RevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export function Reveal({
  children,
  delayMs = 0,
  className = '',
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (shouldRevealFromEntries(entries)) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const style = {
    '--reveal-delay': `${delayMs}ms`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      style={style}
      data-reveal-state={isVisible ? 'visible' : 'hidden'}
      className={`reveal-item ${isVisible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
