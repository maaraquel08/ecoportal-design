import * as React from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { useDockAnchor } from "@/components/use-dock-anchor";

function GripIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true">
      {[3, 8, 13].map((y) =>
        [2, 8].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.35" fill="currentColor" />
        )),
      )}
    </svg>
  );
}

/**
 * The prototype's control surface: scenario tabs on top, and — when a
 * scenario is playable — the step player beneath a hairline.
 *
 * It floats over the prototype, so it is draggable: pick it up
 * anywhere that isn't a control and on release it sticks to whichever
 * viewport edge it is closest to, holding its position along that
 * edge. The grip also cycles edges on click, which gives keyboard
 * users the same escape route.
 */
export function ControlDeck({
  tabs,
  player,
}: {
  tabs: React.ReactNode;
  player?: React.ReactNode;
}) {
  const {
    ref,
    dragging,
    settling,
    cycleSide,
    positionClass,
    positionStyle,
    handlers,
  } = useDockAnchor();

  return (
    <div
      ref={ref}
      style={positionStyle}
      {...handlers}
      className={`fixed z-40 w-fit max-w-[calc(100%-3rem)] touch-none select-none ${positionClass} ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      } ${
        /* Only the drop is tweened; the drag itself must track the
         * pointer with no lag. */
        settling
          ? "transition-[left,top] duration-(--dock-settle-dur) ease-(--dock-settle-ease)"
          : ""
      }`}
    >
      <div
        className={`overflow-hidden rounded-xl border border-line bg-surface-raised/95 backdrop-blur-sm ${
          dragging ? "ring-2 ring-ring" : ""
        }`}
      >
        <div className="flex items-center gap-0.5 p-1.5">
          <Tooltip content="Drag to dock to any edge · click to cycle sides">
            <button
              data-grip=""
              onClick={cycleSide}
              aria-label="Move the scenario controls to the next edge"
              className="flex-none cursor-grab rounded-md px-1.5 py-2 text-fg-subtle transition-colors duration-fast ease-out-quad hover:bg-surface hover:text-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <GripIcon />
            </button>
          </Tooltip>
          {tabs}
        </div>
        {player ? (
          <div className="flex items-center justify-between gap-3.5 border-t border-line py-2.5 pr-2.5 pl-4.5">
            {player}
          </div>
        ) : null}
      </div>
    </div>
  );
}
