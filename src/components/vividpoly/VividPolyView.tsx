'use client';

import { useCallback, useEffect, useRef, useState, type MutableRefObject, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useVividPoly } from '@/hooks/useVividPoly';
import { bindAllHovers } from '@/lib/vividpoly-style';
import VpQuoteSuccess from '@/components/vividpoly/VpQuoteSuccess';
import VpQuoteLeadCaptured from '@/components/vividpoly/VpQuoteLeadCaptured';
import VpBagSpecForm from '@/components/vividpoly/VpBagSpecForm';
import VpQuoteContactForm, { quoteContactFromQuote } from '@/components/vividpoly/VpQuoteContactForm';
import VpCustomSelect from '@/components/vividpoly/VpCustomSelect';
import VpPdpDetails from '@/components/vividpoly/VpPdpDetails';
import VpSampleCheckout from '@/components/vividpoly/VpSampleCheckout';
import VpBlogPage from '@/components/vividpoly/VpBlogPage';
import VpCareersPage from '@/components/vividpoly/VpCareersPage';
import VpFaqAccordion from '@/components/vividpoly/VpFaqAccordion';
import VpSubpageTop from '@/components/vividpoly/VpSubpageTop';
import VpLogo from '@/components/vividpoly/VpLogo';
import VpTopUtilityBar from '@/components/vividpoly/VpTopUtilityBar';
import VpEnquiryFab from '@/components/vividpoly/VpEnquiryFab';
import VpEnquiryModal from '@/components/vividpoly/VpEnquiryModal';
import VpContactEnquiryForm from '@/components/vividpoly/VpContactEnquiryForm';
import VpPhotoSlot from '@/components/vividpoly/VpPhotoSlot';
import VpHeroCarousel, { type HeroSlide } from '@/components/vividpoly/VpHeroCarousel';
import VpCertBadge from '@/components/vividpoly/VpCertBadge';
import { WhatsAppIcon } from '@/components/vividpoly/VividPolyIcons';
import { useEnquiryPopup } from '@/hooks/useEnquiryPopup';
import { markEnquiryDismissed, markEnquirySubmitted } from '@/lib/enquiry-popup-session';
import VpCapacityFilter from '@/components/vividpoly/VpCapacityFilter';
import VpSortSelect from '@/components/vividpoly/VpSortSelect';
import VpCatalogueGuideTooltip from '@/components/vividpoly/VpCatalogueGuideTooltip';
import {
  jumpChildIntoHorizontalView,
  requestSkipNextScrollToTop,
  scrollChildIntoHorizontalView,
  scrollPageToTop,
  scrollToAnchorWithHeaderOffset,
} from '@/lib/vividpoly-navigation';
// Only posters that share the same 3:4 (0.75) ratio are used in the hero so the
// frame stays one fixed size and no image is cropped. Wider posters (0.80 to
// 0.84) are intentionally excluded to avoid cropping and frame resizing.
const HERO_CAROUSEL_SLIDES: HeroSlide[] = [
  { id: 'open-mouth', label: 'PP Woven Sack', ratio: 0.75 },
  { id: 'stitched', label: 'Double Stitch PP Woven Sack', ratio: 0.75 },
  { id: 'block-bottom', label: 'Block Bottom Bag', ratio: 0.75 },
  { id: 'pinch-bottom', label: 'Pinch Bottom Bag', ratio: 0.75 },
].map((slide) => ({
  src: `/images/products/${slide.id}.jpg`,
  alt: `VIVIDPOLY ${slide.label}`,
  ratio: slide.ratio,
}));

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
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [mobileNavExpanded, setMobileNavExpanded] = useState<null | 'products' | 'industry' | 'resources'>(null);
  const [catalogueIntroExpanded, setCatalogueIntroExpanded] = useState(false);
  const navHoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollYRef = useRef(0);

  const canHoverNav = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const openNavMenuHover = (menu: 'products' | 'industry' | 'resources') => {
    if (!canHoverNav()) return;
    if (navHoverCloseTimer.current) {
      clearTimeout(navHoverCloseTimer.current);
      navHoverCloseTimer.current = null;
    }
    v.setMenu(menu);
  };

  const scheduleCloseNavMenuHover = () => {
    if (!canHoverNav()) return;
    if (navHoverCloseTimer.current) clearTimeout(navHoverCloseTimer.current);
    navHoverCloseTimer.current = setTimeout(() => {
      v.setMenu(null);
      navHoverCloseTimer.current = null;
    }, 160);
  };
  const showHomeRef = useRef(v.showHome);
  showHomeRef.current = v.showHome;
  const activeBuyerRef = useRef(v.activeBuyer);
  activeBuyerRef.current = v.activeBuyer;

  useEffect(() => {
    setHeaderMounted(true);
  }, []);

  useEffect(() => {
    bindAllHovers(rootRef.current);
  }, [v.screen, v.menu, v.showHome, v.showCatalogue, v.showPdp]);

  useEffect(() => {
    setCatalogueIntroExpanded(false);
  }, [v.catTitle]);

  useEffect(() => {
    window.dispatchEvent(new Event('vp:layout'));
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

  const openEnquiryModal = useCallback(() => {
    v.resetEnquiryDefaults();
    setEnquiryModalOpen(true);
  }, [v.resetEnquiryDefaults]);

  const closeEnquiryModal = useCallback(() => {
    setEnquiryModalOpen(false);
    markEnquiryDismissed();
  }, []);

  useEnquiryPopup({ onAutoOpen: openEnquiryModal });

  const pendingContactScrollRef = useRef(false);

  const goToContactForm = useCallback(() => {
    setEnquiryModalOpen(false);
    setMobileNavOpen(false);
    setMobileNavExpanded(null);
    if (v.showContact) {
      scrollToAnchorWithHeaderOffset('vp-contact-enquiry', 'smooth', 12);
      return;
    }
    pendingContactScrollRef.current = true;
    requestSkipNextScrollToTop();
    v.goContact();
  }, [v.showContact, v.goContact]);

  useEffect(() => {
    if (!v.showContact || !pendingContactScrollRef.current) return;
    pendingContactScrollRef.current = false;
    const id = window.setTimeout(() => {
      scrollToAnchorWithHeaderOffset('vp-contact-enquiry', 'smooth', 12);
    }, 50);
    return () => window.clearTimeout(id);
  }, [v.showContact]);

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

    const syncHeaderBlend = (y = getScrollY()) => {
      const hero = document.querySelector('.vp-hero') as HTMLElement | null;
      if (!hero || !showHomeRef.current) {
        setHeaderBlend(false);
        return;
      }
      const heroBottom = hero.getBoundingClientRect().bottom;
      setHeaderBlend(heroBottom > 120);
    };

    const updateHeaderFromScroll = (y: number) => {
      const delta = y - lastScrollYRef.current;

      if (y <= 8) {
        setHeaderHidden(false);
      } else if (delta > 4) {
        setHeaderHidden(true);
      } else if (delta < -2) {
        setHeaderHidden(false);
      }

      syncHeaderBlend(y);
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
      } else if (event.deltaY > 1) {
        setHeaderHidden(true);
      } else if (event.deltaY < -1) {
        setHeaderHidden(false);
      }

      syncHeaderBlend(y);
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
      } else if (dy < -6) {
        setHeaderHidden(true);
      } else if (dy > 6) {
        setHeaderHidden(false);
      }

      syncHeaderBlend(y);
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
      if (enquiryModalOpen) {
        closeEnquiryModal();
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
  }, [v.menu, v.closeAll, mobileNavOpen, enquiryModalOpen, closeEnquiryModal]);

  const nav = v.ui.nav;
  const common = v.ui.common;
  const home = v.ui.home;
  const about = v.ui.about;
  const footer = v.ui.footer;
  const contact = v.ui.contact;
  const quote = v.ui.quote;
  const breadcrumbs = v.ui.breadcrumbs;
  const quoteContactLabels = v.quoteContactLabels;

  const topBar = v.ui.topBar;
  const fab = v.ui.fab;
  const enquiryModal = v.ui.enquiryModal;

  const enquiryFormProps = {
    copy: contact,
    commonSelectCountry: common.selectCountry,
    commonSelectEnquiryType: common.selectEnquiryType,
    enquiryProductTypes: v.enquiryProductTypes,
    contactCountries: v.contactCountries,
    values: {
      name: v.qv.name ?? '',
      company: v.qv.company ?? '',
      email: v.qv.email ?? '',
      phone: v.qv.whatsapp ?? '',
      country: v.qv.country ?? '',
      enquiryType: v.enquiryProductTypes.some((item) => item.label === v.qv.product)
        ? (v.qv.product as string)
        : v.generalEnquiryType,
      message: v.qv.message ?? '',
    },
    onChange: {
      name: v.contactFieldSet.name,
      company: v.contactFieldSet.company,
      email: v.contactFieldSet.email,
      phone: v.contactFieldSet.phone,
      country: v.contactFieldSet.country,
      enquiryType: v.selectContactProduct,
      message: v.contactFieldSet.message,
    },
  };

  const siteHeader = (
    <div ref={headerRef} className={`vp-site-chrome vp-site-chrome--fixed${headerVisible ? '' : ' vp-site-chrome--hidden'}${headerBlend ? ' vp-site-chrome--blend' : ''}${mobileNavOpen ? ' vp-site-chrome--mobile-nav-open' : ''}`}>
      <VpTopUtilityBar topBar={topBar} />
      <header className={`vp-header${headerBlend ? ' vp-header--blend' : ''}`}>
      <div className="vp-header-shell">
        <div className="vp-header-start">
          <button type="button" onClick={v.goHome} className="vp-header-logo" aria-label={nav.logoHome}>
            <VpLogo variant="light" className="vp-wordmark--nav" />
          </button>
          <nav className="vp-header-nav vp-header-nav--desktop" aria-label={nav.mainNav}>
            <button
              onClick={v.goAbout}
              type="button"
              className={`vp-header-nav-btn${v.showAbout ? ' vp-header-nav-btn--active' : ''}`}
            >
              {nav.about}
            </button>
            <button
              onClick={() => {
                if (navHoverCloseTimer.current) {
                  clearTimeout(navHoverCloseTimer.current);
                  navHoverCloseTimer.current = null;
                }
                // Touch devices have no hover, so tapping should reveal the
                // dropdown instead of jumping straight to the catalogue.
                if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
                  v.toggleProducts();
                  return;
                }
                v.goCatalogueType();
              }}
              onMouseEnter={() => openNavMenuHover('products')}
              onMouseLeave={scheduleCloseNavMenuHover}
              type="button"
              className={`vp-header-nav-btn${v.menuProducts || (v.showCatalogue && !v.catByUse) || v.showPdp ? ' vp-header-nav-btn--active' : ''}`}
              aria-expanded={v.menuProducts}
              aria-controls="vp-nav-products-panel"
            >
              {nav.products}
              <span className="vp-header-nav-caret" aria-hidden="true">▾</span>
            </button>
            <button
              onClick={v.toggleIndustry}
              onMouseEnter={() => openNavMenuHover('industry')}
              onMouseLeave={scheduleCloseNavMenuHover}
              type="button"
              className={`vp-header-nav-btn${v.menuIndustry || (v.showCatalogue && v.catByUse) ? ' vp-header-nav-btn--active' : ''}`}
              aria-expanded={v.menuIndustry}
              aria-controls="vp-nav-industry-panel"
            >
              {nav.industryServed}
              <span className="vp-header-nav-caret" aria-hidden="true">▾</span>
            </button>
            <button
              onClick={v.toggleResources}
              onMouseEnter={() => openNavMenuHover('resources')}
              onMouseLeave={scheduleCloseNavMenuHover}
              type="button"
              className={`vp-header-nav-btn${v.menuResources || v.showFaqs || v.showBlog ? ' vp-header-nav-btn--active' : ''}`}
              aria-expanded={v.menuResources}
              aria-controls="vp-nav-resources-panel"
            >
              {nav.resources}
              <span className="vp-header-nav-caret" aria-hidden="true">▾</span>
            </button>
            <button
              onClick={v.goCareers}
              type="button"
              className={`vp-header-nav-btn${v.showCareers ? ' vp-header-nav-btn--active' : ''}`}
            >
              {nav.career}
            </button>
            <button
              onClick={v.goContact}
              type="button"
              className={`vp-header-nav-btn${v.showContact ? ' vp-header-nav-btn--active' : ''}`}
            >
              {nav.contact}
            </button>
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
        </div>
      </div>

      {v.menuProducts && (
        <div
          id="vp-nav-products-panel"
          className="vp-nav-dropdown"
          role="region"
          aria-label={nav.productsMenu}
          onMouseEnter={() => openNavMenuHover('products')}
          onMouseLeave={scheduleCloseNavMenuHover}
        >
          <div className="vp-nav-dropdown-inner">
            <div className="vp-nav-dropdown-grid vp-nav-dropdown-grid--products-4">
              {v.megaTypeGroups.map((g, i_g) => (
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
              <button type="button" onClick={v.megaTypeFooterAction} className="vp-nav-dropdown-footer-btn">{nav.viewAllByType}</button>
            </div>
          </div>
        </div>
      )}

      {v.menuIndustry && (
        <div
          id="vp-nav-industry-panel"
          className="vp-nav-dropdown"
          role="region"
          aria-label={nav.industryMenu}
          onMouseEnter={() => openNavMenuHover('industry')}
          onMouseLeave={scheduleCloseNavMenuHover}
        >
          <div className="vp-nav-dropdown-inner">
            <div className="vp-nav-dropdown-grid vp-nav-dropdown-grid--products-4">
              {v.megaUseGroups.map((g, i_g) => (
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
              <button type="button" onClick={v.megaUseFooterAction} className="vp-nav-dropdown-footer-btn">{nav.viewAllByIndustry}</button>
            </div>
          </div>
        </div>
      )}

      {v.menuResources && (
        <div
          id="vp-nav-resources-panel"
          className="vp-nav-dropdown vp-nav-dropdown--resources"
          role="region"
          aria-label={nav.resourcesMenu}
          onMouseEnter={() => openNavMenuHover('resources')}
          onMouseLeave={scheduleCloseNavMenuHover}
        >
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
    </div>
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
                <button type="button" className="vp-mobile-drawer-link" onClick={() => { v.goAbout(); closeMobileNav(); }}>{nav.about}</button>

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
                    </div>
                  )}
                </div>

                <div className="vp-mobile-drawer-section">
                  <button
                    type="button"
                    className={`vp-mobile-drawer-link vp-mobile-drawer-link--expand${mobileNavExpanded === 'industry' ? ' vp-mobile-drawer-link--expanded' : ''}`}
                    aria-expanded={mobileNavExpanded === 'industry'}
                    onClick={() => setMobileNavExpanded((section) => (section === 'industry' ? null : 'industry'))}
                  >
                    {nav.industryServed}
                    <span className="vp-mobile-drawer-chevron" aria-hidden="true" />
                  </button>
                  {mobileNavExpanded === 'industry' && (
                    <div className="vp-mobile-drawer-panel">
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

                <button type="button" className="vp-mobile-drawer-link" onClick={() => { v.goCareers(); closeMobileNav(); }}>{nav.career}</button>

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
                  <div className="vp-hero-trust vp-hero-rise" aria-label="Credentials">
                    <ul className="vp-hero-trust-col vp-hero-trust-col--certs">
                      <li>
                        <VpCertBadge kind="iso" size="sm" className="vp-hero-cert-badge" />
                        <span className="vp-hero-trust-label">{v.siteCopy.heroIsoLabel || 'ISO certified'}</span>
                      </li>
                      <li>
                        <VpCertBadge kind="iec" size="sm" className="vp-hero-cert-badge" />
                        <span className="vp-hero-trust-label">{v.siteCopy.heroIecLabel || 'IEC certified'}</span>
                      </li>
                    </ul>
                    <ul className="vp-hero-trust-col">
                      {(v.siteCopy.homeStats || []).slice(0, 2).map((stat: { value: string; label: string }, index: number) => (
                        <li key={stat.label}>
                          <span className="vp-hero-trust-icon" aria-hidden="true">
                            <HeroStatIcon index={index} />
                          </span>
                          <span className="vp-hero-trust-stat-copy">
                            <strong>{stat.value}</strong>
                            <span>{stat.label}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <ul className="vp-hero-trust-col">
                      {(v.siteCopy.homeStats || []).slice(2, 4).map((stat: { value: string; label: string }, index: number) => (
                        <li key={stat.label}>
                          <span className="vp-hero-trust-icon" aria-hidden="true">
                            <HeroStatIcon index={index + 2} />
                          </span>
                          <span className="vp-hero-trust-stat-copy">
                            <strong>{stat.value}</strong>
                            <span>{stat.label}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="vp-hero-rise vp-hero-ctas">
                    <a
                      href={v.siteCopy.heroWhatsAppHref || topBar.whatsappHref}
                      className="vp-cta-primary vp-cta-primary--lg vp-cta-whatsapp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon size={20} />
                      <span>{v.siteCopy.heroCtaWhatsApp || 'WhatsApp'}</span>
                    </a>
                    <button onClick={v.goCatalogueType} className="vp-cta-secondary vp-cta-secondary--lg" type="button">{v.siteCopy.heroCtaSecondary}</button>
                  </div>
                </div>
                <div className="vp-hero-visual vp-hero-rise">
                  <VpHeroCarousel slides={HERO_CAROUSEL_SLIDES} />
                </div>
              </div>

              <div className="vp-hero-markets" aria-label="Product range">
                <div className="vp-hero-markets-track">
                  <div className="vp-marquee">
                    {v.products.map((product: { id: string; name: string }) => (
                      <span key={`p1-${product.id}`}>{product.name}</span>
                    ))}
                    {v.products.map((product: { id: string; name: string }) => (
                      <span key={`p2-${product.id}`}>{product.name}</span>
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
                <button type="button" onClick={v.goCatalogueType} className="vp-start-card">
                  <VpPhotoSlot src="/images/shop-product-type.jpg" alt="" variant="card" className="vp-start-card-media" />
                  <div className="vp-start-card-copy">
                    <div className="vp-start-card-title">{home.shopByProductType}</div>
                    <div className="vp-start-card-desc">{home.shopByProductTypeDesc}</div>
                  </div>
                </button>
                <button type="button" onClick={v.goCatalogueUse} className="vp-start-card">
                  <VpPhotoSlot src="/images/shop-industry.jpg" alt="" variant="card" className="vp-start-card-media" />
                  <div className="vp-start-card-copy">
                    <div className="vp-start-card-title">{home.shopByIndustry}</div>
                    <div className="vp-start-card-desc">{home.shopByIndustryDesc}</div>
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
              <div className="vp-prod-marquee-viewport">
                <div className="vp-prod-marquee">
                  {v.products.map((p, i_p) => (
                    <button key={`p1-${i_p}`} type="button" onClick={p.open} className="vp-prod-card" aria-label={`View ${p.name}`}>
                      <VpPhotoSlot src={`/images/products/${p.id}.jpg`} alt="" variant="thumb" className="vp-prod-card-img" />
                      <div className="vp-prod-card-body">
                        <div className="vp-prod-card-title">{p.name}</div>
                        <p className="vp-prod-card-desc">{p.short}</p>
                        <div className="vp-prod-card-footer">
                          <span className="vp-prod-card-cta">View Details →</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  {v.products.map((p, i_p) => (
                    <button key={`p2-${i_p}`} type="button" onClick={p.open} className="vp-prod-card" aria-hidden="true" tabIndex={-1}>
                      <VpPhotoSlot src={`/images/products/${p.id}.jpg`} alt="" variant="thumb" className="vp-prod-card-img" />
                      <div className="vp-prod-card-body">
                        <div className="vp-prod-card-title">{p.name}</div>
                        <p className="vp-prod-card-desc">{p.short}</p>
                        <div className="vp-prod-card-footer">
                          <span className="vp-prod-card-cta">View Details →</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
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
                    </div>
                  </>)}
                </div>
              </div>
            </section>
      
            
            <section id="vp-home-faq" className="vp-faq-section">
              <div className="vp-faq-section-inner">
                <div className="vp-faq-section-head">
                  <p className="vp-faq-section-eyebrow">FAQs</p>
                  <h2 className="vp-h2 vp-faq-section-title">{v.siteCopy.faqSectionTitle}</h2>
                </div>
                <VpFaqAccordion items={v.faqs} />
              </div>
            </section>
      
            
            <section className="vp-final-cta-band" style={{ background: "var(--vp-navy-deep)", color: "var(--vp-white)" }}>
              <div className="vp-final-cta-inner">
                <h2 className="vp-h2 vp-final-cta-head">{v.siteCopy.finalCtaTitle}</h2>
                <p className="vp-body-text vp-body-text--on-dark vp-body-text--centered vp-final-cta-body-wrap">{v.siteCopy.finalCtaBody}</p>
                <button onClick={v.goContact} className="vp-cta-primary vp-cta-primary--lg vp-cta-primary--on-dark" type="button">{v.siteCopy.finalCtaButton}</button>
              </div>
            </section>
      
          </div>
          </>)}
      
          
          {v.showCatalogue && (<>
          <div data-screen-label="Catalogue">
            <VpSubpageTop breadcrumbs={v.catBreadcrumbs} onHomeClick={v.goHome} className="vp-subpage-top-shell">
              <h1 className="vp-h1 vp-catalogue-page-title">{v.catTitle}</h1>
              <div
                className={`vp-catalogue-intro${catalogueIntroExpanded ? ' vp-catalogue-intro--expanded' : ''}`}
              >
                <p className="vp-catalogue-intro-text">{v.catSub}</p>
                <button
                  type="button"
                  className="vp-catalogue-intro-toggle"
                  aria-expanded={catalogueIntroExpanded}
                  onClick={() => setCatalogueIntroExpanded((expanded) => !expanded)}
                >
                  {catalogueIntroExpanded ? 'Show less' : 'Read more'}
                </button>
              </div>
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
                          <svg
                            className="vp-catalogue-filter-icon"
                            width="15"
                            height="15"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M2 4h12M4.5 8h7M6.5 12h3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
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
                      <b>{v.filteredCount}</b> <span className="vp-catalogue-count-label">products</span>
                      {v.filtersActive && <span className="vp-catalogue-count-muted"> (filtered)</span>}
                    </span>
                  </div>
                  <div className={`vp-sort-label${v.catGuide === 'use-sort' && v.catByUse ? ' vp-sort-label--guided' : ''}`}>
                    <span className="vp-sort-label-text">{v.siteCopy.shopByUseLabel}</span>
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
                      className="vp-sort--catalogue-toolbar"
                      ariaLabel={v.siteCopy.shopByUseLabel}
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
                    <article
                      key={i_p}
                      className={`vp-catalogue-card${p.recommended ? ' vp-catalogue-card--recommended' : ''}`}
                      onClick={p.open}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          p.open();
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="vp-catalogue-card-media-wrap">
                        {p.recommended && <span className="vp-prod-rec-badge">Recommended</span>}
                        <VpPhotoSlot src={`/images/products/${p.id}.jpg`} alt="" variant="thumb" className="vp-catalogue-card-media" />
                      </div>
                      <div className="vp-catalogue-card-body">
                        <span className="vp-catalogue-card-name">{p.name}</span>
                        <p className="vp-catalogue-card-desc">{p.short}</p>
                        <div className="vp-catalogue-card-actions">
                          <button onClick={(e) => { e.stopPropagation(); p.open(); }} className="vp-catalogue-card-btn--ghost" type="button">{common.viewDetails}</button>
                          <button onClick={(e) => { e.stopPropagation(); p.quote(); }} className="vp-catalogue-card-btn--primary" type="button">{common.getQuote}</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </>)}
      
          
          {v.showPdp && (<>
          <div data-screen-label="Product detail">
            <VpSubpageTop breadcrumbs={v.pdpBreadcrumbs} onHomeClick={v.goHome} className="vp-subpage-top-shell vp-subpage-top-shell--pdp" />
            <div className="vp-pdp-layout">
              <div className="vp-pdp-gallery">
                <VpPhotoSlot
                  key={v.pdpGalleryMainSrc}
                  src={v.pdpGalleryMainSrc}
                  alt={v.product?.name || 'Product'}
                  variant="thumb"
                  className="vp-pdp-gallery-main"
                />
                <div className="vp-pdp-gallery-thumbs">
                  {v.galleryThumbs.map((t, i_t) => (
                    <button key={i_t} type="button" onClick={t.sel} className="vp-gallery-thumb" style={{ border: t.bd }} aria-label={`Product image ${i_t + 1}`}>
                      <VpPhotoSlot
                        src={t.src}
                        alt=""
                        variant="thumb"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="vp-pdp-summary">
                <h1 className="vp-h1 vp-pdp-summary-title">{v.product.name}</h1>
                <p className="vp-body-text vp-body-text--mb-md">{v.product.intro}</p>
                <div className="vp-pdp-trust-badges">
                  {v.trustBadges.map((b, i_b) => (
                    <span key={i_b} className="vp-pdp-trust-badge"><span className="vp-pdp-trust-badge-icon">✓</span>{b.t}</span>
                  ))}
                </div>
                <div className="vp-spec-panel">
                  <div className="vp-spec-panel-head">Specification</div>
                  {v.pdpSpec.map((r, i_r) => (
                    <div key={i_r} className="vp-kv-row">
                      <div className="vp-kv-cell vp-kv-cell--key">{r.p}</div>
                      <div className="vp-kv-cell vp-kv-cell--value vp-body-text">{r.o}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <VpPdpDetails product={v.product} features={v.pdpFeatures} />

            <div className="vp-related-section">
              <h3 className="vp-related-heading">Related products</h3>
              <div className="vp-related-scroll">
                {v.relatedProducts.map((p, i_p) => (
                  <button key={i_p} type="button" onClick={p.open} className="vp-related-product" aria-label={`View ${p.name}`}>
                    <VpPhotoSlot src={p.imageSrc} alt="" variant="thumb" className="vp-related-product-img" />
                    <span className="vp-related-product-body">
                      <span className="vp-related-product-title">{p.name}</span>
                      <span className="vp-related-product-cta">View Details →</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          </>)}
      
          
          {v.showFaqs && (<>
          <div data-screen-label="FAQs" className="vp-page-shell">
            <VpSubpageTop breadcrumbs={v.breadcrumbsFor(breadcrumbs.faqs)} className="vp-subpage-top--page">
              <h1 className="vp-h1 vp-subpage-h1 vp-subpage-h1--spacious">{v.siteCopy.faqSectionTitle}</h1>
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
              onEnquire={v.goContact}
            />
          )}
      
          
          {v.showCareers && (
            <VpCareersPage
              copy={v.careersCopy}
              breadcrumbs={v.careersBreadcrumbs}
              onHomeClick={v.goHome}
            />
          )}

          {v.showAbout && (<>
          <div data-screen-label="About" className="vp-page-shell">
            <VpSubpageTop breadcrumbs={v.breadcrumbsFor(breadcrumbs.about)} className="vp-subpage-top--page">
              <h1 className="vp-h1 vp-subpage-h1">{about.title}</h1>
            </VpSubpageTop>
            <p className="vp-body-text vp-body-text--mb-sm">{about.p1}</p>
            <p className="vp-body-text vp-body-text--mb-sm">{about.p2}</p>
            <div className="vp-about-callout">
              <div className="vp-about-callout-eyebrow">{about.exportVisionEyebrow}</div>
              <p className="vp-about-callout-body">{about.exportVisionBody}</p>
            </div>
            <div className="vp-about-company-table">
              {v.companyRows.map((r, i_r) => (
                <div key={i_r} className="vp-kv-row vp-kv-row--wide-key">
                  <div className="vp-kv-cell vp-kv-cell--key">{r.k}</div>
                  <div className="vp-kv-cell vp-kv-cell--value vp-body-text">{r.v}</div>
                </div>
              ))}
            </div>
            <button onClick={v.goContact} className="vp-cta-primary vp-cta-primary--lg" type="button">{about.contactTeam}</button>
      
            
            <div id="why-choose-vividpoly" className="vp-about-section-divider" aria-hidden="true" />
      
            
            <div className="vp-section-eyebrow">{about.whyEyebrow}</div>
            <h2 className="vp-h2 vp-about-section-h2">{about.whyHeading}</h2>
            <p className="vp-body-text vp-body-text--mb-lg">{about.whyLead}</p>
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
          </div>
          </>)}
      
          
          {v.showContact && (<>
          <div data-screen-label="Contact" className="vp-page-shell">
            <VpSubpageTop breadcrumbs={v.breadcrumbsFor(breadcrumbs.contact)} className="vp-subpage-top--page">
              <h1 className="vp-h1 vp-subpage-title">{contact.title}</h1>
              <p className="vp-subpage-intro">{v.siteCopy.contactIntro}</p>
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
              <VpContactEnquiryForm {...enquiryFormProps} />
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

              <div className="vp-footer-col vp-footer-col--products">
                <div className="vp-footer-products-desktop">
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
                <details className="vp-footer-disclosure vp-footer-products-mobile">
                  <summary className="vp-footer-heading">{footer.productTypes}</summary>
                  <div className="vp-footer-link-list vp-footer-link-list--products">
                    {v.footProducts.map((l, i_l) => (
                      <button key={`m-${i_l}`} type="button" onClick={l.open} className="vp-footer-link">{l.label}</button>
                    ))}
                  </div>
                </details>
              </div>

              <div className="vp-footer-col vp-footer-col--links">
                <h3 className="vp-footer-heading">{footer.company}</h3>
                <div className="vp-footer-link-list">
                  {v.footCompany.map((l, i_l) => (
                    <button key={i_l} type="button" onClick={l.open} className="vp-footer-link">{l.label}</button>
                  ))}
                </div>
              </div>

              <div className="vp-footer-col vp-footer-col--links">
                <h3 className="vp-footer-heading">{footer.buyerHelp}</h3>
                <div className="vp-footer-link-list">
                  {v.footHelp.map((l, i_l) => (
                    <button key={i_l} type="button" onClick={l.open} className="vp-footer-link">{l.label}</button>
                  ))}
                </div>
              </div>

              <div className="vp-footer-col vp-footer-col--contact">
                <h3 className="vp-footer-heading">{footer.contact}</h3>
                <div className="vp-footer-link-list">
                  <span className="vp-footer-contact-item">INFO@VIVIDPOLY.COM</span>
                  <span className="vp-footer-contact-item">+91 92136 26740</span>
                </div>
              </div>
            </div>

            <div className="vp-footer-bottom">
              © 2026 VIVIDPOLY · WWW.VIVIDPOLY.COM · PP Bags Exporter from India
            </div>
          </div>
        </footer>

        <VpEnquiryModal
          open={enquiryModalOpen}
          title={enquiryModal?.title || 'Enquiry Form'}
          closeLabel={enquiryModal?.close || 'Close enquiry form'}
          onClose={closeEnquiryModal}
          onSubmitSuccess={() => {
            markEnquirySubmitted();
            setEnquiryModalOpen(false);
          }}
          formProps={enquiryFormProps}
        />
        {typeof document !== 'undefined'
          && createPortal(
            <VpEnquiryFab
              label={fab?.label || 'Enquiry'}
              ariaLabel={fab?.ariaLabel || 'Go to contact enquiry form'}
              onClick={goToContactForm}
              hidden={mobileNavOpen || enquiryModalOpen || v.showContact || v.showCareers}
              active
            />,
            document.body,
          )}
      </div>
  );
}

function HeroStatIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21s7-5.4 7-11a7 7 0 10-14 0c0 5.6 7 11 7 11z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 19V9l8-5 8 5v10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 19v-6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l2.4 6.2L21 10l-5 4.2L17.5 21 12 17.5 6.5 21 8 14.2 3 10l6.6-.8L12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
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
