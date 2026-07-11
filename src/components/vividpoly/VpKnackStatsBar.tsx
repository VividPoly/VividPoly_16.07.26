'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export type KnackStatItem = {
  value: string;
  label: string;
};

type VpKnackStatsBarProps = {
  stats: KnackStatItem[];
  ariaLabel?: string;
};

type ParsedStat = {
  target: number;
  suffix: string;
};

function parseStatValue(value: string): ParsedStat {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { target: 0, suffix: value };
  }

  return {
    target: Number(match[1]),
    suffix: match[2] ?? '',
  };
}

function KnackStatValue({ value, start }: { value: string; start: boolean }) {
  const reducedMotion = useReducedMotion();
  const { target, suffix } = parseStatValue(value);
  const [current, setCurrent] = useState(reducedMotion ? target : 0);

  useEffect(() => {
    if (!start) {
      setCurrent(reducedMotion ? target : 0);
      return;
    }

    if (reducedMotion) {
      setCurrent(target);
      return;
    }

    const duration = 1800;
    const startTime = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCurrent(Math.round(target * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [start, target, reducedMotion]);

  return (
    <>
      {current}
      {suffix}
    </>
  );
}

export default function VpKnackStatsBar({
  stats,
  ariaLabel = 'Company highlights',
}: VpKnackStatsBarProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!stats.length) return null;

  return (
    <section ref={ref} className="vp-knack-stats-bar" aria-label={ariaLabel}>
      <div className="vp-knack-stats-bar-inner">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="vp-knack-stats-bar-item"
            aria-label={`${stat.value} ${stat.label}`}
          >
            <p className="vp-knack-stats-bar-value" aria-hidden="true">
              <KnackStatValue value={stat.value} start={active} />
            </p>
            <p className="vp-knack-stats-bar-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
