"use client";

import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "@/lib/cn";

function SliderRoot({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Root>) {
  return (
    <BaseSlider.Root
      className={cn("w-full data-disabled:opacity-50", className)}
      {...props}
    />
  );
}

function SliderControl({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Control>) {
  return (
    <BaseSlider.Control
      className={cn("flex w-full items-center py-2", className)}
      {...props}
    />
  );
}

function SliderTrack({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Track>) {
  return (
    <BaseSlider.Track
      className={cn("h-1.5 w-full rounded-full bg-line select-none", className)}
      {...props}
    />
  );
}

function SliderIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Indicator>) {
  return (
    <BaseSlider.Indicator
      className={cn("rounded-full bg-accent select-none", className)}
      {...props}
    />
  );
}

function SliderThumb({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Thumb>) {
  return (
    <BaseSlider.Thumb
      className={cn(
        "size-4 rounded-full bg-surface-raised shadow-raised outline outline-line-strong select-none",
        "focus-visible:outline-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}

/** Composed slider: root props in, full control/track/thumb anatomy out. */
export function Slider({
  children,
  ...props
}: React.ComponentProps<typeof BaseSlider.Root>) {
  return (
    <SliderRoot {...props}>
      {children}
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb aria-label="Value" />
        </SliderTrack>
      </SliderControl>
    </SliderRoot>
  );
}

export {
  SliderRoot,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
};
export const SliderLabel = BaseSlider.Label;
export const SliderValue = BaseSlider.Value;
