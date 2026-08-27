import * as React from "react";
import { ControlDeck } from "@/components/control-deck";
import { NoticeList } from "@/components/notice";
import { PhoneFrame, PhoneScreen } from "@/components/phone-frame";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { sentenceCase } from "@/lib/text";
import { QuestionOption } from "@/prototypes/briefing-question";
import {
  askLine,
  optionState,
  PASS_MARK,
  QUESTIONS,
  RESPONSIBILITIES,
  useBriefing,
} from "@/prototypes/contractor-briefing";
import {
  Footnote,
  Mono,
  StepBar,
  StepCount,
  StepHeader,
} from "@/prototypes/contractor-chrome";
import {
  BLANK,
  REGISTERED,
  type Company,
} from "@/prototypes/contractor-firms";
import {
  BLANK_PERSON,
  type Person,
} from "@/prototypes/contractor-person";
import {
  CompanyScreen,
  PersonScreen,
  SignedUpScreen,
} from "@/prototypes/contractor-signup";
import {
  CONTRACTOR_PASS_CAPTION,
  contractorPassRows,
  VisitorPassCard,
} from "@/prototypes/visitor-pass";

/* -- the tape ------------------------------------------------------- */

/**
 * Contractor pre-arrival, from the C1–C4 studies: the clearance
 * arrives as an email from her own employer, and she is cleared before
 * she leaves the depot.
 *
 * The variants chosen are the ones the studies themselves describe as
 * the visitor lane's patterns moved into the contractor lane — C1D's
 * letter from a person, C2C's job-as-a-ticket, C3A's one question per
 * screen, C4C's status line and QR card — so the two lanes read as one
 * product in two colours.
 *
 * The email is the front door, and the address it was sent to is the
 * lookup key: the link resolves, the site checks that address against
 * its own records, and the flow it opens is a different length
 * depending on the answer. A trade the site knows walks the studies'
 * three steps. A first-timer picks up sign-up on the way — the same
 * three, with the firm and her own details in front of them.
 */

type ScreenId =
  | "email"
  | "job"
  | "company"
  | "details"
  | "signed-up"
  | "briefing"
  | "cleared";

type TapeStep = { id: ScreenId; label: string };

/** The email is step zero — it is not the site's screen, so it is not
 *  counted. Everything after it is numbered against the tape's length,
 *  which is why the counter cannot be a constant. */
const TAPE: Record<"known" | "first-time", readonly TapeStep[]> = {
  known: [
    { id: "email", label: "Dan's email" },
    { id: "job", label: "the job" },
    { id: "briefing", label: "the briefing" },
    { id: "cleared", label: "cleared" },
  ],
  "first-time": [
    { id: "email", label: "Dan's email" },
    { id: "job", label: "the job" },
    { id: "company", label: "your company" },
    { id: "details", label: "your details" },
    { id: "signed-up", label: "signed up" },
    { id: "briefing", label: "the briefing" },
    { id: "cleared", label: "cleared" },
  ],
};

/** Both tabs are the same person and the same email. The only thing
 *  that differs is whether the site has seen her before, which is the
 *  whole point of the branch. */
const TRADE = {
  firstName: "Priya",
  lastName: "Raman",
  email: "priya.raman@kellyelec.com.au",
  trade: "Electrical",
} as const;

/* -- C1D · the email that lands ------------------------------------- */

