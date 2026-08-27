"use client";

import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cn } from "@/lib/cn";

export const Combobox = BaseCombobox.Root;

export function ComboboxInput({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Input>) {
  return (
    <BaseCombobox.Input
      className={cn(
        "h-10 w-full rounded-md border border-line bg-surface-raised px-3 text-sm text-fg placeholder:text-fg-subtle",
        "transition-colors duration-fast ease-out-quad",
        "focus-visible:bg-accent-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxContent({
  className,
  children,
  side = "bottom",
  ...props
}: React.ComponentProps<typeof BaseCombobox.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner side={side} sideOffset={8}>
        <BaseCombobox.Popup
          className={cn(
            "max-h-72 min-w-[var(--anchor-width)] overflow-y-auto rounded-lg border border-line bg-surface-raised p-1 text-fg shadow-overlay",
            "popup-motion",
            className,
          )}
          {...props}
        >
          {children}
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

export function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.List>) {
  return <BaseCombobox.List className={cn("flex flex-col", className)} {...props} />;
}

export function ComboboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Item>) {
  return (
    <BaseCombobox.Item
      className={cn(
        "flex cursor-default items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm/5 text-fg select-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxItemIndicator />
    </BaseCombobox.Item>
  );
}

function ComboboxItemIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.ItemIndicator>) {
  return (
    <BaseCombobox.ItemIndicator
      className={cn("flex text-accent", className)}
      {...props}
    >
      <svg viewBox="0 0 12 10" fill="none" className="size-3.5">
        <path
          d="M1 5.5L4 8.5L11 1.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BaseCombobox.ItemIndicator>
  );
}

/**
 * Base UI keeps this element mounted whether or not the list is empty
 * — it is the popup's live region, and it warns against hiding it with
 * `display: none`, `hidden` or `aria-hidden`. So it stays in the DOM
 * and collapses instead: `empty:p-0` takes its padding away when it
 * has no message, which is the only thing giving it height.
 */
export function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Empty>) {
  return (
    <BaseCombobox.Empty
      className={cn(
        "px-3 py-2.5 text-sm/5 text-fg-subtle empty:p-0",
        className,
      )}
      {...props}
    />
  );
}
