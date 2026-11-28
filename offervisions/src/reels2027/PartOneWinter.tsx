import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '../editorial/fonts';
import {Atmos, hexA, Motes} from '../editorial/Atmos';
import {SERIF} from '../editorial/fonts';
import {LightLine, type LineKey} from '../editorial/Line';
import {BrandLogo, RATIO} from '../editorial/Logo';
import {EXPO_OUT, IN, IN_OUT, QUART_OUT, mix, p, rnd} from '../editorial/motion';
import {BRAND, SEASONS, type SeasonKey} from '../editorial/theme';
import {Rule, SansTitle, SerifWords, Tracked} from '../editorial/Type';
import type {Pt} from '../reels/kit/shapes';
import {SFX} from '../reels/kit/Sfx';

/*
 * VIDEO 2 – PART ONE · WINTER · VISUALISATION
 * ─────────────────────────────────────────────
 * Creative concept: CIRCLE & LINE.
 * The Offervisions logo is a ring (the O – an eye, a lens) and a wave (a horizon).
 * The whole episode is told with only those two shapes meeting and becoming new things:
 *   a dawn on a winter horizon → a doorway into the book → the year as a dial →
 *   a lens that brings the question into focus → a lens that shows a truer question →
 *   a point of light that writes → one line that draws where to keep it →
 *   a full circle back to where we started → circle + line resolve into the logo.
 * Everything else is type, light and stillness.
 */

const W = SEASONS.winter;
const INK = W.ink;

/* ─────────────── timeline (frames @ 30 fps) ─────────────── */
const T = {
	dawn: [0, 130],
	door: [130, 290],
	dial: [290, 415],
	contents: [415, 709],
	question: [709, 859],
	perspective: [859, 1039],
	mightBe: [1039, 1184],
	write: [1184, 1294],
	keep: [1294, 1434],
	fullCircle: [1434, 1564],
	resolve: [1564, 1764],
} as const;
export const PART_ONE_FRAMES = T.resolve[1];

/** Copy – from the 2027 scripts (Introduction: the practice and the challenge; script index for chapters/dates). */
export const PART_ONE_COPY = {
	hook: ['The first page', 'isn’t about fixing anything.'],
	parts: ['Four parts.', 'A new chapter every other Monday.'],
	contentsLabel: 'In Part One',
	chapters: [
		{n: 'Chapter 1', title: 'Letting Go of Resolutions', date: 'January 18', doy: 18},
		{n: 'Chapter 2', title: 'Your Vision for 2027', date: 'January 25', doy: 25},
		{n: 'Chapter 3', title: 'The Voice That Judges You', date: 'February 8', doy: 39},
		{n: 'Chapter 4', title: 'Becoming Your Own Best Friend', date: 'February 22', doy: 53},
	],
	questionLabel: 'Your first question',
	question: ['What do I want', 'this year to offer me?'],
	notShould: ['Not what you should want.', 'Not what looks good online.'],
	shouldQ: 'What should I want?',
	reallyQ: 'What do I really want?',
	mightBe: {lead: 'It might be', items: ['Peace.', 'Courage.', ['One honest', 'conversation.']] as const},
	write: ['Write the first answer', 'that comes.'],
	writeSub: 'One sentence is enough.',
	keep: ['Keep it somewhere', 'you’ll see it.'],
	keepPlaces: ['Notes app', 'Sticky note', 'Mirror'],
	comeBack: ['We’ll come back to it', 'at the end of the year.'],
	end: {chapter: 'Chapter 1', title: 'Letting Go of Resolutions', airs: 'Monday, January 18'},
};

/** Every chapter's air date as a day of the year (from the 2027 script index), for the year dial. */
const CHAPTER_DOY = [18, 25, 39, 53, 67, 81, 102, 116, 130, 144, 165, 179, 193, 207, 221, 235, 256, 270, 284, 298, 312, 326, 347, 361];
const INTRO_DOY = 11;
/** Season arcs on the dial, by month (Jan at the top, clockwise). */
const ARCS: {k: SeasonKey; from: number; to: number}[] = [
	{k: 'winter', from: 0, to: 2},
	{k: 'spring', from: 2, to: 5},
	{k: 'summer', from: 5, to: 8},
	{k: 'fall', from: 8, to: 11},
	{k: 'epilogue', from: 11, to: 12},
];

