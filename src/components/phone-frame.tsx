import * as React from "react";

/**
 * A phone on the desk: 402 × 874 device, notch, status bar and home
 * indicator. The bezel is hardware, so it stays a fixed near-black
 * rather than a brand token; everything inside the glass is themed.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-100.5 max-w-full flex-none">
      {/* Fixed 402 × 874. Never derived from content, so a long screen
        * scrolls inside the glass instead of stretching the device. */}
      <div className="relative h-218.5 rounded-[58px] bg-[#0c0f0e] p-3 ring-2 ring-[#2c3230]">
        <div className="relative flex size-full flex-col overflow-hidden rounded-[46px] bg-surface-raised">
          <div className="absolute top-[9px] left-1/2 z-30 h-[30px] w-28 -translate-x-1/2 rounded-full bg-[#0c0f0e]" />

          <div className="relative z-20 flex h-13 flex-none items-end justify-between px-7 pb-1 text-sm font-semibold">
            <span>9:41</span>
            <span className="flex items-center gap-[7px]">
              <span className="flex items-end gap-0.5" aria-hidden="true">
                <span className="h-[5px] w-[3px] rounded-[1px] bg-fg" />
                <span className="h-2 w-[3px] rounded-[1px] bg-fg" />
                <span className="h-[11px] w-[3px] rounded-[1px] bg-fg" />
                <span className="h-[13px] w-[3px] rounded-[1px] bg-line-strong" />
              </span>
              <span
                className="flex h-[11px] w-[22px] items-center rounded-[3px] border-[1.5px] border-fg p-[1.5px]"
                aria-hidden="true"
              >
                <span className="h-full w-[13px] rounded-[1px] bg-fg" />
              </span>
            </span>
          </div>

          {children}

          <div className="flex h-[22px] flex-none items-center justify-center">
            <div className="h-[5px] w-[132px] rounded-full bg-fg/85" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * One screen inside the glass: a scrolling body and a pinned footer
 * that holds the primary action.
 */
export function PhoneScreen({
  children,
  footer,
  bodyClassName = "px-6 pt-4.5 pb-2",
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  bodyClassName?: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={`min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${bodyClassName}`}
      >
        {children}
      </div>
      {footer ? (
        <div className="flex flex-none flex-col gap-2.5 border-t border-line bg-surface-raised px-6 pt-3 pb-3.5">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
