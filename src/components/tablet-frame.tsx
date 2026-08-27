import * as React from "react";

/**
 * The lobby tablet: a fixed 1064 × 768 screen inside a hardware
 * bezel. Unlike KioskFrame this is the bare device, with no lane rail
 * or step row, so each screen owns its own chrome.
 *
 * The size is literal, never derived from content or the viewport.
 * Narrower viewports scroll the frame horizontally rather than
 * squashing it out of true tablet proportions.
 */
export function TabletFrame({
  kiosk = "KIOSK 3",
  time = "04:24PM",
  children,
}: {
  kiosk?: string;
  time?: string;
  children: React.ReactNode;
}) {
  return (
    /* The device is wider than most content columns, so it owns the
     * full width and scrolls itself. `mx-auto w-fit` centres it when
     * there is room and collapses to zero margin when there is not,
     * which keeps the left edge reachable while scrolling. */
    <div className="w-full overflow-x-auto">
      <div className="mx-auto w-fit px-6 py-1">
        {/* Hardware bezel, same treatment as the phone: a fixed
          * near-black rather than a brand token. The glass inside
          * stays exactly 1064 × 768. */}
        <div className="rounded-[40px] bg-[#0c0f0e] p-5 ring-2 ring-[#2c3230]">
          <div className="flex h-192 w-266 flex-none flex-col overflow-hidden rounded-[22px] bg-bg">
            <div className="flex flex-none items-center justify-between px-7.5 pt-4.5 text-sm text-fg-subtle">
              <span>{time}</span>
              <span className="text-[13px] font-semibold tracking-[0.06em] text-fg-muted">
                {kiosk}
              </span>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** The centred 660px reading column every tablet screen sits in. */
export function TabletColumn({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 justify-center px-7.5 pt-6.5 pb-7.5">
      <div className="flex w-165 flex-col">{children}</div>
    </div>
  );
}
