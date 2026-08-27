/** Step labels are written lower-case so they read inside a sentence;
 *  the player's button needs them capitalised. */
export function sentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
