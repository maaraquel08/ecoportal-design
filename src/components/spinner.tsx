/**
 * Indeterminate progress for an action in flight. Inherits
 * currentColor, so it works inside any button variant.
 *
 * Motion is not the only cue — always pair it with a label change, so
 * the state is legible to a screen reader and to anyone who has asked
 * the OS for less motion.
 */
export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
