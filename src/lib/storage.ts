const PREFIX = "radiogram.web.";

export const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(`${PREFIX}${key}`);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const writeStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Playback still works when storage is unavailable or full.
  }
};

type CacheEntry<T> = { savedAt: number; value: T };

export const readCache = <T>(key: string, maxAgeMs: number): T | undefined => {
  const entry = readStorage<CacheEntry<T> | null>(`cache.${key}`, null);
  if (!entry) return undefined;
  if (Date.now() - entry.savedAt > maxAgeMs) {
    try { localStorage.removeItem(`${PREFIX}cache.${key}`); } catch { /* Storage is optional. */ }
    return undefined;
  }
  return entry.value;
};

export const writeCache = <T>(key: string, value: T) => {
  const savedAt = Date.now();
  const index = readStorage<Array<{ key: string; savedAt: number }>>("cache.index", [])
    .filter((item) => item.key !== key)
    .concat({ key, savedAt })
    .sort((left, right) => right.savedAt - left.savedAt);
  const kept = index.slice(0, 10);
  for (const expired of index.slice(10)) {
    try { localStorage.removeItem(`${PREFIX}cache.${expired.key}`); } catch { /* Storage is optional. */ }
  }
  writeStorage(`cache.${key}`, { savedAt, value } satisfies CacheEntry<T>);
  writeStorage("cache.index", kept);
};
