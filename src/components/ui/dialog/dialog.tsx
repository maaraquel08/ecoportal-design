"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "@/lib/cn";

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseDialog.Popup>) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 bg-black/40 transition-opacity duration-fast data-starting-style:opacity-0 data-ending-style:opacity-0" />
      <BaseDialog.Popup
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
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export const DialogTitle = BaseDialog.Title;
export const DialogDescription = BaseDialog.Description;
export const DialogClose = BaseDialog.Close;
