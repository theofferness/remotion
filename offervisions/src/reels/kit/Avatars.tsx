import React from 'react';
import {useCurrentFrame} from 'remotion';
import {softGlow, usePalette} from './palette';

/**
 * The learner, in several interchangeable designs. All variants share the same
 * props and proportions (feet at (x, y), ~320 px tall at scale 1, small open book
 * held at the chest), so any of them can replace the current character everywhere
 * by changing `SERIES.learner` in series.ts.
 */
export type AvatarVariant = 'classic' | 'pebble' | 'sprout' | 'page' | 'bird' | 'ember' | 'cover' | 'bookmark' | 'dogear' | 'roof' | 'origami';

export type AvatarProps = {
	readonly x: number;
	readonly y: number;
	readonly scale?: number;
	readonly pose?: 'stand' | 'sit';
	/** Walking phase in radians; leave undefined to stand still. */
	readonly walk?: number;
	readonly bookGlow?: number;
	readonly tilt?: number;
	readonly raise?: number;
	readonly opacity?: number;
	readonly flip?: boolean;
};

const SW = 5;

/* ── shared parts ── */

const Face: React.FC<{readonly cy: number; readonly blink: number; readonly gap?: number}> = ({cy, blink, gap = 17}) => {
	const {ink} = usePalette();
	return (
		<>
			<g fill={ink}>
				<ellipse cx={-gap} cy={cy} rx={5} ry={6 * blink} />
				<ellipse cx={gap} cy={cy} rx={5} ry={6 * blink} />
			</g>
			<path d={`M -12 ${cy + 22} Q 0 ${cy + 31} 12 ${cy + 22}`} fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" />
		</>
	);
};

const Headphones: React.FC<{readonly cy: number; readonly r: number}> = ({cy, r}) => {
	const {ink} = usePalette();
	return (
		<>
			<path d={`M ${-r - 4} ${cy - 8} C ${-r - 4} ${cy - r * 1.35}, ${r + 4} ${cy - r * 1.35}, ${r + 4} ${cy - 8}`} fill="none" stroke={ink} strokeWidth={8} strokeLinecap="round" />
			<rect x={-r - 20} y={cy - 30} width={22} height={46} rx={11} fill={ink} />
			<rect x={r - 2} y={cy - 30} width={22} height={46} rx={11} fill={ink} />
		</>
	);
};

const SmallBook: React.FC<{readonly y: number; readonly glow: number}> = ({y, glow}) => {
	const {ink, bg} = usePalette();
	return (
		<g transform={`translate(0 ${y})`} style={glow > 0 ? {filter: softGlow(ink, glow)} : undefined}>
			<path d="M 0 -6 L -58 -18 L -58 22 L 0 32 Z" fill={bg} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
			<path d="M 0 -6 L 58 -18 L 58 22 L 0 32 Z" fill={bg} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
			<g stroke={ink} strokeWidth={2.5} strokeLinecap="round" opacity={0.6}>
				<line x1={-46} y1={-6} x2={-12} y2={1} />
				<line x1={-46} y1={6} x2={-12} y2={13} />
				<line x1={12} y1={1} x2={46} y2={-6} />
				<line x1={12} y1={13} x2={40} y2={7} />
			</g>
		</g>
	);
};

const Arms: React.FC<{readonly bookY: number; readonly shoulderY?: number; readonly spread?: number}> = ({bookY, shoulderY = -150, spread = 50}) => {
	const {ink} = usePalette();
	return (
		<g stroke={ink} strokeWidth={SW} strokeLinecap="round" fill="none">
			<path d={`M ${-spread} ${shoulderY} Q ${-spread - 16} ${bookY + 30} -40 ${bookY + 14}`} />
			<path d={`M ${spread} ${shoulderY} Q ${spread + 16} ${bookY + 30} 40 ${bookY + 14}`} />
		</g>
	);
};

