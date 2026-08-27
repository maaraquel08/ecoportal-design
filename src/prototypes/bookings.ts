/**
 * Today's expected visitors.
 *
 * Everyone here already has a booking — they just don't have the code.
 * The kiosk shows surnames with an initial only: enough for a real
 * visitor to recognise themselves, nothing worth writing down for
 * anyone else reading over their shoulder (study X1).
 */
export type Booking = {
  first: string;
  last: string;
  /** Deliberately vague — the hour is not shown on an open kiosk. */
  expected: "this morning" | "this afternoon";
  /** Where the code goes. Masked before it is ever displayed. */
  email: string;
  host: string;
};

export const BOOKINGS: Booking[] = [
  { first: "Marta", last: "Nowak", expected: "this afternoon", email: "marta.nowak@northwind.studio", host: "Sam Whitfield" },
  { first: "Piotr", last: "Nowicki", expected: "this afternoon", email: "p.nowicki@kellard.com.au", host: "Dana Reyes" },
  { first: "Dana", last: "Nowell", expected: "this morning", email: "dnowell@brightsideco.com", host: "Tom Beck" },
  { first: "Tomas", last: "Nowacki", expected: "this afternoon", email: "tomas@nowacki-design.pl", host: "Priya Raman" },
  { first: "Ana", last: "Novak", expected: "this morning", email: "ana.novak@meridian.io", host: "Sam Whitfield" },
  { first: "Priya", last: "Raman", expected: "this morning", email: "priya.raman@kellard.com.au", host: "Leah Okonjo" },
  { first: "Dan", last: "Iverson", expected: "this afternoon", email: "d.iverson@kellard.com.au", host: "Facilities" },
  { first: "Leah", last: "Okonjo", expected: "this afternoon", email: "leah@okonjo.legal", host: "Marcus Bell" },
  { first: "Marcus", last: "Bell", expected: "this morning", email: "m.bell@harbourline.com", host: "Dana Reyes" },
  { first: "Yuki", last: "Tanaka", expected: "this afternoon", email: "y.tanaka@tanaka-arch.jp", host: "Tom Beck" },
];

/** "Nowak, M." — recognisable to her, useless to a stranger. */
export const maskedName = (booking: Booking) =>
  `${booking.last}, ${booking.first.charAt(0)}.`;

/** "M·N" for the initials tile. */
export const initials = (booking: Booking) =>
  `${booking.first.charAt(0)}·${booking.last.charAt(0)}`;

/** "m•••••@northwind.studio" — enough to recognise the inbox. */
export function maskedEmail(email: string) {
  const [name, domain] = email.split("@");
  return `${name.charAt(0)}${"•".repeat(Math.max(name.length - 1, 3))}@${domain}`;
}

/** Surname prefix match, the way someone types their own name. */
export const matchBookings = (query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return BOOKINGS;
  return BOOKINGS.filter((booking) =>
    booking.last.toLowerCase().startsWith(q),
  );
};

const WORDS = [
  "No",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];

/** The study writes the count as a word; past ten, digits read better. */
export const countWord = (n: number) => WORDS[n] ?? String(n);
