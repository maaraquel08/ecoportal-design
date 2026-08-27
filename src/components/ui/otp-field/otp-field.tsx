"use client";

import * as React from "react";
import { OTPField as BaseOTPField } from "@base-ui/react/otp-field";
import { cn } from "@/lib/cn";

export function OTPField({
  className,
  ...props
}: React.ComponentProps<typeof BaseOTPField.Root>) {
  return (
    <BaseOTPField.Root
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

export function OTPFieldInput({
  className,
  ...props
}: React.ComponentProps<typeof BaseOTPField.Input>) {
  return (
    <BaseOTPField.Input
      className={cn(
        "size-10 rounded-md border border-line bg-surface-raised text-center text-sm text-fg",
        "transition-colors duration-fast ease-out-quad",
        "placeholder:text-fg-subtle",
        "focus:bg-accent-tint focus:outline-2 focus:outline-offset-2 focus:outline-ring",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
