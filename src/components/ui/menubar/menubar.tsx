"use client";

import * as React from "react";
import { Menubar as BaseMenubar } from "@base-ui/react/menubar";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { cn } from "@/lib/cn";

export function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenubar>) {
  return (
    <BaseMenubar
      className={cn(
        "flex items-center gap-1 rounded-lg border border-line bg-surface-raised p-1",
        className,
      )}
      {...props}
    />
  );
}

export const MenubarMenu = BaseMenu.Root;

export function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Trigger>) {
  return (
    <BaseMenu.Trigger
      className={cn(
        "flex items-center rounded-sm px-3 py-1.5 text-sm select-none outline-none",
        "hover:bg-surface data-popup-open:bg-surface",
        className,
      )}
      {...props}
    />
  );
}

export function MenubarContent({
  className,
  children,
  side = "bottom",
  align = "start",
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner side={side} align={align} sideOffset={8}>
        <BaseMenu.Popup
          className={cn(
            "min-w-40 rounded-lg border border-line bg-surface-raised py-1 text-fg shadow-overlay",
            "popup-motion",
            className,
          )}
          {...props}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export function MenubarItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Item>) {
  return (
    <BaseMenu.Item
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

export function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Separator>) {
  return (
    <BaseMenu.Separator
      className={cn("my-1 h-px bg-line", className)}
      {...props}
    />
  );
}

export const MenubarGroup = BaseMenu.Group;

export function MenubarGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.GroupLabel>) {
  return (
    <BaseMenu.GroupLabel
      className={cn(
        "px-3 py-1.5 text-xs font-medium text-fg-subtle",
        className,
      )}
      {...props}
    />
  );
}
