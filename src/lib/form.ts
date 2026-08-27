/** Good enough for a prototype: one @, one dot after it, no spaces. */
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** A Base UI field validator that only asks the field to be filled in. */
export const required = (message: string) => (value: unknown) =>
  String(value ?? "").trim() ? null : message;
