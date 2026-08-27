import * as React from "react";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cssMs } from "@/lib/motion";

/**
 * The photo, shared by every path through the tablet: whoever gets
 * here — scanned a pass, found their booking, or filled the form —
 * looks up at the same camera. Where they land afterwards is their
 * lane's business, in kiosk-onsite.
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
  /**
   * "2 of 3" on the scan path, "3 of 3" when a form came first. `null`
   * drops the label: a count is worth reading only where the screens
   * behind it were numbered too.
   */
  step = "2 of 3",
  onBack,
  onDone,
}: {
  active: boolean;
  step?: string | null;
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
      {step ? (
        <span className="font-mono text-[13px] tracking-[0.14em] text-lane-fill uppercase">
          Step {step}
        </span>
      ) : null}
      <h2
        className={`text-[32px] leading-tight font-bold tracking-[-0.03em] ${
          step ? "mt-1" : ""
        }`}
      >
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
