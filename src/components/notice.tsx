import { cn } from "@/lib/cn";

/**
 * A building notice: something to know today, never something to do.
 *
 * Amber by contract — the brand reserves it for "know this", so a
 * notice can never be mistaken for a control. One card shape is used
 * on every surface that shows notices (pre-arrival, the kiosk, the
 * phone) so the same fact never appears in two visual voices.
 */
export type Notice = {
  /** What kind of notice — Health, Access, Security. */
  category: string;
  /** How long it applies — "All day", "Until 5pm". */
  when: string;
  title: string;
  body: string;
  /**
   * Who it is aimed at — "your floor", "your work". Present only when
   * the notice touches this person's own job, which is what lets a
   * screen say "three of six affect Level 4" without a second list.
   */
  scope?: string;
  /**
   * Amber is the brand's "know this", so it stays the default. A long
   * list needs the ones that are merely true about the building to
   * step back, which is what `muted` is for.
   */
  tone?: "notice" | "muted";
};

/** Today at Rushcutters Tower. One source, every surface. */
export const TODAY_NOTICES: Notice[] = [
  {
    category: "Health",
    when: "All day",
    title: "Masks on levels 2 and 3",
    body: "Two recorded cases. Sanitiser at each entry.",
  },
  {
    category: "Access",
    when: "Until 5pm",
    title: "Level 4 lift out",
    body: "Use the stairs or the west lift.",
  },
];

/**
 * Today for someone working on Level 4 rather than visiting it. The
 * permit reference is a fact she needs to know, not an action — which
 * is what keeps it a notice.
 */
export const WORK_NOTICES: Notice[] = [
  {
    category: "Access",
    scope: "your floor",
    when: "Until 5pm",
    title: "Level 4 passenger lift out",
    body: "Service lift or the stairs. Tools go in the service lift.",
  },
  {
    category: "Permit",
    scope: "your work",
    when: "To 5:00pm",
    title: "Hot works PMT-4471 · Level 4 riser",
    body: "Fire watch for thirty minutes after you stop.",
  },
  {
    category: "Coordination",
    scope: "your floor",
    when: "All day",
    title: "A lift technician is also on Level 4",
    body: "Same riser space. He has been told you're here too.",
  },
  {
    category: "Health",
    when: "All day",
    tone: "muted",
    title: "Masks on Levels 2 and 3",
    body: "Two recorded COVID cases at this location.",
  },
  {
    category: "Alarm",
    when: "2:00pm",
    tone: "muted",
    title: "Fire panel test",
    body: "Alarms may sound. No evacuation unless you're told.",
  },
  {
    category: "Vehicles",
    when: "After 3pm",
    tone: "muted",
    title: "Loading dock closed",
    body: "Park on Boundary St for pickup.",
  },
];

/** The ones that touch her own job. A phone has room for these three. */
export const MY_NOTICES = WORK_NOTICES.filter((notice) => notice.scope);

/** One card, two sizes: a phone's column and a tablet's full screen. */
type NoticeScale = "phone" | "tablet";

const SHELL: Record<NoticeScale, string> = {
  phone: "rounded-[18px] px-4.5 py-4",
  tablet: "rounded-2xl px-5 py-4",
};

const META: Record<NoticeScale, string> = {
  phone: "text-[11px] tracking-[0.14em]",
  tablet: "text-[13px] tracking-[0.12em]",
};

const WHEN: Record<NoticeScale, string> = {
  phone: "text-xs",
  tablet: "text-[13.5px]",
};

const TITLE: Record<NoticeScale, string> = {
  phone: "mt-2.5 text-xl",
  tablet: "mt-2 text-[22px]",
};

const BODY: Record<NoticeScale, string> = {
  phone: "mt-1 text-[15px]",
  tablet: "mt-1 text-[17px]",
};

export function NoticeCard({
  notice,
  scale = "phone",
}: {
  notice: Notice;
  scale?: NoticeScale;
}) {
  const muted = notice.tone === "muted";
  return (
    <div
      className={`${SHELL[scale]} ${muted ? "bg-surface" : "bg-notice-tint"}`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span
          className={`font-mono uppercase ${META[scale]} ${
            muted ? "text-fg-subtle" : "text-notice"
          }`}
        >
          {notice.category}
          {notice.scope ? ` · ${notice.scope}` : ""}
        </span>
        <span
          className={`font-mono whitespace-nowrap ${WHEN[scale]} ${
            muted ? "text-fg-subtle" : "text-notice"
          }`}
        >
          {notice.when}
        </span>
      </div>
      <div
        className={`leading-snug font-semibold tracking-[-0.015em] ${
          TITLE[scale]
        } ${muted ? "text-fg" : "text-notice-ink"}`}
      >
        {notice.title}
      </div>
      <div
        className={`leading-normal ${BODY[scale]} ${
          muted ? "text-fg-muted" : "text-notice-fg"
        }`}
      >
        {notice.body}
      </div>
    </div>
  );
}

export function NoticeList({
  notices = TODAY_NOTICES,
  scale,
  className,
}: {
  notices?: Notice[];
  scale?: NoticeScale;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {notices.map((notice) => (
        <NoticeCard key={notice.title} notice={notice} scale={scale} />
      ))}
    </div>
  );
}
