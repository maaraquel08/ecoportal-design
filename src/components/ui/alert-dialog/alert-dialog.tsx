"use client";

import * as React from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { cn } from "@/lib/cn";

export const AlertDialog = BaseAlertDialog.Root;
export const AlertDialogTrigger = BaseAlertDialog.Trigger;

// AlertDialog is always modal and never dismisses on backdrop/outside press
// (enforced by Base UI itself — see AlertDialogRootProps, which omits `modal`
// and `disablePointerDismissal` from DialogRoot's props).
export function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Popup>) {
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop className="fixed inset-0 bg-black/40 transition-opacity duration-fast data-starting-style:opacity-0 data-ending-style:opacity-0" />
      <BaseAlertDialog.Popup
        className={cn(
          "fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-surface-raised p-6 text-fg shadow-overlay",
          "transition-[opacity,transform] duration-fast ease-out-quad",
          "data-starting-style:scale-95 data-starting-style:opacity-0",
          "data-ending-style:scale-95 data-ending-style:opacity-0",
          className,
        )}
        {...props}
      >
        {children}
      </BaseAlertDialog.Popup>
    </BaseAlertDialog.Portal>
  );
}

export const AlertDialogTitle = BaseAlertDialog.Title;
export const AlertDialogDescription = BaseAlertDialog.Description;
export const AlertDialogClose = BaseAlertDialog.Close;