const Legs: React.FC<{readonly pose: 'stand' | 'sit'; readonly swing: number; readonly bird?: boolean}> = ({pose, swing, bird}) => {
	const {ink} = usePalette();
	if (pose === 'sit') {
		return bird ? null : (
			<g stroke={ink} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" fill="none">
				<path d="M -26 -30 Q 10 -34 34 -26 L 38 6" />
				<path d="M 4 -30 Q 40 -32 62 -24 L 66 6" />
			</g>
		);
	}
	if (bird) {
		return (
			<g stroke={ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none">
				{[-1, 1].map((side) => {
					const sx = side * 20 + (side < 0 ? swing : -swing) * 0.6;
					return (
						<g key={side}>
							<path d={`M ${side * 18} -22 L ${sx} -2`} />
							<path d={`M ${sx - 14} 0 L ${sx} -4 L ${sx + 14} 0 M ${sx} -4 L ${sx + 2} 2`} />
						</g>
					);
				})}
			</g>
		);
	}
	return (
		<g stroke={ink} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" fill="none">
			<path d={`M -22 -26 L ${-24 + swing} -2`} />
			<path d={`M 22 -26 L ${24 - swing} -2`} />
			<path d={`M ${-36 + swing} 0 L ${-14 + swing} 0`} />
			<path d={`M ${14 - swing} 0 L ${36 - swing} 0`} />
		</g>
	);
};

/* ── the variants (upper body only; legs are shared) ── */

type UpperProps = {readonly blink: number; readonly bookY: number; readonly bookGlow: number; readonly tilt: number; readonly t: number};

const Classic: React.FC<UpperProps> = ({blink, bookY, bookGlow, tilt}) => {
	const {ink, bg} = usePalette();
	return (
		<>
			<path d="M -58 -32 C -68 -112, -50 -192, 0 -196 C 50 -192, 68 -112, 58 -32 Q 0 -14 -58 -32 Z" fill={bg} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
			<g transform={`rotate(${tilt} 0 -200)`}>
				<circle cx={0} cy={-250} r={50} fill={bg} stroke={ink} strokeWidth={SW} />
				<Face cy={-252} blink={blink} />
				<Headphones cy={-250} r={50} />
			</g>
			<Arms bookY={bookY} />
			<SmallBook y={bookY} glow={bookGlow} />
		</>
	);
};

/** 1 · Pebble – one smooth stone-shaped body, no neck: calm, grounded, very minimal. */
const Pebble: React.FC<UpperProps> = ({blink, bookY, bookGlow, tilt}) => {
	const {ink, bg} = usePalette();
	return (
		<g transform={`rotate(${tilt * 0.4} 0 -160)`}>
			<path d="M -64 -28 C -84 -150, -62 -300, 4 -304 C 66 -300, 84 -150, 64 -28 Q 0 -10 -64 -28 Z" fill={bg} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
			<Face cy={-236} blink={blink} gap={19} />
			<Headphones cy={-238} r={64} />
			<Arms bookY={bookY} shoulderY={-160} spread={60} />
			<SmallBook y={bookY} glow={bookGlow} />
		</g>
	);
};

/** 2 · Sprout – the current learner plus a seedling on the head and a winter scarf: growth you can see. */
const Sprout: React.FC<UpperProps> = ({blink, bookY, bookGlow, tilt, t}) => {
	const {ink, bg} = usePalette();
	const sway = Math.sin(t / 22) * 6;
	return (
		<>
			<path d="M -58 -32 C -68 -112, -50 -192, 0 -196 C 50 -192, 68 -112, 58 -32 Q 0 -14 -58 -32 Z" fill={bg} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
			<path d="M -44 -206 Q 0 -186 44 -206 L 44 -184 Q 0 -166 -44 -184 Z" fill={bg} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
			<path d="M 22 -184 L 34 -128 L 50 -134 L 40 -186" fill={bg} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
			<g transform={`rotate(${tilt} 0 -200)`}>
				<circle cx={0} cy={-252} r={48} fill={bg} stroke={ink} strokeWidth={SW} />
				<Face cy={-254} blink={blink} />
				<Headphones cy={-252} r={48} />
				<g transform={`translate(0 -300) rotate(${sway})`} stroke={ink} strokeWidth={4} strokeLinejoin="round" style={{filter: softGlow(ink, 0.5)}}>
					<path d="M 0 0 L 0 -42" fill="none" strokeLinecap="round" />
					<path d="M 0 -36 C -10 -58, -40 -60, -46 -44 C -30 -32, -12 -32, 0 -36 Z" fill={bg} />
					<path d="M 0 -42 C 10 -66, 44 -70, 50 -52 C 32 -38, 12 -38, 0 -42 Z" fill={bg} />
				</g>
			</g>
			<Arms bookY={bookY} />
			<SmallBook y={bookY} glow={bookGlow} />
		</>
	);
};

/** 3 · Page – a body shaped like an open book (the learner *is* a book being written), holding a pencil. */
const Page: React.FC<UpperProps> = ({blink, bookY, bookGlow, tilt}) => {
	const {ink, bg} = usePalette();
	return (
		<>
			<path d="M -76 -24 L -42 -198 L 42 -198 L 76 -24 Q 0 -6 -76 -24 Z" fill={bg} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
			<line x1={0} y1={-198} x2={0} y2={-14} stroke={ink} strokeWidth={3.5} />
			<g stroke={ink} strokeWidth={2.5} strokeLinecap="round" opacity={0.55}>
				{[-160, -130, -100, -70].map((yy, i) => (
					<g key={yy}>
						<line x1={-14} y1={yy} x2={-30 - i * 7} y2={yy + 4} />
						<line x1={14} y1={yy} x2={30 + i * 7} y2={yy + 4} />
					</g>
				))}
			</g>
			<path d="M 26 -18 L 26 18 L 36 8 L 46 18 L 46 -16" fill={bg} stroke={ink} strokeWidth={3.5} strokeLinejoin="round" style={{filter: softGlow(ink, bookGlow * 0.6)}} />
			<g transform={`rotate(${tilt} 0 -200)`}>
				<circle cx={0} cy={-250} r={48} fill={bg} stroke={ink} strokeWidth={SW} />
				<Face cy={-252} blink={blink} />
				<Headphones cy={-250} r={48} />
			</g>
			<g stroke={ink} strokeWidth={SW} strokeLinecap="round" fill="none">
				<path d={`M -44 -170 Q -70 ${bookY + 10} -30 ${bookY}`} />
				<path d={`M 44 -170 Q 74 ${bookY + 10} 40 ${bookY - 6}`} />
			</g>
			<g transform={`translate(30 ${bookY - 10}) rotate(-35)`} style={{filter: softGlow(ink, bookGlow)}}>
				<rect x={-9} y={-70} width={18} height={84} rx={3} fill={bg} stroke={ink} strokeWidth={3.5} />
				<path d="M -9 14 L 0 34 L 9 14 Z" fill={bg} stroke={ink} strokeWidth={3.5} strokeLinejoin="round" />
			</g>
		</>
	);
};

/** 4 · Little bird – a round bird whose wings echo the wave in the Offervisions logo. */
const Bird: React.FC<UpperProps> = ({blink, bookY, bookGlow, tilt}) => {
	const {ink, bg} = usePalette();
	return (
		<g transform={`rotate(${tilt * 0.4} 0 -140)`}>
			<path d="M -66 -24 C -80 -130, -56 -240, 0 -246 C 56 -240, 80 -130, 66 -24 Q 0 -4 -66 -24 Z" fill={bg} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
			<path d="M -6 -246 C -14 -268, 0 -280, 8 -270 M 6 -246 C 10 -266, 26 -270, 28 -258" fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" />
			<Face cy={-196} blink={blink} gap={20} />
			<path d="M -9 -184 L 0 -172 L 9 -184 Z" fill={ink} />
			<Headphones cy={-196} r={60} />
			{/* wave-shaped wings holding the book, like the logo's swoosh */}
			{[-1, 1].map((side) => (
				<path
					key={side}
					d={`M ${side * 50} -160 C ${side * 130} -150, ${side * 124} ${bookY + 30}, ${side * 34} ${bookY + 14} C ${side * 84} ${bookY - 4}, ${side * 92} -126, ${side * 50} -160 Z`}
					fill={bg}
					stroke={ink}
					strokeWidth={4}
					strokeLinejoin="round"
				/>
			))}
			<SmallBook y={bookY} glow={bookGlow} />
		</g>
	);
};

/** 5 · Ember – a soft flame-shaped figure: a small light you carry through the year. */
const Ember: React.FC<UpperProps> = ({blink, bookY, bookGlow, tilt, t}) => {
	const {ink, bg} = usePalette();
	const flick = Math.sin(t / 6) * 4;
	return (
		<g transform={`rotate(${tilt * 0.4} 0 -160)`}>
			<path
				d={`M ${26 + flick} -330 C ${4 + flick} -318, ${-2 + flick} -300, 18 -282 C 52 -246, 74 -190, 66 -96 C 62 -44, 32 -18, 0 -16 C -32 -18, -62 -44, -66 -96 C -74 -200, -40 -262, ${-6 + flick} -300 C ${4 + flick} -312, ${14 + flick} -324, ${26 + flick} -330 Z`}
				fill={bg}
				stroke={ink}
				strokeWidth={SW}
				strokeLinejoin="round"
				style={{filter: softGlow(ink, 0.35)}}
			/>
			<path d={`M ${flick * 0.5} -310 C 14 -290, 24 -268, 20 -250`} fill="none" stroke={ink} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
			<Face cy={-222} blink={blink} gap={18} />
			<Headphones cy={-226} r={54} />
			<Arms bookY={bookY} shoulderY={-150} spread={58} />
			<SmallBook y={bookY} glow={bookGlow} />
		</g>
	);
};


/* ── Page family (variations on "the learner is a book") ── */

/** Page · A – Cover: a soft rounded book-cover body with a spine and ribbon, holding the small open book. */
const Cover: React.FC<UpperProps> = ({blink, bookY, bookGlow, tilt}) => {
	const {ink, bg} = usePalette();
	return (
		<>
			<path d="M -66 -24 C -72 -100, -60 -180, -40 -198 L 40 -198 C 60 -180, 72 -100, 66 -24 Q 0 -8 -66 -24 Z" fill={bg} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
			<path d="M -40 -198 Q 0 -186 40 -198" fill="none" stroke={ink} strokeWidth={3} opacity={0.6} />
			<line x1={0} y1={-192} x2={0} y2={-16} stroke={ink} strokeWidth={3} opacity={0.7} />
			<path d="M 30 -22 L 30 14 L 39 6 L 48 14 L 48 -20" fill={bg} stroke={ink} strokeWidth={3.5} strokeLinejoin="round" />
			<g transform={`rotate(${tilt} 0 -200)`}>
				<circle cx={0} cy={-250} r={48} fill={bg} stroke={ink} strokeWidth={SW} />
				<Face cy={-252} blink={blink} />
				<Headphones cy={-250} r={48} />
			</g>
			<Arms bookY={bookY} shoulderY={-160} spread={54} />
			<SmallBook y={bookY} glow={bookGlow} />
		</>
	);
};

/** Page · B – Bookmark: the whole body is a tall ribbon bookmark with a notched hem. */
const Bookmark: React.FC<UpperProps> = ({blink, bookY, bookGlow, tilt}) => {
	const {ink, bg} = usePalette();
	return (
		<g transform={`rotate(${tilt * 0.4} 0 -160)`}>
			<path d="M -46 -10 L -46 -270 C -46 -300, 46 -300, 46 -270 L 46 -10 L 0 -46 Z" fill={bg} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
			<line x1={-30} y1={-268} x2={-30} y2={-30} stroke={ink} strokeWidth={2.5} opacity={0.45} />
			<line x1={30} y1={-268} x2={30} y2={-30} stroke={ink} strokeWidth={2.5} opacity={0.45} />
			<Face cy={-236} blink={blink} gap={16} />
			<Headphones cy={-240} r={48} />
			<Arms bookY={bookY} shoulderY={-170} spread={46} />
			<SmallBook y={bookY} glow={bookGlow} />
		</g>
	);
};

/** Page · C – Dog-ear: the body is a single written page with a folded corner. */
const DogEar: React.FC<UpperProps> = ({blink, bookY, bookGlow, tilt}) => {
	const {ink, bg} = usePalette();
	return (
		<>
			<path d="M -62 -22 L -62 -196 L 34 -196 L 62 -168 L 62 -22 Z" fill={bg} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
			<path d="M 34 -196 L 34 -168 L 62 -168" fill="none" stroke={ink} strokeWidth={3.5} strokeLinejoin="round" />
			<g stroke={ink} strokeWidth={2.5} strokeLinecap="round" opacity={0.5}>
				{[-74, -56, -38].map((yy, i) => (
					<line key={yy} x1={-44} y1={yy} x2={44 - i * 14} y2={yy} />
				))}
			</g>
			<g transform={`rotate(${tilt} 0 -200)`}>
				<circle cx={0} cy={-250} r={48} fill={bg} stroke={ink} strokeWidth={SW} />
				<Face cy={-252} blink={blink} />
				<Headphones cy={-250} r={48} />
			</g>
			<Arms bookY={bookY} shoulderY={-165} spread={58} />
			<SmallBook y={bookY} glow={bookGlow} />
		</>
	);
};

/** Page · D – Book roof: the current learner wearing an open book on its head like a little roof. */
const Roof: React.FC<UpperProps> = ({blink, bookY, bookGlow, tilt}) => {
	const {ink, bg} = usePalette();
	return (
		<>
			<path d="M -58 -32 C -68 -112, -50 -192, 0 -196 C 50 -192, 68 -112, 58 -32 Q 0 -14 -58 -32 Z" fill={bg} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
			<g transform={`rotate(${tilt} 0 -200)`}>
				<circle cx={0} cy={-250} r={48} fill={bg} stroke={ink} strokeWidth={SW} />
				<Face cy={-252} blink={blink} />
				<Headphones cy={-250} r={48} />
				<g style={{filter: softGlow(ink, 0.4)}}>
					<path d="M 0 -336 L -76 -290 L -70 -280 L 0 -322 Z" fill={bg} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
					<path d="M 0 -336 L 76 -290 L 70 -280 L 0 -322 Z" fill={bg} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
					<path d="M -14 -324 L -54 -300 M 14 -324 L 54 -300" stroke={ink} strokeWidth={2.5} opacity={0.6} strokeLinecap="round" />
				</g>
			</g>
			<Arms bookY={bookY} />
			<SmallBook y={bookY} glow={bookGlow} />
		</>
	);
};

/** Page · E – Folded paper: an origami figure, faceted like a folded page. */
const Origami: React.FC<UpperProps> = ({blink, bookY, bookGlow, tilt}) => {
	const {ink, bg} = usePalette();
	return (
		<>
			<path d="M -70 -24 L 0 -204 L 70 -24 Z" fill={bg} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
			<path d="M 0 -204 L -14 -24 M 0 -204 L 26 -24" stroke={ink} strokeWidth={2.5} opacity={0.5} />
			<g transform={`rotate(${tilt} 0 -200)`}>
				<path d="M 0 -306 L 52 -254 L 0 -204 L -52 -254 Z" fill={bg} stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
				<path d="M -52 -254 L 52 -254" stroke={ink} strokeWidth={2} opacity={0.35} />
				<Face cy={-262} blink={blink} gap={14} />
				<Headphones cy={-256} r={50} />
			</g>
			<Arms bookY={bookY} shoulderY={-150} spread={34} />
			<SmallBook y={bookY} glow={bookGlow} />
		</>
	);
};

const UPPER: Record<AvatarVariant, React.FC<UpperProps>> = {
	classic: Classic,
	pebble: Pebble,
	sprout: Sprout,
	page: Page,
	bird: Bird,
	ember: Ember,
	cover: Cover,
	bookmark: Bookmark,
	dogear: DogEar,
	roof: Roof,
	origami: Origami,
};

export const AVATAR_INFO: Record<AvatarVariant, {name: string; idea: string}> = {
	classic: {name: 'Current', idea: 'rounded body, round head, headphones'},
	pebble: {name: 'Pebble', idea: 'one smooth stone shape – calm, grounded'},
	sprout: {name: 'Sprout', idea: 'a seedling on the head – growth you can see'},
	page: {name: 'Page', idea: 'the learner is a book being written'},
	bird: {name: 'Little bird', idea: 'wings echo the wave in the logo'},
	ember: {name: 'Ember', idea: 'a small light carried through the year'},
	cover: {name: 'A · Cover', idea: 'soft book-cover body, spine and ribbon'},
	bookmark: {name: 'B · Bookmark', idea: 'the whole body is a ribbon bookmark'},
	dogear: {name: 'C · Dog-ear', idea: 'a written page with a folded corner'},
	roof: {name: 'D · Book roof', idea: 'an open book worn like a little roof'},
	origami: {name: 'E · Folded paper', idea: 'faceted like an origami page'},
};

export const Avatar: React.FC<AvatarProps & {readonly variant: AvatarVariant}> = ({
	variant,
	x,
	y,
	scale = 1,
	pose = 'stand',
	walk,
	bookGlow = 0,
	tilt = 0,
	raise = 0,
	opacity = 1,
	flip = false,
}) => {
	const frame = useCurrentFrame();
	const walking = walk !== undefined;
	const bob = walking ? -Math.abs(Math.sin(walk)) * 9 : Math.sin(frame / 26) * 2.5;
	const swing = walking ? Math.sin(walk) * 14 : 0;
	const blink = frame % 105 > 100 ? 0.15 : 1;
	const bookY = -128 - raise * 40;
	const Upper = UPPER[variant];
	return (
		<g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} opacity={opacity}>
			<Legs pose={pose} swing={swing} bird={variant === 'bird'} />
			<g transform={`translate(0 ${pose === 'sit' ? 0 : bob})`}>
				<Upper blink={blink} bookY={bookY} bookGlow={bookGlow} tilt={tilt} t={frame} />
			</g>
		</g>
	);
};
