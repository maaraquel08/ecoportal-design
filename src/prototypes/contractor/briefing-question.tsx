import {
  type BriefingOption,
  type OptionState,
} from "@/prototypes/contractor/briefing";

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
  /** The coaching note. Opens only inside the option she tapped. */
  rule: string;
  scale: Scale;
  onSelect: () => void;
}) {
  const showRule = state === "picked";
  const right = option.correct;
  const locked = state !== "open";

  const tone =
    state === "picked"
      ? right
        ? "border-[1.5px] border-success-line bg-success-tint"
        : "border-[1.5px] border-danger-line bg-danger-tint"
      : TONE[state];

  return (
    /* transitions.dev · 21 · Accordion expand. The card is a button in
     * every state on purpose: swapping it for a div once answered
     * would mount a new element with the note already open, and there
     * is nothing left to animate from. Locked with aria-disabled and
     * pointer-events rather than `disabled`, which greys the label. */
    <button
      type="button"
      className={`t-acc block w-full border text-left transition-colors duration-fast ease-out-quad ${
        CARD[scale]
      } ${tone} ${
        locked
          ? "pointer-events-none"
          : "hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      }`}
      data-open={showRule}
      aria-disabled={locked}
      onClick={locked ? undefined : onSelect}
    >
      <span className="flex items-start justify-between gap-4">
        <span
          className={`${LABEL[scale]} ${
            state === "out"
              ? "font-medium text-fg-subtle"
              : "font-semibold text-fg"
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
            {right ? "Correct" : "You picked"}
          </span>
        ) : null}
      </span>

      {/* Two elements, and the padding lives on the inner one: padding
        * on the 0fr track would leave a strip of height behind and the
        * note would never close. No display utilities on either — the
        * snippet owns `display: grid` and the overflow clip. */}
      <span className="t-acc-panel" aria-hidden={!showRule}>
        <span className="t-acc-panel-inner">
          <span
            className={`block ${RULE[scale]} ${
              right ? "text-success" : "text-danger"
            }`}
          >
            {rule}
          </span>
        </span>
      </span>
    </button>
  );
}
