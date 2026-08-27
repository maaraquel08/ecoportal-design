import * as React from "react";
import { NoticeList, type Notice } from "@/components/notice";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cssMs } from "@/lib/motion";
import { LobbyMap } from "@/prototypes/lobby-map";
import { VisitorPassCard, type PassRow } from "@/prototypes/visitor-pass";

/**
 * Kiosk steps shared by both paths through the tablet: whoever gets
 * here — scanned a code, found their booking, or filled the form —
 * takes the same photo and lands on the same pass.
 */

/* -- T2 · the photo (step 2 of 3) ----------------------------------- */

/**
 * Stand-in for the camera feed: hatched field, dashed face outline.
 *
 * At zero the shutter fires — a white burst over the whole field and a
 * dip on the field itself — and the outline settles from a dashed
 * guide into a solid confirmation.
 */
function CameraPlaceholder({
  capturing,
  captured,
}: {
  capturing: boolean;
  captured: boolean;
}) {
  return (
    <div
      className={`relative flex flex-1 items-center justify-center overflow-hidden rounded-lg border border-line ${
        capturing ? "t-capture-dip" : ""
      }`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, var(--n-100) 0 8px, var(--color-bg) 8px 16px)",
      }}
    >
      <div
        className={`flex h-48 w-39 items-end justify-center rounded-full border-2 pb-3 transition-colors duration-fast ease-out-quad ${
          captured
            ? "border-solid border-lane-base"
            : "border-dashed border-line-strong"
        }`}
      >
        <span
          className={`flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] uppercase ${
            captured ? "text-lane-fill" : "text-fg-subtle"
          }`}
        >
          {captured ? (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              Got it
            </>
          ) : (
            "Face here"
          )}
        </span>
      </div>

      {/* Keyed so a retake replays the burst from the top. */}
      {capturing ? (
        <div
          key="flash"
          className="t-capture-flash pointer-events-none absolute inset-0 bg-white"
        />
      ) : null}
    </div>
  );
}

