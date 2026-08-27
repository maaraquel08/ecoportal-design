import * as React from "react";
import { BackButton } from "@/components/back-button";
import { Spinner } from "@/components/spinner";
import { cssMs } from "@/lib/motion";
import { useShake } from "@/prototypes/use-shake-invalid";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BOOKINGS,
  countWord,
  initials,
  maskedEmail,
  maskedName,
  matchBookings,
  type Booking,
} from "@/prototypes/bookings";

/** The code the booking's inbox receives. */
const CODE = "418302";
const CODE_LENGTH = 6;
const MAX_ATTEMPTS = 3;
/** How long the check appears to take. */
const VERIFY_DELAY = 1200;

function ShieldMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v6c0 4.2-2.9 7.4-7 9-4.1-1.6-7-4.8-7-9V6l7-3z" />
      <path d="M9.2 12.2l2 2 3.6-4" />
    </svg>
  );
}

/** A row's silhouette: tile, two lines, the trailing label. */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line px-5 py-4">
      <div className="size-11.5 flex-none rounded-xl bg-line" />
      <div className="min-w-0 flex-1">
        <div className="h-5 w-44 rounded bg-line" />
        <div className="mt-2 h-3.5 w-32 rounded bg-(--n-100)" />
      </div>
      <div className="h-3.5 w-16 flex-none rounded bg-(--n-100)" />
    </div>
  );
}

/* -- X1 · masked results — nothing to harvest ----------------------- */

export function FindByNameScreen({
  onBack,
  onPick,
  /** What the site is expecting today. A visitor looks for her
   *  booking; a trade looks for her job. Same list, same masking. */
  entity = { one: "booking", many: "bookings" },
}: {
  onBack: () => void;
  onPick: (booking: Booking) => void;
  entity?: { one: string; many: string };
}) {
  const [query, setQuery] = React.useState("Now");
  const matches = matchBookings(query);

  /* transitions.dev · 14 · Skeleton loader and reveal.
   *
   * The bookings are fetched once, so the skeleton belongs to the
   * arrival of the list — not to filtering it, which is local and
   * instant. Held for one full pulse so the reveal reads as a swap
   * rather than a flicker. */
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(
      () => setLoaded(true),
      cssMs("--pulse-dur", 1000) * cssMs("--pulse-count", 1),
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-10 pt-4 pb-6">
      {/* No audience label here: a contractor reaches this screen too. */}
      <BackButton onClick={onBack}>Back to scanner</BackButton>

      <h2 className="mt-3 text-[34px] leading-[1.08] font-bold tracking-[-0.03em]">
        {query.trim()
          ? `${countWord(matches.length)} ${
              matches.length === 1
                ? `${entity.one} matches`
                : `${entity.many} match`
            } "${query.trim()}"`
          : `${countWord(BOOKINGS.length)} ${entity.many} today`}
      </h2>
      <p className="mt-2 max-w-[64ch] text-[17px] text-fg-muted">
        Pick yours. We will check it is you before anything is confirmed — so
        the details stay hidden until then.
      </p>

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Type the first letters of your surname"
        aria-label="Your surname"
        disabled={!loaded}
        className="mt-4 h-12 text-base"
      />

      <div className={`t-skel mt-3 min-h-0 flex-1 ${loaded ? "is-revealed" : ""}`}>
        <div
          className={`t-skel-skeleton flex flex-col gap-2.5 ${
            loaded ? "" : "is-pulsing"
          }`}
        >
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>

        <div
          className={`t-skel-content overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            /* The content layer sits on top, so it must not swallow
             * taps while it is still transparent. */
            loaded ? "" : "pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-2.5">
            {matches.map((booking, index) => (
              <button
                key={booking.email}
                onClick={() => onPick(booking)}
                className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors duration-fast ease-out-quad focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  /* The first match is pre-highlighted: most people are
                   * looking at their own name at the top of the list. */
                  index === 0
                    ? "border-[1.5px] border-lane-base bg-lane-tint/40"
                    : "border border-line hover:bg-surface"
                }`}
              >
                <span
                  className={`flex size-11.5 flex-none items-center justify-center rounded-xl text-base font-semibold ${
                    index === 0
                      ? "bg-lane-tint text-lane-fill"
                      : "bg-surface text-fg-muted"
                  }`}
                >
                  {initials(booking)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[22px] font-semibold tracking-[-0.015em]">
                    {maskedName(booking)}
                  </span>
                  <span className="mt-0.5 block text-[15px] text-fg-subtle">
                    Expected {booking.expected}
                  </span>
                </span>
                <span
                  className={`flex-none font-mono text-[13px] ${
                    index === 0 ? "text-lane-fill" : "text-fg-subtle"
                  }`}
                >
                  This is me
                </span>
              </button>
            ))}

            {matches.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line px-5 py-8 text-center text-[17px] text-fg-subtle">
                No {entity.one} starts with “{query.trim()}”.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Banner tone="neutral" icon={<ShieldMark />} className="mt-3">
        Host, level, company and arrival time are not shown here. Anyone
        standing at this kiosk can learn that {countWord(matches.length).toLowerCase()}{" "}
        surnames start with “{query.trim() || "any letter"}” and nothing else.
      </Banner>

      <p className="mt-3 text-[15px] text-fg-subtle">
        Not listed?{" "}
        <span className="font-semibold text-lane-fill">
          Reception at the desk
        </span>{" "}
        can add you in a moment.
      </p>
    </div>
  );
}

