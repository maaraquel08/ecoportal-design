import { Gallery } from "@/showcase/gallery";
import { Category, Meta, Specimen } from "@/showcase/specimen";
import { LANES, useLane, type Lane } from "@/hooks/use-lane";

const LANE_COPY: Record<Lane, { label: string; hue: string; note: string }> = {
  house: {
    label: "House",
    hue: "Green",
    note: "Before a person has told us anything — and every staff surface after.",
  },
  visitor: {
    label: "Visitor",
    hue: "Blue",
    note: "Calm, short, low-commitment. Two minutes and a badge.",
  },
  contractor: {
    label: "Contractor",
    hue: "Orange",
    note: "Denser and more literal. Codes in mono, permits stated plainly.",
  },
  exit: {
    label: "Leaving",
    hue: "Red",
    note: "Not a lane — a terminal state. Sign-out, blocked, expired.",
  },
};

const STEPS = [
  ["tint", "bg-lane-tint", "Tinted panels, icon tiles, selected chips"],
  ["soft", "bg-lane-soft", "Hairlines and focus rings on tint"],
  ["base", "bg-lane-base", "The mark, icon strokes, rails"],
  ["fill", "bg-lane-fill", "Button fills, coloured labels, links"],
  ["pressed", "bg-lane-pressed", "Pressed state, text on a tint panel"],
] as const;

export function DesignSystemPage() {
  const { lane, setLane } = useLane();
  const copy = LANE_COPY[lane];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-14 px-8 py-12">
      <div className="flex flex-col gap-6">
        <div className="flex max-w-[70ch] flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <Meta>brand direction v2</Meta>
            <span className="rounded-full bg-lane-tint px-2.5 py-1 font-mono text-[11px] tracking-[0.12em] text-lane-fill uppercase">
              {copy.hue}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-[-0.035em]">
            Four hues, one neutral page.
          </h1>
          <p className="text-base leading-relaxed text-fg-muted text-pretty">
            One ramp per screen — the lane owns it. Base shows, fill works. Red
            is an exit, not a lane. A single{" "}
            <code className="font-mono text-sm">data-lane</code> attribute at
            the root repoints all five steps, and no component below knows
            which lane it is in.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {LANES.map((value) => (
            <button
              key={value}
              onClick={() => setLane(value)}
              aria-pressed={lane === value}
              className="rounded-md border border-line px-3.5 py-2 text-sm font-medium text-fg-muted transition-colors duration-fast ease-out-quad hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-transparent aria-pressed:bg-lane-tint aria-pressed:text-lane-pressed"
            >
              {LANE_COPY[value].label}
            </button>
          ))}
        </div>
      </div>

      <Category index="01" title="The active ramp" aside="tint → pressed">
        <Specimen
          name={`${copy.hue} · ${copy.label.toLowerCase()}`}
          note={copy.note}
          span="full"
        >
          <div className="grid w-full gap-3 sm:grid-cols-5">
            {STEPS.map(([step, swatch, role]) => (
              <div key={step} className="flex flex-col gap-2">
                <div
                  className={`h-16 rounded-md border border-line ${swatch}`}
                />
                <Meta>{step}</Meta>
                <span className="text-[13px] leading-snug text-fg-subtle">
                  {role}
                </span>
              </div>
            ))}
          </div>
        </Specimen>
      </Category>

      <Gallery />
    </div>
  );
}
