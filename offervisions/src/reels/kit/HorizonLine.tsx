import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SOFT_IN_OUT, prog} from './anim';
import {HandSvg} from './HandSvg';
import {softGlow, usePalette} from './palette';
import {lerpPts, type Pt, resample, smoothPath} from './shapes';

export type HorizonKey = {
	/** Absolute frame where this shape takes over. */
	at: number;
	/** Shape in screen coordinates (may depend on the frame, e.g. for panning). */
	shape: (frame: number) => Pt[];
	/** Frames to morph from the previous shape (default 30). */
	morph?: number;
};

const N = 180;

/**
 * The one continuous line that runs through the whole Reel and
 * smoothly morphs between shapes (table edge → page edge → path → …).
 */
export const HorizonLine: React.FC<{readonly keys: HorizonKey[]; readonly drawInFrames?: number}> = ({
	keys,
	drawInFrames = 24,
}) => {
	const frame = useCurrentFrame();
	const {ink} = usePalette();
	let i = 0;
	for (let k = 0; k < keys.length; k++) if (keys[k].at <= frame) i = k;
	const cur = resample(keys[i].shape(frame), N);
	let pts = cur;
	if (i > 0) {
		const morph = keys[i].morph ?? 30;
		const t = prog(frame, keys[i].at, keys[i].at + morph, SOFT_IN_OUT);
		if (t < 1) pts = lerpPts(resample(keys[i - 1].shape(frame), N), cur, t);
	}
	const drawn = prog(frame, 0, drawInFrames, SOFT_IN_OUT);
	return (
		<HandSvg wobble={2.6}>
			<g style={{filter: softGlow(ink, 0.35)}}>
			{/* invisible full-frame rect gives the glow a non-zero box even when the line is flat */}
			<rect x={0} y={0} width={1080} height={1920} fill="none" />
			<path
				d={smoothPath(pts)}
				fill="none"
				stroke={ink}
				strokeWidth={4.5}
				strokeLinecap="round"
				strokeLinejoin="round"
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - drawn}
			/>
			</g>
		</HandSvg>
	);
};
