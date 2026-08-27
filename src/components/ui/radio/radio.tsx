"use client";

import * as React from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { cn } from "@/lib/cn";

export function Radio({
  className,
  ...props
}: React.ComponentProps<typeof BaseRadio.Root>) {
  return (
    <BaseRadio.Root
      className={cn(
        "flex size-5 items-center justify-center rounded-full border border-line-strong bg-surface-raised transition-colors duration-fast ease-out-quad",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-checked:border-accent",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseRadio.Indicator className="size-2.5 rounded-full bg-accent data-unchecked:hidden" />
    </BaseRadio.Root>
  );
}
