import {Easing, interpolate} from 'remotion';

/** Editorial easings: long, calm decelerations; no overshoot. */
export const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const QUART_OUT = Easing.bezier(0.25, 1, 0.5, 1);
export const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const IN = Easing.bezier(0.5, 0, 0.75, 0);

export const p = (frame: number, a: number, b: number, easing: (t: number) => number = EXPO_OUT) =>
	interpolate(frame, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const rnd = (seed: number) => {
	const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
	return x - Math.floor(x);
};
