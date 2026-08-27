"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "info" | "success" | "danger";

const tones: Record<Tone, string> = {
  /* A quiet note that carries no status — an explanation, not a state. */
  neutral: "border-line bg-surface",
  info: "border-info-line bg-info-tint",
  success: "border-success-line bg-success-tint",
  danger: "border-danger-line bg-danger-tint",
};

const marks: Record<Tone, string> = {
  neutral: "text-fg-subtle",
  info: "text-info",
  success: "text-success",
  danger: "text-danger",
};

/**
 * Filled marks: a solid disc in the tone's colour with the glyph
 * knocked out in the page ground, so it reads at a glance and matches
 * the filled badge a field error uses. `bg` rather than white, so the
 * knockout survives dark mode.
 */
function Mark({ tone }: { tone: Tone }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      {tone === "success" ? (
        <path
          d="M7.5 12.4l3.1 3.1 5.9-6.4"
          fill="none"
          className="stroke-bg"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : tone === "danger" ? (
        <>
          <path
            d="M12 7.2v6.4"
            fill="none"
            className="stroke-bg"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16.9" r="1.4" className="fill-bg" />
        </>
      ) : (
        <>
          <path
            d="M12 10.9v6"
            fill="none"
            className="stroke-bg"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="12" cy="7.4" r="1.4" className="fill-bg" />
        </>
      )}
    </svg>
  );
}

/**
 * A quiet status surface: an edge, a tint and a mark. Status roles are
 * lane-blind by contract, so a banner keeps its meaning whichever lane
 * the screen is in.
 *
 * Pass `icon={null}` to drop the mark, or a node to replace it.
 */
export function Banner({
  tone = "info",
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  tone?: Tone;
  icon?: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-4 py-3.5 text-sm text-fg-muted",
        tones[tone],
        className,
      )}
      {...props}
    >
      {icon === null ? null : (
        <span className={cn("mt-px flex-none", marks[tone])}>
          {icon === undefined ? <Mark tone={tone} /> : icon}
        </span>
      )}
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}
