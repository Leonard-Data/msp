export const LAYOUT_THRESHOLD = 0.90;

export function passesLayoutThreshold(score) {
  return score >= LAYOUT_THRESHOLD;
}
