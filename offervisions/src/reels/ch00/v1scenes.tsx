import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {ARRIVE, SOFT, SOFT_IN_OUT, lerp, prog, seeded} from '../kit/anim';
import {Book, PAGE_H, PAGE_W, RuledLines} from '../kit/Book';
import {Bridge, Candle, Lamp, Leaf, Plant, Snowflake, Sprout, TeaCup} from '../kit/Cozy';
import {Cta} from '../kit/Cta';
import {HAND} from '../kit/fonts';
import {HandSvg} from '../kit/HandSvg';
import {Learner} from '../kit/Learner';
import {OnScreenText} from '../kit/OnScreenText';
import {ChapterPage, CoverFront, InsideCover, TitlePage} from '../kit/Pages';
import {softGlow, usePalette} from '../kit/palette';
import {SERIES, SEASONS} from '../kit/series';
import {Tag} from '../kit/Tag';
import {CHAPTER, VIDEO1, type ReelScene} from './chapter';

/** Frames each scene overlaps its neighbours (cross-dissolve = 2 × PAD). */
export const PAD = 5;
export const TABLE_Y = 1410;
export const BOOK_EDGE_Y = 1290;
export const SHELF_Y = 1350;
export const HOST_WINDOW = {l: 230, r: 850, top: 740, sill: 1410};

export type SceneProps = {readonly dur: number; readonly scene: ReelScene; readonly first?: boolean; readonly last?: boolean};

/** Local frame → "own time" (0 = the scene's official start) + cross-fade opacity. */
const useScene = (dur: number, first?: boolean, last?: boolean) => {
	const f = useCurrentFrame();
	const t = f - PAD;
	const fadeIn = first ? 1 : prog(f, 0, PAD * 2, SOFT_IN_OUT);
	const fadeOut = last ? 1 : 1 - prog(f, dur, dur + PAD * 2, SOFT_IN_OUT);
	return {t, fade: fadeIn * fadeOut};
};

const Text: React.FC<{readonly scene: ReelScene; readonly dur: number; readonly hook?: boolean}> = ({scene, dur, hook}) => (
	<OnScreenText
		small={scene.small}
		big={scene.big}
		start={PAD + (hook ? -PAD : 2)}
		bigDelay={hook ? 10 : 14}
		end={PAD + dur - 16}
	/>
);

export const BOOK_CLOSED = {x: 540, y: TABLE_Y - (PAGE_H * 0.8) / 2 - 14, s: 0.8};
export const BOOK_OPEN = {x: 540, y: BOOK_EDGE_Y - (PAGE_H * 1.1) / 2 - 16, s: 1.1};

const coverFront = <CoverFront title={SERIES.show} year={SERIES.year} />;

/* ───────────────────────── 1 · HOOK ───────────────────────── */

export const HookScene: React.FC<SceneProps> = ({dur, scene, first}) => {
	const {t, fade} = useScene(dur, first);
	const pulse = 0.55 + 0.25 * Math.sin(t / 14);
	return (
		<AbsoluteFill style={{opacity: fade, scale: String(interpolate(t, [0, dur], [1, 1.03]))}}>
			<HandSvg>
				<Lamp x={170} y={TABLE_Y} scale={1.15} light={prog(t, 0, 20)} />
				<TeaCup x={900} y={TABLE_Y} scale={1.1} />
				<g transform={`translate(${BOOK_CLOSED.x} ${BOOK_CLOSED.y}) scale(${BOOK_CLOSED.s})`}>
					<Book open={0} cover={coverFront} glow={pulse} />
				</g>
			</HandSvg>
			<Text scene={scene} dur={dur} hook />
		</AbsoluteFill>
	);
};

/* ───────────────────────── 2 · THE BOOK OPENS ───────────────────────── */

