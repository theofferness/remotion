import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '../editorial/fonts';
import {SANS, SERIF} from '../editorial/fonts';
import {IN_OUT, mix, p} from '../editorial/motion';
import {SFX} from '../reels/kit/Sfx';
import {Grain, INK_ON_PAPER, PAPER, Room} from './darkroom/Darkroom';
import {ChapterPage, Gutter, Leaf, type Line, PH, PW, PX, PY, Stage, useGlyphX, Written} from './darkroom/Opening';

/*
 * VIDEO 3 – CHAPTER 1 · LETTING GO OF RESOLUTIONS (episode announcement, airs Monday, January 18, 11 AM).
 * The same book as Video 2: it opens on the Chapter 1 page where Video 2 ended, and every page is written by hand.
 * Letting go is shown, not told: the page with the old resolution is torn out, "failure" is corrected to
 * "information", a resolution cracks, an intention bends and comes back. The pages flip back to the opening page,
 * so the Reel loops. All copy comes from the Chapter 1 script.
 */

export const CH1_COPY = {
	hookLabel: 'THE THIRD WEEK OF JANUARY',
	hook: ['When a lot of us', 'quietly let our', 'resolutions go.'],
	resolution: '“I’ll go to the gym every day.”',
	storyLabel: 'AND THE STORY WE PICK UP',
	story: ['“I’m not disciplined.', 'I always give up.”'],
	whyLabel: 'WHY RESOLUTIONS FADE',
	reasons: ['All or nothing.', 'Pressure, not desire.', 'Results, not who', 'we’re becoming.'],
	reframe: ['What if letting go', 'isn’t failure?'],
	correction: 'information.',
	breaks: 'A resolution can break.',
	bends: 'An intention bends.',
	tryLabel: 'TRY THIS',
	chain: ['I want to go to the gym.', 'Why? To lose weight.', 'Why does that matter?', 'To feel at home in my body.'],
	challenge: ['This week:', 'Let go of one', '“should.”', 'Keep one', 'intention.'],
};

/* ───────────────────────── timeline (frames @30 fps) ───────────────────────── */

export const T3 = {
	turn1: [74, 118], // Chapter 1 page turns
	hook: 124,
	resolution: 252,
	strike: [318, 334],
	story: 346,
	tear: [456, 504],
	reasons: 512,
	turn2: [692, 736],
	reframe: 742,
	strikeFail: [812, 824],
	correction: 828,
	breaks: 914,
	crack: [958, 974],
	bends: 980,
	bend: [1012, 1070],
	turn3: [1086, 1130],
	chain: 1136,
	letGoChain: [1320, 1350],
	challenge: 1428,
	shouldFade: [1540, 1570],
	riffle: [1606, 1666],
	end: 1748,
} as const;
export const CH1_FRAMES = T3.end;

/* ───────────────────────── camera ───────────────────────── */

type Key = {readonly f: number; readonly x: number; readonly y: number; readonly s: number};
const HOME = {x: 540, y: 930, s: 1.07};
const KEYS: Key[] = [
	{f: 0, ...HOME},
	{f: 62, ...HOME},
	{f: 84, x: 540, y: 930, s: 1.0},
	{f: 118, x: 540, y: 930, s: 1.0},
	{f: 140, x: 540, y: 760, s: 1.16},
	{f: 232, x: 540, y: 780, s: 1.16},
	{f: 262, x: 540, y: 1090, s: 1.16},
	{f: 440, x: 540, y: 1090, s: 1.16},
	{f: 470, x: 540, y: 930, s: 1.0},
	{f: 504, x: 540, y: 930, s: 1.0},
	{f: 530, x: 540, y: 900, s: 1.1},
	{f: 676, x: 540, y: 900, s: 1.1},
	{f: 700, x: 540, y: 930, s: 1.0},
	{f: 736, x: 540, y: 930, s: 1.0},
	{f: 756, x: 540, y: 790, s: 1.16},
	{f: 890, x: 540, y: 790, s: 1.16},
	{f: 912, x: 540, y: 1110, s: 1.16},
	{f: 1074, x: 540, y: 1110, s: 1.16},
	{f: 1096, x: 540, y: 930, s: 1.0},
	{f: 1130, x: 540, y: 930, s: 1.0},
	{f: 1150, x: 540, y: 910, s: 1.1},
	{f: 1396, x: 540, y: 910, s: 1.1},
	{f: 1426, x: -180, y: 910, s: 1.1},
	{f: 1580, x: -180, y: 910, s: 1.1},
	{f: 1606, x: 180, y: 930, s: 0.64},
	{f: 1666, x: 180, y: 930, s: 0.64},
	{f: 1704, ...HOME},
	{f: T3.end, ...HOME},
];
const camera = (f: number) => {
	let i = 0;
	while (i < KEYS.length - 2 && f >= KEYS[i + 1].f) i++;
	const a = KEYS[i];
	const b = KEYS[i + 1];
	const k = p(f, a.f, b.f, IN_OUT);
	return {x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), s: mix(a.s, b.s, k)};
};

