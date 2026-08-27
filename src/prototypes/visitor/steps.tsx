import * as React from "react";
import { EMAIL_RE } from "@/lib/form";
import { NoticeList } from "@/components/notice";
import { PhoneScreen } from "@/components/phone-frame";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { useShakeInvalid } from "@/hooks/use-shake-invalid";
import { VisitorPassCard } from "@/prototypes/shared/pass-card";

/**
 * The phone screens a visitor can meet either before arriving or after
 * scanning the kiosk's hand-off code. Same three steps, same copy,
 * same validation — only the tape around them differs.
 */

/* -- shared bits ---------------------------------------------------- */

export function Mono({
  children,
  className = "text-fg-subtle",
  size = "text-xs",
}: {
  children: React.ReactNode;
  className?: string;
  size?: string;
}) {
  return (
    <span
      className={`font-mono ${size} tracking-[0.14em] uppercase ${className}`}
    >
      {children}
    </span>
  );
}

export function Stepper({ active }: { active: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={`h-1 flex-1 rounded-full ${
            active >= n ? "bg-lane-base" : "bg-lane-soft"
          }`}
        />
      ))}
    </div>
  );
}

export function StepHeader({
  label,
  index,
  active,
}: {
  label: string;
  index: string;
  active: 1 | 2 | 3;
}) {
  return (
    <>
      <Stepper active={active} />
      <div className="mt-2.5 flex items-baseline justify-between">
        <Mono className="text-lane-base">{label}</Mono>
        <span className="font-mono text-[13px] text-lane-base">{index}</span>
      </div>
    </>
  );
}

export function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm text-fg-subtle">{label}</span>
      <span
        className={
          mono
            ? "font-mono text-[15px] font-medium"
            : "text-base font-semibold text-right"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center text-[13px] text-fg-subtle">{children}</p>
  );
}

/* -- 3 · her details ------------------------------------------------ */



export function DetailsScreen({
  onContinue,
  onCancel,
}: {
  onContinue: (firstName: string) => void;
  onCancel: () => void;
}) {
  const { scopeRef, shake } = useShakeInvalid<HTMLFormElement>();

  return (
    <Form
      ref={scopeRef}
      className="min-h-0 flex-1 gap-0"
      onFormSubmit={(values) => {
        const f = String(values.first ?? "").trim();
        const l = String(values.last ?? "").trim();
        const e = String(values.email ?? "").trim();
        if (!f || !l || !EMAIL_RE.test(e)) return;
        onContinue(f);
      }}
    >
      <PhoneScreen
        footer={
          <>
            {/* Base UI validates on submit; the click fires first, so
              * the shake reads the freshly-committed invalid fields. */}
            <Button size="cta" type="submit" className="w-full" onClick={shake}>
              Continue
            </Button>
            <Button
              size="cta"
              variant="secondary"
              type="button"
              className="w-full"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Footnote>Your details are deleted when you sign out.</Footnote>
          </>
        }
      >
        <StepHeader label="Your details" index="1 of 3" active={1} />

        <h2 className="mt-3.5 text-[29px] leading-tight font-bold tracking-[-0.03em]">
          Who's visiting?
        </h2>
        <p className="mt-1.5 text-[15px] leading-normal text-fg-subtle">
          Three required, two if you want them. No employer or workstation
          details are asked.
        </p>

        <div className="mt-4.5 flex flex-col gap-3.5 pb-2">
          <Field
            name="first"
            validationMode="onSubmit"
            validate={(value) =>
              String(value ?? "").trim() ? null : "Enter your first name"
            }
          >
            <FieldLabel>First Name</FieldLabel>
            <FieldControl
              placeholder="Marta"
              autoComplete="given-name"
              autoCapitalize="words"
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
            <FieldLabel>Last Name</FieldLabel>
            <FieldControl
              placeholder="Nowak"
              autoComplete="family-name"
              autoCapitalize="words"
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
            />
            <FieldDescription>Your pass is sent here</FieldDescription>
            <FieldError />
          </Field>

          <Field name="mobile">
            <FieldLabel>
              Mobile Number
              <span className="ml-1.5 text-[13px] font-normal text-fg-subtle">
                Optional
              </span>
            </FieldLabel>
            <FieldControl
              type="tel"
              inputMode="tel"
              placeholder="So we can reach you"
              autoComplete="tel"
            />
          </Field>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-fg-muted">
              Host
              <span className="ml-1.5 text-[13px] font-normal text-fg-subtle">
                Optional
              </span>
            </span>
            <div className="flex items-baseline gap-2 rounded-md border border-line bg-surface px-4 py-3.5">
              <span className="text-base font-medium">Sam Whitfield</span>
              <span className="text-[13px] text-fg-subtle">
                from the invite
              </span>
            </div>
          </div>
        </div>
      </PhoneScreen>
    </Form>
  );
}

/* -- 4 · today's notices -------------------------------------------- */

export function NoticesScreen({
  onContinue,
  onBack,
}: {
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <PhoneScreen
      footer={
        <>
          <Button size="cta" className="w-full" onClick={onContinue}>
            Got it
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
      <StepHeader label="Today" index="2 of 3" active={2} />

      <h2 className="mt-4 text-3xl leading-tight font-bold tracking-[-0.03em]">
        Two things to know about today
      </h2>
      <p className="mt-2 text-[15px] leading-normal text-fg-subtle">
        Nothing to tick. Just so you are not surprised.
      </p>

      <NoticeList className="mt-5" />

      <p className="mt-4.5 pb-2 text-sm leading-normal text-fg-subtle">
        You will see these again in the lobby, because the day can change
        between now and then.
      </p>
    </PhoneScreen>
  );
}

/* -- 5 · her pass --------------------------------------------------- */

export function PassScreen({
  firstName,
  /** What to do with the pass next — differs by where they are. */
  note = "Show this at the tablet in the lobby",
  footer,
}: {
  firstName: string;
  note?: string;
  footer: React.ReactNode;
}) {
  return (
    <PhoneScreen footer={footer}>
      <Stepper active={3} />

      <div className="mt-3.5 flex items-center gap-2">
        <span className="flex size-5.5 items-center justify-center rounded-full bg-(--eco-green-tint)">
          <span className="size-2 rounded-full bg-success" />
        </span>
        <Mono className="text-success">Checked in</Mono>
      </div>

      <h2 className="mt-3 text-[29px] leading-tight font-bold tracking-[-0.03em]">
        You're checked in for Thursday
      </h2>

      <VisitorPassCard className="mt-4.5" />

      <p className="mt-3.5 pb-2 text-[15px] leading-normal text-fg-muted">
        {note}, {firstName}. About ten seconds.
      </p>
    </PhoneScreen>
  );
}
