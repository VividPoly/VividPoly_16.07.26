'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CatSort } from '@/lib/vividpoly-product-filters';
import { useVpSortMenuPortal } from '@/components/vividpoly/useVpSortMenuPortal';

type SortOption = { value: CatSort; label: string };

type VpSortSelectProps = {
  value: CatSort;
  options: SortOption[];
  onChange: (value: CatSort) => void;
  className?: string;
  ariaLabel?: string;
};

export default function VpSortSelect({ value, options, onChange, className, ariaLabel }: VpSortSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { mounted, position } = useVpSortMenuPortal(open, rootRef);
  const selected = options.find((opt) => opt.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDocumentClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={`vp-sort${className ? ` ${className}` : ''}`} ref={rootRef}>
      <button
        type="button"
        className={`vp-sort-trigger${open ? ' vp-sort-trigger--open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <span className="vp-sort-trigger-label">{selected?.label}</span>
        <span className="vp-sort-chevron" aria-hidden="true" />
      </button>
      {mounted && open && position && createPortal(
        <ul
          className={`vp-sort-menu vp-sort-menu--subtle vp-sort-menu--portaled${className?.includes('vp-sort--catalogue-toolbar') ? ' vp-sort-menu--catalogue' : ''}`}
          role="listbox"
          aria-label="Product use options"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            maxHeight: position.maxHeight,
          }}
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`vp-sort-option${isSelected ? ' vp-sort-option--selected' : ''}`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>,
        document.body,
      )}
    </div>
  );
}
