import * as React from "react";
import { ControlDeck } from "@/components/control-deck";
import {
  DetailsScreen,
  Footnote,
  Mono,
  NoticesScreen,
  PassScreen,
  Row,
} from "@/prototypes/visitor-steps";
import { PhoneFrame, PhoneScreen } from "@/components/phone-frame";
import { Button } from "@/components/ui/button";

/* -- the tape ------------------------------------------------------- */

const STEPS = [
  "Sam's email",
  "the invitation",
  "her details",
  "today's notices",
  "her pass",
  "all set",
] as const;

type Step = 0 | 1 | 2 | 3 | 4 | 5;

/** Step names read as prose in the label; the CTA needs a capital. */
function sentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* -- 1 · Sam's email ------------------------------------------------ */

function EmailScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <PhoneScreen
      bodyClassName="px-5.5 pt-4 pb-2"
      footer={
        <>
          <Button size="cta" className="w-full" onClick={onOpen}>
            View your invitation
          </Button>
          <Footnote>The link in the email opens the invite below.</Footnote>
        </>
      }
    >
      <div className="flex items-center justify-between border-b border-line pb-3.5">
        <span className="flex items-center gap-2 text-base font-medium text-lane-base">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
          Inbox
        </span>
        <span className="font-mono text-xs text-fg-subtle">Wed 6:04pm</span>
      </div>

      <h2 className="mt-4 text-[22px] leading-tight font-bold tracking-[-0.025em]">
        Your visit to Rushcutters Tower — Thursday 2:00pm
      </h2>

      <div className="mt-4 flex items-center gap-3">
        <span className="flex size-10 flex-none items-center justify-center rounded-full bg-lane-tint text-[15px] font-semibold text-lane-fill">
          SW
        </span>
        <div className="min-w-0">
          <div className="text-base font-semibold">Sam Whitfield</div>
          <div className="text-sm text-fg-subtle">to marta.nowak@…</div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3.5 text-base leading-relaxed text-fg-muted">
        <p>Hi Marta,</p>
        <p>
          Looking forward to Thursday. Reception has you on the list — you can
          check in from your phone before you come, which means the lobby
          tablet only needs a photo when you arrive.
        </p>
        <p>See you at 2.</p>
        <p className="text-fg-subtle">Sam</p>
      </div>

      <div className="mt-4.5 flex items-center gap-3 rounded-lg border border-line px-4 py-3.5">
        <span className="flex size-9.5 flex-none items-center justify-center rounded-md bg-lane-tint text-lane-base">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="15" rx="2.5" />
            <path d="M3 9.5h18M8 3.5v3M16 3.5v3" />
          </svg>
        </span>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold">
            Thursday 11 Sept, 2:00pm
          </div>
          <div className="mt-0.5 font-mono text-[13px] text-fg-subtle">
            INV-3391 · Level 9
          </div>
        </div>
      </div>

      <p className="mt-4 pb-2 text-[13px] leading-normal text-fg-subtle">
        Sent by Rushcutters Tower reception on behalf of Kestrel Legal.
      </p>
    </PhoneScreen>
  );
}

/* -- 2 · the invitation --------------------------------------------- */

function InviteScreen({
  onCheckIn,
  onBack,
}: {
  onCheckIn: () => void;
  onBack: () => void;
}) {
  return (
    <PhoneScreen
      bodyClassName="px-5 pt-3.5 pb-2"
      footer={
        <>
          <Button size="cta" className="w-full" onClick={onCheckIn}>
            Check in now · 1 min
          </Button>
          <Button
            size="cta"
            variant="secondary"
            className="w-full"
            onClick={onBack}
          >
            Back to email
          </Button>
          <Footnote>Or do it when you get here. Either is fine.</Footnote>
        </>
      }
    >
      <div className="overflow-hidden rounded-xl border border-line">
        <div className="bg-lane-tint px-5.5 py-5">
          <Mono className="text-lane-fill" size="text-[11px]">
            Your invitation
          </Mono>
          <div className="mt-2 text-[26px] leading-tight font-bold tracking-[-0.025em]">
            Thursday 11 Sept, 2:00pm
          </div>
        </div>
        <div className="flex flex-col gap-3.5 px-5.5 py-4.5">
          <Row label="Host" value="Sam Whitfield" />
          <Row label="Where" value="Rushcutters Tower, Level 9" />
          <Row label="Reference" value="INV-3391" mono />
        </div>
      </div>

      <p className="mt-5 text-[15px] leading-normal text-fg-muted">
        Checking in now means the lobby tablet only needs a photo when you
        arrive — about ten seconds.
      </p>
    </PhoneScreen>
  );
}

