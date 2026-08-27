import * as React from "react";
import { ControlDeck } from "@/components/control-deck";
import { useLane, type Lane } from "@/hooks/use-lane";
import { KioskArrival } from "@/prototypes/kiosk-arrival";
import { KioskContractor } from "@/prototypes/kiosk-contractor";
import { KioskHandoff } from "@/prototypes/kiosk-handoff";
import { KioskPhone } from "@/prototypes/kiosk-phone";
import { KioskVisiting } from "@/prototypes/kiosk-visiting";
import { VisitDuring, visitorDuring } from "@/prototypes/visit-during";
import { VisitLeaving, visitorLeaving } from "@/prototypes/visit-leaving";
import { VisitorPrearrival } from "@/prototypes/visitor-prearrival";

type Scenario =
  | "pre-arrival"
  | "kiosk"
  | "kiosk-visiting"
  | "kiosk-work"
  | "kiosk-handoff"
  | "kiosk-phone"
  | "during"
  | "leaving";

/**
 * The kiosk is a platform surface, so it wears the house ramp. `null`
 * hands ownership to the flow, which the contractor sign-on needs:
 * its landing is the house and everything behind the work door is the
 * contractor's.
 */
const SCENARIO_LANE: Record<Scenario, Lane | null> = {
  "pre-arrival": "visitor",
  kiosk: "house",
  "kiosk-visiting": "visitor",
  "kiosk-work": null,
  "kiosk-handoff": "house",
  "kiosk-phone": "house",
  during: "visitor",
  leaving: "exit",
};

/**
 * Only the entry points get a tab. The visiting flow is not one: it is
 * opened by its own door on the landing, so a tab for it would be a
 * second, competing way in.
 */
const TABS: { id: Scenario; label: string; ready: boolean }[] = [
  { id: "pre-arrival", label: "Pre-arrival", ready: true },
  { id: "kiosk", label: "At kiosk", ready: true },
  { id: "kiosk-phone", label: "At kiosk · her phone", ready: true },
  { id: "during", label: "During visit", ready: true },
  { id: "leaving", label: "Leaving", ready: true },
];

function ScenarioTabs({
  active,
  onSelect,
}: {
  active: Scenario;
  onSelect: (scenario: Scenario) => void;
}) {
  return (
    <>
      {TABS.map((item) => (
        <button
          key={item.id}
          onClick={() => item.ready && onSelect(item.id)}
          disabled={!item.ready}
          aria-pressed={active === item.id}
          className="rounded-full px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-fast ease-out-quad focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring enabled:hover:bg-surface disabled:text-fg-subtle disabled:opacity-70 aria-pressed:bg-lane-tint aria-pressed:font-semibold aria-pressed:text-lane-fill"
        >
          {item.label}
        </button>
      ))}
    </>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex w-full max-w-100.5 flex-col items-center gap-2 rounded-xl border border-dashed border-line px-6 py-16 text-center">
      <span className="font-mono text-[11px] tracking-[0.14em] text-fg-subtle uppercase">
        {label}
      </span>
      <p className="text-sm text-fg-subtle">Not prototyped yet.</p>
    </div>
  );
}

export function VisitorPage() {
  const [scenario, setScenario] = React.useState<Scenario>("pre-arrival");
  const { setLane } = useLane();
  /* The visiting flow lives inside the kiosk journey, so its tab stays
   * lit while you are in it. */
  const tabs = (
    <ScenarioTabs
      active={
        scenario === "kiosk-visiting" ||
        scenario === "kiosk-work" ||
        scenario === "kiosk-handoff"
          ? "kiosk"
          : scenario
      }
      onSelect={setScenario}
    />
  );

  const lane = SCENARIO_LANE[scenario];
  React.useEffect(() => {
    if (lane) setLane(lane);
  }, [lane, setLane]);

  if (scenario === "pre-arrival") {
    return (
      <div className="flex flex-col items-center px-8 pt-12 pb-44">
        <VisitorPrearrival tabs={tabs} />
      </div>
    );
  }

  if (scenario === "kiosk-phone") {
    return (
      <div className="flex flex-col items-center px-8 pt-12 pb-44">
        <KioskPhone tabs={tabs} />
      </div>
    );
  }

  if (scenario === "kiosk") {
    /* No max-width and no side padding: the tablet is wider than the
     * page's content column and centres itself. */
    return (
      <div className="w-full pt-12 pb-44">
        <KioskArrival
          tabs={tabs}
          onVisiting={() => setScenario("kiosk-visiting")}
          onWork={() => setScenario("kiosk-work")}
          onLeaving={() => setScenario("leaving")}
          onHandoff={() => setScenario("kiosk-handoff")}
        />
      </div>
    );
  }

  if (scenario === "during") {
    return (
      <div className="flex flex-col items-center px-8 pt-12 pb-44">
        <VisitDuring tabs={tabs} content={visitorDuring()} />
      </div>
    );
  }

  if (scenario === "leaving") {
    return (
      <div className="w-full pt-12 pb-44">
        <VisitLeaving
          tabs={tabs}
          content={visitorLeaving()}
          onExit={() => setScenario("kiosk")}
        />
      </div>
    );
  }

  if (scenario === "kiosk-handoff") {
    return (
      <div className="flex flex-col items-center px-8 pt-12 pb-44">
        <KioskHandoff tabs={tabs} onExit={() => setScenario("kiosk")} />
      </div>
    );
  }

  /* The third door on the landing. It is the contractor lane's tape,
   * on the same glass — so it lives here rather than being copied. */
  if (scenario === "kiosk-work") {
    return (
      <div className="w-full pt-12 pb-44">
        <KioskContractor tabs={tabs} onExit={() => setScenario("kiosk")} />
      </div>
    );
  }

  if (scenario === "kiosk-visiting") {
    return (
      <div className="w-full pt-12 pb-44">
        <KioskVisiting tabs={tabs} onExit={() => setScenario("kiosk")} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-8 pt-12 pb-44">
      <Placeholder
        label={TABS.find((tab) => tab.id === scenario)?.label ?? ""}
      />
      <ControlDeck tabs={tabs} />
    </div>
  );
}
