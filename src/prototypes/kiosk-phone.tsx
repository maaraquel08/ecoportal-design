import * as React from "react";
import { ControlDeck } from "@/components/control-deck";
import { NoticeList } from "@/components/notice";
import { PhoneFrame, PhoneScreen } from "@/components/phone-frame";
import { Button } from "@/components/ui/button";
import { LobbyMap } from "@/prototypes/lobby-map";
import { VisitorPassCard } from "@/prototypes/visitor-pass";

/* -- study K2·M · the same screen on her phone ----------------------- */

/**
 * The at-kiosk success state on her own phone.
 *
 * The pass itself is the same component the pre-arrival flow ends on —
 * checking in early or at the kiosk produces one object, not two
 * lookalikes. What this screen adds is the two things she could not
 * know before arriving: today's notices, and the way to the lifts.
 */
function CheckedInPhoneScreen() {
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
        <span className="flex size-5.5 flex-none items-center justify-center rounded-full bg-house-tint">
          <span className="size-2 rounded-full bg-house-base" />
        </span>
        <span className="font-mono text-xs tracking-[0.14em] text-house-fill uppercase">
          Checked in · 04:24PM
        </span>
      </div>

      <h2 className="mt-3 text-[29px] leading-tight font-bold tracking-[-0.03em]">
        You're in, Marta
      </h2>
      <p className="mt-1.5 text-[15px] leading-normal text-fg-muted">
        Head up to Level 9 whenever you're ready. No need to wait here.
      </p>

      <VisitorPassCard className="mt-4.5" />

      {/* Added over the pre-arrival pass: the way to the lifts… */}
      <div className="mt-3.5 rounded-lg border border-line p-3">
        <div className="flex items-baseline justify-between px-0.5 pb-2">
          <span className="font-mono text-[10px] tracking-[0.12em] text-fg-subtle uppercase">
            Lobby · ground
          </span>
          <span className="text-[13px] font-semibold whitespace-nowrap text-house-fill">
            East lifts → L9
          </span>
        </div>
        <LobbyMap scale={0.608} />
        <p className="px-0.5 pt-2.25 text-[13px] text-fg-muted">
          Past the café, then right
        </p>
      </div>

      {/* …and what changed about the building today. */}
      <NoticeList className="mt-3.5" />

      <p className="mt-3.5 pb-2 text-[15px] leading-normal text-fg-muted">
        Hold the same pass to the tablet on your way out to sign out.
      </p>
    </PhoneScreen>
  );
}

export function KioskPhone({ tabs }: { tabs: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <PhoneFrame>
        <CheckedInPhoneScreen />
      </PhoneFrame>
      <ControlDeck tabs={tabs} />
    </div>
  );
}
