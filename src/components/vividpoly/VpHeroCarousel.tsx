'use client';

import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import VpPhotoSlot from '@/components/vividpoly/VpPhotoSlot';

export type HeroSlide = {
  src: string;
  alt: string;
  /** Natural width / height ratio, used to size the frame so nothing is cropped. */
  ratio?: number;
};

type VpHeroCarouselProps = {
  slides: HeroSlide[];
  intervalMs?: number;
  className?: string;
};

/**
 * Auto-advancing hero product showcase. Uses a fixed square frame and a
 * horizontal slide track so the shell never resizes between cards. Images use
 * object-fit: contain so posters are never cropped. Dots below the frame are clickable.
 */
export default function VpHeroCarousel({
  slides,
  intervalMs = 4200,
  className = '',
}: VpHeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [frameRatio, setFrameRatio] = useState(slides[0]?.ratio ?? 1);

  useEffect(() => {
    if (typeof window === 'undefined' || !slides.length) return;

    let cancelled = false;

    const measureSlides = async () => {
      const ratios = await Promise.all(
        slides.map((slide) => new Promise<number>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              resolve(img.naturalWidth / img.naturalHeight);
              return;
            }
            resolve(slide.ratio ?? 1);
          };
          img.onerror = () => resolve(slide.ratio ?? 1);
          img.src = slide.src;
        })),
      );

      if (cancelled || !ratios.length) return;

      // One shared frame for every slide: use the widest measured ratio so
      // portrait posters fill the width without side gutters inside the frame.
      setFrameRatio(Math.max(...ratios));
    };

    measureSlides();

    return () => {
      cancelled = true;
    };
  }, [slides]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || paused || reduceMotion) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [slides.length, paused, intervalMs, reduceMotion]);

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= slides.length) return;
    setActive(index);
  }, [slides.length]);

  return (
    <div
      className={`vp-hero-carousel-shell ${className}`.trim()}
      style={{ '--vp-hero-carousel-ratio': String(frameRatio) } as CSSProperties}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="VIVIDPOLY flagship products"
    >
      <div className="vp-hero-carousel" aria-live="polite">
        <div
          className="vp-hero-carousel-track"
          style={{ transform: `translate3d(-${active * 100}%, 0, 0)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.src}
              className="vp-hero-carousel-slide"
              aria-hidden={index !== active}
            >
              <VpPhotoSlot
                src={slide.src}
                alt={slide.alt}
                variant="hero"
                className="vp-hero-carousel-img"
              />
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="vp-hero-carousel-dots" role="tablist" aria-label="Choose product slide">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={slide.alt}
              className={`vp-hero-carousel-dot${index === active ? ' vp-hero-carousel-dot--active' : ''}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
