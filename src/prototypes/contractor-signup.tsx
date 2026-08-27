import * as React from "react";
import { PhoneScreen } from "@/components/phone-frame";
import { PhoneSheet, SheetOption } from "@/components/phone-sheet";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { required } from "@/lib/form";
import {
  Footnote,
  Mono,
  StepBar,
  StepHeading,
} from "@/prototypes/contractor-chrome";
import {
  BLANK,
  COUNTRIES,
  INDUSTRIES,
  MANUAL,
  REGISTERED,
  type Company,
} from "@/prototypes/contractor-firms";
import {
  CompanyReadOnly,
  personComplete,
  personFields,
  PersonFieldRow,
  type Person,
} from "@/prototypes/contractor-person";
import { useShakeInvalid } from "@/prototypes/use-shake-invalid";

/* -- the screens ---------------------------------------------------- */

/**
 * First-time contractor sign-up.
 *
 * Journey A's lowest point is this screen: "I don't know our postcode.
 * How many people work at my company?" — asked of a person standing in
 * a lobby with a tool bag. R2 is the answer: the eight employer fields
 * are identical for every colleague she has, so the firm is looked up
 * once and she only ever types the five that are hers.
 *
 * All thirteen fields the brief lists are here. What changes is who
 * fills them in, and when.
 *
 * Sign-up is not a destination. It is what the link in Dan's email
 * opens when the address it was sent to is not on file yet, so these
 * three screens are steps in that flow and take their numbering from
 * it.
 */

/* -- company information ------------------------------------------- */

