'use client';

import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';

export type VpSortMenuPosition = {
  top: number;
  left: number;
  width: number;
};

function getTriggerElement(root: HTMLElement | null) {
  if (!root) return null;
  return root.querySelector<HTMLElement>('.vp-sort-trigger, .vp-sort-trigger--custom');
}

export function useVpSortMenuPortal(open: boolean, rootRef: RefObject<HTMLElement | null>) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<VpSortMenuPosition | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const trigger = getTriggerElement(rootRef.current);
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, rootRef]);

  return { mounted, position };
}
