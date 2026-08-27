"use client";

import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cn } from "@/lib/cn";

export function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Root>) {
  return (
    <BaseAccordion.Root
      className={cn("overflow-hidden rounded-lg border border-line", className)}
      {...props}
    />
  );
}

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Item>) {
  return (
    <BaseAccordion.Item
      className={cn("border-b border-line last:border-b-0", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Header>
      <BaseAccordion.Trigger
        className={cn(
          "group flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-fg transition-colors duration-fast ease-out-quad hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
          className,
        )}
        {...props}
      >
        {children}
        {/* chevron flips scaleY(-1) instead of morphing its path — the
            flip passes through a flat line at the midpoint like a path
            morph but animates in every browser (CSS `d:` is Chromium-only) */}
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 shrink-0 text-fg-subtle transition-transform duration-(--acc-chevron) ease-(--acc-ease) group-data-panel-open:-scale-y-100 motion-reduce:transition-none"
        >
          <path d="M4 6.5L8 10.5L12 6.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export function AccordionPanel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Panel>) {
  return (
    <BaseAccordion.Panel
      className={cn(
        // Base UI measures the content into --accordion-panel-height;
        // entering/exiting states pin height to 0 so open/close tweens.
        "h-(--accordion-panel-height) overflow-hidden text-sm text-fg-muted",
        "transition-[height,opacity,filter] duration-(--acc-collapse) ease-(--acc-ease) data-open:duration-(--acc-expand)",
        "data-starting-style:h-0 data-starting-style:opacity-0 data-starting-style:blur-[2px]",
        "data-ending-style:h-0 data-ending-style:opacity-0 data-ending-style:blur-[2px]",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {/* padding lives on the inner element, never the measured panel —
          padding on the collapsing box leaves a residual height strip */}
      <div className="px-4 pb-3">{children}</div>
    </BaseAccordion.Panel>
  );
}