/* ─────────────── helpers ─────────────── */

const Center: React.FC<{readonly top: number; readonly children: React.ReactNode; readonly style?: React.CSSProperties}> = ({top, children, style}) => (
	<div style={{position: 'absolute', top, left: 70, right: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', ...style}}>{children}</div>
);

const hline = (y: number, x1: number, x2: number): Pt[] => [
	[x1, y],
	[x2, y],
];

const polar = (cx: number, cy: number, r: number, deg: number): Pt => {
	const a = ((deg - 90) * Math.PI) / 180;
	return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

const arcPath = (cx: number, cy: number, r: number, d0: number, d1: number) => {
	const [x0, y0] = polar(cx, cy, r, d0);
	const [x1, y1] = polar(cx, cy, r, d1);
	return `M ${x0} ${y0} A ${r} ${r} 0 ${d1 - d0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};

const Svg: React.FC<{readonly children: React.ReactNode; readonly style?: React.CSSProperties}> = ({children, style}) => (
	<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}>
		{children}
	</svg>
);

const glow = (s = 1) => ({filter: `drop-shadow(0 0 ${6 * s}px ${hexA(INK, 0.55)})`});

/** The year as a circle: hairline ring, season arcs (official colours), a tick for every chapter. */
const YearDial: React.FC<{readonly cx: number; readonly cy: number; readonly r: number; readonly draw: number; readonly ticks: number; readonly rotate?: number; readonly active?: number; readonly winterGlow?: number}> = ({
	cx,
	cy,
	r,
	draw,
	ticks,
	rotate = 0,
	active = -1,
	winterGlow = 1,
}) => (
	<g transform={`rotate(${rotate} ${cx} ${cy})`}>
		<circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={2} opacity={0.4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} transform={`rotate(-90 ${cx} ${cy})`} />
		{ARCS.map((a, i) => {
			const k = p(draw, 0.25 + i * 0.12, 0.55 + i * 0.12);
			const d0 = a.from * 30 + 1.5;
			const d1 = d0 + (a.to * 30 - 1.5 - d0) * k;
			if (k <= 0) return null;
			const isWinter = a.k === 'winter';
			return (
				<path
					key={a.k}
					d={arcPath(cx, cy, r, d0, Math.max(d0 + 0.1, d1))}
					fill="none"
					stroke={isWinter ? INK : SEASONS[a.k].bg}
					strokeWidth={isWinter ? 7 : 9}
					strokeLinecap="round"
					style={isWinter ? glow(winterGlow) : undefined}
				/>
			);
		})}
		{CHAPTER_DOY.map((d, i) => {
			const k = p(ticks, i / 30, i / 30 + 0.3);
			const deg = (360 * d) / 365;
			const [x0, y0] = polar(cx, cy, r + 16, deg);
			const [x1, y1] = polar(cx, cy, r + 16 + (i === active ? 30 : 16), deg);
			return <line key={d} x1={x0} y1={y0} x2={mix(x0, x1, k)} y2={mix(y0, y1, k)} stroke={INK} strokeWidth={i === active ? 4 : 2} opacity={i < 4 ? 1 : 0.5} strokeLinecap="round" />;
		})}
		{(() => {
			const [x, y] = polar(cx, cy, r, (360 * INTRO_DOY) / 365);
			return <circle cx={x} cy={y} r={7 * p(ticks, 0, 0.2)} fill={INK} style={glow(1.5)} />;
		})()}
	</g>
);

/* ─────────────── 1 · dawn: a point of light opens into a ring on the horizon ─────────────── */

const DAWN = {y: 1180, r: 150};

const Dawn: React.FC = () => {
	const t = useCurrentFrame();
	const open = p(t, 26, 66, EXPO_OUT);
	const rise = p(t, 18, 40, QUART_OUT);
	const r = DAWN.r * open;
	const cy = DAWN.y - mix(0, DAWN.r, open) - 2;
	return (
		<>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 420px 300px at 540px ${DAWN.y}px, ${hexA(INK, 0.1 * rise)}, transparent 70%)`}} />
			<Svg>
				{open < 0.05 ? <circle cx={540} cy={DAWN.y - 10 * rise} r={5 * rise} fill={INK} style={glow(2)} /> : null}
				<circle cx={540} cy={cy} r={Math.max(0.1, r)} fill="none" stroke={INK} strokeWidth={2.5} style={glow()} opacity={open} />
			</Svg>
			<Center top={560}>
				<SerifWords text={PART_ONE_COPY.hook[0]} at={44} out={116} color={INK} size={124} />
				<SerifWords text={PART_ONE_COPY.hook[1]} at={51} out={116} color={INK} size={76} italic weight={300} />
			</Center>
		</>
	);
};

