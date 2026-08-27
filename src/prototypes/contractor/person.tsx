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
import { EMAIL_RE, required } from "@/lib/form";
import { HOSTS } from "@/prototypes/shared/hosts";

/**
 * The one description of a contractor's own fields.
 *
 * Sign-up asks five things (name, email, mobile, role) and check-in
 * asks seven (name, email, mobile, firm, host, reason). Four of them
 * are the same four, so before this file existed the kiosk and the
 * phone each carried their own copy of the overlap and drifted: the
 * glass had no role, the phone had no host or reason, and the labels
 * had already stopped matching.
 *
 * So the union is declared once, here, and both surfaces render from
 * it. What differs between them is layout — two columns at the glass,
 * one on a phone — and which fields arrive already answered. Neither
 * is allowed to differ in what is asked, what it is called, or
 * whether it is required.
 */

export type Person = {
  first: string;
  last: string;
  email: string;
  mobile: string;
  role: string;
  host: string;
  reason: string;
};

export const BLANK_PERSON: Person = {
  first: "",
  last: "",
  email: "",
  mobile: "",
  role: "",
  host: "",
  reason: "",
};

/**
 * Which of the two things a field is.
 *
 * `identity` is the account — asked once ever, and true on every job
 * after this one. `visit` is this arrival only, and asked again next
 * time. Merging the forms does not merge the two lifetimes, so the
 * groups survive into the layout and the copy.
 */
export type PersonGroup = "identity" | "visit";

export type PersonField = {
  key: keyof Person;
  label: string;
  group: PersonGroup;
  /** Rendered with the "Optional" suffix, and never validated. */
  optional?: boolean;
  /** `host` is the building's directory rather than free text. */
  kind?: "text" | "email" | "tel" | "host";
  placeholder: string;
  autoComplete?: string;
  inputMode?: "email" | "tel";
  /** Under-field note, per surface — the reason differs by door. */
  note?: Partial<Record<Surface, string>>;
  validate?: (value: unknown) => string | null;
  /** Takes the full row at the glass, where the grid has two columns. */
  wide?: boolean;
};

export type Surface = "kiosk" | "phone";

const email = (value: unknown) => {
  const text = String(value ?? "").trim();
  if (!text) return "Enter your email — your pass is sent here";
  if (!EMAIL_RE.test(text))
    return "That email doesn't look right — check for a typo";
  return null;
};

export const PERSON_FIELDS: readonly PersonField[] = [
  {
    key: "first",
    label: "First name",
    group: "identity",
    placeholder: "Priya",
    autoComplete: "given-name",
    validate: required("Enter your first name"),
  },
  {
    key: "last",
    label: "Last name",
    group: "identity",
    placeholder: "Raman",
    autoComplete: "family-name",
    validate: required("Enter your last name"),
  },
  {
    key: "email",
    label: "Email",
    group: "identity",
    kind: "email",
    inputMode: "email",
    placeholder: "priya.raman@kellyelec.com.au",
    autoComplete: "email",
    note: {
      kiosk: "Next time your clearance arrives here instead",
      phone: "The address Dan's link came to",
    },
    validate: email,
  },
  {
    key: "mobile",
    label: "Mobile number",
    group: "identity",
    optional: true,
    kind: "tel",
    inputMode: "tel",
    placeholder: "So the site can reach you",
    autoComplete: "tel",
  },
  {
    key: "role",
    label: "Role",
    group: "identity",
    optional: true,
    placeholder: "Electrician",
  },
  {
    key: "host",
    label: "Who are you here to see?",
    group: "visit",
    optional: true,
    kind: "host",
    placeholder: "Start typing a name",
  },
  {
    key: "reason",
    label: "Reason for the visit",
    group: "visit",
    optional: true,
    placeholder: "Level 4 lighting rough-in",
    wide: true,
  },
];

export const personFields = (group: PersonGroup) =>
  PERSON_FIELDS.filter((field) => field.group === group);

/** The three that stop a submit. Both surfaces answer to this one gate. */
export const personComplete = (person: Person) =>
  Boolean(person.first.trim()) &&
  Boolean(person.last.trim()) &&
  EMAIL_RE.test(person.email.trim());

/* -- rendering ------------------------------------------------------ */

function Optional() {
  return (
    <span className="ml-1.5 text-[13px] font-normal text-fg-subtle">
      Optional
    </span>
  );
}

/**
 * One field, on either surface.
 *
 * The control is identical at the glass and on the phone — same
 * height, same label, same validator — so it is written once. A field
 * the site already holds is passed as `locked`: shown, because the
 * check-in list says so, but never re-typed.
 */
export function PersonFieldRow({
  field,
  surface,
  value,
  onChange,
  locked,
  className,
}: {
  field: PersonField;
  surface: Surface;
  value: string;
  onChange: (next: string) => void;
  locked?: boolean;
  className?: string;
}) {
  const note = field.note?.[surface];
  const label = (
    <FieldLabel>
      {field.label}
      {field.optional ? <Optional /> : null}
    </FieldLabel>
  );

  if (field.kind === "host") {
    return (
      <Field name={field.key} className={className}>
        {label}
        <Combobox
          items={HOSTS}
          value={value || null}
          onValueChange={(next) => onChange(String(next ?? ""))}
        >
          <ComboboxInput
            placeholder={field.placeholder}
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
        {note ? <FieldDescription>{note}</FieldDescription> : null}
      </Field>
    );
  }

  return (
    <Field
      name={field.key}
      className={className}
      validationMode="onSubmit"
      validate={field.validate}
    >
      {label}
      <FieldControl
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={locked}
        tabIndex={locked ? -1 : undefined}
        type={field.kind === "email" ? "email" : field.kind === "tel" ? "tel" : undefined}
        inputMode={field.inputMode}
        placeholder={field.placeholder}
        autoComplete={field.autoComplete}
        autoCapitalize={
          field.key === "first" || field.key === "last"
            ? "words"
            : field.kind === "email"
              ? "none"
              : undefined
        }
        spellCheck={field.kind === "email" ? false : undefined}
        className="h-12 text-base"
      />
      {note ? <FieldDescription>{note}</FieldDescription> : null}
      <FieldError />
    </Field>
  );
}

/**
 * The firm, on the visit half of either form.
 *
 * It is on the check-in list, so it is shown — but it was settled on
 * the step before this one, and a value the building already holds is
 * never re-typed in a lobby.
 */
export function CompanyReadOnly({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <Field name="company" className={className}>
      <FieldLabel>Company</FieldLabel>
      <FieldControl
        value={name}
        readOnly
        tabIndex={-1}
        className="h-12 text-base"
      />
      <FieldDescription>Answered on the last screen</FieldDescription>
    </Field>
  );
}
