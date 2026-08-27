import * as React from "react";
import { BackButton } from "@/components/back-button";
import { ControlDeck } from "@/components/control-deck";
import { TabletFrame } from "@/components/tablet-frame";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLane } from "@/hooks/use-lane";
import { sentenceCase } from "@/lib/text";
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
  BriefingScreen,
  FirmScreen,
  SIGN_ON_TOTAL,
  TradeDetailsScreen,
  WhoScreen,
} from "@/prototypes/kiosk-contractor-signon";
import { BOOKINGS, type Booking } from "@/prototypes/bookings";
import {
  CodeScreen,
  FindByNameScreen,
} from "@/prototypes/kiosk-find-by-name";
import { KioskLanding } from "@/prototypes/kiosk-landing";
import {
  contractorOnSite,
  KioskOnSite,
} from "@/prototypes/kiosk-onsite";
import { PhotoScreen } from "@/prototypes/kiosk-steps";
import { ScanPanel, useAutoScan } from "@/prototypes/scan-panel";

/* -- the tape ------------------------------------------------------- */

/**
 * "Here to work", on the glass.
 *
 * Behind the door the tablet asks one question — have you worked with
 * us before — and the answer picks the tape. A trade who cleared
 * herself last night holds up her code and is gone in ten seconds; a
 * trade who turns up cold does her firm, her details and the briefing
 * standing here, in that order, because it is the order her phone
 * would have used.
 *
 * Every screen already exists somewhere: the landing and the camera
 * from the visitor journey, the sign-up steps and the briefing from
 * the contractor's own pre-arrival flow. Nothing here is a second
 * drawing of something the product already has.
 *
 * The landing is the platform speaking, so it is green. Everything
 * past the work door is the contractor's own journey — she chose that
 * lane on the previous screen — so the ramp turns orange and stays
 * orange to the pass.
 */
type ScreenId =
  | "landing"
  | "who"
  | "reader"
  | "find"
  | "code"
  | "company"
  | "details"
  | "briefing"
  | "photo"
  | "on-site";

type TapeStep = { id: ScreenId; label: string };

/** What one of the two page-slide slots is showing. */
type Slot = { index: number; id: ScreenId } | null;

/** Which tape the answer to "have you been here before" picks. */
type Route = "unchosen" | "returning" | "first-time";

const WHO: TapeStep = { id: "who", label: "which one" };
const PHOTO: TapeStep = { id: "photo", label: "your photo" };
const ON_SITE: TapeStep = { id: "on-site", label: "on site" };

const ROUTE_TAPE: Record<Route, readonly TapeStep[]> = {
  unchosen: [WHO],
  /* Find-by-name is not a step after the reader, it is the way round
   * it: scanning jumps the two, exactly as the visitor's scan path
   * jumps them. Both ways converge on the photo. */
  returning: [
    WHO,
    { id: "reader", label: "the reader" },
    { id: "find", label: "finding your job" },
    { id: "code", label: "the code" },
    PHOTO,
    ON_SITE,
  ],
  "first-time": [
    WHO,
    { id: "company", label: "your company" },
    { id: "details", label: "your details" },
    { id: "briefing", label: "the briefing" },
    PHOTO,
    ON_SITE,
  ],
};

/** Opened by a door on someone else's landing, the landing is already
 *  behind us; as its own tab it is where the walkthrough starts. */
const LANDING: TapeStep = { id: "landing", label: "the landing" };

/** Who is at the glass. The same job Dan's email was about. */
const TRADE = {
  firstName: "Priya",
  company: REGISTERED[0].name,
} as const;

/** What the reader settles, before it has read anything. */
const WILL_CHECK = [
  {
    title: "Who you are",
    body: "Read off the pass. Nothing to type, nothing to spell out.",
  },
  {
    title: "Induction",
    body: "That it is still current for this site. You did it once; we kept it.",
  },
  {
    title: "Permits",
    body: "Anything open against today's work, and who signed it.",
  },
];