/* ─────────────── 2 · through the O: the Winter cover is waiting inside the ring ─────────────── */

const WinterCover: React.FC = () => {
	const t = useCurrentFrame();
	return (
		<AbsoluteFill>
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
					translate: `0px ${interpolate(t, [0, 160], [20, -20])}px`,
				}}
			>
				I
			</div>
			<Center top={420}>
				<BrandLogo variant="white" width={120} reveal={p(t, 30, 54, IN_OUT)} />
				<div style={{height: 24}} />
				<Tracked text={BRAND.wordmark} at={40} color={INK} size={26} weight={400} spacing={0.34} />
			</Center>
			<Center top={690}>
				<Tracked text={W.overline} at={20} color={INK} size={26} weight={500} spacing={0.3} />
				<div style={{height: 22}} />
				<SerifWords text={W.theme} at={24} color={INK} size={132} italic weight={300} />
				<div style={{height: 26}} />
				<Rule at={32} width={64} color={INK} />
				<div style={{height: 30}} />
				<SerifWords text={W.line} at={36} color={INK} size={44} weight={350} stagger={2} style={{maxWidth: 920}} />
			</Center>
			<Center top={1140}>
				<Tracked text={W.months} at={44} color={INK} size={22} spacing={0.32} style={{opacity: 0.75}} />
			</Center>
		</AbsoluteFill>
	);
};

const Door: React.FC = () => {
	const t = useCurrentFrame();
	const dive = p(t, 4, 46, IN);
	const r = DAWN.r * Math.exp(dive * Math.log(2600 / DAWN.r));
	const cx = 540;
	const cy = mix(DAWN.y - DAWN.r - 2, 960, dive);
	const out = p(t, 146, 160, QUART_OUT);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{clipPath: `circle(${r}px at ${cx}px ${cy}px)`}}>
				<AbsoluteFill style={{background: hexA(INK, 0.03)}} />
				<WinterCover />
			</AbsoluteFill>
			<Svg>
				<circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={2.5} style={glow()} opacity={1 - p(t, 36, 50)} />
			</Svg>
		</AbsoluteFill>
	);
};

/* ─────────────── 3 · the year is a circle ─────────────── */

const DIAL = {cx: 540, cy: 1020, r: 330};

const Dial: React.FC = () => {
	const t = useCurrentFrame();
	const back = p(t, 0, 28, EXPO_OUT);
	const r = mix(1400, DIAL.r, back);
	const out = p(t, 113, 125, QUART_OUT);
	return (
		<>
			<Svg style={{opacity: 1}}>
				<YearDial cx={DIAL.cx} cy={DIAL.cy} r={r} draw={p(t, 6, 60, IN_OUT)} ticks={p(t, 40, 90)} />
			</Svg>
			<Center top={420} style={{opacity: 1 - out}}>
				<SerifWords text={PART_ONE_COPY.parts[0]} at={30} color={INK} size={118} />
				<div style={{height: 18}} />
				<SerifWords text={PART_ONE_COPY.parts[1]} at={42} color={INK} size={44} italic weight={300} stagger={2} />
			</Center>
		</>
	);
};

/* ─────────────── 4 · Part One, read off the dial (it turns to each chapter) ─────────────── */

const SLOT = 70;