function EmailScreen({
  known,
  onStart,
}: {
  /** Whether the address this was sent to is already on file. The
   *  reader never sees the check — she sees a shorter or a longer
   *  job ahead of her. */
  known: boolean;
  onStart: () => void;
}) {
  return (
    <PhoneScreen
      bodyClassName="px-5.5 pt-3.5 pb-2"
      footer={
        <>
          <Button size="cta" className="w-full" onClick={onStart}>
            Get cleared · {known ? 3 : 5} min
          </Button>
          <Footnote>Or do it at the tablet tomorrow, standing up.</Footnote>
        </>
      }
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[15px] font-semibold text-lane-fill">
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
        <span className="font-mono text-xs text-fg-subtle">Mon 6:38pm</span>
      </div>

      <h2 className="mt-4 border-t border-line pt-4 text-[21px] leading-tight font-bold tracking-[-0.02em]">
        Rushcutters Tower tomorrow — clear yourself tonight
      </h2>

      <div className="mt-4 flex items-center gap-3">
        <span className="flex size-10 flex-none items-center justify-center rounded-full bg-lane-tint text-sm font-semibold text-lane-fill">
          DK
        </span>
        <div className="min-w-0">
          <div className="text-base font-semibold">Dan Kelly</div>
          <div className="truncate text-sm text-fg-subtle">
            to {TRADE.email}
          </div>
        </div>
      </div>

      {/* The persuading is done by a person she works for, not by a
        * building she has never worked in. */}
      <div className="mt-4.5 flex flex-col gap-3.5 text-base leading-relaxed text-fg-muted">
        <p>Priya,</p>
        <p>
          You're on the Rushcutters job tomorrow, Level 4 lighting. It's a site
          that inducts trades before they turn up — do it tonight from your
          phone and the lobby tablet only needs a scan in the morning.
        </p>
        <p>
          {known
            ? "You've worked this one before so they already have you — Dock off Neild Ave, I'll be there from 7:45."
            : "First time only. Dock off Neild Ave, I'll be there from 7:45."}
        </p>
        <p>Dan</p>
      </div>

      <div className="mt-4.5 flex items-center gap-3.5 rounded-lg border border-line px-4 py-3.5">
        <span className="flex size-9.5 flex-none items-center justify-center rounded-md bg-lane-tint">
          <span className="size-3.5 rounded-[4px] border-2 border-lane-base" />
        </span>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold">Tuesday 9 Sept, 8:00am</div>
          <div className="mt-0.5 font-mono text-[13px] text-fg-subtle">
            KE-20418 · Level 4
          </div>
        </div>
      </div>

      <p className="mt-3.5 pb-2 text-[13px] leading-normal text-fg-subtle">
        Sent by Kelly Electrical dispatch. Clearance is run by Rushcutters
        Tower.
      </p>
    </PhoneScreen>
  );
}

/* -- C2C · what the link opens · 1 of 3 ----------------------------- */

