import * as React from "react";
import { QrMock } from "@/components/qr-mock";
import { cn } from "@/lib/cn";
import { Separator } from "@/components/ui/separator";

/**
 * The visitor pass, shared by the pre-arrival flow and the at-kiosk
 * phone state so the two are the same object rather than two drawings
 * of it: the QR with its reference and expiry, then host, level and
 * validity.
 */
function Row({
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

export type PassRow = { label: string; value: string; mono?: boolean };

/** The visitor pass, unless a lane supplies its own facts. */
export const VISITOR_PASS_CAPTION = "V-2208 · exp 6:00pm";

export const VISITOR_PASS_ROWS: PassRow[] = [
  { label: "Host", value: "Sam Whitfield" },
  { label: "Level", value: "9 · Kestrel Legal" },
  { label: "Valid", value: "Thu · to 6:00pm", mono: true },
];

/**
 * The contractor pass. The same object with the firm and the work in
 * place of the host and the level, so the phone's cleared screen and
 * the kiosk's on-site screen cannot drift apart.
 */
export const CONTRACTOR_PASS_CAPTION = "C-4471 · exp Tue 6:00pm";

export const contractorPassRows = (company: string): PassRow[] => [
  { label: "Company", value: company },
  { label: "Work", value: "Level 4 · electrical" },
  { label: "Valid", value: "Tue · 7:00am to 6:00pm", mono: true },
];

/**
 * The permit only exists once she is on site, so the pass she carries
 * before arriving does not name one. The kiosk's own copy adds it.
 */
export const CONTRACTOR_PERMIT_ROW: PassRow = {
  label: "Permit",
  value: "PMT-4471 · hot works",
  mono: true,
};

export function VisitorPassCard({
  className = "",
  /** The code is the same; only the room it gets differs by device. */
  qrSize = 214,
  /** Let the code take whatever height is left, rather than a fixed size. */
  fill,
  /** The pass's own reference and expiry, printed under the code. */
  caption = VISITOR_PASS_CAPTION,
  /** What the pass asserts. Three rows, whichever lane issued it. */
  rows = VISITOR_PASS_ROWS,
}: {
  className?: string;
  qrSize?: number;
  fill?: boolean;
  caption?: string;
  rows?: PassRow[];
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        fill && "min-h-0 flex-1",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-3.5 rounded-xl border border-line p-5",
          fill && "min-h-0 flex-1",
        )}
      >
        <div
          className={cn(
            "flex w-full items-center justify-center rounded-lg bg-bg",
            fill && "min-h-0 flex-1",
          )}
          style={fill ? undefined : { height: `${qrSize + 16}px` }}
        >
          <QrMock size={qrSize} fill={fill} />
        </div>
        <span className="font-mono text-sm text-fg-muted">{caption}</span>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-line px-4.5 py-3.5">
        {rows.map((row, index) => (
          <React.Fragment key={row.label}>
            {index > 0 ? <Separator /> : null}
            <Row label={row.label} value={row.value} mono={row.mono} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
