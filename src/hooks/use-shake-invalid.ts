import * as React from "react";
import { cssMs } from "@/lib/motion";

/**
 * transitions.dev · 12 · Error state shake — orchestration.
 *
 * Base UI already owns the error treatment (`data-invalid` drives the
 * red label, border, tint and message), so this only replays the
 * shake. `.is-shaking` is kept orthogonal to the error state exactly
 * as the snippet requires, which is what lets it replay on a repeat
 * submit without flickering the error styling off and on.
 *
 * Nothing is validated here: we shake whatever Base UI has just
 * marked invalid, so the two can never disagree.
 */
/**
 * Replay the shake on one element: remove, reflow, re-add. The reflow
 * is what guarantees a repeat failure animates again instead of
 * sitting at the end of the previous run.
 */
export function replayShake(element: HTMLElement) {
  element.classList.remove("is-shaking");
  void element.offsetWidth; // force reflow
  element.classList.add("is-shaking");
  const shakeMs =
    cssMs("--shake-dur-a", 80) * 2 + cssMs("--shake-dur-b", 60) * 2;
  window.setTimeout(
    () => element.classList.remove("is-shaking"),
    shakeMs + 20,
  );
}

/** Shake one specific element — a code row, a PIN field, a tile. */
export function useShake<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const shake = React.useCallback(() => {
    if (ref.current) replayShake(ref.current);
  }, []);
  return { ref, shake };
}

export function useShakeInvalid<T extends HTMLElement>() {
  const scopeRef = React.useRef<T>(null);

  const shake = React.useCallback(() => {
    // Wait one frame so the validity attributes are committed.
    requestAnimationFrame(() => {
      const controls = scopeRef.current?.querySelectorAll<HTMLElement>(
        ".t-input[data-invalid]",
      );
      if (!controls?.length) return;

      controls.forEach(replayShake);
    });
  }, []);

  return { scopeRef, shake };
}
