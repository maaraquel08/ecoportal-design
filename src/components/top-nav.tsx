import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/use-theme";

const LINKS = [
  { to: "/design-system", label: "Design system" },
  { to: "/visitor", label: "Visitor" },
  { to: "/contractor", label: "Contractor" },
];

export function TopNav() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-8">
        <NavLink
          to="/design-system"
          className="flex flex-none items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="size-6 rounded-md bg-lane-base" aria-hidden="true" />
          <span className="text-sm font-semibold tracking-[-0.01em]">
            ecoportal
          </span>
        </NavLink>

        <nav aria-label="Main" className="flex min-w-0 items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-fast ease-out-quad",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  isActive
                    ? "bg-lane-tint text-lane-pressed"
                    : "text-fg-muted hover:bg-surface hover:text-fg",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex flex-none items-center gap-3">
          <Tooltip content={`Switch to ${theme === "dark" ? "light" : "dark"}`}>
            <Button variant="secondary" size="sm" onClick={toggle}>
              {theme === "dark" ? "Dark" : "Light"}
            </Button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
