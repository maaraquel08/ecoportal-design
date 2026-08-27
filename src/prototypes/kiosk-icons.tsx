/**
 * Line icons for the kiosk screens, drawn to the canvas geometry:
 * 24-unit box, 2px stroke, round caps and joins, currentColor.
 */
type IconProps = { size?: number; className?: string };

function Svg({
  size = 26,
  className,
  strokeWidth = 2,
  children,
}: IconProps & { strokeWidth?: number; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M10.5 21v-4h3v4" />
    </Svg>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20c0-3.6 3-5.4 6.5-5.4s6.5 1.8 6.5 5.4" />
    </Svg>
  );
}

export function ToolboxIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="7.5" width="18" height="12" rx="2.5" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </Svg>
  );
}

export function ExitIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      <path d="M9 16l-4-4 4-4" />
      <path d="M5 12h9" />
    </Svg>
  );
}

export function QrIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.5" />
      <path d="M14 14h3M20.5 14v3M14 20.5h6.5" />
    </Svg>
  );
}

export function TextSizeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7h9M8.5 7v11" />
      <path d="M14 11h6M17 11v7" />
    </Svg>
  );
}

export function LanguageIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.1 0 17M12 3.5c-2.5 2.4-2.5 14.1 0 17" />
    </Svg>
  );
}

export function HelpIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.7 9.4A2.4 2.4 0 0 1 14.4 10c0 1.7-2.4 2-2.4 3.6" />
      <path d="M12 17h.01" />
    </Svg>
  );
}
