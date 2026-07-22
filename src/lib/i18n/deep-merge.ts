// Deep-merge a locale's partial translations onto the full English base so any
// key a translator hasn't provided yet falls back to English. Plain objects and
// arrays are merged recursively (element-by-element for arrays), so a locale
// file may contain partial items — e.g. only the translated fields of an object
// inside an array — and the untranslated fields still come from the base.
// Primitives from the override replace the base value.

type Plain = Record<string, unknown>;

function isPlainObject(value: unknown): value is Plain {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;

  // Arrays: merge element-by-element so partial translated items layer onto the
  // full base items (keeps ids/fields the translation didn't touch). Extra base
  // items with no override entry are kept as-is.
  if (Array.isArray(base) && Array.isArray(override)) {
    const length = Math.max(base.length, override.length);
    const merged: unknown[] = [];
    for (let i = 0; i < length; i += 1) {
      merged[i] = deepMerge(base[i], override[i]);
    }
    return merged as unknown as T;
  }

  // Mismatched shapes or primitives: the override (when present) wins outright.
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override as T;
  }

  const result: Plain = { ...base };
  for (const key of Object.keys(override)) {
    result[key] = deepMerge((base as Plain)[key], override[key]);
  }
  return result as T;
}