/* ───────────────────────── page furniture ───────────────────────── */

const Head: React.FC<{readonly folio: string}> = ({folio}) => (
	<>
		<g fontFamily={SANS} fontWeight={600} fontSize={14} letterSpacing={3.2} fill={INK_ON_PAPER} opacity={0.62}>
			<text x={72} y={84}>
				OFFERVISIONS 2027
			</text>
			<text x={PW - 72} y={84} textAnchor="end">
				CHAPTER 1
			</text>
		</g>
		<line x1={72} y1={106} x2={PW - 72} y2={106} stroke={INK_ON_PAPER} strokeWidth={1} opacity={0.18} />
		<text x={PW / 2} y={PH - 40} textAnchor="middle" fill={INK_ON_PAPER} opacity={0.5} fontFamily={SERIF} fontSize={22}>
			{folio}
		</text>
	</>
);

const Label: React.FC<{readonly x?: number; readonly y: number; readonly children: string}> = ({x = 72, y, children}) => (
	<text x={x} y={y} fill={INK_ON_PAPER} opacity={0.7} fontFamily={SANS} fontWeight={600} fontSize={17} letterSpacing={3.6}>
		{children}
	</text>
);

const Paper: React.FC<{readonly side?: 'left' | 'right'; readonly children?: React.ReactNode}> = ({side = 'right', children}) => (
	<div style={{position: 'absolute', inset: 0, background: side === 'right' ? PAPER : '#efede6'}}>
		<svg width={PW} height={PH} viewBox={`0 0 ${PW} ${PH}`} style={{position: 'absolute', inset: 0}}>
			{children}
		</svg>
		<Gutter side={side} />
	</div>
);

/** A pen stroke drawn across words (slightly uneven, like a real hand). */
const Strike: React.FC<{readonly x1: number; readonly x2: number; readonly y: number; readonly at: readonly [number, number]; readonly width?: number}> = ({x1, x2, y, at, width = 4}) => {
	const f = useCurrentFrame();
	const k = p(f, at[0], at[1], IN_OUT);
	const len = Math.hypot(x2 - x1, 6) * 1.05;
	return (
		<path
			d={`M ${x1 - 6} ${y + 3} C ${mix(x1, x2, 0.3)} ${y - 4}, ${mix(x1, x2, 0.7)} ${y + 5}, ${x2 + 8} ${y - 2}`}
			stroke={INK_ON_PAPER}
			strokeWidth={width}
			strokeLinecap="round"
			fill="none"
			strokeDasharray={len}
			strokeDashoffset={len * (1 - k)}
			opacity={k > 0 ? 0.92 : 0}
		/>
	);
};

const lineOf = (text: string, x: number, y: number, size: number, italic = false): Line => ({text, x, y, size, italic, weight: italic ? 300 : 400, ls: size > 70 ? -1.5 : -0.5});

/* ───────────────────────── page 2 – the hook, the resolution, the story (torn out) ───────────────────────── */

const P2_HOOK = [lineOf(CH1_COPY.hook[0], 72, 262, 74), lineOf(CH1_COPY.hook[1], 72, 348, 74), lineOf(CH1_COPY.hook[2], 72, 434, 74, true)];
const P2_RES = [lineOf(CH1_COPY.resolution, 72, 590, 40, true)];
const P2_STORY = [lineOf(CH1_COPY.story[0], 72, 800, 58), lineOf(CH1_COPY.story[1], 72, 880, 58)];