/* -- W1 · the reader ------------------------------------------------ */

function ReaderScreen({
  active,
  onBack,
  onScanned,
  onFindByName,
}: {
  active: boolean;
  /** Back goes to whichever landing we came in through — ours, or the
   *  tab that opened us. */
  onBack: () => void;
  onScanned: () => void;
  onFindByName: () => void;
}) {
  const { capturing, readNow } = useAutoScan(active, onScanned);

  return (
    /* The scanner's own proportions: viewfinder and instruction side by
     * side across the full glass, as on the visitor path. */
    <div className="flex min-h-0 flex-1 flex-col px-10 pt-5 pb-7">
      <div className="flex items-center justify-between gap-6">
        <BackButton onClick={onBack} />
        <div className="flex items-center gap-4">
          <span className="font-mono text-[13px] tracking-[0.14em] text-lane-fill uppercase">
            {capturing ? "Pass read" : "Waiting for a pass"}
          </span>
          <span className="h-4.5 w-px bg-line" />
          <span className="text-[15px] text-fg-subtle">Tue 9 Sept</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-12">
        <ScanPanel capturing={capturing} onRead={readNow} />

        <div className="min-w-0 flex-1">
          <h2 className="text-[40px] leading-[1.08] font-bold tracking-[-0.03em]">
            Hold your pass to the reader
          </h2>
          <p className="mt-3 max-w-[34ch] text-[19px] leading-normal text-fg-muted">
            The QR from your clearance email, or the one you were issued on an
            earlier job here. Wallet, screen or paper — all fine.
          </p>

          <div className="mt-5 flex flex-col gap-2.5">
            {WILL_CHECK.map((item) => (
              <div key={item.title} className="flex items-baseline gap-3.5">
                <span className="w-32 flex-none text-[15px] font-semibold">
                  {item.title}
                </span>
                <span className="min-w-0 flex-1 text-[15px] leading-normal text-fg-subtle">
                  {item.body}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2.5">
            <span className="size-2.5 flex-none rounded-full bg-lane-base" />
            <span className="font-mono text-[13px] tracking-[0.14em] text-lane-fill uppercase">
              {capturing
                ? "Got it · checking your clearance"
                : "Reader is lit · scanning"}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* The same escape the visitor's scanner offers, in the same
        * place: a lost pass is the common case, not an error. */}
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

export function KioskContractor({
  tabs,
  onExit,
}: {
  tabs: React.ReactNode;
  /** Set when the flow was opened by another tab's landing, so back
   *  and the reset both return there instead of to our own. */
  onExit?: () => void;
}) {
  const [route, setRoute] = React.useState<Route>("unchosen");
  /** The firm she picks, or types. Empty until the company step. */
  const [company, setCompany] = React.useState<Company>(BLANK);
  /**
   * Which door off the landing she came through, which settles two
   * things.
   *
   * Back: the reader can be reached by the question or by the pass
   * shortcut that skips it, and Back has to return through the one she
   * used — the screen before it on the tape is not the screen she was
   * looking at.
   *
   * Lane: "Here to work" is her choosing the contractor lane, so
   * everything behind it is orange. Holding up a pass she already has
   * is the platform doing its job for anyone — same as the visitor
   * kiosk's own scan path — so that way through stays green.
   */
  const [door, setDoor] = React.useState<"work" | "pass">("work");
  /** Which expected job the find-by-name path is verifying. */
  const [booking, setBooking] = React.useState<Booking>(BOOKINGS[0]);
  /** Her own fields, in the shape the phone's sign-up uses too, so
   *  the two doors are filling in one record. */
  const [person, setPerson] = React.useState<Person>(BLANK_PERSON);
  const firstName = person.first.trim() || TRADE.firstName;

  /** The tape for a route, with the landing in front of it when this
   *  tab is the one that draws the landing. */
  const tapeFor = (next: Route) =>
    onExit ? ROUTE_TAPE[next] : [LANDING, ...ROUTE_TAPE[next]];
  const tape = tapeFor(route);
  /** Screens address each other by name: the same screen sits at a
   *  different number on each tape. */
  const indexOf = (id: ScreenId) => tape.findIndex((entry) => entry.id === id);

  const [step, setStep] = React.useState(0);

  /* Which lane the glass is speaking in. The landing offers every
   * lane, so it belongs to the house; behind the work door she has
   * already chosen, and the screens are hers. */
  const { setLane } = useLane();
  const platform = tape[step].id === "landing" || door === "pass";
  React.useEffect(
    () => setLane(platform ? "house" : "contractor"),
    [platform, setLane],
  );

  /* transitions.dev · 08 · Page side-by-side. A slot holds the screen
   * it is showing, not just its index: picking a door changes the
   * tape's length, and the screen sliding out has to keep rendering
   * even when its index no longer exists on the new tape. */
  const [slots, setSlots] = React.useState<[Slot, Slot]>([
    { index: 0, id: onExit ? WHO.id : LANDING.id },
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

  /* Picking a door lengthens the tape, so the route moves with the
   * step — same hand-off as the phone's kiosk flow. */
  const goTo = (next: number, nextRoute: Route = route) => {
    if (next === step && nextRoute === route) return;
    const targetId = activeId === 1 ? 2 : 1;
    const slot: Slot = { index: next, id: tapeFor(nextRoute)[next].id };
    setDirection(next > step ? 1 : -1);
    setSlots(targetId === 1 ? [slot, slots[1]] : [slots[0], slot]);
    setPendingId(targetId);
    setRoute(nextRoute);
    setStep(next);
  };

  /**
   * Back walks the tape, never the history: from any screen it is the
   * screen before it in this journey, whichever door got you here. It
   * only leaves the flow from the first screen, where there is nothing
   * before it — and then it goes back to the tab that opened us.
   */
  const backFrom = (index: number, nextRoute?: Route) => () => {
    if (index > 0) {
      goTo(index - 1, nextRoute ?? route);
      return;
    }
    onExit?.();
  };

  /** The kiosk resets to whatever it was showing before this trade,
   *  forgetting which door she came through. */
  const reset = () => {
    setDoor("work");
    setCompany(BLANK);
    setPerson(BLANK_PERSON);
    if (onExit) {
      onExit();
      return;
    }
    goTo(0, "unchosen");
  };

  /* The deck has to be able to advance even while the door is
   * unchosen, so it walks the first-timer branch by default — that is
   * the longer journey and the one worth watching. */
  const deckRoute: Route = route === "unchosen" ? "first-time" : route;
  const deckTape = tapeFor(deckRoute);
  const last = step === deckTape.length - 1;
  const incomingId = pendingId ?? activeId;
  const fromX = (id: 1 | 2) =>
    (id === incomingId ? direction : -direction) === 1
      ? "var(--page-slide-distance)"
      : "calc(var(--page-slide-distance) * -1)";

  const screenFor = ({ index, id }: NonNullable<Slot>): React.ReactNode => {
    switch (id) {
      /* The same landing the visitor journey opens on. The work door
       * asks who she is; the pass shortcut is the same promise a
       * returning trade makes, so it skips the question and goes
       * straight to the reader. The rest belong to other tabs and
       * stay inert. */
      case "landing":
        return (
          <KioskLanding
            onWork={() => {
              setDoor("work");
              goTo(index + 1);
            }}
            onScan={() => {
              setDoor("pass");
              goTo(index + 2, "returning");
            }}
          />
        );
      /* One question, two big doors. Everything after it differs. */
      case "who":
        return (
          <WhoScreen
            onFirstTime={() => goTo(index + 1, "first-time")}
            onReturning={() => goTo(index + 1, "returning")}
            onBack={backFrom(index, "unchosen")}
          />
        );
      case "company":
        return (
          <FirmScreen
            company={company}
            onChange={setCompany}
            onContinue={() => goTo(index + 1)}
            onBack={backFrom(index, "unchosen")}
          />
        );
      case "details":
        return (
          <TradeDetailsScreen
            company={company}
            person={person}
            onChange={setPerson}
            onContinue={() => goTo(index + 1)}
            onBack={backFrom(index)}
          />
        );
      case "briefing":
        return (
          <BriefingScreen
            active={step === index}
            onContinue={() => goTo(index + 1)}
            onBack={backFrom(index)}
          />
        );
      case "reader":
        return (
          <ReaderScreen
            active={step === index}
            /* Straight in off the landing means straight back out to
             * it, with the doors open again. */
            onBack={
              door === "pass" && !onExit
                ? () => goTo(indexOf("landing"), "unchosen")
                : backFrom(index)
            }
            /* A pass that reads skips the two screens that exist to
             * do without one. */
            onScanned={() => goTo(indexOf("photo"))}
            onFindByName={() => goTo(index + 1)}
          />
        );
      /* X1 · the masked list, and X2/X3 · the code to her own inbox.
       * The visitor lane's screens, unchanged apart from the noun. */
      case "find":
        return (
          <FindByNameScreen
            entity={{ one: "job", many: "jobs" }}
            onBack={backFrom(index)}
            onPick={(picked) => {
              setBooking(picked);
              goTo(index + 1);
            }}
          />
        );
      case "code":
        return (
          <CodeScreen
            active={step === index}
            booking={booking}
            onBack={backFrom(index)}
            onVerified={() => goTo(index + 1)}
            onGiveUp={reset}
          />
        );
      case "photo":
        return (
          <PhotoScreen
            active={step === index}
            /* The sign-on numbers its four steps, so the photo is the
             * last of them. A returning trade only held up a pass, so
             * there is no count for the label to belong to. */
            step={
              route === "first-time"
                ? `${SIGN_ON_TOTAL} of ${SIGN_ON_TOTAL}`
                : null
            }
            /* Back from the photo is the reader, whichever way she
             * got past it — the code screen is not somewhere to
             * return to once it has let her through. */
            onBack={
              route === "returning"
                ? () => goTo(indexOf("reader"))
                : backFrom(index)
            }
            onDone={() => goTo(index + 1)}
          />
        );
      /* Studies 4a / 4b / 4c: notices, the way, the pass. Three pages
       * inside one step, because it is one arrival. */
      case "on-site":
        return (
          <KioskOnSite
            active={step === index}
            content={contractorOnSite({
              firstName,
              company: company.name || TRADE.company,
            })}
            onDone={reset}
          />
        );
    }
  };

  return (
    <div className="w-full">
      <TabletFrame>
        <div
          className="t-page-slide min-h-0 flex-1"
          data-page={String(activeId)}
        >
          {([1, 2] as const).map((id) => {
            const slot = id === 1 ? slots[0] : slots[1];
            return (
              <section
                key={id}
                className="t-page flex flex-col"
                data-page-id={String(id)}
                style={{ "--t-page-from-x": fromX(id) } as React.CSSProperties}
                aria-hidden={id !== activeId}
              >
                {slot === null ? null : screenFor(slot)}
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
                {deckTape.length}
              </span>
              <span className="h-4.5 w-px flex-none bg-line" />
              <span className="truncate text-sm text-fg-muted">
                Current · {tape[step].label}
              </span>
            </div>
            <button
              onClick={() =>
                last ? goTo(0, "unchosen") : goTo(step + 1, deckRoute)
              }
              className="flex flex-none items-center gap-2 rounded-full bg-lane-tint px-4 py-2 text-sm font-semibold text-lane-fill transition-colors duration-fast ease-out-quad hover:bg-lane-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {last ? "Replay" : sentenceCase(deckTape[step + 1].label)}
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
