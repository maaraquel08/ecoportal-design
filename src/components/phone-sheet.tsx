import * as React from "react";
import { Separator } from "@/components/ui/separator";

/**
 * A bottom sheet inside the phone's glass.
 *
 * Deliberately not the design system's Drawer: that portals to
 * `document.body`, which on a device mock would dim the whole browser
 * page instead of the phone. This positions against the screen it
 * belongs to.
 *
 * It stays mounted and animates on `open`, so the exit is as animated
 * as the entrance without an unmount timer.
 */
export function PhoneSheet({
  open,
  title,
  onClose,
  footer,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 z-20 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-fg/25 transition-opacity duration-fast ease-out-quad ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* The offset on three sides is what makes it read as floating
        * rather than welded to the bottom edge. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute inset-x-3 bottom-3 overflow-hidden rounded-[28px] bg-surface-raised transition-transform duration-fast ease-out-quad ${
          open ? "translate-y-0" : "translate-y-[calc(100%+0.75rem)]"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
          <h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3>
          <button
            type="button"
            tabIndex={open ? 0 : -1}
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="flex size-8 flex-none items-center justify-center rounded-full bg-surface text-fg-muted transition-colors duration-fast ease-out-quad hover:bg-line hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <Separator />

        <div className="px-5 py-4">{children}</div>

        {footer ? <div className="px-5 pb-5">{footer}</div> : null}
      </div>
    </div>
  );
}

/** One choosable row: label, supporting line, and a tick on the right. */
export function SheetOption({
  title,
  body,
  selected,
  onSelect,
  disabled,
}: {
  title: string;
  body?: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      /* A sheet lives inside a form on some screens. Without this the
       * browser submits it and the flow jumps a step. */
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className="flex w-full items-center gap-3.5 rounded-lg px-1 py-3 text-left transition-colors duration-fast ease-out-quad focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold tracking-[-0.01em]">
          {title}
        </span>
        {body ? (
          <span className="mt-0.5 block text-sm text-fg-subtle">{body}</span>
        ) : null}
      </span>

      <span
        className={`flex size-6 flex-none items-center justify-center rounded-full border-2 transition-colors duration-fast ease-out-quad ${
          selected
            ? "border-lane-base bg-lane-base text-accent-fg"
            : "border-line-strong"
        }`}
      >
        {selected ? (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}
