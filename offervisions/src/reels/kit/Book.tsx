import React from 'react';
import {softGlow, usePalette} from './palette';

export const PAGE_W = 380;
export const PAGE_H = 500;

type Content = React.ReactNode;

/**
 * The signature book, drawn as simple line art seen from the front.
 * Origin (0,0) is the centre of the spine. Page content is given in
 * page-local coordinates: (0,0) = top-left of a page, (PAGE_W, PAGE_H) = bottom-right.
 *
 *  open: 0 = closed (cover facing us, centred), 1 = fully open
 *  turn: 0 → 1 flips the right-hand page over to the left
 */
export const Book: React.FC<{
	readonly open: number;
	readonly turn?: number;
	readonly cover?: Content;
	readonly left?: Content;
	readonly right?: Content;
	/** Revealed on the right while/after the page turns. */
	readonly nextRight?: Content;
	/** Back of the turning page (shown on the left after the turn). */
	readonly turnBack?: Content;
	readonly glow?: number;
	readonly strokeWidth?: number;
}> = ({open, turn = 0, cover, left, right, nextRight, turnBack, glow = 0, strokeWidth = 4}) => {
	const {ink, bg} = usePalette();
	const W = PAGE_W;
	const H = PAGE_H;
	const shiftX = (W / 2) * (1 - open);
	const ruled = turnBack ?? <RuledLines />;

	const page = (side: 'left' | 'right', content: Content, key: string) => (
		<g key={key} transform={`translate(${side === 'left' ? -W : 0} ${-H / 2})`}>
			<rect width={W} height={H} rx={8} fill={bg} stroke={ink} strokeWidth={strokeWidth} />
			{content}
		</g>
	);

	/** A page/cover swinging around the spine. p: 0 = lying right, 1 = lying left. */
	const flap = (p: number, front: Content, back: Content, isCover: boolean, key: string) => {
		const c = Math.cos(Math.PI * p);
		const w = Math.max(0.001, Math.abs(c));
		const onRight = c >= 0;
		const lift = 1 + 0.07 * Math.sin(Math.PI * p);
		const shade = 0.18 * Math.sin(Math.PI * p);
		return (
			<g key={key} transform={`scale(${onRight ? w : -w} ${lift})`}>
				<g transform={`translate(0 ${-H / 2})`}>
					<rect
						width={W}
						height={H}
						rx={8}
						fill={bg}
						stroke={ink}
						strokeWidth={strokeWidth / Math.max(0.35, w)}
					/>
					<g transform={onRight ? undefined : `translate(${W} 0) scale(-1 1)`}>{onRight ? front : back}</g>
					{isCover && onRight ? (
						<rect x={14} y={14} width={W - 28} height={H - 28} rx={4} fill="none" stroke={ink} strokeWidth={2} opacity={0.6} />
					) : null}
					<rect width={W} height={H} rx={8} fill="#000" opacity={shade} />
				</g>
			</g>
		);
	};

	const thickness = (
		<g opacity={0.55}>
			{[1, 2].map((k) => (
				<path
					key={k}
					d={
						open > 0.02
							? `M ${-W + 4} ${H / 2 + k * 6} L ${-6} ${H / 2 + k * 6} Q 0 ${H / 2 + k * 6 + 4} 6 ${H / 2 + k * 6} L ${W - 4} ${H / 2 + k * 6}`
							: `M 6 ${H / 2 + k * 6} L ${W - 4} ${H / 2 + k * 6}`
					}
					fill="none"
					stroke={ink}
					strokeWidth={2.5}
					strokeLinecap="round"
				/>
			))}
		</g>
	);

	return (
		<g transform={`translate(${-shiftX} 0)`} style={glow > 0 ? {filter: softGlow(ink, glow)} : undefined}>
			{thickness}
			{open < 1 ? (
				<>
					{open > 0.02 ? page('right', right, 'r') : null}
					{flap(open, cover, left, true, 'cover')}
				</>
			) : (
				<>
					{page('left', turn >= 0.5 ? ruled : left, 'l')}
					{page('right', turn > 0 ? nextRight : right, 'r')}
					{turn > 0 && turn < 1 ? flap(turn, right, ruled, false, 'turn') : null}
					<line x1={0} y1={-H / 2 + 4} x2={0} y2={H / 2 - 4} stroke={ink} strokeWidth={strokeWidth * 0.8} opacity={0.8} />
				</>
			)}
		</g>
	);
};

/** Faint handwriting-like lines for blank pages. */
export const RuledLines: React.FC<{readonly from?: number; readonly count?: number}> = ({from = 90, count = 9}) => {
	const {ink} = usePalette();
	return (
		<g opacity={0.35}>
			{Array.from({length: count}).map((_, i) => (
				<line
					key={i}
					x1={46}
					x2={PAGE_W - 46 - ((i * 37) % 90)}
					y1={from + i * 38}
					y2={from + i * 38}
					stroke={ink}
					strokeWidth={3}
					strokeLinecap="round"
				/>
			))}
		</g>
	);
};
