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

export function NoticeCard({ notice }: { notice: Notice }) {
  return (
    <div className="rounded-[18px] bg-notice-tint px-4.5 py-4">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] tracking-[0.14em] text-notice uppercase">
          {notice.category}
        </span>
        <span className="font-mono text-xs text-notice">{notice.when}</span>
      </div>
      <div className="mt-2.5 text-xl leading-snug font-semibold tracking-[-0.015em] text-notice-ink">
        {notice.title}
      </div>
      <div className="mt-1 text-[15px] leading-normal text-notice-fg">
        {notice.body}
      </div>
    </div>
  );
}

export function NoticeList({
  notices = TODAY_NOTICES,
  className,
}: {
  notices?: Notice[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {notices.map((notice) => (
        <NoticeCard key={notice.title} notice={notice} />
      ))}
    </div>
  );
}
