'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type BankPickerItem = {
  id: string;
  label: string;
  sublabel?: string;
};

type VpBankSearchOverlayProps = {
  open: boolean;
  title: string;
  placeholder: string;
  items: BankPickerItem[];
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export default function VpBankSearchOverlay({
  open,
  title,
  placeholder,
  items,
  query,
  onQueryChange,
  onSelect,
  onClose,
}: VpBankSearchOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useFocusTrap(open, sheetRef, onClose);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted, open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) => item.label.toLowerCase().includes(q) || item.sublabel?.toLowerCase().includes(q),
    );
  }, [items, query]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="vp-bank-picker-overlay" role="presentation">
      <button type="button" className="vp-menu-backdrop" onClick={onClose} aria-label="Close picker" />
      <div
        ref={sheetRef}
        className="vp-bank-picker-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vp-bank-picker-title"
      >
        <div className="vp-bank-picker-handle" aria-hidden="true" />
        <h2 id="vp-bank-picker-title" className="vp-bank-picker-title">{title}</h2>
        <input
          type="search"
          className="vp-bank-picker-search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          autoFocus
        />
        <ul className="vp-bank-picker-list">
          {filtered.length === 0 && (
            <li className="vp-bank-picker-empty">No matches. Try a different search.</li>
          )}
          {filtered.map((item) => (
            <li key={item.id}>
              <button type="button" className="vp-bank-picker-option" onClick={() => onSelect(item.id)}>
                <span className="vp-bank-picker-option-label">{item.label}</span>
                {item.sublabel && <span className="vp-bank-picker-option-sub">{item.sublabel}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