const Page2: React.FC<{readonly done?: boolean}> = ({done = false}) => {
	const xs = useGlyphX(P2_RES);
	return (
		<Paper>
			<Head folio="2" />
			<Label y={172}>{CH1_COPY.hookLabel}</Label>
			<Written id="h" lines={P2_HOOK} start={T3.hook} color={INK_ON_PAPER} speed={0.42} done={done} />
			<Written id="r" lines={P2_RES} start={T3.resolution} color={INK_ON_PAPER} speed={0.5} done={done} />
			{xs ? <Strike x1={72} x2={72 + xs[0][xs[0].length - 1]} y={576} at={T3.strike} /> : null}
			<Label y={712}>{CH1_COPY.storyLabel}</Label>
			<Written id="st" lines={P2_STORY} start={T3.story} color={INK_ON_PAPER} speed={0.45} done={done} />
		</Paper>
	);
};

/* ───────────────────────── page 3 – why resolutions fade ───────────────────────── */

const P4_LINES = [lineOf(CH1_COPY.reasons[0], 132, 336, 62), lineOf(CH1_COPY.reasons[1], 132, 500, 54), lineOf(CH1_COPY.reasons[2], 132, 664, 54), lineOf(CH1_COPY.reasons[3], 132, 742, 54, true)];

const Page4: React.FC<{readonly done?: boolean}> = ({done = false}) => (
	<Paper>
		<Head folio="3" />
		<Label y={200}>{CH1_COPY.whyLabel}</Label>
		<g fill={INK_ON_PAPER} opacity={0.55} fontFamily={SERIF} fontSize={30}>
			<text x={72} y={330}>
				1
			</text>
			<text x={72} y={494}>
				2
			</text>
			<text x={72} y={658}>
				3
			</text>
		</g>
		<line x1={72} y1={404} x2={PW - 72} y2={404} stroke={INK_ON_PAPER} strokeWidth={1} opacity={0.12} />
		<line x1={72} y1={568} x2={PW - 72} y2={568} stroke={INK_ON_PAPER} strokeWidth={1} opacity={0.12} />
		<Written id="w" lines={P4_LINES} start={T3.reasons} color={INK_ON_PAPER} speed={0.45} done={done} />
	</Paper>
);

/* ───────────────────────── page 4 – failure → information; break vs bend ───────────────────────── */

const P5_REFRAME = [lineOf(CH1_COPY.reframe[0], 72, 262, 66), lineOf(CH1_COPY.reframe[1], 72, 352, 66, true)];
const P5_BREAK = [lineOf(CH1_COPY.breaks, 72, 660, 50)];
const P5_BEND = [lineOf(CH1_COPY.bends, 72, 800, 56, true)];

const Page5: React.FC<{readonly done?: boolean}> = ({done = false}) => {
	const f = useCurrentFrame();
	const xr = useGlyphX(P5_REFRAME);
	const xb = useGlyphX(P5_BREAK);
	const failX = xr ? 72 + xr[1][6] : 0; // "isn’t |failure?"
	const failEnd = xr ? 72 + xr[1][xr[1].length - 1] : 0;
	const correction = React.useMemo(() => [lineOf(CH1_COPY.correction, failX, 432, 48, true)], [failX]);
	const crack = p(f, T3.crack[0], T3.crack[1], IN_OUT);
	const bendK = done ? 0 : Math.sin(Math.PI * p(f, T3.bend[0], T3.bend[1], IN_OUT)) * (1 - 0.35 * p(f, T3.bend[0], T3.bend[1]));
	const cracked = done || f >= T3.crack[0];
	const bending = !done && f >= T3.bend[0];
	const bw = xb ? xb[0][xb[0].length - 1] : 0;
	const cx = 72 + bw * 0.64;
	const b = P5_BEND[0];
	const textStyle = {fontFamily: SERIF, fontSize: 50, letterSpacing: -0.5};
	return (
		<Paper>
			<Head folio="4" />
			<Written id="rf" lines={P5_REFRAME} start={T3.reframe} color={INK_ON_PAPER} speed={0.42} done={done} />
			{xr ? <Strike x1={failX} x2={failEnd} y={336} at={T3.strikeFail} width={3.5} /> : null}
			{xr ? <Written id="co" lines={correction} start={T3.correction} color={INK_ON_PAPER} speed={0.4} done={done} /> : null}
			<line x1={72} y1={540} x2={PW - 72} y2={540} stroke={INK_ON_PAPER} strokeWidth={1} opacity={0.12} />
			{/* a resolution can break */}
			{cracked && xb ? (
				<g fill={INK_ON_PAPER}>
					<defs>
						<clipPath id="crk-l">
							<polygon points={`0,560 ${cx},560 ${cx - 6},630 ${cx + 5},648 ${cx - 4},700 0,700`} />
						</clipPath>
						<clipPath id="crk-r">
							<polygon points={`${cx},560 ${PW},560 ${PW},700 ${cx - 4},700 ${cx + 5},648 ${cx - 6},630`} />
						</clipPath>
					</defs>
					<text x={72} y={660} clipPath="url(#crk-l)" {...textStyle} transform={`rotate(${-1.2 * crack} 72 660)`}>
						{CH1_COPY.breaks}
					</text>
					<g transform={`translate(${10 * crack} ${12 * crack}) rotate(${4 * crack} ${cx} 660)`}>
						<text x={72} y={660} clipPath="url(#crk-r)" {...textStyle}>
							{CH1_COPY.breaks}
						</text>
					</g>
				</g>
			) : (
				<Written id="bk" lines={P5_BREAK} start={T3.breaks} color={INK_ON_PAPER} speed={0.45} />
			)}
			{/* an intention bends – and comes back */}
			{bending ? (
				<g>
					<path id="bend-path" d={`M 72 ${b.y} Q ${PW / 2} ${b.y + 90 * bendK} ${PW - 40} ${b.y - 10 * bendK}`} fill="none" />
					<text fill={INK_ON_PAPER} fontFamily={SERIF} fontStyle="italic" fontWeight={300} fontSize={56} letterSpacing={-0.5}>
						<textPath href="#bend-path">{CH1_COPY.bends}</textPath>
					</text>
				</g>
			) : (
				<Written id="bd" lines={P5_BEND} start={T3.bends} color={INK_ON_PAPER} speed={0.45} done={done} />
			)}
		</Paper>
	);
};

