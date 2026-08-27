import * as React from "react";
import { BackButton } from "@/components/back-button";
import {
  NoticeList,
  TODAY_NOTICES,
  WORK_NOTICES,
  type Notice,
} from "@/components/notice";
import { QrMock } from "@/components/qr-mock";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LobbyMap } from "@/prototypes/shared/lobby-map";
import {
  CONTRACTOR_PASS_CAPTION,
  CONTRACTOR_PERMIT_ROW,
  contractorPassRows,
  VISITOR_PASS_CAPTION,
  VISITOR_PASS_ROWS,
  type PassRow,
} from "@/prototypes/shared/pass-card";

/**
 * The success state, from studies 4a / 4b / 4c: three pages instead of
 * one crowded screen.
 *
 * Check-in has already succeeded. What is left is what she walks
 * through on the way off the kiosk, and the order is the order the
 * facts matter on the way in — the notices first, because they are the
 * only thing that is news; then where the room is; then the pass she
 * will hold at the reader on the way out.
 *
 * Each page carries one idea at full size. Back exists from page 2
 * onward and Done only on page 3, so forward is the same tap as
 * reading on and there is no skip link to reward not reading.
 *
 * Both lanes end here. A visitor is sent to the east lifts with two
 * notices; a trade is sent to the service lift with six and a permit
 * on her pass. Same three pages, same order, its own facts.
 */

const PAGES = 3;

/** How long a page stays up before the kiosk resets for the next
 *  person. Restarted on every page, so reading is not punished — and
 *  her check-in stands either way. */
const RESET_SECONDS = 45;

/** The study writes the count as a word. */
const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six"];
const countWord = (n: number) => WORDS[n] ?? String(n);

export type OnSiteContent = {
  /** The status rail: what happened, when, and to whom. */
  status: string;
  notices: Notice[];
  /** Left of the footer on page 1, where Back is not offered. */
  noticesHint: string;
  where: {
    title: string;
    aside: string;
    /** The tinted column on the plan, and the floor bubble if it earns
     *  one. */
    destination: { label: string; note?: string };
    pin: string | null;
    directions: string;
    /** The one notice worth repeating next to the route. */
    remember?: { label: string; body: string };
  };
  pass: {
    caption: string;
    rows: PassRow[];
    note: string;
  };
};

/* -- what each lane says --------------------------------------------- */

export const visitorOnSite = ({
  firstName = "Marta",
  lastName = "Nowak",
}: {
  firstName?: string;
  lastName?: string;
}): OnSiteContent => ({
  status: `Checked in · 04:24pm · ${firstName} ${lastName}`,
  notices: TODAY_NOTICES,
  noticesHint: "Nothing to tick — just so you are not surprised",
  where: {
    title: "Level 9 · Kestrel Legal",
    aside: "East lifts → Level 9",
    destination: { label: "East lifts", note: "All levels" },
    pin: "9",
    directions:
      "Straight past the café, then right to the east lifts. Out on 9, reception is opposite the lift lobby.",
  },
  pass: {
    caption: VISITOR_PASS_CAPTION,
    rows: VISITOR_PASS_ROWS,
    note: "Scan the code to carry it on your phone.",
  },
});

export const contractorOnSite = ({
  firstName,
  lastName = "Raman",
  company,
}: {
  firstName: string;
  lastName?: string;
  company: string;
}): OnSiteContent => ({
  status: `On site · 08:04am · ${firstName} ${lastName}`,
  notices: WORK_NOTICES,
  noticesHint: "Scroll for the last two",
  where: {
    title: "Level 4 · riser cupboard, east end",
    aside: "Service lift → Level 4",
    /* Tools go in the service lift, and the plan says so rather than
     * pointing her at the lifts everyone else uses. */
    destination: { label: "Service lift" },
    pin: null,
    directions:
      "Past the café to the service corridor, lift on the right. Out on 4, turn left — the riser cupboard is at the east end, opposite the lift lobby.",
    remember: {
      label: "Remember",
      body: "Passenger lift on 4 is out until 5pm.",
    },
  },
  pass: {
    caption: CONTRACTOR_PASS_CAPTION,
    /* The permit only exists once she is on site, so it is added here
     * rather than carried by the pass her phone already holds. */
    rows: [...contractorPassRows(company), CONTRACTOR_PERMIT_ROW],
    note: "Also on your phone from this morning — same code.",
  },
});

