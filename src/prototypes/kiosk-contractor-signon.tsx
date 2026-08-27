import * as React from "react";
import { BackButton } from "@/components/back-button";
import { QrMock } from "@/components/qr-mock";
import { TabletColumn } from "@/components/tablet-frame";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Form } from "@/components/ui/form";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@/components/ui/number-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { required } from "@/lib/form";
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
  BLANK,
  COUNTRIES,
  INDUSTRIES,
  REGISTERED,
  type Company,
} from "@/prototypes/contractor-firms";
import { StepHeader, StepRail, Stepper } from "@/prototypes/kiosk-chrome";
import { Card, Tile } from "@/prototypes/kiosk-landing";
import { PersonIcon, QrIcon, ToolboxIcon } from "@/prototypes/kiosk-icons";
import {
  CompanyReadOnly,
  personComplete,
  personFields,
  PersonFieldRow,
  type Person,
} from "@/prototypes/contractor-person";
import { useShakeInvalid } from "@/prototypes/use-shake-invalid";

/**
 * Signing a trade on at the glass, with nothing done beforehand.
 *
 * The same three things the pre-arrival flow asks for — the firm, her
 * own details, the briefing — in the same order, because a person who
 * did it on her phone last night and a person doing it in the lobby
 * should be able to describe the same journey. What changes is the
 * surface: two columns instead of one, and the briefing can be handed
 * to her own phone so she is not standing at the tablet reading five
 * paragraphs with a tool bag on her shoulder.
 */

/** Company, details, briefing, photo. The photo belongs to the kiosk. */
export const SIGN_ON_TOTAL = 4;

/* -- W2 · which one are you ----------------------------------------- */

export function WhoScreen({
  onFirstTime,
  onReturning,
  onBack,
}: {
  onFirstTime: () => void;
  onReturning: () => void;
  onBack: () => void;
}) {
  return (
    <TabletColumn>
      <BackButton onClick={onBack} />

      <span className="mt-5 font-mono text-[13px] tracking-[0.14em] text-lane-fill uppercase">
        Here to work
      </span>
      <h2 className="mt-2.5 text-[40px] leading-[1.06] font-bold tracking-[-0.035em]">
        Have you worked with us before?
      </h2>
      <p className="mt-2 text-[17px] text-fg-muted">
        It only changes what we need from you now.
      </p>

      <div className="mt-6.5 flex min-h-0 flex-1 gap-4.5">
        <Card className="flex min-w-0 flex-1 flex-col p-5.5">
          <Tile className="bg-lane-tint text-lane-base">
            <ToolboxIcon />
          </Tile>
          <div className="mt-5 text-[27px] font-semibold tracking-[-0.025em]">
            First time here
          </div>
          <p className="mt-2.5 text-base leading-normal text-fg-subtle">
            Your firm, your details and the safety briefing. About four
            minutes, and only ever once — the next site starts at the reader.
          </p>
          <Button size="cta" className="mt-auto w-full text-lg" onClick={onFirstTime}>
            Start · about 4 minutes
          </Button>
        </Card>

        <Card className="flex min-w-0 flex-1 flex-col p-5.5">
          <Tile className="bg-lane-tint text-lane-base">
            <QrIcon />
          </Tile>
          <div className="mt-5 text-[27px] font-semibold tracking-[-0.025em]">
            I've been here before
          </div>
          <p className="mt-2.5 text-base leading-normal text-fg-subtle">
            Hold the code from your clearance email to the reader, or let the
            desk look you up. About ten seconds.
          </p>
          <Button
            size="cta"
            variant="outline"
            className="mt-auto w-full text-lg"
            onClick={onReturning}
          >
            Hold my code
          </Button>
        </Card>
      </div>
    </TabletColumn>
  );
}

/* -- W3 · your company · 1 of 4 ------------------------------------- */

/** What she picks when the building has never heard of her firm. */
const NOT_LISTED = "My firm isn't listed";

const FIRM_ITEMS = [...REGISTERED.map((firm) => firm.name), NOT_LISTED];