/** The back of page 4 – where this week's challenge is written. */
const C_LINES = [lineOf(CH1_COPY.challenge[0], 72, 250, 46, true), lineOf(CH1_COPY.challenge[1], 72, 400, 76), lineOf(CH1_COPY.challenge[2], 72, 490, 76, true), lineOf(CH1_COPY.challenge[3], 72, 640, 76), lineOf(CH1_COPY.challenge[4], 72, 730, 76, true)];

const Page5Back: React.FC<{readonly done?: boolean}> = ({done = false}) => {
	const f = useCurrentFrame();
	const fade = done ? 1 : p(f, T3.shouldFade[0], T3.shouldFade[1], IN_OUT);
	return (
		<Paper side="left">
			<Written id="ch" lines={C_LINES.slice(0, 2)} start={T3.challenge} color={INK_ON_PAPER} speed={0.42} done={done} />
			<g opacity={1 - 0.65 * fade}>
				<Written id="sh" lines={C_LINES.slice(2, 3)} start={T3.challenge + 66} color={INK_ON_PAPER} speed={0.42} done={done} />
			</g>
			<Written id="ke" lines={C_LINES.slice(3)} start={T3.challenge + 92} color={INK_ON_PAPER} speed={0.42} done={done} />
			<line x1={72} y1={756} x2={72 + 330 * fade} y2={756} stroke={INK_ON_PAPER} strokeWidth={2.5} strokeLinecap="round" opacity={fade * 0.8} />
		</Paper>
	);
};

/* ───────────────────────── page 5 – try this ───────────────────────── */

const P7_LINES = [lineOf(CH1_COPY.chain[0], 72, 300, 50), lineOf(CH1_COPY.chain[1], 72, 430, 50), lineOf(CH1_COPY.chain[2], 72, 560, 50), lineOf(CH1_COPY.chain[3], 72, 720, 50, true)];

const Page7: React.FC = () => {
	const f = useCurrentFrame();
	const letGo = p(f, T3.letGoChain[0], T3.letGoChain[1], IN_OUT);
	const xs = useGlyphX(P7_LINES.slice(3));
	return (
		<Paper>
			<Head folio="5" />
			<Label y={190}>{CH1_COPY.tryLabel}</Label>
			<g opacity={1 - 0.8 * letGo}>
				<Written id="c1" lines={P7_LINES.slice(0, 3)} start={T3.chain} color={INK_ON_PAPER} speed={0.5} />
				{[340, 470, 600].map((y) => (
					<path key={y} d={`M 92 ${y} L 92 ${y + 36} M 84 ${y + 26} L 92 ${y + 36} L 100 ${y + 26}`} stroke={INK_ON_PAPER} strokeWidth={1.6} fill="none" opacity={0.35 * p(f, T3.chain + (y - 300) * 0.38, T3.chain + (y - 300) * 0.38 + 10)} />
				))}
			</g>
			<Written id="c2" lines={P7_LINES.slice(3)} start={T3.chain + 128} color={INK_ON_PAPER} speed={0.5} />
			{xs ? <line x1={72} y1={744} x2={72 + xs[0][xs[0].length - 1] * letGo} y2={744} stroke={INK_ON_PAPER} strokeWidth={2.5} strokeLinecap="round" opacity={0.85} /> : null}
		</Paper>
	);
};

