'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import VpKnackProductCard from '@/components/vividpoly/VpKnackProductCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/vividpoly/VividPolyIcons';

export type KnackProductCarouselItem = {
  id: string;
  name: string;
  short: string;
  open: () => void;
  imageSrc?: string;
};

type VpKnackProductCarouselProps = {
  products: KnackProductCarouselItem[];
  previousLabel?: string;
  nextLabel?: string;
  ariaLabel?: string;
};

/** Airbnb photo-indicator window: never more than 5 circles on screen. */
const MAX_VISIBLE_DOTS = 5;
/** Must match CSS: .vp-prod-carousel--knack-dot width+horizontal margins. */
const DOT_SLOT_PX = 12;

/**
 * Airbnb-style status circles:
 * Keep every dot mounted, slide the track, and scale edge dots.
 * Remounting a sliced window causes the jumpy animation users reported.
 */
function getAirbnbDotsState(total: number, active: number) {
  if (total <= 1) {
    return { windowStart: 0, visibleCount: 0, scales: [] as number[] };
  }

  if (total <= MAX_VISIBLE_DOTS) {
    return {
      windowStart: 0,
      visibleCount: total,
      scales: Array.from({ length: total }, (_, index) => (index === active ? 1 : 0.67)),
    };
  }

  const maxStart = total - MAX_VISIBLE_DOTS;
  const windowStart = Math.max(0, Math.min(active - 2, maxStart));
  const hasBefore = windowStart > 0;
  const hasAfter = windowStart < maxStart;
  const scales = Array.from({ length: total }, (_, index) => {
    const pos = index - windowStart;
    if (pos < 0 || pos >= MAX_VISIBLE_DOTS) return 0;
    if (index === active) return 1;
    if ((hasBefore && pos === 0) || (hasAfter && pos === MAX_VISIBLE_DOTS - 1)) return 0.33;
    if ((hasBefore && pos === 1) || (hasAfter && pos === MAX_VISIBLE_DOTS - 2)) return 0.5;
    return 0.67;
  });

  return { windowStart, visibleCount: MAX_VISIBLE_DOTS, scales };
}

export default function VpKnackProductCarousel({
  products,
  previousLabel = 'Previous products',
  nextLabel = 'Next products',
  ariaLabel = 'Product types',
}: VpKnackProductCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const getCards = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return [];
    return Array.from(viewport.querySelectorAll<HTMLElement>('.vp-prod-card--knack'));
  }, []);

  const updateControls = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    setCanPrev(viewport.scrollLeft > 4);
    setCanNext(maxScroll > 4 && viewport.scrollLeft < maxScroll - 4);

    const cards = getCards();
    if (!cards.length) return;

    const scrollLeft = viewport.scrollLeft;
    let closest = 0;
    let minDist = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const dist = Math.abs(card.offsetLeft - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = index;
      }
    });
    setActiveIndex(closest);
  }, [getCards]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateControls();
    const frame = window.requestAnimationFrame(updateControls);

    const onScroll = () => updateControls();
    viewport.addEventListener('scroll', onScroll, { passive: true });

    const observer = new ResizeObserver(() => updateControls());
    observer.observe(viewport);

    return () => {
      window.cancelAnimationFrame(frame);
      viewport.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [products.length, updateControls]);

  const scrollByStep = useCallback((direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const cards = getCards();
    if (!cards.length) return;

    const nextIndex = Math.max(0, Math.min(cards.length - 1, activeIndex + direction));
    const target = cards[nextIndex];
    if (!target) return;
    viewport.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  }, [activeIndex, getCards]);

  const scrollToIndex = useCallback((index: number) => {
    const viewport = viewportRef.current;
    const card = getCards()[index];
    if (!viewport || !card) return;
    viewport.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  }, [getCards]);

  const dotsState = useMemo(
    () => getAirbnbDotsState(products.length, activeIndex),
    [products.length, activeIndex],
  );

  const dotsViewportWidth = dotsState.visibleCount * DOT_SLOT_PX;
  const dotsTrackOffset = -(dotsState.windowStart * DOT_SLOT_PX);

  if (!products.length) return null;

  return (
    <div className="vp-prod-carousel--knack">
      <button
        type="button"
        className="vp-prod-carousel--knack-arrow vp-prod-carousel--knack-arrow--prev"
        onClick={() => scrollByStep(-1)}
        disabled={!canPrev}
        aria-label={previousLabel}
      >
        <ChevronLeftIcon size={20} />
      </button>

      <div ref={viewportRef} className="vp-prod-carousel--knack-viewport" aria-label={ariaLabel}>
        <div className="vp-prod-carousel--knack-track">
          {products.map((product) => (
            <VpKnackProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              short={product.short}
              imageSrc={product.imageSrc}
              onClick={product.open}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        className="vp-prod-carousel--knack-arrow vp-prod-carousel--knack-arrow--next"
        onClick={() => scrollByStep(1)}
        disabled={!canNext}
        aria-label={nextLabel}
      >
        <ChevronRightIcon size={20} />
      </button>

      {products.length > 1 ? (
        <div
          className="vp-prod-carousel--knack-dots"
          role="tablist"
          aria-label={`${ariaLabel} status`}
        >
          <div
            className="vp-prod-carousel--knack-dots-window"
            style={{ width: dotsViewportWidth }}
          >
            <div
              className="vp-prod-carousel--knack-dots-track"
              style={{ transform: `translate3d(${dotsTrackOffset}px, 0, 0)` }}
            >
              {products.map((product, index) => {
                const isActive = index === activeIndex;
                const scale = dotsState.scales[index] ?? 0;
                return (
                  <button
                    key={product.id}
                    type="button"
                    role="tab"
                    className={`vp-prod-carousel--knack-dot${isActive ? ' vp-prod-carousel--knack-dot--active' : ''}`}
                    style={{ transform: `scale(${scale})` }}
                    aria-label={`Go to ${product.name}`}
                    aria-selected={isActive}
                    aria-hidden={scale === 0}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => scrollToIndex(index)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
