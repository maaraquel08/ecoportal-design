import { TabletColumn } from "@/components/tablet-frame";
import { Button } from "@/components/ui/button";
import { Toolbar, ToolbarButton } from "@/components/ui/toolbar";
import {
  BuildingIcon,
  ExitIcon,
  HelpIcon,
  LanguageIcon,
  PersonIcon,
  QrIcon,
  TextSizeIcon,
  ToolboxIcon,
} from "@/prototypes/shared/icons";

/**
 * T0, the landing: the one screen every journey starts on, so it is
 * one component rather than a copy per lane. Both the visitor page's
 * kiosk and the contractor's open it, and each wires only the doors
 * its own walkthrough can follow — a door with no handler is drawn but
 * inert rather than promising something the tab cannot deliver.
 */

/** A drawn tile — hairline card, no shadow. */
export function Card({
  className = "",
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const base = `rounded-[20px] border border-line ${className}`;
  if (!onClick) return <div className={base}>{children}</div>;
  return (
    <button
      onClick={onClick}
      className={`${base} text-left transition-colors duration-fast ease-out-quad hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
    >
      {children}
    </button>
  );
}

export function Tile({
  className,
  children,
  size = "size-13",
}: {
  className: string;
  children: React.ReactNode;
  size?: string;
}) {
  return (
    <span
      className={`flex ${size} flex-none items-center justify-center rounded-[14px] ${className}`}
    >
      {children}
    </span>
  );
}

/* -- T0 · the landing ("Two doors") --------------------------------- */

export function KioskLanding({
  onScan,
  onVisiting,
  onWork,
  onLeaving,
  onHandoff,
}: {
  onScan?: () => void;
  onVisiting?: () => void;
  onWork?: () => void;
  onLeaving?: () => void;
  onHandoff?: () => void;
}) {
  return (
    <TabletColumn>
      <div className="flex items-center gap-2.5">
        <Tile className="bg-house-tint text-house-base" size="size-6.5">
          <BuildingIcon size={20} />
        </Tile>
        <span className="text-[17px] font-semibold tracking-[-0.01em]">
          Rushcutters Tower
        </span>
      </div>

      <h2 className="mt-2.5 text-[44px] leading-[1.04] font-bold tracking-[-0.035em]">
        Which one are you today?
      </h2>
      <p className="mt-1.5 text-[15px] text-fg-subtle">
        Thursday 11 September · 2:04pm
      </p>

      {/* The two doors. This is the one screen allowed to show more
        * than one ramp: choosing the lane is the whole job. */}
      <div className="mt-6.5 flex min-h-0 flex-1 gap-4.5">
        <Card className="flex min-w-0 flex-1 flex-col p-5.5">
          <Tile className="bg-visitor-tint text-visitor-base">
            <PersonIcon />
          </Tile>
          <div className="mt-5 text-[27px] font-semibold tracking-[-0.025em]">
            Visiting someone
          </div>
          <p className="mt-2.5 text-base leading-normal text-fg-subtle">
            A meeting, an interview, or dropping something off to a person in
            the building.
          </p>
          {/* The lane's own base, since this screen offers two lanes
            * at once and neither owns --accent. */}
          <Button
            size="cta"
            className="mt-auto w-full bg-visitor-base text-lg hover:bg-visitor-fill"
            disabled={!onVisiting}
            onClick={onVisiting}
          >
            Start · about 2 minutes
          </Button>
        </Card>

        <Card className="flex min-w-0 flex-1 flex-col p-5.5">
          <Tile className="bg-contractor-tint text-contractor-base">
            <ToolboxIcon />
          </Tile>
          <div className="mt-5 text-[27px] font-semibold tracking-[-0.025em]">
            Here to work
          </div>
          <p className="mt-2.5 text-base leading-normal text-fg-subtle">
            Trade, contractor or maintenance. We will check your induction and
            permits.
          </p>
          <Button
            size="cta"
            className="mt-auto w-full bg-contractor-base text-lg hover:bg-contractor-fill"
            disabled={!onWork}
            onClick={onWork}
          >
            Start · about 4 minutes
          </Button>
        </Card>
      </div>

      <div className="mt-4.5 grid grid-cols-2 gap-4.5">
        <Card className="flex items-center gap-3.5 px-4 py-3.5" onClick={onScan}>
          <Tile className="bg-house-tint text-house-base" size="size-11.5">
            <PersonIcon />
          </Tile>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold text-house-fill">
              Already have a pass or invite?
            </span>
            <span className="mt-0.5 block text-sm text-fg-subtle">
              Hold it to the scanner — skips both
            </span>
          </span>
        </Card>

        <Card
          className="flex items-center gap-3.5 px-4 py-3.5"
          onClick={onLeaving}
        >
          <Tile className="bg-exit-tint text-exit-base" size="size-11.5">
            <ExitIcon />
          </Tile>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold text-exit-base">
              Leaving
            </span>
            <span className="mt-0.5 block text-sm text-fg-subtle">
              Scan your pass to sign out
            </span>
          </span>
        </Card>
      </div>

      <div className="mt-4.5 grid grid-cols-2 gap-4.5">
        <Card
          className="flex items-center gap-3.5 px-4 py-3.5"
          onClick={onHandoff}
        >
          <Tile className="bg-surface text-fg-muted" size="size-11.5">
            <QrIcon size={22} />
          </Tile>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold">
              Prefer your own phone?
            </span>
            <span className="mt-0.5 block text-sm text-fg-subtle">
              Scan the QR and finish there instead
            </span>
          </span>
        </Card>

        {/* A row of equal-weight actions is exactly what Toolbar is
          * for; its root already draws the hairline card. */}
        <Toolbar className="grid grid-cols-3 items-stretch gap-0 rounded-[20px] p-1.5">
          {[
            { label: "Text size", Icon: TextSizeIcon },
            { label: "Language", Icon: LanguageIcon },
            { label: "Help", Icon: HelpIcon },
          ].map(({ label, Icon }) => (
            <ToolbarButton
              key={label}
              className="h-auto flex-col gap-1.5 rounded-[14px] px-1.5 py-2.5 text-[13px] text-fg-muted"
            >
              <Icon size={22} />
              {label}
            </ToolbarButton>
          ))}
        </Toolbar>
      </div>
    </TabletColumn>
  );
}

