"use client";

import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { cn } from "@/lib/cn";

export const Select = BaseSelect.Root;
export const SelectValue = BaseSelect.Value;
export const SelectGroup = BaseSelect.Group;
export const SelectGroupLabel = BaseSelect.GroupLabel;

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger>) {
  return (
    <BaseSelect.Trigger
      className={cn(
        "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-line bg-surface-raised px-3 text-sm text-fg",
        "data-readonly:pointer-events-none data-readonly:bg-surface data-readonly:text-fg-muted",
        "transition-colors duration-fast ease-out-quad",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <SelectIcon />
    </BaseSelect.Trigger>
  );
}

function SelectIcon({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Icon>) {
  return (
    <BaseSelect.Icon
      className={cn("flex text-fg-muted", className)}
      {...props}
    >
      <svg viewBox="0 0 12 12" fill="none" className="size-3">
        <path
          d="M2.5 4.5L6 8L9.5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BaseSelect.Icon>
  );
}

export function SelectContent({
  className,
  children,
  side = "bottom",
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner side={side} sideOffset={8}>
        <BaseSelect.Popup
          className={cn(
            "max-h-72 min-w-[var(--anchor-width)] overflow-y-auto rounded-lg border border-line bg-surface-raised p-1 text-fg shadow-overlay",
            "popup-motion",
            className,
          )}
          {...props}
        >
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      className={cn(
        "flex cursor-default items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm/5 text-fg select-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <SelectItemIndicator />
    </BaseSelect.Item>
  );
}

function SelectItemIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.ItemIndicator>) {
  return (
    <BaseSelect.ItemIndicator
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
    </BaseSelect.ItemIndicator>
  );
}
