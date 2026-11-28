import React from 'react';
import {useCurrentFrame} from 'remotion';
import {prog} from './anim';
import {BOLD} from './fonts';
import {alpha, usePalette} from './palette';
import {SAFE} from './series';

/** Small banner at the very top of the safe area: ─── OFFERVISIONS · INTRODUCTION ─── */
export const TitleBanner: React.FC<{readonly text: string; readonly from?: number; readonly to?: number}> = ({
	text,
	from = 0,
	to,
}) => {
	const frame = useCurrentFrame();
	const {ink} = usePalette();
	const p = prog(frame, from, from + 24) * (to === undefined ? 1 : 1 - prog(frame, to, to + 18));
	const line = (side: 'l' | 'r') => (
		<div
			style={{
				height: 2,
				width: 90 * p,
				background: `linear-gradient(${side === 'l' ? 'to left' : 'to right'}, ${ink}, transparent)`,
				opacity: 0.8,
			}}
		/>
	);
	return (
		<div
			style={{
				position: 'absolute',
				top: SAFE.top + 18,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				gap: 22,
				opacity: p,
				fontFamily: BOLD,
				fontWeight: 800,
				fontSize: 26,
				letterSpacing: '0.32em',
				color: ink,
				textShadow: `0 0 18px ${alpha(ink, 0.5)}`,
			}}
		>
			{line('l')}
			<span style={{paddingLeft: '0.32em'}}>{text}</span>
			{line('r')}
		</div>
	);
};
