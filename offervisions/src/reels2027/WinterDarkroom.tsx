import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '../editorial/fonts';
import {SANS, SERIF} from '../editorial/fonts';
import {EXPO_OUT, IN, IN_OUT, mix, p, QUART_OUT} from '../editorial/motion';
import {SEASONS, type SeasonKey} from '../editorial/theme';
import {SFX} from '../reels/kit/Sfx';
import {OB, Opening, OPENING_LEN} from './darkroom/Opening';
import {CropMarks, DevelopMask, EdgeCode, Grain, INK_ON_PAPER, LogoImage, NAVY, NIGHT, PAPER, Room, Sheen, Sheet, Sprockets} from './darkroom/Darkroom';

/*
 * VIDEO 2 – PART ONE · WINTER · VISUALISATION  ·  "THE DARKROOM"
 * Visualisation = seeing clearly. In a darkroom an image is already on the paper before you can see it;
 * light and patience bring it up. Every line of copy below *develops* rather than animates in.
 * Copy is taken from the 2027 scripts (Part One). All timing lives in SCENES.
 */

export const COPY = {
	intro: 'Be visionary.',
	hook: ['The first', 'page'],
	hookSub: ['isn’t about', 'fixing anything.'],
	season: {label: 'VISUALISATION  ·  JANUARY – FEBRUARY', line: ['Seeing clearly', 'who we want to become.']},
	parts: {title: 'Four parts.', sub: ['A new chapter', 'every other Monday.']},
	chapters: [
		{n: 1, title: ['Letting Go of', 'Resolutions'], date: 'MONDAY, JANUARY 18'},
		{n: 2, title: ['Your Vision', 'for 2027'], date: 'MONDAY, JANUARY 25'},
		{n: 3, title: ['The Voice That', 'Judges You'], date: 'MONDAY, FEBRUARY 8'},
		{n: 4, title: ['Becoming Your', 'Own Best Friend'], date: 'MONDAY, FEBRUARY 22'},
	],
	question: {label: 'YOUR FIRST QUESTION', lines: ['What do I want', 'this year', 'to offer me?']},
	not: ['Not what you should want.', 'Not what looks good online.'],
	should: ['What should', 'I want?'],
	really: ['What do I', 'really want?'],
	mightBe: 'It might be',
	answers: ['Peace.', 'Courage.', 'One honest conversation.'],
	write: ['Write the', 'first answer', 'that comes.'],
	keep: ['Keep it somewhere', 'you’ll see it.'],
	places: ['NOTES APP', 'STICKY NOTE', 'MIRROR'],
	back: ['We’ll come back to it', 'at the end of the year.'],
	end: {part: 'PART ONE · WINTER', theme: 'Visualisation', chapter: 'Chapter 1', title: 'Letting Go of Resolutions', date: 'Monday, January 18', slot: 'MONDAYS 11 AM  ·  BIG BANG RADIO'},
};

/** Scene lengths in frames (30 fps). Each sentence holds ≈0.3 s per word after it has developed. */
const LEN = {opening: OPENING_LEN, film: 150, contact: 265, question: 140, double: 200, test: 150, sweep: 130, wire: 150, rewind: 145, final: 190} as const;
type SceneKey = keyof typeof LEN;
const ORDER: SceneKey[] = ['opening', 'film', 'contact', 'question', 'double', 'test', 'sweep', 'wire', 'rewind', 'final'];
export const AT = ORDER.reduce(
	(acc, k, i) => ({...acc, [k]: i === 0 ? 0 : acc[ORDER[i - 1]] + LEN[ORDER[i - 1]]}),
	{} as Record<SceneKey, number>,
);
export const DARKROOM_FRAMES = AT.final + LEN.final;

const W = 1080;
const COVERS = ['covers/cover-winter-ch02.png', 'covers/cover-spring-ch08.png', 'covers/cover-summer-ch14.png', 'covers/cover-fall-ch20.png', 'covers/cover-epilogue-ch24.png'];
const PART_LABELS = ['PART ONE', 'PART TWO', 'PART THREE', 'PART FOUR', 'EPILOGUE'];
const CHAPTER_DOY = [18, 25, 39, 53, 67, 81, 102, 116, 130, 144, 165, 179, 193, 207, 221, 235, 256, 270, 284, 298, 312, 326, 347, 361];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const monthOfDoy = (d: number) => MONTHS[new Date(Date.UTC(2027, 0, d)).getUTCMonth()];
const partOf = (c: number): SeasonKey => (c === 0 ? 'intro' : c <= 4 ? 'winter' : c <= 10 ? 'spring' : c <= 16 ? 'summer' : c <= 22 ? 'fall' : 'epilogue');