const Contents: React.FC = () => {
	const t = useCurrentFrame();
	const chapters = PART_ONE_COPY.chapters;
	const idx = Math.min(chapters.length - 1, Math.max(0, Math.floor((t - 14) / SLOT)));
	// turn the dial so the active chapter's tick sits at the top
	const target = (i: number) => -(360 * chapters[i].doy) / 365;
	const turnK = p((t - 14) % SLOT, 0, 18, IN_OUT);
	const rot = t < 14 ? mix(0, target(0), p(t, 0, 14, IN_OUT)) : idx === 0 ? target(0) : mix(target(idx - 1), target(idx), turnK);
	const out = p(t, 280, 294, QUART_OUT);
	return (
		<>
			<Svg style={{opacity: 1 - out}}>
				<YearDial cx={DIAL.cx} cy={DIAL.cy} r={DIAL.r} draw={1} ticks={1} rotate={rot} active={idx} />
				{/* fixed reading mark at the top of the dial */}
				<path d={`M ${DIAL.cx - 10} ${DIAL.cy - DIAL.r - 70} L ${DIAL.cx} ${DIAL.cy - DIAL.r - 54} L ${DIAL.cx + 10} ${DIAL.cy - DIAL.r - 70}`} fill="none" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" opacity={p(t, 6, 20)} />
			</Svg>
			<Center top={500} style={{opacity: 1 - out}}>
				<Tracked text={PART_ONE_COPY.contentsLabel} at={4} color={INK} size={28} weight={500} spacing={0.3} />
			</Center>
			{chapters.map((c, i) => {
				const s = 14 + i * SLOT;
				return (
					<Sequence key={c.n} from={s} durationInFrames={i === chapters.length - 1 ? 294 - s : SLOT} layout="none" name={c.n}>
						<Center top={862} style={{left: 250, right: 250}}>
							<Tracked text={c.n} at={8} out={i === chapters.length - 1 ? 270 - s : SLOT - 10} color={INK} size={24} weight={500} spacing={0.28} />
							<div style={{height: 16}} />
							<SerifWords text={c.title} at={10} out={i === chapters.length - 1 ? 270 - s : SLOT - 10} color={INK} size={54} weight={400} stagger={2} lineHeight={1.12} />
							<div style={{height: 18}} />
							<SerifWords text={c.date} at={16} out={i === chapters.length - 1 ? 270 - s : SLOT - 10} color={INK} size={36} italic weight={300} />
						</Center>
					</Sequence>
				);
			})}
		</>
	);
};

/* ─────────────── 5 · the ring becomes a lens: the question comes into focus inside it ─────────────── */

const LENS = {cx: 540, cy: 900};

const QuestionText: React.FC = () => (
	<div style={{position: 'absolute', top: 790, left: 60, right: 60, textAlign: 'center', color: INK}}>
		<div style={{fontFamily: SERIF, fontWeight: 400, fontSize: 100, lineHeight: 1.08}}>{PART_ONE_COPY.question[0]}</div>
		<div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 84, lineHeight: 1.14}}>{PART_ONE_COPY.question[1]}</div>
	</div>
);

const Question: React.FC = () => {
	const t = useCurrentFrame();
	const move = p(t, 0, 26, IN_OUT);
	const cy = mix(DIAL.cy, LENS.cy, move);
	const r = mix(DIAL.r, 300, move) + p(t, 50, 90, IN_OUT) * 260;
	const textIn = p(t, 18, 34);
	const out = p(t, 136, 150, QUART_OUT);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{opacity: textIn * 0.45, filter: 'blur(9px)'}}>
				<QuestionText />
			</AbsoluteFill>
			<AbsoluteFill style={{clipPath: `circle(${r - 4}px at ${LENS.cx}px ${cy}px)`, opacity: textIn}}>
				<AbsoluteFill style={{background: hexA(INK, 0.035)}} />
				<QuestionText />
			</AbsoluteFill>
			<Svg>
				<circle cx={LENS.cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={2.5} opacity={p(t, 0, 12) * (1 - p(t, 84, 100) * 0.6)} style={glow()} />
			</Svg>
			<Center top={360}>
				<Tracked text={PART_ONE_COPY.questionLabel} at={20} color={INK} size={26} weight={500} spacing={0.3} />
			</Center>
		</AbsoluteFill>
	);
};

/* ─────────────── 6 · a new perspective: the lens shows the truer question ─────────────── */

const QLine: React.FC<{readonly text: string}> = ({text}) => (
	<div style={{position: 'absolute', top: 860, left: 40, right: 40, textAlign: 'center', fontFamily: SERIF, fontWeight: 400, fontSize: 84, lineHeight: 1.1, color: INK}}>{text}</div>
);

