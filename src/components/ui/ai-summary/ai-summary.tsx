"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * AI Summary (AS1) — the banner that marks AI-authored copy.
 *
 * One visual treatment, many voices: the eyebrow names what the model was
 * doing ("THE VERDICT", "AI NOTE", "THIS WEEK", "YEAR IN ONE LINE") and the
 * body is a single plain-language sentence.
 *
 * Two layers make it read as alive, both from the `ai-wash` / `ai-pulse`
 * classes in the token layer: a static fill tinted with --ai-hue, and an
 * inner glow in the same hue breathing at the edge. --ai-hue comes from
 * --info, which the brand file owns — Ledger points it at the brand yellow.
 * Nothing here names a colour, so the banner rebrands and re-themes on its
 * own, and the pulse can never drift off-palette.
 */
export function AiSummary({
  className,
  active = true,
  ...props
}: React.ComponentProps<"div"> & {
  /** Pause the pulse — e.g. while a summary is stale or offline. */
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "ai-wash rounded-lg border px-4 py-[15px]",
        active && "ai-pulse",
        className,
      )}
      {...props}
    />
  );
}

/** Eyebrow row: sparkle plus the label that names the AI's angle. */
export function AiSummaryLabel({
  className,
  children,
  icon,
  ...props
}: React.ComponentProps<"div"> & {
  /** Replace the sparkle, or pass `null` to drop it. */
  icon?: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} {...props}>
      {icon === undefined ? <AiSummarySparkle /> : icon}
      <span className="font-mono text-[9.5px] font-semibold tracking-[0.14em] text-[var(--ai-hue-ink)] uppercase">
        {children}
      </span>
    </div>
  );
}

/** Body copy: one sentence, never a paragraph of hedging. */
export function AiSummaryText({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("mt-2.5 text-sm/[1.5] text-pretty text-fg", className)}
      {...props}
    />
  );
}

/** Four-point star in the AI hue, lightening across the diagonal. */
export function AiSummarySparkle({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  const gradientId = React.useId();

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-3 shrink-0 text-[var(--ai-hue-ink)]", className)}
      {...props}
    >
      <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="currentColor" />
        <stop
          offset="1"
          stopColor="color-mix(in oklab, currentColor 55%, var(--ai-hue))"
        />
      </linearGradient>
      <path
        d="M12 1.5 L13.9 9.4 L21.8 11.3 L13.9 13.2 L12 21.1 L10.1 13.2 L2.2 11.3 L10.1 9.4 Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}
