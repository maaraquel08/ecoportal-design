"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { cn } from "@/lib/cn";

export function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof BaseCheckbox.Root>) {
  return (
    <BaseCheckbox.Root
      className={cn(
        "flex size-5 items-center justify-center rounded-sm border border-line-strong bg-surface-raised transition-colors duration-fast ease-out-quad",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-checked:border-accent data-checked:bg-accent data-indeterminate:border-accent data-indeterminate:bg-accent",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="text-accent-fg data-unchecked:hidden">
        <svg viewBox="0 0 12 10" fill="none" className="size-3">
          <path
            d="M1 5.5L4 8.5L11 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
