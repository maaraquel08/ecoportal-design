import * as React from "react";
import { Button } from "@/components/ui/button";

/**
 * The way back, top-left, on every kiosk screen that has one. Outline
 * rather than filled: leaving is never the primary action.
 *
 * `w-fit` matters — as a direct child of a flex column it would
 * otherwise stretch the full width of the screen.
 */
export function BackButton({
  children = "Back",
  onClick,
}: {
  children?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Button variant="outline" size="md" className="w-fit" onClick={onClick}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 5l-7 7 7 7" />
      </svg>
      {children}
    </Button>
  );
}
