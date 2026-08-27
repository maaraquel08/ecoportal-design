import * as React from "react";
import { BackButton } from "@/components/back-button";
import { ControlDeck } from "@/components/control-deck";
import { TabletFrame } from "@/components/tablet-frame";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KioskLanding } from "@/prototypes/kiosk/landing";
import { KioskOnSite, visitorOnSite } from "@/prototypes/kiosk/onsite";
import { PhotoScreen } from "@/prototypes/kiosk/steps";
import { ScanPanel, useAutoScan } from "@/prototypes/shared/scan-panel";
import { BOOKINGS, type Booking } from "@/prototypes/shared/bookings";
import {
  CodeScreen,
  FindByNameScreen,
} from "@/prototypes/kiosk/find-by-name";

/* -- the tape ------------------------------------------------------- */

const STEPS = [
  "the landing",
  "the scanner",
  "finding your booking",
  "the code",
  "the photo",
  "checked in",
] as const;

type Step = 0 | 1 | 2 | 3 | 4 | 5;

function sentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* -- T1 · the scanner ----------------------------------------------- */

function ScannerScreen({
  active,
  onBack,
  onScanned,
  onFindByName,
}: {
  active: boolean;
  onBack: () => void;
  onScanned: () => void;
  onFindByName: () => void;
}) {
  const { capturing, readNow } = useAutoScan(active, onScanned);

  return (
    /* Wider than the landing's reading column: the viewfinder and the
     * instruction sit side by side, so this screen uses the full glass. */
    <div className="flex min-h-0 flex-1 flex-col px-10 pt-5 pb-7">
      <div className="flex items-center justify-between gap-6">
        <BackButton onClick={onBack} />
        <div className="flex items-center gap-4">
          <span className="font-mono text-[13px] tracking-[0.14em] text-house-fill uppercase">
            {capturing ? "Code read" : "Waiting for a pass"}
          </span>
          <span className="h-4.5 w-px bg-line" />
          <span className="text-[15px] text-fg-subtle">Thu 11 Sept</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-12">
        <ScanPanel capturing={capturing} onRead={readNow} />

        <div className="min-w-0 flex-1">
          <h2 className="text-[40px] leading-[1.08] font-bold tracking-[-0.03em]">
            Hold your code to the reader
          </h2>
          <p className="mt-3 max-w-[34ch] text-[19px] leading-normal text-fg-muted">
            Line it up with the green square. Invite, wallet or printout — all
            fine.
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            <span className="size-2.5 flex-none rounded-full bg-house-base" />
            <span className="font-mono text-[13px] tracking-[0.14em] text-house-fill uppercase">
              {capturing
                ? "Got it · checking you in"
                : "Reader is lit · scanning"}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="mt-5 flex items-center justify-between gap-6">
        <span className="font-mono text-[13px] text-fg-subtle">
          Hold steady for about a second
        </span>
        <Button variant="outline" size="cta" onClick={onFindByName}>
          Find me by name
        </Button>
      </div>
    </div>
  );
}

/* -- the prototype -------------------------------------------------- */

export function KioskArrival({
  tabs,
  /* The lanes live in their own tapes; their doors still open them. */
  onVisiting,
  onWork,
  onLeaving,
  onHandoff,
}: {
  tabs: React.ReactNode;
  onVisiting: () => void;
  onWork: () => void;
  onLeaving: () => void;
  onHandoff: () => void;
}) {
  const [step, setStep] = React.useState<Step>(0);
  /* Which booking the find-by-name path is verifying. */
  const [booking, setBooking] = React.useState<Booking>(BOOKINGS[0]);

  /* transitions.dev · 08 · Page side-by-side — same two-slot pattern
   * as the phone flow: the incoming screen mounts into the inactive
   * slot, then data-page flips on the next frame. */
  const [slots, setSlots] = React.useState<[Step | null, Step | null]>([
    0,
    null,
  ]);
  const [activeId, setActiveId] = React.useState<1 | 2>(1);
  const [pendingId, setPendingId] = React.useState<1 | 2 | null>(null);
  const [direction, setDirection] = React.useState<1 | -1>(1);

  React.useEffect(() => {
    if (pendingId === null) return;
    const frame = requestAnimationFrame(() => {
      setActiveId(pendingId);
      setPendingId(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [pendingId]);

  const goTo = (next: Step) => {
    if (next === step) return;
    const targetId = activeId === 1 ? 2 : 1;
    setDirection(next > step ? 1 : -1);
    setSlots(targetId === 1 ? [next, slots[1]] : [slots[0], next]);
    setPendingId(targetId);
    setStep(next);
  };

  const last = step === STEPS.length - 1;
  const incomingId = pendingId ?? activeId;
  const fromX = (id: 1 | 2) =>
    (id === incomingId ? direction : -direction) === 1
      ? "var(--page-slide-distance)"
      : "calc(var(--page-slide-distance) * -1)";

  const screens: Record<Step, React.ReactNode> = {
    0: (
      <KioskLanding
        onScan={() => goTo(1)}
        onVisiting={onVisiting}
        onWork={onWork}
        onLeaving={onLeaving}
        onHandoff={onHandoff}
      />
    ),
    1: (
      <ScannerScreen
        active={step === 1}
        onBack={() => goTo(0)}
        onScanned={() => goTo(4)}
        onFindByName={() => goTo(2)}
      />
    ),
    2: (
      <FindByNameScreen
        onBack={() => goTo(1)}
        onPick={(picked) => {
          setBooking(picked);
          goTo(3);
        }}
      />
    ),
    3: (
      <CodeScreen
        active={step === 3}
        booking={booking}
        onBack={() => goTo(2)}
        onVerified={() => goTo(4)}
        onGiveUp={() => goTo(0)}
      />
    ),
    4: (
      <PhotoScreen
        active={step === 4}
        /* Nothing behind this screen was numbered, so a count would be
         * counting screens she never saw. */
        step={null}
        onBack={() => goTo(1)}
        onDone={() => goTo(5)}
      />
    ),
    5: (
      <KioskOnSite
        active={step === 5}
        content={visitorOnSite({})}
        onDone={() => goTo(0)}
      />
    ),
  };

  return (
    <div className="w-full">
      <TabletFrame>
        <div
          className="t-page-slide min-h-0 flex-1"
          data-page={String(activeId)}
        >
          {([1, 2] as const).map((id) => {
            const slotStep = id === 1 ? slots[0] : slots[1];
            return (
              <section
                key={id}
                className="t-page flex flex-col"
                data-page-id={String(id)}
                style={{ "--t-page-from-x": fromX(id) } as React.CSSProperties}
                aria-hidden={id !== activeId}
              >
                {slotStep === null ? null : screens[slotStep]}
              </section>
            );
          })}
        </div>
      </TabletFrame>

      <ControlDeck
        tabs={tabs}
        player={
          <>
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex-none font-mono text-sm font-medium text-lane-fill">
                {step + 1}
                <span className="mx-0.5 text-fg-subtle">/</span>
                {STEPS.length}
              </span>
              <span className="h-4.5 w-px flex-none bg-line" />
              <span className="truncate text-sm text-fg-muted">
                Current · {STEPS[step]}
              </span>
            </div>
            <button
              onClick={() => goTo(last ? 0 : ((step + 1) as Step))}
              className="flex flex-none items-center gap-2 rounded-full bg-lane-tint px-4 py-2 text-sm font-semibold text-lane-fill transition-colors duration-fast ease-out-quad hover:bg-lane-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {last ? "Replay" : sentenceCase(STEPS[step + 1])}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-lane-base"
                aria-hidden="true"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        }
      />
    </div>
  );
}
