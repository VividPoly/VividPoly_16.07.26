'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  VP_PAGE_EASE_IN,
  VP_PAGE_EASE_OUT,
  VP_PAGE_ENTER_DELAY_MS,
  VP_PAGE_ENTER_MS,
  VP_PAGE_ENTER_OFFSET_PX,
  VP_PAGE_EXIT_MS,
  VP_PAGE_EXIT_OFFSET_PX,
} from '@/lib/vp-page-transition';

type VpRouteOutletProps = {
  screenKey: string;
  children: ReactNode;
  /** Skip the enter animation on first paint. */
  suppressInitialEnter?: boolean;
};

/**
 * Site-wide page transitions: outgoing fade + rise, incoming fade + rise from below.
 * Wraps main page content only (not header, modals, drawers, or the enquiry FAB).
 */
export default function VpRouteOutlet({
  screenKey,
  children,
  suppressInitialEnter = false,
}: VpRouteOutletProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        className="vp-route-outlet"
        style={{ willChange: 'opacity, transform' }}
        initial={
          reduceMotion || suppressInitialEnter
            ? false
            : { opacity: 0, y: VP_PAGE_ENTER_OFFSET_PX }
        }
        animate={
          reduceMotion
            ? { opacity: 1, y: 0 }
            : {
                opacity: 1,
                y: 0,
                transition: {
                  opacity: {
                    duration: VP_PAGE_ENTER_MS / 1000,
                    ease: VP_PAGE_EASE_OUT,
                    delay: VP_PAGE_ENTER_DELAY_MS / 1000,
                  },
                  y: {
                    duration: VP_PAGE_ENTER_MS / 1000,
                    ease: VP_PAGE_EASE_OUT,
                    delay: VP_PAGE_ENTER_DELAY_MS / 1000,
                  },
                },
              }
        }
        exit={
          reduceMotion
            ? { opacity: 1, y: 0 }
            : {
                opacity: 0,
                y: -VP_PAGE_EXIT_OFFSET_PX,
                transition: {
                  opacity: {
                    duration: VP_PAGE_EXIT_MS / 1000,
                    ease: VP_PAGE_EASE_IN,
                  },
                  y: {
                    duration: VP_PAGE_EXIT_MS / 1000,
                    ease: VP_PAGE_EASE_IN,
                  },
                },
              }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
