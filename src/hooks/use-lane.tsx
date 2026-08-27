import * as React from "react";

/**
 * The ecoportal lane. One attribute at the root repoints all five
 * ramp steps — no component knows which lane it is in.
 *
 * house      green  · brand, idle, portal
 * visitor    blue   · guest check-in
 * contractor orange · induction, permits
 * exit       red    · sign-out, stop, expired (a state, not a lane)
 */
export const LANES = ["house", "visitor", "contractor", "exit"] as const;

export type Lane = (typeof LANES)[number];

type LaneContextValue = {
  lane: Lane;
  setLane: (lane: Lane) => void;
};

const LaneContext = React.createContext<LaneContextValue | null>(null);

/** Owns the root [data-lane] attribute for the whole app. */
export function LaneProvider({
  initial = "house",
  children,
}: {
  initial?: Lane;
  children: React.ReactNode;
}) {
  const [lane, setLane] = React.useState<Lane>(initial);

  React.useEffect(() => {
    document.documentElement.dataset.lane = lane;
  }, [lane]);

  const value = React.useMemo(() => ({ lane, setLane }), [lane]);

  return <LaneContext.Provider value={value}>{children}</LaneContext.Provider>;
}

export function useLane() {
  const context = React.useContext(LaneContext);
  if (!context) throw new Error("useLane must be used inside a LaneProvider");
  return context;
}
