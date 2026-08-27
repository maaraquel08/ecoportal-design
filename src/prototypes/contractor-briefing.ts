import * as React from "react";

/**
 * The security briefing, study C3A: five responsibilities, then one
 * question per responsibility.
 *
 * Both surfaces run it — the phone the night before, the lobby tablet
 * for a trade who turns up cold — so the wording, the pass mark and
 * the mechanics live here rather than once per screen. Only the layout
 * differs, because only the glass differs.
 */

/** The undertaking, as the agency words it. */
export const RESPONSIBILITIES = [
  "Locking and logging off (or powering off) my assigned workstation when I leave my work area.",
  "Not changing settings assigned to my workstation (desktop or laptop) or any other workstation, which disables security features.",
  "Not loading (or downloading) or creating any software on my assigned workstation that has not been authorised by the agency.",
  "Following all guidelines regarding the transmission of electronic mail or messaging.",
  "Reporting any security problems I encounter or observe to my immediate supervisor.",
];

/** One question per responsibility, in the same order. */
export const QUESTIONS = [
  {
    situation: "You've been using a site laptop and you step out for lunch.",
    ask: "What do you do?",
    options: [
      { text: "Lock it before I go", correct: true },
      { text: "Leave it, I'll be back in twenty minutes", correct: false },
      { text: "Ask someone nearby to watch it", correct: false },
    ],
    rule: "Lock or log off every time you leave your work area — an unlocked machine in a shared building is the easiest way in there is.",
  },
  {
    situation: "The workstation keeps locking itself while you are reading a drawing.",
    ask: "What do you do?",
    options: [
      { text: "Turn the auto-lock off for the day", correct: false },
      { text: "Leave the setting alone and unlock it again", correct: true },
      { text: "Ask a colleague to change it on their machine too", correct: false },
    ],
    rule: "Never change a setting that disables a security feature, on your workstation or anyone else's. Report the friction instead.",
  },
  {
    situation: "You need a PDF tool that is not installed on the site laptop.",
    ask: "What do you do?",
    options: [
      { text: "Download a free one and install it", correct: false },
      { text: "Copy it across from a USB stick", correct: false },
      { text: "Ask the agency to authorise the software first", correct: true },
    ],
    rule: "Nothing gets loaded, downloaded or created on the workstation without the agency authorising it first.",
  },
  {
    situation: "A subcontractor asks you to send them tonight's site drawings.",
    ask: "What do you do?",
    options: [
      { text: "Post them in the crew's group chat", correct: false },
      { text: "Send them from my personal email so it is quicker", correct: false },
      {
        text: "Use the approved channel and follow the transmission guidelines",
        correct: true,
      },
    ],
    rule: "Electronic mail and messaging have guidelines for a reason. Use the approved channel, every time.",
  },
  {
    situation:
      "Someone you don't recognise follows you through the dock roller door.",
    ask: "What do you do?",
    options: [
      { text: "Hold it open, they look like a trade", correct: false },
      { text: "Report it to my immediate supervisor", correct: true },
      { text: "Ignore it, it is not your job", correct: false },
    ],
    rule: "Any security problem you encounter or observe goes to your immediate supervisor — including the ones that turn out to be nothing.",
  },
];

/** Four of five. Below that the briefing is read and answered again. */
export const PASS_MARK = 4;

export type BriefingOption = { text: string; correct: boolean };

/** Fisher–Yates: the right answer must not sit in a learnable slot. */
function shuffle(options: BriefingOption[]) {
  const deck = [...options];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const dealQuestions = () =>
  QUESTIONS.map((question) => ({
    ...question,
    options: shuffle(question.options),
  }));

/**
 * The quiz, without a layout: one question at a time, a score, and a
 * retake that re-deals rather than replaying the same order.
 */
export function useBriefing() {
  const [deck, setDeck] = React.useState(dealQuestions);
  const [index, setIndex] = React.useState(0);
  const [picked, setPicked] = React.useState<BriefingOption | null>(null);
  const [score, setScore] = React.useState(0);

  const question = deck[index];
  const answered = picked !== null;
  const atLast = index === deck.length - 1;

  const answer = (option: BriefingOption) => {
    setPicked(option);
    if (option.correct) setScore((n) => n + 1);
  };

  /** Returns true once the last question has been answered. */
  const next = () => {
    setPicked(null);
    if (atLast) return true;
    setIndex(index + 1);
    return false;
  };

  /* A retake re-reads the briefing and re-deals the choices, so it is
   * never the same screen answered from memory. */
  const retake = () => {
    setDeck(dealQuestions());
    setIndex(0);
    setPicked(null);
    setScore(0);
  };

  return {
    deck,
    index,
    question,
    picked,
    score,
    answered,
    atLast,
    passed: score >= PASS_MARK,
    answer,
    next,
    retake,
  };
}
