import * as React from "react";
import { cssMs } from "@/lib/motion";
import { QrIcon } from "@/prototypes/kiosk-icons";

/** How long the reader waits before reading the code by itself. */
const SCAN_AUTO_DELAY = 2000;

/**
 * A reader that does not wait to be tapped: two seconds after the
 * screen appears it reads the code by itself, so a walkthrough moves
 * on whether or not anyone touches the glass. Tapping reads it early —
 * both paths fire the same capture burst.
 */
export function useAutoScan(active: boolean, onRead: () => void) {
  const [capturing, setCapturing] = React.useState(false);
  const fired = React.useRef(false);

  React.useEffect(() => {
    if (!active) {
      fired.current = false;
      setCapturing(false);
      return;
    }
    const timer = window.setTimeout(() => {
      if (fired.current) return;
      fired.current = true;
      setCapturing(true);
    }, SCAN_AUTO_DELAY);
    return () => window.clearTimeout(timer);
  }, [active]);

  /* Advance once the burst has played out. */
  React.useEffect(() => {
    if (!capturing) return;
    const timer = window.setTimeout(onRead, cssMs("--capture-flash-dur", 500));
    return () => window.clearTimeout(timer);
  }, [capturing, onRead]);

  const readNow = () => {
    if (fired.current) return;
    fired.current = true;
    setCapturing(true);
  };

  return { capturing, readNow };
}

const CORNERS = [
  "top-6 left-6 border-t-3 border-l-3 rounded-tl-xl",
  "top-6 right-6 border-t-3 border-r-3 rounded-tr-xl",
  "bottom-6 left-6 border-b-3 border-l-3 rounded-bl-xl",
  "bottom-6 right-6 border-b-3 border-r-3 rounded-br-xl",
] as const;

/**
 * The viewfinder: drawn brackets, no photographic chrome. Wears the
 * lane, so the same panel reads as arrival on the way in and as the
 * exit on the way out.
 */
export function ScanPanel({
  capturing,
  onRead,
}: {
  capturing: boolean;
  onRead: () => void;
}) {
  return (
    <button
      onClick={onRead}
      aria-label="Read the code now"
      className={`relative flex size-84 flex-none items-center justify-center overflow-hidden rounded-[32px] bg-lane-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
        capturing ? "t-capture-dip" : ""
      }`}
    >
      {CORNERS.map((corner) => (
        <span
          key={corner}
          className={`absolute size-12 border-lane-base ${corner}`}
        />
      ))}
      <span className="flex size-38 items-center justify-center rounded-[20px] bg-surface-raised">
        <QrIcon size={88} className="text-lane-base" />
      </span>

      {/* Keyed so a repeat visit replays the burst from the top. */}
      {capturing ? (
        <span
          key="flash"
          className="t-capture-flash pointer-events-none absolute inset-0 bg-white"
        />
      ) : null}
    </button>
  );
}
