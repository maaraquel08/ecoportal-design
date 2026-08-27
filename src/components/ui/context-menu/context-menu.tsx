"use client";

import * as React from "react";
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { cn } from "@/lib/cn";

export const ContextMenu = BaseContextMenu.Root;
export const ContextMenuTrigger = BaseContextMenu.Trigger;

export function ContextMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.Popup>) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner>
        <BaseContextMenu.Popup
          className={cn(
            "min-w-40 rounded-lg border border-line bg-surface-raised py-1 text-fg shadow-overlay",
            "popup-motion",
            className,
          )}
          {...props}
        >
          {children}
        </BaseContextMenu.Popup>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
}

export function ContextMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.Item>) {
  return (
    <BaseContextMenu.Item
      className={cn(
        "flex cursor-default items-center rounded-sm px-3 py-1.5 text-sm select-none outline-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function ContextMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.CheckboxItem>) {
  return (
    <BaseContextMenu.CheckboxItem
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-3 py-1.5 text-sm select-none outline-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <ContextMenuCheckboxItemIndicator />
      {children}
    </BaseContextMenu.CheckboxItem>
  );
}

export function ContextMenuCheckboxItemIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.CheckboxItemIndicator>) {
  return (
    <BaseContextMenu.CheckboxItemIndicator
      className={cn("flex size-4 items-center justify-center", className)}
      {...props}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="size-3.5"
        aria-hidden="true"
      >
        <path
          d="M3.5 8.5L6.5 11.5L12.5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BaseContextMenu.CheckboxItemIndicator>
  );
}

export const ContextMenuRadioGroup = BaseContextMenu.RadioGroup;

export function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.RadioItem>) {
  return (
    <BaseContextMenu.RadioItem
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-3 py-1.5 text-sm select-none outline-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <ContextMenuRadioItemIndicator />
      {children}
    </BaseContextMenu.RadioItem>
  );
}

export function ContextMenuRadioItemIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.RadioItemIndicator>) {
  return (
    <BaseContextMenu.RadioItemIndicator
      className={cn("flex size-4 items-center justify-center", className)}
      {...props}
    >
      <span className="size-1.5 rounded-full bg-fg" />
    </BaseContextMenu.RadioItemIndicator>
  );
}

export function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.Separator>) {
  return (
    <BaseContextMenu.Separator
      className={cn("my-1 h-px bg-line", className)}
      {...props}
    />
  );
}

export const ContextMenuGroup = BaseContextMenu.Group;

export function ContextMenuGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.GroupLabel>) {
  return (
    <BaseContextMenu.GroupLabel
      className={cn(
        "px-3 py-1.5 text-xs font-medium text-fg-subtle",
        className,
      )}
      {...props}
    />
  );
}

export const ContextMenuSubmenuRoot = BaseContextMenu.SubmenuRoot;

export function ContextMenuSubmenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.SubmenuTrigger>) {
  return (
    <BaseContextMenu.SubmenuTrigger
      className={cn(
        "flex cursor-default items-center justify-between rounded-sm px-3 py-1.5 text-sm select-none outline-none",
        "data-highlighted:bg-surface",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="size-3.5 text-fg-subtle"
        aria-hidden="true"
      >
        <path
          d="M6 3.5L10.5 8L6 12.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BaseContextMenu.SubmenuTrigger>
  );
}
