"use client";

import * as React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { cn } from "@/lib/cn";

export function NumberField({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Root>) {
  return (
    <BaseNumberField.Root className={cn("flex flex-col gap-1.5", className)} {...props} />
  );
}

export function NumberFieldGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Group>) {
  return (
    <BaseNumberField.Group
      className={cn(
        "flex items-stretch overflow-hidden rounded-md border border-line bg-surface-raised",
        "data-readonly:pointer-events-none data-readonly:bg-surface",
        "transition-colors duration-fast ease-out-quad",
        "focus-within:bg-accent-tint focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function NumberFieldInput({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Input>) {
  return (
    <BaseNumberField.Input
      className={cn(
        "h-10 w-full min-w-0 flex-1 bg-transparent px-3 text-sm text-fg outline-none",
        "read-only:pointer-events-none read-only:text-fg-muted read-only:focus:outline-none",
        "placeholder:text-fg-subtle",
        className,
      )}
      {...props}
    />
  );
}

export function NumberFieldIncrement({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Increment>) {
  return (
    <BaseNumberField.Increment
      className={cn(
        "flex w-8 items-center justify-center border-l border-line text-fg-muted",
        "transition-colors duration-fast ease-out-quad hover:bg-surface hover:text-fg",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function NumberFieldDecrement({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Decrement>) {
  return (
    <BaseNumberField.Decrement
      className={cn(
        "flex w-8 items-center justify-center border-r border-line text-fg-muted",
        "transition-colors duration-fast ease-out-quad hover:bg-surface hover:text-fg",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function NumberFieldScrubArea({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.ScrubArea>) {
  return (
    <BaseNumberField.ScrubArea
      className={cn("cursor-ew-resize select-none", className)}
      {...props}
    />
  );
}
