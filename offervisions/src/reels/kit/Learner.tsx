import React from 'react';
import {useCurrentFrame} from 'remotion';
import {softGlow, usePalette} from './palette';

/**
 * The learner: a simple rounded figure with headphones, carrying a small
 * open book. Drawn as line art, feet at (x, y). Stand-in for Lucie and the listener.
 */
export const Learner: React.FC<{
	readonly x: number;
	readonly y: number;
	readonly scale?: number;
	readonly pose?: 'stand' | 'sit';
	/** Walking phase in radians; leave undefined to stand still. */
	readonly walk?: number;
	/** 0–1 glow on the little book (the "one object that matters"). */
	readonly bookGlow?: number;
	/** Head tilt in degrees (e.g. looking up). */
	readonly tilt?: number;
	/** 0 = book held at chest, 1 = book raised up to read/show. */
	readonly raise?: number;
	readonly opacity?: number;
	/** Mirror horizontally. */
	readonly flip?: boolean;
}> = ({x, y, scale = 1, pose = 'stand', walk, bookGlow = 0, tilt = 0, raise = 0, opacity = 1, flip = false}) => {
	const frame = useCurrentFrame();
	const {ink, bg} = usePalette();
	const sw = 5;
	const walking = walk !== undefined;
	const bob = walking ? -Math.abs(Math.sin(walk)) * 9 : Math.sin(frame / 26) * 2.5;
	const legSwing = walking ? Math.sin(walk) * 14 : 0;
	// Blink every ~3.5s
	const blink = frame % 105 > 100 ? 0.15 : 1;
	const bookY = -128 - raise * 40;

	return (
		<g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} opacity={opacity}>
			<g stroke={ink} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
				{pose === 'stand' ? (
					<>
						<path d={`M -22 -26 L ${-24 + legSwing} -2`} />
						<path d={`M 22 -26 L ${24 - legSwing} -2`} />
						<path d={`M ${-36 + legSwing} 0 L ${-14 + legSwing} 0`} />
						<path d={`M ${14 - legSwing} 0 L ${36 - legSwing} 0`} />
					</>
				) : (
					<>
						<path d="M -26 -30 Q 10 -34 34 -26 L 38 6" />
						<path d="M 4 -30 Q 40 -32 62 -24 L 66 6" />
					</>
				)}
			</g>
			<g transform={`translate(0 ${pose === 'sit' ? 0 : bob})`}>
				{/* body */}
				<path
					d="M -58 -32 C -68 -112, -50 -192, 0 -196 C 50 -192, 68 -112, 58 -32 Q 0 -14 -58 -32 Z"
					fill={bg}
					stroke={ink}
					strokeWidth={sw}
					strokeLinejoin="round"
				/>
				{/* head */}
				<g transform={`rotate(${tilt} 0 -200)`}>
					<circle cx={0} cy={-250} r={50} fill={bg} stroke={ink} strokeWidth={sw} />
					<g fill={ink}>
						<ellipse cx={-17} cy={-252} rx={5} ry={6 * blink} />
						<ellipse cx={17} cy={-252} rx={5} ry={6 * blink} />
					</g>
					<path d="M -12 -230 Q 0 -221 12 -230" fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" />
					{/* headphones */}
					<path d="M -54 -258 C -54 -322, 54 -322, 54 -258" fill="none" stroke={ink} strokeWidth={8} strokeLinecap="round" />
					<rect x={-70} y={-280} width={22} height={46} rx={11} fill={ink} />
					<rect x={48} y={-280} width={22} height={46} rx={11} fill={ink} />
				</g>
				{/* arms */}
				<g stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none">
					<path d={`M -50 -150 Q -66 ${bookY + 30} -40 ${bookY + 14}`} />
					<path d={`M 50 -150 Q 66 ${bookY + 30} 40 ${bookY + 14}`} />
				</g>
				{/* little open book */}
				<g
					transform={`translate(0 ${bookY})`}
					style={bookGlow > 0 ? {filter: softGlow(ink, bookGlow)} : undefined}
				>
					<path d="M 0 -6 L -58 -18 L -58 22 L 0 32 Z" fill={bg} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
					<path d="M 0 -6 L 58 -18 L 58 22 L 0 32 Z" fill={bg} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
					<g stroke={ink} strokeWidth={2.5} strokeLinecap="round" opacity={0.6}>
						<line x1={-46} y1={-6} x2={-12} y2={1} />
						<line x1={-46} y1={6} x2={-12} y2={13} />
						<line x1={12} y1={1} x2={46} y2={-6} />
						<line x1={12} y1={13} x2={40} y2={7} />
					</g>
				</g>
			</g>
		</g>
	);
};