const Perspective: React.FC = () => {
	const t = useCurrentFrame();
	const glide = p(t, 44, 80, IN_OUT);
	const grow = p(t, 80, 104, IN_OUT);
	const cx = mix(-160, 470, glide) + grow * 70;
	const cy = 912;
	const r = 150 + grow * 1250;
	const qIn = p(t, 30, 44);
	const out = p(t, 166, 180, QUART_OUT);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Center top={520}>
				<SerifWords text={PART_ONE_COPY.notShould[0]} at={6} color={INK} size={50} italic weight={300} stagger={2} />
				<div style={{height: 18}} />
				<SerifWords text={PART_ONE_COPY.notShould[1]} at={20} color={INK} size={50} italic weight={300} stagger={2} />
			</Center>
			<AbsoluteFill style={{opacity: qIn * (1 - grow)}}>
				<QLine text={PART_ONE_COPY.shouldQ} />
			</AbsoluteFill>
			<AbsoluteFill style={{clipPath: `circle(${r}px at ${cx}px ${cy}px)`, opacity: qIn}}>
				<AbsoluteFill style={{background: W.bg}} />
				<AbsoluteFill style={{background: hexA(INK, 0.04 * (1 - grow))}} />
				<QLine text={PART_ONE_COPY.reallyQ} />
			</AbsoluteFill>
			<Svg>
				<circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={2.5} opacity={qIn * (1 - p(t, 96, 110))} style={glow()} />
			</Svg>
		</AbsoluteFill>
	);
};

/* ─────────────── 7 · it might be… small lenses find the answers ─────────────── */

const GHOSTS = ['peace', 'courage', 'one honest conversation', 'courage', 'peace', 'one honest conversation', 'peace', 'courage', 'peace'];

const MightBe: React.FC = () => {
	const t = useCurrentFrame();
	const m = PART_ONE_COPY.mightBe;
	const out = p(t, 133, 145, QUART_OUT);
	const lenses = [
		{x: 320, y: 820, r: 160, at: 18, content: <div style={{fontFamily: SERIF, fontSize: 80, color: INK}}>{m.items[0]}</div>},
		{x: 760, y: 1030, r: 195, at: 38, content: <div style={{fontFamily: SERIF, fontSize: 80, color: INK}}>{m.items[1]}</div>},
		{
			x: 450,
			y: 1270,
			r: 205,
			at: 58,
			content: (
				<div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 58, lineHeight: 1.12, color: INK, textAlign: 'center'}}>
					{m.items[2][0]}
					<br />
					{m.items[2][1]}
				</div>
			),
		},
	];
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			{GHOSTS.map((g, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: 60 + rnd(i + 3) * 700,
						top: 650 + rnd(i + 11) * 820,
						fontFamily: SERIF,
						fontStyle: i % 2 ? 'italic' : 'normal',
						fontSize: 34 + rnd(i + 5) * 40,
						color: INK,
						opacity: 0.1 * p(t, 4 + i * 2, 20 + i * 2) * (1 - 0.75 * p(t, 40, 90)),
						filter: 'blur(3px)',
						whiteSpace: 'nowrap',
					}}
				>
					{g}
				</div>
			))}
			<Center top={520}>
				<SerifWords text={m.lead} at={6} color={INK} size={52} italic weight={300} />
			</Center>
			{lenses.map((l, i) => {
				const k = p(t, l.at, l.at + 26, EXPO_OUT);
				return (
					<React.Fragment key={i}>
						<Svg>
							<circle cx={l.x} cy={l.y} r={l.r} fill={hexA(INK, 0.03 * k)} stroke={INK} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} transform={`rotate(-90 ${l.x} ${l.y})`} style={glow()} />
						</Svg>
						<div style={{position: 'absolute', left: l.x - l.r, top: l.y - l.r, width: l.r * 2, height: l.r * 2, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: `blur(${(1 - k) * 12}px)`, opacity: k}}>
							{l.content}
						</div>
					</React.Fragment>
				);
			})}
		</AbsoluteFill>
	);
};

/* ─────────────── 8 · the lenses become one point of light – and it writes ─────────────── */

const PEN_Y = 1120;
const penY = (u: number) => PEN_Y + Math.sin(u * 46) * 10 * Math.sin(Math.PI * Math.min(1, u * 1.1)) - Math.sin(u * 13) * 4;