/* -- the chrome the three pages share -------------------------------- */

/** Current page in black, the ones behind it grey, the rest waiting. */
function PageBars({ page }: { page: number }) {
  return (
    <div className="flex items-center gap-2.25">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`h-1.25 w-6.5 rounded-full ${
            n === page ? "bg-fg" : n < page ? "bg-line-strong" : "bg-line"
          }`}
        />
      ))}
      <span className="ml-1.5 font-mono text-[12.5px] text-fg-subtle">
        {page} of {PAGES}
      </span>
    </div>
  );
}

/**
 * One page of the three: who she is and where she is in the sequence,
 * then a heading with its own aside, then the page, then one rail of
 * controls.
 */
function OnSitePage({
  page,
  status,
  title,
  aside,
  children,
  hint,
  back,
  onBack,
  next,
  onNext,
}: {
  page: number;
  status: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  /** Left of the footer rail when there is nothing to go back to. */
  hint?: string;
  back?: string;
  onBack?: () => void;
  next: string;
  onNext: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-8.5 pt-3.5 pb-6.5">
      <div className="flex flex-none items-center justify-between gap-5">
        {/* Green because it is a status, not a lane: she is in. */}
        <span className="font-mono text-[13px] tracking-[0.14em] text-success uppercase">
          {status}
        </span>
        <PageBars page={page} />
      </div>

      <div className="mt-2.5 flex flex-none items-baseline justify-between gap-5">
        <h2 className="text-[32px] leading-[1.1] font-bold tracking-[-0.03em]">
          {title}
        </h2>
        {aside ? <div className="flex-none">{aside}</div> : null}
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col">{children}</div>

      <div className="mt-4 flex flex-none items-center justify-between gap-5">
        {back && onBack ? (
          <BackButton
            size="lg"
            className="h-14 rounded-[13px] px-6.5 text-[18px]"
            onClick={onBack}
          >
            {back}
          </BackButton>
        ) : (
          <span className="text-[14.5px] text-fg-subtle">{hint}</span>
        )}
        <Button
          size="cta"
          className="h-14 rounded-[13px] px-10 text-[19px]"
          onClick={onNext}
        >
          {next}
        </Button>
      </div>
    </div>
  );
}

/* -- 4a · page 1 · what the notices are ----------------------------- */

function NoticesPage({
  content,
  onNext,
}: {
  content: OnSiteContent;
  onNext: () => void;
}) {
  const { notices } = content;
  /** How many of them are about her own floor or her own work. */
  const mine = notices.filter((notice) => notice.scope).length;

  return (
    <OnSitePage
      page={1}
      status={content.status}
      title={`${countWord(notices.length)} notice${
        notices.length === 1 ? "" : "s"
      } for today`}
      aside={
        mine > 0 ? (
          <span className="text-base text-fg-subtle">
            {mine} affect {content.where.title.split(" ·")[0]}
          </span>
        ) : null
      }
      hint={content.noticesHint}
      next="Next · where you're going"
      onNext={onNext}
    >
      {/* The only page of the three that can scroll: six notices is six
        * notices, and the ones that touch her floor are at the top. */}
      <NoticeList
        notices={notices}
        scale="tablet"
        className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      />
    </OnSitePage>
  );
}

/* -- 4b · page 2 · where the room is -------------------------------- */

