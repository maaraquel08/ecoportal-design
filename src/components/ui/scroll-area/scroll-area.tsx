"use client";

import * as React from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { cn } from "@/lib/cn";

export function ScrollArea({
  className,
  ...props
}: React.ComponentProps<typeof BaseScrollArea.Root>) {
  return (
    <BaseScrollArea.Root
      className={cn("relative overflow-hidden", className)}
      {...props}
    />
  );
}

export function ScrollAreaViewport({
  className,
  ...props
}: React.ComponentProps<typeof BaseScrollArea.Viewport>) {
  return (
    <BaseScrollArea.Viewport
      className={cn("size-full overscroll-contain", className)}
      {...props}
    />
  );
}

export function ScrollAreaScrollbar({
  className,
  ...props
}: React.ComponentProps<typeof BaseScrollArea.Scrollbar>) {
  return (
    <BaseScrollArea.Scrollbar
      className={cn(
        "flex touch-none select-none p-0.5 transition-opacity duration-fast ease-out-quad",
        "data-[orientation=vertical]:w-2.5",
        "data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

export function ScrollAreaThumb({
  className,
  ...props
}: React.ComponentProps<typeof BaseScrollArea.Thumb>) {
  return (
    <BaseScrollArea.Thumb
      className={cn(
        "flex-1 rounded-sm bg-line-strong",
        className,
      )}
      {...props}
    />
  );
}

export const ScrollAreaContent = BaseScrollArea.Content;
export const ScrollAreaCorner = BaseScrollArea.Corner;