/* ───────────────────────── the book ───────────────────────── */

type LeafSpec = {readonly key: string; readonly order: number; readonly theta: number; readonly bend: number; readonly front: React.ReactNode; readonly back: React.ReactNode};

const turnOf = (f: number, a: number, b: number) => 180 * p(f, a, b, IN_OUT);
const bendOf = (theta: number) => 5 * Math.sin((Math.PI * theta) / 180);

const Book: React.FC = () => {
	const f = useCurrentFrame();
	const blank = <Paper side="left" />;

	// riffle back: last-turned page returns first
	const r = T3.riffle;
	const back3 = p(f, r[0], r[0] + 30, IN_OUT);
	const back2 = p(f, r[0] + 12, r[0] + 42, IN_OUT);
	const back1 = p(f, r[0] + 24, r[0] + 54, IN_OUT);
	const theta1 = turnOf(f, T3.turn1[0], T3.turn1[1]) * (1 - back1);
	const theta2 = turnOf(f, T3.turn2[0], T3.turn2[1]) * (1 - back2);
	const theta3 = turnOf(f, T3.turn3[0], T3.turn3[1]) * (1 - back3);
	const riffling = f >= r[0];

	const leaves: LeafSpec[] = [
		{key: 'ch1', order: 0, theta: theta1, bend: bendOf(theta1), front: <ChapterPage footer="broadcast" />, back: blank},
		{key: 'p4', order: 2, theta: theta2, bend: bendOf(theta2), front: <Page4 done={f >= T3.turn2[0]} />, back: blank},
		{key: 'p5', order: 3, theta: theta3, bend: bendOf(theta3), front: <Page5 done={f >= T3.turn3[0]} />, back: <Page5Back done={riffling} />},
	];

	// draw order: right-hand stack (bottom → top), then left-hand stack (bottom → top), then pages in motion
	const right = leaves.filter((l) => l.theta <= 0.01).sort((a, b) => b.order - a.order);
	const left = leaves.filter((l) => l.theta >= 179.99).sort((a, b) => a.order - b.order);
	const moving = leaves.filter((l) => l.theta > 0.01 && l.theta < 179.99);

	// the torn-out page
	const tear = p(f, T3.tear[0], T3.tear[1], IN_OUT);
	const torn = f >= T3.tear[1];
	const tearing = f >= T3.tear[0] && !torn;
	const showP2 = f >= T3.turn1[0] && !torn;

	const leafEl = (l: LeafSpec) => (
		<Stage key={l.key} x={PX} y={PY} w={PW} h={PH}>
			<Leaf theta={l.theta} bend={l.bend} strips={l.theta > 0.01 && l.theta < 179.99 ? 10 : 1} w={PW} h={PH} front={l.front} back={l.back} />
		</Stage>
	);
	const jag = Array.from({length: 26}, (_, i) => `${(i % 2 === 0 ? 4 : 13) + (i % 5)}px ${(i / 25) * 100}%`).join(', ');
	const p2 = (
		<Stage key="p2" x={PX} y={PY} w={PW} h={PH}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					transformOrigin: '0% 0%',
					transform: tearing ? `translate3d(${-120 * tear}px, ${-1300 * tear * tear}px, ${160 * tear}px) rotateZ(${-16 * tear}deg) rotateY(${-28 * Math.sin(Math.PI * Math.min(1, tear * 1.4))}deg)` : undefined,
					clipPath: tearing ? `polygon(${jag}, 100% 100%, 100% 0%)` : undefined,
					boxShadow: tearing ? `0 ${40 * tear}px ${90 * tear}px rgba(0,0,0,${0.5 * tear})` : undefined,
				}}
			>
				<Page2 done={tearing} />
			</div>
		</Stage>
	);

	return (
		<>
			{/* page block + left-hand base page */}
			{[6, 4, 2].map((o) => (
				<div key={o} style={{position: 'absolute', left: PX + o, top: PY + o, width: PW, height: PH, background: o === 6 ? '#cfccc3' : '#e4e1d9'}} />
			))}
			<div style={{position: 'absolute', left: PX - PW, top: PY, width: PW, height: PH}}>{blank}</div>
			<div style={{position: 'absolute', left: PX, top: PY, width: PW, height: PH}}>
				<Page7 />
			</div>
			{right.filter((l) => l.order > 1).map(leafEl)}
			{showP2 && !tearing ? p2 : null}
			{/* the stub left at the spine once a page is torn out (under Chapter 1 when that page lies on the right) */}
			{f >= T3.tear[0] ? <div style={{position: 'absolute', left: PX, top: PY, width: 16, height: PH, background: PAPER, clipPath: `polygon(0 0, ${jag}, 0 100%)`, opacity: Math.min(1, tear * 3)}} /> : null}
			{right.filter((l) => l.order <= 1).map(leafEl)}
			{left.map(leafEl)}
			{moving.map(leafEl)}
			{tearing ? p2 : null}
		</>
	);
};