const Write: React.FC = () => {
	const t = useCurrentFrame();
	const gather = p(t, 0, 24, IN_OUT);
	const pen = p(t, 30, 90, (x) => x);
	const out = p(t, 98, 110, QUART_OUT);
	const from = [
		{x: 320, y: 820, r: 160},
		{x: 760, y: 1030, r: 195},
		{x: 450, y: 1270, r: 205},
	];
	const pts: string[] = [];
	for (let i = 0; i <= 90; i++) {
		const u = i / 90;
		pts.push(`${i === 0 ? 'M' : 'L'} ${(180 + u * 720).toFixed(1)} ${penY(u).toFixed(1)}`);
	}
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Svg>
				{gather < 1
					? from.map((f, i) => <circle key={i} cx={mix(f.x, 180, gather)} cy={mix(f.y, PEN_Y, gather)} r={Math.max(1, mix(f.r, 6, gather))} fill="none" stroke={INK} strokeWidth={2.5} opacity={1 - gather * 0.3} />)
					: null}
				{[1150, 1220, 1290].map((y, i) => (
					<line key={y} x1={160} x2={160 + 760 * p(t, 22 + i * 4, 44 + i * 4, IN_OUT)} y1={y} y2={y} stroke={INK} strokeWidth={1.5} opacity={0.22} />
				))}
				<path d={pts.join(' ')} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pen} style={glow()} />
				{gather >= 1 ? <circle cx={180 + pen * 720} cy={penY(pen)} r={6} fill={INK} style={glow(2)} /> : null}
			</Svg>
			<Center top={600}>
				<SerifWords text={PART_ONE_COPY.write[0]} at={20} color={INK} size={80} />
				<SerifWords text={PART_ONE_COPY.write[1]} at={26} color={INK} size={80} italic weight={300} />
			</Center>
			<Center top={850}>
				<SerifWords text={PART_ONE_COPY.writeSub} at={40} color={INK} size={44} italic weight={300} stagger={2} />
			</Center>
		</AbsoluteFill>
	);
};

/* ─────────────── 9 · the same line keeps going and draws where to keep it ─────────────── */

const BASE = 1250;
// one continuous stroke: from the end of the written line → phone → sticky note → mirror
const KEEP_PATH = [
	`M 900 ${PEN_Y}`,
	`C 960 1160, 900 ${BASE}, 760 ${BASE}`,
	`L 270 ${BASE}`,
	// phone (centre bottom at 270, 1180)
	'L 270 1180 L 230 1180 Q 210 1180 210 1160 L 210 995 Q 210 975 230 975 L 310 975 Q 330 975 330 995 L 330 1160 Q 330 1180 310 1180 L 270 1180',
	`L 270 ${BASE} L 540 ${BASE}`,
	// sticky note (bottom centre 540, 1160)
	'L 540 1160 L 465 1160 L 465 1010 L 615 1010 L 615 1130 L 585 1160 L 540 1160',
	`L 540 ${BASE} L 810 ${BASE}`,
	// mirror (ellipse, bottom at 810, 1182)
	'L 810 1182 A 66 102 0 1 1 810.1 1182',
	`L 810 ${BASE} L 940 ${BASE}`,
].join(' ');

const Keep: React.FC = () => {
	const t = useCurrentFrame();
	const draw = p(t, 4, 86, IN_OUT);
	const out = p(t, 128, 140, QUART_OUT);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Svg>
				<path d={KEEP_PATH} fill="none" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={glow()} />
				{[
					[235, 1065, 70],
					[490, 1075, 90],
					[775, 1080, 70],
				].map(([x, y, w], i) => (
					<line key={i} x1={x} x2={x + w * p(t, 40 + i * 16, 56 + i * 16, IN_OUT)} y1={y} y2={y} stroke={INK} strokeWidth={3} strokeLinecap="round" />
				))}
			</Svg>
			<Center top={560}>
				<SerifWords text={PART_ONE_COPY.keep[0]} at={10} color={INK} size={100} />
				<SerifWords text={PART_ONE_COPY.keep[1]} at={16} color={INK} size={100} italic weight={300} />
			</Center>
			{PART_ONE_COPY.keepPlaces.map((label, i) => (
				<div key={label} style={{position: 'absolute', top: 1276, left: [270, 540, 810][i] - 150, width: 300, textAlign: 'center'}}>
					<Tracked text={label} at={44 + i * 16} color={INK} size={22} weight={500} spacing={0.24} />
				</div>
			))}
		</AbsoluteFill>
	);
};

/* ─────────────── 10 · a full circle: the point of light travels the year and comes home ─────────────── */

const RET = {cx: 540, cy: 1060, r: 300};

