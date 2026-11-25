import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {ARRIVE, SOFT, SOFT_IN_OUT, lerp, prog, seeded} from '../kit/anim';
import {Book, PAGE_H, PAGE_W, RuledLines} from '../kit/Book';
import {Candle, Lamp, Notebook, Snowflake, TeaCup} from '../kit/Cozy';
import {Cta} from '../kit/Cta';
import {HAND, ITALIC} from '../kit/fonts';
import {HandSvg} from '../kit/HandSvg';
import {Learner} from '../kit/Learner';
import {Clipboard, Envelope, Kettle, Lantern, PencilIcon, StickyNote, Stone} from '../kit/Objects';
import {ChapterPage, CoverFront, InsideCover} from '../kit/Pages';
import {softGlow, usePalette} from '../kit/palette';
import {PAD, type SceneProps, SceneText, useScene} from '../kit/scene';
import {SERIES, SEASONS} from '../kit/series';
import {lerpPts, type Pt, resample, smoothPath} from '../kit/shapes';
import {Tag} from '../kit/Tag';
import {CHAPTER, VIDEO2} from './chapter';
import {BOOK_EDGE_Y, BOOK_OPEN, TABLE_Y} from './v1scenes';

export {PAD};
export type V2SceneProps = SceneProps & {readonly next?: string};

/** Ground line for the outdoor "winter" world, desk line for indoor scenes. */
export const G = 1350;
export const DESK = 1390;
export const MIRROR = {l: 300, r: 780, top: 720, shoulder: 880};

const coverFront = <CoverFront title={SERIES.show} year={SERIES.year} />;
const season = SEASONS[CHAPTER.season];
const chapterPage = (glow = 1) => (
	<ChapterPage
		overline={`${season.part.toUpperCase()} · ${season.season.toUpperCase()}`}
		number={CHAPTER.number}
		title={CHAPTER.title}
		subtitle="page one"
		numberGlow={glow}
		pageNo="p. 1"
	/>
);

/* ── the question mark → lantern post (the chapter's visual twist) ── */

const Q_PTS: Pt[] = [
	[445, G - 470],
	[452, G - 522],
	[492, G - 562],
	[546, G - 576],
	[604, G - 560],
	[640, G - 520],
	[640, G - 470],
	[612, G - 430],
	[566, G - 400],
	[545, G - 360],
	[540, G - 300],
	[540, G - 230],
];
const POST_PTS: Pt[] = [
	[690, G - 560],
	[692, G - 600],
	[668, G - 642],
	[626, G - 658],
	[584, G - 646],
	[554, G - 614],
	[543, G - 568],
	[540, G - 500],
	[540, G - 400],
	[540, G - 280],
	[540, G - 140],
	[540, G],
];
const DOT: Pt = [540, G - 150];
const HOOK: Pt = [690, G - 560];
const N = 90;
const Q_R = resample(Q_PTS, N);
const POST_R = resample(POST_PTS, N);

/** Draws the "?" (m = 0) morphing into the lantern post (m = 1). */
const QuestionPost: React.FC<{readonly m: number; readonly draw?: number; readonly glow?: number; readonly opacity?: number; readonly lit?: number}> = ({
	m,
	draw = 1,
	glow = 0,
	opacity = 1,
	lit = 0,
}) => {
	const {ink} = usePalette();
	const pts = lerpPts(Q_R, POST_R, m);
	// The dot travels up to the hook and becomes the lantern.
	const d = prog(m, 0.25, 0.85, SOFT_IN_OUT);
	const dx = lerp(DOT[0], HOOK[0], d);
	const dy = lerp(DOT[1], HOOK[1] + 110, d) - Math.sin(Math.PI * d) * 120;
	const dotR = 18 * (1 - prog(m, 0.6, 0.85));
	return (
		<g opacity={opacity}>
			<g style={glow > 0 ? {filter: softGlow(ink, glow)} : undefined}>
				<path
					d={smoothPath(pts)}
					fill="none"
					stroke={ink}
					strokeWidth={12}
					strokeLinecap="round"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - draw}
				/>
				{m > 0.85 ? <path d={`M 512 ${G} L 568 ${G}`} stroke={ink} strokeWidth={8} strokeLinecap="round" opacity={prog(m, 0.85, 1)} /> : null}
				{draw > 0.95 && dotR > 0.5 ? <circle cx={dx} cy={dy} r={dotR} fill={ink} /> : null}
			</g>
			{m > 0.6 ? <Lantern x={HOOK[0]} y={HOOK[1]} scale={0.9} lit={lit} opacity={prog(m, 0.6, 0.85)} glow={0.4 + lit * 0.8} /> : null}
		</g>
	);
};

