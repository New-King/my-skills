import {Easing, interpolate} from 'remotion';
import type {SceneTiming} from './timing';

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

export const range = (
  t: number,
  start: number,
  end: number,
  from = 0,
  to = 1,
  easing: (n: number) => number = easeOut,
) =>
  interpolate(t, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const windowFade = (t: number, start: number, end: number, fade = 0.3) =>
  Math.min(range(t, start, start + fade), 1 - range(t, end - fade, end));

export const findCue = (scene: SceneTiming, text: string): number => {
  const words = scene.words;
  const exact = words.find((w) => w.text === text);
  if (exact) return exact.start;
  const contains = words.find(
    (w) => w.text.includes(text) || (text.includes(w.text) && w.text.length >= 2),
  );
  if (contains) return contains.start;
  const loose = words.find((w) => text.includes(w.text));
  return loose ? loose.start : 0;
};

export const findCueEnd = (scene: SceneTiming, text: string): number => {
  const word = scene.words.find((w) => w.text.includes(text) || text.includes(w.text));
  return word ? word.end : 0;
};

export const monoDigits = (n: number) => Math.round(n).toString();
