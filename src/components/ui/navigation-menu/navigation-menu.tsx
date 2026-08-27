"use client";

import * as React from "react";
import { NavigationMenu as BaseNavigationMenu } from "@base-ui/react/navigation-menu";
import { cn } from "@/lib/cn";

export function NavigationMenu({
  className,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenu.Root>) {
  return (
    <BaseNavigationMenu.Root
      className={cn("relative flex", className)}
      {...props}
    />
  );
}

export function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenu.List>) {
  return (
    <BaseNavigationMenu.List
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

export const NavigationMenuItem = BaseNavigationMenu.Item;

export function NavigationMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenu.Trigger>) {
  return (
    <BaseNavigationMenu.Trigger
      className={cn(
        "flex items-center gap-1 rounded-sm px-3 py-1.5 text-sm text-fg select-none outline-none",
        "hover:bg-surface data-popup-open:bg-surface",
        className,
      )}
      {...props}
    />
  );
}

export function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenu.Link>) {
  return (
    <BaseNavigationMenu.Link
      className={cn(
        "flex items-center gap-1 rounded-sm px-3 py-1.5 text-sm text-fg select-none outline-none",
        "hover:bg-surface data-active:bg-surface",
        className,
      )}
      {...props}
    />
  );
}

export function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenu.Content>) {
  return (
    <BaseNavigationMenu.Content
      className={cn("min-w-40 p-4 text-fg", className)}
      {...props}
    />
  );
}

/**
 * Renders the Portal > Positioner > Popup > Viewport chrome that displays
 * whichever item's content is currently active. Mount once, after the List.
 */
export function NavigationMenuViewport({
  className,
  side = "bottom",
  align = "start",
  ...props
}: React.ComponentProps<typeof BaseNavigationMenu.Viewport> & {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}) {
  return (
    <BaseNavigationMenu.Portal>
      <BaseNavigationMenu.Positioner side={side} align={align} sideOffset={8}>
        <BaseNavigationMenu.Popup
          className={cn(
            "rounded-lg border border-line bg-surface-raised shadow-overlay",
            "popup-motion",
          )}
        >
          <BaseNavigationMenu.Viewport
            className={cn("relative overflow-hidden", className)}
            {...props}
          />
        </BaseNavigationMenu.Popup>
      </BaseNavigationMenu.Positioner>
    </BaseNavigationMenu.Portal>
  );
}
