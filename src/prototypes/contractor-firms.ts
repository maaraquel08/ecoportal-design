/**
 * The firms the building already has on file.
 *
 * R2: the eight employer fields are identical for every colleague a
 * trade has, so the firm is registered once and looked up after that —
 * which is why a person on a job never rewrites their employer's
 * registration from a phone.
 */

export type Company = {
  name: string;
  address: string;
  postcode: string;
  suburb: string;
  city: string;
  country: string;
  industry: string;
  employees: string;
};

export const REGISTERED: Company[] = [
  {
    name: "Kelly Electrical Pty Ltd",
    address: "14 Bourke Road",
    postcode: "2015",
    suburb: "Alexandria",
    city: "Sydney",
    country: "Australia",
    industry: "Electrical",
    employees: "34",
  },
  {
    name: "Kellard Mechanical",
    address: "8 Chalmers Street",
    postcode: "2008",
    suburb: "Redfern",
    city: "Sydney",
    country: "Australia",
    industry: "Mechanical",
    employees: "62",
  },
  {
    name: "Northline Plumbing",
    address: "3 Bay Street",
    postcode: "2009",
    suburb: "Pyrmont",
    city: "Sydney",
    country: "Australia",
    industry: "Plumbing",
    employees: "11",
  },
];

export const BLANK: Company = {
  name: "",
  address: "",
  postcode: "",
  suburb: "",
  city: "",
  country: "Australia",
  industry: "",
  employees: "",
};

/** The "not on file" choice, kept out of the firm namespace. */
export const MANUAL = "__manual__";

export const COUNTRIES = ["Australia", "New Zealand", "Singapore", "United Kingdom"];

export const INDUSTRIES = [
  "Electrical",
  "Mechanical",
  "Plumbing",
  "Construction",
  "Cleaning",
  "Security",
];
