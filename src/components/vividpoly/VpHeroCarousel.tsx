'use client';

import { useEffect, useState, type CSSProperties } from 'react';
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
 * Auto-advancing hero image showcase. Cross-fades between the flagship product
 * photos, pauses on hover and when the tab is hidden, and falls back to a single
 * static image when the user prefers reduced motion.
 */
export default function VpHeroCarousel({
  slides,
  intervalMs = 4200,
  className = '',
}: VpHeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    if (typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [slides.length, paused, intervalMs]);

  const activeRatio = slides[active]?.ratio ?? 0.78;
  const frameStyle = { '--vp-hero-slide-ratio': String(activeRatio) } as CSSProperties;

  return (
    <div
      className={`vp-hero-carousel ${className}`.trim()}
      style={frameStyle}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="VIVIDPOLY flagship products"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`vp-hero-carousel-slide${index === active ? ' vp-hero-carousel-slide--active' : ''}`}
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
  );
}