export const OpenScene: React.FC<SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const season = SEASONS[CHAPTER.season];
	const rise = prog(t, -PAD, 36, SOFT_IN_OUT);
	const open = prog(t, 14, 52, SOFT_IN_OUT);
	const turnEnd = Math.min(106, dur - 26);
	const turn = prog(t, turnEnd - 38, turnEnd, SOFT_IN_OUT);
	// Zoom through the chapter page into the next scene.
	const zoom = prog(t, dur - 22, dur + PAD, Easing.in(Easing.cubic));
	const x = lerp(BOOK_CLOSED.x, BOOK_OPEN.x, rise);
	const y = lerp(BOOK_CLOSED.y, BOOK_OPEN.y, rise);
	const s = lerp(BOOK_CLOSED.s, BOOK_OPEN.s, rise);
	const zx = PAGE_W / 2; // focus: centre of the right page
	const zs = 1 + zoom * 3.2;
	const numberGlow = 0.6 + prog(t, turnEnd - 6, turnEnd + 14) * 0.9 + 0.2 * Math.sin(t / 10);

	return (
		<AbsoluteFill style={{opacity: fade * (1 - prog(t, dur - 4, dur + PAD))}}>
			<HandSvg>
				<g opacity={1 - rise}>
					<Lamp x={170} y={TABLE_Y} scale={1.15} />
					<TeaCup x={900} y={TABLE_Y} scale={1.1} />
				</g>
				<g transform={`translate(${x - zx * s * zoom} ${y}) scale(${s}) translate(${zx} 0) scale(${zs}) translate(${-zx} 0)`}>
					<Book
						open={open}
						turn={turn}
						cover={coverFront}
						left={<InsideCover lines={['for anyone', 'who wants to grow']} />}
						right={<TitlePage title={SERIES.show} subtitle={`a book in five parts · ${SERIES.year}`} />}
						nextRight={
							<ChapterPage
								overline={`${season.part.toUpperCase()} · ${season.season.toUpperCase()}`}
								number={CHAPTER.number}
								title={CHAPTER.title}
								subtitle={CHAPTER.subtitle}
								numberGlow={numberGlow}
								pageNo="p. 1"
							/>
						}
						glow={0.35}
					/>
				</g>
			</HandSvg>
			<Text scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

/* ───────────────────────── 3 · THE YEAR MAP ───────────────────────── */

export const STOP_GAP = 560;
const LEARNER_X = 300;

export const MAP_TIMING = {
	keys: [0, 24, 50, 62, 88, 100, 126, 138, 164],
	scroll: [0, 0, 1, 1, 2, 2, 3, 3, 4].map((k) => k * STOP_GAP),
	arrivals: [0, 50, 88, 126, 164],
};

export const scrollAt = (t: number) =>
	interpolate(t, MAP_TIMING.keys, MAP_TIMING.scroll, {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: SOFT_IN_OUT,
	});

export const pathY = (worldX: number) => 1360 + 36 * Math.sin(worldX / 210);

const StopIcon: React.FC<{readonly i: number; readonly sx: number; readonly gy: number; readonly glow: number; readonly t: number}> = ({
	i,
	sx,
	gy,
	glow,
	t,
}) => {
	const p = {glow: glow * 1.1, scale: 1.25};
	switch (i) {
		case 0:
			return <Snowflake x={sx} y={gy - 170} spin={t * 0.4} {...p} />;
		case 1:
			return <Sprout x={sx} y={gy} grow={0.4 + 0.6 * glow} {...p} />;
		case 2:
			return <Bridge x={sx} y={gy - 6} {...p} scale={1.5} />;
		case 3:
			return <Leaf x={sx} y={gy - 30} sway={Math.sin(t / 18) * 10} {...p} />;
		default:
			return <Candle x={sx} y={gy} lit={0.4 + 0.6 * glow} {...p} scale={1.05} />;
	}
};

const iconTop = [-260, -230, -175, -200, -270];

export const MapScene: React.FC<SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const scroll = scrollAt(t);
	const moving = MAP_TIMING.keys.some((k, i) => i % 2 === 1 && t > k && t < MAP_TIMING.keys[i + 1]);
	const learnerY = pathY(LEARNER_X + scroll);
	const reveal = prog(t, -PAD, 20);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				{VIDEO1.parts.map((part, i) => {
					const world = 540 + i * STOP_GAP;
					const sx = world - scroll;
					if (sx < -300 || sx > 1400) return null;
					const gy = pathY(world);
					const glow = Math.max(0, 1 - Math.abs(sx - 540) / 320);
					const arrive = MAP_TIMING.arrivals[i];
					return (
						<g key={part.name} opacity={reveal}>
							<StopIcon i={i} sx={sx} gy={gy} glow={glow} t={t} />
							<Tag
								x={sx + 30}
								y={gy + iconTop[i]}
								dx={-30}
								dy={-130}
								overline={part.overline}
								text={part.name}
								at={arrive + 6}
								size={50}
								glow={0.3 + glow * 0.6}
							/>
						</g>
					);
				})}
				<Learner
					x={LEARNER_X}
					y={learnerY}
					scale={0.8}
					walk={moving ? scroll / 34 : undefined}
					bookGlow={0.3}
					opacity={prog(t, 0, 20)}
				/>
			</HandSvg>
			<Text scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

/* ───────────────────────── 4 · THE SHELF ───────────────────────── */

const SPINES = 12;
const spineX = (i: number) => 112 + i * 72;
const spineH = (i: number) => 260 + seeded(i + 4) * 90;

export const ShelfScene: React.FC<SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const {ink, bg} = usePalette();
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				{/* shelf brackets */}
				{[180, 880].map((x) => (
					<path key={x} d={`M ${x} ${SHELF_Y} L ${x} ${SHELF_Y + 60} L ${x + 50} ${SHELF_Y}`} fill="none" stroke={ink} strokeWidth={4} strokeLinejoin="round" opacity={prog(t, -PAD, 10)} />
				))}
				{Array.from({length: SPINES}).map((_, i) => {
					const p = prog(t, 2 + i * 4, 16 + i * 4, ARRIVE);
					const h = spineH(i);
					const x = spineX(i);
					const first = i === 0;
					const tilt = i === SPINES - 1 ? -8 : 0;
					return (
						<g
							key={i}
							transform={`translate(${x} ${SHELF_Y}) rotate(${tilt}) scale(1 ${p})`}
							opacity={Math.min(1, p * 1.5)}
							style={first ? {filter: softGlow(ink, 0.6 + 0.3 * Math.sin(t / 10))} : undefined}
						>
							<rect x={0} y={-h} width={60} height={h} rx={6} fill={bg} stroke={ink} strokeWidth={4} />
							<line x1={8} y1={-h + 22} x2={52} y2={-h + 22} stroke={ink} strokeWidth={2.5} opacity={0.6} />
							<line x1={8} y1={-30} x2={52} y2={-30} stroke={ink} strokeWidth={2.5} opacity={0.6} />
							<text
								transform={`translate(40 ${-h / 2}) rotate(-90)`}
								textAnchor="middle"
								fontFamily={HAND}
								fontWeight={700}
								fontSize={34}
								fill={ink}
							>
								{first ? 'Intro' : `Ch ${i}`}
							</text>
						</g>
					);
				})}
				<Tag x={spineX(0) + 30} y={SHELF_Y - spineH(0)} dx={-10} dy={-110} text="it starts here" at={52} size={44} glow={0.7} />
			</HandSvg>
			<Text scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

/* ───────────────────────── 5 · INSIDE A CHAPTER ───────────────────────── */

export const INSIDE = {x: 540, y: 1075, s: 0.82};

const InsideLeft: React.FC<{readonly t: number}> = ({t}) => {
	const {ink, bg} = usePalette();
	const drift = Math.sin(t / 20) * 6;
	return (
		<g transform={`translate(${PAGE_W / 2 + drift} 210)`} stroke={ink} strokeWidth={5} strokeLinecap="round" fill={bg}>
			{/* a little cloud: the struggle */}
			<path d="M -80 30 Q -96 -14 -50 -16 Q -40 -62 6 -52 Q 40 -78 66 -36 Q 104 -30 90 12 Q 84 34 50 32 Z" />
			{[-44, -6, 32].map((x, i) => (
				<line key={x} x1={x} y1={58 + ((t * 2 + i * 14) % 30)} x2={x - 8} y2={78 + ((t * 2 + i * 14) % 30)} opacity={0.7} />
			))}
		</g>
	);
};

const InsideRight: React.FC<{readonly t: number}> = ({t}) => {
	const {ink, bg} = usePalette();
	const tick = prog(t, 70, 84);
	return (
		<g>
			<g transform={`translate(${PAGE_W / 2} 170) rotate(${t * 0.5})`} stroke={ink} strokeWidth={5} strokeLinecap="round" fill={bg}>
				{/* a little sun: the positive */}
				<circle r={42} />
				{Array.from({length: 10}).map((_, i) => (
					<line key={i} x1={0} y1={-60} x2={0} y2={-80} transform={`rotate(${i * 36})`} />
				))}
			</g>
			{/* a tiny checkbox: the small challenge */}
			<g transform={`translate(${PAGE_W / 2 - 80} 340)`} stroke={ink} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
				<rect width={46} height={46} rx={8} />
				<path d="M 10 24 L 20 34 L 38 12" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
				<line x1={70} y1={23} x2={70 + 90 * prog(t, 40, 64)} y2={23} opacity={0.7} />
			</g>
		</g>
	);
};

export const InsideScene: React.FC<SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const open = prog(t, -4, 30, SOFT_IN_OUT);
	const grow = prog(t, -PAD, 26, SOFT);
	const [struggle, positive, challenge] = VIDEO1.insideTags;
	const w = PAGE_W * INSIDE.s;
	const h = PAGE_H * INSIDE.s;
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<g transform={`translate(${INSIDE.x} ${INSIDE.y}) scale(${INSIDE.s * (0.6 + 0.4 * grow)})`}>
					<Book open={open} cover={coverFront} left={<InsideLeft t={t} />} right={<InsideRight t={t} />} glow={0.45} />
				</g>
				<Tag x={INSIDE.x - w + 30} y={INSIDE.y - h / 2} dx={-140} dy={-80} text={struggle} at={34} />
				<Tag x={INSIDE.x + w - 40} y={INSIDE.y - h / 2} dx={-170} dy={-90} text={positive} at={52} />
				<Tag x={INSIDE.x} y={INSIDE.y + h / 2} dx={-210} dy={72} text={challenge} at={70} glow={0.9} />
			</HandSvg>
			<Text scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

/* ───────────────────────── 6 · THE HOST ───────────────────────── */

export const HostScene: React.FC<SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const {ink} = usePalette();
	const {l, r, top, sill} = HOST_WINDOW;
	const frameIn = prog(t, 0, 30);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<defs>
					<clipPath id="winClip">
						<rect x={l + 6} y={top + 6} width={r - l - 12} height={sill - top - 12} />
					</clipPath>
				</defs>
				{/* outside the window: moon + falling snow */}
				<g clipPath="url(#winClip)" opacity={frameIn}>
					<path d="M 740 850 A 44 44 0 1 1 696 794 A 34 34 0 1 0 740 850 Z" fill={ink} opacity={0.85} style={{filter: softGlow(ink, 0.6)}} />
					{Array.from({length: 34}).map((_, i) => {
						const x = l + seeded(i) * (r - l) + Math.sin((t + i * 20) / 24) * 10;
						const y = top + ((t * (0.8 + seeded(i + 7)) * 1.6 + seeded(i + 3) * 700) % (sill - top));
						return <circle key={i} cx={x} cy={y} r={2.5 + seeded(i + 9) * 3} fill={ink} opacity={0.7} />;
					})}
				</g>
				{/* window bars */}
				<g stroke={ink} strokeWidth={4} strokeLinecap="round" opacity={frameIn}>
					<line x1={(l + r) / 2} y1={top} x2={(l + r) / 2} y2={sill} />
					<line x1={l} y1={(top + sill) / 2 - 40} x2={r} y2={(top + sill) / 2 - 40} />
				</g>
				<Lamp x={730} y={sill} scale={0.8} light={prog(t, 10, 30)} opacity={prog(t, 0, 20)} />
				<TeaCup x={600} y={sill} scale={0.65} opacity={prog(t, 6, 26)} />
				<Plant x={950} y={sill} scale={0.9} opacity={prog(t, 4, 24)} />
				<Learner x={380} y={sill} scale={0.98} pose="sit" bookGlow={0.9 + 0.3 * Math.sin(t / 12)} raise={0.2} opacity={prog(t, 0, 22)} />
				<Tag x={380} y={sill - 340} dx={50} dy={-120} overline="YOUR HOST" text={`${SERIES.host} · a fellow learner`} at={20} size={44} glow={0.6} />
			</HandSvg>
			<Text scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

/* ───────────────────────── 7 · THE BOOK CLOSES ───────────────────────── */

export const CloseScene: React.FC<SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur, false, true);
	const close = 1 - prog(t, 10, 40, SOFT_IN_OUT);
	const glow = 0.3 + prog(t, 38, 58) * 0.8 + 0.15 * Math.sin(t / 12);
	const s = 0.95;
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<g transform={`translate(540 ${TABLE_Y - (PAGE_H * s) / 2 - 14}) scale(${s})`}>
					<Book open={close} cover={coverFront} left={<RuledLines />} right={<RuledLines />} glow={glow} />
				</g>
				<Learner x={130} y={TABLE_Y} scale={0.7} bookGlow={0.3} opacity={prog(t, -PAD, 12)} />
				<TeaCup x={950} y={TABLE_Y} scale={0.85} opacity={prog(t, -PAD, 12)} />
			</HandSvg>
			<Cta at={PAD + 4} line={scene.small} detail={`${CHAPTER.title} · ${CHAPTER.airs}`} />
		</AbsoluteFill>
	);
};