/* -- 6 · all set ---------------------------------------------------- */

function ClosedScreen({ onReopen }: { onReopen: () => void }) {
  return (
    <PhoneScreen
      footer={
        <Button
          size="cta"
          variant="secondary"
          className="w-full"
          onClick={onReopen}
        >
          View my pass again
        </Button>
      }
    >
      <div className="flex h-full flex-col items-center justify-center gap-2.5 pb-10 text-center">
        <span className="flex size-13 items-center justify-center rounded-full bg-(--eco-green-tint) text-success">
          <svg
            width="26"
            height="26"
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
        <h2 className="mt-1.5 text-[26px] leading-tight font-bold tracking-[-0.025em]">
          All set for Thursday
        </h2>
        <p className="max-w-[280px] text-[15px] leading-normal text-fg-subtle">
          Your pass is in your email and wallet. Bring your phone to the lobby
          tablet — nothing else to do.
        </p>
      </div>
    </PhoneScreen>
  );
}

/* -- the prototype -------------------------------------------------- */

export function VisitorPrearrival({ tabs }: { tabs: React.ReactNode }) {
  const [step, setStep] = React.useState<Step>(0);
  const [firstName, setFirstName] = React.useState("Marta");

  /* transitions.dev · 08 · Page side-by-side.
   *
   * The snippet cross-slides two sibling pages, so the flow keeps two
   * slots and alternates them: the incoming screen always mounts into
   * the inactive slot, then `data-page` flips on the next frame so the
   * browser has a resting position to animate from.
   *
   * Direction comes from an inline `--t-page-from-x` rather than the
   * slot id, so forward always enters from the right and back from the
   * left no matter which slot is in play. */
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

  const go = (next: Step) => () => goTo(next);
  const last = step === STEPS.length - 1;

  const incomingId = pendingId ?? activeId;
  const fromX = (id: 1 | 2) =>
    (id === incomingId ? direction : -direction) === 1
      ? "var(--page-slide-distance)"
      : "calc(var(--page-slide-distance) * -1)";

  const screens: Record<Step, React.ReactNode> = {
    0: <EmailScreen onOpen={go(1)} />,
    1: <InviteScreen onCheckIn={go(2)} onBack={go(0)} />,
    2: (
      <DetailsScreen
        onContinue={(name) => {
          setFirstName(name.split(" ")[0] || "Marta");
          goTo(3);
        }}
        onCancel={go(1)}
      />
    ),
    3: <NoticesScreen onContinue={go(4)} onBack={go(2)} />,
    4: (
      <PassScreen
        firstName={firstName}
        footer={
          <>
            <Button size="cta" className="w-full" onClick={go(5)}>
              Done
            </Button>
            <Button size="cta" variant="secondary" className="w-full">
              Add to wallet
            </Button>
            <Footnote>Lost it? The lobby tablet finds you by name.</Footnote>
          </>
        }
      />
    ),
    5: <ClosedScreen onReopen={go(4)} />,
  };

  return (
    <div className="flex flex-col items-center">
      <PhoneFrame>
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
      </PhoneFrame>

      {/* Scenario tabs, then the tape deck: where we are, what is next, Play. */}
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
