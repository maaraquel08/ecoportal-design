import { BackButton } from "@/components/back-button";

/**
 * Step chrome for a form on the glass: back, a bar per step, then the
 * step's name and its place in the count.
 *
 * Shared because the visitor's three screens and a contractor's
 * sign-on are the same shape at different lengths — the only thing
 * that differs is how many bars there are.
 */

/** The phone flow's stepper, at tablet scale. */
export function Stepper({
  active,
  total,
  className = "",
}: {
  active: number;
  total: number;
  className?: string;
}) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          className={`h-1 flex-1 rounded-full ${
            active >= n ? "bg-lane-base" : "bg-lane-soft"
          }`}
        />
      ))}
    </div>
  );
}

export function StepHeader({
  label,
  active,
  total,
  onBack,
}: {
  label: string;
  active: number;
  total: number;
  onBack: () => void;
}) {
  return (
    <>
      <BackButton onClick={onBack} />
      <Stepper active={active} total={total} className="mt-5" />
      <div className="mt-2.5 flex items-baseline justify-between">
        <span className="font-mono text-[13px] tracking-[0.14em] text-lane-base uppercase">
          {label}
        </span>
        <span className="font-mono text-[13px] text-lane-base">
          {active} of {total}
        </span>
      </div>
    </>
  );
}
