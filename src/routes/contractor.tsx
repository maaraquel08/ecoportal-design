import * as React from "react";
import { ControlDeck } from "@/components/control-deck";
import { useLane, type Lane } from "@/hooks/use-lane";
import { ContractorPrearrival } from "@/prototypes/contractor-prearrival";
import { KioskContractor } from "@/prototypes/kiosk-contractor";

type Scenario = "first-time" | "known" | "kiosk" | "on-site" | "leaving";

/**
 * The lane a scenario speaks in. Pre-arrival is the contractor's own
 * journey, so it wears orange. The kiosk is `null` because the flow
 * owns it: its landing is the platform's, and everything behind the
 * work door is hers.
 */
const SCENARIO_LANE: Record<Scenario, Lane | null> = {
  "first-time": "contractor",
  known: "contractor",
  kiosk: null,
  "on-site": "contractor",
  leaving: "exit",
};

/**
 * Only the entry points get a tab. The two pre-arrival tabs are the
 * same prototype and the same email — they differ only in what the
 * site finds when it looks up the address the link was sent to, which
 * is what decides whether sign-up is part of the flow.
 */
const TABS: { id: Scenario; label: string; ready: boolean }[] = [
  { id: "first-time", label: "Pre-arrival · first timer", ready: true },
  { id: "known", label: "Pre-arrival · known trade", ready: true },
  { id: "kiosk", label: "At kiosk", ready: true },
  { id: "on-site", label: "On site", ready: false },
  { id: "leaving", label: "Leaving", ready: false },
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

export function ContractorPage() {
  const { setLane } = useLane();
  const [scenario, setScenario] = React.useState<Scenario>("first-time");
  const tabs = <ScenarioTabs active={scenario} onSelect={setScenario} />;

  const lane = SCENARIO_LANE[scenario];
  React.useEffect(() => {
    if (lane) setLane(lane);
  }, [lane, setLane]);

  if (scenario === "first-time" || scenario === "known") {
    return (
      <div className="flex flex-col items-center px-8 pt-12 pb-44">
        {/* Keyed, so switching tabs restarts the flow rather than
          * leaving a first-timer's half-filled firm on a known
          * trade's tape. */}
        <ContractorPrearrival
          key={scenario}
          tabs={tabs}
          known={scenario === "known"}
        />
      </div>
    );
  }

  if (scenario === "kiosk") {
    /* No max-width and no side padding: the tablet is wider than the
     * page's content column and centres itself. The reader is the entry
     * here, so it has nothing to go back to — on the visitor page the
     * same flow opens off the landing's "Here to work" door and does. */
    return (
      <div className="w-full pt-12 pb-44">
        <KioskContractor tabs={tabs} />
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
