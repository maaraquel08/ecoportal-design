"use client";

import * as React from "react";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import { cn } from "@/lib/cn";

export function Fieldset({
  className,
  ...props
}: React.ComponentProps<typeof BaseFieldset.Root>) {
  return (
    <BaseFieldset.Root
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-line p-4",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function FieldsetLegend({
  className,
  ...props
}: React.ComponentProps<typeof BaseFieldset.Legend>) {
  return (
    <BaseFieldset.Legend
      className={cn("px-1 text-sm font-semibold text-fg", className)}
      {...props}
    />
  );
}