export function FirmScreen({
  company,
  onChange,
  onContinue,
  onBack,
}: {
  company: Company;
  onChange: (next: Company) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const { scopeRef, shake } = useShakeInvalid<HTMLFormElement>();
  /** A firm already registered with the building answers all eight. */
  const [known, setKnown] = React.useState(false);
  const [manual, setManual] = React.useState(false);
  const [unchosen, setUnchosen] = React.useState(false);
  /** What the firm field is showing. One of the items, or nothing. */
  const [picked, setPicked] = React.useState<string | null>(null);

  const set = (key: keyof Company) => (value: string) =>
    onChange({ ...company, [key]: value });

  /* R2, at the glass: eight fields that are identical for every
   * colleague she has are looked up once, not typed in a lobby. */
  const choose = (name: string | null) => {
    setUnchosen(false);
    setPicked(name);
    if (name === null) {
      setManual(false);
      setKnown(false);
      onChange(BLANK);
      return;
    }
    if (name === NOT_LISTED) {
      setManual(true);
      setKnown(false);
      onChange(BLANK);
      return;
    }
    const match = REGISTERED.find((item) => item.name === name);
    if (!match) return;
    setManual(false);
    setKnown(true);
    onChange(match);
  };

  const locked = { readOnly: known, tabIndex: known ? -1 : undefined };

  return (
    <Form
      ref={scopeRef}
      className="flex min-h-0 flex-1 flex-col gap-0 px-10 pt-4 pb-6"
      onFormSubmit={() => {
        if (!known && !manual) {
          setUnchosen(true);
          return;
        }
        if (
          !company.name.trim() ||
          !company.address.trim() ||
          !company.postcode.trim() ||
          !company.suburb.trim() ||
          !company.city.trim()
        ) {
          return;
        }
        onContinue();
      }}
    >
      <StepHeader
        label="Your company"
        active={1}
        total={SIGN_ON_TOTAL}
        onBack={onBack}
      />

      <h2 className="mt-3 text-[34px] leading-[1.08] font-bold tracking-[-0.03em]">
        Who do you work for?
      </h2>

      {/* The negative margin gives focus rings their two pixels back:
        * a scroll box clips them on both axes, and this grid scrolls
        * when a firm is typed in by hand. */}
      <div className="mt-3.5 -mx-1 grid min-h-0 flex-1 grid-cols-6 content-start gap-x-6 gap-y-3 overflow-y-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* The same control the visitor's host field uses: type to
          * narrow, pick from the popover. A registered firm answers
          * the eight fields below it. */}
        <Field name="firm" className="col-span-6" invalid={unchosen}>
          <FieldLabel>Your firm</FieldLabel>
          <Combobox
            items={FIRM_ITEMS}
            value={picked}
            onValueChange={(value) => choose(value)}
          >
            <ComboboxInput
              placeholder="Start typing your firm's name"
              className="h-12 text-base"
            />
            <ComboboxContent>
              <ComboboxEmpty>
                No firm by that name — pick "{NOT_LISTED}".
              </ComboboxEmpty>
              <ComboboxList>
                {(name: string) => (
                  <ComboboxItem key={name} value={name}>
                    {name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <FieldDescription>
            If the building has your firm on file, the rest fills itself in
          </FieldDescription>
          <FieldError match={unchosen}>
            Pick your firm, or "{NOT_LISTED}" to type it in
          </FieldError>
        </Field>

        {manual ? (
          <Field
            name="companyName"
            className="col-span-6"
            validationMode="onSubmit"
            validate={required("Enter your firm's name")}
          >
            <FieldLabel>Company name, as your firm files it</FieldLabel>
            <FieldControl
              value={company.name}
              onChange={(event) => set("name")(event.target.value)}
              placeholder="Your firm's registered name"
              className="h-12 text-base"
            />
            <FieldError />
          </Field>
        ) : null}

        <Field
          name="address"
          className="col-span-3"
          validationMode="onSubmit"
          validate={required("Enter the street address")}
        >
          <FieldLabel>Street address</FieldLabel>
          <FieldControl
            value={company.address}
            onChange={(event) => set("address")(event.target.value)}
            placeholder="14 Bourke Road"
            className="h-12 text-base"
            {...locked}
          />
          <FieldError />
        </Field>

        <Field
          name="postcode"
          className="col-span-1"
          validationMode="onSubmit"
          validate={required("Postcode")}
        >
          <FieldLabel>Postcode</FieldLabel>
          <FieldControl
            value={company.postcode}
            onChange={(event) => set("postcode")(event.target.value)}
            inputMode="numeric"
            placeholder="2015"
            className="h-12 text-base"
            {...locked}
          />
          <FieldError />
        </Field>

        <Field
          name="suburb"
          className="col-span-2"
          validationMode="onSubmit"
          validate={required("Suburb")}
        >
          <FieldLabel>Suburb</FieldLabel>
          <FieldControl
            value={company.suburb}
            onChange={(event) => set("suburb")(event.target.value)}
            placeholder="Alexandria"
            className="h-12 text-base"
            {...locked}
          />
          <FieldError />
        </Field>

        <Field
          name="city"
          className="col-span-2"
          validationMode="onSubmit"
          validate={required("City")}
        >
          <FieldLabel>City</FieldLabel>
          <FieldControl
            value={company.city}
            onChange={(event) => set("city")(event.target.value)}
            placeholder="Sydney"
            className="h-12 text-base"
            {...locked}
          />
          <FieldError />
        </Field>

        <Field name="country" className="col-span-2">
          <FieldLabel>Country</FieldLabel>
          <Select
            value={company.country}
            onValueChange={(value) => set("country")(String(value ?? ""))}
            readOnly={known}
          >
            <SelectTrigger
              className="h-12 w-full text-base"
              tabIndex={known ? -1 : undefined}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field name="industry" className="col-span-2">
          <FieldLabel>
            Industry
            <span className="ml-1.5 text-[13px] font-normal text-fg-subtle">
              Optional
            </span>
          </FieldLabel>
          <Select
            value={company.industry || null}
            onValueChange={(value) => set("industry")(String(value ?? ""))}
            readOnly={known}
          >
            <SelectTrigger
              className="h-12 w-full text-base"
              tabIndex={known ? -1 : undefined}
            >
              <SelectValue placeholder="Pick one" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field name="employees" className="col-span-2">
          <FieldLabel>
            People at the firm
            <span className="ml-1.5 text-[13px] font-normal text-fg-subtle">
              Optional
            </span>
          </FieldLabel>
          <NumberField
            value={company.employees ? Number(company.employees) : null}
            onValueChange={(value) =>
              set("employees")(value === null ? "" : String(value))
            }
            min={1}
            readOnly={known}
          >
            <NumberFieldGroup tabIndex={known ? -1 : undefined}>
              <NumberFieldInput className="h-12 text-base" />
            </NumberFieldGroup>
          </NumberField>
        </Field>
      </div>

      <Separator className="mt-4" />

      <div className="mt-4 flex flex-none items-center justify-between gap-6">
        <span className="font-mono text-[13px] text-fg-subtle">
          {known
            ? "Filed by your firm · nobody edits it from a lobby"
            : "Asked once, for the whole firm"}
        </span>
        <div className="flex flex-none items-center gap-3">
          <Button variant="outline" size="cta" type="button" onClick={onBack}>
            Back
          </Button>
          <Button size="cta" type="submit" onClick={shake}>
            Continue
          </Button>
        </div>
      </div>
    </Form>
  );
}

/* -- W4 · your details · 2 of 4 ------------------------------------- */

/**
 * Sign-up and check-in, asked together.
 *
 * The brief lists two forms for a first-timer at the glass — the five
 * fields that make her account and the seven that check her in — and
 * four of those are the same four. Asking them twice in one session is
 * the thing a lobby cannot afford, so the union is asked once, from
 * `PERSON_FIELDS`, and the two lifetimes stay visible as two groups:
 * what is true forever, and what is true today.
 */

export function TradeDetailsScreen({
  company,
  person,
  onChange,
  onContinue,
  onBack,
}: {
  /** Settled on the previous step, so it is shown rather than asked. */
  company: Company;
  person: Person;
  onChange: (next: Person) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const { scopeRef, shake } = useShakeInvalid<HTMLFormElement>();

  const set = (key: keyof Person) => (value: string) =>
    onChange({ ...person, [key]: value });

  return (
    <Form
      ref={scopeRef}
      className="flex min-h-0 flex-1 flex-col gap-0 px-10 pt-4 pb-6"
      onFormSubmit={() => {
        if (!personComplete(person)) return;
        onContinue();
      }}
    >
      <StepHeader
        label="Your details"
        active={2}
        total={SIGN_ON_TOTAL}
        onBack={onBack}
      />

      <h2 className="mt-3 text-[34px] leading-[1.08] font-bold tracking-[-0.03em]">
        And who are you?
      </h2>
      <p className="mt-2 max-w-[64ch] text-[17px] text-fg-muted">
        Your account and today's sign-in, on one screen. Three are
        required — your firm is already answered, and nothing is asked
        twice.
      </p>

      {/* The negative margin gives focus rings their two pixels back,
        * the same way the firm step's grid does. */}
      <div className="mt-3.5 -mx-1 grid min-h-0 flex-1 grid-cols-2 content-start gap-x-7.5 gap-y-3.5 overflow-y-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <GroupLabel>
          Your details
          <span className="ml-2 normal-case tracking-normal">
            asked once ever
          </span>
        </GroupLabel>

        {personFields("identity").map((field) => (
          <PersonFieldRow
            key={field.key}
            field={field}
            surface="kiosk"
            value={person[field.key]}
            onChange={set(field.key)}
            className={field.wide ? "col-span-2" : undefined}
          />
        ))}

        <GroupLabel className="mt-2.5">
          This visit
          <span className="ml-2 normal-case tracking-normal">
            asked again next job
          </span>
        </GroupLabel>

        <CompanyReadOnly name={company.name} />

        {personFields("visit").map((field) => (
          <PersonFieldRow
            key={field.key}
            field={field}
            surface="kiosk"
            value={person[field.key]}
            onChange={set(field.key)}
            className={field.wide ? "col-span-2" : undefined}
          />
        ))}
      </div>

      <Separator className="mt-4" />

      <div className="mt-4 flex flex-none items-center justify-between gap-6">
        <span className="font-mono text-[13px] text-fg-subtle">
          Yours, not your firm's · signed up and signed in at once
        </span>
        <div className="flex flex-none items-center gap-3">
          <Button variant="outline" size="cta" type="button" onClick={onBack}>
            Back
          </Button>
          <Button size="cta" type="submit" onClick={shake}>
            Continue
          </Button>
        </div>
      </div>
    </Form>
  );
}

/** A row-spanning heading inside the two-column grid. */
function GroupLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`col-span-2 font-mono text-[11px] tracking-[0.14em] text-fg-subtle uppercase ${className}`}
    >
      {children}
    </span>
  );
}

/* -- W5 · the briefing · 3 of 4 ------------------------------------- */

/**
 * The one step that does not have to happen on the glass.
 *
 * Five paragraphs and five questions is a long time to stand in a
 * lobby holding a tool bag, and she has a screen in her pocket that is
 * better for reading. So the kiosk offers the choice and then waits —
 * it is the same briefing either way, and the record is the same
 * record.
 */
type Where = "choose" | "phone" | "reading" | "asking" | "result";

/** Roughly how long the phone takes to report each answer back. */
const PHONE_TICK_MS = 900;

/** One rail at the bottom: the rule on the left, the way on. */
function BriefingFooter({
  hint,
  children,
}: {
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 flex flex-none items-center justify-between gap-6 border-t border-line pt-4.5">
      <span className="font-mono text-[14px] text-fg-subtle">{hint}</span>
      <div className="flex flex-none items-center gap-3">{children}</div>
    </div>
  );
}

export function BriefingScreen({
  active,
  onContinue,
  onBack,
}: {
  active: boolean;
  onContinue: () => void;
  onBack: () => void;
}) {
  const [where, setWhere] = React.useState<Where>("choose");
  const quiz = useBriefing();
  const { deck, index, question, picked, score, atLast, answer } = quiz;

  /* The phone reports back as she answers. Nothing here is faked that
   * the tablet would not genuinely know: it is told how many of the
   * five have come in, and nothing about which. */
  const [reported, setReported] = React.useState(0);
  React.useEffect(() => {
    if (!active || where !== "phone" || reported === QUESTIONS.length) return;
    const timer = window.setTimeout(
      () => setReported((n) => n + 1),
      PHONE_TICK_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, where, reported]);

  const onPhone = reported === QUESTIONS.length;
  /* Duplicated into data-text for the shimmer's ::before layer. */
  const waiting = `Waiting on your phone · ${reported} of ${QUESTIONS.length} answered`;

  const next = () => {
    if (quiz.next()) setWhere("result");
  };

  const retake = () => {
    quiz.retake();
    setWhere("reading");
  };

  /* One header rail for the whole step, so the question screen keeps
   * its vertical room and the other phases still read as the same
   * step. */
  const header = (
    <StepRail
      label="The briefing"
      active={3}
      total={SIGN_ON_TOTAL}
      onBack={onBack}
    />
  );

  /* -- where do you want to do it -- */
  if (where === "choose") {
    return (
      <div className="flex min-h-0 flex-1 flex-col px-10 pt-4 pb-6">
        {header}

        <h2 className="mt-3 text-[34px] leading-[1.08] font-bold tracking-[-0.03em]">
          Where do you want to do the briefing?
        </h2>
        <p className="mt-2 max-w-[64ch] text-[17px] text-fg-muted">
          Five points to read and {QUESTIONS.length} questions about them.{" "}
          {PASS_MARK} of {QUESTIONS.length} to pass, no time limit, and it is
          the same briefing either way.
        </p>

        <div className="mt-6 flex min-h-0 flex-1 gap-4.5">
          <Card className="flex min-w-0 flex-1 flex-col p-5.5">
            <Tile className="bg-lane-tint text-lane-base">
              <QrIcon />
            </Tile>
            <div className="mt-5 text-[27px] font-semibold tracking-[-0.025em]">
              On your own phone
            </div>
            <p className="mt-2.5 text-base leading-normal text-fg-subtle">
              Scan the code and read it sitting down, in your own time. The
              tablet waits here and picks up when you are done.
            </p>
            <Button
              size="cta"
              className="mt-auto w-full text-lg"
              onClick={() => setWhere("phone")}
            >
              Scan the code
            </Button>
          </Card>

          <Card className="flex min-w-0 flex-1 flex-col p-5.5">
            <Tile className="bg-lane-tint text-lane-base">
              <PersonIcon />
            </Tile>
            <div className="mt-5 text-[27px] font-semibold tracking-[-0.025em]">
              Here on the tablet
            </div>
            <p className="mt-2.5 text-base leading-normal text-fg-subtle">
              Read it on the glass and answer standing up. About three minutes
              if you are quick.
            </p>
            <Button
              size="cta"
              variant="outline"
              className="mt-auto w-full text-lg"
              onClick={() => setWhere("reading")}
            >
              Start here
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  /* -- handed to her phone -- */
  if (where === "phone") {
    return (
      <div className="flex min-h-0 flex-1 flex-col px-10 pt-4 pb-6">
        {header}

        <div className="mt-4 flex min-h-0 flex-1 items-center gap-12">
          <div className="flex size-84 flex-none items-center justify-center rounded-[32px] bg-lane-tint">
            <span className="flex items-center justify-center rounded-[20px] bg-surface-raised p-4">
              <QrMock size={228} />
            </span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <h2 className="text-[34px] leading-[1.08] font-bold tracking-[-0.03em]">
              {onPhone
                ? "That's the briefing done"
                : "Scan this and carry on there"}
            </h2>
            <p className="mt-2.5 max-w-[40ch] text-[17px] leading-normal text-fg-muted">
              {onPhone
                ? "Recorded against your name and today's version of the content. One photo to go."
                : "Point your camera at the code. The five points and the questions open on your phone — this screen keeps your place."}
            </p>

            {/* transitions.dev · 15 · Shimmer text. The status is
              * genuinely in progress, so it should not sit there
              * looking like a finished sentence. */}
            <div className="mt-5 flex items-center gap-2.5">
              <span
                className={`size-2.5 flex-none rounded-full ${
                  onPhone ? "bg-success" : "bg-lane-base"
                }`}
              />
              {onPhone ? (
                <span className="font-mono text-[13px] tracking-[0.14em] text-success uppercase">
                  Passed · {QUESTIONS.length} of {QUESTIONS.length} answered
                </span>
              ) : (
                <span
                  className="t-shimmer font-mono text-[13px] tracking-[0.14em] uppercase"
                  data-text={waiting}
                >
                  {waiting}
                </span>
              )}
            </div>

            {/* One bar per question, filling as her phone reports in. */}
            <Stepper
              active={reported}
              total={QUESTIONS.length}
              className="mt-4 max-w-[40ch]"
            />

            <Banner tone={onPhone ? "success" : "neutral"} className="mt-5">
              {onPhone
                ? "Nothing else to read here. The record is the same record."
                : "Changed your mind? You can do it on the glass instead — nothing is lost."}
            </Banner>
          </div>
        </div>

        <BriefingFooter
          hint={
            onPhone
              ? "Reported by your phone"
              : "The tablet is not counting down · take your time"
          }
        >
          <Button
            variant="outline"
            size="cta"
            onClick={() => {
              setReported(0);
              setWhere("reading");
            }}
          >
            Do it here instead
          </Button>
          <Button size="cta" disabled={!onPhone} onClick={onContinue}>
            Continue
          </Button>
        </BriefingFooter>
      </div>
    );
  }

  /* -- the five points, on the glass -- */
  if (where === "reading") {
    return (
      <div className="flex min-h-0 flex-1 flex-col px-10 pt-4 pb-6">
        {header}

        <h2 className="mt-3 text-[27px] leading-[1.14] font-bold tracking-[-0.028em]">
          I understand that I am responsible for protecting electronic
          information as follows
        </h2>

        {/* Two columns: five paragraphs down one side of a 1064-wide
          * screen would run to the floor. */}
        <ol className="mt-4 grid min-h-0 flex-1 grid-cols-2 content-start gap-x-7.5 gap-y-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {RESPONSIBILITIES.map((item, i) => (
            <li
              key={item}
              className="flex gap-3.5 rounded-[16px] border border-line px-4.5 py-3.5"
            >
              <span className="font-mono text-[15px] text-lane-fill">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] leading-normal text-fg-muted">
                {item}
              </span>
            </li>
          ))}
        </ol>

        <BriefingFooter
          hint={`${PASS_MARK} of ${QUESTIONS.length} to pass · no time limit`}
        >
          <Button
            variant="outline"
            size="cta"
            onClick={() => setWhere("choose")}
          >
            Use my phone
          </Button>
          <Button size="cta" onClick={() => setWhere("asking")}>
            Start · {QUESTIONS.length} questions
          </Button>
        </BriefingFooter>
      </div>
    );
  }

  /* -- how did she do -- */
  if (where === "result") {
    const { passed } = quiz;
    return (
      <div className="flex min-h-0 flex-1 flex-col px-10 pt-4 pb-6">
        {header}

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
          <span
            className={`font-mono text-[88px] leading-none font-bold ${
              passed ? "text-success" : "text-danger"
            }`}
          >
            {score}
            <span className="text-fg-subtle">/{QUESTIONS.length}</span>
          </span>
          <h2 className="mt-6 text-[34px] leading-tight font-bold tracking-[-0.03em]">
            {passed
              ? "That's the security briefing done"
              : `You need ${PASS_MARK} of ${QUESTIONS.length}`}
          </h2>
          <p className="mt-3 max-w-[46ch] text-[17px] leading-normal text-fg-muted">
            {passed
              ? "Recorded against your name and today's version of the content. You will not be asked again for this site."
              : "Nothing is held against you — read the five points again and answer them once more."}
          </p>
        </div>

        <BriefingFooter
          hint={
            passed
              ? "Recorded · one photo to go"
              : "The questions come back in a different order"
          }
        >
          {passed ? (
            <Button size="cta" onClick={onContinue}>
              Continue
            </Button>
          ) : (
            <Button size="cta" onClick={retake}>
              Read it again
            </Button>
          )}
        </BriefingFooter>
      </div>
    );
  }

  /* -- one question at a time -- */

  /* Two columns centred against each other on a 44 / 56 split: the
   * length of the question no longer decides where the options sit,
   * which is what the top-aligned version got wrong. */
  const left = deck.length - index - 1;
  const wrongSoFar = index + (picked ? 1 : 0) - score;

  return (
    <div className="flex min-h-0 flex-1 flex-col px-10 pt-4 pb-6">
      {header}

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,44fr)_minmax(0,56fr)] items-center gap-14">
        <div className="flex flex-col gap-3.5">
          <span className="font-mono text-[13px] tracking-[0.14em] text-lane-fill uppercase">
            Question {index + 1} of {deck.length}
          </span>
          <h2 className="text-[38px] leading-[1.1] font-bold tracking-[-0.032em] text-pretty">
            {question.situation}
          </h2>
          <p className="text-[20px] leading-[1.45] text-fg-subtle">
            {askLine({
              ask: question.ask,
              answered: picked !== null,
              left,
            })}
          </p>
        </div>

        {/* One gap in both states: the cards grow smoothly, so a gap
          * that changes at the moment of the tap would snap against
          * the animation. */}
        <div className="flex flex-col gap-3.5">
          {question.options.map((option) => (
            <QuestionOption
              key={option.text}
              option={option}
              state={optionState(option, picked)}
              rule={question.rule}
              scale="tablet"
              onSelect={() => answer(option)}
            />
          ))}
        </div>
      </div>

      <BriefingFooter
        hint={`No time limit · ${PASS_MARK} of ${QUESTIONS.length} to pass${
          wrongSoFar > 0 ? ` · ${wrongSoFar} wrong so far` : ""
        }`}
      >
        <Button
          size="cta"
          className="h-14 rounded-full px-8 text-[19px]"
          disabled={picked === null}
          onClick={next}
        >
          {atLast ? "See how you did" : "Next question"}
        </Button>
      </BriefingFooter>
    </div>
  );
}