/* ───────────────────────── sound ───────────────────────── */

const Cue: React.FC<{readonly at: number; readonly src: string; readonly volume: number; readonly name: string}> = ({at, src, volume, name}) => (
	<Sequence from={Math.max(0, Math.round(at))} durationInFrames={90} layout="none" name={name}>
		<Audio src={staticFile(src)} volume={volume} />
	</Sequence>
);

const Sound: React.FC = () => {
	const {durationInFrames} = useVideoConfig();
	const pens = [T3.hook, T3.hook + 44, T3.resolution, T3.story, T3.reasons, T3.reasons + 60, T3.reasons + 120, T3.reframe, T3.correction, T3.breaks, T3.bends, T3.chain, T3.chain + 60, T3.chain + 128, T3.challenge, T3.challenge + 66];
	return (
		<>
			<Audio name="Ambient bed" src={staticFile('audio/2027/ambient.mp3')} volume={(fr) => 0.5 * interpolate(fr, [0, 6, durationInFrames - 6, durationInFrames], [0.6, 1, 1, 0.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
			{pens.map((a, i) => (
				<Cue key={i} name="pen on paper" at={a} src={SFX.pencil} volume={0.14} />
			))}
			<Cue name="strike" at={T3.strike[0]} src={SFX.pencil} volume={0.3} />
			<Cue name="strike · failure" at={T3.strikeFail[0]} src={SFX.pencil} volume={0.3} />
			{[T3.turn1[0], T3.turn2[0], T3.turn3[0]].map((a) => (
				<Cue key={a} name="page turns" at={a + 2} src={SFX.pageTurn} volume={0.45} />
			))}
			<Cue name="page torn out (impact 1)" at={T3.tear[0]} src={SFX.pageTurn} volume={0.6} />
			<Cue name="tear · air" at={T3.tear[0] + 4} src={SFX.air} volume={0.3} />
			<Cue name="crack" at={T3.crack[0]} src={SFX.pop} volume={0.22} />
			{[0, 12, 24].map((d) => (
				<Cue key={d} name="riffle" at={T3.riffle[0] + d} src={SFX.pageTurn} volume={0.35} />
			))}
			<Cue name="back to Chapter 1 (impact 2)" at={T3.riffle[0] + 56} src={SFX.chime} volume={0.3} />
		</>
	);
};

/* ───────────────────────── composition ───────────────────────── */

/** VIDEO 3 – Chapter 1 · Letting Go of Resolutions. Loops: first and last frames are the same page. */
export const Chapter1: React.FC = () => {
	const f = useCurrentFrame();
	const c = camera(f);
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<Room light={{x: 50, y: 50}} />
			<div style={{position: 'absolute', inset: 0, transformOrigin: '540px 930px', transform: `translate(${(540 - c.x) * c.s}px, ${(930 - c.y) * c.s}px) scale(${c.s})`}}>
				<div style={{position: 'absolute', left: PX - PW, top: PY + 30, width: PW * 2, height: PH, background: 'rgba(0,0,0,0.55)', filter: 'blur(44px)'}} />
				<Book />
			</div>
			<Grain seed={Math.floor(f / 2) + 300} opacity={0.05} />
			<Sound />
		</AbsoluteFill>
	);
};