/* ───────────────────────── shared helpers ───────────────────────── */

/** White type on the room "developing": density rises, focus pulls in. */
const Dev: React.FC<{readonly at: number; readonly dur?: number; readonly out?: number; readonly style?: React.CSSProperties; readonly children: React.ReactNode}> = ({at, dur = 26, out, style, children}) => {
	const f = useCurrentFrame();
	const k = p(f, at, at + dur, QUART_OUT);
	const o = out === undefined ? 1 : 1 - p(f, out, out + 12, IN);
	return <div style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', color: '#fff', ...style, opacity: k * o * ((style?.opacity as number) ?? 1), filter: `blur(${(1 - k) * 9}px)`, transform: `translateY(${(1 - k) * 8}px)`}}>{children}</div>;
};

/** Fade + optional exit transform for a whole scene. */
const exitK = (f: number, len: number, d = 16) => p(f, len - d, len, IN);

/* ───────────────────────── 3 · FILM – five parts on one roll; Winter is selected ───────────────────────── */

const FilmStrip: React.FC = () => {
	const f = useCurrentFrame();
	const zoomOut = p(f, 12, 54, IN_OUT);
	const zoomIn = p(f, 96, 124, IN_OUT);
	const z = zoomOut * (1 - zoomIn);
	const s = mix(1, 0.55, z);
	const c = mix(0, 2, z);
	const push = p(f, LEN.film - 16, LEN.film, IN);
	const fs = 320;
	const pitch = 380;
	const crop = p(f, 108, 132, QUART_OUT);
	return (
		<AbsoluteFill style={{opacity: 1 - push}}>
			<div style={{position: 'absolute', inset: 0, transform: `scale(${1 + push * 1.6})`, transformOrigin: '50% 50%'}}>
				<svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
					<g transform={`translate(540 960) scale(${s}) translate(${-c * pitch} 0)`}>
						<g opacity={p(f, 0, 14)}>
							<rect x={-pitch * 3} y={-230} width={pitch * 10} height={460} fill="#070914" />
							<Sprockets x={-pitch * 3} y={-208} length={pitch * 10} color="#232a4a" pitch={30} />
							<Sprockets x={-pitch * 3} y={198} length={pitch * 10} color="#232a4a" pitch={30} />
						</g>
						{COVERS.map((src, i) => (
							<g key={src} opacity={i === 0 ? p(f, 0, 14, QUART_OUT) : p(f, 6 + i * 4, 24 + i * 4) * mix(1, 0.45, zoomIn)}>
								<image href={staticFile(src)} x={i * pitch - fs / 2} y={-fs / 2} width={fs} height={fs} />
								<EdgeCode x={i * pitch - fs / 2} y={-fs / 2 - 14} text={`${String(i * 6).padStart(2, '0')}  ▸`} color="#8e97c4" size={14} opacity={0.8} />
								<text x={i * pitch} y={fs / 2 + 70} textAnchor="middle" fill="#fff" opacity={0.85 * z} fontFamily={SANS} fontWeight={600} fontSize={30} letterSpacing={7}>
									{PART_LABELS[i]}
								</text>
							</g>
						))}
						<CropMarks x={-fs / 2} y={-fs / 2} w={fs} h={fs} color={PAPER} gap={16} len={44} width={6} progress={crop} />
					</g>
				</svg>
			</div>
			<div style={{opacity: 1 - push}}>
				<Dev at={22} style={{top: 360, fontFamily: SERIF, fontSize: 124, letterSpacing: '-0.02em'}}>
					{COPY.parts.title}
				</Dev>
				<Dev at={46} style={{top: 1270, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 70, lineHeight: 1.15}}>
					{COPY.parts.sub[0]}
					<br />
					{COPY.parts.sub[1]}
				</Dev>
			</div>
		</AbsoluteFill>
	);
};

/* ───────────────────────── 4 · CONTACT SHEET – the year as 24 frames (style frame B) ───────────────────────── */

const CH_START = 24;
const CH_LEN = 60;

