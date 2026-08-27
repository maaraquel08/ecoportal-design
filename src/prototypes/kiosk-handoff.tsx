import * as React from "react";
import { ControlDeck } from "@/components/control-deck";
import { useLane, type Lane } from "@/hooks/use-lane";
import { PhoneFrame, PhoneScreen } from "@/components/phone-frame";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import {
  ExitIcon,
  PersonIcon,
  ToolboxIcon,
} from "@/prototypes/kiosk-icons";
import {
  DetailsScreen,
  Footnote,
  NoticesScreen,
  PassScreen,
} from "@/prototypes/visitor-steps";
import { VisitorPassCard } from "@/prototypes/visitor-pass";

/* -- the routes ----------------------------------------------------- */

/**
 * The kiosk's hand-off: scan the QR and finish on your own phone
 * instead of the tablet. Same three routes the tablet landing offers,
 * minus the two things a phone must not do — it cannot photograph you
 * for the pass, and it cannot sign you out.
 */
type Route = "menu" | "visiting" | "work" | "leaving";

/**
 * A route is a lane. The menu is the platform speaking, so it stays
 * green; picking a door hands the screen to that lane, exactly as the
 * tablet landing does.
 */
const ROUTE_LANE: Record<Route, Lane> = {
  menu: "house",
  visiting: "visitor",
  work: "contractor",
  leaving: "exit",
};

const ROUTE_STEPS: Record<Route, readonly string[]> = {
  menu: ["on your phone"],
  visiting: ["on your phone", "your details", "today's notices", "your pass"],
  work: ["on your phone", "at the tablet"],
  leaving: ["on your phone", "signing out"],
};

function sentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* -- H0 · the menu -------------------------------------------------- */

