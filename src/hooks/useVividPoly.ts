/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import uiCopy from '@/data/ui-copy.json';
import { getVividPolyData, type VividPolyMessages } from '@/lib/get-vividpoly-data';
import { enquiryQuoteSelectionForProductId, resolveContactEnquiryType } from '@/lib/enquiry-product';
import { readVpTokens, VP as VP_FALLBACK } from '@/lib/vividpoly-tokens';
import { filterProducts, sortProducts, productRecommendedForSort, buildCatSortOptions, catSortFromUseTitle, filtersForUseSort, filterProductsByUseSort, CAPACITY_STOPS, filterProductsByCapacity, isCapacityFilterActive, getCapacityCustomNotice, type CatSort } from '@/lib/vividpoly-product-filters';
import { getInitialQuoteStep } from '@/lib/vividpoly-quote';
import { productGallerySrcs, productImageSrc } from '@/lib/product-images';
import { captureQuoteLead } from '@/lib/vividpoly-lead-capture';
import { submitQuoteLead } from '@/lib/vividpoly-quote-lead';
import {
  isNavTransition,
  navPayload,
  navUrl,
  parseHash,
  readNavState,
  scrollPageToTop,
  enableManualScrollRestoration,
  armHomeFaqScroll,
  scrollToHomeFaqWhenReady,
  splitBreadcrumbTrail,
  withHomeBreadcrumb,
  armListScrollRestore,
  clearListScrollRestore,
  hasArmedListScrollRestore,
  scrollRestoreKeyForState,
  requestSkipNextScrollToTop,
} from '@/lib/vividpoly-navigation';
import { getPageTransitionKey } from '@/lib/vp-page-transition';

export type Screen =
  | 'home' | 'catalogue' | 'pdp' | 'faqs'
  | 'blog' | 'about' | 'careers' | 'contact' | 'quote' | 'sample';

export interface VividPolyState {
  screen: Screen;
  menu: 'products' | 'resources' | 'industry' | null;
  prodTab: 'type' | 'use';
  pid: string;
  gallery: number;
  openFaq: number | null;
  searchOpen: boolean;
  searchVal: string;
  quoteStep: number;
  quoteLeadOnly: boolean;
  quoteBagSpecPrompt: boolean;
  quoteContactOpen: boolean;
  quote: Record<string, any>;
  cat: 'type' | 'use';
  catGuide: 'product-type' | 'use-sort' | null;
  catFiltersOpen: boolean;
  filters: Record<string, Record<string, boolean>>;
  catSort: CatSort;
  capacityMinIdx: number;
  capacityMaxIdx: number;
  capacityCustomKg: string;
  sampleStep: number;
  samplePid: string;
  sampleFrom: 'home' | 'catalogue' | 'pdp';
  sampleCapacity: string;
  sampleRef: string;
  samplePaymentAccountId: string;
  bankPickerOpen: boolean;
  bankPickerMode: 'bank' | 'branch' | null;
  bankPickerQuery: string;
  pdpFrom: 'home' | 'catalogue';
}

const initialState: VividPolyState = {
  screen: 'home', menu: null, prodTab: 'type',
  pid: 'open-mouth', gallery: 0, openFaq: null,
  searchOpen: false, searchVal: '',
  quoteStep: 0, quoteLeadOnly: false, quoteBagSpecPrompt: false, quoteContactOpen: false,
  quote: { product: 'General Query' }, cat: 'type', catGuide: null, catFiltersOpen: false, filters: {},
  catSort: 'recommended', capacityMinIdx: 0, capacityMaxIdx: CAPACITY_STOPS.length - 1, capacityCustomKg: '',
  sampleStep: 0, samplePid: 'open-mouth', sampleFrom: 'catalogue', sampleCapacity: '', sampleRef: '',
  samplePaymentAccountId: 'hdfc-bopal', bankPickerOpen: false, bankPickerMode: null, bankPickerQuery: '',
  pdpFrom: 'catalogue',
};


