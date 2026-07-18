'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
import VpBackToTop from '@/components/vividpoly/VpBackToTop';
import VpEnquiryModal from '@/components/vividpoly/VpEnquiryModal';
import VpToast from '@/components/vividpoly/VpToast';
import VpContactEnquiryForm from '@/components/vividpoly/VpContactEnquiryForm';
import VpKnackReveal from '@/components/vividpoly/VpKnackReveal';
import VpKnackProductCard from '@/components/vividpoly/VpKnackProductCard';
import VpKnackProductCarousel from '@/components/vividpoly/VpKnackProductCarousel';
import VpKnackStatsBar from '@/components/vividpoly/VpKnackStatsBar';
import VpKnackProductUseSection from '@/components/vividpoly/VpKnackProductUseSection';
import VpKnackBuyerSection from '@/components/vividpoly/VpKnackBuyerSection';
import VpKnackAboutSection from '@/components/vividpoly/VpKnackAboutSection';
import VpAboutPage from '@/components/vividpoly/VpAboutPage';
import VpPhotoSlot from '@/components/vividpoly/VpPhotoSlot';
import VpRouteOutlet from '@/components/vividpoly/VpRouteOutlet';
import { WhatsAppIcon, ChevronRightIcon, ChevronLeftIcon, CloseIcon, CheckIcon } from '@/components/vividpoly/VividPolyIcons';
import { useEnquiryPopup } from '@/hooks/useEnquiryPopup';
import { markEnquiryDismissed, markEnquirySubmitted } from '@/lib/enquiry-popup-session';
import VpCatalogueFilters from '@/components/vividpoly/VpCatalogueFilters';
import VpSortSelect from '@/components/vividpoly/VpSortSelect';
import VpCatalogueGuideTooltip from '@/components/vividpoly/VpCatalogueGuideTooltip';
import {
  clearHomeFaqScroll,
  clearListScrollRestore,
  applyListScrollRestore,
  consumeArmedListScrollRestore,
  consumeSkipNextScrollToTop,
  peekHomeFaqScroll,
  scrollPageToTop,
  scrollToHomeFaqWhenReady,
} from '@/lib/vividpoly-navigation';
import {
  VP_PAGE_ENTER_DELAY_MS,
  VP_PAGE_ENTER_MS,
} from '@/lib/vp-page-transition';