function RouteCard({
  icon,
  tone,
  title,
  body,
  onClick,
}: {
  icon: React.ReactNode;
  tone: string;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3.5 rounded-lg border border-line px-4 py-4 text-left transition-colors duration-fast ease-out-quad hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span
        className={`flex size-11 flex-none items-center justify-center rounded-md ${tone}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[19px] font-semibold tracking-[-0.015em]">
          {title}
        </span>
        <span className="mt-0.5 block text-sm leading-normal text-fg-subtle">
          {body}
        </span>
      </span>
    </button>
  );
}

function MenuScreen({ onPick }: { onPick: (route: Route) => void }) {
  return (
    <PhoneScreen>
      <span className="font-mono text-xs tracking-[0.14em] text-lane-fill uppercase">
        Rushcutters Tower · kiosk 3
      </span>
      <h2 className="mt-3 text-[29px] leading-tight font-bold tracking-[-0.03em]">
        Which one are you today?
      </h2>
      <p className="mt-1.5 text-[15px] leading-normal text-fg-muted">
        Thursday 11 September · 2:04pm
      </p>

      {/* The lane each route belongs to, same as the tablet landing. */}
      <div className="mt-4.5 flex flex-col gap-3">
        <RouteCard
          icon={<PersonIcon size={22} />}
          tone="bg-visitor-tint text-visitor-base"
          title="Visiting someone"
          body="A meeting, an interview, or dropping something off to a person in the building."
          onClick={() => onPick("visiting")}
        />
        <RouteCard
          icon={<ToolboxIcon size={22} />}
          tone="bg-contractor-tint text-contractor-base"
          title="Here to work"
          body="Trade, contractor or maintenance. We will check your induction and permits."
          onClick={() => onPick("work")}
        />
        <RouteCard
          icon={<ExitIcon size={22} />}
          tone="bg-exit-tint text-exit-base"
          title="Leaving"
          body="Your pass signs you out at the lobby tablet."
          onClick={() => onPick("leaving")}
        />
      </div>
    </PhoneScreen>
  );
}

/* -- H · here to work ----------------------------------------------- */

/**
 * The one route the hand-off cannot finish. Induction and permits are
 * checked in person and the permit prints at the desk, so the phone
 * says so plainly rather than starting something it cannot complete.
 */
function AtTheTabletScreen({ onBack }: { onBack: () => void }) {
  return (
    <PhoneScreen
      footer={
        <>
          <Button
            size="cta"
            variant="outline"
            className="w-full"
            onClick={onBack}
          >
            Back
          </Button>
          <Footnote>
            The tablet takes about four minutes for a first sign-on.
          </Footnote>
        </>
      }
    >
      <span className="font-mono text-xs tracking-[0.14em] text-lane-fill uppercase">
        Here to work
      </span>
      <h2 className="mt-3 text-[29px] leading-tight font-bold tracking-[-0.03em]">
        Sign on at the lobby tablet
      </h2>
      <p className="mt-1.5 text-[15px] leading-normal text-fg-muted">
        Your induction and permits are checked before you go up, and your
        permit prints at the desk.
      </p>

      <div className="mt-4.5 flex flex-col gap-3">
        {[
          {
            title: "Induction",
            body: "We check it is current for this site, and run it if it is not.",
          },
          {
            title: "Permits",
            body: "Hot works, working at height and isolations are signed on the glass.",
          },
          {
            title: "Escort",
            body: "If the work needs one, the tablet tells you who is meeting you.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-line px-4 py-3.5"
          >
            <div className="text-base font-semibold">{item.title}</div>
            <div className="mt-0.5 text-sm leading-normal text-fg-subtle">
              {item.body}
            </div>
          </div>
        ))}
      </div>

      <Banner tone="neutral" className="mt-3.5">
        Contractor sign-on cannot be completed on a phone.
      </Banner>
    </PhoneScreen>
  );
}

/* -- H · leaving ---------------------------------------------------- */

function SigningOutScreen({ onBack }: { onBack: () => void }) {
  return (
    <PhoneScreen
      footer={
        <>
          <Button
            size="cta"
            variant="outline"
            className="w-full"
            onClick={onBack}
          >
            Back
          </Button>
          <Footnote>
            Lost your pass? Reception can sign you out at the desk.
          </Footnote>
        </>
      }
    >
      <span className="font-mono text-xs tracking-[0.14em] text-lane-fill uppercase">
        Signing out
      </span>
      <h2 className="mt-3 text-[29px] leading-tight font-bold tracking-[-0.03em]">
        Sign out at the lobby tablet
      </h2>
      <p className="mt-1.5 text-[15px] leading-normal text-fg-muted">
        Hold this pass to the reader on your way past. It takes a second, and
        it is what takes you off the building's list.
      </p>

      <VisitorPassCard className="mt-4.5" />

      {/* The same rule as the on-site screen: leaving is a physical
        * event at the reader, so nothing here ends the visit. */}
      <Banner tone="neutral" className="mt-3.5">
        For security a visit cannot be ended from a phone. The reader has to
        see the pass.
      </Banner>
    </PhoneScreen>
  );
}

/* -- the prototype -------------------------------------------------- */

export function KioskHandoff({
  tabs,
  onExit,
}: {
  tabs: React.ReactNode;
  onExit: () => void;
}) {
  const [route, setRoute] = React.useState<Route>("menu");
  const { setLane } = useLane();

  React.useEffect(() => setLane(ROUTE_LANE[route]), [route, setLane]);
  const [step, setStep] = React.useState(0);
  const [firstName, setFirstName] = React.useState("Marta");

  const steps = ROUTE_STEPS[route];
  const last = step === steps.length - 1;

  /* transitions.dev · 08 · Page side-by-side. Slots hold a rendered
   * screen rather than an index, because the tape's length changes
   * with the route. */
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

  const goTo = (next: number, nextRoute: Route = route) => {
    if (next === step && nextRoute === route) return;
    const targetId = activeId === 1 ? 2 : 1;
    setDirection(next >= step ? 1 : -1);
    setSlots(targetId === 1 ? [next, slots[1]] : [slots[0], next]);
    setPendingId(targetId);
    setRoute(nextRoute);
    setStep(next);
  };

  const toMenu = () => goTo(0, "menu");

  const incomingId = pendingId ?? activeId;
  const fromX = (id: 1 | 2) =>
    (id === incomingId ? direction : -direction) === 1
      ? "var(--page-slide-distance)"
      : "calc(var(--page-slide-distance) * -1)";

  const screenFor = (index: number): React.ReactNode => {
    if (index === 0) {
      return <MenuScreen onPick={(next) => goTo(1, next)} />;
    }
    if (route === "visiting") {
      if (index === 1) {
        return (
          <DetailsScreen
            onContinue={(name) => {
              setFirstName(name);
              goTo(2);
            }}
            onCancel={toMenu}
          />
        );
      }
      if (index === 2) {
        return (
          <NoticesScreen onContinue={() => goTo(3)} onBack={() => goTo(1)} />
        );
      }
      return (
        <PassScreen
          firstName={firstName}
          note="Hold this to the reader in the lobby"
          footer={
            <>
              <Button size="cta" className="w-full" onClick={toMenu}>
                Done
              </Button>
              <Button size="cta" variant="secondary" className="w-full">
                Add to wallet
              </Button>
              <Footnote>
                The tablet can still find you by name if you lose it.
              </Footnote>
            </>
          }
        />
      );
    }
    if (route === "work") {
      return <AtTheTabletScreen onBack={toMenu} />;
    }
    return <SigningOutScreen onBack={toMenu} />;
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
                {steps.length}
              </span>
              <span className="h-4.5 w-px flex-none bg-line" />
              <span className="truncate text-sm text-fg-muted">
                Current · {steps[step]}
              </span>
            </div>
            <button
              onClick={() => (last ? onExit() : goTo(step + 1))}
              className="flex flex-none items-center gap-2 rounded-full bg-lane-tint px-4 py-2 text-sm font-semibold text-lane-fill transition-colors duration-fast ease-out-quad hover:bg-lane-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {last ? "Back to the kiosk" : sentenceCase(steps[step + 1])}
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
