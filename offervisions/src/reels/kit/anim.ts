import {Easing, interpolate} from 'remotion';

/** Calm, cinematic easings. */
export const SOFT = Easing.bezier(0.33, 0, 0.2, 1);
export const SOFT_IN_OUT = Easing.bezier(0.6, 0, 0.4, 1);
/** Settles without overshoot: use for things that arrive (tags, labels). */
export const ARRIVE = Easing.bezier(0.22, 1, 0.36, 1);

export const prog = (frame: number, start: number, end: number, easing: (t: number) => number = SOFT) =>
	interpolate(frame, [start, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Deterministic pseudo-random in [0,1). */
export const seeded = (seed: number) => {
	const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
	return x - Math.floor(x);
};
