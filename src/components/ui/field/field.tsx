"use client";

import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { cn } from "@/lib/cn";

export function Field({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Root>) {
  return (
    <BaseField.Root
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

export function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Label>) {
  return (
    <BaseField.Label
      className={cn(
        "text-sm font-medium text-fg",
        "data-invalid:text-danger",
        "data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Description>) {
  return (
    <BaseField.Description
      /* An error replaces the hint rather than stacking under it. */
      className={cn("text-sm text-fg-subtle data-invalid:hidden", className)}
      {...props}
    />
  );
}

export function FieldError({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Error>) {
  return (
    <BaseField.Error
      className={cn(
        "flex items-start gap-1.5 text-sm text-danger",
        // Alert badge: a filled circle carrying "!", drawn not imported.
        "before:mt-px before:flex before:size-[15px] before:flex-none",
        "before:items-center before:justify-center before:rounded-full",
        "before:bg-danger-line before:text-[11px] before:font-bold",
        "before:text-danger-fg before:content-['!']",
        className,
      )}
      {...props}
    />
  );
}

export function FieldControl({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Control>) {
  return (
    <BaseField.Control
      className={cn(
        // t-input is the transitions.dev shake hook: this element owns
        // the visible border, so it is the one that shakes.
        "t-input h-10 w-full rounded-md border border-line bg-surface-raised px-3 text-sm text-fg",
        "transition-colors duration-fast ease-out-quad",
        "placeholder:text-fg-subtle",
        "focus:bg-accent-tint focus:outline-2 focus:outline-offset-2 focus:outline-ring",
        // Read-only is not disabled: the value still matters, it just is
        // not yours to change. Grey ground, muted ink, full opacity.
        "read-only:pointer-events-none read-only:bg-surface read-only:text-fg-muted",
        "read-only:focus:bg-surface read-only:focus:outline-none",
        // Invalid wins over focus: the compound selector outranks `focus:`.
        "data-invalid:border-[1.5px] data-invalid:border-danger-line data-invalid:bg-danger-tint",
        "data-invalid:focus:bg-danger-tint data-invalid:focus:outline-danger-line",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
