import * as React from "react";
import { cssMs } from "@/lib/motion";

/**
 * Drag-to-dock for a floating panel.
 *
 * The panel is free while the pointer is down. On release it sticks to
 * whichever viewport **side** it ended up closest to, keeping its
 * position *along* that side — drop it two thirds of the way down the
 * right edge and it stays two thirds of the way down, rather than
 * jumping to a corner.
 *
 * The position along the side is stored as a 0–1 ratio of the
 * available run, so it survives a window resize, and the whole dock is
 * remembered between sessions.
 */
export const SIDES = ["left", "right", "top", "bottom"] as const;

export type Side = (typeof SIDES)[number];

export type Dock = { side: Side; ratio: number };

/** Gap between the panel and the viewport edge. */
const MARGIN = 24;

const STORAGE_KEY = "deck-dock";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

type Size = { width: number; height: number };
type Viewport = { width: number; height: number };

/** The run the panel can travel along each axis, in px. */
function bounds(size: Size, viewport: Viewport) {
  const maxLeft = Math.max(MARGIN, viewport.width - size.width - MARGIN);
  const maxTop = Math.max(MARGIN, viewport.height - size.height - MARGIN);
  return {
    maxLeft,
    maxTop,
    spanX: Math.max(0, maxLeft - MARGIN),
    spanY: Math.max(0, maxTop - MARGIN),
  };
}

function dockedPosition(dock: Dock, size: Size, viewport: Viewport) {
  const { maxLeft, maxTop, spanX, spanY } = bounds(size, viewport);
  switch (dock.side) {
    case "left":
      return { left: MARGIN, top: MARGIN + spanY * dock.ratio };
    case "right":
      return { left: maxLeft, top: MARGIN + spanY * dock.ratio };
    case "top":
      return { left: MARGIN + spanX * dock.ratio, top: MARGIN };
    case "bottom":
      return { left: MARGIN + spanX * dock.ratio, top: maxTop };
  }
}

/**
 * The closest side to where the panel was dropped, plus how far along
 * that side it sits. Only the perpendicular axis snaps.
 */
function resolveDrop(rect: DOMRect, viewport: Viewport): Dock {
  const gaps: Record<Side, number> = {
    left: rect.left - MARGIN,
    right: viewport.width - MARGIN - rect.right,
    top: rect.top - MARGIN,
    bottom: viewport.height - MARGIN - rect.bottom,
  };

  let side: Side = "right";
  let smallest = Infinity;
  for (const candidate of SIDES) {
    if (gaps[candidate] < smallest) {
      smallest = gaps[candidate];
      side = candidate;
    }
  }

  const { spanX, spanY } = bounds(
    { width: rect.width, height: rect.height },
    viewport,
  );
  const ratio =
    side === "left" || side === "right"
      ? spanY === 0
        ? 0
        : clamp((rect.top - MARGIN) / spanY, 0, 1)
      : spanX === 0
        ? 0
        : clamp((rect.left - MARGIN) / spanX, 0, 1);

  return { side, ratio };
}

function readStored(fallback: Dock): Dock {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Dock;
    if (!SIDES.includes(parsed.side)) return fallback;
    if (typeof parsed.ratio !== "number" || Number.isNaN(parsed.ratio)) {
      return fallback;
    }
    return { side: parsed.side, ratio: clamp(parsed.ratio, 0, 1) };
  } catch {
    return fallback;
  }
}

export function useDockAnchor(initial: Dock = { side: "right", ratio: 1 }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [dock, setDock] = React.useState<Dock>(initial);
  const [drag, setDrag] = React.useState<{ left: number; top: number } | null>(
    null,
  );
  const [settling, setSettling] = React.useState(false);
  const [size, setSize] = React.useState<Size | null>(null);
  const [viewport, setViewport] = React.useState<Viewport | null>(null);

  const offset = React.useRef({ x: 0, y: 0 });
  const settleTimer = React.useRef<number | null>(null);

  const clearSettle = () => {
    if (settleTimer.current !== null) {
      window.clearTimeout(settleTimer.current);
      settleTimer.current = null;
    }
  };

  React.useEffect(() => clearSettle, []);

  React.useEffect(() => setDock((current) => readStored(current)), []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dock));
    } catch {
      /* private mode — the dock just won't persist */
    }
  }, [dock]);

  // The docked position depends on both the panel's size and the
  // viewport's, so track each and recompute when either changes.
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const update = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const resting =
    size && viewport ? dockedPosition(dock, size, viewport) : null;

  const settle = (next: Dock) => {
    setDock(next);
    setSettling(true);
    clearSettle();
    settleTimer.current = window.setTimeout(() => {
      settleTimer.current = null;
      setSettling(false);
    }, cssMs("--dock-settle-dur", 250) + 20);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    // The grip is a button but is also the primary drag handle; every
    // other control inside the panel keeps its own behaviour.
    if (!target.closest("[data-grip]") && target.closest("button, a, input")) {
      return;
    }
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    // Picking it up mid-settle takes over from wherever it has got to.
    clearSettle();
    setSettling(false);
    offset.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setDrag({ left: rect.left, top: rect.top });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setDrag({
      left: clamp(
        event.clientX - offset.current.x,
        12,
        window.innerWidth - rect.width - 12,
      ),
      top: clamp(
        event.clientY - offset.current.y,
        12,
        window.innerHeight - rect.height - 12,
      ),
    });
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (!drag) return;

    const rect = ref.current?.getBoundingClientRect();
    setDrag(null);
    if (!rect) return;

    settle(
      resolveDrop(rect, {
        width: window.innerWidth,
        height: window.innerHeight,
      }),
    );
  };

  /** Keyboard path: step through the sides, keeping the run position. */
  const cycleSide = () => {
    setDrag(null);
    settle({
      side: SIDES[(SIDES.indexOf(dock.side) + 1) % SIDES.length],
      ratio: dock.ratio,
    });
  };

  return {
    ref,
    dock,
    dragging: drag !== null,
    settling,
    cycleSide,
    /** Inline once measured; a corner class covers the first paint. */
    positionClass: drag || resting ? "" : "bottom-6 right-6",
    positionStyle: drag ?? resting ?? undefined,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
