import React from 'react';
import {AbsoluteFill} from 'remotion';
import {IN_OUT} from './motion';

/**
 * Reveals `children` (the incoming page) with a turning-page edge sweeping right → left.
 * A soft shadow falls on the outgoing page and a highlight runs along the edge.
 */
export const PageTurn: React.FC<{readonly progress: number; readonly children: React.ReactNode; readonly width?: number}> = ({progress, children, width = 1080}) => {
	if (progress <= 0) return null;
	const t = IN_OUT(Math.min(1, progress));
	const edge = width * (1 - t);
	const curl = Math.sin(Math.PI * t) * 70;
	return (
		<>
			{/* shadow cast on the outgoing page */}
			<AbsoluteFill style={{background: `linear-gradient(to left, rgba(0,0,0,${0.35 * Math.sin(Math.PI * t)}) 0px, transparent 220px)`, translate: `${-(width - edge)}px 0px`, pointerEvents: 'none'}} />
			<AbsoluteFill style={{clipPath: `polygon(${edge}px 0, ${width}px 0, ${width}px 100%, ${edge + curl * 0.35}px 100%)`}}>{children}</AbsoluteFill>
			{t < 1 ? (
				<AbsoluteFill
					style={{
						clipPath: `polygon(${edge}px 0, ${edge + 26}px 0, ${edge + curl * 0.35 + 26}px 100%, ${edge + curl * 0.35}px 100%)`,
						background: 'linear-gradient(to right, rgba(255,255,255,0.18), rgba(0,0,0,0.25))',
						pointerEvents: 'none',
					}}
				/>
			) : null}
		</>
	);
};