/** Light snowfall (deterministic). */
const Snow: React.FC<{readonly t: number; readonly count?: number; readonly opacity?: number}> = ({t, count = 40, opacity = 1}) => {
	const {ink} = usePalette();
	return (
		<g opacity={opacity}>
			{Array.from({length: count}).map((_, i) => {
				const x = 60 + seeded(i + 1) * 960 + Math.sin((t + i * 23) / 26) * 14;
				const y = 640 + ((t * (1.1 + seeded(i + 5)) + seeded(i + 9) * 700) % (G - 640));
				return <circle key={i} cx={x} cy={y} r={2.5 + seeded(i + 3) * 3.5} fill={ink} opacity={0.7} />;
			})}
		</g>
	);
};

/** Zoom-through helper: scale everything around a focus point near the end of a scene. */
const zoomAround = (t: number, dur: number, focus: Pt, enabled: boolean, amount = 6) => {
	const z = enabled ? prog(t, dur - 20, dur + PAD, Easing.in(Easing.cubic)) : 0;
	const s = 1 + z * amount;
	return {
		transform: `translate(${focus[0]} ${focus[1]}) scale(${s}) translate(${-focus[0]} ${-focus[1]})`,
		fadeOut: enabled ? 1 - prog(t, dur - 6, dur + PAD) : 1,
	};
};

/* ══════════════════ ACT 1 · THE STRUGGLE ══════════════════ */

export const HookScene: React.FC<V2SceneProps> = ({dur, scene, first, next}) => {
	const {t, fade} = useScene(dur, first);
	const open = prog(t, 4, 30, SOFT_IN_OUT);
	const turn = prog(t, 34, 70, SOFT_IN_OUT);
	const zoom = next ? prog(t, dur - 22, dur + PAD, Easing.in(Easing.cubic)) : 0;
	const zx = PAGE_W / 2;
	const zs = 1 + zoom * 3.4;
	const {x, y, s} = BOOK_OPEN;
	return (
		<AbsoluteFill style={{opacity: fade * (next ? 1 - prog(t, dur - 4, dur + PAD) : 1)}}>
			<HandSvg>
				<g transform={`translate(${x - zx * s * zoom} ${y}) scale(${s}) translate(${zx} 0) scale(${zs}) translate(${-zx} 0)`}>
					<Book
						open={open}
						turn={turn}
						cover={coverFront}
						left={<InsideCover lines={['for anyone', 'who wants to grow']} />}
						right={<RuledLines />}
						nextRight={chapterPage(0.6 + prog(t, 66, 84) * 0.9)}
						glow={0.4}
					/>
				</g>
			</HandSvg>
			<SceneText scene={scene} dur={dur} hook />
		</AbsoluteFill>
	);
};

export const ListScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const {ink, bg} = usePalette();
	const unroll = prog(t, -PAD, 34, SOFT);
	const top = 610;
	const h = 640 * unroll;
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<g style={{filter: softGlow(ink, 0.5)}}>
					<rect x={480} y={top} width={340} height={h} fill={bg} stroke={ink} strokeWidth={4.5} />
					<rect x={462} y={top - 22} width={376} height={30} rx={15} fill={bg} stroke={ink} strokeWidth={4.5} />
					<rect x={462} y={top + h - 8} width={376} height={30} rx={15} fill={bg} stroke={ink} strokeWidth={4.5} />
					{VIDEO2.listItems.map((item, i) => {
						const yy = top + 60 + i * 72;
						if (yy > top + h - 30) return null;
						const p = prog(t, 4 + i * 5, 14 + i * 5);
						return (
							<g key={item} opacity={p}>
								<rect x={510} y={yy - 26} width={30} height={30} rx={6} fill="none" stroke={ink} strokeWidth={3.5} />
								<text x={560} y={yy} fontFamily={HAND} fontWeight={700} fontSize={40} fill={ink}>
									{item}
								</text>
							</g>
						);
					})}
				</g>
				<Learner x={250} y={G} scale={0.75} tilt={-8} bookGlow={0.2} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

const NOTES = Array.from({length: 24}, (_, i) => {
	const col = i % 3;
	const row = Math.floor(i / 3);
	return {x: 640 + col * 100 + (seeded(i) - 0.5) * 16, y: G - 50 - row * 84, rot: (seeded(i + 40) - 0.5) * 18};
});

