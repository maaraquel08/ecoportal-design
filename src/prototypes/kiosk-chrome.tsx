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
          className={`h-1.25 flex-1 rounded-full ${
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

/**
 * The same three facts as StepHeader, collapsed into one horizontal
 * rail: back, the bars, and where you are.
 *
 * The briefing's question screen uses this instead of the stacked
 * header — a question and its options want the vertical room, and
 * three stacked rows of chrome were spending 90px to say what 40px
 * says here.
 */
export function StepRail({
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
    <div className="flex flex-none items-center gap-5.5">
      <BackButton size="lg" className="rounded-full" onClick={onBack} />
      <Stepper active={active} total={total} className="min-w-0 flex-1" />
      <span className="flex-none font-mono text-[13px] tracking-[0.1em] text-lane-fill uppercase">
        {label} · {active} of {total}
      </span>
    </div>
  );
}
