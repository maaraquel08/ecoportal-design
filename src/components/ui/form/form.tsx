"use client";

import * as React from "react";
import { Form as BaseForm } from "@base-ui/react/form";
import { cn } from "@/lib/cn";

export function Form({
  className,
  ...props
}: React.ComponentProps<typeof BaseForm>) {
  return (
    <BaseForm className={cn("flex flex-col gap-4", className)} {...props} />
  );
}
