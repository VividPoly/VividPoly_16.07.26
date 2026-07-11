'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useVpSortMenuPortal } from '@/components/vividpoly/useVpSortMenuPortal';

export const VP_SELECT_CUSTOM = 'Custom';

export type VpSelectOption = { value: string; label: string };

export type VpCustomSelectProps = {
  value: string;
  options: string[] | VpSelectOption[];
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
  className?: string;
  customOptionLabel?: string;
  customPlaceholder?: string;
  /** Shown when a custom value is outside an expected range (e.g. 5–75 kg). */
  customRangeNotice?: string | null;
  customRangeAccepted?: boolean;
  onAcceptCustomRange?: () => void;
  menuClassName?: string;
  /** Combobox: trigger becomes a text field; options filter as you type. */
  searchable?: boolean;
};

function normalizeOptions(options: string[] | VpSelectOption[]): VpSelectOption[] {
  if (!options.length) return [];
  if (typeof options[0] === 'string') {
    return (options as string[]).map((option) => ({ value: option, label: option }));
  }
  return options as VpSelectOption[];
}

function isCustomOption(option: VpSelectOption, customLabel: string) {
  return option.value === customLabel || option.label === customLabel;
}

function shouldShowCustomField(
  value: string,
  options: VpSelectOption[],
  customLabel: string,
  hasCustomOption: boolean,
) {
  if (!hasCustomOption) return false;
  if (value === customLabel) return true;
  const presetValues = new Set(
    options.map((option) => option.value).filter((optionValue) => optionValue && optionValue !== customLabel),
  );
  return Boolean(value) && !presetValues.has(value);
}

