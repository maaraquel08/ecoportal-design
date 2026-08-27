import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "cta";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg hover:bg-accent-hover",
  secondary:
    "border border-line bg-surface-raised text-fg shadow-raised hover:bg-surface",
  /* Drawn, not filled: the edge carries the button on a tinted or
   * photographic surface where a raised fill would look pasted on. */
  outline:
    "border border-line-strong bg-transparent text-fg hover:bg-surface",
  ghost: "text-fg hover:bg-surface",
  danger: "bg-danger text-danger-fg hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-md",
  md: "h-9 px-4 text-sm rounded-md",
  lg: "h-10 px-5 text-base rounded-lg",
  /* The primary action. This product is tablet- and mobile-first, so
   * the CTA is a fixed 48px touch target at every breakpoint, with a
   * 16px radius — the phone/kiosk button shape from the canvas. */
  cta: "h-12 px-5 text-base rounded-[1rem]",
};

export interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium select-none",
        "transition-colors duration-fast ease-out-quad",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
