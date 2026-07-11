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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = [
    'vp-knack-reveal',
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
