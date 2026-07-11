'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import VpKnackProductCard from '@/components/vividpoly/VpKnackProductCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/vividpoly/VividPolyIcons';

export type KnackProductCarouselItem = {
  id: string;
  name: string;
  short: string;
  open: () => void;
};

type VpKnackProductCarouselProps = {
  products: KnackProductCarouselItem[];
  previousLabel?: string;
  nextLabel?: string;
};

const GAP_PX = 15;

export default function VpKnackProductCarousel({
  products,
  previousLabel = 'Previous products',
  nextLabel = 'Next products',
}: VpKnackProductCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateControls = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    setCanPrev(viewport.scrollLeft > 4);
    setCanNext(viewport.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateControls();

    const onScroll = () => updateControls();
    viewport.addEventListener('scroll', onScroll, { passive: true });

    const observer = new ResizeObserver(() => updateControls());
    observer.observe(viewport);

    return () => {
      viewport.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [products.length, updateControls]);

  const scrollByStep = useCallback((direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const firstCard = viewport.querySelector<HTMLElement>('.vp-prod-card--knack');
    const cardWidth = firstCard?.offsetWidth ?? viewport.clientWidth / 3;
    viewport.scrollBy({ left: direction * (cardWidth + GAP_PX), behavior: 'smooth' });
  }, []);

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
        <ChevronLeftIcon size={18} />
      </button>

      <div ref={viewportRef} className="vp-prod-carousel--knack-viewport" aria-label="Product types">
        <div className="vp-prod-carousel--knack-track">
          {products.map((product) => (
            <VpKnackProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              short={product.short}
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
        <ChevronRightIcon size={18} />
      </button>
    </div>
  );
}