const ContactSheet: React.FC = () => {
	const f = useCurrentFrame();
	const Wd = 900;
	const H = 980;
	const cols = 4;
	const fw = 176;
	const fh = 118;
	const gx = 22;
	const left = (Wd - (cols * fw + (cols - 1) * gx)) / 2;
	const rowH = 150;
	const top0 = 96;
	const enter = p(f, 0, 30, QUART_OUT);
	const out = exitK(f, LEN.contact, 18);
	// grease-pencil marks hop from chapter to chapter
	const hop = (i: number) => p(f, CH_START + i * CH_LEN - 8, CH_START + i * CH_LEN + 6, IN_OUT);
	const markX = left + (hop(1) + hop(2) + hop(3)) * (fw + gx);
	const lit = (n: number) => (n === 1 ? p(f, CH_START - 6, CH_START + 10) : hop(n - 1));
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			{COPY.chapters.map((ch, i) => {
				const a = CH_START + i * CH_LEN;
				const isLast = i === COPY.chapters.length - 1;
				return (
					<Sequence key={ch.n} from={a - 4} durationInFrames={isLast ? LEN.contact : CH_LEN + 4} layout="none">
						<div style={{position: 'absolute', top: 290, left: 84, right: 84, color: '#fff'}}>
							<Dev at={0} dur={18} out={isLast ? undefined : CH_LEN - 10} style={{textAlign: 'left', fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: '0.24em', opacity: i === 0 ? 1 : 0.9}}>
								IN PART ONE
							</Dev>
							<Dev at={4} out={isLast ? undefined : CH_LEN - 10} style={{textAlign: 'left', top: 44, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 92, lineHeight: 1.02, letterSpacing: '-0.01em'}}>
								{ch.title[0]}
								<br />
								{ch.title[1]}
							</Dev>
							<Dev at={10} out={isLast ? undefined : CH_LEN - 10} style={{textAlign: 'left', top: 252, fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: '0.2em', opacity: 0.9}}>
								{`CH 0${ch.n}  ·  ${ch.date}`}
							</Dev>
						</div>
					</Sequence>
				);
			})}
			<div style={{position: 'absolute', inset: 0, opacity: enter, transform: `scale(${mix(1.08, 1, enter) + out * 0.2})`, transformOrigin: '50% 70%'}}>
				<Sheet x={90} y={640} w={Wd} h={H} rx={16} rz={mix(-7, -4, enter)} shadow={0.6}>
					<svg width={Wd} height={H} viewBox={`0 0 ${Wd} ${H}`}>
						<EdgeCode x={left} y={56} text="OFFERVISIONS 2027  ▸  CONTACT SHEET  ▸  ROLL 01" color={INK_ON_PAPER} size={16} opacity={0.7} />
						{Array.from({length: 6}).map((_, row) => {
							const y = top0 + row * rowH;
							return (
								<g key={row}>
									<rect x={left - 18} y={y - 18} width={cols * fw + (cols - 1) * gx + 36} height={fh + 36} fill={NAVY} opacity={0.94} />
									<Sprockets x={left - 6} y={y - 14} length={cols * fw + (cols - 1) * gx + 12} color={PAPER} />
									<Sprockets x={left - 6} y={y + fh + 4} length={cols * fw + (cols - 1) * gx + 12} color={PAPER} />
									{Array.from({length: cols}).map((__, c) => {
										const n = row * cols + c + 1;
										const sc = SEASONS[partOf(n)];
										const x = left + c * (fw + gx);
										const on = n <= 4 ? lit(n) : 0;
										return (
											<g key={c} opacity={0.45 + 0.55 * on}>
												<rect x={x} y={y} width={fw} height={fh} fill={sc.bg} stroke={PAPER} strokeOpacity={on} strokeWidth={1} />
												<text x={x + 14} y={y + fh - 16} fill={sc.ink} fontFamily={SERIF} fontSize={44} fontWeight={300}>
													{String(n).padStart(2, '0')}
												</text>
												<text x={x + fw - 12} y={y + 22} textAnchor="end" fill={sc.ink} opacity={0.7 * on} fontFamily={SANS} fontSize={11} fontWeight={600} letterSpacing={2}>
													WINTER
												</text>
											</g>
										);
									})}
								</g>
							);
						})}
						<CropMarks x={markX} y={top0} w={fw} h={fh} color={PAPER} gap={7} len={26} width={4} progress={p(f, CH_START - 10, CH_START + 8, QUART_OUT)} />
					</svg>
					<Sheen angle={120} at={mix(20, 60, p(f, 0, LEN.contact, IN_OUT))} />
				</Sheet>
			</div>
		</AbsoluteFill>
	);
};

/* ───────────────────────── 5 · QUESTION – the first question develops ───────────────────────── */

