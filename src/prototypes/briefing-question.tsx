import * as React from "react";
import {
  type BriefingOption,
  type OptionState,
} from "@/prototypes/contractor-briefing";

/**
 * One answer to a briefing question, on either surface.
 *
 * From the "Kiosk Briefing Question Layout" study: once she answers,
 * the correction is attached to the option she tapped rather than
 * sitting in a panel somewhere else on the screen, and the right
 * answer is named out loud instead of being tinted and left to be
 * inferred. The phone runs the same structure at its own scale — a
 * trade who does the briefing on her phone the night before and one
 * doing it at the glass should be reading the same screen.
 *
 * It is one element in all four states, not four elements, because the
 * card has to grow from the tapped option into the tapped option: a
 * button swapped for a div cannot tween.
 */

type Scale = "phone" | "tablet";

const CARD: Record<Scale, string> = {
  phone: "rounded-lg px-4.5 py-4",
  tablet: "rounded-[18px] px-6 py-5.5",
};

const LABEL: Record<Scale, string> = {
  phone: "text-[16.5px] leading-snug",
  tablet: "text-[21px] leading-[1.3]",
};

const TAG: Record<Scale, string> = {
  phone: "text-[10px] tracking-[0.12em]",
  tablet: "text-xs tracking-[0.12em] pt-1.25",
};

const RULE: Record<Scale, string> = {
  phone: "pt-2.5 text-[14.5px] leading-[1.5]",
  tablet: "pt-3 text-[17px] leading-[1.55]",
};

/** Tone by state. The rule's ink follows the card it sits in. */
const TONE: Record<OptionState, string> = {
  open: "border-line",
  picked: "",
  correct: "border-[1.5px] border-success-line bg-success-tint",
  out: "border-line text-fg-subtle",
};

export function QuestionOption({
  option,
  state,
  rule,
  scale,
  onSelect,
}: {
  option: BriefingOption;
  state: OptionState;
  /** The coaching note. Shown only inside the option she tapped. */
  rule: string;
  scale: Scale;
  onSelect: () => void;
}) {
  const ruleRef = React.useRef<HTMLSpanElement>(null);
  const [ruleHeight, setRuleHeight] = React.useState(0);

  /* transitions.dev · 01 · Card resize needs a number to tween to, so
   * the note is always in the DOM and measured; the wrapper it sits in
   * is what opens. Remeasured per question, because the notes differ
   * in length and the glass is a different width from a phone. */
  React.useLayoutEffect(() => {
    setRuleHeight(ruleRef.current?.offsetHeight ?? 0);
  }, [rule, scale]);

  const showRule = state === "picked";
  const right = option.correct;
  const tone =
    state === "picked"
      ? right
        ? "border-[1.5px] border-success-line bg-success-tint"
        : "border-[1.5px] border-danger-line bg-danger-tint"
      : TONE[state];

  const body = (
    <>
      <span className="flex items-start justify-between gap-4">
        <span
          className={`${LABEL[scale]} ${
            state === "out" ? "font-medium" : "font-semibold"
          }`}
        >
          {option.text}
        </span>
        {state === "picked" || state === "correct" ? (
          <span
            className={`flex-none font-mono whitespace-nowrap uppercase ${
              TAG[scale]
            } ${right ? "text-success" : "text-danger"}`}
          >
            {state === "correct" || right ? "Correct" : "You picked"}
          </span>
        ) : null}
      </span>

      {/* Always rendered, so it can be measured; height is what moves. */}
      <span
        className="t-resize block overflow-hidden"
        style={{ height: showRule ? ruleHeight : 0 }}
        aria-hidden={!showRule}
      >
        <span
          ref={ruleRef}
          className={`block ${RULE[scale]} ${
            right ? "text-success" : "text-danger"
          }`}
        >
          {rule}
        </span>
      </span>
    </>
  );

  const shared = `block w-full border text-left transition-colors duration-fast ease-out-quad ${CARD[scale]} ${tone}`;

  if (state === "open") {
    return (
      <button
        onClick={onSelect}
        className={`${shared} hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
      >
        {body}
      </button>
    );
  }

  return <div className={shared}>{body}</div>;
}
