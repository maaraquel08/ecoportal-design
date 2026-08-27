"use client";

import * as React from "react";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { cn } from "@/lib/cn";

export const Collapsible = BaseCollapsible.Root;

export function CollapsibleTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Trigger>) {
  return (
    <BaseCollapsible.Trigger
      className={cn(
        "flex w-full items-center justify-between rounded-md border border-line bg-surface-raised px-3 py-2 text-left text-sm font-medium text-fg transition-colors duration-fast ease-out-quad hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}

export function CollapsiblePanel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden text-sm text-fg-muted transition-[height] duration-fast ease-out-quad",
        className,
      )}
      {...props}
    >
      <div className="px-3 pt-2 pb-3">{children}</div>
    </BaseCollapsible.Panel>
  );
}
