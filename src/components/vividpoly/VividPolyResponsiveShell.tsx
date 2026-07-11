'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * True CSS reflow below REFLOW_BREAKPOINT.
 * Matches Knack Packaging Navigation.js mobileBreakpoint (1000).
 */
const REFLOW_BREAKPOINT = 1000;

export default function VividPolyResponsiveShell({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<'reflow' | 'full'>('reflow');

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let rafId = 0;

    const clear = () => {
      inner.style.width = '';
      inner.style.maxWidth = '';
      inner.style.transform = '';
      inner.style.transformOrigin = '';
      outer.style.height = '';
      outer.style.minHeight = '';
      document.documentElement.removeAttribute('data-vp-layout');
      document.documentElement.style.removeProperty('--vp-preview-scale');
    };

    const apply = () => {
      const available = outer.clientWidth;
      if (!available) return;

      clear();

      if (available < REFLOW_BREAKPOINT) {
        setLayout('reflow');
      } else {
        setLayout('full');
      }
    };

    const scheduleApply = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(apply);
      });
    };

    const retryIfHidden = () => {
      if (outer.clientWidth > 0) return;
      window.setTimeout(scheduleApply, 50);
      window.setTimeout(scheduleApply, 250);
    };

    scheduleApply();
    retryIfHidden();

    const ro = new ResizeObserver(scheduleApply);
    ro.observe(outer);

    const onLoad = () => scheduleApply();
    window.addEventListener('load', onLoad);
    window.addEventListener('resize', scheduleApply);
    document.fonts?.ready?.then(scheduleApply).catch(() => {});

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('load', onLoad);
      window.removeEventListener('resize', scheduleApply);
      document.documentElement.removeAttribute('data-vp-layout');
      document.documentElement.style.removeProperty('--vp-preview-scale');
    };
  }, []);

  const innerClass = layout === 'reflow' ? 'vp-site vp-site--mobile' : 'vp-site vp-site--full';

  return (
    <div ref={outerRef} className="vp-viewport">
      <div ref={innerRef} className={innerClass}>
        {children}
      </div>
    </div>
  );
}