/* -- X2 / X3 · prove it is you — one screen, two states ------------- */

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function CodeScreen({
  active,
  booking,
  onBack,
  onVerified,
  onGiveUp,
}: {
  active: boolean;
  booking: Booking;
  onBack: () => void;
  onVerified: () => void;
  onGiveUp: () => void;
}) {
  /* One slot per digit rather than a string: any cell can be selected
   * and retyped, so the code is not entered strictly left to right. */
  const [digits, setDigits] = React.useState<string[]>(
    Array(CODE_LENGTH).fill(""),
  );
  const [cursor, setCursor] = React.useState(0);
  const [attempts, setAttempts] = React.useState(0);
  const [failed, setFailed] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);
  /* transitions.dev · 12 · Error state shake, on the code row. */
  const { ref: cellsRef, shake } = useShake<HTMLDivElement>();

  React.useEffect(() => {
    if (active) return;
    setDigits(Array(CODE_LENGTH).fill(""));
    setCursor(0);
    setAttempts(0);
    setFailed(false);
    setVerifying(false);
  }, [active]);

  const entered = digits.join("");
  const complete = digits.every((digit) => digit !== "");
  const remaining = Math.max(MAX_ATTEMPTS - attempts, 0);
  const locked = remaining === 0;
  const editable = !verifying && !locked;

  /* The code is checked on submit, not on the sixth keystroke: a real
   * check is a round trip, so the screen has to be able to show one. */
  React.useEffect(() => {
    if (!verifying) return;
    const timer = window.setTimeout(() => {
      setVerifying(false);
      if (entered === CODE) {
        onVerified();
        return;
      }
      setFailed(true);
      setAttempts((n) => Math.min(n + 1, MAX_ATTEMPTS));
      shake();
    }, VERIFY_DELAY);
    return () => window.clearTimeout(timer);
  }, [verifying, entered, onVerified, shake]);

  const write = (index: number, value: string) => {
    setDigits((current) =>
      current.map((digit, i) => (i === index ? value : digit)),
    );
    // Editing after a rejection clears the error rather than the code:
    // one wrong digit should not cost the other five.
    setFailed(false);
  };

  const press = (key: string) => {
    if (!editable) return;
    write(cursor, key);
    setCursor(Math.min(cursor + 1, CODE_LENGTH - 1));
  };

  const backspace = () => {
    if (!editable) return;
    if (digits[cursor] !== "") {
      write(cursor, "");
      return;
    }
    const previous = Math.max(cursor - 1, 0);
    setCursor(previous);
    write(previous, "");
  };

  /* The real kiosk has no keyboard, but a prototype on a laptop does.
   * Digits, Backspace, the arrows and Enter drive exactly the same
   * state as the on-screen keypad — one code path, two inputs. */
  React.useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      // Never steal keys from a real field, or Enter from a button.
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      if (
        (event.key === "Enter" || event.key === " ") &&
        target?.closest("button")
      ) {
        return;
      }

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        press(event.key);
        return;
      }

      switch (event.key) {
        case "Backspace":
        case "Delete":
          event.preventDefault();
          backspace();
          break;
        case "ArrowLeft":
          if (!editable) return;
          event.preventDefault();
          setCursor(Math.max(cursor - 1, 0));
          break;
        case "ArrowRight":
          if (!editable) return;
          event.preventDefault();
          setCursor(Math.min(cursor + 1, CODE_LENGTH - 1));
          break;
        case "Home":
          if (!editable) return;
          event.preventDefault();
          setCursor(0);
          break;
        case "End":
          if (!editable) return;
          event.preventDefault();
          setCursor(CODE_LENGTH - 1);
          break;
        case "Enter":
          if (!editable || !complete) return;
          event.preventDefault();
          setVerifying(true);
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col px-10 pt-4 pb-6">
      <BackButton onClick={onBack} />

      <div className="mt-4 flex min-h-0 flex-1 gap-7.5">
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="text-[34px] leading-[1.08] font-bold tracking-[-0.03em]">
            {failed ? "That code did not match" : "Enter the code we just sent"}
          </h2>

          {failed ? (
            <p className="mt-2.5 text-[17px] leading-normal text-fg-muted">
              {locked
                ? "This booking is locked for the rest of the day. Reception can check you in at the desk."
                : `${countWord(remaining)} attempt${
                    remaining === 1 ? "" : "s"
                  } left. After that this booking locks and reception takes over.`}
            </p>
          ) : (
            <p className="mt-2.5 text-[17px] leading-normal text-fg-muted">
              Six digits, emailed to the address on this booking —{" "}
              <span className="font-semibold text-fg">
                {maskedEmail(booking.email)}
              </span>
              . It expires in 5 minutes.
            </p>
          )}

          {/* .t-input is the shake hook; the row is what shakes. */}
          <div ref={cellsRef} className="t-input mt-5 flex gap-2.5">
            {digits.map((digit, index) => {
              const filled = digit !== "";
              const selected = !failed && index === cursor;
              return (
                <button
                  key={index}
                  type="button"
                  disabled={!editable}
                  aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => setCursor(index)}
                  className={`flex-1 rounded-[14px] py-4.5 text-center text-3xl font-semibold transition-colors duration-fast ease-out-quad focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none ${
                    failed
                      ? "border-[1.5px] border-danger-line bg-danger-tint text-danger"
                      : selected
                        ? "border-[1.5px] border-lane-base bg-lane-tint/40"
                        : filled
                          ? "border border-line-strong"
                          : "border border-line text-fg-subtle"
                  }`}
                >
                  {filled ? (
                    digit
                  ) : selected ? (
                    <span className="text-lane-base">|</span>
                  ) : (
                    "—"
                  )}
                </button>
              );
            })}
          </div>

          {failed ? (
            <Banner tone="danger" className="mt-3.5">
              Attempt {attempts} of {MAX_ATTEMPTS} · 04:24PM · Kiosk 3.{" "}
              {booking.first} has been emailed a note that someone is trying to
              check in as her.
            </Banner>
          ) : null}

          <div className="mt-auto flex flex-col gap-2.5 pt-4">
            {failed ? (
              <>
                {locked ? null : (
                  <Button
                    size="cta"
                    className="w-full"
                    onClick={() => {
                      setFailed(false);
                      setDigits(Array(CODE_LENGTH).fill(""));
                      setCursor(0);
                    }}
                  >
                    Send a new code
                  </Button>
                )}
                <Button
                  variant={locked ? "primary" : "outline"}
                  size="cta"
                  className="w-full"
                  onClick={onGiveUp}
                >
                  Go to the desk instead
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="cta"
                  className="w-full"
                  disabled={!complete || verifying}
                  aria-busy={verifying}
                  onClick={() => setVerifying(true)}
                >
                  {verifying ? (
                    <>
                      <Spinner />
                      Checking the code…
                    </>
                  ) : (
                    "Confirm the code"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="cta"
                  className="w-full"
                  disabled={verifying || locked}
                >
                  Send it again
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex w-105 flex-none flex-col gap-2.5">
          <div className="grid grid-cols-3 gap-2.5">
            {KEYS.map((key) => (
              <button
                key={key}
                onClick={() => press(key)}
                disabled={verifying || locked}
                className="rounded-xl border border-line py-4 text-[22px] font-medium transition-colors duration-fast ease-out-quad hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
              >
                {key}
              </button>
            ))}
            <span />
            <button
              onClick={() => press("0")}
              disabled={verifying || locked}
              className="rounded-xl border border-line py-4 text-[22px] font-medium transition-colors duration-fast ease-out-quad hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
            >
              0
            </button>
            <button
              onClick={backspace}
              disabled={verifying || locked}
              className="rounded-xl bg-surface py-4 text-base font-medium text-fg-muted transition-colors duration-fast ease-out-quad hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
            >
              delete
            </button>
          </div>

          <Banner tone="neutral" icon={null} className="mt-auto">
            {failed
              ? "Every attempt is stamped with kiosk, time and photo. Three failures lock the booking for the rest of the day."
              : "The code goes to the visitor, not to the screen. Only someone who can open that inbox can finish this check-in."}
          </Banner>
          <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">
            Prototype · the emailed code is {CODE}
          </p>
        </div>
      </div>
    </div>
  );
}
