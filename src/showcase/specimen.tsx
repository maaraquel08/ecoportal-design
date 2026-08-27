import * as React from "react";

export function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.14em] text-fg-subtle uppercase">
      {children}
    </span>
  );
}

/**
 * One component, named and framed. The frame is a hairline card — no
 * shadows, per the brand's "everything is drawn, nothing floats".
 */
export function Specimen({
  name,
  note,
  span,
  align = "start",
  children,
}: {
  name: string;
  note?: string;
  /** Widen a specimen that needs the room. */
  span?: "half" | "full";
  align?: "start" | "center";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-3 rounded-lg border border-line p-5 ${
        span === "full"
          ? "sm:col-span-2 lg:col-span-3"
          : span === "half"
            ? "lg:col-span-2"
            : ""
      }`}
    >
      <div className="flex flex-col gap-0.5">
        <Meta>{name}</Meta>
        {note ? (
          <span className="text-[13px] leading-snug text-fg-subtle">
            {note}
          </span>
        ) : null}
      </div>
      <div
        className={`flex flex-1 flex-wrap gap-3 ${
          align === "center" ? "items-center" : "items-start"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function Category({
  index,
  title,
  aside,
  children,
}: {
  index: string;
  title: string;
  aside?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-[11px] tracking-[0.14em] text-fg uppercase">
          {index} · {title}
        </h2>
        {aside ? <Meta>{aside}</Meta> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}
