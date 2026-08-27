import * as React from "react";
import { ControlDeck } from "@/components/control-deck";
import { NoticeList, type Notice } from "@/components/notice";
import { PhoneFrame, PhoneScreen } from "@/components/phone-frame";
import { Button } from "@/components/ui/button";
import { LobbyMap } from "@/prototypes/lobby-map";
import { VisitorPassCard, type PassRow } from "@/prototypes/visitor-pass";

/* -- study K2·M · the same screen on her phone ----------------------- */

/**
 * The at-kiosk success state on her own phone.
 *
 * The pass itself is the same component the pre-arrival flow ends on —
 * checking in early or at the kiosk produces one object, not two
 * lookalikes. What this screen adds is the two things she could not
 * know before arriving: today's notices, and the way to the lifts.
 *
 * Both lanes end here. A visitor is told where the lifts are; a trade
 * is told where the service lift is and that her permit is live. Same
 * screen, same order, its own facts — so the defaults below are the
 * visitor's and the contractor passes its own.
 */

/** Where the lifts are, on a phone: "East lifts → L9". */
export type KioskRoute = { zone: string; target: string; caption: string };

/** Abbreviated for a phone: "East lifts → L9", not the tablet's arrow. */
const VISITOR_ROUTE: KioskRoute = {
  zone: "Lobby · ground",
  target: "East lifts → L9",
  caption: "Past the café, then right",
};

export type KioskPhoneContent = {
  status?: string;
  headline?: string;
  body?: string;
  route?: KioskRoute;
  notices?: Notice[];
  passCaption?: string;
  passRows?: PassRow[];
  /** The last word on the way out. The rule it states is the same on
   *  both lanes: the reader ends a visit, a phone never does. */
  signOut?: string;
};

function CheckedInPhoneScreen({
  status = "Checked in · 04:24PM",
  headline = "You're in, Marta",
  body = "Head up to Level 9 whenever you're ready. No need to wait here.",
  route = VISITOR_ROUTE,
  notices,
  passCaption,
  passRows,
  signOut = "Hold the same pass to the tablet on your way out to sign out.",
}: KioskPhoneContent) {
  return (
    <PhoneScreen
      footer={
        <>
          <Button size="cta" variant="secondary" className="w-full">
            Add to wallet
          </Button>
          <p className="text-center text-[13px] text-fg-subtle">
            Lost it? The lobby tablet finds you by name.
          </p>
        </>
      }
    >
      <div className="flex items-center gap-2">
        <span className="flex size-5.5 flex-none items-center justify-center rounded-full bg-lane-tint">
          <span className="size-2 rounded-full bg-lane-base" />
        </span>
        <span className="font-mono text-xs tracking-[0.14em] text-lane-fill uppercase">
          {status}
        </span>
      </div>

      <h2 className="mt-3 text-[29px] leading-tight font-bold tracking-[-0.03em]">
        {headline}
      </h2>
      <p className="mt-1.5 text-[15px] leading-normal text-fg-muted">{body}</p>

      <VisitorPassCard
        className="mt-4.5"
        caption={passCaption}
        rows={passRows}
      />

      {/* Added over the pre-arrival pass: the way to the lifts… */}
      <div className="mt-3.5 rounded-lg border border-line p-3">
        <div className="flex items-baseline justify-between px-0.5 pb-2">
          <span className="font-mono text-[10px] tracking-[0.12em] text-fg-subtle uppercase">
            {route.zone}
          </span>
          <span className="text-[13px] font-semibold whitespace-nowrap text-lane-fill">
            {route.target}
          </span>
        </div>
        <LobbyMap scale={0.608} />
        <p className="px-0.5 pt-2.25 text-[13px] text-fg-muted">
          {route.caption}
        </p>
      </div>

      {/* …and what changed about the building today. */}
      <NoticeList className="mt-3.5" notices={notices} />

      <p className="mt-3.5 pb-2 text-[15px] leading-normal text-fg-muted">
        {signOut}
      </p>
    </PhoneScreen>
  );
}

export function KioskPhone({
  tabs,
  ...content
}: { tabs: React.ReactNode } & KioskPhoneContent) {
  return (
    <div className="flex flex-col items-center">
      <PhoneFrame>
        <CheckedInPhoneScreen {...content} />
      </PhoneFrame>
      <ControlDeck tabs={tabs} />
    </div>
  );
}
