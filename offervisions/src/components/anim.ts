import {Easing, interpolate} from 'remotion';

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const BACK_OUT = Easing.bezier(0.34, 1.56, 0.64, 1);

/** 0→1 between two frames, clamped, with an easing curve. */
export const prog = (
	frame: number,
	start: number,
	end: number,
	easing: (t: number) => number = EASE_OUT,
) =>
	interpolate(frame, [start, end], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing,
	});
