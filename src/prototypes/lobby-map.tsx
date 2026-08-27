/**
 * The lobby plan from studies K2 / K2·M: her dot, one green route, one
 * destination pin — read the way everyone already reads Maps.
 *
 * Geometry is expressed as percentages of the study's 524 × 186 plan,
 * so one layout serves both surfaces: `fill` lets it grow into whatever
 * box the tablet gives it, while `scale` keeps the plan at its drawn
 * size and shrinks the whole thing — type included — for the phone.
 */
const W = 524;
const H = 186;

const pc = (value: number, total: number) => `${(value / total) * 100}%`;

type Tile = {
  label: string;
  note?: string;
  x: number;
  w: number;
  edge: "top" | "bottom";
};

const TILES: Tile[] = [
  { label: "Reception desk", note: "Staffed", x: 10, w: 148, edge: "top" },
  { label: "Café", x: 168, w: 104, edge: "top" },
  { label: "Meeting rooms", note: "1–4", x: 282, w: 122, edge: "top" },
  { label: "Kiosks", note: "Here", x: 10, w: 118, edge: "bottom" },
  { label: "Gates", note: "Badge", x: 138, w: 104, edge: "bottom" },
  { label: "Stairs", note: "Levels 1–6", x: 252, w: 104, edge: "bottom" },
];

export function LobbyMap({
  fill,
  scale,
}: {
  fill?: boolean;
  scale?: number;
}) {
  const plan = (
    <div
      className={`relative overflow-hidden rounded-[14px] bg-(--n-100) ${
        /* In fill mode it is a flex child that takes the slack; the
         * percentage geometry then resolves against whatever it gets. */
        fill ? "min-h-0 w-full flex-1" : "h-46.5 w-131"
      }`}
    >
      {/* The corridor the route runs along. */}
      <div
        className="absolute inset-x-0 bg-bg"
        style={{ top: pc(76, H), height: pc(38, H) }}
      />

      {TILES.map((tile) => (
        <div
          key={tile.label}
          className="absolute flex flex-col items-center justify-center gap-px rounded-[9px] bg-line p-1 text-center"
          style={{
            left: pc(tile.x, W),
            width: pc(tile.w, W),
            height: pc(60, H),
            [tile.edge]: pc(8, H),
          }}
        >
          <div className="text-[13px] leading-tight font-medium text-fg-subtle">
            {tile.label}
          </div>
          {tile.note ? (
            <div className="font-mono text-[10px] tracking-[0.06em] text-(--n-400) uppercase">
              {tile.note}
            </div>
          ) : null}
        </div>
      ))}

      {/* The destination, the only tinted tile on the plan. */}
      <div
        className="absolute flex flex-col items-center justify-center gap-0.5 rounded-[9px] border-[1.5px] border-house-base bg-house-tint"
        style={{
          right: pc(10, W),
          width: pc(96, W),
          top: pc(8, H),
          bottom: pc(8, H),
        }}
      >
        <div className="text-[13px] leading-tight font-semibold text-house-fill">
          East lifts
        </div>
        <div className="font-mono text-[10px] tracking-[0.06em] text-house-fill/80 uppercase">
          All levels
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full"
        aria-label="Walking route from the kiosks to the east lifts"
      >
        <path
          d="M128 95H404"
          className="stroke-bg"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M128 95H404"
          className="t-map-route stroke-house-base"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="20 20"
        />
      </svg>

      {/* You are here. */}
      <div
        className="absolute flex size-9 items-center justify-center"
        style={{ left: pc(110, W), top: pc(77, H) }}
      >
        <div className="t-map-halo absolute inset-0 rounded-full bg-house-base/30" />
        <div className="size-4.5 rounded-full border-3 border-bg bg-house-base" />
      </div>

      {/* Where she is going. */}
      <div
        className="t-map-pin absolute flex size-8.5 items-center justify-center rounded-full border-3 border-bg bg-house-base text-sm font-bold text-accent-fg"
        style={{ left: pc(388, W), top: pc(78, H) }}
      >
        9
      </div>
    </div>
  );

  if (!scale) return plan;

  // Scaled for the phone: the wrapper takes the reduced height so the
  // plan is shrunk rather than cropped.
  return (
    <div
      className="overflow-hidden rounded-[12px]"
      style={{ height: `${Math.round(H * scale)}px` }}
    >
      <div
        className="w-131 origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        {plan}
      </div>
    </div>
  );
}