const Question: React.FC = () => {
	const f = useCurrentFrame();
	const Wd = 860;
	const H = 800;
	const enter = p(f, 0, 40, QUART_OUT);
	const out = exitK(f, LEN.question, 16);
	return (
		<AbsoluteFill style={{opacity: p(f, 0, 14) * (1 - out)}}>
			<Sheet x={110} y={mix(560, 530, enter)} w={Wd} h={H} rx={14} rz={mix(3, 1.5, enter)} shadow={0.7}>
				<svg width={Wd} height={H} viewBox={`0 0 ${Wd} ${H}`}>
					<DevelopMask id="q0" w={Wd} h={H} progress={1.3 * p(f, 4, 34, IN_OUT)} seed={31} scale={0.02} />
					<DevelopMask id="q1" w={Wd} h={H} progress={1.4 * p(f, 14, 58, IN_OUT)} seed={17} />
					<DevelopMask id="q2" w={Wd} h={H} progress={1.4 * p(f, 30, 76, IN_OUT)} seed={23} />
					<g mask="url(#q0)">
						<EdgeCode x={64} y={110} text={COPY.question.label} color={INK_ON_PAPER} size={24} opacity={0.85} />
						<line x1={64} y1={140} x2={164} y2={140} stroke={INK_ON_PAPER} strokeWidth={2} opacity={0.5} />
						<EdgeCode x={Wd - 170} y={H - 50} text="FRAME 01" color={INK_ON_PAPER} size={15} opacity={0.45} />
					</g>
					<g mask="url(#q1)">
						<text x={64} y={330} fill={INK_ON_PAPER} fontFamily={SERIF} fontSize={108} letterSpacing={-2}>
							{COPY.question.lines[0]}
						</text>
					</g>
					<g mask="url(#q2)" fill={INK_ON_PAPER} fontFamily={SERIF} fontStyle="italic" fontSize={108} fontWeight={300} letterSpacing={-1}>
						<text x={64} y={460}>{COPY.question.lines[1]}</text>
						<text x={64} y={590}>{COPY.question.lines[2]}</text>
					</g>
				</svg>
				<Sheen angle={116} at={mix(14, 50, p(f, 0, LEN.question, IN_OUT))} />
			</Sheet>
		</AbsoluteFill>
	);
};

/* ───────────────────────── 6 · DOUBLE EXPOSURE – "should" fades, "really" is dodged up ───────────────────────── */

