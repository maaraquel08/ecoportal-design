import * as React from "react";

/**
 * Chrome shared by every contractor phone screen.
 *
 * Sign-up and pre-arrival are one tape now — the link in Dan's email
 * decides how long it is — so the progress bar, the step counter and
 * the footnote have to be one implementation rather than a copy in
 * each file. Everything here takes the step and the total, because
 * neither is a constant any more: a first-timer walks a longer tape
 * than a trade the site already knows.
 */

export function Mono({
  children,
  className = "text-fg-subtle",
  size = "text-xs",
}: {
  children: React.ReactNode;
  className?: string;
  size?: string;
}) {
  return (
    <span
      className={`font-mono ${size} tracking-[0.14em] uppercase ${className}`}
    >
      {children}
    </span>
  );
}

export function StepBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex h-1 flex-none overflow-hidden bg-line">
      <div
        className="bg-lane-base transition-[width] duration-fast ease-out-quad"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
  );
}

/** The counter on its own, for screens that build their own header row. */
export function StepCount({ step, total }: { step: number; total: number }) {
  return (
    <span className="font-mono text-xs text-fg-subtle">
      {step} / {total}
    </span>
  );
}

/** The site speaking: its mark, its name, and where you are. */
export function StepHeader({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2.5">
        <span className="size-6.5 rounded-md bg-lane-base" aria-hidden="true" />
        <span className="text-[15px] font-semibold">Rushcutters Tower</span>
      </span>
      <StepCount step={step} total={total} />
    </div>
  );
}

/** A titled step: what this is, where you are, and why it is asked. */
export function StepHeading({
  label,
  step,
  total,
  title,
  body,
}: {
  label: string;
  step: number;
  total: number;
  title: string;
  body: string;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <Mono className="text-lane-fill" size="text-[11px]">
          {label}
        </Mono>
        <StepCount step={step} total={total} />
      </div>
      <h2 className="mt-4 text-[27px] leading-[1.14] font-bold tracking-[-0.028em]">
        {title}
      </h2>
      <p className="mt-2 text-[15px] leading-normal text-fg-subtle">{body}</p>
    </>
  );
}

export function Footnote({ children }: { children: React.ReactNode }) {
  return <p className="text-center text-[13px] text-fg-subtle">{children}</p>;
}
