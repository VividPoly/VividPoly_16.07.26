'use client';

import { useEffect, useRef, useState, type MutableRefObject, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useVividPoly } from '@/hooks/useVividPoly';
import { bindAllHovers } from '@/lib/vividpoly-style';
import VpQuoteSuccess from '@/components/vividpoly/VpQuoteSuccess';
import VpQuoteLeadCaptured from '@/components/vividpoly/VpQuoteLeadCaptured';
import VpBagSpecForm from '@/components/vividpoly/VpBagSpecForm';
import VpQuoteContactForm, { quoteContactFromQuote } from '@/components/vividpoly/VpQuoteContactForm';
import VpQuoteContactSheet from '@/components/vividpoly/VpQuoteContactSheet';
import VpCustomSelect from '@/components/vividpoly/VpCustomSelect';
import VpPdpDetails from '@/components/vividpoly/VpPdpDetails';
import VpSampleCheckout from '@/components/vividpoly/VpSampleCheckout';
import VpBlogPage from '@/components/vividpoly/VpBlogPage';
import VpFaqAccordion from '@/components/vividpoly/VpFaqAccordion';
import VpSubpageTop from '@/components/vividpoly/VpSubpageTop';
import VpLogo from '@/components/vividpoly/VpLogo';
import VpCapacityFilter from '@/components/vividpoly/VpCapacityFilter';
import VpSortSelect from '@/components/vividpoly/VpSortSelect';
import VpCatalogueGuideTooltip from '@/components/vividpoly/VpCatalogueGuideTooltip';
import {
  jumpChildIntoHorizontalView,
  scrollChildIntoHorizontalView,
  scrollPageToTop,
} from '@/lib/vividpoly-navigation';
import { WhatsAppIcon } from '@/components/vividpoly/VividPolyIcons';

const BUYER_SWIPE_MAX_WIDTH = 1366;
const VALUE_PROPS_LOOP_GUARD_MS = 80;
const BUYER_LOOP_GUARD_MS = 80;

function useValuePropsMobileCarousel(
  listRef: RefObject<HTMLDivElement | null>,
  showHome: boolean,
  cardCount: number,
) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const fromSwipeRef = useRef(false);
  const loopingRef = useRef(false);
  const loopGuardTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  activeIdxRef.current = activeIdx;

  useEffect(() => {
    const list = listRef.current;
    if (!list || !showHome) return;
    if (typeof window === 'undefined' || !window.matchMedia('(max-width: 1024px)').matches) return;

    const realCards = () =>
      Array.from(list.querySelectorAll<HTMLElement>('.vp-value-prop:not(.vp-value-prop--loop-clone)'));

    const loopToRealCard = (realIdx: number) => {
      const card = realCards()[realIdx];
      if (!card) return;

      if (loopGuardTimerRef.current) clearTimeout(loopGuardTimerRef.current);
      loopingRef.current = true;
      fromSwipeRef.current = true;
      activeIdxRef.current = realIdx;
      setActiveIdx(realIdx);

      const prevBehavior = list.style.scrollBehavior;
      list.style.scrollBehavior = 'auto';
      jumpChildIntoHorizontalView(list, card);
      list.style.scrollBehavior = prevBehavior;

      loopGuardTimerRef.current = setTimeout(() => {
        loopingRef.current = false;
      }, VALUE_PROPS_LOOP_GUARD_MS);
    };

    let scrollTimer: ReturnType<typeof setTimeout> | undefined;

    const settleScroll = () => {
      if (loopingRef.current) return;

      const clone = list.querySelector<HTMLElement>('.vp-value-prop--loop-clone');
      const maxScroll = Math.max(0, list.scrollWidth - list.clientWidth);

      if (clone && maxScroll > 0 && list.scrollLeft >= maxScroll - 16) {
        loopToRealCard(0);
        return;
      }

      const cards = realCards();
      if (!cards.length) return;

      const trackRect = list.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });

      if (bestIdx !== activeIdxRef.current) {
        fromSwipeRef.current = true;
        activeIdxRef.current = bestIdx;
        setActiveIdx(bestIdx);
      }
    };

    const onScroll = () => {
      if (loopingRef.current) return;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(settleScroll, 150);
    };

    list.addEventListener('scroll', onScroll, { passive: true });
    list.addEventListener('scrollend', settleScroll, { passive: true });

    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      if (loopGuardTimerRef.current) clearTimeout(loopGuardTimerRef.current);
      list.removeEventListener('scroll', onScroll);
      list.removeEventListener('scrollend', settleScroll);
    };
  }, [showHome, cardCount, listRef]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !showHome) return;
    if (typeof window === 'undefined' || !window.matchMedia('(max-width: 1024px)').matches) return;

    if (fromSwipeRef.current) {
      fromSwipeRef.current = false;
      return;
    }

    const card = list.querySelectorAll<HTMLElement>('.vp-value-prop:not(.vp-value-prop--loop-clone)')[activeIdx];
    if (card) scrollChildIntoHorizontalView(list, card);
  }, [activeIdx, showHome, listRef]);

  return { activeIdx, setActiveIdx, scrollFromSwipeRef: fromSwipeRef };
}

function useBuyerSwipeCarousel(
  carouselRef: RefObject<HTMLDivElement | null>,
  detailTrackRef: RefObject<HTMLDivElement | null>,
  activeBuyer: number,
  buyerCount: number,
  showHome: boolean,
  buyerDots: Array<{ pick?: () => void }>,
  activeBuyerRef: MutableRefObject<number>,
  scrollFromSwipeRef: MutableRefObject<boolean>,
) {
  const buyerLoopingRef = useRef(false);
  const loopGuardTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prevActiveBuyerRef = useRef(activeBuyer);

  useEffect(() => {
    if (!showHome) return;
    prevActiveBuyerRef.current = activeBuyer;
  }, [showHome]);

  useEffect(() => {
    if (!showHome) return;
    if (typeof window === 'undefined' || window.innerWidth > BUYER_SWIPE_MAX_WIDTH) return;
    if (prevActiveBuyerRef.current === activeBuyer) return;

    const prevBuyer = prevActiveBuyerRef.current;
    prevActiveBuyerRef.current = activeBuyer;

    if (scrollFromSwipeRef.current) {
      scrollFromSwipeRef.current = false;
      return;
    }

    const isMobile = window.innerWidth <= 1023;
    const container = isMobile ? carouselRef.current : detailTrackRef.current;
    if (!container) return;

    const realSlideSelector = isMobile
      ? '.vp-buyer-slide:not(.vp-buyer-slide--loop-clone)'
      : '.vp-buyer-detail-slide:not(.vp-buyer-detail-slide--loop-clone)';
    const slide = container.querySelectorAll<HTMLElement>(realSlideSelector)[activeBuyer];
    if (!slide) return;

    const wrappedForward = prevBuyer === buyerCount - 1 && activeBuyer === 0;
    if (wrappedForward) {
      const prevBehavior = container.style.scrollBehavior;
      container.style.scrollBehavior = 'auto';
      jumpChildIntoHorizontalView(container, slide);
      container.style.scrollBehavior = prevBehavior;
      return;
    }

    scrollChildIntoHorizontalView(container, slide);
  }, [activeBuyer, buyerCount, showHome, carouselRef, detailTrackRef, scrollFromSwipeRef]);

  useEffect(() => {
    if (!showHome) return;

    const attach = (
      container: HTMLElement,
      realSlideSelector: string,
      loopCloneSelector: string,
    ) => {
      const getRealSlides = () => Array.from(container.querySelectorAll<HTMLElement>(realSlideSelector));
      const getLoopClone = () => container.querySelector<HTMLElement>(loopCloneSelector);
      let scrollTimer: ReturnType<typeof setTimeout> | undefined;

      const loopToSlide = (realIdx: number) => {
        const slide = getRealSlides()[realIdx];
        if (!slide) return;

        if (loopGuardTimerRef.current) clearTimeout(loopGuardTimerRef.current);
        buyerLoopingRef.current = true;
        scrollFromSwipeRef.current = true;
        activeBuyerRef.current = realIdx;
        buyerDots[realIdx]?.pick?.();

        const prevBehavior = container.style.scrollBehavior;
        container.style.scrollBehavior = 'auto';
        jumpChildIntoHorizontalView(container, slide);
        container.style.scrollBehavior = prevBehavior;

        loopGuardTimerRef.current = setTimeout(() => {
          buyerLoopingRef.current = false;
        }, BUYER_LOOP_GUARD_MS);
      };

      const settleScroll = () => {
        if (buyerLoopingRef.current) return;

        const clone = getLoopClone();
        const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);

        if (clone && maxScroll > 0 && container.scrollLeft >= maxScroll - 16) {
          loopToSlide(0);
          return;
        }

        const realSlides = getRealSlides();
        if (!realSlides.length) return;

        const trackRect = container.getBoundingClientRect();
        const center = trackRect.left + trackRect.width / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        realSlides.forEach((slide, i) => {
          const rect = slide.getBoundingClientRect();
          const slideCenter = rect.left + rect.width / 2;
          const dist = Math.abs(slideCenter - center);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        });

        if (bestIdx !== activeBuyerRef.current) {
          scrollFromSwipeRef.current = true;
          buyerDots[bestIdx]?.pick?.();
        }
      };

      const onScroll = () => {
        if (buyerLoopingRef.current) return;
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(settleScroll, 150);
      };

      container.addEventListener('scroll', onScroll, { passive: true });
      container.addEventListener('scrollend', settleScroll, { passive: true });
      return () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        if (loopGuardTimerRef.current) clearTimeout(loopGuardTimerRef.current);
        container.removeEventListener('scroll', onScroll);
        container.removeEventListener('scrollend', settleScroll);
      };
    };

    const setup = () => {
      if (typeof window === 'undefined' || window.innerWidth > BUYER_SWIPE_MAX_WIDTH) return undefined;
      if (window.innerWidth <= 1023 && carouselRef.current) {
        return attach(
          carouselRef.current,
          '.vp-buyer-slide:not(.vp-buyer-slide--loop-clone)',
          '.vp-buyer-slide--loop-clone',
        );
      }
      if (window.innerWidth >= 1024 && detailTrackRef.current) {
        return attach(
          detailTrackRef.current,
          '.vp-buyer-detail-slide:not(.vp-buyer-detail-slide--loop-clone)',
          '.vp-buyer-detail-slide--loop-clone',
        );
      }
      return undefined;
    };

    let cleanup = setup();
    const onResize = () => {
      cleanup?.();
      cleanup = setup();
    };
    window.addEventListener('resize', onResize);
    return () => {
      cleanup?.();
      window.removeEventListener('resize', onResize);
    };
  }, [showHome, buyerCount, buyerDots, carouselRef, detailTrackRef, activeBuyerRef, scrollFromSwipeRef]);
}

