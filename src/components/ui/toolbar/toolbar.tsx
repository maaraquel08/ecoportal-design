"use client";

import * as React from "react";
import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import { cn } from "@/lib/cn";

export function Toolbar({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Root>) {
  return (
    <BaseToolbar.Root
      className={cn(
        "flex items-center gap-1 rounded-lg border border-line bg-surface-raised p-1 shadow-raised",
        className,
      )}
      {...props}
    />
  );
}

export function ToolbarButton({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Button>) {
  return (
    <BaseToolbar.Button
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-fg transition-colors duration-fast ease-out-quad hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function ToolbarLink({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Link>) {
  return (
    <BaseToolbar.Link
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-fg transition-colors duration-fast ease-out-quad hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}

export function ToolbarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Separator>) {
  return (
    <BaseToolbar.Separator
      className={cn("mx-1 w-px self-stretch bg-line", className)}
      {...props}
    />
  );
}

export function ToolbarGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Group>) {
  return (
    <BaseToolbar.Group className={cn("flex items-center gap-1", className)} {...props} />
  );
}

export function ToolbarInput({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Input>) {
  return (
    <BaseToolbar.Input
      className={cn(
        "h-8 rounded-md border border-line bg-surface px-2 text-sm text-fg outline-none focus-visible:outline-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}