export function PhotoScreen({
  active,
  /** "2 of 3" on the scan path, "3 of 3" when a form came first. */
  step = "2 of 3",
  onBack,
  onDone,
}: {
  active: boolean;
  step?: string;
  onBack: () => void;
  onDone: () => void;
}) {
  const [count, setCount] = React.useState(3);
  const [capturing, setCapturing] = React.useState(false);

  /* No tap needed: the capture counts itself down whenever the screen
   * is the one on the glass. */
  React.useEffect(() => {
    if (!active || count === 0) return;
    const timer = window.setTimeout(() => setCount((n) => n - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [active, count]);

  React.useEffect(() => {
    if (!active) {
      setCount(3);
      setCapturing(false);
    }
  }, [active]);

  const captured = count === 0;

  /* Fire the shutter the moment the count lands on zero, and clear the
   * class again so a retake can replay it. Duration comes from the
   * token so the two never drift. */
  React.useEffect(() => {
    if (!active || !captured) return;
    setCapturing(true);
    const timer = window.setTimeout(
      () => setCapturing(false),
      cssMs("--capture-flash-dur", 500) + 20,
    );
    return () => window.clearTimeout(timer);
  }, [active, captured]);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-10 pt-3 pb-6">
      <span className="font-mono text-[13px] tracking-[0.14em] text-lane-fill uppercase">
        Step {step}
      </span>
      <h2 className="mt-1 text-[32px] leading-tight font-bold tracking-[-0.03em]">
        Look up for your photo
      </h2>

      <div className="mt-5 flex min-h-0 flex-1 gap-8">
        <div className="flex w-96 flex-none flex-col">
          <CameraPlaceholder capturing={capturing} captured={captured} />
          <p className="mt-3 text-center text-sm text-fg-subtle">
            Line your face up inside the outline
          </p>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[56px] leading-none font-bold tracking-[-0.04em] text-lane-fill">
            {captured ? "Done" : count}
          </span>
          <p className="mt-3 text-[17px] leading-normal text-fg-muted">
            It goes on your pass so staff can check it matches you.
          </p>
          <Banner className="mt-4">
            Deleted when you sign out. Your name and visit times are kept.
          </Banner>
          <Button
            variant="outline"
            size="cta"
            className="mt-auto w-full"
            onClick={() => {
              setCapturing(false);
              setCount(3);
            }}
          >
            Retake
          </Button>
        </div>
      </div>

      <Separator className="mt-6" />

      <div className="mt-4 flex items-center justify-between gap-6">
        <span className="font-mono text-[13px] text-fg-subtle">
          Captures at zero · no tap needed
        </span>
        <div className="flex flex-none items-center gap-3">
          <Button variant="outline" size="cta" onClick={onBack}>
            Back
          </Button>
          <Button size="cta" disabled={!captured} onClick={onDone}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -- T3 · checked in · study K2 ------------------------------------- */

/** How long the pass stays up before the kiosk resets for the next person. */
const RESET_SECONDS = 28;

/** Where the lifts are, and what to say about getting there. */
export type KioskRoute = { zone: string; target: string; caption: string };

const VISITOR_ROUTE: KioskRoute = {
  zone: "Lobby · ground floor",
  target: "East lifts → Level 9",
  caption: "Straight past the café, then right to the east lifts",
};

/**
 * K2, for whoever just checked in. The layout is fixed — status, one
 * sentence, then the map and the pass — and every lane fills it with
 * its own facts rather than drawing its own version of it.
 */
export function CheckedInScreen({
  active,
  firstName = "Marta",
  status = "Checked in · 04:24PM",
  headline,
  route = VISITOR_ROUTE,
  /** Contractor lane: what the reader settled on the way in. */
  checks,
  notices,
  passCaption,
  passRows,
  passNote = "Scan the code to carry it on your phone.",
  onDone,
}: {
  active: boolean;
  firstName?: string;
  status?: string;
  headline?: string;
  route?: KioskRoute;
  checks?: { label: string; value: string }[];
  notices?: Notice[];
  passCaption?: string;
  passRows?: PassRow[];
  passNote?: string;
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-10 pt-4 pb-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[13px] tracking-[0.14em] text-lane-fill uppercase">
          {status}
        </span>
        <span className="text-[15px] text-fg-subtle">
          Returning to the start in{" "}
          <span className="font-mono font-medium text-fg-muted">
            {remaining}s
          </span>
        </span>
      </div>

      <h2 className="mt-2 text-[34px] leading-[1.08] font-bold tracking-[-0.03em]">
        {headline ??
          `You're in, ${firstName}. Head up to Level 9 whenever you're ready.`}
      </h2>

      {/* Only the contractor lane has anything to report here: a
        * visitor's check-in settles nothing that needed checking. */}
      {checks ? (
        <div className="mt-3.5 grid grid-cols-3 gap-3">
          {checks.map((check) => (
            <div
              key={check.label}
              className="flex items-center gap-3 rounded-[14px] bg-(--eco-green-tint) px-4 py-3"
            >
              <span className="flex size-6 flex-none items-center justify-center rounded-full bg-success text-bg">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] tracking-[0.14em] text-success uppercase">
                  {check.label}
                </span>
                <span className="mt-0.5 block text-[15px] font-semibold">
                  {check.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {/* One 12px gap grid: the map and the code take the slack, so the
        * two columns end level whatever the glass height is. */}
      <div className="mt-4 flex min-h-0 flex-1 gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex min-h-0 flex-1 flex-col rounded-[18px] border border-line p-3.5">
            <div className="flex items-baseline justify-between px-0.5 pb-2.5">
              <span className="font-mono text-xs tracking-[0.12em] text-fg-subtle uppercase">
                {route.zone}
              </span>
              <span className="text-[15px] font-semibold whitespace-nowrap text-lane-fill">
                {route.target}
              </span>
            </div>
            <LobbyMap fill />
            <p className="px-0.5 pt-2.5 text-[15px] text-fg-muted">
              {route.caption}
            </p>
          </div>

          <NoticeList notices={notices} />
        </div>

        <div className="flex w-100 flex-none flex-col gap-3">
          {/* The same pass object the phone and the pre-arrival flow
            * show — one component, so the three can never disagree. */}
          <VisitorPassCard fill caption={passCaption} rows={passRows} />

          <p className="text-[15px] leading-normal text-fg-subtle">{passNote}</p>
          {/* Lets the next person start without waiting out the timer. */}
          <Button size="cta" className="w-full" onClick={onDone}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