export default function VpCustomSelect({
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
  id,
  ariaLabel,
  className,
  customOptionLabel = VP_SELECT_CUSTOM,
  customPlaceholder = 'Enter your specification…',
  customRangeNotice = null,
  customRangeAccepted = false,
  onAcceptCustomRange,
  menuClassName,
  searchable = false,
}: VpCustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hasTyped, setHasTyped] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { mounted, position } = useVpSortMenuPortal(open, rootRef);

  const closeMenu = () => {
    setOpen(false);
    setQuery('');
    setHasTyped(false);
  };

  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);
  const hasCustomOption = normalizedOptions.some((option) => isCustomOption(option, customOptionLabel));
  const showCustomField = !searchable && shouldShowCustomField(value, normalizedOptions, customOptionLabel, hasCustomOption);

  const filteredOptions = useMemo(() => {
    if (!searchable) return normalizedOptions;
    if (!hasTyped) return normalizedOptions;
    const q = query.trim().toLowerCase();
    if (!q) return normalizedOptions;
    return normalizedOptions.filter((option) => option.label.toLowerCase().includes(q));
  }, [normalizedOptions, query, searchable, hasTyped]);

  const selectedOption = normalizedOptions.find((option) => option.value === value);
  const displayLabel = selectedOption?.label || value || placeholder;
  const isPlaceholder = !value;
  const showRangeNotice = Boolean(customRangeNotice) && !customRangeAccepted;
  const listboxId = id ? `${id}-listbox` : undefined;
  const closedInputValue = selectedOption?.label || value || '';
  const openInputValue = hasTyped ? query : closedInputValue;

  useEffect(() => {
    if (!open) return;

    const onDocumentPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      closeMenu();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('pointerdown', onDocumentPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onDocumentPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) closeMenu();
  }, [disabled]);

  useEffect(() => {
    if (showCustomField) {
      customInputRef.current?.focus();
    }
  }, [showCustomField]);

  useEffect(() => {
    if (searchable && open) {
      searchInputRef.current?.focus();
    }
  }, [searchable, open]);

  const menuOptions = searchable ? filteredOptions : normalizedOptions;

  const menuNode = open && !disabled && position ? (
    <ul
      ref={menuRef}
      id={listboxId}
      className={`vp-sort-menu vp-sort-menu--subtle vp-sort-menu--portaled${searchable ? ' vp-sort-menu--searchable' : ''}${menuClassName ? ` ${menuClassName}` : ''}`}
      role="listbox"
      aria-label={ariaLabel}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        maxHeight: position.maxHeight,
      }}
      onWheel={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
    >
      {menuOptions.length === 0 && (
        <li className="vp-sort-option vp-sort-option--empty" role="presentation">
          No matches found
        </li>
      )}
      {menuOptions.map((option) => {
        const isSelected = option.value === value
          || (showCustomField && isCustomOption(option, customOptionLabel));
        return (
          <li key={option.value || option.label} role="presentation">
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
                onChange(option.value);
                closeMenu();
              }}
            >
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div
      className={`vp-sort vp-sort--field${className ? ` ${className}` : ''}`}
      ref={rootRef}
    >
      {searchable ? (
        <div
          className={`vp-sort-trigger vp-sort-trigger--custom vp-sort-trigger--searchable${open ? ' vp-sort-trigger--open' : ''}${disabled ? ' vp-sort-trigger--disabled' : ''}`}
        >
          <input
            ref={searchInputRef}
            id={id}
            type="text"
            className="vp-select-custom-input--inline"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            value={open ? openInputValue : closedInputValue}
            placeholder={placeholder}
            aria-label={ariaLabel || placeholder}
            disabled={disabled}
            onChange={(event) => {
              setQuery(event.target.value);
              setHasTyped(true);
              if (!open) setOpen(true);
            }}
            onFocus={() => {
              if (disabled) return;
              setQuery('');
              setHasTyped(false);
              setOpen(true);
            }}
          />
          <button
            type="button"
            className="vp-sort-chevron-btn"
            aria-label={`${ariaLabel || placeholder} options`}
            aria-expanded={open}
            disabled={disabled}
            onClick={() => {
              if (disabled) return;
              if (open) closeMenu();
              else {
                setQuery('');
                setHasTyped(false);
                setOpen(true);
              }
            }}
          >
            <span className="vp-sort-chevron" aria-hidden="true" />
          </button>
        </div>
      ) : showCustomField ? (
        <div
          className={`vp-sort-trigger vp-sort-trigger--custom${open ? ' vp-sort-trigger--open' : ''}${disabled ? ' vp-sort-trigger--disabled' : ''}`}
        >
          <input
            ref={customInputRef}
            id={id}
            type="text"
            className="vp-select-custom-input--inline"
            value={value === customOptionLabel ? '' : value}
            placeholder={customPlaceholder}
            aria-label={`${ariaLabel || placeholder} custom value`}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
          />
          <button
            type="button"
            className="vp-sort-chevron-btn"
            aria-label={`${ariaLabel || placeholder} options`}
            disabled={disabled}
            onClick={() => {
              if (!disabled) setOpen((isOpen) => !isOpen);
            }}
          >
            <span className="vp-sort-chevron" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          id={id}
          type="button"
          className={`vp-sort-trigger${open ? ' vp-sort-trigger--open' : ''}${disabled ? ' vp-sort-trigger--disabled' : ''}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabel}
          disabled={disabled}
          onClick={() => {
            if (!disabled) setOpen((isOpen) => !isOpen);
          }}
        >
          <span
            className={`vp-sort-trigger-label${isPlaceholder ? ' vp-sort-trigger-label--placeholder' : ''}`}
          >
            {displayLabel}
          </span>
          <span className="vp-sort-chevron" aria-hidden="true" />
        </button>
      )}

      {mounted && menuNode ? createPortal(menuNode, document.body) : null}

      {showRangeNotice && (
        <div className="vp-select-range-notice" role="status">
          <p>{customRangeNotice}</p>
          {onAcceptCustomRange && (
            <button type="button" className="vp-select-range-notice-action" onClick={onAcceptCustomRange}>
              Use this value anyway
            </button>
          )}
        </div>
      )}
    </div>
  );
}