const NotesTower: React.FC<{readonly t: number; readonly appear?: boolean; readonly lift?: number}> = ({t, appear = false, lift = 0}) => (
	<>
		{NOTES.map((n, i) => {
			const p = appear ? prog(t, 2 + i * 3, 14 + i * 3, ARRIVE) : 1;
			const l = prog(lift, i / 40, i / 40 + 0.4);
			return (
				<StickyNote
					key={i}
					x={n.x + l * (seeded(i + 7) - 0.5) * 120}
					y={n.y - (1 - p) * 120 - l * 160}
					rotate={n.rot + l * 30}
					seed={i}
					opacity={p * (1 - l)}
				/>
			);
		})}
	</>
);

export const PileScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<NotesTower t={t} appear />
				<Learner x={250} y={G} scale={interpolate(t, [0, dur], [0.75, 0.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} tilt={-12} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const NotFailureScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const lift = prog(t, 0, 40, SOFT);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<NotesTower t={t} lift={lift} />
				<Snow t={t} opacity={prog(t, 6, 30)} />
				<Learner x={250} y={G} scale={interpolate(t, [0, 30], [0.5, 0.75], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: SOFT})} tilt={-4} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const WrongQScene: React.FC<V2SceneProps> = ({dur, scene, next}) => {
	const {t, fade} = useScene(dur);
	const z = zoomAround(t, dur, DOT, next === 'story', 7);
	return (
		<AbsoluteFill style={{opacity: fade * z.fadeOut}}>
			<HandSvg>
				<g transform={z.transform}>
					<Snow t={t + 80} opacity={0.8} />
					<QuestionPost m={0} draw={prog(t, 2, 40, SOFT_IN_OUT)} glow={0.5} />
					<Learner x={250} y={G} scale={0.75} tilt={-6} />
				</g>
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const StoryScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const {ink, bg} = usePalette();
	const think = 0.5 + 0.5 * Math.sin(t / 18);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<Notebook x={560} y={DESK} scale={0.85} written={prog(t, 20, 120)} />
				<Candle x={790} y={DESK} scale={0.85} glow={0.6} />
				<Learner x={330} y={DESK} scale={0.9} pose="sit" bookGlow={0.4} tilt={-4} />
				{/* thought cloud */}
				<g transform={`translate(330 ${DESK - 420})`} opacity={prog(t, 8, 30)} style={{filter: softGlow(ink, 0.3 + 0.3 * think)}}>
					<path d="M -110 30 Q -140 -20 -90 -40 Q -80 -100 -10 -90 Q 40 -130 90 -80 Q 150 -70 130 -10 Q 140 40 80 44 Q 0 60 -110 30 Z" fill={bg} stroke={ink} strokeWidth={4.5} />
					{[0, 1, 2].map((i) => (
						<path
							key={i}
							d={`M -70 ${-44 + i * 30} q 30 -14 60 0 t 60 0`}
							fill="none"
							stroke={ink}
							strokeWidth={3}
							strokeLinecap="round"
							pathLength={1}
							strokeDasharray={1}
							strokeDashoffset={1 - prog(t, 20 + i * 14, 50 + i * 14)}
							opacity={0.75}
						/>
					))}
					<circle cx={-60} cy={86} r={12} fill={bg} stroke={ink} strokeWidth={4} />
					<circle cx={-40} cy={120} r={7} fill={bg} stroke={ink} strokeWidth={3.5} />
				</g>
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

/* ══════════════════ ACT 2 · THE TURN ══════════════════ */

export const ShouldScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<QuestionPost m={0} />
				<Clipboard x={850} y={G} scale={0.78} rows={['should…', 'should…', 'should…']} ticked={interpolate(t, [10, 70], [0, 3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} glow={0.5} opacity={prog(t, -PAD, 12)} />
				<Learner x={250} y={G} scale={0.75} tilt={-6} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const HomeworkScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const {ink, bg} = usePalette();
	const sheets = Math.round(interpolate(t, [0, 50], [3, 10], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const stamp = prog(t, 40, 52, ARRIVE);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<QuestionPost m={0} opacity={0.45} />
				<g style={{filter: softGlow(ink, 0.5)}}>
					{Array.from({length: sheets}).map((_, i) => (
						<rect key={i} x={740 + (i % 2) * 6} y={G - 28 - i * 26} width={220} height={26} rx={3} fill={bg} stroke={ink} strokeWidth={3.5} />
					))}
					<g transform={`translate(850 ${G - 60 - sheets * 26}) rotate(-12) scale(${0.8 + 0.2 * stamp})`} opacity={stamp}>
						<rect x={-80} y={-34} width={160} height={60} rx={8} fill={bg} stroke={ink} strokeWidth={4} />
						<text x={0} y={8} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={38} fill={ink}>
							DUE: 2027
						</text>
					</g>
				</g>
				<Learner x={250} y={G} scale={0.72} tilt={12} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const DifferentScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const walk = prog(t, 4, 60, SOFT_IN_OUT);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<QuestionPost m={0} glow={0.3 + 0.4 * walk} opacity={0.45 + 0.55 * prog(t, 0, 20)} />
				<Learner x={lerp(250, 400, walk)} y={G} scale={0.75} walk={walk > 0 && walk < 1 ? t / 4 : undefined} tilt={-6} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

/** Frames inside the twist scene where the lantern lights (chime). */
export const TWIST_LIGHT = 64;

export const TwistScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const m = prog(t, 8, 62, SOFT_IN_OUT);
	const lit = prog(t, TWIST_LIGHT - 4, TWIST_LIGHT + 18);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<QuestionPost m={m} glow={0.3} lit={lit} />
				<Learner x={400} y={G} scale={0.75} tilt={interpolate(t, [0, 60], [-6, -14], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} bookGlow={0.2 + lit * 0.4} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const DirectionScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const {ink} = usePalette();
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				{[760, 890, 1020].map((x, i) => {
					const p = prog(t, 6 + i * 10, 26 + i * 10);
					return <ellipse key={x} cx={x} cy={G + 4} rx={60 * p} ry={12 * p} fill={ink} opacity={0.35 * p} style={{filter: softGlow(ink, 0.8)}} />;
				})}
				{[0, 1, 2, 3].map((i) => {
					const p = prog(t, 16 + i * 8, 30 + i * 8);
					return <path key={i} d={`M ${720 + i * 80} ${G - 22} l 16 -6 l -16 -6`} fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={p * 0.8} />;
				})}
				<QuestionPost m={1} lit={1} />
				<Learner x={400} y={G} scale={0.75} tilt={-6} bookGlow={0.4} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const RulesScene: React.FC<V2SceneProps> = ({dur, scene, next}) => {
	const {t, fade} = useScene(dur);
	const z = zoomAround(t, dur, [HOOK[0], HOOK[1] + 120], next === 'firstpage', 7);
	return (
		<AbsoluteFill style={{opacity: fade * z.fadeOut}}>
			<HandSvg>
				<g transform={z.transform}>
					{Array.from({length: 10}).map((_, i) => {
						const side = i % 2 === 0 ? -1 : 1;
						const p = prog(t, i * 4, 40 + i * 4);
						const x = 540 + side * (260 + seeded(i) * 160) + side * p * 120;
						const y = 760 + seeded(i + 3) * 520 - p * 80;
						return <StickyNote key={i} x={x} y={y} scale={0.55} rotate={(seeded(i + 8) - 0.5) * 40} seed={i} opacity={0.4 * (1 - prog(t, 50 + i * 3, 80 + i * 3))} />;
					})}
					<QuestionPost m={1} lit={1} />
					<Learner x={400} y={G} scale={0.75} tilt={-10} bookGlow={0.5} />
				</g>
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

/** Left page of the book in the turn: the lantern sketch + the question. */
const QuestionPage: React.FC = () => {
	const {ink} = usePalette();
	return (
		<g>
			<g transform="translate(190 70) scale(0.9)">
				<Lantern x={0} y={0} scale={1} lit={1} glow={0.5} />
			</g>
			{VIDEO2.question.map((l, i) => (
				<text key={l} x={190} y={330 + i * 50} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={40} fill={ink}>
					{l}
				</text>
			))}
		</g>
	);
};

const SeasonPage: React.FC = () => {
	const {ink} = usePalette();
	return (
		<g>
			<Snowflake x={190} y={180} scale={1.1} glow={0.6} />
			<text x={190} y={320} textAnchor="middle" fontFamily={ITALIC} fontStyle="italic" fontSize={50} fill={ink}>
				{season.theme}
			</text>
			<text x={190} y={366} textAnchor="middle" fontFamily={HAND} fontWeight={600} fontSize={34} fill={ink} opacity={0.8}>
				{`${season.part} · ${season.season}`}
			</text>
			<text x={190} y={420} textAnchor="middle" fontFamily={HAND} fontSize={30} fill={ink} opacity={0.65}>
				a chapter every two weeks
			</text>
		</g>
	);
};

const AnatomyPage: React.FC<{readonly t: number}> = ({t}) => {
	const {ink} = usePalette();
	const icons = [
		(o: number) => <Stone x={80} y={150} scale={0.6} opacity={o} />,
		(o: number) => (
			<g transform="translate(80 270)" opacity={o} style={{filter: softGlow(ink, 0.8)}}>
				<path d="M 0 -50 C 18 -26, 16 -4, 0 0 C -16 -4, -18 -26, 0 -50 Z" fill={ink} />
			</g>
		),
		(o: number) => <PencilIcon x={84} y={380} scale={0.55} opacity={o} />,
	];
	return (
		<g>
			{VIDEO2.chapterTags.map((label, i) => {
				const p = prog(t, 100 + i * 10, 112 + i * 10, ARRIVE);
				return (
					<g key={label}>
						{icons[i](p)}
						<text x={136} y={[136, 252, 368][i]} fontFamily={HAND} fontWeight={700} fontSize={i === 2 ? 32 : 36} fill={ink} opacity={p}>
							{label}
						</text>
					</g>
				);
			})}
		</g>
	);
};

const BookOnPage: React.FC<{readonly children: React.ReactNode; readonly appear: number}> = ({children, appear}) => (
	<g transform={`translate(${BOOK_OPEN.x} ${BOOK_OPEN.y}) scale(${BOOK_OPEN.s * (0.92 + 0.08 * appear)})`} opacity={appear}>
		{children}
	</g>
);

export const FirstPageScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<BookOnPage appear={prog(t, -PAD, 14, SOFT)}>
					<Book open={1} left={<QuestionPage />} right={chapterPage(1.2)} glow={0.45} />
				</BookOnPage>
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const ChaptersScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const turn1 = prog(t, 8, 40, SOFT_IN_OUT);
	const turn2 = prog(t, 62, 94, SOFT_IN_OUT);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<BookOnPage appear={1}>
					{t < 52 ? (
						<Book open={1} turn={turn1} left={<QuestionPage />} right={chapterPage(1)} nextRight={<SeasonPage />} glow={0.45} />
					) : (
						<Book open={1} turn={turn2} left={<RuledLines />} right={<SeasonPage />} nextRight={<AnatomyPage t={t} />} glow={0.45} />
					)}
				</BookOnPage>
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const InvitationScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<Envelope x={540} y={G} scale={1.15} open={prog(t, 0, 24, SOFT_IN_OUT)} card={prog(t, 18, 44, SOFT)} text="you’re invited" glow={0.4} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

/* ══════════════════ ACT 3 · THE SMALL STEP ══════════════════ */

const CARD = {x: 620, y: 990, w: 540, h: 230};

const QuestionCard: React.FC<{readonly written: number; readonly glow?: number; readonly line?: number; readonly x?: number; readonly y?: number; readonly scale?: number; readonly rotate?: number}> = ({
	written,
	glow = 0.6,
	line = 0,
	x = CARD.x,
	y = CARD.y,
	scale = 1,
	rotate = 0,
}) => {
	const {ink, bg} = usePalette();
	const full = VIDEO2.question.join('\n');
	const shown = Math.floor(full.length * written);
	let used = 0;
	return (
		<g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} style={{filter: softGlow(ink, glow)}}>
			<rect x={-CARD.w / 2} y={-CARD.h / 2} width={CARD.w} height={CARD.h} rx={14} fill={bg} stroke={ink} strokeWidth={4.5} />
			{VIDEO2.question.map((l, i) => {
				const n = Math.max(0, Math.min(l.length, shown - used));
				used += l.length + 1;
				return (
					<text key={l} x={0} y={-50 + i * 52} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={46} fill={ink}>
						{l.slice(0, n)}
					</text>
				);
			})}
			{line > 0 ? (
				<>
					<path d={`M -200 66 q 50 -10 100 0 t 100 0 t 100 0 t 100 0`} fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} />
					{line >= 1 ? <circle cx={214} cy={66} r={7} fill={ink} style={{filter: softGlow(ink, 1.2)}} /> : null}
				</>
			) : null}
		</g>
	);
};

const Desk: React.FC<{readonly t: number; readonly lamp?: number}> = ({t, lamp = 1}) => (
	<>
		<Lamp x={150} y={DESK} scale={0.9} light={lamp} />
		<TeaCup x={930} y={DESK} scale={0.8} />
		<Notebook x={640} y={DESK} scale={0.85} written={prog(t, 0, 1)} />
		<Learner x={340} y={DESK} scale={0.85} pose="sit" bookGlow={0.3} tilt={-8} />
	</>
);

export const ChallengeScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<Desk t={t} lamp={prog(t, -PAD, 14)} />
				<QuestionCard written={prog(t, 8, 100, (x) => x)} glow={0.5 + 0.3 * prog(t, 100, 120)} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const SentenceScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const line = prog(t, 6, 50, (x) => x);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<Desk t={t} />
				<QuestionCard written={1} line={line} glow={0.7} />
				{line > 0 && line < 1 ? <PencilIcon x={CARD.x - 200 + 400 * line} y={CARD.y + 30} scale={0.6} /> : null}
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

const MirrorReflection: React.FC<{readonly x?: number}> = ({x = 540}) => <Learner x={x} y={G} scale={0.74} bookGlow={0.3} opacity={0.55} />;

export const SeeItScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const fly = prog(t, 0, 30, SOFT_IN_OUT);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<g opacity={prog(t, 10, 30)}>
					<MirrorReflection />
				</g>
				<Kettle x={160} y={G} scale={0.85} opacity={prog(t, 20, 40)} />
				<QuestionCard
					written={1}
					line={1}
					x={lerp(CARD.x, 690, fly)}
					y={lerp(CARD.y, 900, fly) - Math.sin(Math.PI * fly) * 80}
					scale={lerp(1, 0.46, fly)}
					rotate={lerp(0, 6, fly)}
					glow={0.7}
				/>
				<Tag x={MIRROR.l + 30} y={MIRROR.shoulder} dx={-70} dy={-90} text="the mirror" at={50} size={42} />
				<Tag x={160} y={G - 150} dx={-60} dy={-110} text="the kettle" at={84} size={42} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const DAY_BLOCK_EVERY = 6;

export const DaysScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const {ink, bg} = usePalette();
	const days = Math.min(14, Math.max(0, Math.floor((t - 4) / DAY_BLOCK_EVERY) + 1));
	const bx = (i: number) => 584 + (i % 7) * 27;
	const by = (i: number) => G - 28 - Math.floor(i / 7) * 29;
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<MirrorReflection x={440} />
				<Kettle x={160} y={G} scale={0.85} />
				<QuestionCard written={1} line={1} x={690} y={900} scale={0.46} rotate={6} glow={0.4 + days * 0.08} />
				{Array.from({length: 14}).map((_, i) => {
					const p = prog(t, 4 + i * DAY_BLOCK_EVERY, 12 + i * DAY_BLOCK_EVERY, ARRIVE);
					return (
						<g key={i} opacity={p} transform={`translate(${bx(i)} ${by(i) - (1 - p) * 30})`} style={i === days - 1 ? {filter: softGlow(ink, 0.8)} : undefined}>
							<rect x={0} y={0} width={24} height={24} rx={5} fill={bg} stroke={ink} strokeWidth={3} />
							<text x={12} y={18} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={16} fill={ink}>
								{i + 1}
							</text>
						</g>
					);
				})}
				<Tag x={bx(0) + 12} y={by(0)} dx={-40} dy={-130} text="Day 1" at={6} size={40} />
				<Tag x={bx(13) + 12} y={by(13)} dx={-60} dy={-190} text="Day 14" at={4 + 13 * DAY_BLOCK_EVERY + 4} size={40} glow={0.9} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const CtaScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur, false, true);
	const close = 1 - prog(t, 10, 40, SOFT_IN_OUT);
	const glow = 0.3 + prog(t, 38, 58) * 0.8 + 0.15 * Math.sin(t / 12);
	const s = 0.95;
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<g transform={`translate(540 ${TABLE_Y - (PAGE_H * s) / 2 - 14}) scale(${s})`}>
					<Book open={close} cover={coverFront} left={<QuestionPage />} right={<RuledLines />} glow={glow} />
				</g>
				<Learner x={130} y={TABLE_Y} scale={0.7} bookGlow={0.3} opacity={prog(t, -PAD, 12)} />
				<TeaCup x={950} y={TABLE_Y} scale={0.85} opacity={prog(t, -PAD, 12)} />
			</HandSvg>
			<Cta at={PAD + 4} line={scene.small} detail="Come learn with me." />
		</AbsoluteFill>
	);
};

export const BOOK_EDGE = BOOK_EDGE_Y;
