/**
 * Read a duration token in milliseconds.
 *
 * Motion timings live in CSS (see styles/transitions.css) so the
 * stylesheet stays the single source of truth; anything in JS that has
 * to wait for an animation reads the same token rather than repeating
 * the number.
 */
export function cssMs(token: string, fallback: number) {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    token,
  );
  const value = parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}