export function useVividPoly() {
  const ui = uiCopy as VividPolyMessages;
  const generalEnquiryType = ui.enquiryProductTypes[0]?.label ?? 'General Query';
  const vividPolyData = useMemo(() => getVividPolyData(ui), []);
  const [s, setState] = useState<VividPolyState>(initialState);
  const [vpTokens, setVpTokens] = useState(VP_FALLBACK);

  useEffect(() => {
    const sync = () => setVpTokens(readVpTokens());
    sync();
    window.addEventListener('vp:theme-change', sync);
    return () => window.removeEventListener('vp:theme-change', sync);
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prodAutoScrollStoppedRef = useRef(false);
  const rafRef = useRef<number>(0);
  const skipHistoryPushRef = useRef(false);
  const pendingHistoryRef = useRef<VividPolyState | null>(null);
  const stateRef = useRef(s);
  stateRef.current = s;

  const pushNavHistory = useCallback((next: VividPolyState) => {
    if (typeof window === 'undefined' || skipHistoryPushRef.current) {
      skipHistoryPushRef.current = false;
      return;
    }
    window.history.pushState(navPayload(next), '', navUrl(next));
  }, []);

  const navigate = useCallback((updater: (st: VividPolyState) => VividPolyState) => {
    setState((prev) => {
      const next = updater(prev);
      if (isNavTransition(prev, next)) {
        pendingHistoryRef.current = next;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const next = pendingHistoryRef.current;
    if (!next) return;
    pendingHistoryRef.current = null;
    pushNavHistory(next);
  }, [s, pushNavHistory]);

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    enableManualScrollRestoration();

    // Restore the screen from the URL hash so a refresh keeps the current page
    // instead of resetting to home.
    const hashRaw = window.location.hash.replace(/^#/, '').trim();
    const parsed = parseHash(window.location.hash);
    const restored: VividPolyState = parsed ? { ...initialState, ...parsed } : initialState;
    if (parsed) setState(restored);
    window.history.replaceState(navPayload(restored), '', navUrl(restored));

    if (hashRaw === 'faqs') {
      requestAnimationFrame(() => scrollToHomeFaqWhenReady('auto', 12, 60, 50));
    } else {
      scrollPageToTop('auto');
      requestAnimationFrame(() => scrollPageToTop('auto'));
    }

    const onPopState = (event: PopStateEvent) => {
      const restored = readNavState(event.state);
      if (!restored) return;
      skipHistoryPushRef.current = true;
      setState(restored);
      const restoreKey = scrollRestoreKeyForState(restored);
      if (restoreKey && hasArmedListScrollRestore(restoreKey)) {
        // View route effect restores once after the page enter animation.
        requestSkipNextScrollToTop();
        return;
      }
      clearListScrollRestore();
      scrollPageToTop('auto');
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const go = useCallback((screen: Screen) => {
    navigate((st) => ({ ...st, screen, menu: null, searchOpen: false, catGuide: null }));
  }, [navigate]);

  const goHome = useCallback(() => {
    clearListScrollRestore();
    if (s.screen === 'home') {
      scrollPageToTop('smooth');
      setState((st) => ({ ...st, menu: null, searchOpen: false, catGuide: null }));
      return;
    }
    go('home');
  }, [s.screen, go]);

  const goHomeFaqs = useCallback(() => {
    if (s.screen === 'home') {
      setState((st) => ({ ...st, menu: null, searchOpen: false, catGuide: null }));
      scrollToHomeFaqWhenReady('smooth', 12);
      return;
    }

    armHomeFaqScroll('auto');
    navigate((st) => ({
      ...st,
      screen: 'home',
      menu: null,
      searchOpen: false,
      catGuide: null,
    }));
  }, [s.screen, navigate]);

  const clearCatGuide = useCallback(() => {
    setState((st) => (st.catGuide ? { ...st, catGuide: null } : st));
  }, []);

  const toggleMenu = useCallback((m: 'products' | 'resources' | 'industry') => {
    setState((st) => ({ ...st, menu: st.menu === m ? null : m, searchOpen: false }));
  }, []);

  useEffect(() => {
    if (s.screen !== 'faqs') return;
    armHomeFaqScroll('auto');
    setState((st) => ({ ...st, screen: 'home', menu: null, searchOpen: false, catGuide: null }));
  }, [s.screen]);

  useEffect(() => {
    const tick = () => {
      const el = scrollRef.current;
      const isNarrow = typeof window !== 'undefined' && window.innerWidth < 1367;
      if (el && !prodAutoScrollStoppedRef.current && !isNarrow && s.screen === 'home') {
        const half = el.scrollWidth / 2;
        if (half > 0) {
          el.scrollLeft += 0.5;
          if (el.scrollLeft >= half - 1) {
            el.scrollLeft -= half;
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [s.screen]);

  useEffect(() => {
    if (s.screen !== 'home') return;
    const el = scrollRef.current;
    if (!el) return;
    const stop = () => {
      prodAutoScrollStoppedRef.current = true;
    };
    el.addEventListener('touchstart', stop, { passive: true });
    el.addEventListener('pointerdown', stop, { passive: true });
    return () => {
      el.removeEventListener('touchstart', stop);
      el.removeEventListener('pointerdown', stop);
    };
  }, [s.screen]);

  const prodScrollBy = useCallback((dx: number) => {
    prodAutoScrollStoppedRef.current = true;
    scrollRef.current?.scrollBy({ left: dx, behavior: 'smooth' });
  }, []);

  const openContactWithProduct = useCallback((productId: string) => {
    const selection = enquiryQuoteSelectionForProductId(
      productId,
      ui.enquiryProductTypes,
      generalEnquiryType,
    );
    navigate((st) => ({
      ...st,
      screen: 'contact',
      menu: null,
      searchOpen: false,
      quoteContactOpen: false,
      quote: {
        ...st.quote,
        ...selection,
      },
    }));
  }, [navigate, ui.enquiryProductTypes, generalEnquiryType]);

  const openContactEnquiry = useCallback(() => {
    navigate((st) => ({
      ...st,
      screen: 'contact',
      menu: null,
      searchOpen: false,
      quoteContactOpen: false,
      quote: {
        ...st.quote,
        product: generalEnquiryType,
        productId: 'general',
      },
    }));
  }, [navigate, generalEnquiryType]);

  const resetEnquiryDefaults = useCallback(() => {
    setState((st) => ({
      ...st,
      quote: {
        ...st.quote,
        product: generalEnquiryType,
        productId: 'general',
      },
    }));
  }, [generalEnquiryType]);

  const openCatalogueForUse = useCallback((useTitle: string) => {
    navigate((st) => {
      const catSort = catSortFromUseTitle(useTitle);
      const filters = catSort === 'recommended' ? {} : filtersForUseSort(catSort);
      return {
        ...st,
        screen: 'catalogue',
        cat: 'use',
        prodTab: 'use',
        menu: null,
        searchOpen: false,
        catSort,
        filters,
        catFiltersOpen: false,
      };
    });
  }, [navigate]);

  const openPdp = useCallback((id: string, from: 'home' | 'catalogue') => {
    const current = stateRef.current;
    // Only arm when leaving the list itself (not when swapping PDP related products).
    if (from === 'catalogue' && current.screen === 'catalogue') {
      armListScrollRestore(`catalogue:${current.cat}`, id);
    } else if (from === 'home' && current.screen === 'home') {
      armListScrollRestore('home', id);
    }
    navigate((st) => ({ ...st, screen: 'pdp', pid: id, pdpFrom: from, gallery: 0, menu: null }));
  }, [navigate]);

  const openSampleOrder = useCallback((opts?: { capacity?: string; from?: VividPolyState['sampleFrom'] }) => {
    navigate((st) => {
      const from = opts?.from
        ?? (st.screen === 'pdp' ? 'pdp' : st.screen === 'home' ? 'home' : 'catalogue');
      return {
        ...st,
        screen: 'sample',
        sampleStep: 0,
        samplePid: st.pid,
        sampleFrom: from,
        sampleCapacity: opts?.capacity ?? (typeof st.quote.capacity === 'string' ? st.quote.capacity : '') ?? '',
        sampleRef: '',
        menu: null,
      };
    });
  }, [navigate]);

  const v = useMemo(() => {
    const VP = vpTokens;
    const data = vividPolyData;
    const prod = (id: string) => data.products.find((p) => p.id === id);
    const accent = VP.accent;
    const mkProd = (p: (typeof data.products)[0], from: 'home' | 'catalogue' = 'catalogue') => ({
      ...p,
      open: () => openPdp(p.id, from),
    });
    const products = data.products.map((p) => mkProd(p, 'home'));

    const q = (s.searchVal || '').toLowerCase();
    let searchResults: any[];
    let searchHeading: string;
    const allItems = [
      ...data.products.map((p) => ({
        label: p.name, icon: '▦', kind: 'product',
        go: () => {
          const current = stateRef.current;
          const from = current.screen === 'home' ? 'home' : 'catalogue';
          if (from === 'catalogue' && current.screen === 'catalogue') {
            armListScrollRestore(`catalogue:${current.cat}`, p.id);
          } else if (from === 'home' && current.screen === 'home') {
            armListScrollRestore('home', p.id);
          }
          navigate((st) => ({
            ...st,
            screen: 'pdp',
            pid: p.id,
            pdpFrom: from,
            gallery: 0,
            menu: null,
            searchOpen: false,
            searchVal: '',
          }));
        },
      })),
      ...data.useGroups.flatMap((g) => g.items).map((u) => ({
        label: u, icon: '◈', kind: 'industry',
        go: () => openCatalogueForUse(u),
      })),
      ...data.blogList.map((b) => ({
        label: b[0], icon: '❡', kind: 'article',
        go: () => navigate((st) => ({ ...st, screen: 'blog', searchOpen: false, searchVal: '' })),
      })),
    ];
    if (!q) {
      searchHeading = ui.search.recentHeading;
      searchResults = ui.search.recentTerms.map((t) => ({
        label: t, icon: '↺', kind: 'recent', open: () => setState((st) => ({ ...st, searchVal: t })),
      }));
    } else {
      searchHeading = ui.search.suggestionsHeading;
      searchResults = allItems.filter((i) => i.label.toLowerCase().includes(q)).slice(0, 7).map((i) => ({ ...i, open: i.go }));
      if (!searchResults.length) {
        searchResults = [{ label: ui.search.noMatches, icon: '⌕', kind: '', open: () => {} }];
      }
    }

    const megaIsType = s.prodTab === 'type';
    const megaTypeGroups = data.typeGroups.map((g) => ({
      title: g.title,
      items: g.ids.map((id) => {
        const p = prod(id)!;
        return { label: p.name, open: mkProd(p).open };
      }),
    }));
    const megaUseGroups = data.useGroups.map((g) => ({
      title: g.title,
      items: g.items.map((u) => ({
        label: u,
        open: () => openCatalogueForUse(u),
      })),
    }));
    const megaGroups = megaIsType ? megaTypeGroups : megaUseGroups;

    const footLink = (label: string, fn: () => void, options?: { skipScroll?: boolean }) => ({
      label,
      open: () => {
        fn();
        if (options?.skipScroll) return;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => scrollPageToTop('smooth'));
        });
      },
    });

    const catUse = s.cat === 'use';
    const filterSecs = ui.filterSections
      .filter((section) => section.key !== 'Capacity')
      .map((section, i_sec) => ({
      key: section.key,
      title: section.title,
      defaultOpen: i_sec < 2,
      opts: section.options.map((o) => ({
        label: o.label,
        checked: !!(s.filters[section.key] || {})[o.id],
        toggle: () =>
          setState((st) => {
            const sec = { ...(st.filters[section.key] || {}) };
            sec[o.id] = !sec[o.id];
            return {
              ...st,
              filters: { ...st.filters, [section.key]: sec },
              catGuide: st.catGuide === 'product-type' ? null : st.catGuide,
            };
          }),
      })),
    }));
    const capacityFilterActive = isCapacityFilterActive(
      s.capacityMinIdx,
      s.capacityMaxIdx,
      s.capacityCustomKg,
    );
    const capacityCustomNotice = getCapacityCustomNotice(s.capacityCustomKg, ui.filters.capacityCustomNotice);
    const activeFilterCount = Object.values(s.filters).reduce(
      (n, sec) => n + Object.values(sec || {}).filter(Boolean).length,
      0,
    ) + (capacityFilterActive ? 1 : 0);
    const filtersActive = activeFilterCount > 0;
    const capacityMinKg = CAPACITY_STOPS[s.capacityMinIdx];
    const capacityMaxKg = CAPACITY_STOPS[s.capacityMaxIdx];
    let catalogueList = filterProducts(data.products, s.filters);
    catalogueList = filterProductsByCapacity(
      catalogueList,
      s.capacityMinIdx,
      s.capacityMaxIdx,
      s.capacityCustomKg,
    );
    catalogueList = filterProductsByUseSort(catalogueList, s.catSort);
    catalogueList = sortProducts(catalogueList, s.catSort);
    const filteredCount = catalogueList.length;
    const catalogueProducts = catalogueList.map((p) => ({
      ...mkProd(p, 'catalogue'),
      recommended: s.catSort !== 'recommended' && productRecommendedForSort(p, s.catSort),
      quote: () => openContactWithProduct(p.id),
    }));

    const sp = prod(s.pid) || data.products[0];
    const sampleProduct = prod(s.samplePid) || sp;
    const sampleSpec = sampleProduct.spec.find((r) => r[0] === 'Capacity');
    const sampleCapacityLabel = s.sampleCapacity || sampleSpec?.[1]?.split(' to ')?.[0] || '25 kg';
    const sampleSubtotal = data.sampleOrderDefaults.unitPriceUsd * data.sampleOrderDefaults.qty;
    const sampleTotal = sampleSubtotal + data.sampleOrderDefaults.shippingUsd;
    const br = ui.sample.billRows;
    const sampleBillRows = [
      { k: br.productType, v: sampleProduct.name },
      { k: br.sampleQuantity, v: data.sampleOrderDefaults.qtyLabel },
      { k: br.capacity, v: sampleCapacityLabel },
      { k: br.printing, v: data.sampleOrderDefaults.printing },
      { k: br.packing, v: data.sampleOrderDefaults.packing },
      { k: br.leadTime, v: data.sampleOrderDefaults.leadTime },
      { k: br.unitPrice, v: `$${data.sampleOrderDefaults.unitPriceUsd} ${data.sampleOrderDefaults.currency}` },
      { k: br.exportPacking, v: `$${data.sampleOrderDefaults.shippingUsd} ${data.sampleOrderDefaults.currency}` },
      { k: br.total, v: `$${sampleTotal} ${data.sampleOrderDefaults.currency}`, bold: true },
    ];
    const sampleBankAccount = data.paymentBankAccounts.find((a) => a.id === s.samplePaymentAccountId)
      || data.paymentBankAccounts[0];
    const bkr = ui.sample.bankRows;
    const sampleBankRows = [
      { k: bkr.beneficiary, v: sampleBankAccount.beneficiary },
      { k: bkr.bank, v: sampleBankAccount.bankName, picker: 'bank' as const },
      { k: bkr.branch, v: `${sampleBankAccount.branch}, ${sampleBankAccount.location}`, picker: 'branch' as const },
      { k: bkr.accountNumber, v: sampleBankAccount.accountNumber },
      { k: bkr.ifsc, v: sampleBankAccount.ifsc },
      { k: bkr.swift, v: sampleBankAccount.swift },
      { k: bkr.accountType, v: sampleBankAccount.accountType },
      { k: bkr.amount, v: `$${sampleTotal} ${data.sampleOrderDefaults.currency}`, bold: true },
      { k: bkr.paymentReference, v: s.sampleRef || '-', bold: true },
    ];
    const uniqueBanks = [...new Set(data.paymentBankAccounts.map((a) => a.bankName))];
    const bankPickerItems = s.bankPickerMode === 'bank'
      ? uniqueBanks
        .filter((name) => {
          const q = s.bankPickerQuery.trim().toLowerCase();
          return !q || name.toLowerCase().includes(q);
        })
        .map((name) => ({ id: name, label: name }))
      : data.paymentBankAccounts
        .filter((acct) => {
          const q = s.bankPickerQuery.trim().toLowerCase();
          const matchesBank = acct.bankName === sampleBankAccount.bankName;
          const matchesQuery = !q
            || acct.branch.toLowerCase().includes(q)
            || acct.location.toLowerCase().includes(q)
            || acct.bankName.toLowerCase().includes(q);
          return matchesBank && matchesQuery;
        })
        .map((acct) => ({
          id: acct.id,
          label: acct.branch,
          sublabel: `${acct.bankName} · ${acct.location}`,
        }));
    const pdpFeatures = sp.features.map((f) => ({ f: f[0], d: f[1] }));
    const pdpSpec = sp.spec.map((r) => ({ p: r[0], o: r[1] }));
    const pdpGalleryImages = productGallerySrcs(sp.id);
    const galleryIndex = Math.min(s.gallery, Math.max(0, pdpGalleryImages.length - 1));
    const galleryThumbs = pdpGalleryImages.map((src, i) => ({
      i,
      src,
      active: galleryIndex === i,
      sel: () => setState((st) => ({ ...st, gallery: i })),
    }));
    const trustBadges = ui.pdp.trustBadges.map((t) => ({ t }));
    const relatedProducts = data.products
      .filter((p) => p.id !== sp.id)
      .slice(0, 4)
      .map((p) => ({ ...mkProd(p, s.pdpFrom), imageSrc: productImageSrc(p.id) }));

    const faqs = data.faqList.map((f, i) => ({
      q: f[0],
      a: f[1],
      open: s.openFaq === i,
      toggle: () => setState((st) => ({ ...st, openFaq: st.openFaq === i ? null : i })),
    }));

    const productUseCards = data.useRows.map((row) => ({
      id: row.id,
      cardTitle: row.cardTitle,
      bags: row.bags,
      tips: row.tips,
    }));

    const blogRows = data.blogList.map((b) => ({
      title: b[0],
      purpose: b[1],
      excerpt: b[2] || ui.blog.fallbackExcerpt,
      category: b[3] || ui.blog.fallbackCategory,
      readTime: b[4] || ui.blog.fallbackReadTime,
      open: () => go('blog'),
    }));

    const companyRows = ui.contact.companyRows.map((r) => ({ k: r[0], v: r[1] }));
    const whyRows = ui.about.whyItems.map((r) => ({ k: r[0], v: r[1] }));
    const contactQuick = [
      { label: ui.contact.emailLabel, value: 'info@vividpoly.com', href: 'mailto:info@vividpoly.com' },
      { label: ui.contact.phoneLabel, value: '+91 92136 26740', href: 'tel:+919213626740' },
    ];
    const contactAddresses = [
      {
        label: ui.contact.corporateOffice,
        value: 'Sankalp Square, A 1601, Sindhu Bhavan Marg, near Taj Hotel, opp. Shoot Game, PRL Colony, Bopal, Ahmedabad, Gujarat 380058',
      },
    ];

    const setQ = (k: string, val: unknown) =>
      setState((st) => ({ ...st, quote: { ...st.quote, [k]: val } }));
    const qv = s.quote;
    const capacityRangeNotice = getCapacityCustomNotice(typeof qv.capacity === 'string' ? qv.capacity : '');
    const capacityRangeAccepted = Boolean(qv.capacityRangeAccepted);
    const qo = ui.quoteOptions;
    const packedOptions = data.packedProductOptions.map((label) => ({ value: label, label }));
    const capacityOptions = qo.capacity.map((label) => ({ value: label, label: label === 'Custom' ? ui.common.custom : label }));
    const printOptions = qo.printing.map((label) => ({ value: label, label }));
    const addonOptions = [{ value: '', label: ui.common.none }, ...qo.addons.map((label) => ({ value: label, label }))];
    const packingOptions = [{ value: '', label: ui.quote.reviewLabels.empty }, ...qo.packing.map((label) => ({ value: label, label }))];
    const selectedAddon = Object.keys(qv.addons || {}).find((k) => (qv.addons as Record<string, boolean>)[k]) || '';

    const qf = ui.quote.fields;
    const ql = ui.quote.reviewLabels;
    const reviewFields = [
      {
        id: 'product',
        label: qf.bagType,
        kind: 'select' as const,
        value: (qv.product as string) || '',
        empty: !qv.product,
        options: data.products.map((p) => ({ value: p.name, label: p.name })),
        placeholder: ui.common.select,
        onSelect: (val: string) => {
          const p = data.products.find((x) => x.name === val);
          setState((st) => ({
            ...st,
            quote: { ...st.quote, product: val, productId: p?.id },
          }));
        },
      },
      {
        id: 'packed',
        label: qf.product,
        kind: 'select' as const,
        value: (qv.packed as string) || '',
        empty: !qv.packed,
        options: packedOptions,
        placeholder: ui.common.select,
        onSelect: (val: string) => setQ('packed', val),
      },
      {
        id: 'capacity',
        label: qf.capacity,
        kind: 'select' as const,
        value: (qv.capacity as string) || '',
        empty: !qv.capacity,
        options: capacityOptions,
        placeholder: ui.common.select,
        customPlaceholder: ui.filters.capacityExample,
        customRangeNotice: capacityRangeNotice,
        customRangeAccepted: capacityRangeAccepted,
        onAcceptCustomRange: () => setQ('capacityRangeAccepted', true),
        onSelect: (val: string) => {
          const notice = getCapacityCustomNotice(val);
          setState((st) => ({
            ...st,
            quote: {
              ...st.quote,
              capacity: val,
              capacityRangeAccepted: notice ? false : true,
            },
          }));
        },
      },
      {
        id: 'size',
        label: qf.size,
        kind: 'text' as const,
        value: (qv.size as string) || '',
        empty: !qv.size,
        fullWidth: true,
        placeholder: '45 × 75 × 12 cm',
        suggestions: ['45 × 75 × 12 cm', '50 × 80 cm', '55 × 90 cm'],
        onSuggestion: (val: string) => setQ('size', val),
        onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => setQ('size', e.target.value),
      },
      {
        id: 'printing',
        label: qf.printing,
        kind: 'select' as const,
        value: (qv.printing as string) || '',
        empty: !qv.printing,
        options: printOptions,
        placeholder: ui.common.select,
        onSelect: (val: string) => setQ('printing', val),
      },
      {
        id: 'addons',
        label: qf.addons,
        kind: 'select' as const,
        value: selectedAddon,
        empty: false,
        optional: true,
        options: addonOptions,
        placeholder: ui.common.none,
        onSelect: (val: string) => setQ('addons', val ? { [val]: true } : {}),
      },
      {
        id: 'packing',
        label: qf.packing,
        kind: 'select' as const,
        value: (qv.packing as string) || '',
        empty: false,
        optional: true,
        options: packingOptions,
        placeholder: ui.common.select,
        onSelect: (val: string) => setQ('packing', val),
      },
      {
        id: 'quantity',
        label: qf.quantity,
        kind: 'text' as const,
        value: (qv.quantity as string) || '',
        empty: !qv.quantity,
        placeholder: '50,000 pcs',
        suggestions: ['10,000 pcs', '50,000 pcs', '100,000 pcs'],
        onSuggestion: (val: string) => setQ('quantity', val),
        onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => setQ('quantity', e.target.value),
      },
      {
        id: 'destination',
        label: qf.destination,
        kind: 'select' as const,
        value: (qv.country as string) || '',
        empty: !qv.country,
        fullWidth: true,
        options: data.markets.map((m) => ({ value: m, label: m })),
        placeholder: ui.common.selectCountry,
        suggestions: ['USA', 'UK', 'Australia', 'Europe'],
        onSuggestion: (val: string) => setQ('country', val),
        onSelect: (val: string) => setQ('country', val),
      },
    ];

    const reviewFieldSteps = [
      {
        id: 'packing',
        title: ui.quote.reviewSteps.product,
        fieldIds: ['product', 'packed', 'capacity'],
      },
      {
        id: 'size-print',
        title: ui.quote.reviewSteps.sizePrint,
        fieldIds: ['size', 'printing', 'addons'],
      },
      {
        id: 'order',
        title: ui.quote.reviewSteps.order,
        fieldIds: ['packing', 'quantity', 'destination'],
      },
    ];

    const quoteBagSpecCanSubmit = reviewFields
      .filter((field) => !field.optional)
      .every((field) => {
        if (field.empty) return false;
        if (field.customRangeNotice && !field.customRangeAccepted) return false;
        return true;
      });

    // Enrich the quote's Odoo lead with the full bag specification when the
    // visitor submits. Reuses the lead id captured at the contact step so we
    // update that same lead rather than creating a duplicate.
    const enrichQuoteLeadWithSpecs = () => {
      const specs = reviewFields
        .map((field) => ({ label: String(field.label ?? ''), value: String(field.value ?? '') }))
        .filter((s) => s.label && s.value);
      void submitQuoteLead({
        name: String(qv.name ?? '') || undefined,
        company: String(qv.company ?? '') || undefined,
        email: String(qv.email ?? ''),
        whatsapp: String(qv.whatsapp ?? '') || undefined,
        country: String(qv.country ?? '') || undefined,
        product: String(qv.product ?? '') || undefined,
        message: String(qv.message ?? '') || undefined,
        specs,
        leadId: typeof qv.odooLeadId === 'number' ? qv.odooLeadId : undefined,
      }).then((leadId) => {
        if (leadId != null && leadId !== qv.odooLeadId) {
          setState((st) => ({ ...st, quote: { ...st.quote, odooLeadId: leadId } }));
        }
      });
    };

    return {
      accent,
      goHome,
      goContact: () => navigate((st) => ({
        ...st,
        screen: 'contact',
        menu: null,
        searchOpen: false,
        quoteContactOpen: false,
        quote: {
          ...st.quote,
          product: generalEnquiryType,
          productId: 'general',
        },
      })),
      goQuote: () => {
        navigate((st) => ({
          ...st,
          screen: 'quote',
          quoteStep: getInitialQuoteStep(st.quote),
          menu: null,
        }));
      },
      goAbout: () => go('about'),
      goCareers: () => go('careers'),
      goBlog: () => go('blog'),
      goCatalogueType: () => {
        clearListScrollRestore();
        navigate((st) => ({
          ...st,
          screen: 'catalogue',
          cat: 'type',
          menu: null,
          catGuide: 'product-type',
          catFiltersOpen: false,
        }));
      },
      goCatalogueUse: () => {
        clearListScrollRestore();
        navigate((st) => ({
          ...st,
          screen: 'catalogue',
          cat: 'use',
          prodTab: 'use',
          menu: null,
          catSort: 'recommended',
          filters: {},
          catGuide: 'use-sort',
          catFiltersOpen: false,
        }));
      },
      goBack,
      breadcrumbsFor: (trail: string) =>
        withHomeBreadcrumb(splitBreadcrumbTrail(trail, goBack), goHome, ui.breadcrumbs.home),
      toggleProducts: () => setState((st) => ({
        ...st,
        prodTab: 'type',
        menu: st.menu === 'products' ? null : 'products',
        searchOpen: false,
      })),
      toggleIndustry: () => setState((st) => ({
        ...st,
        prodTab: 'use',
        menu: st.menu === 'industry' ? null : 'industry',
        searchOpen: false,
      })),
      toggleResources: () => toggleMenu('resources'),
      setMenu: (menu: 'products' | 'resources' | 'industry' | null) => setState((st) => ({
        ...st,
        menu,
        prodTab: menu === 'industry' ? 'use' : menu === 'products' ? 'type' : st.prodTab,
        searchOpen: false,
      })),
      closeAll: () => setState((st) => ({ ...st, menu: null, searchOpen: false })),
      menu: s.menu,
      menuProducts: s.menu === 'products',
      menuIndustry: s.menu === 'industry',
      menuResources: s.menu === 'resources',
      overlayOpen: !!s.menu || s.searchOpen,
      navProductsColor:
        s.screen === 'pdp'
        || s.menu === 'products'
        || (s.screen === 'catalogue' && s.cat === 'type')
          ? VP.navActive
          : VP.navIdle,
      navAboutColor: s.screen === 'about' ? VP.navActive : VP.navIdle,
      navIndustryColor:
        s.menu === 'industry' || (s.screen === 'catalogue' && s.cat === 'use') ? VP.navActive : VP.navIdle,
      navResourcesColor: s.screen === 'faqs' || s.screen === 'blog' || s.menu === 'resources' ? VP.navActive : VP.navIdle,
      navContactColor: s.screen === 'contact' ? VP.navActive : VP.navIdle,
      prodScrollRef: scrollRef,
      prodPrev: () => prodScrollBy(-340),
      prodNext: () => prodScrollBy(340),
      setTabType: () => setState((st) => ({ ...st, prodTab: 'type' })),
      setTabUse: () => setState((st) => ({ ...st, prodTab: 'use' })),
      megaGroups,
      megaTypeGroups,
      megaUseGroups,
      megaCols: megaIsType ? 3 : 4,
      tabTypeColor: megaIsType ? accent : VP.textSecondary,
      tabTypeBorder: megaIsType ? `2px solid ${accent}` : '2px solid transparent',
      tabUseColor: !megaIsType ? accent : VP.textSecondary,
      tabUseBorder: !megaIsType ? `2px solid ${accent}` : '2px solid transparent',
      megaFooterLabel: megaIsType ? ui.nav.viewAllByType : ui.nav.viewAllByIndustry,
      megaFooterAction: megaIsType
        ? () => navigate((st) => ({ ...st, screen: 'catalogue', cat: 'type', menu: null, catFiltersOpen: false }))
        : () => navigate((st) => ({ ...st, screen: 'catalogue', cat: 'use', menu: null, catFiltersOpen: false })),
      megaTypeFooterAction: () =>
        navigate((st) => ({ ...st, screen: 'catalogue', cat: 'type', menu: null, catFiltersOpen: false })),
      megaUseFooterAction: () =>
        navigate((st) => ({ ...st, screen: 'catalogue', cat: 'use', menu: null, catFiltersOpen: false })),
      resourceLinks: [
        {
          title: ui.nav.blogTitle,
          desc: ui.nav.blogDesc,
          open: () => go('blog'),
        },
        {
          title: ui.nav.faqsTitle,
          desc: ui.nav.faqsDesc,
          open: goHomeFaqs,
        },
      ],
      ui,
      quoteContactLabels: {
        name: ui.contact.formName,
        company: ui.contact.formCompany,
        email: ui.contact.formEmail,
        phone: ui.contact.formPhone,
        country: ui.contact.formCountry,
        selectCountry: ui.common.selectCountry,
        emailInvalid: ui.quote.emailInvalid,
      },
      quoteStepLabels: {
        aria: ui.quote.stepLabel.replace('{current}', '1').replace('{total}', '2'),
        stepContact: ui.quote.stepContact,
        stepBagSpec: ui.quote.stepBagSpec,
        howReachYou: ui.quote.howReachYou,
        registerLead: ui.quote.registerLead,
        closeForm: ui.quote.closeForm,
        stepKicker: (n: number) => ui.quote.stepLabel.replace('{current}', String(n)).replace('{total}', '2'),
      },
      searchPlaceholder: data.siteCopy.searchPlaceholder,
      siteCopy: data.siteCopy,
      searchVal: s.searchVal,
      searchOpen: s.searchOpen,
      searchResults,
      searchHeading,
      onSearchFocus: () => setState((st) => ({ ...st, searchOpen: true, menu: null })),
      openSearch: () => setState((st) => ({ ...st, searchOpen: true, menu: null })),
      onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((st) => ({ ...st, searchVal: e.target.value, searchOpen: true })),
      markets: data.markets,
      products,
      productUseCards,
      showHome: s.screen === 'home',
      pageTransitionKey: getPageTransitionKey(s),
      showCatalogue: s.screen === 'catalogue',
      catTitle: catUse ? ui.catalogue.titleByUse : ui.catalogue.titleByType,
      catCrumb: catUse ? ui.catalogue.breadcrumbUse : ui.catalogue.breadcrumbType,
      catBreadcrumbs: [
        { label: ui.breadcrumbs.home, onClick: goHome },
        { label: catUse ? ui.catalogue.titleByUse : ui.catalogue.titleByType },
      ],
      catSub: catUse ? data.siteCopy.catalogueUseSub : data.siteCopy.catalogueTypeSub,
      catCount: filteredCount,
      filtersActive,
      catalogueProducts,
      filteredCount,
      filterSecs,
      capacityFilter: {
        stops: CAPACITY_STOPS,
        minIdx: s.capacityMinIdx,
        maxIdx: s.capacityMaxIdx,
        customKg: s.capacityCustomKg,
        customNotice: capacityCustomNotice,
        setMinIdx: (idx: number) => setState((st) => ({
          ...st,
          capacityMinIdx: Math.min(Math.max(0, idx), st.capacityMaxIdx),
        })),
        setMaxIdx: (idx: number) => setState((st) => ({
          ...st,
          capacityMaxIdx: Math.max(Math.min(CAPACITY_STOPS.length - 1, idx), st.capacityMinIdx),
        })),
        setCustomKg: (e: React.ChangeEvent<HTMLInputElement>) => setState((st) => ({
          ...st,
          capacityCustomKg: e.target.value,
        })),
      },
      activeFilterCount,
      clearFilters: () => setState((st) => ({
        ...st,
        filters: {},
        catSort: 'recommended',
        capacityMinIdx: 0,
        capacityMaxIdx: CAPACITY_STOPS.length - 1,
        capacityCustomKg: '',
      })),
      catSort: s.catSort,
      catSortOptions: buildCatSortOptions(data.useGuidance, ui.catalogue.sortAllProducts),
      catGuide: s.catGuide,
      clearCatGuide,
      catFiltersOpen: s.catFiltersOpen,
      toggleCatFilters: () => setState((st) => ({ ...st, catFiltersOpen: !st.catFiltersOpen })),
      catByUse: catUse,
      setCatSort: (catSort: CatSort) => setState((st) => {
        const clearGuide = st.catGuide === 'use-sort' ? { catGuide: null as const } : {};
        if (catSort === 'recommended') {
          return { ...st, catSort, filters: {}, ...clearGuide };
        }
        return {
          ...st,
          catSort,
          filters: filtersForUseSort(catSort),
          ...clearGuide,
        };
      }),
      onCatSortChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
        setState((st) => ({ ...st, catSort: e.target.value as CatSort })),
      showPdp: s.screen === 'pdp',
      pdpFrom: s.pdpFrom,
      pdpCrumb: `Home / Products / ${sp.name}`,
      pdpBreadcrumbs: [
        { label: ui.breadcrumbs.home, onClick: goHome },
        {
          label: ui.breadcrumbs.products,
          onClick: () => {
            const current = stateRef.current;
            const cat = current.cat === 'use' ? 'use' : 'type';
            const key = `catalogue:${cat}`;
            if (hasArmedListScrollRestore(key)) {
              requestSkipNextScrollToTop();
            } else {
              clearListScrollRestore();
            }
            navigate((st) => ({
              ...st,
              screen: 'catalogue',
              cat,
              menu: null,
              catFiltersOpen: false,
            }));
          },
        },
        { label: sp.name },
      ],
      product: sp,
      pdpFeatures,
      pdpSpec,
      pdpGalleryMainSrc: pdpGalleryImages[galleryIndex] || productImageSrc(sp.id),
      galleryThumbs,
      trustBadges,
      relatedProducts,
      pdpQuoteLabel: ui.pdp.getQuoteFor.replace('{productName}', sp.name),
      pdpGetQuote: () => openContactWithProduct(sp.id),
      pdpOrderSample: () => openSampleOrder({ from: 'pdp' }),
      showSample: s.screen === 'sample',
      sampleStep: s.sampleStep,
      sampleProduct,
      sampleBillRows,
      sampleBankRows,
      samplePaymentAccount: sampleBankAccount,
      sampleCart: {
        productName: sampleProduct.name,
        productMeta: `${sampleCapacityLabel} · ${data.sampleOrderDefaults.printing}`,
        qtyLabel: data.sampleOrderDefaults.qtyLabel,
        unitPriceUsd: data.sampleOrderDefaults.unitPriceUsd,
        shippingUsd: data.sampleOrderDefaults.shippingUsd,
        subtotalUsd: sampleSubtotal,
        totalUsd: sampleTotal,
        currency: data.sampleOrderDefaults.currency,
      },
      sampleTotal,
      sampleRef: s.sampleRef,
      bankPaymentNote: data.bankDetails.paymentNote,
      samplePaymentCanSubmit: Boolean(qv.name && qv.email),
      bankPickerOpen: s.bankPickerOpen,
      bankPickerMode: s.bankPickerMode,
      bankPickerQuery: s.bankPickerQuery,
      bankPickerItems,
      openBankPicker: () => setState((st) => ({
        ...st,
        bankPickerOpen: true,
        bankPickerMode: 'bank',
        bankPickerQuery: '',
      })),
      openBranchPicker: () => setState((st) => ({
        ...st,
        bankPickerOpen: true,
        bankPickerMode: 'branch',
        bankPickerQuery: '',
      })),
      closeBankPicker: () => setState((st) => ({
        ...st,
        bankPickerOpen: false,
        bankPickerMode: null,
        bankPickerQuery: '',
      })),
      setBankPickerQuery: (query: string) => setState((st) => ({ ...st, bankPickerQuery: query })),
      selectBankPickerItem: (id: string) => {
        setState((st) => {
          if (st.bankPickerMode === 'bank') {
            const match = data.paymentBankAccounts.find((a) => a.bankName === id);
            return {
              ...st,
              samplePaymentAccountId: match?.id ?? st.samplePaymentAccountId,
              bankPickerOpen: false,
              bankPickerMode: null,
              bankPickerQuery: '',
            };
          }
          return {
            ...st,
            samplePaymentAccountId: id,
            bankPickerOpen: false,
            bankPickerMode: null,
            bankPickerQuery: '',
          };
        });
      },
      sampleBuyNow: () => {
        const ref = `VP-SMP-${Date.now().toString(36).toUpperCase().slice(-6)}`;
        navigate((st) => ({ ...st, sampleStep: 1, sampleRef: ref }));
      },
      sampleConfirmPayment: () => {
        // A confirmed sample order is a strong buying signal — record it as its
        // own Odoo lead (separate from any quote lead, so no leadId reuse).
        void submitQuoteLead({
          kind: 'sample',
          name: String(qv.name ?? '') || undefined,
          company: String(qv.company ?? '') || undefined,
          email: String(qv.email ?? ''),
          whatsapp: String(qv.whatsapp ?? '') || undefined,
          country: String(qv.country ?? '') || undefined,
          product: sampleProduct.name,
          specs: [
            { label: 'Order type', value: 'Sample order' },
            { label: 'Reference', value: String(s.sampleRef ?? '') },
            { label: 'Capacity', value: String(sampleCapacityLabel ?? '') },
            { label: 'Printing', value: String(data.sampleOrderDefaults.printing ?? '') },
            { label: 'Quantity', value: String(data.sampleOrderDefaults.qtyLabel ?? '') },
          ].filter((sp) => sp.value),
        });
        navigate((st) => ({ ...st, sampleStep: 2 }));
      },
      sampleBack: goBack,
      sampleRestart: () => navigate((st) => ({
        ...st,
        screen: 'home',
        sampleStep: 0,
        sampleRef: '',
        samplePaymentAccountId: 'hdfc-bopal',
        bankPickerOpen: false,
        bankPickerMode: null,
        bankPickerQuery: '',
      })),
      showFaqs: s.screen === 'faqs',
      faqs,
      showBlog: s.screen === 'blog',
      blogBreadcrumbs: [
        { label: ui.breadcrumbs.home, onClick: goHome },
        { label: ui.breadcrumbs.blog },
      ],
      blogRows,
      showAbout: s.screen === 'about',
      companyRows,
      whyRows,
      showCareers: s.screen === 'careers',
      careersCopy: ui.careers,
      careersBreadcrumbs: [
        { label: ui.breadcrumbs.home, onClick: goHome },
        { label: ui.breadcrumbs.careers },
      ],
      showContact: s.screen === 'contact',
      contactQuick,
      contactAddresses,
      showQuote: s.screen === 'quote',
      quoteBreadcrumbs: [
        { label: ui.breadcrumbs.home, onClick: goHome },
        { label: ui.breadcrumbs.getQuote },
      ],
      quoteStepNum: s.quoteStep,
      reviewFields,
      reviewFieldSteps,
      quoteBagSpecCanSubmit,
      quoteLeadOnly: s.quoteLeadOnly,
      quoteBagSpecPrompt: s.quoteBagSpecPrompt,
      quoteContactOpen: s.quoteContactOpen,
      openQuoteContact: openContactEnquiry,
      closeQuoteContact: () => setState((st) => ({ ...st, quoteContactOpen: false })),
      quoteContactCanSubmit: Boolean(qv.name && qv.email),
      quoteProductChips: data.products.map((p) => ({
        label: p.name, sel: qv.product === p.name,
        bg: qv.product === p.name ? VP.accentSubtle : VP.bgElevated,
        bd: qv.product === p.name ? VP.accent : VP.border,
        col: qv.product === p.name ? VP.accent : VP.textSecondary,
        pick: () => setQ('product', p.name),
      })),
      capChips: ['5 kg', '10 kg', '15 kg', '20 kg', '25 kg', '30 kg', '40 kg', '50 kg', '60 kg', '75 kg', 'Custom'].map((c) => ({
        label: c, bg: qv.capacity === c ? VP.accentSubtle : VP.bgElevated, bd: qv.capacity === c ? VP.accent : VP.border,
        col: qv.capacity === c ? VP.accent : VP.textSecondary, pick: () => setQ('capacity', c),
      })),
      printChips: ['Plain', 'Flexo printed', 'Printed laminated', 'Multi-color'].map((c) => ({
        label: c, bg: qv.printing === c ? VP.accentSubtle : VP.bgElevated, bd: qv.printing === c ? VP.accent : VP.border,
        col: qv.printing === c ? VP.accent : VP.textSecondary, pick: () => setQ('printing', c),
      })),
      addonChips: ['Liner', 'Gusset', 'Handle', 'Window', 'Perforation', 'Valve', 'Pinch', 'Block bottom'].map((c) => ({
        label: c, on: !!(qv.addons || {})[c],
        bg: (qv.addons || {})[c] ? VP.accentSubtle : VP.bgElevated,
        bd: (qv.addons || {})[c] ? VP.accent : VP.border,
        col: (qv.addons || {})[c] ? VP.accent : VP.textSecondary,
        pick: () => setQ('addons', { ...(qv.addons || {}), [c]: !(qv.addons || {})[c] }),
      })),
      reviewRows: reviewFields.map((f) => ({ k: f.label, v: f.value || '-' })),
      qStep3: s.quoteStep === 3,
      qStep4: s.quoteStep === 4,
      qStep5: s.quoteStep === 5,
      qStep6: s.quoteStep === 6,
      quoteForm: s.quoteStep < 6,
      quoteProductPrefilled: Boolean(qv.product),
      quotePageBack: () => {
        if (s.quoteStep === 5) {
          setState((st) => ({ ...st, quoteStep: 4 }));
          return;
        }
        if (s.quoteStep === 3) {
          goBack();
        }
      },
      quoteContinueFromContact: (contact?: {
        name: string;
        company?: string;
        email: string;
        whatsapp?: string;
        country?: string;
      }) => {
        const name = String(contact?.name ?? qv.name ?? '').trim();
        const email = String(contact?.email ?? qv.email ?? '').trim();
        if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

        captureQuoteLead({
          name,
          company: contact?.company ?? qv.company,
          email,
          whatsapp: contact?.whatsapp ?? qv.whatsapp,
          country: contact?.country ?? qv.country,
        });

        // Create the Odoo CRM lead as soon as we have contact details, so a
        // visitor who abandons the bag-spec wizard is still captured. Store the
        // returned id so the final submit enriches this same lead.
        void submitQuoteLead({
          name,
          company: String(contact?.company ?? qv.company ?? '') || undefined,
          email,
          whatsapp: String(contact?.whatsapp ?? qv.whatsapp ?? '') || undefined,
          country: String(contact?.country ?? qv.country ?? '') || undefined,
          product: String(qv.product ?? '') || undefined,
        }).then((leadId) => {
          if (leadId != null) {
            setState((st) => ({ ...st, quote: { ...st.quote, odooLeadId: leadId } }));
          }
        });

        navigate((st) => ({
          ...st,
          screen: 'quote',
          quoteStep: 5,
          quoteLeadOnly: false,
          quoteBagSpecPrompt: true,
          quoteContactOpen: false,
          quote: {
            ...st.quote,
            name,
            company: contact?.company ?? st.quote.company,
            email,
            whatsapp: contact?.whatsapp ?? st.quote.whatsapp,
            country: contact?.country ?? st.quote.country,
            leadCapturedAt: new Date().toISOString(),
          },
        }));
      },
      quoteContinueToBagSpec: () => {
        setState((st) => ({ ...st, quoteStep: 5, quoteLeadOnly: false, quoteBagSpecPrompt: false }));
      },
      quoteLeadDone: () => navigate((st) => ({
        ...st,
        screen: 'quote',
        quoteStep: 6,
        quoteLeadOnly: true,
        quoteBagSpecPrompt: false,
        quoteContactOpen: false,
      })),
      quoteFinalSubmit: () => {
        enrichQuoteLeadWithSpecs();
        navigate((st) => ({
          ...st,
          screen: 'quote',
          quoteStep: 6,
          quoteLeadOnly: false,
          quoteBagSpecPrompt: false,
          quoteContactOpen: false,
        }));
      },
      quoteSubmit: () => {
        enrichQuoteLeadWithSpecs();
        navigate((st) => ({
          ...st,
          screen: 'quote',
          quoteStep: 6,
          quoteLeadOnly: false,
          quoteBagSpecPrompt: false,
          quoteContactOpen: false,
        }));
      },
      quoteRestart: () => navigate((st) => ({
        ...st,
        screen: 'home',
        quoteStep: 3,
        quoteLeadOnly: false,
        quoteBagSpecPrompt: false,
        quoteContactOpen: false,
        quote: {},
      })),
      qSet: {
        name: (e: React.ChangeEvent<HTMLInputElement>) => setQ('name', e.target.value),
        company: (e: React.ChangeEvent<HTMLInputElement>) => setQ('company', e.target.value),
        email: (e: React.ChangeEvent<HTMLInputElement>) => setQ('email', e.target.value),
        whatsapp: (e: React.ChangeEvent<HTMLInputElement>) => setQ('whatsapp', e.target.value),
        country: (e: React.ChangeEvent<HTMLInputElement>) => setQ('country', e.target.value),
        packed: (e: React.ChangeEvent<HTMLInputElement>) => setQ('packed', e.target.value),
        size: (e: React.ChangeEvent<HTMLInputElement>) => setQ('size', e.target.value),
        quantity: (e: React.ChangeEvent<HTMLInputElement>) => setQ('quantity', e.target.value),
        packing: (e: React.ChangeEvent<HTMLInputElement>) => setQ('packing', e.target.value),
        message: (e: React.ChangeEvent<HTMLTextAreaElement>) => setQ('message', e.target.value),
      },
      qv,
      footCompany: [
        footLink(ui.footer.links.home, goHome),
        footLink(ui.footer.links.about, () => go('about')),
        footLink(ui.footer.links.contact, () => go('contact')),
      ],
      footProducts: data.footerProductLinks.map((p) => footLink(p.label, () => openPdp(p.id, 'catalogue'))),
      footProductsLeft: data.footerProductLinks.filter((_, i) => i % 2 === 0).map((p) => footLink(p.label, () => openPdp(p.id, 'catalogue'))),
      footProductsRight: data.footerProductLinks.filter((_, i) => i % 2 === 1).map((p) => footLink(p.label, () => openPdp(p.id, 'catalogue'))),
      footHelp: [
        footLink(ui.footer.links.productUses, () => navigate((st) => ({ ...st, screen: 'catalogue', cat: 'use', catFiltersOpen: false }))),
        footLink(ui.footer.links.blog, () => go('blog')),
        footLink(ui.footer.links.faqs, goHomeFaqs, { skipScroll: true }),
      ],
      contactProductOptions: ui.enquiryProductTypes,
      enquiryProductTypes: ui.enquiryProductTypes,
      contactEnquiryType: resolveContactEnquiryType(qv, ui.enquiryProductTypes, generalEnquiryType),
      generalEnquiryType,
      contactCountries: data.contactCountriesList,
      selectCountry: (country: string) => setQ('country', country),
      contactFieldSet: {
        name: (value: string) => setQ('name', value),
        company: (value: string) => setQ('company', value),
        email: (value: string) => setQ('email', value),
        phone: (value: string) => setQ('whatsapp', value),
        country: (value: string) => setQ('country', value),
        message: (value: string) => setQ('message', value),
      },
      selectContactProduct: (label: string) => {
        const link = ui.enquiryProductTypes.find((p) => p.label === label);
        setState((st) => ({
          ...st,
          quote: {
            ...st.quote,
            product: label,
            productId: link?.id ?? st.quote.productId,
          },
        }));
      },
      openContactEnquiry,
      resetEnquiryDefaults,
    };
  }, [s, vividPolyData, vpTokens, go, goHome, goHomeFaqs, goBack, navigate, toggleMenu, prodScrollBy, openContactEnquiry, openContactWithProduct, openCatalogueForUse, openSampleOrder, openPdp, clearCatGuide, resetEnquiryDefaults]);

  return v;
}
