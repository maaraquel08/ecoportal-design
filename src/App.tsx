import * as React from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router";
import { TopNav } from "@/components/top-nav";
import { LaneProvider, useLane, type Lane } from "@/hooks/use-lane";
import { ContractorPage } from "@/routes/contractor";
import { DesignSystemPage } from "@/routes/design-system";
import { VisitorPage } from "@/routes/visitor";

/**
 * Each route opens in its own lane. `null` hands ownership to the
 * page, which both journey pages need because their scenarios differ:
 * a phone pre-arrival flow is that lane's own journey, while the lobby
 * kiosk is a platform surface and belongs to the house.
 */
const ROUTE_LANE: Record<string, Lane | null> = {
  "/design-system": "house",
  "/visitor": null,
  "/contractor": null,
};

/**
 * Applies the route's lane on navigation. The design-system page can
 * still switch lanes by hand — this only resets it on a route change.
 */
function RouteLane({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { setLane } = useLane();
  const routeLane = pathname in ROUTE_LANE ? ROUTE_LANE[pathname] : "house";

  React.useEffect(() => {
    if (routeLane) setLane(routeLane);
  }, [routeLane, setLane]);

  return children;
}

function Layout() {
  return (
    <RouteLane>
      <div className="min-h-dvh">
        <TopNav />
        <main>
          <Outlet />
        </main>
      </div>
    </RouteLane>
  );
}

export default function App() {
  return (
    <LaneProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/design-system" replace />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="/visitor" element={<VisitorPage />} />
          <Route path="/contractor" element={<ContractorPage />} />
          <Route
            path="*"
            element={<Navigate to="/design-system" replace />}
          />
        </Route>
      </Routes>
    </LaneProvider>
  );
}
