'use client';

import { useMemo, useState } from 'react';
import VpCustomSelect from '@/components/vividpoly/VpCustomSelect';

export type BagSpecField = {
  id: string;
  label: string;
  kind: 'select' | 'text';
  value: string;
  empty: boolean;
  optional?: boolean;
  hint?: string;
  fullWidth?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  suggestions?: string[];
  customPlaceholder?: string;
  customRangeNotice?: string | null;
  customRangeAccepted?: boolean;
  onAcceptCustomRange?: () => void;
  onSelect?: (val: string) => void;
  onSuggestion?: (val: string) => void;
  onTextChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type BagSpecStep = {
  id: string;
  title: string;
  fieldIds: string[];
};

type VpBagSpecFormProps = {
  fields: BagSpecField[];
  steps: BagSpecStep[];
};

function isFieldComplete(field: BagSpecField) {
  if (field.optional) return true;
  if (field.empty) return false;
  if (field.customRangeNotice && !field.customRangeAccepted) return false;
  return true;
}

function isStepComplete(stepFields: BagSpecField[]) {
  return stepFields.filter((field) => !field.optional).every(isFieldComplete);
}

function getFirstIncompleteStep(steps: BagSpecStep[], fieldById: Map<string, BagSpecField>) {
  for (let index = 0; index < steps.length; index += 1) {
    const stepFields = steps[index].fieldIds
      .map((id) => fieldById.get(id))
      .filter((field): field is BagSpecField => Boolean(field));
    if (!isStepComplete(stepFields)) return index;
  }
  return Math.max(0, steps.length - 1);
}

function getFilledCount(fields: BagSpecField[]) {
  const required = fields.filter((field) => !field.optional);
  const filled = required.filter((field) => isFieldComplete(field)).length;
  return { filled, total: required.length };
}

function BagSpecFieldBlock({ field }: { field: BagSpecField }) {
  return (
    <div className={`vp-bag-spec-field${field.fullWidth ? ' vp-bag-spec-field--full' : ''}`}>
      <label className="vp-bag-spec-label" htmlFor={`vp-bag-spec-${field.id}`}>
        {field.label}
        {field.optional && <span className="vp-bag-spec-label-optional">optional</span>}
      </label>

      {field.kind === 'select' ? (
        <VpCustomSelect
          id={`vp-bag-spec-${field.id}`}
          value={field.value}
          options={field.options ?? []}
          onChange={field.onSelect ?? (() => {})}
          placeholder={field.placeholder ?? 'Select'}
          ariaLabel={field.label}
          className="vp-sort--field"
          customPlaceholder={field.customPlaceholder}
          customRangeNotice={field.customRangeNotice}
          customRangeAccepted={field.customRangeAccepted}
          onAcceptCustomRange={field.onAcceptCustomRange}
        />
      ) : (
        <input
          id={`vp-bag-spec-${field.id}`}
          type="text"
          value={field.value}
          onChange={field.onTextChange}
          placeholder={field.placeholder}
          className={`vp-quote-contact-input${field.empty ? ' vp-bag-spec-input--empty' : ''}`}
          aria-label={field.label}
        />
      )}

      {field.suggestions && field.suggestions.length > 0 && (
        <div className="vp-bag-spec-chips" aria-label={`${field.label} quick picks`}>
          {field.suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className={`vp-bag-spec-chip${field.value === suggestion ? ' vp-bag-spec-chip--active' : ''}`}
              onClick={() => field.onSuggestion?.(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VpBagSpecForm({ fields, steps }: VpBagSpecFormProps) {
  const fieldById = useMemo(() => new Map(fields.map((field) => [field.id, field])), [fields]);

  const [stepIndex, setStepIndex] = useState(() => getFirstIncompleteStep(steps, fieldById));

  const { filled, total } = getFilledCount(fields);
  const progress = total > 0 ? Math.round((filled / total) * 100) : 0;

  const currentStep = steps[stepIndex];
  const currentFields = useMemo(
    () =>
      (currentStep?.fieldIds ?? [])
        .map((id) => fieldById.get(id))
        .filter((field): field is BagSpecField => Boolean(field)),
    [currentStep, fieldById],
  );

  const stepComplete = isStepComplete(currentFields);
  const isLastStep = stepIndex >= steps.length - 1;

  const goToStep = (index: number) => {
    if (index === stepIndex) return;
    setStepIndex(index);
  };

  const goBack = () => {
    setStepIndex((index) => Math.max(0, index - 1));
  };

  const goNext = () => {
    if (!stepComplete) return;
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  };

  if (!currentStep) return null;

  return (
    <div className="vp-bag-spec">
      <div className="vp-bag-spec-progress" aria-live="polite">
        <div className="vp-bag-spec-progress-head">
          <span className="vp-bag-spec-progress-label">
            {stepIndex + 1}/{steps.length}
          </span>
          <span className="vp-bag-spec-progress-pct">{progress}%</span>
        </div>
        <div
          className="vp-bag-spec-progress-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Bag specification progress"
        >
          <div className="vp-bag-spec-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="vp-bag-spec-step-dots" role="tablist" aria-label="Specification steps">
          {steps.map((step, index) => {
            const stepFields = step.fieldIds
              .map((id) => fieldById.get(id))
              .filter((field): field is BagSpecField => Boolean(field));
            const done = isStepComplete(stepFields);
            const isCurrent = index === stepIndex;

            return (
              <button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`${step.title}${done ? ', completed' : ''}`}
                className={[
                  'vp-bag-spec-step-dot',
                  isCurrent ? 'vp-bag-spec-step-dot--current' : '',
                  done ? 'vp-bag-spec-step-dot--done' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => goToStep(index)}
              />
            );
          })}
        </div>
      </div>

      <div key={currentStep.id} className="vp-bag-spec-step">
        <div className="vp-bag-spec-step-fields">
          {currentFields.map((field) => (
            <BagSpecFieldBlock key={field.id} field={field} />
          ))}
        </div>

        <div className="vp-bag-spec-step-nav">
          {stepIndex > 0 ? (
            <button type="button" className="vp-bag-spec-step-back" onClick={goBack}>
              Back
            </button>
          ) : (
            <span />
          )}
          {!isLastStep && (
            <button
              type="button"
              className="vp-bag-spec-step-next"
              onClick={goNext}
              disabled={!stepComplete}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
