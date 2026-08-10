// utils/spectrum.js

const GRADIENT_STOPS = [
    { pos: 0.00, color: [255, 255, 255] },     // White
  { pos: 0.00, color: [255, 0, 0] },       // Red
  { pos: 0.10, color: [255, 128, 0] },     // Orange
  { pos: 0.20, color: [255, 255, 0] },     // Yellow
  { pos: 0.30, color: [128, 255, 0] },     // Green
  { pos: 0.40, color: [0, 255, 0] },       // Green
  { pos: 0.50, color: [0, 255, 255] },     // Cyan
  { pos: 0.60, color: [0, 128, 255] },     // Blue
  { pos: 0.70, color: [0, 0, 255] },       // Blue
  { pos: 0.80, color: [128, 0, 255] },     // Purple
  { pos: 0.90, color: [255, 0, 255] },     // Magenta
  { pos: 1.00, color: [0, 0, 0] },        // BLACK
];

const lerp = (a, b, t) => a + (b - a) * t;

const rgbToHex = (r, g, b) => {
  return (
    "#" +
    [r, g, b]
      .map((value) =>
        Math.round(value)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
};

export function getColorAtPosition(pos) {
  const p = Math.min(1, Math.max(0, pos));

  // Explicitly guarantee black at the end
  if (p >= 1) {
    return "#000000";
  }

  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    const a = GRADIENT_STOPS[i];
    const b = GRADIENT_STOPS[i + 1];

    if (p >= a.pos && p <= b.pos) {
      const t = (p - a.pos) / (b.pos - a.pos);

      return rgbToHex(
        lerp(a.color[0], b.color[0], t),
        lerp(a.color[1], b.color[1], t),
        lerp(a.color[2], b.color[2], t)
      );
    }
  }

  return "#000000";
}

export const SPECTRUM_CSS_GRADIENT =
  "linear-gradient(to right, " +
  "#ffffff 0%, " +
  "#ff0000 0%, " +
  "#ff8000 10%, " +
  "#ffff00 20%, " +
  "#80ff00 30%, " +
  "#00ff00 40%, " +
  "#00ffff 50%, " +
  "#0080ff 60%, " +
  "#0000ff 70%, " +
  "#8000ff 80%, " +
  "#ff00ff 90%, " +
  "#000000 800%)";