export default function VividPolyView() {
  const v = useVividPoly() as Record<string, any>;
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const buyerCarouselRef = useRef<HTMLDivElement>(null);
  const buyerDetailTrackRef = useRef<HTMLDivElement>(null);
  const buyerScrollFromSwipeRef = useRef(false);
  const useListRef = useRef<HTMLDivElement>(null);
  const valuePropsCarouselRef = useRef<HTMLDivElement>(null);
  const useScrollFromSwipeRef = useRef(false);
  const {
    activeIdx: activeValueProp,
    setActiveIdx: setActiveValueProp,
    scrollFromSwipeRef: valuePropsScrollFromSwipeRef,
  } = useValuePropsMobileCarousel(
    valuePropsCarouselRef,
    v.showHome,
    v.siteCopy.homeValueProps.length,
  );
  const prevActiveUseRef = useRef(v.activeUse);
  const activeUseRef = useRef(v.activeUse);
  activeUseRef.current = v.activeUse;
  const [headerHidden, setHeaderHidden] = useState(false);
  const [headerBlend, setHeaderBlend] = useState(false);
  const [headerMounted, setHeaderMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileNavExpanded, setMobileNavExpanded] = useState<null | 'products' | 'resources'>(null);
  const lastScrollYRef = useRef(0);
  const showHomeRef = useRef(v.showHome);
  showHomeRef.current = v.showHome;
  const activeBuyerRef = useRef(v.activeBuyer);
  activeBuyerRef.current = v.activeBuyer;

  useEffect(() => {
    setHeaderMounted(true);
  }, []);

  useEffect(() => {
    bindAllHovers(rootRef.current);
  }, [v.screen, v.menu, v.showHome, v.showCatalogue, v.showPdp, v.quoteContactOpen]);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [v.screen, v.showPdp, v.product?.id]);

  useEffect(() => {
    setHeaderHidden(false);
    lastScrollYRef.current = 0;
    setMobileNavOpen(false);
    setMobileNavExpanded(null);
    if (v.showHome) {
      scrollPageToTop('auto');
      requestAnimationFrame(() => scrollPageToTop('auto'));
    }
  }, [v.screen, v.showHome]);

  useEffect(() => {
    setMobileNavOpen(false);
    setMobileNavExpanded(null);
  }, [v.menu]);

  const closeMobileNav = () => {
    setMobileNavOpen(false);
    setMobileNavExpanded(null);
  };

  useBuyerSwipeCarousel(
    buyerCarouselRef,
    buyerDetailTrackRef,
    v.activeBuyer,
    v.buyerCards.length,
    v.showHome,
    v.buyerDots,
    activeBuyerRef,
    buyerScrollFromSwipeRef,
  );

  useEffect(() => {
    const list = useListRef.current;
    if (!list || !v.showHome) return;
    if (typeof window === 'undefined' || !window.matchMedia('(max-width: 1024px)').matches) return;
    if (prevActiveUseRef.current === v.activeUse) return;

    prevActiveUseRef.current = v.activeUse;

    if (useScrollFromSwipeRef.current) {
      useScrollFromSwipeRef.current = false;
    }

    const activeChip = list.querySelector<HTMLElement>('.vp-use-row--active');
    if (activeChip) {
      scrollChildIntoHorizontalView(list, activeChip);
    }
  }, [v.activeUse, v.showHome]);

  useEffect(() => {
    const list = useListRef.current;
    if (!list || !v.showHome) return;
    if (typeof window === 'undefined' || !window.matchMedia('(max-width: 1024px)').matches) return;

    let scrollTimer: ReturnType<typeof setTimeout> | undefined;

    const syncActiveFromScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const rows = Array.from(list.querySelectorAll<HTMLElement>('.vp-use-row'));
        const trackRect = list.getBoundingClientRect();
        const center = trackRect.left + trackRect.width / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        rows.forEach((row, i) => {
          const rect = row.getBoundingClientRect();
          const rowCenter = rect.left + rect.width / 2;
          const dist = Math.abs(rowCenter - center);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        });
        if (bestIdx !== activeUseRef.current) {
          useScrollFromSwipeRef.current = true;
          v.useRows[bestIdx]?.pick?.();
        }
      }, 120);
    };

    list.addEventListener('scroll', syncActiveFromScroll, { passive: true });
    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      list.removeEventListener('scroll', syncActiveFromScroll);
    };
  }, [v.showHome, v.useRows]);

  useEffect(() => {
    let ticking = false;
    let touchLastY = 0;
    const scrollRoots: HTMLElement[] = [];

    const syncHeaderBlend = () => {
      setHeaderBlend(false);
    };

    const updateHeaderFromScroll = (y: number) => {
      const delta = y - lastScrollYRef.current;

      if (y <= 8) {
        setHeaderHidden(false);
      } else if (delta > 4) {
        setHeaderHidden(true);
        setHeaderBlend(false);
      } else if (delta < -2) {
        setHeaderHidden(false);
        setHeaderBlend(false);
      }

      if (y <= 8) {
        syncHeaderBlend();
      }

      lastScrollYRef.current = y;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateHeaderFromScroll(getScrollY());
        ticking = false;
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      if (isInsideScrollOverlay(event.target)) return;

      const y = getScrollY();
      if (y <= 8) {
        setHeaderHidden(false);
        syncHeaderBlend();
      } else if (event.deltaY > 1) {
        setHeaderHidden(true);
        setHeaderBlend(false);
      } else if (event.deltaY < -1) {
        setHeaderHidden(false);
        setHeaderBlend(false);
      }

      lastScrollYRef.current = y;
    };

    const onTouchStart = (event: TouchEvent) => {
      touchLastY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (isInsideScrollOverlay(event.target)) return;

      const touchY = event.touches[0]?.clientY ?? touchLastY;
      const dy = touchY - touchLastY;
      const y = getScrollY();

      if (y <= 8) {
        setHeaderHidden(false);
        syncHeaderBlend();
      } else if (dy < -6) {
        setHeaderHidden(true);
        setHeaderBlend(false);
      } else if (dy > 6) {
        setHeaderHidden(false);
        setHeaderBlend(false);
      }

      touchLastY = touchY;
      lastScrollYRef.current = y;
    };

    const attachScrollRoots = (start: HTMLElement | null) => {
      let el = start;
      while (el) {
        const { overflowY } = getComputedStyle(el);
        if (
          (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
          el.scrollHeight > el.clientHeight + 1
        ) {
          if (!scrollRoots.includes(el)) {
            scrollRoots.push(el);
            el.addEventListener('scroll', onScroll, { passive: true });
          }
        }
        el = el.parentElement;
      }
    };

    attachScrollRoots(rootRef.current);
    const reattachId = window.setTimeout(() => attachScrollRoots(rootRef.current), 0);

    lastScrollYRef.current = getScrollY();
    updateHeaderFromScroll(getScrollY());

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.clearTimeout(reattachId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onScroll);
      scrollRoots.forEach((root) => root.removeEventListener('scroll', onScroll));
    };
  }, [v.screen, v.showHome]);

  const headerVisible = !headerHidden || Boolean(v.menu) || mobileNavOpen;

  useEffect(() => {
    if (!mobileNavOpen) return;
    setHeaderHidden(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    if (!headerVisible) {
      header.setAttribute('inert', '');
      header.setAttribute('aria-hidden', 'true');
    } else {
      header.removeAttribute('inert');
      header.removeAttribute('aria-hidden');
    }
  }, [headerVisible, headerMounted]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (v.quoteContactOpen) {
        v.closeQuoteContact();
        return;
      }
      if (mobileNavOpen) {
        closeMobileNav();
        return;
      }
      if (v.menu) v.closeAll();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [v.quoteContactOpen, v.menu, v.closeQuoteContact, v.closeAll, mobileNavOpen]);

  const nav = v.ui.nav;
  const common = v.ui.common;
  const home = v.ui.home;
  const about = v.ui.about;
  const footer = v.ui.footer;
  const contact = v.ui.contact;
  const quote = v.ui.quote;
  const breadcrumbs = v.ui.breadcrumbs;
  const quoteContactLabels = v.quoteContactLabels;

  const siteHeader = (
    <header ref={headerRef} className={`vp-header vp-header--fixed${headerVisible ? '' : ' vp-header--hidden'}${headerBlend ? ' vp-header--blend' : ''}${mobileNavOpen ? ' vp-header--mobile-nav-open' : ''}`}>
      <div className="vp-header-shell">
        <div className="vp-header-start">
          <button type="button" onClick={v.goHome} className="vp-header-logo" aria-label={nav.logoHome}>
            <VpLogo variant="inverse" className="vp-wordmark--nav" />
          </button>
          <nav className="vp-header-nav vp-header-nav--desktop" aria-label={nav.mainNav}>
            <button onClick={v.goHome} type="button" className="vp-header-nav-btn" style={{ color: v.navHomeColor }}>{nav.home}</button>
            <button onClick={v.toggleProducts} type="button" className="vp-header-nav-btn" style={{ color: v.navProductsColor }} aria-expanded={v.menuProducts} aria-controls="vp-nav-products-panel">{nav.products}<span className="vp-header-nav-caret" aria-hidden="true">▾</span></button>
            <button onClick={v.goAbout} type="button" className="vp-header-nav-btn" style={{ color: v.navAboutColor }}>{nav.about}</button>
            <button onClick={v.toggleResources} type="button" className="vp-header-nav-btn" style={{ color: v.navResourcesColor }} aria-expanded={v.menuResources} aria-controls="vp-nav-resources-panel">{nav.resources}<span className="vp-header-nav-caret" aria-hidden="true">▾</span></button>
            <button onClick={v.goContact} type="button" className="vp-header-nav-btn" style={{ color: v.navContactColor }}>{nav.contact}</button>
          </nav>
        </div>

        <div className="vp-header-end">
          <button
            type="button"
            className="vp-header-menu-btn"
            aria-expanded={mobileNavOpen}
            aria-controls="vp-mobile-nav-panel"
            aria-label={mobileNavOpen ? nav.closeMenu : nav.openMenu}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <span className="vp-header-menu-icon" aria-hidden="true">{mobileNavOpen ? '✕' : '☰'}</span>
          </button>
          <button onClick={v.openContactEnquiry} className="vp-cta-primary vp-cta-primary--on-dark vp-header-quote-cta" type="button">
            <span className="vp-header-cta-label--long">{v.siteCopy.heroCtaPrimary}</span>
            <span className="vp-header-cta-label--short">{nav.getQuoteShort}</span>
          </button>
        </div>
      </div>

      {v.menuProducts && (
        <div id="vp-nav-products-panel" className="vp-nav-dropdown" role="region" aria-label={nav.productsMenu}>
          <div className="vp-nav-dropdown-inner">
            <div className="vp-nav-dropdown-tabs">
              <button onClick={v.setTabType} type="button" className="vp-nav-dropdown-tab" style={{ borderBottom: v.tabTypeBorder, color: v.tabTypeColor }}>{nav.byProductType}</button>
              <button onClick={v.setTabUse} type="button" className="vp-nav-dropdown-tab" style={{ borderBottom: v.tabUseBorder, color: v.tabUseColor }}>{nav.byIndustryUse}</button>
            </div>
            <div className={`vp-nav-dropdown-grid ${v.megaCols === 4 ? 'vp-nav-dropdown-grid--products-4' : 'vp-nav-dropdown-grid--products-3'}`}>
              {v.megaGroups.map((g, i_g) => (
                <div key={i_g} className="vp-nav-dropdown-card">
                  <div className="vp-nav-dropdown-card-title">{g.title}</div>
                  <ul className="vp-nav-dropdown-links">
                    {g.items.map((it, i_it) => (
                      <li key={i_it}>
                        <button type="button" onClick={it.open} className="vp-nav-dropdown-link">{it.label}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="vp-nav-dropdown-footer">
              <button type="button" onClick={v.megaFooterAction} className="vp-nav-dropdown-footer-btn">{v.megaFooterLabel}</button>
            </div>
          </div>
        </div>
      )}

      {v.menuResources && (
        <div id="vp-nav-resources-panel" className="vp-nav-dropdown vp-nav-dropdown--resources" role="region" aria-label={nav.resourcesMenu}>
          <div className="vp-nav-dropdown-inner">
            <div className="vp-nav-resources-head">
              <p className="vp-nav-resources-eyebrow">{nav.buyerResourcesEyebrow}</p>
              <p className="vp-nav-resources-lead">{nav.buyerResourcesLead}</p>
            </div>
            <div className="vp-nav-dropdown-grid vp-nav-dropdown-grid--resources">
              {v.resourceLinks.map((link: NavMenuLink) => (
                <button key={link.title} type="button" onClick={link.open} className="vp-resource-card">
                  <span className="vp-resource-card-icon" aria-hidden="true">
                    <ResourceNavIcon type={link.icon} />
                  </span>
                  <span className="vp-resource-card-body">
                    <span className="vp-resource-card-title">{link.title}</span>
                    <span className="vp-resource-card-desc">{link.desc}</span>
                  </span>
                  <span className="vp-resource-card-arrow" aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );

  return (
      <div ref={rootRef} className="vp-root">
        {headerMounted && createPortal(siteHeader, document.body)}
        {headerMounted && createPortal(
          <div
            className={`vp-mobile-nav-layer${mobileNavOpen ? ' vp-mobile-nav-layer--open' : ''}`}
            aria-hidden={!mobileNavOpen}
          >
            <button
              type="button"
              className="vp-mobile-nav-backdrop"
              onClick={closeMobileNav}
              aria-label={nav.closeMenu}
              tabIndex={mobileNavOpen ? 0 : -1}
            />
            <nav
              id="vp-mobile-nav-panel"
              className="vp-mobile-drawer"
              aria-label={nav.mobileNav}
              aria-hidden={!mobileNavOpen}
            >
              <div className="vp-mobile-drawer-scroll">
                <button type="button" className="vp-mobile-drawer-link" onClick={() => { v.goHome(); closeMobileNav(); }}>{nav.home}</button>

                <div className="vp-mobile-drawer-section">
                  <button
                    type="button"
                    className={`vp-mobile-drawer-link vp-mobile-drawer-link--expand${mobileNavExpanded === 'products' ? ' vp-mobile-drawer-link--expanded' : ''}`}
                    aria-expanded={mobileNavExpanded === 'products'}
                    onClick={() => setMobileNavExpanded((section) => (section === 'products' ? null : 'products'))}
                  >
                    {nav.products}
                    <span className="vp-mobile-drawer-chevron" aria-hidden="true" />
                  </button>
                  {mobileNavExpanded === 'products' && (
                    <div className="vp-mobile-drawer-panel">
                      <p className="vp-mobile-drawer-section-heading">{nav.mobileByProductType}</p>
                      {v.megaTypeGroups.map((g, i_g) => (
                        <div key={`type-${i_g}`} className="vp-mobile-drawer-group">
                          <div className="vp-mobile-drawer-group-title">{g.title}</div>
                          <ul className="vp-mobile-drawer-sublinks">
                            {g.items.map((it, i_it) => (
                              <li key={i_it}>
                                <button
                                  type="button"
                                  className="vp-mobile-drawer-sublink"
                                  onClick={() => { it.open(); closeMobileNav(); }}
                                >
                                  {it.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="vp-mobile-drawer-footer-link"
                        onClick={() => { v.megaTypeFooterAction(); closeMobileNav(); }}
                      >
                        {nav.viewAllByType}
                      </button>

                      <div className="vp-mobile-drawer-divider" aria-hidden="true" />

                      <p className="vp-mobile-drawer-section-heading">{nav.mobileByIndustry}</p>
                      {v.megaUseGroups.map((g, i_g) => (
                        <div key={`use-${i_g}`} className="vp-mobile-drawer-group">
                          <div className="vp-mobile-drawer-group-title">{g.title}</div>
                          <ul className="vp-mobile-drawer-sublinks">
                            {g.items.map((it, i_it) => (
                              <li key={i_it}>
                                <button
                                  type="button"
                                  className="vp-mobile-drawer-sublink"
                                  onClick={() => { it.open(); closeMobileNav(); }}
                                >
                                  {it.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="vp-mobile-drawer-footer-link"
                        onClick={() => { v.megaUseFooterAction(); closeMobileNav(); }}
                      >
                        {nav.viewAllByIndustry}
                      </button>
                    </div>
                  )}
                </div>

                <button type="button" className="vp-mobile-drawer-link" onClick={() => { v.goAbout(); closeMobileNav(); }}>{nav.about}</button>

                <div className="vp-mobile-drawer-section">
                  <button
                    type="button"
                    className={`vp-mobile-drawer-link vp-mobile-drawer-link--expand${mobileNavExpanded === 'resources' ? ' vp-mobile-drawer-link--expanded' : ''}`}
                    aria-expanded={mobileNavExpanded === 'resources'}
                    onClick={() => setMobileNavExpanded((section) => (section === 'resources' ? null : 'resources'))}
                  >
                    {nav.resources}
                    <span className="vp-mobile-drawer-chevron" aria-hidden="true" />
                  </button>
                  {mobileNavExpanded === 'resources' && (
                    <div className="vp-mobile-drawer-panel">
                      <ul className="vp-mobile-drawer-sublinks vp-mobile-drawer-sublinks--flat">
                        {v.resourceLinks.map((link: NavMenuLink) => (
                          <li key={link.title}>
                            <button
                              type="button"
                              className="vp-mobile-drawer-sublink"
                              onClick={() => { link.open(); closeMobileNav(); }}
                            >
                              {link.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button type="button" className="vp-mobile-drawer-link" onClick={() => { v.goContact(); closeMobileNav(); }}>{nav.contact}</button>
              </div>
            </nav>
          </div>,
          document.body,
        )}
        {v.overlayOpen && (
          <button
            type="button"
            className="vp-menu-backdrop"
            onClick={() => {
              v.closeAll();
            }}
            aria-label={nav.closeMenu}
          />
        )}
      
        
        <main className="vp-main">
      
          
          {v.showHome && (<>
          <div data-screen-label="Home">
      
            
            <section className="vp-hero">
              <div className="vp-hero-aurora" aria-hidden="true" />
              <div className="vp-hero-inner vp-hero-inner--split">
                <div className="vp-hero-copy">
                  <div className="vp-hero-brand vp-hero-rise" aria-hidden="true">
                    <VpLogo variant="inverse" className="vp-wordmark--hero" />
                  </div>
                  <h1 className="vp-hero-title vp-hero-rise">{v.siteCopy.heroHeadline}</h1>
                  <p className="vp-hero-lead vp-hero-rise">{v.siteCopy.heroLead}</p>
                  <div className="vp-hero-rise vp-hero-ctas">
                    <button onClick={v.openContactEnquiry} className="vp-cta-primary vp-cta-primary--lg vp-cta-primary--on-dark" type="button">{v.siteCopy.heroCtaPrimary}</button>
                    <button onClick={v.goCatalogueType} className="vp-cta-secondary vp-cta-secondary--lg" type="button">{v.siteCopy.heroCtaSecondary}</button>
                    <button onClick={v.openContactEnquiry} className="vp-cta-ghost vp-cta-ghost--lg" type="button"><span className="vp-wa-icon-badge vp-wa-icon-badge--lg"><WhatsAppIcon size={14} /></span>{v.siteCopy.heroCtaWhatsApp}</button>
                  </div>
                </div>
                <div className="vp-hero-visual vp-hero-rise" aria-hidden="true">
                  <div className="vp-hero-visual-ph" />
                </div>
              </div>

              <div className="vp-hero-markets">
                <div className="vp-hero-markets-track">
                  <div className="vp-marquee">
                    {v.markets.map((m, i_m) => (
                      <span key={`m1-${i_m}`}>{m}</span>
                    ))}
                    {v.markets.map((m, i_m) => (
                      <span key={`m2-${i_m}`}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="vp-home-intro">
              <div className="vp-home-intro-inner">
                <p>{v.siteCopy.intro1}</p>
                <p>{v.siteCopy.intro2}</p>
              </div>
            </section>

            <section className="vp-value-props-section" aria-labelledby="vp-value-props-heading">
              <div className="vp-value-props-inner">
                <p className="vp-value-props-eyebrow" id="vp-value-props-heading">
                  {v.siteCopy.homeValuePropsEyebrow}
                </p>
                <div ref={valuePropsCarouselRef} className="vp-value-props vp-value-props--3">
                  {v.siteCopy.homeValueProps.map((prop: { id: string; title: string; description: string }) => (
                    <article key={prop.id} className="vp-value-prop">
                      <h3 className="vp-value-prop-title">{prop.title}</h3>
                      <p className="vp-value-prop-text">{prop.description}</p>
                    </article>
                  ))}
                  <article className="vp-value-prop vp-value-prop--loop-clone" aria-hidden="true" tabIndex={-1}>
                    <h3 className="vp-value-prop-title">{v.siteCopy.homeValueProps[0].title}</h3>
                    <p className="vp-value-prop-text">{v.siteCopy.homeValueProps[0].description}</p>
                  </article>
                </div>
                <div className="vp-value-props-mobile-meta">
                  <div className="vp-value-props-dots" role="tablist" aria-label={home.valuePropsSlides}>
                    {v.siteCopy.homeValueProps.map((prop: { id: string; title: string }, i: number) => (
                      <button
                        key={prop.id}
                        type="button"
                        role="tab"
                        aria-selected={i === activeValueProp}
                        className="vp-buyer-dot"
                        style={{ background: i === activeValueProp ? 'var(--vp-accent)' : 'var(--vp-mist)' }}
                        aria-label={`${prop.title}, slide ${i + 1} of ${v.siteCopy.homeValueProps.length}`}
                        onClick={() => {
                          valuePropsScrollFromSwipeRef.current = false;
                          setActiveValueProp(i);
                        }}
                      />
                    ))}
                  </div>
                  <p className="vp-value-props-status" aria-live="polite">
                    {home.slideOf.replace('{current}', String(activeValueProp + 1)).replace('{total}', String(v.siteCopy.homeValueProps.length))}
                  </p>
                </div>
              </div>
            </section>

            <div className="vp-home-browse-head">
              <h2 className="vp-h2 vp-home-browse-title">{v.siteCopy.homeBrowseHeading}</h2>
            </div>
      
            
            <section className="vp-section vp-start-section">
              <div className="vp-start-grid">
                <button type="button" onClick={v.goCatalogueType} className="vp-start-card" style={{ padding: "24px", cursor: "pointer", display: "flex", gap: "24px", alignItems: "center", width: "100%", textAlign: "left" }}>
                  <div className="vp-ph" style={{ width: "88px", height: "88px", borderRadius: "8px", flex: "none" }} aria-hidden="true"></div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "20px", marginBottom: "8px" }}>{home.shopByProductType}</div>
                    <div style={{ fontSize: "16px", color: "var(--vp-ink)", lineHeight: "1.55" }}>{home.shopByProductTypeDesc}</div>
                  </div>
                </button>
                <button type="button" onClick={v.goCatalogueUse} className="vp-start-card" style={{ padding: "24px", cursor: "pointer", display: "flex", gap: "24px", alignItems: "center", width: "100%", textAlign: "left" }}>
                  <div className="vp-ph" style={{ width: "88px", height: "88px", borderRadius: "8px", flex: "none" }} aria-hidden="true"></div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "20px", marginBottom: "8px" }}>{home.shopByIndustry}</div>
                    <div style={{ fontSize: "16px", color: "var(--vp-ink)", lineHeight: "1.55" }}>{home.shopByIndustryDesc}</div>
                  </div>
                </button>
              </div>
            </section>

            <section className="vp-trust-message">
              <p>{v.siteCopy.trustMessage}</p>
            </section>
      
            
            <section className="vp-buyer-section">
              <div className="vp-buyer-shell">
                <div className="vp-buyer-desktop">
                  <div className="vp-buyer-grid">
                    {v.buyerCards.map((c, i_c) => (
                      <button key={i_c} type="button" onMouseEnter={c.preview} onClick={c.select} className={`vp-buyer-card${c.active ? ' vp-buyer-card--active' : ''}`} style={{ borderColor: c.cardBd, background: c.cardBg, boxShadow: c.cardShadow }}>
                        <div className="vp-buyer-card-num" style={{ background: c.iconBg, color: c.iconCol }}>{c.num}</div>
                        <div className="vp-buyer-card-text">
                          <div className="vp-buyer-card-title" style={{ color: c.titleCol }}>{c.label}</div>
                          <div className="vp-buyer-card-short">{c.short}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="vp-buyer-detail">
                    <div ref={buyerDetailTrackRef} className="vp-buyer-detail-track" aria-label={home.buyerRequirements}>
                      {v.buyerCards.map((c, i_c) => (
                        <article
                          key={i_c}
                          className={`vp-buyer-detail-slide${c.active ? ' vp-buyer-detail-slide--active' : ''}`}
                          aria-hidden={!c.active}
                        >
                          <div className="vp-buyer-detail-accent"></div>
                          <div className="vp-buyer-detail-inner">
                            <div className="vp-buyer-detail-head">
                              <div className="vp-buyer-detail-head-text">
                                <div className="vp-buyer-detail-eyebrow">{v.siteCopy.buyerRequirementLabel}</div>
                                <div className="vp-buyer-detail-heading">{c.requirement}</div>
                              </div>
                              <div className="vp-buyer-detail-badge">{c.num}</div>
                            </div>

                            <div className="vp-buyer-detail-divider"></div>

                            <div className="vp-buyer-detail-body">
                              <div className="vp-buyer-detail-response-label">{v.siteCopy.buyerResponseLabel}</div>
                              <p className="vp-buyer-detail-response">{c.response}</p>
                            </div>
                          </div>
                        </article>
                      ))}
                      {v.buyerCards[0] && (
                        <article
                          className="vp-buyer-detail-slide vp-buyer-detail-slide--loop-clone"
                          aria-hidden="true"
                          tabIndex={-1}
                        >
                          <div className="vp-buyer-detail-accent"></div>
                          <div className="vp-buyer-detail-inner">
                            <div className="vp-buyer-detail-head">
                              <div className="vp-buyer-detail-head-text">
                                <div className="vp-buyer-detail-eyebrow">{v.siteCopy.buyerRequirementLabel}</div>
                                <div className="vp-buyer-detail-heading">{v.buyerCards[0].requirement}</div>
                              </div>
                              <div className="vp-buyer-detail-badge">{v.buyerCards[0].num}</div>
                            </div>

                            <div className="vp-buyer-detail-divider"></div>

                            <div className="vp-buyer-detail-body">
                              <div className="vp-buyer-detail-response-label">{v.siteCopy.buyerResponseLabel}</div>
                              <p className="vp-buyer-detail-response">{v.buyerCards[0].response}</p>
                            </div>
                          </div>
                        </article>
                      )}
                    </div>

                    <div className="vp-buyer-detail-foot">
                      <div className="vp-buyer-detail-nav">
                        <button type="button" onClick={v.buyerPrev} className="vp-buyer-nav-btn vp-buyer-nav-btn--ghost">← Previous</button>
                        <div className="vp-buyer-dots">
                          {v.buyerDots.map((d, i_d) => (
                            <button key={i_d} type="button" onClick={d.pick} className="vp-buyer-dot" style={{ background: d.bg }} aria-label={`Need ${i_d + 1}`}></button>
                          ))}
                        </div>
                        <button type="button" onClick={v.buyerNext} className="vp-buyer-nav-btn vp-buyer-nav-btn--primary">Next →</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="vp-buyer-mobile">
                  <div className="vp-buyer-mobile-head">
                    <h2 className="vp-buyer-mobile-title">How we help buyers</h2>
                    <p className="vp-buyer-mobile-hint">Swipe the cards</p>
                  </div>
                  <div ref={buyerCarouselRef} className="vp-buyer-carousel" aria-label={home.buyerCarousel}>
                    {v.buyerCards.map((c, i_c) => (
                      <article
                        key={i_c}
                        className={`vp-buyer-slide${c.active ? ' vp-buyer-slide--active' : ''}`}
                        aria-hidden={!c.active}
                        onClick={() => v.buyerDots[i_c]?.pick?.()}
                      >
                        <div className="vp-buyer-slide-accent" aria-hidden="true" />
                        <div className="vp-buyer-slide-inner">
                          <div className="vp-buyer-slide-top">
                            <span className="vp-buyer-slide-chip">{c.label}</span>
                            <span className="vp-buyer-slide-num">{c.num}</span>
                          </div>
                          <div className="vp-buyer-slide-requirement">
                            <div className="vp-buyer-detail-eyebrow">{v.siteCopy.buyerRequirementLabel}</div>
                            <h3 className="vp-buyer-slide-heading">{c.requirement}</h3>
                          </div>
                          <div className="vp-buyer-slide-response">
                            <div className="vp-buyer-detail-response-label">{v.siteCopy.buyerResponseLabel}</div>
                            <p className="vp-buyer-detail-response">{c.response}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                    {v.buyerCards[0] && (
                      <article
                        className="vp-buyer-slide vp-buyer-slide--loop-clone"
                        aria-hidden="true"
                        tabIndex={-1}
                      >
                        <div className="vp-buyer-slide-accent" aria-hidden="true" />
                        <div className="vp-buyer-slide-inner">
                          <div className="vp-buyer-slide-top">
                            <span className="vp-buyer-slide-chip">{v.buyerCards[0].label}</span>
                            <span className="vp-buyer-slide-num">{v.buyerCards[0].num}</span>
                          </div>
                          <div className="vp-buyer-slide-requirement">
                            <div className="vp-buyer-detail-eyebrow">{v.siteCopy.buyerRequirementLabel}</div>
                            <h3 className="vp-buyer-slide-heading">{v.buyerCards[0].requirement}</h3>
                          </div>
                          <div className="vp-buyer-slide-response">
                            <div className="vp-buyer-detail-response-label">{v.siteCopy.buyerResponseLabel}</div>
                            <p className="vp-buyer-detail-response">{v.buyerCards[0].response}</p>
                          </div>
                        </div>
                      </article>
                    )}
                  </div>
                  <div className="vp-buyer-mobile-dots" aria-label={home.buyerPagination}>
                    {v.buyerDots.map((d, i_d) => (
                      <button key={i_d} type="button" onClick={d.pick} className="vp-buyer-dot" style={{ background: d.bg }} aria-label={`Buyer need ${i_d + 1}`}></button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
      
            
            <section className="vp-prod-section vp-section">
              <div className="vp-prod-header">
                <h2 className="vp-h2 vp-prod-title">Product types</h2>
                <button type="button" onClick={v.goCatalogueType} className="vp-prod-view-all">View all →</button>
              </div>
              <div className="vp-prod-carousel">
                <button type="button" onClick={v.prodPrev} className="vp-prod-arrow" aria-label={home.previousProducts}>‹</button>
                <div className="vp-prod-carousel-track">
                  <div ref={v.prodScrollRef} className="vp-prodscroll">
                    {v.products.map((p, i_p) => (
                      <button key={`p1-${i_p}`} type="button" onClick={p.open} className="vp-prod-card" aria-label={`View ${p.name}`}>
                        <div className="vp-ph vp-prod-card-img"></div>
                        <div className="vp-prod-card-body">
                          <div className="vp-prod-card-title">{p.name}</div>
                          <div className="vp-prod-card-desc">{p.short}</div>
                          <div className="vp-prod-card-cta">{p.cta} →</div>
                        </div>
                      </button>
                    ))}
                    {v.products.map((p, i_p) => (
                      <button key={`p2-${i_p}`} type="button" onClick={p.open} className="vp-prod-card vp-prod-card--loop-clone" aria-label={`View ${p.name}`} tabIndex={-1} aria-hidden="true">
                        <div className="vp-ph vp-prod-card-img"></div>
                        <div className="vp-prod-card-body">
                          <div className="vp-prod-card-title">{p.name}</div>
                          <div className="vp-prod-card-desc">{p.short}</div>
                          <div className="vp-prod-card-cta">{p.cta} →</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <button type="button" onClick={v.prodNext} className="vp-prod-arrow" aria-label={home.nextProducts}>›</button>
              </div>
            </section>
      
            
            <div className="vp-product-use-bridge">
              <p className="vp-body vp-product-use-intro">{v.siteCopy.productUsesIntro}</p>
            </div>

            <section className="vp-product-use-section">
              <h2 className="vp-h2 vp-product-use-title">{v.siteCopy.productUseCol}</h2>
              <p className="vp-product-use-hint">Swipe to browse industries</p>
              <div
                onMouseLeave={() => {
                  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
                  v.clearUsePreview();
                }}
                className="vp-use-split"
              >
                <div ref={useListRef} className="vp-use-list" role="tablist" aria-label={home.productUses}>
                  {v.useRows.map((r, i_r) => (
                    <button
                      key={i_r}
                      type="button"
                      role="tab"
                      aria-selected={r.active}
                      onMouseEnter={r.preview}
                      onFocus={r.preview}
                      onClick={r.select}
                      className={`vp-use-row${r.active ? ' vp-use-row--active' : ''}`}
                      style={{ background: r.rowBg, borderLeftColor: r.rowAccent }}
                    >
                      <span className="vp-use-row-label" style={{ color: r.rowColor }}>{r.use}</span>
                      <span className="vp-use-row-arrow" style={{ color: r.rowAccent, opacity: r.arrowOpacity }} aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
                <div className="vp-use-detail" role="tabpanel" aria-live="polite">
                  {v.useDetailVisible && (<>
                    <h3 className="vp-use-detail-title" aria-hidden="true">{v.useDetailTitle}</h3>
                    <div className="vp-use-detail-eyebrow">{v.siteCopy.recommendedBagsCol}</div>
                    <div className="vp-use-bag-tags">
                      {v.useDetailBags.split(/,\s*/).filter(Boolean).map((bag: string) => {
                        const label = bag.replace(/\.\s*$/, '').trim();
                        return (
                          <span key={label} className="vp-use-bag-tag">{label}</span>
                        );
                      })}
                    </div>
                  </>)}
                  {v.useDetailHidden && (<>
                    <div className="vp-use-empty">
                      <p className="vp-use-empty-hint">{v.siteCopy.productUsesEmptyHint}</p>
                      <button type="button" className="vp-cta-primary vp-cta-primary--lg" onClick={v.openContactEnquiry}>
                        {v.siteCopy.productUsesLearnMore}
                      </button>
                    </div>
                  </>)}
                </div>
              </div>
            </section>
      
            
            <section className="vp-faq-section">
              <div className="vp-faq-section-inner">
                <div className="vp-faq-section-head">
                  <p className="vp-faq-section-eyebrow">FAQs</p>
                  <h2 className="vp-h2 vp-faq-section-title">{v.siteCopy.faqSectionTitle}</h2>
                </div>
                <VpFaqAccordion items={v.faqs} />
              </div>
            </section>
      
            
            <section style={{ background: "var(--vp-navy-deep)", color: "var(--vp-white)" }}>
              <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
                <h2 className="vp-h2" style={{ margin: "0 0 16px", color: "var(--vp-white)" }}>{v.siteCopy.finalCtaTitle}</h2>
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "var(--vp-mist)", margin: "0 auto 28px", maxWidth: "680px" }}>{v.siteCopy.finalCtaBody}</p>
                <button onClick={v.openContactEnquiry} className="vp-cta-primary vp-cta-primary--lg vp-cta-primary--on-dark" type="button">{v.siteCopy.finalCtaButton}</button>
              </div>
            </section>
      
          </div>
          </>)}
      
          
          {v.showCatalogue && (<>
          <div data-screen-label="Catalogue">
            <VpSubpageTop breadcrumbs={v.catBreadcrumbs} onHomeClick={v.goHome} style={{ maxWidth: "1240px", margin: "0 auto", padding: "28px 28px 8px" }}>
              <h1 className="vp-h1" style={{ margin: "0 0 8px" }}>{v.catTitle}</h1>
              <p style={{ fontSize: "16px", color: "var(--vp-ink)", margin: "0", maxWidth: "760px", lineHeight: "1.55" }}>{v.catSub}</p>
            </VpSubpageTop>
            <div className={`vp-catalogue-layout${v.catFiltersOpen ? ' vp-catalogue-layout--filters-open' : ''}`}>
              <div className="vp-filter-column">
                <aside className="vp-filter-sidebar">
                  <div className="vp-filter-header">
                    <div className="vp-filter-title-row">
                      <span className="vp-filter-title">Filters</span>
                      {v.activeFilterCount > 0 && (
                        <span className="vp-filter-count">{v.activeFilterCount}</span>
                      )}
                    </div>
                    {v.activeFilterCount > 0 && (
                      <button type="button" onClick={v.clearFilters} className="vp-filter-clear">Clear filters</button>
                    )}
                  </div>
                  <div className="vp-filter-scroll">
                    <details className="vp-filter-section" open>
                      <summary>
                        Capacity
                        <span className="vp-filter-chevron" aria-hidden="true">▾</span>
                      </summary>
                      <VpCapacityFilter
                        stops={v.capacityFilter.stops}
                        minIdx={v.capacityFilter.minIdx}
                        maxIdx={v.capacityFilter.maxIdx}
                        customKg={v.capacityFilter.customKg}
                        customNotice={v.capacityFilter.customNotice}
                        onMinChange={v.capacityFilter.setMinIdx}
                        onMaxChange={v.capacityFilter.setMaxIdx}
                        onCustomChange={v.capacityFilter.setCustomKg}
                      />
                    </details>
                    {v.filterSecs.map((sec, i_sec) => (
                      <details
                        key={i_sec}
                        className={`vp-filter-section${v.catGuide === 'product-type' && !v.catByUse && sec.key === 'Product Type' ? ' vp-filter-section--guided' : ''}`}
                        open={sec.defaultOpen}
                      >
                        <summary>
                          {sec.title}
                          <span className="vp-filter-chevron" aria-hidden="true">▾</span>
                        </summary>
                        {v.catGuide === 'product-type' && !v.catByUse && sec.key === 'Product Type' && (
                          <VpCatalogueGuideTooltip
                            message={v.siteCopy.catalogueGuideProductType}
                            placement="filter"
                            onDismiss={v.clearCatGuide}
                          />
                        )}
                        <div className="vp-filter-options">
                          {sec.opts.map((o, i_o) => (
                            <label key={i_o} className="vp-filter-option">
                              <input
                                type="checkbox"
                                className="vp-filter-input"
                                checked={o.checked}
                                onChange={o.toggle}
                              />
                              <span
                                className={`vp-filter-checkbox${o.checked ? ' vp-filter-checkbox--checked' : ''}`}
                                aria-hidden="true"
                              >
                                {o.checked ? '✓' : ''}
                              </span>
                              {o.label}
                            </label>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                </aside>
              </div>

              <div className="vp-catalogue-main">
                <div className="vp-catalogue-toolbar">
                  <div className="vp-catalogue-toolbar-start">
                    <div className="vp-catalogue-filter-controls">
                      <div
                        className={`vp-catalogue-filter-chip${v.catFiltersOpen ? ' vp-catalogue-filter-chip--active' : ''}${v.activeFilterCount > 0 ? ' vp-catalogue-filter-chip--has-count' : ''}`}
                      >
                        <button
                          type="button"
                          onClick={v.toggleCatFilters}
                          className="vp-catalogue-filter-toggle"
                          aria-expanded={v.catFiltersOpen}
                        >
                          Filters
                          {v.activeFilterCount > 0 && (
                            <span className="vp-filter-count">{v.activeFilterCount}</span>
                          )}
                        </button>
                        {v.activeFilterCount > 0 && (
                          <button
                            type="button"
                            onClick={v.clearFilters}
                            className="vp-catalogue-filter-clear"
                            aria-label={common.clearFilters}
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <span className="vp-catalogue-count">
                      <b>{v.filteredCount}</b> products
                      {v.filtersActive && <span className="vp-catalogue-count-muted"> (filtered)</span>}
                    </span>
                  </div>
                  <div className={`vp-sort-label${v.catGuide === 'use-sort' && v.catByUse ? ' vp-sort-label--guided' : ''}`}>
                    <span>{v.siteCopy.shopByUseLabel}</span>
                    {v.catGuide === 'use-sort' && v.catByUse && (
                      <VpCatalogueGuideTooltip
                        message={v.siteCopy.catalogueGuideUseSort}
                        placement="sort"
                        onDismiss={v.clearCatGuide}
                      />
                    )}
                    <VpSortSelect
                      value={v.catSort}
                      options={v.catSortOptions}
                      onChange={v.setCatSort}
                    />
                  </div>
                </div>
                <div className="vp-catalogue-grid">
                  {v.catalogueProducts.length === 0 && (
                    <div className="vp-filter-empty">
                      No products match your filters.
                      <br />
                      <button type="button" onClick={v.clearFilters} className="vp-filter-clear" style={{ marginTop: "12px", color: "var(--vp-ink)" }}>Clear all filters</button>
                    </div>
                  )}
                  {v.catalogueProducts.map((p, i_p) => (
                    <div key={i_p} className={`vp-catalogue-card${p.recommended ? ' vp-catalogue-card--recommended' : ''}`}>
                      <div style={{ position: "relative" }}>
                        {p.recommended && <span className="vp-prod-rec-badge">Recommended</span>}
                        <button type="button" onClick={p.open} className="vp-catalogue-card-hit" aria-label={`View ${p.name}`}>
                          <span className="vp-ph vp-catalogue-card-media" aria-hidden="true" />
                          <span className="vp-catalogue-card-name">{p.name}</span>
                        </button>
                      </div>
                      <div className="vp-catalogue-card-body">
                        <p className="vp-catalogue-card-desc">{p.short}</p>
                        <div className="vp-catalogue-card-actions">
                          <button onClick={p.open} className="vp-catalogue-card-btn--ghost" type="button">View Details</button>
                          <button onClick={v.goQuote} className="vp-catalogue-card-btn--primary" type="button">Get Quote</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </>)}
      
          
          {v.showPdp && (<>
          <div data-screen-label="Product detail">
            <VpSubpageTop breadcrumbs={v.pdpBreadcrumbs} onHomeClick={v.goHome} style={{ maxWidth: "1240px", margin: "0 auto", padding: "24px 28px 0" }} />
            <div className="vp-pdp-layout">
              <div className="vp-pdp-gallery">
                <div className="vp-pdp-gallery-main vp-ph" aria-hidden="true" />
                <div className="vp-pdp-gallery-thumbs">
                  {v.galleryThumbs.map((t, i_t) => (
                    <button key={i_t} type="button" onClick={t.sel} className="vp-gallery-thumb vp-ph" style={{ border: t.bd }} aria-label={`Product image ${i_t + 1}`} />
                  ))}
                </div>
              </div>
              
              <div className="vp-pdp-summary">
                <h1 className="vp-h1" style={{ margin: "0 0 16px", lineHeight: "1.1" }}>{v.product.name}</h1>
                <p style={{ fontSize: "16px", color: "var(--vp-ink)", lineHeight: "1.65", margin: "0 0 24px", textWrap: "pretty" }}>{v.product.intro}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
                  {v.trustBadges.map((b, i_b) => (
                    <span key={i_b} style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "500", color: "var(--vp-ink)", background: "var(--vp-fog)", border: "1px solid var(--vp-fog)", borderRadius: "20px", padding: "8px 12px", whiteSpace: "nowrap" }}><span style={{ color: "var(--vp-ink)", fontWeight: "700" }}>✓</span>{b.t}</span>
                  ))}
                </div>
                <div style={{ border: "1px solid var(--vp-fog)", borderRadius: "8px", overflow: "hidden", marginBottom: "24px" }}>
                  <div style={{ background: "var(--vp-fog)", padding: "12px 16px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".05em" }}>Specification</div>
                  {v.pdpSpec.map((r, i_r) => (
                    <div key={i_r} className="vp-kv-row">
                      <div style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "600" }}>{r.p}</div>
                      <div style={{ padding: "12px 16px", fontSize: "12px", color: "var(--vp-ink)", lineHeight: "1.5" }}>{r.o}</div>
                    </div>
                  ))}
                </div>
                <button onClick={v.pdpGetQuote} className="vp-cta-primary vp-cta-primary--lg vp-cta-primary--block" type="button">{v.pdpQuoteLabel}</button>
              </div>
            </div>

            <VpPdpDetails product={v.product} features={v.pdpFeatures} />

            <div className="vp-related-section">
              <h3 className="vp-related-heading">Related products</h3>
              <div className="vp-related-scroll">
                {v.relatedProducts.map((p, i_p) => (
                  <button key={i_p} type="button" onClick={p.open} className="vp-related-product" data-vp-hover="border-color:var(--vp-mist)" aria-label={`View ${p.name}`}>
                    <div className="vp-ph vp-related-product-img" aria-hidden="true" />
                    <span className="vp-related-product-title">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          </>)}
      
          
          {v.showFaqs && (<>
          <div data-screen-label="FAQs" style={{ maxWidth: "820px", margin: "0 auto", padding: "0 28px 72px" }}>
            <VpSubpageTop breadcrumbs={v.breadcrumbsFor(breadcrumbs.faqs)} style={{ padding: "40px 0 0" }}>
              <h1 className="vp-h1" style={{ margin: "0 0 32px" }}>{v.siteCopy.faqSectionTitle}</h1>
            </VpSubpageTop>
            <VpFaqAccordion items={v.faqs} className="vp-faq-accordion--page" />
          </div>
          </>)}
      
          
          {v.showBlog && (
            <VpBlogPage
              blogRows={v.blogRows}
              breadcrumbs={v.blogBreadcrumbs}
              onHomeClick={v.goHome}
              siteCopy={v.siteCopy}
              onEnquire={v.openContactEnquiry}
            />
          )}
      
          
          {v.showAbout && (<>
          <div data-screen-label="About" style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 28px 72px" }}>
            <VpSubpageTop breadcrumbs={v.breadcrumbsFor(breadcrumbs.about)} style={{ padding: "40px 0 0" }}>
              <h1 className="vp-h1" style={{ margin: "0 0 24px" }}>{about.title}</h1>
            </VpSubpageTop>
            <p style={{ fontSize: "16px", color: "var(--vp-ink)", lineHeight: "1.7", margin: "0 0 16px", textWrap: "pretty" }}>{about.p1}</p>
            <p style={{ fontSize: "16px", color: "var(--vp-ink)", lineHeight: "1.7", margin: "0 0 16px", textWrap: "pretty" }}>{about.p2}</p>
            <div style={{ background: "var(--vp-fog)", borderInlineStart: "4px solid var(--vp-navy)", borderRadius: "0 8px 8px 0", padding: "20px 24px", margin: "24px 0 32px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".05em", color: "var(--vp-ink)", marginBottom: "8px" }}>{about.exportVisionEyebrow}</div>
              <p style={{ fontSize: "16px", color: "var(--vp-ink)", lineHeight: "1.7", margin: "0", textWrap: "pretty" }}>{about.exportVisionBody}</p>
            </div>
            <div style={{ border: "1px solid var(--vp-fog)", borderRadius: "8px", overflow: "hidden", marginBottom: "20px" }}>
              {v.companyRows.map((r, i_r) => (
                <div key={i_r} className="vp-kv-row vp-kv-row--wide-key">
                  <div style={{ padding: "12px 20px", fontSize: "12px", fontWeight: "600", background: "var(--vp-fog)" }}>{r.k}</div>
                  <div style={{ padding: "12px 20px", fontSize: "12px", color: "var(--vp-ink)", lineHeight: "1.5" }}>{r.v}</div>
                </div>
              ))}
            </div>
            <button onClick={v.goContact} className="vp-cta-primary vp-cta-primary--lg" type="button">{about.contactTeam}</button>
      
            
            <div id="why-choose-vividpoly" style={{ height: "1px", background: "var(--vp-fog)", margin: "52px 0" }}></div>
      
            
            <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--vp-ink)", marginBottom: "12px" }}>{about.whyEyebrow}</div>
            <h2 className="vp-h2" style={{ margin: "0 0 20px" }}>{about.whyHeading}</h2>
            <p style={{ fontSize: "16px", color: "var(--vp-ink)", lineHeight: "1.7", margin: "0 0 28px", textWrap: "pretty" }}>{about.whyLead}</p>
            <div className="vp-why-choose">
              <ul className="vp-why-choose-list">
                {v.whyRows.map((r, i_r) => (
                  <li key={i_r} className="vp-why-choose-item">
                    <h3 className="vp-why-choose-item-title">{r.k}</h3>
                    <p className="vp-why-choose-item-text">{r.v}</p>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={v.goQuote} className="vp-cta-primary vp-cta-primary--lg" style={{ marginTop: "28px" }} type="button">{about.requestCustomQuote}</button>
          </div>
          </>)}
      
          
          {v.showContact && (<>
          <div data-screen-label="Contact" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 28px 72px" }}>
            <VpSubpageTop breadcrumbs={v.breadcrumbsFor(breadcrumbs.contact)} style={{ padding: "40px 0 0" }}>
              <h1 className="vp-h1" style={{ margin: "0 0 8px" }}>{contact.title}</h1>
              <p style={{ fontSize: "16px", color: "var(--vp-ink)", margin: "0 0 32px", lineHeight: "1.6", maxWidth: "760px" }}>{v.siteCopy.contactIntro}</p>
            </VpSubpageTop>
            <div className="vp-contact-layout">
              <aside className="vp-contact-details" aria-label={contact.title}>
                <div className="vp-contact-details-head">{contact.reachUs}</div>
                <div className="vp-contact-quick">
                  {v.contactQuick.map((item: { label: string; value: string; href: string }) => (
                    <div key={item.label} className="vp-contact-quick-item">
                      <span className="vp-contact-quick-label">{item.label}</span>
                      <a href={item.href} className="vp-contact-quick-value">{item.value}</a>
                    </div>
                  ))}
                </div>
                <div className="vp-contact-addresses">
                  {v.contactAddresses.map((item: { label: string; value: string }) => (
                    <div key={item.label} className="vp-contact-address">
                      <span className="vp-contact-address-label">{item.label}</span>
                      <p className="vp-contact-address-value">{item.value}</p>
                    </div>
                  ))}
                </div>
              </aside>
              <div className="vp-contact-form-card">
                <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "20px" }}>{contact.sendRequirement}</div>
                <div className="vp-contact-form-grid">
                  <div><div style={{ fontSize: "12px", fontWeight: "600", color: "var(--vp-ink)", marginBottom: "4px" }}>{contact.formName}</div><input value={v.qv.name ?? ''} onChange={v.qSet.name} className="vp-quote-contact-input" /></div>
                  <div><div style={{ fontSize: "12px", fontWeight: "600", color: "var(--vp-ink)", marginBottom: "4px" }}>{contact.formCompany}</div><input value={v.qv.company ?? ''} onChange={v.qSet.company} className="vp-quote-contact-input" /></div>
                  <div><div style={{ fontSize: "12px", fontWeight: "600", color: "var(--vp-ink)", marginBottom: "4px" }}>{contact.formEmail}</div><input type="email" value={v.qv.email ?? ''} onChange={v.qSet.email} className="vp-quote-contact-input" /></div>
                  <div><div style={{ fontSize: "12px", fontWeight: "600", color: "var(--vp-ink)", marginBottom: "4px" }}>{contact.formPhone}</div><input value={v.qv.whatsapp ?? ''} onChange={v.qSet.whatsapp} className="vp-quote-contact-input" /></div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--vp-ink)", marginBottom: "4px" }}>{contact.formCountry}</div>
                    <VpCustomSelect
                      value={v.qv.country ?? ''}
                      onChange={v.selectCountry}
                      options={v.contactCountries}
                      placeholder={common.selectCountry}
                      ariaLabel={contact.formCountry}
                      searchable
                      menuClassName="vp-sort-menu--contact"
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--vp-ink)", marginBottom: "4px" }}>{contact.formProductType}</div>
                    <VpCustomSelect
                      value={(v.qv.product as string) ?? ''}
                      onChange={v.selectContactProduct}
                      options={v.contactProductOptions.map((p) => p.label)}
                      placeholder={common.selectBagType}
                      ariaLabel={contact.formProductType}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}><div style={{ fontSize: "12px", fontWeight: "600", color: "var(--vp-ink)", marginBottom: "4px" }}>Message</div><textarea value={v.qv.message ?? ''} onChange={v.qSet.message} className="vp-quote-contact-input vp-quote-contact-input--textarea" /></div>
                </div>
                <button
                  onClick={v.submitContactEnquiry}
                  disabled={!v.contactEnquiryCanSubmit}
                  className="vp-cta-primary vp-cta-primary--lg vp-cta-primary--block"
                  style={{ marginTop: "20px" }}
                  type="button"
                >
                  Submit Enquiry
                </button>
              </div>
            </div>
          </div>
          </>)}
      
          
          {v.showSample && (<>
          <div data-screen-label="Sample order" className="vp-checkout-page">
            <VpSampleCheckout v={v} />
          </div>
          </>)}
      
          
          {v.showQuote && (<>
          <div
            data-screen-label={v.qStep6 ? 'Enquiry received' : 'Get a quote'}
            className={v.qStep6 || v.qStep4 ? 'vp-quote-page vp-quote-page--success' : 'vp-quote-page'}
          >
            {v.quoteForm && (<>
            {!v.qStep4 && (
            <div className="vp-quote-hero">
              <div className="vp-quote-hero-inner">
                <VpSubpageTop breadcrumbs={v.quoteBreadcrumbs} onHomeClick={v.goHome} className="vp-quote-crumb" />
                <span className="vp-quote-eyebrow">{v.siteCopy.quotePageEyebrow}</span>
                <h1 className="vp-h1 vp-quote-title">
                  {v.qStep3
                    ? v.siteCopy.quoteContactStepTitle
                    : v.siteCopy.quotePageTitle}
                </h1>
                <p className="vp-quote-lead">
                  {v.qStep3
                    ? v.siteCopy.quoteContactStepLead
                    : v.siteCopy.quoteIntro1}
                </p>
                <ol className="vp-quote-stepper" aria-label={quote.stepContact}>
                  <li
                    className={`vp-quote-stepper-step${v.qStep3 ? ' vp-quote-stepper-step--active' : ''}${v.qStep5 ? ' vp-quote-stepper-step--done' : ''}`}
                    aria-current={v.qStep3 ? 'step' : undefined}
                  >
                    <span className="vp-quote-stepper-marker" aria-hidden="true">
                      {v.qStep5 ? '✓' : '1'}
                    </span>
                    <span className="vp-quote-stepper-copy">
                      <span className="vp-quote-stepper-kicker">{v.quoteStepLabels.stepKicker(1)}</span>
                      <span className="vp-quote-stepper-title">{quote.stepContact}</span>
                    </span>
                  </li>
                  <li
                    className={`vp-quote-stepper-connector${v.qStep5 ? ' vp-quote-stepper-connector--done' : ''}`}
                    aria-hidden="true"
                  />
                  <li
                    className={`vp-quote-stepper-step${v.qStep5 ? ' vp-quote-stepper-step--active' : ''}`}
                    aria-current={v.qStep5 ? 'step' : undefined}
                  >
                    <span className="vp-quote-stepper-marker" aria-hidden="true">2</span>
                    <span className="vp-quote-stepper-copy">
                      <span className="vp-quote-stepper-kicker">{v.quoteStepLabels.stepKicker(2)}</span>
                      <span className="vp-quote-stepper-title">{quote.stepBagSpec}</span>
                    </span>
                  </li>
                </ol>
              </div>
            </div>
            )}

            <div className="vp-quote-main">
              {v.qStep3 && (
                <section className="vp-quote-panel" aria-labelledby="vp-quote-contact-step-title">
                  <div className="vp-quote-panel-head">
                    <h2 id="vp-quote-contact-step-title" className="vp-quote-panel-title">{quote.howReachYou}</h2>
                    <p className="vp-quote-panel-sub">{quote.registerLead}</p>
                  </div>
                  <VpQuoteContactForm
                    initialValues={quoteContactFromQuote(v.qv)}
                    contactCountries={v.contactCountries}
                    submitLabel={v.siteCopy.quoteContactSubmitLabel}
                    labels={quoteContactLabels}
                    onSubmit={v.quoteContinueFromContact}
                    autoFocus
                    className="vp-quote-contact-inline"
                  />
                </section>
              )}

              {v.qStep4 && (
                <VpQuoteLeadCaptured
                  siteCopy={v.siteCopy}
                  contactName={v.qv.name}
                  embedded
                  minimal
                />
              )}

              {v.qStep5 && (
                <>
                  {v.quoteBagSpecPrompt && (
                    <VpQuoteLeadCaptured
                      siteCopy={v.siteCopy}
                      contactName={v.qv.name}
                      embedded
                      minimal
                    />
                  )}
                  <section className="vp-quote-panel vp-quote-panel--bag-spec" aria-labelledby="vp-quote-review-title">
                    <div className="vp-quote-panel-head vp-quote-panel-head--compact">
                      <h2 id="vp-quote-review-title" className="vp-quote-panel-title">Bag spec</h2>
                    </div>
                    <VpBagSpecForm
                      fields={v.reviewFields}
                      steps={v.reviewFieldSteps}
                    />
                  </section>
                </>
              )}

              {v.qStep3 && (
              <div className="vp-quote-actions">
                <button type="button" onClick={v.quotePageBack} className="vp-cta-secondary vp-cta-secondary--lg">Back</button>
              </div>
              )}

              {v.qStep5 && (
              <div className="vp-quote-actions vp-quote-actions--end">
                <button
                  type="button"
                  onClick={v.quoteFinalSubmit}
                  disabled={!v.quoteBagSpecCanSubmit}
                  className="vp-cta-primary vp-cta-primary--lg"
                >
                  Submit enquiry
                </button>
              </div>
              )}
            </div>
            </>)}
      
            {v.qStep6 && (
              v.quoteLeadOnly ? (
                <VpQuoteLeadCaptured
                  siteCopy={v.siteCopy}
                  contactName={v.qv.name}
                  minimal
                />
              ) : (
                <VpQuoteSuccess
                  siteCopy={v.siteCopy}
                  onRestart={v.quoteRestart}
                />
              )
            )}
      
          </div>
          </>)}
      
        </main>
      
        
        <footer className="vp-site-footer">
          <div className="vp-footer-shell">
            <div className="vp-footer-grid">
              <div className="vp-footer-col vp-footer-col--brand">
                <div className="vp-footer-brand">
                  <VpLogo variant="inverse" className="vp-wordmark--footer" />
                </div>
                <p className="vp-footer-about">
                  {footer.aboutBlurb}
                </p>
              </div>

              <div className="vp-footer-col">
                <h3 className="vp-footer-heading">{footer.company}</h3>
                <div className="vp-footer-link-list">
                  {v.footCompany.map((l, i_l) => (
                    <button key={i_l} type="button" onClick={l.open} className="vp-footer-link">{l.label}</button>
                  ))}
                </div>
              </div>

              <div className="vp-footer-col vp-footer-col--products">
                <h3 className="vp-footer-heading">{footer.productTypes}</h3>
                <div className="vp-footer-product-cols">
                  <div className="vp-footer-link-list">
                    {v.footProductsLeft.map((l, i_l) => (
                      <button key={i_l} type="button" onClick={l.open} className="vp-footer-link">{l.label}</button>
                    ))}
                  </div>
                  <div className="vp-footer-link-list">
                    {v.footProductsRight.map((l, i_l) => (
                      <button key={i_l} type="button" onClick={l.open} className="vp-footer-link">{l.label}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="vp-footer-col">
                <h3 className="vp-footer-heading">{footer.buyerHelp}</h3>
                <div className="vp-footer-link-list">
                  {v.footHelp.map((l, i_l) => (
                    <button key={i_l} type="button" onClick={l.open} className="vp-footer-link">{l.label}</button>
                  ))}
                </div>
              </div>

              <div className="vp-footer-col">
                <h3 className="vp-footer-heading">{footer.contact}</h3>
                <div className="vp-footer-link-list">
                  <span className="vp-footer-contact-item">INFO@VIVIDPOLY.COM</span>
                  <span className="vp-footer-contact-item">+91 9998014994</span>
                  <span className="vp-footer-contact-item">+61 426712534</span>
                </div>
              </div>
            </div>

            <div className="vp-footer-bottom">
              © 2026 VIVIDPOLY · WWW.VIVIDPOLY.COM · PP Bags Exporter from India
            </div>
          </div>
        </footer>

        {v.quoteContactOpen && <VpQuoteContactSheet v={v} />}
      </div>
  );
}

function isInsideScrollOverlay(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest('.vp-sort-menu')
    || target.closest('.vp-nav-dropdown')
    || target.closest('.vp-quote-contact-overlay'),
  );
}

function getScrollY() {
  if (typeof window === 'undefined') return 0;

  let y =
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

  const root = document.querySelector('.vp-root');
  let el = root?.parentElement ?? null;
  while (el) {
    const { overflowY } = getComputedStyle(el);
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
      y = Math.max(y, el.scrollTop);
    }
    el = el.parentElement;
  }

  return y;
}

type NavMenuLink = {
  title: string;
  desc: string;
  icon: 'blog' | 'faqs';
  open: () => void;
};

function ResourceNavIcon({ type }: { type: NavMenuLink['icon'] }) {
  if (type === 'blog') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M5 4H15V16H5V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 8H12M8 11H12M8 14H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 7.75C7.7 6.8 8.55 6 10 6C11.65 6 12.5 7 12.5 8C12.5 9.35 11.2 9.8 10.2 10.2C9.45 10.55 9 11 9 11.75V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14.25" r="0.75" fill="currentColor" />
    </svg>
  );
}