const DoubleExposure: React.FC = () => {
	const f = useCurrentFrame();
	const Wd = 860;
	const H = 760;
	const ghost = p(f, 8, 40, QUART_OUT) * (1 - p(f, 92, 132, IN_OUT));
	const dodge = p(f, 88, 140, IN_OUT);
	const out = exitK(f, LEN.double, 16);
	const lx = mix(-200, Wd * 0.45, dodge);
	return (
		<AbsoluteFill style={{opacity: p(f, 0, 12) * (1 - out)}}>
			<Dev at={6} style={{top: 300, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 60}}>
				{COPY.not[0]}
			</Dev>
			<Dev at={40} style={{top: 384, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 60}}>
				{COPY.not[1]}
			</Dev>
			<Sheet x={110} y={560} w={Wd} h={H} rx={10} rz={-1.5} shadow={0.7}>
				<svg width={Wd} height={H} viewBox={`0 0 ${Wd} ${H}`}>
					<defs>
						<radialGradient id="dodge-g">
							<stop offset="0%" stopColor="#fff" />
							<stop offset="70%" stopColor="#fff" />
							<stop offset="100%" stopColor="#fff" stopOpacity={0} />
						</radialGradient>
						<mask id="dodge" maskUnits="userSpaceOnUse" x={0} y={0} width={Wd} height={H}>
							<circle cx={lx} cy={H * 0.5} r={mix(60, 1100, dodge)} fill="url(#dodge-g)" />
						</mask>
						<filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
							<feGaussianBlur stdDeviation={2.2} />
						</filter>
					</defs>
					<EdgeCode x={64} y={90} text="EXPOSURE 1   ▸   EXPOSURE 2" color={INK_ON_PAPER} size={16} opacity={0.5} />
					{/* two slightly misregistered exposures of the question we are told to ask */}
					<g fill={INK_ON_PAPER} fontFamily={SERIF} fontSize={112} letterSpacing={-2} filter="url(#soft)">
						<g opacity={ghost * 0.32} transform="translate(16 -10)">
							<text x={64} y={350}>{COPY.should[0]}</text>
							<text x={64} y={480}>{COPY.should[1]}</text>
						</g>
						<g opacity={ghost * 0.5}>
							<text x={64} y={350}>{COPY.should[0]}</text>
							<text x={64} y={480}>{COPY.should[1]}</text>
						</g>
					</g>
					<g mask="url(#dodge)" fill={INK_ON_PAPER} fontFamily={SERIF} letterSpacing={-2}>
						<text x={64} y={350} fontSize={112}>
							{COPY.really[0]}
						</text>
						<text x={64} y={480} fontSize={112} fontStyle="italic" fontWeight={300}>
							{COPY.really[1]}
						</text>
					</g>
				</svg>
				{/* the dodging light passing over */}
				<div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle 300px at ${(lx / Wd) * 100}% 50%, rgba(255,255,255,0.5), transparent 70%)`, mixBlendMode: 'screen', opacity: Math.sin(Math.PI * dodge)}} />
			</Sheet>
		</AbsoluteFill>
	);
};

/* ───────────────────────── 7 · TEST STRIPS – "It might be" ───────────────────────── */

const TestStrips: React.FC = () => {
	const f = useCurrentFrame();
	const out = exitK(f, LEN.test, 16);
	const starts = [14, 42, 70];
	const rot = [-1.6, 1.1, -0.7];
	const sizes = [104, 104, 66];
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<Dev at={2} style={{top: 340, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 76}}>
				{COPY.mightBe}
			</Dev>
			{COPY.answers.map((word, i) => {
				const a = starts[i];
				const slide = p(f, a, a + 22, EXPO_OUT);
				const sw = 900;
				const sh = 200;
				return (
					<div key={word} style={{position: 'absolute', left: mix(-1000, 90, slide), top: 520 + i * 250, width: sw, height: sh, transform: `rotate(${rot[i]}deg)`, boxShadow: '0 24px 60px rgba(0,0,0,0.5)', background: PAPER}}>
						<svg width={sw} height={sh} viewBox={`0 0 ${sw} ${sh}`}>
							<DevelopMask id={`t${i}`} w={sw} h={sh} progress={1.4 * p(f, a + 10, a + 42, IN_OUT)} seed={40 + i} scale={0.015} />
							{/* stepped exposure bands, as on a real test strip */}
							{Array.from({length: 6}).map((_, b) => (
								<g key={b}>
									<rect x={(b * sw) / 6} y={0} width={sw / 6} height={sh} fill={NAVY} opacity={0.025 + b * 0.022} />
									<EdgeCode x={(b * sw) / 6 + 14} y={sh - 16} text={`${2 ** (b + 1)}s`} color={INK_ON_PAPER} size={13} opacity={0.4} />
								</g>
							))}
							<g mask={`url(#t${i})`}>
								<text x={56} y={sh / 2 + sizes[i] * 0.34} fill={INK_ON_PAPER} fontFamily={SERIF} fontStyle={i === 2 ? 'italic' : 'normal'} fontWeight={i === 2 ? 300 : 400} fontSize={sizes[i]} letterSpacing={-1}>
									{word}
								</text>
							</g>
						</svg>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/* ───────────────────────── 8 · LIGHT SWEEP – the invitation is exposed line by line ───────────────────────── */

const LightSweep: React.FC = () => {
	const f = useCurrentFrame();
	const Wd = 860;
	const H = 760;
	const sweep = p(f, 12, 72, IN_OUT);
	const y = mix(-40, H + 40, sweep);
	const out = exitK(f, LEN.sweep, 16);
	return (
		<AbsoluteFill style={{opacity: p(f, 0, 12) * (1 - out)}}>
			<Sheet x={110} y={560} w={Wd} h={H} rx={12} rz={1} shadow={0.7}>
				<svg width={Wd} height={H} viewBox={`0 0 ${Wd} ${H}`}>
					<defs>
						<linearGradient id="sw-g" x1={0} y1={0} x2={0} y2={1} gradientUnits="userSpaceOnUse">
							<stop offset={0} stopColor="#fff" />
							<stop offset={Math.max(0, (y - 40) / H)} stopColor="#fff" />
							<stop offset={Math.max(0.001, Math.min(1, y / H))} stopColor="#fff" stopOpacity={0} />
						</linearGradient>
						<linearGradient id="sw-v" x1={0} y1={0} x2={0} y2={H} gradientUnits="userSpaceOnUse">
							<stop offset={0} stopColor="#fff" />
							<stop offset={Math.max(0, Math.min(1, (y - 40) / H))} stopColor="#fff" />
							<stop offset={Math.max(0.001, Math.min(1, y / H))} stopColor="#fff" stopOpacity={0} />
						</linearGradient>
						<mask id="sw" maskUnits="userSpaceOnUse" x={0} y={0} width={Wd} height={H}>
							<rect width={Wd} height={H} fill="url(#sw-v)" />
						</mask>
					</defs>
					<g mask="url(#sw)" fill={INK_ON_PAPER} fontFamily={SERIF} letterSpacing={-1.5}>
						<EdgeCode x={64} y={100} text="FRAME 02  ▸  EXPOSE" color={INK_ON_PAPER} size={16} opacity={0.5} />
						<text x={64} y={300} fontSize={110}>
							{COPY.write[0]}
						</text>
						<text x={64} y={430} fontSize={110}>
							{COPY.write[1]}
						</text>
						<text x={64} y={560} fontSize={110} fontStyle="italic" fontWeight={300}>
							{COPY.write[2]}
						</text>
					</g>
				</svg>
				{/* unexposed paper sits in the dark until the light passes */}
				<div style={{position: 'absolute', inset: 0, background: NIGHT, opacity: 0.4, WebkitMaskImage: `linear-gradient(180deg, transparent ${y - 10}px, #000 ${y + 120}px)`}} />
				<div style={{position: 'absolute', left: -20, right: -20, top: y - 3, height: 6, background: '#fff', boxShadow: '0 0 28px 10px rgba(200,215,255,0.65)', opacity: sweep > 0 && sweep < 1 ? 1 : 0}} />
			</Sheet>
		</AbsoluteFill>
	);
};

/* ───────────────────────── 9 · DRYING LINE – keep it somewhere you'll see it ───────────────────────── */

const DryingLine: React.FC = () => {
	const f = useCurrentFrame();
	const out = exitK(f, LEN.wire, 16);
	const wire = p(f, 0, 22, IN_OUT);
	const pw = 260;
	const ph = 340;
	const wy = 560;
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
				<path d={`M -20 ${wy} Q 540 ${wy + 26} 1100 ${wy}`} stroke="#c9cde0" strokeWidth={2} fill="none" strokeDasharray={1200} strokeDashoffset={1200 * (1 - wire)} opacity={0.7} />
			</svg>
			{COPY.places.map((place, i) => {
				const a = 14 + i * 16;
				const drop = p(f, a, a + 26, EXPO_OUT);
				const x = 90 + i * 320;
				const sway = Math.sin((f - a) / 13 + i) * 2.4 * (1 - p(f, a, a + 70));
				const sag = 26 * (1 - ((x + pw / 2 - 540) / 560) ** 2);
				return (
					<div key={place} style={{position: 'absolute', left: x, top: wy + sag - 6 + mix(-500, 0, drop), width: pw, height: ph + 20, transform: `rotate(${sway + (i - 1) * 1.2}deg)`, transformOrigin: '50% 0%', opacity: drop}}>
						<div style={{position: 'absolute', left: pw / 2 - 14, top: 0, width: 28, height: 40, background: '#2a3152', borderRadius: 3, zIndex: 2, boxShadow: '0 4px 8px rgba(0,0,0,0.4)'}} />
						<div style={{position: 'absolute', top: 18, width: pw, height: ph, background: PAPER, boxShadow: '0 30px 60px rgba(0,0,0,0.55)'}}>
							<svg width={pw} height={ph}>
								{/* the sentence you wrote – kept private, shown as lines */}
								{[0, 1, 2].map((l) => (
									<line key={l} x1={32} y1={96 + l * 34} x2={pw - 32 - (l === 2 ? 70 : l * 18)} y2={96 + l * 34} stroke={INK_ON_PAPER} strokeWidth={3} strokeLinecap="round" opacity={0.28 * p(f, a + 18 + l * 4, a + 34 + l * 4)} />
								))}
								<line x1={32} y1={ph - 96} x2={pw - 32} y2={ph - 96} stroke={INK_ON_PAPER} strokeWidth={1} opacity={0.25} />
								<text x={pw / 2} y={ph - 50} textAnchor="middle" fill={INK_ON_PAPER} fontFamily={SANS} fontWeight={600} fontSize={22} letterSpacing={4.5}>
									{place}
								</text>
							</svg>
						</div>
					</div>
				);
			})}
			<Dev at={52} style={{top: 1090, fontFamily: SERIF, fontSize: 92, lineHeight: 1.12, letterSpacing: '-0.015em'}}>
				{COPY.keep[0]}
				<br />
				<span style={{fontStyle: 'italic', fontWeight: 300}}>{COPY.keep[1]}</span>
			</Dev>
		</AbsoluteFill>
	);
};

/* ───────────────────────── 10 · REWIND – to December and back to frame 00 ───────────────────────── */

const Rewind: React.FC = () => {
	const f = useCurrentFrame();
	const out = exitK(f, LEN.rewind, 16);
	const fwd = p(f, 12, 54, IN_OUT);
	const back = p(f, 74, 110, IN_OUT);
	const pos = 24 * fwd * (1 - back);
	const vel = Math.abs(24 * (p(f + 1, 12, 54, IN_OUT) * (1 - p(f + 1, 74, 110, IN_OUT))) - pos);
	const tw = 220;
	const th = 150;
	const pitch = 250;
	const n = Math.round(pos);
	const label = `FRAME ${String(n).padStart(2, '0')}  ·  ${n === 0 ? 'JAN' : monthOfDoy(CHAPTER_DOY[n - 1])}`;
	return (
		<AbsoluteFill style={{opacity: p(f, 0, 12) * (1 - out)}}>
			<div style={{position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center', color: '#fff', fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: '0.26em', fontVariantNumeric: 'tabular-nums', opacity: 0.85}}>
				{label}
			</div>
			<svg width={W} height={1920} style={{position: 'absolute', inset: 0, filter: `blur(${Math.min(6, vel * 2.5)}px)`}}>
				<g transform={`translate(${540 - pos * pitch} 860)`}>
					<rect x={-pitch * 2} y={-125} width={pitch * 29} height={250} fill="#070914" />
					<Sprockets x={-pitch * 2} y={-110} length={pitch * 29} color="#232a4a" pitch={30} />
					<Sprockets x={-pitch * 2} y={100} length={pitch * 29} color="#232a4a" pitch={30} />
					{Array.from({length: 25}).map((_, i) => {
						const sc = SEASONS[partOf(i)];
						return (
							<g key={i} opacity={Math.abs(i - pos) < 0.5 ? 1 : 0.55}>
								<rect x={i * pitch - tw / 2} y={-th / 2} width={tw} height={th} fill={sc.bg} stroke="#fff" strokeOpacity={i === 0 ? 0.35 : 0.12} />
								<text x={i * pitch - tw / 2 + 16} y={th / 2 - 18} fill={sc.ink} fontFamily={SERIF} fontSize={54} fontWeight={300}>
									{String(i).padStart(2, '0')}
								</text>
							</g>
						);
					})}
				</g>
				<rect x={540 - tw / 2 - 14} y={860 - th / 2 - 14} width={tw + 28} height={th + 28} fill="none" stroke={PAPER} strokeWidth={3} opacity={0.8} />
			</svg>
			<Dev at={30} style={{top: 1140, fontFamily: SERIF, fontSize: 80, lineHeight: 1.16, letterSpacing: '-0.01em'}}>
				{COPY.back[0]}
				<br />
				<span style={{fontStyle: 'italic', fontWeight: 300}}>{COPY.back[1]}</span>
			</Dev>
		</AbsoluteFill>
	);
};

/* ───────────────────────── 11 · FINAL PRINT – the sheet darkens into the Chapter 1 cover (style frame C) ───────────────────────── */

const FinalPrint: React.FC = () => {
	const f = useCurrentFrame();
	const Wd = 860;
	const H = 1080;
	const enter = p(f, 0, 30, QUART_OUT);
	return (
		<AbsoluteFill style={{opacity: enter}}>
			<Sheet x={110} y={mix(460, 430, enter)} w={Wd} h={H} rx={mix(24, 14, p(f, 0, LEN.final, IN_OUT))} rz={mix(3.5, 1.5, p(f, 0, LEN.final, IN_OUT))} shadow={0.7}>
				<svg width={Wd} height={H} viewBox={`0 0 ${Wd} ${H}`}>
					<DevelopMask id="c-dark" w={Wd} h={H} progress={1.5 * p(f, 8, 64, IN_OUT)} seed={6} scale={0.004} />
					<DevelopMask id="c-logo" w={Wd} h={H} progress={1.4 * p(f, 34, 74, IN_OUT)} seed={13} scale={0.01} />
					<DevelopMask id="c-type" w={Wd} h={H} progress={1.4 * p(f, 52, 92, IN_OUT)} seed={21} scale={0.01} />
					<DevelopMask id="c-sub" w={Wd} h={H} progress={1.4 * p(f, 70, 110, IN_OUT)} seed={5} scale={0.01} />
					<DevelopMask id="c-slot" w={Wd} h={H} progress={1.4 * p(f, 92, 126, IN_OUT)} seed={8} scale={0.01} />
					<rect width={Wd} height={H} fill={NAVY} mask="url(#c-dark)" />
					<g mask="url(#c-logo)">
						<LogoImage x={Wd / 2 - 80} y={120} w={160} variant="white" />
						<text x={Wd / 2} y={300} textAnchor="middle" fill="#fff" fontFamily={SANS} fontSize={26} letterSpacing={8.5}>
							OFFERVISIONS
						</text>
					</g>
					<g mask="url(#c-type)" fill="#fff" textAnchor="middle">
						<text x={Wd / 2} y={420} fontFamily={SANS} fontSize={24} fontWeight={500} letterSpacing={7}>
							{COPY.end.part}
						</text>
						<text x={Wd / 2} y={464} fontFamily={SERIF} fontStyle="italic" fontSize={34} fontWeight={300}>
							{COPY.end.theme}
						</text>
						<text x={Wd / 2} y={630} fontFamily={SERIF} fontSize={150} letterSpacing={-2}>
							{COPY.end.chapter}
						</text>
					</g>
					<g mask="url(#c-sub)" fill="#fff" textAnchor="middle">
						<text x={Wd / 2} y={726} fontFamily={SANS} fontSize={54} fontWeight={600}>
							{COPY.end.title}
						</text>
						<line x1={Wd / 2 - 40} y1={790} x2={Wd / 2 + 40} y2={790} stroke="#fff" strokeWidth={1.5} opacity={0.5} />
						<text x={Wd / 2} y={858} fontFamily={SERIF} fontStyle="italic" fontSize={42} fontWeight={300}>
							{COPY.end.date}
						</text>
					</g>
					<g mask="url(#c-slot)">
						<text x={Wd / 2} y={970} textAnchor="middle" fill="#fff" fontFamily={SANS} fontSize={22} fontWeight={500} letterSpacing={5}>
							{COPY.end.slot}
						</text>
					</g>
					<g mask="url(#c-dark)">
						<EdgeCode x={56} y={H - 40} text="OFFERVISIONS 2027  ▸  PART ONE  ▸  CHAPTER 01" color="#ffffff" size={15} opacity={0.5} />
					</g>
				</svg>
				<Sheen angle={112} at={mix(20, 70, p(f, 0, LEN.final, IN_OUT))} />
			</Sheet>
		</AbsoluteFill>
	);
};

/* ───────────────────────── sound (≤2 impacts per 30 s: two chimes) ───────────────────────── */

const Cue: React.FC<{readonly at: number; readonly src: string; readonly volume: number; readonly name: string}> = ({at, src, volume, name}) => (
	<Sequence from={Math.max(0, Math.round(at))} durationInFrames={90} layout="none" name={name}>
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
				volume={(fr) => 0.5 * interpolate(fr, [0, fps * 1.2, durationInFrames - fps * 2, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
			/>
			<Cue name="air" at={0} src={SFX.air} volume={0.26} />
			<Cue name="the O arrives (impact 1)" at={OB.o[1] - 10} src={SFX.chime} volume={0.3} />
			<Cue name="cover opens" at={OB.cover[0] + 4} src={SFX.pageTurn} volume={0.42} />
			{[0, 40, 80].map((d) => (
				<Cue key={d} name="pen on paper" at={OB.write + d} src={SFX.pencil} volume={0.16} />
			))}
			<Cue name="page turns" at={OB.turn[0] + 2} src={SFX.pageTurn} volume={0.5} />
			<Cue name="crop marks" at={AT.film + 106} src={SFX.pencil} volume={0.35} />
			{COPY.chapters.map((ch, i) => (
				<Cue key={ch.n} name={`grease pencil · ch${ch.n}`} at={AT.contact + CH_START + i * CH_LEN - 8} src={SFX.pencil} volume={0.22} />
			))}
			<Cue name="dodge" at={AT.double + 86} src={SFX.air} volume={0.22} />
			{[14, 42, 70].map((a, i) => (
				<Cue key={a} name={`test strip ${i + 1}`} at={AT.test + a} src={SFX.pageTurn} volume={0.22} />
			))}
			<Cue name="light sweep" at={AT.sweep + 10} src={SFX.air} volume={0.26} />
			{[14, 30, 46].map((a, i) => (
				<Cue key={a} name={`print ${i + 1}`} at={AT.wire + a} src={SFX.pageTurn} volume={0.2} />
			))}
			<Cue name="rewind" at={AT.rewind + 72} src={SFX.air} volume={0.2} />
			<Cue name="final print · logo (impact 2)" at={AT.final + 40} src={SFX.chime} volume={0.36} />
		</>
	);
};

/* ───────────────────────── composition ───────────────────────── */

const SCENE: Record<SceneKey, React.FC> = {
	opening: Opening,
	film: FilmStrip,
	contact: ContactSheet,
	question: Question,
	double: DoubleExposure,
	test: TestStrips,
	sweep: LightSweep,
	wire: DryingLine,
	rewind: Rewind,
	final: FinalPrint,
};

/** VIDEO 2 – Part One · Winter · Visualisation: "The Darkroom". */
export const WinterDarkroom: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{/* the darkroom itself, beneath every scene after the intro */}
			<AbsoluteFill style={{opacity: p(f, 0, 16)}}>
				<Room light={{x: 50, y: 50}} />
			</AbsoluteFill>
			{ORDER.map((k) => {
				const C = SCENE[k];
				return (
					<Sequence key={k} name={`${ORDER.indexOf(k)} · ${k}`} from={AT[k]} durationInFrames={LEN[k] + (k === 'opening' ? 12 : 0)}>
						<C />
					</Sequence>
				);
			})}
			<Grain seed={Math.floor(f / 2) + 100} opacity={0.05} />
			<Sound />
		</AbsoluteFill>
	);
};
