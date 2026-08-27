"use client";

import * as React from "react";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { cn } from "@/lib/cn";

export function CheckboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseCheckboxGroup>) {
  return (
    <BaseCheckboxGroup
      className={cn(
        "flex flex-col gap-2 data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
