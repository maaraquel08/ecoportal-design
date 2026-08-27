import * as React from "react";

/**
 * The kiosk on the glass: a fixed 1064 × 768 tablet, a 1.5px device
 * edge — the only heavier line in the system — and a 4px lane rail
 * under the status bar. Nothing inside names a colour; the lane at the
 * root does.
 *
 * The size is literal, never derived from content or the viewport, so
 * the screen is always shown at true tablet dimensions. Narrower
 * viewports scroll the frame horizontally rather than squashing it.
 */
export function KioskFrame({
  step,
  eyebrow,
  children,
}: {
  /** e.g. "Visitor · step 1 of 3" */
  step: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2.5">
      {eyebrow ? (
        <span className="font-mono text-[11px] tracking-[0.14em] text-fg-subtle uppercase">
          {eyebrow}
        </span>
      ) : null}
      <div className="w-full overflow-x-auto">
        {/* Hardware bezel, same treatment as the phone and the arrival
          * tablet. The glass inside stays exactly 1064 × 768. */}
        <div className="w-fit rounded-[40px] bg-[#0c0f0e] p-5 ring-2 ring-[#2c3230]">
        <div className="flex h-192 w-266 flex-none flex-col overflow-hidden rounded-[22px] bg-surface-raised">
          <div className="flex h-9 flex-none items-center justify-between px-6 font-mono text-[13px] text-fg-subtle">
            <span>9:41</span>
            <span>Rushcutters Tower</span>
          </div>
          <div className="h-1 flex-none bg-lane-base" />
          <div className="flex min-h-0 flex-1 flex-col gap-5 p-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="size-6 rounded-md bg-lane-base"
                  aria-hidden="true"
                />
                <span className="font-mono text-[13px] tracking-[0.14em] text-lane-fill uppercase">
                  {step}
                </span>
              </div>
              <span className="text-sm text-fg-subtle">Thu 11 Sept</span>
            </div>
            {children}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A drawn panel inside the frame — hairline, no shadow. */
export function KioskPanel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line p-5">
      <span className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}
