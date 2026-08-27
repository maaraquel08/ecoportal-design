"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "@/lib/cn";

export const ToastProvider = BaseToast.Provider;
export const useToastManager = BaseToast.useToastManager;
export const createToastManager = BaseToast.createToastManager;

/**
 * Toast manager plus `nudge`: fire-with-a-stable-id for toasts that
 * should NOT stack. If the toast is already on screen, no new toast is
 * appended — the existing one is updated in place (Base UI's add() is
 * an upsert that also refreshes the auto-dismiss timer) and replays a
 * scale pulse (see toast-nudge in globals.css) as a visual nudge.
 */
export function useToast() {
  const manager = BaseToast.useToastManager();

  const nudge = React.useCallback(
    (options: Parameters<typeof manager.add>[0] & { id: string }) => {
      const exists = manager.toasts.some((t) => t.id === options.id);
      manager.add(options);
      if (exists) {
        const el = document.querySelector<HTMLElement>(
          `[data-toast-id="${options.id}"]`,
        );
        if (el) {
          // remove → reflow → re-add so the animation replays
          el.classList.remove("toast-nudge");
          void el.offsetWidth;
          el.classList.add("toast-nudge");
        }
      }
      return options.id;
    },
    [manager],
  );

  return { ...manager, nudge };
}

// Toasts position absolutely inside the viewport (the stack owns layout).
export function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof BaseToast.Viewport>) {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport
        className={cn("fixed right-4 bottom-4 z-50 w-80", className)}
        {...props}
      />
    </BaseToast.Portal>
  );
}

/**
 * Sonner-style stacked toast (mechanics from Base UI's documented
 * recipe): older toasts peek out behind the frontmost one, scaled down
 * per --toast-index; hovering/focusing the viewport expands the stack
 * (data-expanded) using --toast-offset-y; swipe-to-dismiss exits toward
 * the swipe direction; toasts over the limit fade out (data-limited).
 */
export function Toast({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseToast.Root>) {
  return (
    <BaseToast.Root
      data-toast-id={props.toast.id}
      className={cn(
        "[--gap:0.75rem] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
        "absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] w-full origin-bottom select-none",
        "rounded-lg border border-line bg-surface-raised text-fg shadow-overlay",
        "h-(--height) data-expanded:h-(--toast-height)",
        "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
        "data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        // invisible bridge over the gap so hover doesn't drop between toasts
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-starting-style:[transform:translateY(150%)]",
        "data-ending-style:opacity-0 data-limited:opacity-0",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "[transition:transform_0.5s_var(--popup-ease),opacity_0.5s,height_0.15s] motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {/* content behind the frontmost toast fades out until expanded */}
      <BaseToast.Content className="relative overflow-hidden p-4 pr-8 transition-opacity duration-(--popup-open-dur) ease-(--popup-ease) data-behind:opacity-0 data-expanded:opacity-100 motion-reduce:transition-none">
        {children}
      </BaseToast.Content>
    </BaseToast.Root>
  );
}

export function ToastTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseToast.Title>) {
  return (
    <BaseToast.Title
      className={cn("text-sm font-medium text-fg", className)}
      {...props}
    />
  );
}

export function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseToast.Description>) {
  return (
    <BaseToast.Description
      className={cn("mt-1 text-sm text-fg-muted", className)}
      {...props}
    />
  );
}

export function ToastClose({
  className,
  ...props
}: React.ComponentProps<typeof BaseToast.Close>) {
  return (
    <BaseToast.Close
      className={cn(
        "absolute top-2 right-2 rounded-sm p-1 text-fg-subtle transition-colors duration-fast ease-out-quad hover:bg-surface hover:text-fg",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}
