'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type VpKnackRevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger fade-in for direct children (card grids). */
  stagger?: boolean;
};

export default function VpKnackReveal({ children, className = '', stagger = false }: VpKnackRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => setVisible(true);
    setReady(true);

    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
    if (rect.top < viewportH && rect.bottom > 0) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '48px 0px 48px 0px' },
    );

    observer.observe(el);
    const failsafe = window.setTimeout(reveal, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  const classes = [
    'vp-knack-reveal',
    ready && !visible ? 'vp-knack-reveal--pending' : '',
    visible ? 'vp-knack-reveal--visible' : '',
    stagger ? 'vp-knack-reveal--stagger' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}
