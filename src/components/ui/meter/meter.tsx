"use client";

import * as React from "react";
import { Meter as BaseMeter } from "@base-ui/react/meter";
import { cn } from "@/lib/cn";

export function Meter({
  className,
  ...props
}: React.ComponentProps<typeof BaseMeter.Root>) {
  return (
    <BaseMeter.Root className={cn("flex flex-col gap-1.5", className)} {...props} />
  );
}

export function MeterTrack({
  className,
  ...props
}: React.ComponentProps<typeof BaseMeter.Track>) {
  return (
    <BaseMeter.Track
      className={cn(
        "h-2 w-full overflow-hidden rounded-sm bg-surface",
        className,
      )}
      {...props}
    />
  );
}

export function MeterIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseMeter.Indicator>) {
  return (
    <BaseMeter.Indicator
      className={cn(
        "h-full rounded-sm bg-accent transition-[width] duration-fast ease-out-quad",
        className,
      )}
      {...props}
    />
  );
}

export function MeterLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseMeter.Label>) {
  return (
    <BaseMeter.Label
      className={cn("text-sm font-medium text-fg", className)}
      {...props}
    />
  );
}

export function MeterValue({
  className,
  ...props
}: React.ComponentProps<typeof BaseMeter.Value>) {
  return (
    <BaseMeter.Value
      className={cn("text-sm text-fg-muted", className)}
      {...props}
    />
  );
}
