"use client";

import * as React from "react";
import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";
import { cn } from "@/lib/cn";

export const PreviewCard = BasePreviewCard.Root;
export const PreviewCardTrigger = BasePreviewCard.Trigger;

export function PreviewCardContent({
  className,
  children,
  side = "bottom",
  ...props
}: React.ComponentProps<typeof BasePreviewCard.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <BasePreviewCard.Portal>
      <BasePreviewCard.Positioner side={side} sideOffset={8}>
        <BasePreviewCard.Popup
          className={cn(
            "w-72 rounded-lg border border-line bg-surface-raised p-4 text-fg shadow-overlay",
            "popup-motion",
            className,
          )}
          {...props}
        >
          {children}
        </BasePreviewCard.Popup>
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  );
}
