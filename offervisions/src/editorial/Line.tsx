import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {lerpPts, type Pt, resample, smoothPath} from '../reels/kit/shapes';
import {IN_OUT, p} from './motion';

export type LineKey = {at: number; shape: (frame: number) => Pt[]; morph?: number; opacity?: number; draw?: [number, number]};

const N = 160;

/**
 * The OFFERVISIONS line of light – the motif carried over from the original videos –
 * crisp, thin, with a restrained bloom. It morphs between shapes on cue.
 */
export const LightLine: React.FC<{readonly keys: LineKey[]; readonly color: string; readonly width?: number}> = ({keys, color, width = 3}) => {
	const frame = useCurrentFrame();
	let i = 0;
	for (let k = 0; k < keys.length; k++) if (keys[k].at <= frame) i = k;
	const key = keys[i];
	let pts = resample(key.shape(frame), N);
	let opacity = key.opacity ?? 1;
	if (i > 0) {
		const m = p(frame, key.at, key.at + (key.morph ?? 18), IN_OUT);
		if (m < 1) {
			pts = lerpPts(resample(keys[i - 1].shape(frame), N), pts, m);
			opacity = (keys[i - 1].opacity ?? 1) * (1 - m) + opacity * m;
		}
	}
	const draw = key.draw ? p(frame, key.draw[0], key.draw[1], IN_OUT) : 1;
	if (opacity <= 0.001) return null;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<svg width={1080} height={1920} viewBox="0 0 1080 1920">
				<g opacity={opacity} style={{filter: `drop-shadow(0 0 6px ${color}88)`}}>
					<rect x={0} y={0} width={1080} height={1920} fill="none" />
					<path d={smoothPath(pts, 0.4)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
				</g>
			</svg>
		</AbsoluteFill>
	);
};
