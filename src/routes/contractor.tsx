import * as React from "react";
import { ControlDeck } from "@/components/control-deck";
import { useLane, type Lane } from "@/hooks/use-lane";
import { MY_NOTICES } from "@/components/notice";
import { ContractorPrearrival } from "@/prototypes/contractor/prearrival";
import { REGISTERED } from "@/prototypes/contractor/firms";
import { KioskContractor } from "@/prototypes/kiosk/contractor";
import { KioskPhone } from "@/prototypes/kiosk/phone";
import { contractorDuring, VisitDuring } from "@/prototypes/visit/during";
import { contractorLeaving, VisitLeaving } from "@/prototypes/visit/leaving";
import {
  CONTRACTOR_PASS_CAPTION,
  contractorPassRows,
} from "@/prototypes/shared/pass-card";

type Scenario =
  | "first-time"
  | "known"
  | "kiosk"
  | "kiosk-phone"
  | "on-site"
  | "leaving";

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
  /* Her phone, in the lane the glass handed her — behind the work
   * door everything is the contractor's. */
  "kiosk-phone": "contractor",
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
  { id: "kiosk-phone", label: "At kiosk · her phone", ready: true },
  { id: "on-site", label: "On site", ready: true },
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

  if (scenario === "on-site") {
    /* Her phone while she works: where she stands, and the one thing
     * that moved while she was in the riser. */
    return (
      <div className="flex flex-col items-center px-8 pt-12 pb-44">
        <VisitDuring
          tabs={tabs}
          content={contractorDuring({ company: REGISTERED[0].name })}
        />
      </div>
    );
  }

  if (scenario === "leaving") {
    /* The reader again, the same one that let her in. */
    return (
      <div className="w-full pt-12 pb-44">
        <VisitLeaving
          tabs={tabs}
          content={contractorLeaving()}
          onExit={() => setScenario("kiosk")}
        />
      </div>
    );
  }

  if (scenario === "kiosk-phone") {
    /* Study K2·M for the contractor lane: the same screen the visitor
     * lane ends on, carrying a trade's facts. */
    return (
      <div className="flex flex-col items-center px-8 pt-12 pb-44">
        <KioskPhone
          tabs={tabs}
          status="On site · 08:04AM"
          headline="You're on site, Priya"
          body="Level 4 whenever you're ready. Dan is at the dock from 7:45."
          route={{
            zone: "Lobby · ground",
            target: "Service lift → L4",
            caption: "Past the café, then the service corridor",
          }}
          notices={MY_NOTICES}
          passCaption={CONTRACTOR_PASS_CAPTION}
          passRows={contractorPassRows(REGISTERED[0].name)}
          signOut="Hold this pass to the reader on your way out. For security a visit cannot be ended from a phone."
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
        <KioskContractor
          tabs={tabs}
          /* The exit door on the landing. Leaving is the same reader
           * for both lanes, so it is the shared flow with the trade's
           * own content — her permit closing is the fact that differs. */
          onLeaving={() => setScenario("leaving")}
        />
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
