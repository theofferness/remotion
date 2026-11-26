import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '../editorial/fonts';
import {Atmos, hexA, Motes} from '../editorial/Atmos';
import {SANS, SERIF} from '../editorial/fonts';
import {LightLine, type LineKey} from '../editorial/Line';
import {BrandLogo} from '../editorial/Logo';
import {EXPO_OUT, IN_OUT, QUART_OUT, p} from '../editorial/motion';
import {PageTurn} from '../editorial/PageTurn';
import {BRAND, SEASONS, type SeasonKey} from '../editorial/theme';
import {Rule, SansTitle, SerifWords, Tracked} from '../editorial/Type';
import type {Pt} from '../reels/kit/shapes';
import {SFX} from '../reels/kit/Sfx';

/*
 * VIDEO 2 – PART ONE · WINTER · VISUALISATION (post: Thursday, January 14, 2027)
 * Same design language, type scale and pacing as the approved Video 1.
 * Visual idea: "seeing clearly" – key text comes into focus like a lens; rings that echo the logo close in like an aperture.
 * All copy comes from the 2027 scripts (Introduction: the practice, the challenge, Part 1; the script index for chapters/dates).
 */

const W = SEASONS.winter;
const INK = W.ink;

/* ─────────────── timeline (frames @ 30 fps) – each screen holds ~0.3 s per word ─────────────── */
const T = {
	hook: [0, 120],
	cover: [120, 290],
	parts: [290, 415],
	contents: [415, 615],
	question: [615, 755],
	really: [755, 915],
	mightBe: [915, 1035],
	write: [1035, 1155],
	keep: [1155, 1295],
	comeBack: [1295, 1410],
	end: [1410, 1610],
} as const;
export const PART_ONE_FRAMES = T.end[1];
const COVER_TURN = 40;

/** Copy – from the 2027 scripts. */
export const PART_ONE_COPY = {
	hook: ['The first page', 'isn’t about fixing anything.'],
	parts: ['Four parts.', 'A new chapter every other Monday.'],
	contentsLabel: 'In Part One',
	chapters: [
		{n: '01', title: 'Letting Go of Resolutions', date: 'JAN 18'},
		{n: '02', title: 'Your Vision for 2027', date: 'JAN 25'},
		{n: '03', title: 'The Voice That Judges You', date: 'FEB 8'},
		{n: '04', title: 'Becoming Your Own Best Friend', date: 'FEB 22'},
	],
	questionLabel: 'Your first question',
	question: ['What do I want', 'this year to offer me?'],
	notShould: ['Not what you should want.', 'Not what looks good online.'],
	really: 'What do you really want?',
	mightBe: {lead: 'It might be', items: ['Peace.', 'Courage.', 'One honest conversation.']},
	write: ['Write the first answer', 'that comes.'],
	writeSub: 'One sentence is enough.',
	keep: ['Keep it somewhere', 'you’ll see it.'],
	keepPlaces: ['Notes app', 'Sticky note', 'Mirror'],
	comeBack: ['We’ll come back to it', 'at the end of the year.'],
	end: {chapter: 'Chapter 1', title: 'Letting Go of Resolutions', airs: 'Monday, January 18'},
};

/* ─────────────── helpers ─────────────── */

