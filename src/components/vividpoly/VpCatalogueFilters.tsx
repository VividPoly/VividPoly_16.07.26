'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import VpCapacityFilter from '@/components/vividpoly/VpCapacityFilter';
import VpCatalogueGuideTooltip from '@/components/vividpoly/VpCatalogueGuideTooltip';
import { CloseIcon } from '@/components/vividpoly/VividPolyIcons';

type FilterOption = {
  label: string;
  checked: boolean;
  toggle: () => void;
};

type FilterSection = {
  key: string;
  title: string;
  defaultOpen?: boolean;
  opts: FilterOption[];
};

type CapacityFilterProps = {
  stops: readonly number[];
  minIdx: number;
  maxIdx: number;
  customKg: string;
  customNotice: string | null;
  setMinIdx: (idx: number) => void;
  setMaxIdx: (idx: number) => void;
  setCustomKg: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type VpCatalogueFiltersProps = {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  activeFilterCount: number;
  filteredCount: number;
  filterSecs: FilterSection[];
  capacityFilter: CapacityFilterProps;
  catGuide: string | null;
  catByUse: boolean;
  guideMessage?: string;
  onDismissGuide: () => void;
};

function FilterOptions({ opts }: { opts: FilterOption[] }) {
  return (
    <div className="vp-filter-options">
      {opts.map((option, iOpt) => (
        <label key={iOpt} className="vp-filter-option">
          <input
            type="checkbox"
            className="vp-filter-input"
            checked={option.checked}
            onChange={option.toggle}
          />
          <span
            className={`vp-filter-checkbox${option.checked ? ' vp-filter-checkbox--checked' : ''}`}
            aria-hidden="true"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

export default function VpCatalogueFilters({
  open,
  onClose,
  onClear,
  activeFilterCount,
  filteredCount,
  filterSecs,
  capacityFilter,
  catGuide,
  catByUse,
  guideMessage,
  onDismissGuide,
}: VpCatalogueFiltersProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(max-width: 991px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!(open && isMobile)) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobile]);

  const capacityBlock = (
    <VpCapacityFilter
      stops={capacityFilter.stops}
      minIdx={capacityFilter.minIdx}
      maxIdx={capacityFilter.maxIdx}
      customKg={capacityFilter.customKg}
      customNotice={capacityFilter.customNotice}
      onMinChange={capacityFilter.setMinIdx}
      onMaxChange={capacityFilter.setMaxIdx}
      onCustomChange={capacityFilter.setCustomKg}
    />
  );

  const header = (
    <div className="vp-filter-header">
      <div className="vp-filter-title-row">
        <span className="vp-filter-title">Filters</span>
        {activeFilterCount > 0 ? <span className="vp-filter-count">{activeFilterCount}</span> : null}
      </div>
      <div className="vp-filter-header-actions">
        {activeFilterCount > 0 ? (
          <button type="button" onClick={onClear} className="vp-filter-clear">
            Clear filters
          </button>
        ) : null}
        <button
          type="button"
          className="vp-filter-drawer-close"
          aria-label="Close filters"
          onClick={onClose}
        >
          <CloseIcon size={18} />
        </button>
      </div>
    </div>
  );

  const footer = (
    <div className="vp-filter-drawer-footer">
      <button type="button" className="vp-filter-drawer-apply" onClick={onClose}>
        Show {filteredCount} products
      </button>
    </div>
  );

  /* Mobile drawer: everything visible at once, no accordion. */
  if (isMobile) {
    if (!mounted || !open) return null;
    return createPortal(
      <div className="vp-filter-drawer-root">
        <button
          type="button"
          className="vp-filter-drawer-backdrop"
          aria-label="Close filters"
          onClick={onClose}
        />
        <div
          className="vp-filter-column vp-filter-column--drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Product filters"
        >
          <aside className="vp-filter-sidebar">
            {header}
            <div className="vp-filter-scroll vp-filter-scroll--flat">
              <section className="vp-filter-block">
                <h3 className="vp-filter-block-title">Capacity</h3>
                {capacityBlock}
              </section>
              <div className="vp-filter-flat-grid">
                {filterSecs.map((sec, iSec) => (
                  <section
                    key={iSec}
                    className={`vp-filter-block${catGuide === 'product-type' && !catByUse && sec.key === 'Product Type' ? ' vp-filter-block--guided' : ''}`}
                  >
                    <h3 className="vp-filter-block-title">{sec.title}</h3>
                    {catGuide === 'product-type' && !catByUse && sec.key === 'Product Type' && guideMessage ? (
                      <VpCatalogueGuideTooltip
                        message={guideMessage}
                        placement="filter"
                        onDismiss={onDismissGuide}
                      />
                    ) : null}
                    <FilterOptions opts={sec.opts} />
                  </section>
                ))}
              </div>
            </div>
            {footer}
          </aside>
        </div>
      </div>,
      document.body,
    );
  }

  /* Desktop sidebar: keep progressive disclosure. */
  return (
    <div className="vp-filter-column" aria-hidden={!open}>
      <aside className="vp-filter-sidebar">
        {header}
        <div className="vp-filter-scroll">
          <details className="vp-filter-section" open>
            <summary>
              Capacity
              <span className="vp-filter-chevron" aria-hidden="true" />
            </summary>
            {capacityBlock}
          </details>
          {filterSecs.map((sec, iSec) => (
            <details
              key={iSec}
              className={`vp-filter-section${catGuide === 'product-type' && !catByUse && sec.key === 'Product Type' ? ' vp-filter-section--guided' : ''}`}
              {...(sec.defaultOpen ? { open: true } : {})}
            >
              <summary>
                {sec.title}
                <span className="vp-filter-chevron" aria-hidden="true" />
              </summary>
              {catGuide === 'product-type' && !catByUse && sec.key === 'Product Type' && guideMessage ? (
                <VpCatalogueGuideTooltip
                  message={guideMessage}
                  placement="filter"
                  onDismiss={onDismissGuide}
                />
              ) : null}
              <FilterOptions opts={sec.opts} />
            </details>
          ))}
        </div>
        {footer}
      </aside>
    </div>
  );
}
