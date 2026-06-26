'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
  );
}

export function useFocusTrap(
  active: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
  onEscape?: () => void,
) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const container = containerRef.current;

    const focusInitial = () => {
      const items = getFocusable(container);
      const target = items.find((el) => el.hasAttribute('autofocus')) ?? items[0];
      target?.focus();
    };

    const timer = window.setTimeout(focusInitial, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = getFocusable(container);
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeEl === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [active, containerRef, onEscape]);
}
