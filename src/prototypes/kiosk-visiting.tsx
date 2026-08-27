import * as React from "react";
import { EMAIL_RE } from "@/lib/form";
import { ControlDeck } from "@/components/control-deck";
import { NoticeList } from "@/components/notice";
import { TabletFrame } from "@/components/tablet-frame";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { HOSTS } from "@/prototypes/hosts";
import { StepHeader } from "@/prototypes/kiosk-chrome";
import { KioskOnSite, visitorOnSite } from "@/prototypes/kiosk-onsite";
import { PhotoScreen } from "@/prototypes/kiosk-steps";
import { useShakeInvalid } from "@/prototypes/use-shake-invalid";

/* -- the tape ------------------------------------------------------- */

const STEPS = [
  "your details",
  "today's notices",
  "your photo",
  "checked in",
] as const;

type Step = 0 | 1 | 2 | 3;

function sentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}


/* -- 1 of 3 · your details ------------------------------------------ */

function DetailsScreen({
  onContinue,
  onBack,
}: {
  onContinue: (firstName: string) => void;
  onBack: () => void;
}) {
  const [host, setHost] = React.useState<string | null>(null);
  const [hostMissing, setHostMissing] = React.useState(false);
  const { scopeRef, shake } = useShakeInvalid<HTMLFormElement>();

  return (
    <Form
      ref={scopeRef}
      className="flex min-h-0 flex-1 flex-col gap-0 px-10 pt-4 pb-6"
      onFormSubmit={(values) => {
        const first = String(values.first ?? "").trim();
        const last = String(values.last ?? "").trim();
        const email = String(values.email ?? "").trim();
        if (!first || !last || !EMAIL_RE.test(email)) return;
        if (!host) {
          setHostMissing(true);
          return;
        }
        onContinue(first);
      }}
    >
      <StepHeader
        label="Your details"
        active={1}
        total={2}
        onBack={onBack}
      />

      <h2 className="mt-3 text-[34px] leading-[1.08] font-bold tracking-[-0.03em]">
        Who's visiting?
      </h2>
      <p className="mt-2 max-w-[64ch] text-[17px] text-fg-muted">
        Four required, one if you want it. No employer or workstation details
        are asked.
      </p>

      {/* Two-up: five fields stacked in one column would leave most of
        * the glass empty on a 1064 × 768 screen. */}
      <div className="mt-5 grid min-h-0 flex-1 grid-cols-2 content-start gap-x-7.5 gap-y-4">
        <Field
          name="first"
          validationMode="onSubmit"
          validate={(value) =>
            String(value ?? "").trim() ? null : "Enter your first name"
          }
        >
          <FieldLabel>First name</FieldLabel>
          <FieldControl
            placeholder="Marta"
            autoComplete="given-name"
            autoCapitalize="words"
            className="h-12 text-base"
          />
          <FieldError />
        </Field>

        <Field
          name="last"
          validationMode="onSubmit"
          validate={(value) =>
            String(value ?? "").trim() ? null : "Enter your last name"
          }
        >
          <FieldLabel>Last name</FieldLabel>
          <FieldControl
            placeholder="Nowak"
            autoComplete="family-name"
            autoCapitalize="words"
            className="h-12 text-base"
          />
          <FieldError />
        </Field>

        <Field
          name="email"
          validationMode="onSubmit"
          validate={(value) => {
            const email = String(value ?? "").trim();
            if (!email) return "Enter your email so we can send your pass";
            if (!EMAIL_RE.test(email))
              return "That email doesn't look right — check for a typo";
            return null;
          }}
        >
          <FieldLabel>Email</FieldLabel>
          <FieldControl
            type="email"
            inputMode="email"
            placeholder="name@company.com"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            className="h-12 text-base"
          />
          <FieldDescription>Your pass is sent here</FieldDescription>
          <FieldError />
        </Field>

        <Field name="mobile">
          <FieldLabel>
            Mobile number
            <span className="ml-1.5 text-[13px] font-normal text-fg-subtle">
              Optional
            </span>
          </FieldLabel>
          <FieldControl
            type="tel"
            inputMode="tel"
            placeholder="So we can reach you"
            autoComplete="tel"
            className="h-12 text-base"
          />
        </Field>

        {/* No invite to prefill from here, so the host is chosen. */}
        <Field name="host" invalid={hostMissing} className="col-span-2">
          <FieldLabel>Who are you here to see?</FieldLabel>
          <Combobox
            items={HOSTS}
            value={host}
            onValueChange={(value) => {
              setHost(value);
              setHostMissing(false);
            }}
          >
            <ComboboxInput
              placeholder="Start typing a name"
              className="h-12 text-base"
            />
            <ComboboxContent>
              <ComboboxEmpty>Nobody by that name.</ComboboxEmpty>
              <ComboboxList>
                {(name: string) => (
                  <ComboboxItem key={name} value={name}>
                    {name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <FieldError match={hostMissing}>
            Pick who you are visiting
          </FieldError>
        </Field>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          size="cta"
          className="w-52"
          onClick={onBack}
        >
          Cancel
        </Button>
        <Button type="submit" size="cta" className="w-64" onClick={shake}>
          Continue
        </Button>
      </div>
    </Form>
  );
}

/* -- 2 of 3 · today's notices --------------------------------------- */

function NoticesScreen({
  onContinue,
  onBack,
}: {
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-10 pt-4 pb-6">
      <StepHeader label="Today" active={2} total={2} onBack={onBack} />

      <h2 className="mt-3 text-[34px] leading-[1.08] font-bold tracking-[-0.03em]">
        Two things to know about today
      </h2>
      <p className="mt-2 text-[17px] text-fg-muted">
        Nothing to tick. Just so you are not surprised.
      </p>

      <NoticeList className="mt-5" />

      <p className="mt-4 text-[15px] leading-normal text-fg-subtle">
        You will see these again on your pass, because the day can change while
        you are here.
      </p>

      <div className="mt-auto flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          size="cta"
          className="w-52"
          onClick={onBack}
        >
          Back
        </Button>
        <Button size="cta" className="w-64" onClick={onContinue}>
          Got it
        </Button>
      </div>
    </div>
  );
}

/* -- the prototype -------------------------------------------------- */

export function KioskVisiting({
  tabs,
  onExit,
}: {
  tabs: React.ReactNode;
  /** Back out of step one returns to the landing, in the other tab. */
  onExit: () => void;
}) {
  const [step, setStep] = React.useState<Step>(0);
  const [firstName, setFirstName] = React.useState("Marta");

  /* transitions.dev · 08 · Page side-by-side — same two-slot pattern
   * as the other tapes. */
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
      <DetailsScreen
        onBack={onExit}
        onContinue={(name) => {
          setFirstName(name);
          goTo(1);
        }}
      />
    ),
    1: <NoticesScreen onBack={() => goTo(0)} onContinue={() => goTo(2)} />,
    2: (
      <PhotoScreen
        active={step === 2}
        step={null}
        onBack={() => goTo(1)}
        onDone={() => goTo(3)}
      />
    ),
    3: (
      <KioskOnSite
        active={step === 3}
        content={visitorOnSite({ firstName })}
        onDone={onExit}
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