function JobScreen({
  known,
  company,
  onContinue,
  onBack,
  step,
  total,
}: {
  known: boolean;
  company: Company;
  onContinue: () => void;
  onBack: () => void;
  step: number;
  total: number;
}) {
  return (
    <>
      <StepBar step={step} total={total} />
      <PhoneScreen
        bodyClassName="px-5 pt-4 pb-2"
        footer={
          <>
            <Button size="cta" className="w-full" onClick={onContinue}>
              {known ? "Get cleared · 3 min" : "Set me up · 5 min"}
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
        <StepHeader step={step} total={total} />

        <div className="mt-4 overflow-hidden rounded-xl border border-line">
          <div className="bg-lane-tint px-5.5 py-5">
            <Mono className="text-lane-fill" size="text-[11px]">
              Your job on site
            </Mono>
            <div className="mt-2 text-[26px] leading-tight font-bold tracking-[-0.025em]">
              Tuesday 9 Sept, 8:00am
            </div>
          </div>
          <div className="flex flex-col gap-3.5 px-5.5 py-4.5">
            {[
              {
                label: "Trade",
                value: `${TRADE.firstName} ${TRADE.lastName} · ${TRADE.trade}`,
              },
              { label: "Work", value: "Rushcutters Tower, Level 4" },
              { label: "Job", value: "KE-20418", mono: true },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4"
              >
                <span className="text-sm text-fg-subtle">{row.label}</span>
                <span
                  className={
                    row.mono
                      ? "font-mono text-[15px] font-medium"
                      : "text-base font-semibold text-right"
                  }
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* The lookup, said out loud. The site checked the address the
          * link was sent to, and this is the only place the answer
          * changes what she is asked for. */}
        <p className="mt-5 text-[15px] leading-normal text-fg-muted">
          {known
            ? "Clearing now means the lobby tablet only needs a scan when you arrive — about ten seconds. Doing it there instead takes three minutes, standing."
            : "Clearing now means the lobby tablet only needs a scan when you arrive. Because this is your first job on the network, we need your firm and your own details before the briefing."}
        </p>

        <Banner tone={known ? "success" : "info"} className="mt-3.5">
          {known
            ? `We already have you and ${company.name} on file — straight to the briefing.`
            : "First time on the network. Two screens, once ever — your next site starts at the briefing."}
        </Banner>
      </PhoneScreen>
    </>
  );
}

/* -- C3A · safety · once ever · 2 of 3 ------------------------------ */

type Phase = "briefing" | "asking" | "result";

function SafetyScreen({
  onContinue,
  onBack,
  step,
  total,
}: {
  onContinue: () => void;
  onBack: () => void;
  step: number;
  total: number;
}) {
  const [phase, setPhase] = React.useState<Phase>("briefing");
  const quiz = useBriefing();
  const {
    deck,
    index,
    question,
    picked,
    score,
    answered,
    atLast,
    answer,
  } = quiz;

  const next = () => {
    if (quiz.next()) setPhase("result");
  };

  const retake = () => {
    quiz.retake();
    setPhase("briefing");
  };

  if (phase === "briefing") {
    return (
      <>
        <StepBar step={step} total={total} />
        <PhoneScreen
          footer={
            <>
              <Button
                size="cta"
                className="w-full"
                onClick={() => setPhase("asking")}
              >
                Start · {QUESTIONS.length} questions
              </Button>
              <Button
                size="cta"
                variant="secondary"
                className="w-full"
                onClick={onBack}
              >
                Back
              </Button>
            </>
          }
        >
          <div className="flex items-center justify-between">
            <Mono className="text-lane-fill" size="text-[11px]">
              The briefing
            </Mono>
            <StepCount step={step} total={total} />
          </div>

          <h2 className="mt-4 text-[24px] leading-[1.2] font-bold tracking-[-0.025em]">
            I understand that I am responsible for protecting electronic
            information as follows
          </h2>

          <ol className="mt-4 flex flex-col gap-3">
            {RESPONSIBILITIES.map((item, i) => (
              <li
                key={item}
                className="flex gap-3 rounded-lg border border-line px-4 py-3.5"
              >
                <span className="font-mono text-[13px] text-lane-fill">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] leading-normal text-fg-muted">
                  {item}
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-4 pb-2 text-sm leading-normal text-fg-subtle">
            Then {QUESTIONS.length} questions about it, sitting down, in work
            time. {PASS_MARK} of {QUESTIONS.length} to pass — the same briefing
            the lobby tablet gives, so answering here means it never asks again.
          </p>
        </PhoneScreen>
      </>
    );
  }

  if (phase === "result") {
    const { passed } = quiz;
    return (
      <>
        <StepBar step={step} total={total} />
        <PhoneScreen
          footer={
            passed ? (
              <Button size="cta" className="w-full" onClick={onContinue}>
                Continue
              </Button>
            ) : (
              <>
                <Button size="cta" className="w-full" onClick={retake}>
                  Read it again
                </Button>
                <Footnote>
                  The questions come back in a different order.
                </Footnote>
              </>
            )
          }
        >
          <div className="flex items-center justify-between">
            <Mono
              className={passed ? "text-success" : "text-danger"}
              size="text-[11px]"
            >
              {passed ? "Passed" : "Not yet"}
            </Mono>
            <StepCount step={step} total={total} />
          </div>

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
            <span
              className={`font-mono text-6xl font-bold ${
                passed ? "text-success" : "text-danger"
              }`}
            >
              {score}
              <span className="text-fg-subtle">/{QUESTIONS.length}</span>
            </span>
            <h2 className="mt-5 text-[26px] leading-tight font-bold tracking-[-0.025em]">
              {passed
                ? "That's the security briefing done"
                : `You need ${PASS_MARK} of ${QUESTIONS.length}`}
            </h2>
            <p className="mt-2.5 max-w-[30ch] text-[15px] leading-normal text-fg-muted">
              {passed
                ? "Recorded against your name and tonight's version of the content. You will not be asked again for this site."
                : "Nothing is held against you — read the five points again and answer them once more."}
            </p>
          </div>
        </PhoneScreen>
      </>
    );
  }

  return (
    <>
      <StepBar step={step} total={total} />
      <PhoneScreen
        footer={
          answered ? (
            <Button size="cta" className="w-full" onClick={next}>
              {atLast ? "See how you did" : "Next question"}
            </Button>
          ) : (
            <Footnote>
              No time limit. {PASS_MARK} of {QUESTIONS.length} to pass.
            </Footnote>
          )
        }
      >
        <div className="flex items-center justify-between">
          <Mono className="text-lane-fill" size="text-[11px]">
            Question {index + 1} of {deck.length}
          </Mono>
          <StepCount step={step} total={total} />
        </div>

        <h2 className="mt-4 text-[26px] leading-[1.18] font-bold tracking-[-0.028em]">
          {question.situation}
        </h2>
        <p className="mt-2.5 text-base leading-normal text-fg-subtle">
          {askLine({
            ask: question.ask,
            answered,
            left: deck.length - index - 1,
          })}
        </p>

        {/* The same option component the glass uses, at phone scale:
          * the rule opens inside the card she tapped rather than in a
          * banner underneath the whole list. */}
        <div className="mt-5 flex flex-col gap-3 pb-2">
          {question.options.map((option) => (
            <QuestionOption
              key={option.text}
              option={option}
              state={optionState(option, picked)}
              rule={question.rule}
              scale="phone"
              onSelect={() => answer(option)}
            />
          ))}
        </div>
      </PhoneScreen>
    </>
  );
}

/* -- C4C · cleared, the night before · 3 of 3 ----------------------- */

function ClearedScreen({
  firstName,
  company,
  step,
  total,
}: {
  firstName: string;
  company: Company;
  step: number;
  total: number;
}) {
  return (
    <>
      <StepBar step={step} total={total} />
      <PhoneScreen
        footer={
          <>
            <Button size="cta" variant="secondary" className="w-full">
              Add to wallet
            </Button>
            <Footnote>Lost it? The lobby tablet finds you by name.</Footnote>
          </>
        }
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-5.5 items-center justify-center rounded-full bg-(--eco-green-tint)">
            <span className="size-2 rounded-full bg-success" />
          </span>
          <Mono className="text-success" size="text-[13px]">
            Cleared · Tue 8:00am
          </Mono>
        </div>

        <h2 className="mt-3 text-[32px] leading-[1.08] font-bold tracking-[-0.032em]">
          You're cleared, {firstName}
        </h2>
        <p className="mt-2 text-base leading-normal text-fg-muted">
          Scan this at the lobby tablet tomorrow. Nothing else to do tonight.
        </p>

        {/* The same pass component the visitor lane issues — different
          * facts, identical object. */}
        <VisitorPassCard
          className="mt-3.5"
          qrSize={158}
          caption={CONTRACTOR_PASS_CAPTION}
          rows={contractorPassRows(company.name)}
        />

        <div className="mt-3.5">
          <Mono size="text-[10px]">What's true on site tonight</Mono>
        </div>
        <NoticeList className="mt-2 pb-2" />
      </PhoneScreen>
    </>
  );
}

/* -- the prototype -------------------------------------------------- */

export function ContractorPrearrival({
  tabs,
  known,
}: {
  tabs: React.ReactNode;
  /** The result of the lookup on the address Dan's link was sent to.
   *  In the product this is a query; here it is the tab you picked. */
  known: boolean;
}) {
  const tape = TAPE[known ? "known" : "first-time"];
  /** The email is not one of the site's screens, so it is not counted. */
  const total = tape.length - 1;

  const [step, setStep] = React.useState(0);
  /** Known trades arrive with their firm already filled in. A
   *  first-timer's is empty until she looks it up in sign-up. */
  const [company, setCompany] = React.useState<Company>(
    known ? REGISTERED[0] : BLANK,
  );
  /**
   * Her own fields, held here rather than inside the details screen,
   * because the pass, the cleared screen and the tablet all read the
   * same record. One shape, `Person`, shared with the kiosk.
   *
   * A known trade arrives with hers already on file; a first-timer's
   * is empty apart from the address Dan's link was sent to, which is
   * how the site looked her up in the first place.
   */
  const [person, setPerson] = React.useState<Person>(
    known
      ? {
          ...BLANK_PERSON,
          first: TRADE.firstName,
          last: TRADE.lastName,
          email: TRADE.email,
        }
      : { ...BLANK_PERSON, email: TRADE.email },
  );
  const firstName = person.first.trim() || TRADE.firstName;

  /* transitions.dev · 08 · Page side-by-side. */
  const [slots, setSlots] = React.useState<[number | null, number | null]>([
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

  const goTo = (next: number) => {
    if (next === step) return;
    const targetId = activeId === 1 ? 2 : 1;
    setDirection(next > step ? 1 : -1);
    setSlots(targetId === 1 ? [next, slots[1]] : [slots[0], next]);
    setPendingId(targetId);
    setStep(next);
  };

  const last = step === tape.length - 1;
  const incomingId = pendingId ?? activeId;
  const fromX = (id: 1 | 2) =>
    (id === incomingId ? direction : -direction) === 1
      ? "var(--page-slide-distance)"
      : "calc(var(--page-slide-distance) * -1)";

  /** Screens are addressed by what they are, not by an index, because
   *  the same screen sits at a different number on each tape. */
  const screenFor = (index: number): React.ReactNode => {
    const props = { step: index, total };
    switch (tape[index].id) {
      case "email":
        return <EmailScreen known={known} onStart={() => goTo(index + 1)} />;
      case "job":
        return (
          <JobScreen
            known={known}
            company={company}
            onContinue={() => goTo(index + 1)}
            onBack={() => goTo(index - 1)}
            {...props}
          />
        );
      case "company":
        return (
          <CompanyScreen
            company={company}
            onChange={setCompany}
            onContinue={() => goTo(index + 1)}
            onBack={() => goTo(index - 1)}
            {...props}
          />
        );
      case "details":
        return (
          <PersonScreen
            company={company}
            person={person}
            onChange={setPerson}
            onContinue={() => goTo(index + 1)}
            onBack={() => goTo(index - 1)}
            {...props}
          />
        );
      case "signed-up":
        return (
          <SignedUpScreen
            firstName={firstName}
            company={company}
            onContinue={() => goTo(index + 1)}
            {...props}
          />
        );
      case "briefing":
        return (
          <SafetyScreen
            onContinue={() => goTo(index + 1)}
            onBack={() => goTo(index - 1)}
            {...props}
          />
        );
      case "cleared":
        return (
          <ClearedScreen
            firstName={firstName}
            company={company}
            {...props}
          />
        );
    }
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
                {slotStep === null ? null : screenFor(slotStep)}
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
                {tape.length}
              </span>
              <span className="h-4.5 w-px flex-none bg-line" />
              <span className="truncate text-sm text-fg-muted">
                Current · {tape[step].label}
              </span>
            </div>
            <button
              onClick={() => goTo(last ? 0 : step + 1)}
              className="flex flex-none items-center gap-2 rounded-full bg-lane-tint px-4 py-2 text-sm font-semibold text-lane-fill transition-colors duration-fast ease-out-quad hover:bg-lane-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {last ? "Replay" : sentenceCase(tape[step + 1].label)}
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