const Center: React.FC<{readonly top: number; readonly children: React.ReactNode; readonly style?: React.CSSProperties}> = ({top, children, style}) => (
	<div style={{position: 'absolute', top, left: 70, right: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', ...style}}>{children}</div>
);

const hline = (y: number, x1: number, x2: number): Pt[] => [
	[x1, y],
	[x2, y],
];

/** Brings its children into focus like a lens (blur → sharp, a touch of scale). */
const Focus: React.FC<{readonly at: number; readonly dur?: number; readonly children: React.ReactNode}> = ({at, dur = 32, children}) => {
	const t = useCurrentFrame();
	const k = p(t, at, at + dur, QUART_OUT);
	return <div style={{filter: `blur(${(1 - k) * 16}px)`, scale: String(1.04 - 0.04 * k), opacity: Math.min(1, k * 1.6)}}>{children}</div>;
};

/* ─────────────── 1 · hook ─────────────── */

const Hook: React.FC = () => {
	const t = useCurrentFrame();
	const spark = 1 - p(t, 6, 22);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: `radial-gradient(circle 260px at 540px 1010px, ${hexA(INK, 0.16 * spark)}, transparent 70%)`}} />
			<Center top={720}>
				<SerifWords text={PART_ONE_COPY.hook[0]} at={6} out={106} color={INK} size={124} />
				<SerifWords text={PART_ONE_COPY.hook[1]} at={13} out={106} color={INK} size={76} italic weight={300} />
			</Center>
		</AbsoluteFill>
	);
};

/* ─────────────── 2 · the book opens and turns to the Part One cover ─────────────── */

const WinterCover: React.FC = () => {
	const t = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Atmos bg={W.bg} ink={INK} light={0.07} grain={0.07} />
			<div
				style={{
					position: 'absolute',
					top: 520,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontFamily: SERIF,
					fontWeight: 200,
					fontSize: 720,
					lineHeight: 1,
					color: INK,
					opacity: 0.05 * p(t, 8, 40),
					translate: `0px ${interpolate(t, [0, 130], [20, -20])}px`,
				}}
			>
				I
			</div>
			<Center top={420}>
				<BrandLogo variant="white" width={120} reveal={p(t, 4, 28, IN_OUT)} />
				<div style={{height: 24}} />
				<Tracked text={BRAND.wordmark} at={14} color={INK} size={26} weight={400} spacing={0.34} />
			</Center>
			<Center top={690}>
				<Tracked text={W.overline} at={8} color={INK} size={26} weight={500} spacing={0.3} />
				<div style={{height: 22}} />
				<SerifWords text={W.theme} at={12} color={INK} size={132} italic weight={300} />
				<div style={{height: 26}} />
				<Rule at={20} width={64} color={INK} />
				<div style={{height: 30}} />
				<SerifWords text={W.line} at={24} color={INK} size={44} weight={350} stagger={2} style={{maxWidth: 920}} />
			</Center>
			<Center top={1140}>
				<Tracked text={W.months} at={30} color={INK} size={22} spacing={0.32} style={{opacity: 0.75}} />
			</Center>
		</AbsoluteFill>
	);
};

