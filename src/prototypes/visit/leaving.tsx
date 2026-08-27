import * as React from "react";
import { BackButton } from "@/components/back-button";
import { ControlDeck } from "@/components/control-deck";
import { TabletFrame } from "@/components/tablet-frame";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScanPanel, useAutoScan } from "@/prototypes/shared/scan-panel";

/* -- the tape ------------------------------------------------------- */

const STEPS = ["scan to sign out", "signed out"] as const;

type Step = 0 | 1;

function sentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** How long the thank-you holds before the kiosk resets. */
const RESET_SECONDS = 6;

/**
 * Both lanes leave the same way, because leaving is one physical event
 * at one reader: hold the pass, be counted out. What differs is the
 * day, the name, and what the building keeps — so those are declared
 * per lane and the two screens read them.
 */
export type LeavingContent = {
  day: string;
  headline: string;
  body: string;
  /** Beside the find-me-by-name escape. R8: losing the pass cannot be
   *  a dead end, or the building's list stops being true. */
  hint: string;
  thanks: string;
  signedOut: string;
  /** What was kept and what was not, said plainly. */
  kept: { label: string; value: string }[];
};

export const visitorLeaving = (): LeavingContent => ({
  day: "Thu 11 Sept",
  headline: "Hold the same pass to sign out",
  body: "The one you checked in with — on your phone, in your wallet, or printed.",
  hint: "Lost your pass? Reception can sign you out",
  thanks: "Thanks for visiting, Marta.",
  signedOut:
    "Signed out at 3:41pm. The building no longer counts you as inside.",
  kept: [
    { label: "Your photo", value: "Deleted just now" },
    { label: "Kept for the building", value: "Name and visit times" },
  ],
});

export const contractorLeaving = (): LeavingContent => ({
  day: "Tue 9 Sept",
  headline: "Hold the same pass to sign off",
  body: "The one you signed on with — on your phone, in your wallet, or printed.",
  hint: "Lost your pass? The desk can sign you off",
  thanks: "That's you off site, Priya.",
  signedOut:
    "Signed off at 4:12pm. The building no longer counts you as inside.",
  /* A trade's permit closes with her, which is the fact the fire
   * warden needs and the one she would otherwise have to remember. */
  kept: [
    { label: "Your photo", value: "Deleted just now" },
    { label: "Kept for the building", value: "Name and site times" },
    {
      label: "Hot works permit",
      value: "PMT-4471 closed at 4:12pm · fire watch done",
    },
  ],
});

/* -- L0 · scan to sign out ------------------------------------------ */

function SignOutScanScreen({
  active,
  content,
  onBack,
  onScanned,
}: {
  active: boolean;
  content: LeavingContent;
  onBack: () => void;
  onScanned: () => void;
}) {
  const { capturing, readNow } = useAutoScan(active, onScanned);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-10 pt-5 pb-7">
      <div className="flex items-center justify-between gap-6">
        <BackButton onClick={onBack} />
        <div className="flex items-center gap-4">
          <span className="font-mono text-[13px] tracking-[0.14em] text-lane-fill uppercase">
            {capturing ? "Pass read" : "Signing out"}
          </span>
          <span className="h-4.5 w-px bg-line" />
          <span className="text-[15px] text-fg-subtle">{content.day}</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-12">
        <ScanPanel capturing={capturing} onRead={readNow} />

        <div className="min-w-0 flex-1">
          <h2 className="text-[40px] leading-[1.08] font-bold tracking-[-0.03em]">
            {content.headline}
          </h2>
          <p className="mt-3 max-w-[34ch] text-[19px] leading-normal text-fg-muted">
            {content.body}
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            <span className="size-2.5 flex-none rounded-full bg-lane-base" />
            <span className="font-mono text-[13px] tracking-[0.14em] text-lane-fill uppercase">
              {capturing ? "Got it · signing you out" : "Reader is lit"}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* R8: the building's list is only right if leaving is as easy as
        * arriving — so losing the pass cannot be a dead end. */}
      <div className="mt-5 flex items-center justify-between gap-6">
        <span className="font-mono text-[13px] text-fg-subtle">
          {content.hint}
        </span>
        <Button variant="outline" size="cta" onClick={onScanned}>
          Find me by name
        </Button>
      </div>
    </div>
  );
}

/* -- L1 · signed out (study S4) ------------------------------------- */

function SignedOutScreen({
  active,
  content,
  onDone,
}: {
  active: boolean;
  content: LeavingContent;
  onDone: () => void;
}) {
  const [remaining, setRemaining] = React.useState(RESET_SECONDS);

  React.useEffect(() => {
    if (!active) {
      setRemaining(RESET_SECONDS);
      return;
    }
    if (remaining === 0) {
      onDone();
      return;
    }
    const timer = window.setTimeout(() => setRemaining((n) => n - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [active, remaining, onDone]);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-10 pt-5 pb-7">
      {/* The route out is the exit lane, but a clean sign-out is a
        * success — and status roles are lane-blind by contract. */}
      <div className="flex items-center gap-2.5">
        <span className="flex size-6 items-center justify-center rounded-full bg-(--eco-green-tint)">
          <span className="size-2 rounded-full bg-success" />
        </span>
        <span className="font-mono text-[13px] tracking-[0.14em] text-success uppercase">
          Pass scanned
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-(--eco-green-tint) text-success">
          <svg
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
        </span>

        <h2 className="mt-6 text-[46px] leading-[1.06] font-bold tracking-[-0.035em]">
          {content.thanks}
        </h2>
        <p className="mt-2.5 text-[21px] text-fg-muted">{content.signedOut}</p>

        {/* What was kept and what was not, said plainly rather than
          * buried in a policy nobody reads at a kiosk. An odd last card
          * takes the full width rather than leaving a gap. */}
        <div className="mt-7 grid w-full max-w-[600px] grid-cols-2 gap-3">
          {content.kept.map((item, index) => (
            <div
              key={item.label}
              className={`rounded-lg border border-line px-5 py-4 text-left ${
                index === content.kept.length - 1 && content.kept.length % 2
                  ? "col-span-2"
                  : ""
              }`}
            >
              <div className="text-sm text-fg-subtle">{item.label}</div>
              <div className="mt-0.5 text-[19px] font-semibold tracking-[-0.015em]">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-6">
        <span className="text-[15px] text-fg-subtle">
          Returning to the start in{" "}
          <span className="font-mono font-medium text-fg-muted">
            {remaining}s
          </span>
        </span>
        <Button size="cta" className="w-64" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  );
}

/* -- the prototype -------------------------------------------------- */

export function VisitLeaving({
  tabs,
  content,
  onExit,
}: {
  tabs: React.ReactNode;
  content: LeavingContent;
  onExit: () => void;
}) {
  const [step, setStep] = React.useState<Step>(0);

  /* transitions.dev · 08 · Page side-by-side. */
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
      <SignOutScanScreen
        active={step === 0}
        content={content}
        onBack={onExit}
        onScanned={() => goTo(1)}
      />
    ),
    1: (
      <SignedOutScreen active={step === 1} content={content} onDone={onExit} />
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
