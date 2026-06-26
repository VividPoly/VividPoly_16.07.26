'use client';

type VpCapacityFilterProps = {
  stops: readonly number[];
  minIdx: number;
  maxIdx: number;
  customKg: string;
  customNotice: string | null;
  onMinChange: (idx: number) => void;
  onMaxChange: (idx: number) => void;
  onCustomChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function VpCapacityFilter({
  stops,
  minIdx,
  maxIdx,
  customKg,
  customNotice,
  onMinChange,
  onMaxChange,
  onCustomChange,
}: VpCapacityFilterProps) {
  const minKg = stops[minIdx];
  const maxKg = stops[maxIdx];
  const maxIdxLimit = stops.length - 1;
  const startPct = maxIdxLimit > 0 ? (minIdx / maxIdxLimit) * 100 : 0;
  const endPct = maxIdxLimit > 0 ? (maxIdx / maxIdxLimit) * 100 : 100;

  return (
    <div className="vp-cap-filter">
      <div className="vp-cap-filter-readout" aria-live="polite">
        <span className="vp-cap-filter-readout-value">{minKg} kg</span>
        <span className="vp-cap-filter-readout-sep">–</span>
        <span className="vp-cap-filter-readout-value">{maxKg} kg</span>
      </div>

      <div className="vp-cap-filter-track-wrap">
        <div className="vp-cap-filter-track" aria-hidden="true">
          <div
            className="vp-cap-filter-track-fill"
            style={{ left: `${startPct}%`, right: `${100 - endPct}%` }}
          />
        </div>
        <input
          type="range"
          className="vp-cap-filter-range vp-cap-filter-range--min"
          min={0}
          max={maxIdxLimit}
          step={1}
          value={minIdx}
          onChange={(e) => onMinChange(Number(e.target.value))}
          aria-label="Minimum capacity"
        />
        <input
          type="range"
          className="vp-cap-filter-range vp-cap-filter-range--max"
          min={0}
          max={maxIdxLimit}
          step={1}
          value={maxIdx}
          onChange={(e) => onMaxChange(Number(e.target.value))}
          aria-label="Maximum capacity"
        />
      </div>

      <div className="vp-cap-filter-ticks" aria-hidden="true">
        <span>{stops[0]} kg</span>
        <span>{stops[maxIdxLimit]} kg</span>
      </div>

      <div className="vp-cap-filter-custom-field">
        <label className="vp-cap-filter-custom-label" htmlFor="vp-cap-custom-kg">
          Or enter capacity
        </label>
        <input
          id="vp-cap-custom-kg"
          type="text"
          inputMode="decimal"
          className={`vp-cap-filter-custom-input${customNotice ? ' vp-cap-filter-custom-input--warn' : ''}`}
          value={customKg}
          onChange={onCustomChange}
          placeholder="e.g. 23 kg"
          aria-describedby={customNotice ? 'vp-cap-custom-notice' : undefined}
        />
        {customNotice && (
          <p id="vp-cap-custom-notice" className="vp-cap-filter-custom-notice" role="status">
            {customNotice}
          </p>
        )}
      </div>
    </div>
  );
}