const FullCircle: React.FC = () => {
	const t = useCurrentFrame();
	const travel = p(t, 34, 104, IN_OUT);
	const home = p(t, 104, 116) * (1 - p(t, 116, 128));
	const [x, y] = polar(RET.cx, RET.cy, RET.r, 360 * travel);
	const out = p(t, 120, 130, QUART_OUT);
	return (
		<>
			<Svg style={{opacity: 1 - out}}>
				<YearDial cx={RET.cx} cy={RET.cy} r={RET.r} draw={p(t, 0, 34, IN_OUT)} ticks={p(t, 20, 40)} winterGlow={1 + home * 2} />
				{travel > 0 ? <path d={arcPath(RET.cx, RET.cy, RET.r + 0.5, 0, Math.min(359.5, 360 * travel))} fill="none" stroke={INK} strokeWidth={2} opacity={0.5 * (1 - out)} /> : null}
				{travel > 0 && travel < 1 ? <circle cx={x} cy={y} r={8} fill={INK} style={glow(2)} /> : null}
				<circle cx={RET.cx} cy={RET.cy - RET.r} r={8 + home * 14} fill="none" stroke={INK} strokeWidth={2} opacity={home} />
			</Svg>
			<Center top={410} style={{opacity: 1 - out}}>
				<SerifWords text={PART_ONE_COPY.comeBack[0]} at={8} color={INK} size={90} />
				<SerifWords text={PART_ONE_COPY.comeBack[1]} at={14} color={INK} size={90} italic weight={300} />
			</Center>
		</>
	);
};

/* ─────────────── 11 · circle + line resolve into the logo → the Chapter 1 cover ─────────────── */

const HERO_W = 380;
const HERO_TOP = 640;
const SMALL_W = 140;
const SMALL_TOP = 410;
// ring geometry inside the supplied logo file (measured): centre (0.589w, 0.534h), mid radius 0.289w, ring weight 0.142w
const ringOf = (w: number, top: number) => ({cx: 540 - w / 2 + 0.589 * w, cy: top + 0.534 * w * RATIO, r: 0.289 * w, sw: 0.142 * w});

const Resolve: React.FC = () => {
	const t = useCurrentFrame();
	const e = PART_ONE_COPY.end;
	const m = p(t, 0, 34, IN_OUT);
	const hero = ringOf(HERO_W, HERO_TOP);
	const cx = mix(RET.cx, hero.cx, m);
	const cy = mix(RET.cy, hero.cy, m);
	const r = mix(RET.r, hero.r, m);
	const sw = mix(2.5, hero.sw, p(t, 20, 40, IN_OUT));
	const logoIn = p(t, 34, 52, IN_OUT);
	const settle = p(t, 78, 106, IN_OUT);
	const w = mix(HERO_W, SMALL_W, settle);
	const top = mix(HERO_TOP, SMALL_TOP, settle);
	return (
		<AbsoluteFill>
			<Motes ink={INK} count={8} opacity={logoIn} />
			<Svg>
				<circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={sw} opacity={p(t, 0, 8) * (1 - logoIn)} />
			</Svg>
			<div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: logoIn}}>
				<BrandLogo variant="white" width={w} />
			</div>
			<div style={{position: 'absolute', top: top + w * RATIO + mix(40, 30, settle), left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<Tracked text={BRAND.wordmark} at={50} color={INK} size={mix(46, 30, settle)} weight={400} spacing={0.34} />
			</div>
			<Center top={690}>
				<Tracked text={W.overline} at={104} color={INK} size={26} weight={500} spacing={0.3} style={{opacity: 0.88}} />
				<div style={{height: 10}} />
				<SerifWords text={W.theme} at={108} color={INK} size={38} italic weight={300} />
			</Center>
			<Center top={800}>
				<SerifWords text={e.chapter} at={112} color={INK} size={150} weight={400} tracking="-0.015em" />
				<div style={{height: 8}} />
				<SansTitle text={e.title} at={122} color={INK} size={58} weight={600} />
			</Center>
			<Center top={1120}>
				<SerifWords text={e.airs} at={134} color={INK} size={42} italic weight={300} stagger={2} />
			</Center>
			<Center top={1340}>
				<Tracked text={`${BRAND.slot} · ${BRAND.station}`} at={142} color={INK} size={28} weight={500} spacing={0.1} />
			</Center>
		</AbsoluteFill>
	);
};