export default function VividPolyView() {
  const v = useVividPoly() as Record<string, any>;
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [headerBlend, setHeaderBlend] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  // True only while a full blog article is open (not the blog list), so the
  // enquiry popup can be hidden there (the article has its own sticky form).
  const [blogArticleOpen, setBlogArticleOpen] = useState(false);
  const [enquiryToast, setEnquiryToast] = useState<string | null>(null);
  const [mobileNavExpanded, setMobileNavExpanded] = useState<null | 'products' | 'industry' | 'resources'>(null);
  const [mobileNavGroupKey, setMobileNavGroupKey] = useState<string | null>(null);
  const [catalogueIntroExpanded, setCatalogueIntroExpanded] = useState(false);
  const navHoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollYRef = useRef(0);
  const headerHiddenRef = useRef(false);
  const headerBlendRef = useRef(false);

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

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeaderOffset = () => {
      const height = Math.ceil(header.getBoundingClientRect().height);
      if (height > 0) {
        document.documentElement.style.setProperty('--vp-header-offset', `${height}px`);
      }
    };

    syncHeaderOffset();
    const observer = new ResizeObserver(syncHeaderOffset);
    observer.observe(header);
    window.addEventListener('resize', syncHeaderOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncHeaderOffset);
      document.documentElement.style.removeProperty('--vp-header-offset');
    };
  }, [headerBlend, mobileNavOpen, v.menu]);

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
    setMobileNavGroupKey(null);

    const faqBehavior = peekHomeFaqScroll();
    if (faqBehavior) {
      scrollToHomeFaqWhenReady(faqBehavior, 12, 80, 16);
      clearHomeFaqScroll();
      return;
    }

    if (consumeSkipNextScrollToTop()) {
      const restore = consumeArmedListScrollRestore(v.pageTransitionKey);
      if (restore == null) {
        clearListScrollRestore();
        scrollPageToTop('auto');
        return;
      }
      // Wait until page-enter transform finishes so the Y offset does not skew position.
      const restoreId = window.setTimeout(
        () => applyListScrollRestore(restore),
        VP_PAGE_ENTER_DELAY_MS + VP_PAGE_ENTER_MS + 32,
      );
      return () => window.clearTimeout(restoreId);
    }

    clearListScrollRestore();
    const scrollTop = () => scrollPageToTop('auto');
    scrollTop();
    const rafId = requestAnimationFrame(scrollTop);
    const afterTransitionId = window.setTimeout(
      scrollTop,
      VP_PAGE_ENTER_DELAY_MS + VP_PAGE_ENTER_MS + 24,
    );

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(afterTransitionId);
    };
  }, [v.pageTransitionKey]);

  useEffect(() => {
    setMobileNavOpen(false);
    setMobileNavExpanded(null);
    setMobileNavGroupKey(null);
  }, [v.menu]);

  const closeMobileNav = () => {
    setMobileNavOpen(false);
    setMobileNavExpanded(null);
    setMobileNavGroupKey(null);
  };

  const openEnquiryModal = useCallback(() => {
    v.resetEnquiryDefaults();
    setEnquiryModalOpen(true);
  }, [v.resetEnquiryDefaults]);

  const closeEnquiryModal = useCallback(() => {
    setEnquiryModalOpen(false);
    markEnquiryDismissed(v.pageTransitionKey);
  }, [v.pageTransitionKey]);

  const dismissEnquiryToast = useCallback(() => {
    setEnquiryToast(null);
  }, []);

  const handleEnquirySubmitSuccess = useCallback((message: string) => {
    markEnquirySubmitted(v.pageTransitionKey);
    setEnquiryModalOpen(false);
    setEnquiryToast(message);
  }, [v.pageTransitionKey]);

  const shouldAutoOpenEnquiryPopup = useCallback(() => {
    return !v.showContact && !v.showCareers && !v.showAbout;
  }, [v.showContact, v.showCareers, v.showAbout]);

  useEnquiryPopup({
    pageKey: v.pageTransitionKey,
    onAutoOpen: openEnquiryModal,
    getShouldAutoOpen: shouldAutoOpenEnquiryPopup,
  });

  const handleEnquiryFabClick = useCallback(() => {
    setMobileNavOpen(false);
    setMobileNavExpanded(null);
    setMobileNavGroupKey(null);
    window.requestAnimationFrame(() => openEnquiryModal());
  }, [openEnquiryModal]);

  useEffect(() => {
    let ticking = false;
    let touchLastY = 0;
    const scrollRoots: HTMLElement[] = [];

    const syncHeaderBlend = () => {
      const hero = document.querySelector('.vp-hero') as HTMLElement | null;
      if (!hero || !showHomeRef.current) {
        if (headerBlendRef.current) {
          headerBlendRef.current = false;
          setHeaderBlend(false);
        }
        return;
      }

      const heroBottom = hero.getBoundingClientRect().bottom;
      const nextBlend = headerBlendRef.current
        ? heroBottom > 96
        : heroBottom > 148;

      if (nextBlend !== headerBlendRef.current) {
        headerBlendRef.current = nextBlend;
        setHeaderBlend(nextBlend);
      }
    };

    const updateHeaderFromScroll = (y: number) => {
      const delta = y - lastScrollYRef.current;
      const isMobileChrome = typeof window !== 'undefined' && window.matchMedia('(max-width: 991px)').matches;

      if (isMobileChrome) {
        if (headerHiddenRef.current) {
          headerHiddenRef.current = false;
          setHeaderHidden(false);
        }
      } else if (y <= 8) {
        if (headerHiddenRef.current) {
          headerHiddenRef.current = false;
          setHeaderHidden(false);
        }
      } else if (delta > 10) {
        if (!headerHiddenRef.current) {
          headerHiddenRef.current = true;
          setHeaderHidden(true);
        }
      } else if (delta < -6) {
        if (headerHiddenRef.current) {
          headerHiddenRef.current = false;
          setHeaderHidden(false);
        }
      }

      syncHeaderBlend();
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
      const isMobileChrome = window.matchMedia('(max-width: 991px)').matches;

      if (isMobileChrome) {
        if (headerHiddenRef.current) {
          headerHiddenRef.current = false;
          setHeaderHidden(false);
        }
      } else if (y <= 8) {
        if (headerHiddenRef.current) {
          headerHiddenRef.current = false;
          setHeaderHidden(false);
        }
      } else if (event.deltaY > 6) {
        if (!headerHiddenRef.current) {
          headerHiddenRef.current = true;
          setHeaderHidden(true);
        }
      } else if (event.deltaY < -6) {
        if (headerHiddenRef.current) {
          headerHiddenRef.current = false;
          setHeaderHidden(false);
        }
      }

      syncHeaderBlend();
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
      const isMobileChrome = window.matchMedia('(max-width: 991px)').matches;

      if (isMobileChrome) {
        if (headerHiddenRef.current) {
          headerHiddenRef.current = false;
          setHeaderHidden(false);
        }
      } else if (y <= 8) {
        if (headerHiddenRef.current) {
          headerHiddenRef.current = false;
          setHeaderHidden(false);
        }
      } else if (dy < -10) {
        if (!headerHiddenRef.current) {
          headerHiddenRef.current = true;
          setHeaderHidden(true);
        }
      } else if (dy > 10) {
        if (headerHiddenRef.current) {
          headerHiddenRef.current = false;
          setHeaderHidden(false);
        }
      }

      syncHeaderBlend();
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
  }, [headerVisible]);

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
      if (v.catFiltersOpen) {
        v.toggleCatFilters();
        return;
      }
      if (v.menu) v.closeAll();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [v.menu, v.closeAll, v.catFiltersOpen, v.toggleCatFilters, mobileNavOpen, enquiryModalOpen, closeEnquiryModal]);

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
      enquiryType: v.contactEnquiryType,
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

  const hasTopHero = v.showHome || v.showCareers;

  const siteHeader = (
    <div ref={headerRef} className={`vp-site-chrome vp-site-chrome--fixed${headerVisible ? '' : ' vp-site-chrome--hidden'}${headerBlend ? ' vp-site-chrome--blend' : ''}${hasTopHero ? ' vp-site-chrome--over-hero' : ''}${v.menu ? ' vp-site-chrome--nav-menu-open' : ''}${mobileNavOpen ? ' vp-site-chrome--mobile-nav-open' : ''}`}>
      <VpTopUtilityBar topBar={topBar} />
      <header className={`vp-header${headerBlend ? ' vp-header--blend' : ''}`}>
      <div className="vp-chrome-container vp-header-shell">
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
              <span className="vp-header-nav-caret" aria-hidden="true" />
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
              <span className="vp-header-nav-caret" aria-hidden="true" />
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
              <span className="vp-header-nav-caret" aria-hidden="true" />
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
            className={`vp-header-menu-btn${mobileNavOpen ? ' vp-header-menu-btn--open' : ''}`}
            aria-expanded={mobileNavOpen}
            aria-controls="vp-mobile-nav-panel"
            aria-label={mobileNavOpen ? nav.closeMenu : nav.openMenu}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <span className="vp-header-menu-icon" aria-hidden="true">
              <span className="vp-header-menu-bar" />
              <span className="vp-header-menu-bar" />
              <span className="vp-header-menu-bar" />
            </span>
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
              <button type="button" onClick={v.megaTypeFooterAction} className="vp-nav-dropdown-footer-btn vp-with-chevron">{nav.viewAllByType}<ChevronRightIcon size={14} /></button>
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
              <button type="button" onClick={v.megaUseFooterAction} className="vp-nav-dropdown-footer-btn vp-with-chevron">{nav.viewAllByIndustry}<ChevronRightIcon size={14} /></button>
            </div>
          </div>
        </div>
      )}

      {v.menuResources && (
        <div
          id="vp-nav-resources-panel"
          className="vp-nav-dropdown"
          role="region"
          aria-label={nav.resourcesMenu}
          onMouseEnter={() => openNavMenuHover('resources')}
          onMouseLeave={scheduleCloseNavMenuHover}
        >
          <div className="vp-nav-dropdown-inner">
            <div className="vp-nav-dropdown-grid vp-nav-dropdown-grid--resources">
              {v.resourceLinks.map((link: NavMenuLink) => (
                <button
                  key={link.title}
                  type="button"
                  onClick={link.open}
                  className="vp-nav-resources-card"
                >
                  <span className="vp-nav-resources-card-title">{link.title}</span>
                  <span className="vp-nav-resources-card-desc">{link.desc}</span>
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
        {siteHeader}
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
              <button
                type="button"
                className="vp-mobile-drawer-close"
                onClick={closeMobileNav}
                aria-label={nav.closeMenu}
                tabIndex={mobileNavOpen ? 0 : -1}
              >
                <span aria-hidden="true">&#10005;</span>
              </button>
              <div className="vp-mobile-drawer-scroll">
                <button type="button" className="vp-mobile-drawer-link" onClick={() => { v.goAbout(); closeMobileNav(); }}>{nav.about}</button>

                <div className="vp-mobile-drawer-section">
                  <button
                    type="button"
                    className={`vp-mobile-drawer-link vp-mobile-drawer-link--expand${mobileNavExpanded === 'products' ? ' vp-mobile-drawer-link--expanded' : ''}`}
                    aria-expanded={mobileNavExpanded === 'products'}
                    onClick={() => {
                      setMobileNavGroupKey(null);
                      setMobileNavExpanded((section) => (section === 'products' ? null : 'products'));
                    }}
                  >
                    {nav.products}
                    <span className="vp-mobile-drawer-chevron" aria-hidden="true" />
                  </button>
                  {mobileNavExpanded === 'products' && (
                    <div className="vp-mobile-drawer-panel">
                      {v.megaTypeGroups.map((g, i_g) => {
                        const groupKey = `products-${i_g}`;
                        const groupOpen = mobileNavGroupKey === groupKey;
                        return (
                          <div key={groupKey} className={`vp-mobile-drawer-group${groupOpen ? ' vp-mobile-drawer-group--open' : ''}`}>
                            <button
                              type="button"
                              className={`vp-mobile-drawer-group-toggle${groupOpen ? ' vp-mobile-drawer-group-toggle--open' : ''}`}
                              aria-expanded={groupOpen}
                              onClick={() => setMobileNavGroupKey((key) => (key === groupKey ? null : groupKey))}
                            >
                              <span>{g.title}</span>
                              <span className="vp-mobile-drawer-chevron" aria-hidden="true" />
                            </button>
                            {groupOpen ? (
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
                            ) : null}
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        className="vp-mobile-drawer-footer-link vp-with-chevron"
                        onClick={() => { v.megaTypeFooterAction(); closeMobileNav(); }}
                      >
                        {nav.viewAllByType}
                        <ChevronRightIcon size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="vp-mobile-drawer-section">
                  <button
                    type="button"
                    className={`vp-mobile-drawer-link vp-mobile-drawer-link--expand${mobileNavExpanded === 'industry' ? ' vp-mobile-drawer-link--expanded' : ''}`}
                    aria-expanded={mobileNavExpanded === 'industry'}
                    onClick={() => {
                      setMobileNavGroupKey(null);
                      setMobileNavExpanded((section) => (section === 'industry' ? null : 'industry'));
                    }}
                  >
                    {nav.industryServed}
                    <span className="vp-mobile-drawer-chevron" aria-hidden="true" />
                  </button>
                  {mobileNavExpanded === 'industry' && (
                    <div className="vp-mobile-drawer-panel">
                      {v.megaUseGroups.map((g, i_g) => {
                        const groupKey = `industry-${i_g}`;
                        const groupOpen = mobileNavGroupKey === groupKey;
                        return (
                          <div key={groupKey} className={`vp-mobile-drawer-group${groupOpen ? ' vp-mobile-drawer-group--open' : ''}`}>
                            <button
                              type="button"
                              className={`vp-mobile-drawer-group-toggle${groupOpen ? ' vp-mobile-drawer-group-toggle--open' : ''}`}
                              aria-expanded={groupOpen}
                              onClick={() => setMobileNavGroupKey((key) => (key === groupKey ? null : groupKey))}
                            >
                              <span>{g.title}</span>
                              <span className="vp-mobile-drawer-chevron" aria-hidden="true" />
                            </button>
                            {groupOpen ? (
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
                            ) : null}
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        className="vp-mobile-drawer-footer-link vp-with-chevron"
                        onClick={() => { v.megaUseFooterAction(); closeMobileNav(); }}
                      >
                        {nav.viewAllByIndustry}
                        <ChevronRightIcon size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="vp-mobile-drawer-section">
                  <button
                    type="button"
                    className={`vp-mobile-drawer-link vp-mobile-drawer-link--expand${mobileNavExpanded === 'resources' ? ' vp-mobile-drawer-link--expanded' : ''}`}
                    aria-expanded={mobileNavExpanded === 'resources'}
                    onClick={() => {
                      setMobileNavGroupKey(null);
                      setMobileNavExpanded((section) => (section === 'resources' ? null : 'resources'));
                    }}
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
          </div>
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
          <VpRouteOutlet screenKey={v.pageTransitionKey} suppressInitialEnter>
          
          {v.showHome && (<>
          <div data-screen-label="Home" className="vp-home">
      
            
            <section className="vp-hero vp-hero--fold" aria-label="Home hero">
              {/* Layer 1: full-bleed hero photo (placement first). */}
              <div className="vp-hero-panel vp-hero-panel--visual" aria-hidden="true">
                <div className="vp-hero-visual-ph">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="vp-hero-visual-img"
                    src="/images/home-hero.jpg?v=bags-22"
                    alt=""
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              </div>
              {/* Layer 2: red diagonal shape on top of the photo. */}
              <div className="vp-hero-panel vp-hero-panel--red" aria-hidden="true" />
              <div className="vp-hero-inner">
                <div className="vp-hero-copy">
                  <div className="vp-hero-brand vp-hero-rise">
                    <VpLogo variant="inverse" className="vp-wordmark--hero" />
                  </div>
                  <h1 className="vp-hero-title vp-hero-rise">
                    <span className="vp-hero-title-line">
                      {v.siteCopy.heroHeadlineLine1 || 'PP Bags for Global Buyers'}
                    </span>
                    {v.siteCopy.heroHeadlineLine2 ? (
                      <span className="vp-hero-title-line">
                        {v.siteCopy.heroHeadlineLine2}
                      </span>
                    ) : null}
                  </h1>
                  <p className="vp-hero-lead vp-hero-rise">{v.siteCopy.heroLead}</p>
                  <div className="vp-hero-trust vp-hero-trust--certs-only vp-hero-rise" aria-label="Credentials">
                    <ul className="vp-hero-trust-col vp-hero-trust-col--certs">
                      <li>
                        <span className="vp-hero-cert-dot" aria-hidden="true" />
                        <span className="vp-hero-trust-label">{v.siteCopy.heroIsoLabel || 'ISO certified'}</span>
                      </li>
                      <li>
                        <span className="vp-hero-cert-dot" aria-hidden="true" />
                        <span className="vp-hero-trust-label">{v.siteCopy.heroIecLabel || 'IEC certified'}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="vp-hero-rise vp-hero-ctas">
                    <a
                      href={v.siteCopy.heroWhatsAppHref || topBar.whatsappHref}
                      className="vp-cta-primary vp-cta-primary--lg vp-cta-whatsapp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{v.siteCopy.heroCtaWhatsApp || 'WhatsApp'}</span>
                    </a>
                    <button
                      onClick={v.goCatalogueType}
                      className="vp-cta-secondary vp-cta-secondary--lg"
                      type="button"
                    >
                      {v.siteCopy.heroCtaSecondary || 'View Product Types'}
                    </button>
                  </div>
                </div>
              </div>
            </section>

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

            <section className="vp-prod-section vp-prod-section--knack" aria-labelledby="vp-home-products-title">
              <div className="vp-prod-section-inner">
                <VpKnackReveal className="vp-prod-section-head">
                  <p className="vp-prod-section-eyebrow">{v.siteCopy.homeProductsEyebrow}</p>
                  <h2 id="vp-home-products-title" className="vp-prod-section-title">
                    {v.siteCopy.homeProductsTitle}
                  </h2>
                  <p className="vp-prod-section-lead">{v.siteCopy.homeProductsLead}</p>
                </VpKnackReveal>
                <div className="vp-prod-section-body">
                  <VpKnackReveal>
                    <VpKnackProductCarousel
                      products={v.products}
                      previousLabel={home.previousProducts}
                      nextLabel={home.nextProducts}
                    />
                  </VpKnackReveal>
                  <div className="vp-prod-section-footer">
                    <button
                      type="button"
                      className="vp-prod-section-view-all"
                      onClick={v.goCatalogueType}
                    >
                      View All
                      <ChevronRightIcon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <VpKnackStatsBar stats={v.siteCopy.homeStats || []} />

            <section className="vp-home-intro" aria-labelledby="vp-home-intro-title">
              <div className="vp-home-intro-inner">
                <div className="vp-home-intro-top">
                  <div className="vp-home-intro-head">
                    <p className="vp-home-intro-eyebrow">{v.siteCopy.introEyebrow || 'What we export'}</p>
                    <h2 id="vp-home-intro-title" className="vp-home-intro-title">
                      {v.siteCopy.introTitle || 'PP bags for global buyers'}
                    </h2>
                  </div>
                  <div className="vp-home-intro-story">
                    <p className="vp-home-intro-lead">{v.siteCopy.intro1}</p>
                    <p className="vp-home-intro-support">{v.siteCopy.intro2}</p>
                  </div>
                </div>
                {Array.isArray(v.siteCopy.introHighlights) && v.siteCopy.introHighlights.length > 0 ? (
                  <ul className="vp-home-intro-highlights">
                    {v.siteCopy.introHighlights.map((item: { label: string; value: string }) => (
                      <li key={item.label} className="vp-home-intro-highlight">
                        <span className="vp-home-intro-highlight-label">{item.label}</span>
                        <span className="vp-home-intro-highlight-value">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>

            <VpKnackAboutSection
              eyebrow={v.siteCopy.homeAboutEyebrow}
              title={v.siteCopy.homeAboutTitle}
              subtitle={v.siteCopy.homeAboutSubtitle}
              paragraphs={v.siteCopy.homeAboutParagraphs || []}
              imageSrc={v.siteCopy.homeAboutImage || '/images/shop-product-type.jpg'}
              primaryCtaLabel={v.siteCopy.homeAboutCtaType || home.shopByProductType}
              secondaryCtaLabel={v.siteCopy.homeAboutCtaIndustry || home.shopByIndustry}
              onPrimaryCta={v.goCatalogueType}
              onSecondaryCta={v.goCatalogueUse}
            />

            <VpKnackBuyerSection
              title={v.siteCopy.buyerSectionTitle}
              paragraphs={v.siteCopy.buyerSectionParagraphs || []}
            />
      
            
            <VpKnackProductUseSection
              title={v.siteCopy.productUseCol}
              lead={v.siteCopy.productUsesIntro}
              cards={v.productUseCards}
              onCardClick={v.goCatalogueUse}
              viewAllLabel={common.viewAll || 'View all'}
              onViewAll={v.goCatalogueUse}
              previousLabel={home.previousProducts}
              nextLabel={home.nextProducts}
            />
      
            
            <section id="vp-home-faq" className="vp-faq-section">
              <div className="vp-faq-section-inner">
                <div className="vp-faq-section-head">
                  <p className="vp-faq-section-eyebrow">FAQs</p>
                  <h2 className="vp-h2 vp-faq-section-title">{v.siteCopy.faqSectionTitle}</h2>
                </div>
                <VpFaqAccordion items={v.faqs} />
              </div>
            </section>
      
            
            <section className="vp-final-cta-band">
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
              <VpCatalogueFilters
                open={v.catFiltersOpen}
                onClose={v.toggleCatFilters}
                onClear={v.clearFilters}
                activeFilterCount={v.activeFilterCount}
                filteredCount={v.filteredCount}
                filterSecs={v.filterSecs}
                capacityFilter={v.capacityFilter}
                catGuide={v.catGuide}
                catByUse={v.catByUse}
                guideMessage={v.siteCopy.catalogueGuideProductType}
                onDismissGuide={v.clearCatGuide}
              />

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
                            <CloseIcon size={14} />
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
                <div className="vp-catalogue-grid vp-catalogue-grid--knack">
                  {v.catalogueProducts.length === 0 && (
                    <div className="vp-filter-empty">
                      No products match your filters.
                      <br />
                      <button type="button" onClick={v.clearFilters} className="vp-filter-clear vp-filter-clear--stacked">Clear all filters</button>
                    </div>
                  )}
                  {v.catalogueProducts.map((p) => (
                    <VpKnackProductCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      short={p.short}
                      onClick={p.open}
                      recommended={p.recommended}
                    />
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
                <div className="vp-pdp-gallery-main-frame">
                  <VpPhotoSlot
                    key={v.pdpGalleryMainSrc}
                    src={v.pdpGalleryMainSrc}
                    alt={v.product?.name || 'Product'}
                    variant="thumb"
                    className="vp-pdp-gallery-main"
                  />
                </div>
                <div className="vp-pdp-gallery-thumbs">
                  {v.galleryThumbs.map((t, i_t) => (
                    <button key={i_t} type="button" onClick={t.sel} className={`vp-gallery-thumb${t.active ? ' vp-gallery-thumb--active' : ''}`} aria-label={`Product image ${i_t + 1}`}>
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
                    <span key={i_b} className="vp-pdp-trust-badge"><span className="vp-pdp-trust-badge-icon"><CheckIcon size={12} /></span>{b.t}</span>
                  ))}
                </div>
                <div className="vp-pdp-cta-row">
                  <button onClick={v.pdpGetQuote} className="vp-cta-primary vp-cta-primary--lg vp-pdp-cta-quote" type="button" aria-label={v.pdpQuoteLabel}>{common.getQuote}</button>
                  <a
                    href={v.siteCopy.heroWhatsAppHref || topBar.whatsappHref}
                    className="vp-cta-primary vp-cta-primary--lg vp-cta-whatsapp vp-pdp-cta-whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon size={20} />
                    <span>{v.siteCopy.heroCtaWhatsApp || 'WhatsApp'}</span>
                  </a>
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
                      <span className="vp-related-product-cta">{common.viewDetails}<ChevronRightIcon size={14} /></span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          </>)}
      
          
          {v.showFaqs && (<>
          <div data-screen-label="FAQs" className="vp-page-shell">
            <VpSubpageTop breadcrumbs={v.breadcrumbsFor(breadcrumbs.faqs)} onHomeClick={v.goHome} className="vp-subpage-top--page">
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
              enquiryForm={enquiryFormProps}
              onArticleOpenChange={setBlogArticleOpen}
            />
          )}
      
          
          {v.showCareers && (
            <VpCareersPage
              copy={v.careersCopy}
              breadcrumbs={v.careersBreadcrumbs}
              onHomeClick={v.goHome}
            />
          )}

          {v.showAbout && (
            <VpAboutPage
              about={about}
              breadcrumbs={v.breadcrumbsFor(breadcrumbs.about)}
              companyRows={v.companyRows}
              whyRows={v.whyRows}
              onHomeClick={v.goHome}
              onContact={v.goContact}
              onCatalogueType={v.goCatalogueType}
            />
          )}
      
          
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
                      1
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
      
          </VpRouteOutlet>
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
                <div className="vp-footer-links-desktop">
                  <h3 className="vp-footer-heading">{footer.company}</h3>
                  <div className="vp-footer-link-list">
                    {v.footCompany.map((l, i_l) => (
                      <button key={i_l} type="button" onClick={l.open} className="vp-footer-link">{l.label}</button>
                    ))}
                  </div>
                </div>
                <details className="vp-footer-disclosure vp-footer-links-mobile">
                  <summary className="vp-footer-heading">{footer.company}</summary>
                  <div className="vp-footer-link-list">
                    {v.footCompany.map((l, i_l) => (
                      <button key={`m-co-${i_l}`} type="button" onClick={l.open} className="vp-footer-link">{l.label}</button>
                    ))}
                  </div>
                </details>
              </div>

              <div className="vp-footer-col vp-footer-col--links">
                <div className="vp-footer-links-desktop">
                  <h3 className="vp-footer-heading">{footer.buyerHelp}</h3>
                  <div className="vp-footer-link-list">
                    {v.footHelp.map((l, i_l) => (
                      <button key={i_l} type="button" onClick={l.open} className="vp-footer-link">{l.label}</button>
                    ))}
                  </div>
                </div>
                <details className="vp-footer-disclosure vp-footer-links-mobile">
                  <summary className="vp-footer-heading">{footer.buyerHelp}</summary>
                  <div className="vp-footer-link-list">
                    {v.footHelp.map((l, i_l) => (
                      <button key={`m-help-${i_l}`} type="button" onClick={l.open} className="vp-footer-link">{l.label}</button>
                    ))}
                  </div>
                </details>
              </div>

              <div className="vp-footer-col vp-footer-col--contact">
                <h3 className="vp-footer-heading">{footer.contact}</h3>
                <div className="vp-footer-link-list vp-footer-contact-list">
                  <a href="mailto:info@vividpoly.com" className="vp-footer-link vp-footer-contact-item">
                    info@vividpoly.com
                  </a>
                  <a href="tel:+919213626740" className="vp-footer-link vp-footer-contact-item">
                    +91 92136 26740
                  </a>
                </div>
              </div>
            </div>

            <VpBackToTop label={footer.backToTop} ariaLabel={footer.backToTopAria} />

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
          onSubmitSuccess={handleEnquirySubmitSuccess}
          formProps={enquiryFormProps}
        />
        <VpToast
          open={Boolean(enquiryToast)}
          message={enquiryToast || ''}
          onClose={dismissEnquiryToast}
          tone="success"
        />
        <VpEnquiryFab
          label={fab?.label || 'Enquiry'}
          mobileLabel={fab?.mobileLabel || 'Inquire'}
          ariaLabel={fab?.ariaLabel || 'Open enquiry form'}
          onClick={handleEnquiryFabClick}
          hidden={
            mobileNavOpen
            || enquiryModalOpen
            || v.showContact
            || v.showCareers
            || v.showAbout
            || blogArticleOpen
          }
          active
        />
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
  open: () => void;
};