function WayPage({
  content,
  onBack,
  onNext,
}: {
  content: OnSiteContent;
  onBack: () => void;
  onNext: () => void;
}) {
  const { where } = content;

  return (
    <OnSitePage
      page={2}
      status={content.status}
      title={where.title}
      aside={
        <span className="text-base font-semibold text-success">
          {where.aside}
        </span>
      }
      back="Notices"
      onBack={onBack}
      next="Next · your pass"
      onNext={onNext}
    >
      {/* One lobby plan, pointed wherever this lane is going. */}
      <LobbyMap fill destination={where.destination} pin={where.pin} />

      <div className="mt-4 flex flex-none items-start gap-6.5">
        <p className="min-w-0 flex-1 text-[19px] leading-[1.45] text-fg-muted">
          {where.directions}
        </p>
        {where.remember ? (
          <div className="w-62.5 flex-none rounded-[14px] bg-notice-tint px-4 py-3.5">
            <span className="font-mono text-xs tracking-[0.12em] text-notice uppercase">
              {where.remember.label}
            </span>
            <p className="mt-1.25 text-[16.5px] leading-[1.35] font-medium text-notice-ink">
              {where.remember.body}
            </p>
          </div>
        ) : null}
      </div>
    </OnSitePage>
  );
}

/* -- 4c · page 3 · her pass for today ------------------------------- */

function PassPage({
  content,
  onBack,
  onDone,
}: {
  content: OnSiteContent;
  onBack: () => void;
  onDone: () => void;
}) {
  const { pass } = content;

  return (
    <OnSitePage
      page={3}
      status={content.status}
      title="Your pass for today"
      back="Where you're going"
      onBack={onBack}
      next="Done"
      onNext={onDone}
    >
      <div className="flex min-h-0 flex-1 items-stretch gap-6">
        <div className="flex w-82.5 flex-none flex-col items-center justify-center gap-3.5 rounded-[20px] border border-line p-5.5">
          <QrMock size={196} />
          {/* The reference over its expiry, two lines, as the study
            * sets it — the same caption the phone prints on one. */}
          <span className="text-center font-mono text-sm leading-normal text-fg-muted">
            {pass.caption.split(" · ").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
          <p className="text-center text-[15px] leading-normal text-fg-subtle">
            {pass.note}
          </p>
        </div>

        <div className="flex min-w-0 flex-1 flex-col rounded-[20px] border border-line px-5.5 py-5">
          {pass.rows.map((row, index) => (
            <React.Fragment key={row.label}>
              {index > 0 ? <Separator /> : null}
              <div className="flex items-baseline justify-between gap-4 py-2.25">
                <span className="text-[16.5px] text-fg-subtle">
                  {row.label}
                </span>
                <span
                  className={`text-right ${
                    row.mono
                      ? "font-mono text-[17px] font-medium"
                      : "text-[18px] font-semibold"
                  }`}
                >
                  {row.value}
                </span>
              </div>
            </React.Fragment>
          ))}

          {/* The one rule that outlives the visit, and the one line
            * that is the same in every lane. */}
          <div className="mt-auto rounded-[14px] bg-surface px-4 py-3.5">
            <span className="font-mono text-xs tracking-[0.12em] text-fg-subtle uppercase">
              Leaving
            </span>
            <p className="mt-1.25 text-[17px] leading-[1.4] text-fg-muted">
              Hold this at the reader on your way out. A visit can't be ended
              from a phone.
            </p>
          </div>
        </div>
      </div>
    </OnSitePage>
  );
}

/* -- the three, in order -------------------------------------------- */

export function KioskOnSite({
  active,
  content,
  onDone,
}: {
  active: boolean;
  content: OnSiteContent;
  onDone: () => void;
}) {
  const [page, setPage] = React.useState(1);

  /* Back to the start for the next person. The timer restarts with
   * every page, so a slow reader is never cut off mid-notice. */
  React.useEffect(() => {
    if (!active) {
      setPage(1);
      return;
    }
    const timer = window.setTimeout(onDone, RESET_SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [active, page, onDone]);

  if (page === 1) {
    return <NoticesPage content={content} onNext={() => setPage(2)} />;
  }

  if (page === 2) {
    return (
      <WayPage
        content={content}
        onBack={() => setPage(1)}
        onNext={() => setPage(3)}
      />
    );
  }

  return (
    <PassPage
      content={content}
      onBack={() => setPage(2)}
      onDone={onDone}
    />
  );
}