const Cover: React.FC = () => {
	const t = useCurrentFrame();
	const open = p(t, 2, 34, IN_OUT);
	const BW = 330;
	const top = 640;
	const bottom = 1240;
	const page = (side: -1 | 1) => {
		const ox = 540 + side * BW * open;
		const pinch = Math.sin(Math.PI * open) * 26;
		return `540,${top} ${ox},${top + pinch} ${ox},${bottom - pinch} 540,${bottom}`;
	};
	const out = p(t, 156, 170, QUART_OUT);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse ${120 + open * 260}px 420px at 540px 940px, ${hexA(INK, 0.14 * open)}, transparent 75%)`}} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<g fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" opacity={0.85}>
					<polyline points={page(-1)} />
					<polyline points={page(1)} />
					<line x1={540} x2={540} y1={top} y2={bottom} />
				</g>
				<g stroke={INK} strokeWidth={1.5} opacity={0.18 * open}>
					{[top + 70, top + 112, top + 154, bottom - 154, bottom - 112, bottom - 70].map((y, i) => (
						<g key={i}>
							<line x1={540 - BW * open + 40} x2={540 - 40} y1={y} y2={y} />
							<line x1={540 + 40} x2={540 + BW * open - 40 - (i % 3) * 30} y1={y} y2={y} />
						</g>
					))}
				</g>
			</svg>
			<Sequence from={COVER_TURN} name="page turns to Part One">
				<Turn>
					<WinterCover />
				</Turn>
			</Sequence>
		</AbsoluteFill>
	);
};

/** Wraps a page so it turns in over 14 frames. */
const Turn: React.FC<{readonly children: React.ReactNode}> = ({children}) => {
	const t = useCurrentFrame();
	return <PageTurn progress={t / 14}>{children}</PageTurn>;
};

/* ─────────────── 3 · four parts, one book ─────────────── */

const PARTS: SeasonKey[] = ['winter', 'spring', 'summer', 'fall', 'epilogue'];

const Parts: React.FC = () => {
	const t = useCurrentFrame();
	const out = p(t, 112, 124, QUART_OUT);
	return (
		<>
			<Center top={700}>
				<SerifWords text={PART_ONE_COPY.parts[0]} at={6} out={112} color={INK} size={124} />
			</Center>
			<Center top={880}>
				<SerifWords text={PART_ONE_COPY.parts[1]} at={18} out={112} color={INK} size={44} italic weight={300} stagger={2} />
			</Center>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
				{PARTS.map((k, i) => {
					const s = p(t, 26 + i * 5, 46 + i * 5, EXPO_OUT);
					const isWinter = i === 0;
					const lift = isWinter ? 26 * p(t, 56, 76, IN_OUT) : 0;
					const x = 200 + i * 146;
					const h = 170;
					return (
						<g key={k} opacity={s} transform={`translate(0 ${(1 - s) * 40 - lift})`}>
							<rect x={x} y={1240 - h} width={100} height={h} rx={4} fill={SEASONS[k].bg} stroke={INK} strokeWidth={isWinter ? 3 : 1.5} opacity={isWinter ? 1 : 0.85} />
						</g>
					);
				})}
			</svg>
		</>
	);
};

/* ─────────────── 4 · contents of Part One (real titles and dates) ─────────────── */

const Contents: React.FC = () => {
	const t = useCurrentFrame();
	const out = p(t, 186, 200, QUART_OUT);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Center top={500}>
				<Tracked text={W.overline} at={4} color={INK} size={26} weight={500} spacing={0.3} />
				<div style={{height: 14}} />
				<SerifWords text={PART_ONE_COPY.contentsLabel} at={8} color={INK} size={64} italic weight={300} />
			</Center>
			{PART_ONE_COPY.chapters.map((c, i) => {
				const at = 22 + i * 14;
				const k = p(t, at, at + 22, EXPO_OUT);
				const rule = p(t, at + 4, at + 30, IN_OUT);
				const y = 700 + i * 150;
				return (
					<div key={c.n} style={{position: 'absolute', top: y, left: 100, right: 100}}>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 26, overflow: 'hidden', paddingBottom: 8}}>
							<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: '0.2em', color: INK, opacity: 0.8 * k, width: 52}}>{c.n}</div>
							<div style={{flex: 1, fontFamily: SERIF, fontWeight: 400, fontSize: 44, lineHeight: 1.15, color: INK, translate: `0px ${(1 - k) * 100}%`}}>{c.title}</div>
							<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: '0.16em', color: INK, opacity: k, whiteSpace: 'nowrap'}}>{c.date}</div>
						</div>
						<div style={{height: 1.5, width: `${rule * 100}%`, background: INK, opacity: 0.35, marginTop: 18}} />
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/* ─────────────── 5 · the question, coming into focus ─────────────── */

const Question: React.FC = () => {
	const t = useCurrentFrame();
	const close = p(t, 0, 60, IN_OUT);
	const out = p(t, 128, 140, QUART_OUT);
	return (
		<Turn>
			<AbsoluteFill>
				<Atmos bg={W.bg} ink={INK} />
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
					{[0, 1, 2].map((k) => {
						const r = 760 - close * (300 - k * 34);
						return (
							<g key={k} transform={`rotate(${t * (0.08 + k * 0.03)} 540 880)`}>
								<circle cx={540} cy={880} r={r} fill="none" stroke={INK} strokeWidth={k === 0 ? 2 : 1.2} opacity={[0.3, 0.16, 0.09][k]} strokeDasharray={k === 2 ? '6 14' : undefined} />
							</g>
						);
					})}
				</svg>
				<Center top={650} style={{opacity: 1 - out}}>
					<Tracked text={PART_ONE_COPY.questionLabel} at={14} color={INK} size={26} weight={500} spacing={0.3} />
					<div style={{height: 34}} />
					<Focus at={18}>
						<div style={{fontFamily: SERIF, fontWeight: 400, fontSize: 112, lineHeight: 1.08, color: INK}}>{PART_ONE_COPY.question[0]}</div>
						<div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 96, lineHeight: 1.12, color: INK}}>{PART_ONE_COPY.question[1]}</div>
					</Focus>
				</Center>
			</AbsoluteFill>
		</Turn>
	);
};

/* ─────────────── 6 · not what you should want ─────────────── */

const Really: React.FC = () => {
	const t = useCurrentFrame();
	const strikeA = p(t, 46, 60, IN_OUT);
	const strikeB = p(t, 58, 72, IN_OUT);
	const out = p(t, 148, 160, QUART_OUT);
	const line = (y: number, w: number, k: number) => (
		<div style={{position: 'absolute', top: y, left: 540 - w / 2, width: w * k, height: 2, background: INK, boxShadow: `0 0 8px ${INK}`}} />
	);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Center top={640}>
				<div style={{opacity: 1 - 0.5 * strikeA}}>
					<SerifWords text={PART_ONE_COPY.notShould[0]} at={6} color={INK} size={52} italic weight={300} stagger={2} />
				</div>
				<div style={{height: 26}} />
				<div style={{opacity: 1 - 0.5 * strikeB}}>
					<SerifWords text={PART_ONE_COPY.notShould[1]} at={22} color={INK} size={52} italic weight={300} stagger={2} />
				</div>
			</Center>
			{line(675, 600, strikeA)}
			{line(752, 660, strikeB)}
			<Center top={900}>
				<Focus at={74}>
					<div style={{fontFamily: SERIF, fontWeight: 400, fontSize: 108, lineHeight: 1.08, color: INK, maxWidth: 900}}>{PART_ONE_COPY.really}</div>
				</Focus>
			</Center>
		</AbsoluteFill>
	);
};

/* ─────────────── 7 · it might be… ─────────────── */

const MightBe: React.FC = () => {
	const m = PART_ONE_COPY.mightBe;
	return (
		<>
			<Center top={620}>
				<SerifWords text={m.lead} at={4} out={106} color={INK} size={48} italic weight={300} />
			</Center>
			<Center top={720}>
				<SerifWords text={m.items[0]} at={16} out={106} color={INK} size={112} />
			</Center>
			<Center top={860}>
				<SerifWords text={m.items[1]} at={32} out={106} color={INK} size={112} />
			</Center>
			<Center top={1010}>
				<SerifWords text={m.items[2]} at={48} out={106} color={INK} size={72} italic weight={300} />
			</Center>
		</>
	);
};

/* ─────────────── 8 · write the first answer that comes ─────────────── */

const Write: React.FC = () => {
	const t = useCurrentFrame();
	const pen = p(t, 30, 92, (x) => x);
	const out = p(t, 106, 118, QUART_OUT);
	// a calm, handwriting-like stroke along the first ruled line
	const pts: string[] = [];
	const N = 90;
	for (let i = 0; i <= N; i++) {
		const u = i / N;
		const x = 180 + u * 720;
		const y = 1108 + Math.sin(u * 46) * 10 * Math.sin(Math.PI * Math.min(1, u * 1.1)) - Math.sin(u * 13) * 4;
		pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
	}
	const tipU = pen;
	const tipX = 180 + tipU * 720;
	const tipY = 1108 + Math.sin(tipU * 46) * 10 * Math.sin(Math.PI * Math.min(1, tipU * 1.1)) - Math.sin(tipU * 13) * 4;
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Center top={640}>
				<SerifWords text={PART_ONE_COPY.write[0]} at={6} color={INK} size={80} />
				<SerifWords text={PART_ONE_COPY.write[1]} at={12} color={INK} size={80} italic weight={300} />
			</Center>
			<Center top={900}>
				<SerifWords text={PART_ONE_COPY.writeSub} at={26} color={INK} size={44} italic weight={300} stagger={2} />
			</Center>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{[1130, 1200, 1270].map((y, i) => (
					<line key={y} x1={160} x2={160 + 760 * p(t, 18 + i * 4, 40 + i * 4, IN_OUT)} y1={y} y2={y} stroke={INK} strokeWidth={1.5} opacity={0.25} />
				))}
				<path d={pts.join(' ')} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pen} style={{filter: `drop-shadow(0 0 5px ${INK})`}} />
				{pen > 0 && pen < 1 ? <circle cx={tipX} cy={tipY} r={6} fill={INK} style={{filter: `drop-shadow(0 0 10px ${INK})`}} /> : null}
			</svg>
		</AbsoluteFill>
	);
};

/* ─────────────── 9 · keep it somewhere you'll see it ─────────────── */

const Keep: React.FC = () => {
	const t = useCurrentFrame();
	const out = p(t, 128, 140, QUART_OUT);
	const draw = (i: number) => p(t, 28 + i * 10, 52 + i * 10, IN_OUT);
	const shapes = [
		// phone / notes app
		(k: number) => (
			<g>
				<rect x={210} y={975} width={120} height={205} rx={20} fill="none" stroke={INK} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
				<line x1={235} x2={235 + 70 * k} y1={1060} y2={1060} stroke={INK} strokeWidth={3} strokeLinecap="round" />
			</g>
		),
		// sticky note
		(k: number) => (
			<g>
				<path d="M 465 1000 L 615 1000 L 615 1120 L 585 1150 L 465 1150 Z" fill="none" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
				<path d="M 615 1120 L 585 1120 L 585 1150" fill="none" stroke={INK} strokeWidth={2} opacity={k} />
				<line x1={490} x2={490 + 90 * k} y1={1060} y2={1060} stroke={INK} strokeWidth={3} strokeLinecap="round" />
			</g>
		),
		// mirror
		(k: number) => (
			<g>
				<ellipse cx={810} cy={1078} rx={66} ry={102} fill="none" stroke={INK} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
				<line x1={775} x2={775 + 70 * k} y1={1060} y2={1060} stroke={INK} strokeWidth={3} strokeLinecap="round" />
			</g>
		),
	];
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Center top={590}>
				<SerifWords text={PART_ONE_COPY.keep[0]} at={6} color={INK} size={104} />
				<SerifWords text={PART_ONE_COPY.keep[1]} at={12} color={INK} size={104} italic weight={300} />
			</Center>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{shapes.map((s, i) => (
					<g key={i} style={{filter: `drop-shadow(0 0 6px ${hexA(INK, 0.5)})`}}>
						{s(draw(i))}
					</g>
				))}
			</svg>
			{PART_ONE_COPY.keepPlaces.map((label, i) => (
				<div key={label} style={{position: 'absolute', top: 1205, left: [270, 540, 810][i] - 150, width: 300, textAlign: 'center'}}>
					<Tracked text={label} at={40 + i * 10} color={INK} size={22} weight={500} spacing={0.24} />
				</div>
			))}
		</AbsoluteFill>
	);
};

/* ─────────────── 10 · we'll come back to it at the end of the year ─────────────── */

const ComeBack: React.FC = () => {
	const t = useCurrentFrame();
	const travel = p(t, 24, 76, IN_OUT);
	const out = p(t, 103, 115, QUART_OUT);
	const x = 180 + travel * 720;
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Center top={680}>
				<SerifWords text={PART_ONE_COPY.comeBack[0]} at={6} color={INK} size={92} />
				<SerifWords text={PART_ONE_COPY.comeBack[1]} at={12} color={INK} size={92} italic weight={300} />
			</Center>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<circle cx={180} cy={1080} r={13} fill={SEASONS.winter.bg} stroke={INK} strokeWidth={2.5} opacity={p(t, 16, 26)} />
				<circle cx={900} cy={1080} r={13 + 4 * p(t, 70, 84)} fill={SEASONS.epilogue.bg} stroke={INK} strokeWidth={2} opacity={p(t, 20, 30)} />
				{travel > 0 && travel < 1 ? <circle cx={x} cy={1080} r={7} fill={INK} style={{filter: `drop-shadow(0 0 12px ${INK})`}} /> : null}
			</svg>
			<div style={{position: 'absolute', top: 1120, left: 80, width: 200, textAlign: 'center'}}>
				<Tracked text="January" at={22} color={INK} size={22} spacing={0.24} />
			</div>
			<div style={{position: 'absolute', top: 1120, left: 800, width: 200, textAlign: 'center'}}>
				<Tracked text="December" at={26} color={INK} size={22} spacing={0.24} />
			</div>
		</AbsoluteFill>
	);
};

/* ─────────────── 11 · end card: the Chapter 1 cover ─────────────── */

const EndCard: React.FC = () => {
	const t = useCurrentFrame();
	const e = PART_ONE_COPY.end;
	return (
		<Turn>
			<AbsoluteFill>
				<Atmos bg={W.bg} ink={INK} />
				<Motes ink={INK} count={10} />
				<Center top={420}>
					<BrandLogo variant="white" width={140} reveal={p(t, 8, 32, IN_OUT)} />
					<div style={{height: 34}} />
					<Tracked text={BRAND.wordmark} at={18} color={INK} size={30} weight={400} spacing={0.34} />
				</Center>
				<Center top={690}>
					<Tracked text={W.overline} at={28} color={INK} size={26} weight={500} spacing={0.3} style={{opacity: 0.88}} />
					<div style={{height: 10}} />
					<SerifWords text={W.theme} at={32} color={INK} size={38} italic weight={300} />
				</Center>
				<Center top={800}>
					<SerifWords text={e.chapter} at={38} color={INK} size={150} weight={400} tracking="-0.015em" />
					<div style={{height: 8}} />
					<SansTitle text={e.title} at={48} color={INK} size={58} weight={600} />
				</Center>
				<Center top={1120}>
					<SerifWords text={e.airs} at={62} color={INK} size={42} italic weight={300} stagger={2} />
				</Center>
				<Center top={1340}>
					<Tracked text={`${BRAND.slot} · ${BRAND.station}`} at={72} color={INK} size={28} weight={500} spacing={0.1} />
				</Center>
			</AbsoluteFill>
		</Turn>
	);
};

/* ─────────────── the line of light ─────────────── */

const LINE_KEYS: LineKey[] = [
	{at: 0, shape: (f) => hline(1010, 540 - 400 * p(f, 0, 26, IN_OUT), 540 + 400 * p(f, 0, 26, IN_OUT))},
	{at: T.cover[0], morph: 18, shape: () => [[540, 640], [540, 1240]]},
	{at: T.cover[0] + 30, morph: 10, opacity: 0, shape: () => [[540, 640], [540, 1240]]},
	{at: T.parts[0], morph: 16, shape: () => hline(1250, 160, 920)},
	{at: T.contents[0], morph: 14, opacity: 0, shape: () => hline(1250, 160, 920)},
	{at: T.really[0] + 60, morph: 18, opacity: 0, shape: () => hline(1250, 470, 610)},
	{at: T.mightBe[0], morph: 18, shape: () => hline(1150, 470, 610)},
	{at: T.write[0], morph: 14, opacity: 0, shape: () => hline(1150, 470, 610)},
	{at: T.keep[0], morph: 18, shape: () => hline(1300, 160, 920)},
	{at: T.comeBack[0], morph: 18, shape: () => hline(1080, 180, 900)},
	{at: T.end[0], morph: 16, opacity: 0, shape: () => hline(1080, 180, 900)},
	{at: T.end[0] + 56, morph: 20, opacity: 0.7, shape: () => hline(1090, 505, 575)},
];

/* ─────────────── sound (impacts: the question chime + the final logo chime) ─────────────── */

const Cue: React.FC<{readonly at: number; readonly src: string; readonly volume: number; readonly name: string}> = ({at, src, volume, name}) => (
	<Sequence from={at} durationInFrames={90} layout="none" name={name}>
		<Audio src={staticFile(src)} volume={volume} />
	</Sequence>
);

const Sound: React.FC = () => {
	const {fps, durationInFrames} = useVideoConfig();
	return (
		<>
			<Audio
				name="Ambient bed"
				src={staticFile('audio/2027/ambient.mp3')}
				volume={(f) => 0.55 * interpolate(f, [0, fps * 1.5, durationInFrames - fps * 2, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
			/>
			<Cue name="air" at={0} src={SFX.air} volume={0.3} />
			<Cue name="book opens" at={T.cover[0] + 2} src={SFX.pageTurn} volume={0.5} />
			<Cue name="page turns · Part One" at={T.cover[0] + COVER_TURN} src={SFX.pageTurn} volume={0.45} />
			<Cue name="page turns · question" at={T.question[0]} src={SFX.pageTurn} volume={0.45} />
			<Cue name="focus" at={T.question[0] + 16} src={SFX.air} volume={0.35} />
			<Cue name="question chime" at={T.question[0] + 40} src={SFX.chime} volume={0.35} />
			<Cue name="writing" at={T.write[0] + 30} src={SFX.pencil} volume={0.5} />
			<Cue name="the year goes by" at={T.comeBack[0] + 24} src={SFX.air} volume={0.35} />
			<Cue name="page turns · Chapter 1" at={T.end[0]} src={SFX.pageTurn} volume={0.45} />
			<Cue name="logo chime" at={T.end[0] + 12} src={SFX.chime} volume={0.4} />
		</>
	);
};

/* ─────────────── composition ─────────────── */

const Shot: React.FC<{readonly span: readonly [number, number]; readonly name: string; readonly children: React.ReactNode}> = ({span, name, children}) => (
	<Sequence from={span[0]} durationInFrames={span[1] - span[0]} name={name}>
		{children}
	</Sequence>
);

/** VIDEO 2 – Part One · Winter · Visualisation (midnight navy). */
export const PartOneWinter: React.FC = () => (
	<AbsoluteFill>
		<Atmos bg={W.bg} ink={INK} />
		<Motes ink={INK} />
		<Shot span={T.hook} name="1 · Hook">
			<Hook />
		</Shot>
		<Shot span={T.cover} name="2 · Part One cover">
			<Cover />
		</Shot>
		<Shot span={T.parts} name="3 · Four parts">
			<Parts />
		</Shot>
		<Shot span={T.contents} name="4 · In Part One">
			<Contents />
		</Shot>
		<Shot span={T.question} name="5 · The question">
			<Question />
		</Shot>
		<Shot span={T.really} name="6 · What do you really want?">
			<Really />
		</Shot>
		<Shot span={T.mightBe} name="7 · It might be">
			<MightBe />
		</Shot>
		<Shot span={T.write} name="8 · Write it down">
			<Write />
		</Shot>
		<Shot span={T.keep} name="9 · Keep it in sight">
			<Keep />
		</Shot>
		<Shot span={T.comeBack} name="10 · End of the year">
			<ComeBack />
		</Shot>
		<Shot span={T.end} name="11 · Chapter 1 cover">
			<EndCard />
		</Shot>
		<LightLine keys={LINE_KEYS} color={INK} width={3} />
		<Sound />
	</AbsoluteFill>
);
