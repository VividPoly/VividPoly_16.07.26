import type { VividPolyState } from '@/hooks/useVividPoly';

/** 4px grid: 16px = 4 x 4px vertical travel on enter and exit. */
export const VP_PAGE_ENTER_OFFSET_PX = 16;
export const VP_PAGE_EXIT_OFFSET_PX = 16;

export const VP_PAGE_EXIT_MS = 200;
export const VP_PAGE_ENTER_MS = 300;
/** Stillness after exit before enter (mode="wait" + enter delay). */
export const VP_PAGE_ENTER_DELAY_MS = 100;

export const VP_PAGE_EASE_IN = [0.4, 0, 1, 1] as const;
export const VP_PAGE_EASE_OUT = [0, 0, 0.2, 1] as const;

export function getPageTransitionKey(state: Pick<
  VividPolyState,
  'screen' | 'pid' | 'cat' | 'samplePid' | 'sampleStep' | 'quoteStep'
>): string {
  switch (state.screen) {
    case 'pdp':
      return `pdp:${state.pid}`;
    case 'catalogue':
      return `catalogue:${state.cat}`;
    case 'sample':
      return `sample:${state.samplePid}:${state.sampleStep}`;
    case 'quote':
      return `quote:${state.quoteStep}`;
    default:
      return state.screen;
  }
}