export function CompanyScreen({
  company,
  onChange,
  onContinue,
  onBack,
  step,
  total,
}: {
  company: Company;
  onChange: (next: Company) => void;
  onContinue: () => void;
  onBack: () => void;
  step: number;
  total: number;
}) {
  const { scopeRef, shake } = useShakeInvalid<HTMLFormElement>();
  const [known, setKnown] = React.useState(false);
  /** Chose "not listed", so the firm is typed rather than looked up. */
  const [manual, setManual] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const set = (key: keyof Company) => (value: string) =>
    onChange({ ...company, [key]: value });

  /* R2: a firm that is already registered answers all eight, and they
   * are locked — one person on a job does not get to rewrite their
   * employer's registration from a phone. Choosing "not listed"
   * clears them so one firm's address is never filed under another
   * firm's name. */
  const openSheet = () => setSheetOpen(true);

  /* Picking is the decision — there is nothing to confirm, so the
   * sheet applies it and closes rather than carrying a CTA. */
  const chooseFirm = (name: string) => {
    setSheetOpen(false);
    if (name === MANUAL) {
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

  return (
    <>
      <StepBar step={step} total={total} />
      <Form
        ref={scopeRef}
        className="min-h-0 flex-1 gap-0"
        onFormSubmit={() => {
          if (
            !company.name.trim() ||
            !company.address.trim() ||
            !company.postcode.trim() ||
            !company.suburb.trim() ||
            !company.city.trim() ||
            !company.country.trim()
          ) {
            return;
          }
          onContinue();
        }}
      >
        <PhoneScreen
          footer={
            <>
              <Button size="cta" type="submit" className="w-full" onClick={shake}>
                Continue
              </Button>
              <Button
                size="cta"
                variant="secondary"
                type="button"
                className="w-full"
                onClick={onBack}
              >
                Back to the job
              </Button>
              <Footnote>
                Once for the firm — not per job, and not per person.
              </Footnote>
            </>
          }
        >
          <StepHeading
            label="Company information"
            step={step}
            total={total}
            title="Who do you work for?"
            body="If your firm is already registered with the building, the rest of this fills itself."
          />

          <Field name="companyName" className="mt-4.5">
            <FieldLabel>Company name</FieldLabel>
            {manual ? (
              <>
                <FieldControl
                  value={company.name}
                  onChange={(event) => set("name")(event.target.value)}
                  placeholder="Your firm's registered name"
                  className="h-12 text-base"
                />
                <button
                  type="button"
                  onClick={openSheet}
                  className="mt-2 w-fit text-sm font-semibold text-lane-fill underline decoration-lane-soft underline-offset-2"
                >
                  Choose from the list instead
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={openSheet}
                className="flex h-12 w-full items-center justify-between gap-2 rounded-md border border-line bg-surface-raised px-3 text-left text-base transition-colors duration-fast ease-out-quad hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className={company.name ? "" : "text-fg-subtle"}>
                  {company.name || "Choose your firm"}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-none text-fg-subtle"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            )}
          </Field>

          {known ? (
            <Banner tone="success" className="mt-3">
              Found. The firm's details come from its registration and are
              read-only here — if something is wrong, your employer updates it
              once and it changes for everyone.
            </Banner>
          ) : (
            <Banner tone="neutral" className="mt-3">
              Your firm is not on file yet. Fill this in once and every
              colleague who comes here after you skips it.
            </Banner>
          )}

          <Fieldset className="mt-4.5">
            <FieldsetLegend>
              Where the firm is
              {known ? (
                <span className="ml-1.5 text-[13px] font-normal text-fg-subtle">
                  From the registration
                </span>
              ) : null}
            </FieldsetLegend>

            <Field
              name="address"
              validationMode="onSubmit"
              validate={required("Enter the street address")}
            >
              <FieldLabel>Address</FieldLabel>
              <FieldControl
                value={company.address}
                onChange={(event) => set("address")(event.target.value)}
                readOnly={known}
                tabIndex={known ? -1 : undefined}
                placeholder="14 Bourke Road"
                autoComplete="street-address"
                className="h-12 text-base"
              />
              <FieldError />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field
                name="postcode"
                validationMode="onSubmit"
                validate={required("Postcode")}
              >
                <FieldLabel>Postcode</FieldLabel>
                <FieldControl
                  value={company.postcode}
                  onChange={(event) => set("postcode")(event.target.value)}
                  readOnly={known}
                  tabIndex={known ? -1 : undefined}
                  inputMode="numeric"
                  placeholder="2015"
                  autoComplete="postal-code"
                  className="h-12 text-base"
                />
                <FieldError />
              </Field>

              <Field
                name="suburb"
                validationMode="onSubmit"
                validate={required("Suburb")}
              >
                <FieldLabel>Suburb</FieldLabel>
                <FieldControl
                  value={company.suburb}
                  onChange={(event) => set("suburb")(event.target.value)}
                  readOnly={known}
                  tabIndex={known ? -1 : undefined}
                  placeholder="Alexandria"
                  className="h-12 text-base"
                />
                <FieldError />
              </Field>
            </div>

            <Field
              name="city"
              validationMode="onSubmit"
              validate={required("City")}
            >
              <FieldLabel>City</FieldLabel>
              <FieldControl
                value={company.city}
                onChange={(event) => set("city")(event.target.value)}
                readOnly={known}
                tabIndex={known ? -1 : undefined}
                placeholder="Sydney"
                className="h-12 text-base"
              />
              <FieldError />
            </Field>

            <Field name="country">
              <FieldLabel>Country</FieldLabel>
              <Select
                readOnly={known}
                value={company.country}
                onValueChange={(value) => set("country")(String(value))}
              >
                <SelectTrigger
                  tabIndex={known ? -1 : undefined}
                  className="h-12 w-full text-base"
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
          </Fieldset>

          <Fieldset className="mt-4.5 pb-2">
            <FieldsetLegend>
              About the firm
              <span className="ml-1.5 text-[13px] font-normal text-fg-subtle">
                Optional
              </span>
            </FieldsetLegend>

            <Field name="industry">
              <FieldLabel>Industry</FieldLabel>
              <Select
                readOnly={known}
                value={company.industry || null}
                onValueChange={(value) => set("industry")(String(value ?? ""))}
              >
                <SelectTrigger
                  tabIndex={known ? -1 : undefined}
                  className="h-12 w-full text-base"
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

            <Field name="employees">
              <FieldLabel>Number of employees</FieldLabel>
              <NumberField
                readOnly={known}
                min={1}
                value={company.employees ? Number(company.employees) : null}
                onValueChange={(value) =>
                  set("employees")(value === null ? "" : String(value))
                }
              >
                <NumberFieldGroup>
                  {known ? null : (
                    <NumberFieldDecrement>−</NumberFieldDecrement>
                  )}
                  <NumberFieldInput
                    readOnly={known}
                    tabIndex={known ? -1 : undefined}
                    className="h-12 text-base"
                  />
                  {known ? null : (
                    <NumberFieldIncrement>+</NumberFieldIncrement>
                  )}
                </NumberFieldGroup>
              </NumberField>
              <FieldDescription>
                Roughly is fine. It sizes the site's induction records.
              </FieldDescription>
            </Field>
          </Fieldset>

          <PhoneSheet
            open={sheetOpen}
            title="Your firm"
            onClose={() => setSheetOpen(false)}
          >
            <div className="flex flex-col">
              {REGISTERED.map((item) => (
                <SheetOption
                  key={item.name}
                  title={item.name}
                  body={`${item.suburb} · ${item.industry}`}
                  selected={known && company.name === item.name}
                  onSelect={() => chooseFirm(item.name)}
                />
              ))}
              <Separator className="my-2" />
              <SheetOption
                title="My firm isn't listed"
                body="You will fill the company details in once"
                selected={manual}
                onSelect={() => chooseFirm(MANUAL)}
              />
            </div>
          </PhoneSheet>
        </PhoneScreen>
      </Form>
    </>
  );
}

/* -- personal information · and this job --------------------------- */

/**
 * The same merged form as the glass, one column wide.
 *
 * A trade who filled this in on her phone last night and a trade
 * filling it in at the tablet in the morning are answering the same
 * questions, in the same order, under the same labels — because both
 * screens render `PERSON_FIELDS`. What the phone changes is that the
 * email is already known: it is the address Dan's link was sent to,
 * and a different address would be a different person.
 */

export function PersonScreen({
  company,
  person,
  onChange,
  onContinue,
  onBack,
  step,
  total,
}: {
  /** Settled on the step before this one, so it is shown, not asked. */
  company: Company;
  person: Person;
  onChange: (next: Person) => void;
  onContinue: () => void;
  onBack: () => void;
  step: number;
  total: number;
}) {
  const { scopeRef, shake } = useShakeInvalid<HTMLFormElement>();

  const set = (key: keyof Person) => (value: string) =>
    onChange({ ...person, [key]: value });

  return (
    <>
      <StepBar step={step} total={total} />
      <Form
        ref={scopeRef}
        className="min-h-0 flex-1 gap-0"
        onFormSubmit={() => {
          if (!personComplete(person)) return;
          onContinue();
        }}
      >
        <PhoneScreen
          footer={
            <>
              <Button size="cta" type="submit" className="w-full" onClick={shake}>
                Create my account
              </Button>
              <Button
                size="cta"
                variant="secondary"
                type="button"
                className="w-full"
                onClick={onBack}
              >
                Back
              </Button>
            </>
          }
        >
          <StepHeading
            label="Personal information"
            step={step}
            total={total}
            title="And who are you?"
            body="Your account and this job, on one screen. Three are required, and none of it is asked again on your next job."
          />

          <Fieldset className="mt-4.5">
            <FieldsetLegend>
              Your details
              <span className="ml-1.5 text-[13px] font-normal text-fg-subtle">
                Asked once ever
              </span>
            </FieldsetLegend>

            {personFields("identity").map((field) => (
              <PersonFieldRow
                key={field.key}
                field={field}
                surface="phone"
                value={person[field.key]}
                onChange={set(field.key)}
                /* The address the clearance link came to. It is how
                 * the site found — or failed to find — this person. */
                locked={field.key === "email"}
              />
            ))}
          </Fieldset>

          <Fieldset className="mt-4.5 pb-2">
            <FieldsetLegend>
              This job
              <span className="ml-1.5 text-[13px] font-normal text-fg-subtle">
                Asked again next job
              </span>
            </FieldsetLegend>

            <CompanyReadOnly name={company.name} />

            {personFields("visit").map((field) => (
              <PersonFieldRow
                key={field.key}
                field={field}
                surface="phone"
                value={person[field.key]}
                onChange={set(field.key)}
              />
            ))}
          </Fieldset>

          <Banner tone="neutral" className="mt-1">
            Your details, not your firm's. Next time you confirm them in one
            tap.
          </Banner>
        </PhoneScreen>
      </Form>
    </>
  );
}

/* -- signed up ------------------------------------------------------ */

export function SignedUpScreen({
  firstName,
  company,
  onContinue,
  step,
  total,
}: {
  firstName: string;
  company: Company;
  onContinue: () => void;
  step: number;
  total: number;
}) {
  return (
    <>
      <StepBar step={step} total={total} />
      <PhoneScreen
        footer={
          <>
            <Button size="cta" className="w-full" onClick={onContinue}>
              Start the briefing · 3 min
            </Button>
            <Footnote>
              You will not sign up again — for this site or any other on the
              network.
            </Footnote>
          </>
        }
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-5.5 items-center justify-center rounded-full bg-(--eco-green-tint)">
            <span className="size-2 rounded-full bg-success" />
          </span>
          <Mono className="text-success" size="text-[13px]">
            Account created
          </Mono>
        </div>

        <h2 className="mt-3 text-[29px] leading-[1.1] font-bold tracking-[-0.03em]">
          You're signed up, {firstName}
        </h2>
        <p className="mt-2 text-base leading-normal text-fg-muted">
          One security briefing to go and you are cleared before you leave the
          depot.
        </p>

        <div className="mt-4.5 flex flex-col gap-3 rounded-lg border border-line px-4.5 py-4">
          <Mono size="text-[10px]">On file for your firm</Mono>
          <div className="text-base font-semibold">{company.name}</div>
          <div className="text-sm leading-normal text-fg-subtle">
            {company.address}
            <br />
            {company.suburb} {company.postcode} · {company.city}
            <br />
            {company.country}
            {company.industry ? ` · ${company.industry}` : ""}
            {company.employees ? ` · ${company.employees} staff` : ""}
          </div>
        </div>

        <Banner tone="neutral" className="mt-3.5 pb-2">
          Your colleagues from {company.name || "your firm"} will not be asked
          for any of the company details again.
        </Banner>
      </PhoneScreen>
    </>
  );
}
