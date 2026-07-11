'use client';

import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';

const MENU_GAP_PX = 4;
const MENU_MIN_SPACE_PX = 120;
const MENU_DEFAULT_MAX_HEIGHT_PX = 240;

export type VpSortMenuPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
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
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom - MENU_GAP_PX;
      const maxHeight = Math.max(
        MENU_MIN_SPACE_PX,
        Math.min(MENU_DEFAULT_MAX_HEIGHT_PX, spaceBelow),
      );

      setPosition({
        top: rect.bottom + MENU_GAP_PX,
        left: rect.left,
        width: rect.width,
        maxHeight,
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
