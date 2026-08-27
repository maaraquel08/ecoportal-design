import * as React from "react";
import { ControlDeck } from "@/components/control-deck";
import {
  MY_NOTICES,
  NoticeList,
  TODAY_NOTICES,
  type Notice,
} from "@/components/notice";
import { PhoneFrame, PhoneScreen } from "@/components/phone-frame";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import {
  CONTRACTOR_PASS_CAPTION,
  CONTRACTOR_PERMIT_ROW,
  contractorPassRows,
  VisitorPassCard,
  type PassRow,
} from "@/prototypes/visitor-pass";

/* -- the tape ------------------------------------------------------- */

const STEPS = ["on site", "the day changed"] as const;

type Step = 0 | 1;

function sentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * A notice can land while she is upstairs — which is the whole reason
 * the check-in screen says she will see them again. Journey C, R7:
 * today's warnings reach everyone in the building, not just the people
 * standing at a kiosk.
 *
 * Both lanes get the same two screens: where she stands now, and the
 * one thing that moved while she was working. Only the facts differ,
 * so they are declared per lane and the screens read them.
 */
export type DuringContent = {
  status: string;
  since: string;
  headline: string;
  body: string;
  notices: Notice[];
  passCaption?: string;
  passRows?: PassRow[];
  changed: {
    at: string;
    headline: string;
    /** The good news, said before the detail. */
    banner: string;
    notice: Notice;
    /** What still stands, under the thing that moved. */
    stands: Notice[];
    footnote: string;
  };
};

export const visitorDuring = (): DuringContent => ({
  status: "On site",
  since: "Since 9:12am",
  headline: "You're checked in",
  body: "Level 9 · Kestrel Legal. Your pass opens the gates on the way through.",
  notices: TODAY_NOTICES,
  changed: {
    at: "Updated · 2:40pm",
    headline: "Something changed while you were upstairs",
    banner: "The Level 4 lift is back in service. Nothing you need to do.",
    notice: {
      category: "Access",
      when: "From 2:40pm",
      title: "Level 4 lift back in service",
      body: "The technician has finished. Both lifts are running.",
    },
    stands: [TODAY_NOTICES[0]],
    footnote: "Two notices today, one updated.",
  },
});

export const contractorDuring = ({
  company,
}: {
  company: string;
}): DuringContent => ({
  status: "On site",
  since: "Since 7:52am",
  headline: "You're signed on",
  body: "Level 4 · riser cupboard. Your pass opens the gates and the service lift.",
  /* The three that touch her own floor. The other three are true of
   * the building and she read them at the kiosk. */
  notices: MY_NOTICES,
  passCaption: CONTRACTOR_PASS_CAPTION,
  passRows: [...contractorPassRows(company), CONTRACTOR_PERMIT_ROW],
  changed: {
    at: "Updated · 2:40pm",
    headline: "Something changed on Level 4",
    banner: "The riser is yours for the rest of the day. Nothing to do.",
    notice: {
      category: "Coordination",
      scope: "your floor",
      when: "From 2:40pm",
      title: "The lift technician has left Level 4",
      body: "He has finished in the riser space. You have it to yourself.",
    },
    /* Her permit still runs to five, whatever else moved. */
    stands: [MY_NOTICES[1]],
    footnote: "Three notices today, one updated.",
  },
});

/* -- D0 · on site --------------------------------------------------- */

function OnSiteScreen({ content }: { content: DuringContent }) {
  return (
    <PhoneScreen
      footer={
        /* Nothing here signs her out. Sign-out is a physical event at
         * the reader, so the phone states where it happens rather than
         * offering a button that would let anyone end a visit from
         * anywhere. */
        <Banner tone="neutral">
          Sign out at the lobby tablet on your way out — hold this pass to the
          reader. For security it cannot be done from your phone.
        </Banner>
      }
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          <span className="flex size-5.5 items-center justify-center rounded-full bg-lane-tint">
            <span className="size-2 rounded-full bg-lane-base" />
          </span>
          <span className="font-mono text-xs tracking-[0.14em] text-lane-fill uppercase">
            {content.status}
          </span>
        </span>
        <span className="font-mono text-[13px] text-fg-subtle">
          {content.since}
        </span>
      </div>

      <h2 className="mt-3 text-[29px] leading-tight font-bold tracking-[-0.03em]">
        {content.headline}
      </h2>
      <p className="mt-1.5 text-[15px] leading-normal text-fg-muted">
        {content.body}
      </p>

      <VisitorPassCard
        className="mt-4.5"
        caption={content.passCaption}
        rows={content.passRows}
      />

      <NoticeList className="mt-3.5" notices={content.notices} />

      <p className="mt-3.5 pb-2 text-[15px] leading-normal text-fg-muted">
        We will tell you here if anything about the building changes while you
        are inside.
      </p>
    </PhoneScreen>
  );
}

/* -- D1 · the day changed ------------------------------------------- */

function DayChangedScreen({
  content,
  onBack,
}: {
  content: DuringContent;
  onBack: () => void;
}) {
  const { changed } = content;
  return (
    <PhoneScreen
      footer={
        <>
          <Button size="cta" className="w-full" onClick={onBack}>
            Got it
          </Button>
          <p className="text-center text-[13px] text-fg-subtle">
            {changed.footnote}
          </p>
        </>
      }
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs tracking-[0.14em] text-lane-fill uppercase">
          {changed.at}
        </span>
        <span className="font-mono text-[13px] text-fg-subtle">
          {content.status}
        </span>
      </div>

      <h2 className="mt-3 text-[29px] leading-tight font-bold tracking-[-0.03em]">
        {changed.headline}
      </h2>

      <Banner tone="success" className="mt-4">
        {changed.banner}
      </Banner>

      {/* The changed notice first, then what still stands. */}
      <NoticeList
        className="mt-3.5"
        notices={[changed.notice, ...changed.stands]}
      />

      <p className="mt-3.5 pb-2 text-[15px] leading-normal text-fg-muted">
        Notices are never marked as read — you see the day as it is, every time
        you open this.
      </p>
    </PhoneScreen>
  );
}

/* -- the prototype -------------------------------------------------- */

export function VisitDuring({
  tabs,
  content,
}: {
  tabs: React.ReactNode;
  content: DuringContent;
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
    0: <OnSiteScreen content={content} />,
    1: <DayChangedScreen content={content} onBack={() => goTo(0)} />,
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