/* ─────────────── the horizon line (the logo's wave) ─────────────── */

const LINE_KEYS: LineKey[] = [
	{at: 0, shape: (f) => hline(DAWN.y, 540 - 460 * p(f, 0, 30, IN_OUT), 540 + 460 * p(f, 0, 30, IN_OUT))},
	{at: T.door[0] + 6, morph: 30, opacity: 0, shape: () => hline(DAWN.y + 200, 80, 1000)},
	{at: T.dial[0] + 20, morph: 24, shape: () => hline(DIAL.cy + DIAL.r, 160, 920)},
	{at: T.question[0], morph: 24, shape: () => hline(LENS.cy + 300 + 40, 180, 900)},
	{at: T.perspective[0], morph: 14, opacity: 0, shape: () => hline(1370, 180, 900)},
	{at: T.fullCircle[0], morph: 24, shape: () => hline(RET.cy + RET.r, 160, 920)},
	{at: T.resolve[0], morph: 30, shape: () => hline(HERO_TOP + HERO_W * RATIO + 10, 360, 720)},
	{at: T.resolve[0] + 40, morph: 12, opacity: 0, shape: () => hline(HERO_TOP + HERO_W * RATIO + 10, 360, 720)},
	{at: T.resolve[0] + 116, morph: 20, opacity: 0.7, shape: () => hline(1090, 505, 575)},
];

/* ─────────────── sound (impacts: question in focus, logo resolves) ─────────────── */

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
			<Cue name="dawn" at={18} src={SFX.air} volume={0.3} />
			<Cue name="through the O" at={T.door[0] + 4} src={SFX.air} volume={0.5} />
			<Cue name="the year turns" at={T.contents[0] + 14} src={SFX.pop} volume={0.25} />
			<Cue name="question in focus" at={T.question[0] + 52} src={SFX.chime} volume={0.35} />
			<Cue name="lens" at={T.perspective[0] + 52} src={SFX.air} volume={0.35} />
			<Cue name="writing" at={T.write[0] + 30} src={SFX.pencil} volume={0.5} />
			<Cue name="one line" at={T.keep[0] + 4} src={SFX.pencil} volume={0.3} />
			<Cue name="around the year" at={T.fullCircle[0] + 34} src={SFX.air} volume={0.35} />
			<Cue name="logo" at={T.resolve[0] + 36} src={SFX.chime} volume={0.4} />
		</>
	);
};

/* ─────────────── composition ─────────────── */

const Shot: React.FC<{readonly span: readonly [number, number]; readonly name: string; readonly children: React.ReactNode}> = ({span, name, children}) => (
	<Sequence from={span[0]} durationInFrames={span[1] - span[0]} name={name}>
		{children}
	</Sequence>
);

/** VIDEO 2 – Part One · Winter · Visualisation (midnight navy) – "Circle & Line". */
export const PartOneWinter: React.FC = () => (
	<AbsoluteFill>
		<Atmos bg={W.bg} ink={INK} />
		<Motes ink={INK} count={8} opacity={0.7} />
		<Shot span={T.dawn} name="1 · Dawn on the horizon">
			<Dawn />
		</Shot>
		<Shot span={T.door} name="2 · Through the O">
			<Door />
		</Shot>
		<Shot span={T.dial} name="3 · The year is a circle">
			<Dial />
		</Shot>
		<Shot span={T.contents} name="4 · Part One on the dial">
			<Contents />
		</Shot>
		<Shot span={T.question} name="5 · The lens">
			<Question />
		</Shot>
		<Shot span={T.perspective} name="6 · A truer question">
			<Perspective />
		</Shot>
		<Shot span={T.mightBe} name="7 · It might be">
			<MightBe />
		</Shot>
		<Shot span={T.write} name="8 · A point of light writes">
			<Write />
		</Shot>
		<Shot span={T.keep} name="9 · One line, three places">
			<Keep />
		</Shot>
		<Shot span={T.fullCircle} name="10 · A full circle">
			<FullCircle />
		</Shot>
		<Shot span={T.resolve} name="11 · Circle + line = Offervisions">
			<Resolve />
		</Shot>
		<LightLine keys={LINE_KEYS} color={INK} width={3} />
		<Sound />
	</AbsoluteFill>
);
