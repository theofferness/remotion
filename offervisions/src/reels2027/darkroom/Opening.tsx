import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, Img, staticFile, useCurrentFrame} from 'remotion';
import {SANS, SERIF} from '../../editorial/fonts';
import {EXPO_OUT, IN, IN_OUT, mix, p, QUART_OUT} from '../../editorial/motion';
import {RATIO} from '../../editorial/Logo';
import {Grain, INK_ON_PAPER, NAVY, PAPER} from './Darkroom';

/*
 * THE OPENING – one continuous shot:
 *   1. the hand rises, offering, and the O lifts out of it into place (openness);
 *   2. the camera pulls back: the logo is on the cover of a book; the cover opens;
 *   3. the first page is written, letter by letter;
 *   4. the page turns – a real, curling page – into Chapter 1.
 * The logo is the supplied artwork split along its own gap into its two pieces (public/brand/parts), never redrawn.
 */

export const OPENING_COPY = {
	motto: 'Be visionary.',
	page: ['The first', 'page', 'isn’t about', 'fixing anything.'],
	chapter: {part: 'PART ONE · WINTER', theme: 'Visualisation', chapter: 'Chapter 1', title: 'Letting Go of Resolutions', line: ['Seeing clearly', 'who we want to become.'], months: 'JANUARY – FEBRUARY'},
};

/** Beats (frames @30 fps). */
export const OB = {
	hand: [4, 48],
	o: [24, 74],
	motto: 64,
	pullBack: [100, 136],
	cover: [130, 176],
	write: 182,
	turn: [334, 384],
	handoff: [472, 496],
} as const;
export const OPENING_LEN = 484; // the next scene starts here; the opening keeps 12 frames of tail to dissolve into it

/* geometry (screen px). The book is centred on (540, 930). */
const PW = 720;
const PH = 1000;
const PX = 180;
const PY = 430;
const CW = 732;
const CH = 1012;
const CX = 174;
const CY = 424;
const ORIGIN = '540px 930px';

/* ───────────────────────── handwriting ───────────────────────── */

type Line = {readonly text: string; readonly center?: boolean; readonly x: number; readonly y: number; readonly size: number; readonly italic?: boolean; readonly weight?: number; readonly ls?: number};

/** Glyph advance positions, measured in the real font once it has loaded. */
/** True once the real Literata face for this style has been added and loaded (never measure the fallback font). */
const literataReady = (italic: boolean) =>
	typeof document !== 'undefined' && Array.from(document.fonts).some((ff) => ff.family.replace(/["']/g, '') === 'Literata' && ff.style === (italic ? 'italic' : 'normal') && ff.status === 'loaded');

const useGlyphX = (lines: readonly Line[]) => {
	const [, rerender] = useState(0);
	const ok = lines.every((l) => literataReady(Boolean(l.italic)));
	useEffect(() => {
		if (ok) return;
		const handle = delayRender('Waiting for Literata before measuring handwriting');
		const id = setInterval(() => {
			if (lines.every((l) => literataReady(Boolean(l.italic)))) {
				clearInterval(id);
				rerender((n) => n + 1);
				continueRender(handle);
			}
		}, 30);
		return () => clearInterval(id);
	}, [ok, lines]);
	if (!ok) return null;
	// measured fresh on every render, always in the real font
	const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D & {letterSpacing?: string};
	return lines.map((l) => {
		ctx.font = `${l.italic ? 'italic ' : ''}${l.weight ?? 400} ${l.size}px Literata`;
		ctx.letterSpacing = `${l.ls ?? 0}px`;
		const xs = [0];
		for (let i = 1; i <= l.text.length; i++) xs.push(ctx.measureText(l.text.slice(0, i)).width);
		return xs;
	});
};

/** Pen timing: every letter takes time in proportion to its width; the pen lifts between words and lines. */
const schedule = (lines: readonly Line[], xs: number[][], start: number, speed: number) => {
	let t = start;
	return lines.map((l, li) => {
		const times: number[] = [];
		for (let i = 0; i < l.text.length; i++) {
			times.push(t);
			const ch = l.text[i];
			t += ch === ' ' ? 4 : Math.max(1.4, (xs[li][i + 1] - xs[li][i]) / (l.size * speed));
		}
		times.push(t);
		t += 8; // pen moves to the next line
		return times;
	});
};

const sineInOut = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);

/** Text written onto the page: a feathered nib edge follows the pen, the outline runs a hair ahead of the ink. */
const textProps = (l: Line, x0: number) => ({x: x0, y: l.y, fontFamily: SERIF, fontSize: l.size, fontStyle: l.italic ? 'italic' : 'normal', fontWeight: l.weight ?? 400, letterSpacing: l.ls ?? 0});

type WrittenProps = {readonly id: string; readonly lines: readonly Line[]; readonly start: number; readonly color: string; readonly speed?: number; readonly done?: boolean; readonly outline?: boolean; readonly feather?: number};

const Written: React.FC<WrittenProps> = (props) =>
	props.done ? (
		<g fill={props.color}>
			{props.lines.map((l) => (
				<text key={l.text} {...textProps(l, l.x)} textAnchor={l.center ? 'middle' : 'start'}>
					{l.text}
				</text>
			))}
		</g>
	) : (
		<LiveWritten {...props} />
	);

const LiveWritten: React.FC<WrittenProps> = ({id, lines, start, color, speed = 0.24, outline = true, feather: featherK = 0.16}) => {
	const f = useCurrentFrame();
	const xs = useGlyphX(lines);
	if (!xs) return null;
	const times = schedule(lines, xs, start, speed);
	return (
		<g>
			{lines.map((l0, li) => {
				const ts = times[li];
				const x = xs[li];
				const n = l0.text.length;
				const l = {...l0, x: l0.center ? l0.x - x[n] / 2 : l0.x};
				let rx: number;
				if (f < ts[0]) rx = -l.size * 0.5;
				else if (f >= ts[n]) rx = x[n] + l.size;
				else {
					let i = 0;
					while (i < n - 1 && f >= ts[i + 1]) i++;
					const k = sineInOut(Math.min(1, (f - ts[i]) / (ts[i + 1] - ts[i])));
					rx = x[i] + (x[i + 1] - x[i]) * k;
				}
				const feather = l.size * featherK;
				const lead = l.size * 0.1;
				const box = {x: l.x - l.size * 0.4, y: l.y - l.size * 1.1, width: x[n] + l.size * 1.4, height: l.size * 1.6};
				const mask = (suffix: string, edge: number) => (
					<>
						<linearGradient id={`${id}${li}${suffix}g`} gradientUnits="userSpaceOnUse" x1={l.x + edge} x2={l.x + edge + feather} y1={0} y2={0}>
							<stop offset={0} stopColor="#fff" />
							<stop offset={1} stopColor="#fff" stopOpacity={0} />
						</linearGradient>
						<mask id={`${id}${li}${suffix}`} maskUnits="userSpaceOnUse" {...box}>
							<rect {...box} fill={`url(#${id}${li}${suffix}g)`} />
						</mask>
					</>
				);
				return (
					<g key={l.text}>
						<defs>
							{mask('f', rx)}
							{mask('s', rx + lead)}
						</defs>
						{outline ? <text {...textProps(l, l.x)} fill="none" stroke={color} strokeWidth={Math.max(0.6, l.size / 110)} opacity={0.55} mask={`url(#${id}${li}s)`}>
							{l.text}
						</text> : null}
						<text {...textProps(l, l.x)} fill={color} mask={`url(#${id}${li}f)`}>
							{l.text}
						</text>
					</g>
				);
			})}
		</g>
	);
};

/* ───────────────────────── the pages ───────────────────────── */

const MOTTO_LINE: readonly Line[] = [{text: OPENING_COPY.motto, center: true, x: CW / 2, y: 532, size: 28, italic: true, weight: 300}];
const PAGE_LINES: readonly Line[] = [
	{text: OPENING_COPY.page[0], x: 72, y: 362, size: 120, ls: -2},
	{text: OPENING_COPY.page[1], x: 72, y: 488, size: 120, ls: -2},
	{text: OPENING_COPY.page[2], x: 72, y: 622, size: 80, italic: true, weight: 300},
	{text: OPENING_COPY.page[3], x: 72, y: 714, size: 80, italic: true, weight: 300},
];

/** Gutter shading: pages darken softly toward the spine. */
const Gutter: React.FC<{readonly side: 'left' | 'right'; readonly strength?: number}> = ({side, strength = 0.16}) => (
	<div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(${side === 'right' ? 90 : 270}deg, rgba(10,14,34,${strength}) 0px, rgba(10,14,34,${strength * 0.3}) 26px, transparent 70px)`}} />
);

/** Page 1 – printed furniture plus the written lines. */
const FirstPage: React.FC<{readonly written: 'live' | 'done'; readonly idPrefix?: string}> = ({written, idPrefix = 'pg'}) => (
	<div style={{position: 'absolute', inset: 0, background: PAPER}}>
		<svg width={PW} height={PH} viewBox={`0 0 ${PW} ${PH}`} style={{position: 'absolute', inset: 0}}>
			<g fontFamily={SANS} fontWeight={600} fontSize={14} letterSpacing={3.2} fill={INK_ON_PAPER} opacity={0.62}>
				<text x={72} y={84}>
					OFFERVISIONS 2027
				</text>
				<text x={PW - 72} y={84} textAnchor="end">
					PART ONE · WINTER
				</text>
			</g>
			<line x1={72} y1={106} x2={PW - 72} y2={106} stroke={INK_ON_PAPER} strokeWidth={1} opacity={0.18} />
			<Written id={idPrefix} lines={PAGE_LINES} start={OB.write} color={INK_ON_PAPER} done={written === 'done'} />
			<text x={PW / 2} y={PH - 54} textAnchor="middle" fill={INK_ON_PAPER} opacity={0.5} fontFamily={SERIF} fontSize={22}>
				1
			</text>
		</svg>
		<Gutter side="right" />
	</div>
);

/** The back of page 1: blank paper with the faint show-through of the ink. */
const FirstPageBack: React.FC = () => (
	<div style={{position: 'absolute', inset: 0, background: '#efede6'}}>
		<div style={{position: 'absolute', inset: 0, transform: 'scaleX(-1)', opacity: 0.025}}>
			<svg width={PW} height={PH} viewBox={`0 0 ${PW} ${PH}`}>
				<Written id="pgb" lines={PAGE_LINES} start={0} color={INK_ON_PAPER} done />
			</svg>
		</div>
		<Gutter side="left" />
	</div>
);

/** Chapter 1 – a navy part-opener, set like the covers. */
const ChapterPage: React.FC = () => {
	const c = OPENING_COPY.chapter;
	return (
		<div style={{position: 'absolute', inset: 0, background: NAVY, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 38%, rgba(255,255,255,0.06), transparent 70%)'}} />
			<svg width={PW} height={PH} viewBox={`0 0 ${PW} ${PH}`} style={{position: 'absolute', inset: 0}}>
				<image href={staticFile('brand/offervisions-logo-white.png')} x={PW / 2 - 56} y={100} width={112} height={112 * RATIO} />
				<g fill="#fff" textAnchor="middle">
					<text x={PW / 2} y={250} fontFamily={SANS} fontSize={18} letterSpacing={6.5}>
						OFFERVISIONS
					</text>
					<text x={PW / 2} y={366} fontFamily={SANS} fontSize={19} fontWeight={500} letterSpacing={5.5}>
						{c.part}
					</text>
					<text x={PW / 2} y={404} fontFamily={SERIF} fontStyle="italic" fontSize={28} fontWeight={300}>
						{c.theme}
					</text>
					<text x={PW / 2} y={548} fontFamily={SERIF} fontSize={124} letterSpacing={-2}>
						{c.chapter}
					</text>
					<text x={PW / 2} y={628} fontFamily={SANS} fontSize={42} fontWeight={600}>
						{c.title}
					</text>
					<line x1={PW / 2 - 34} y1={684} x2={PW / 2 + 34} y2={684} stroke="#fff" strokeWidth={1.4} opacity={0.5} />
					<text x={PW / 2} y={758} fontFamily={SERIF} fontStyle="italic" fontSize={38} fontWeight={300}>
						{c.line[0]}
					</text>
					<text x={PW / 2} y={806} fontFamily={SERIF} fontStyle="italic" fontSize={38} fontWeight={300}>
						{c.line[1]}
					</text>
					<text x={PW / 2} y={930} fontFamily={SANS} fontSize={16} fontWeight={500} letterSpacing={4.5} opacity={0.7}>
						{c.months}
					</text>
				</g>
			</svg>
			<Gutter side="right" strength={0.35} />
		</div>
	);
};

/* ───────────────────────── the cover with the logo ───────────────────────── */

const LW = 190;
const LH = LW * RATIO;
const LX = CW / 2 - LW / 2;
const LY = 380 - LH / 2;

const CoverFront: React.FC<{readonly still?: boolean}> = ({still = false}) => {
	const cf = useCurrentFrame();
	const f = still ? 0 : cf; // `still` = the cover exactly as the video's first frame shows it
	const hand = p(f, OB.hand[0], OB.hand[1], EXPO_OUT);
	const handIn = p(f, OB.hand[0], OB.hand[0] + 22, QUART_OUT);
	const o = p(f, OB.o[0], OB.o[1], IN_OUT);
	const oIn = p(f, OB.o[0], OB.o[0] + 26, QUART_OUT);
	const settle = p(f, OB.o[1] - 16, OB.o[1] + 26, QUART_OUT);
	const glow = oIn * (1 - p(f, OB.o[1], OB.o[1] + 50, IN_OUT) * 0.6);
	const wordmark = p(f, OB.pullBack[0] + 6, OB.pullBack[1], QUART_OUT);
	return (
		<div style={{position: 'absolute', inset: 0, background: NAVY, overflow: 'hidden'}}>
			{/* light falling on the cloth */}
			<div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle 420px at 50% ${(380 / CH) * 100}%, rgba(255,255,255,${0.035 + 0.05 * handIn}), transparent 72%)`}} />
			<Grain seed={21} opacity={0.07} />
			<div style={{position: 'absolute', left: LX, top: LY, width: LW, height: LH}}>
				{/* openness: a soft bloom where the O arrives */}
				<div style={{position: 'absolute', left: 0.589 * LW - 130, top: 0.40 * LH - 130, width: 260, height: 260, borderRadius: 130, background: 'radial-gradient(circle, rgba(170,190,255,0.22), transparent 68%)', opacity: glow, transform: `scale(${mix(0.6, 1.15, o)})`}} />
				{/* the hand rises, offering */}
				<Img
					src={staticFile('brand/parts/logo-white-hand.png')}
					style={{position: 'absolute', inset: 0, width: '100%', opacity: handIn, transformOrigin: '8% 90%', transform: `translateY(${(1 - hand) * 46}px) rotate(${(1 - hand) * -6}deg)`, filter: `blur(${(1 - handIn) * 3}px)`}}
				/>
				{/* the O lifts out of the hand into its place above it */}
				<Img
					src={staticFile('brand/parts/logo-white-o.png')}
					style={{
						position: 'absolute',
						inset: 0,
						width: '100%',
						opacity: oIn,
						transformOrigin: '58.9% 40%',
						transform: `translate(${(1 - o) * -4}px, ${(1 - o) * 30 - Math.sin(Math.PI * settle) * 1.5}px) scale(${mix(0.74, 1, o)})`,
						filter: `blur(${(1 - oIn) * 4}px)`,
					}}
				/>
			</div>
			<svg width={CW} height={CH} style={{position: 'absolute', inset: 0}}>
				<g opacity={0.82}>
					{still ? null : <Written id="motto" lines={MOTTO_LINE} start={OB.motto} color="#ffffff" speed={0.11} outline={false} feather={0.5} />}
				</g>
				<text x={CW / 2} y={CH - 92} textAnchor="middle" fill="#fff" opacity={0.75 * wordmark} fontFamily={SANS} fontSize={17} letterSpacing={7}>
					OFFERVISIONS
				</text>
				<text x={CW / 2} y={CH - 62} textAnchor="middle" fill="#fff" opacity={0.45 * wordmark} fontFamily={SANS} fontSize={13} letterSpacing={5}>
					2027
				</text>
			</svg>
			{/* the cloth's edge catching light */}
			<div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), inset 14px 0 18px -10px rgba(0,0,0,0.5)'}} />
		</div>
	);
};

const CoverInside: React.FC = () => (
	<div style={{position: 'absolute', inset: 0, background: '#10152d'}}>
		<div style={{position: 'absolute', inset: 14, border: '1px solid rgba(255,255,255,0.07)'}} />
		<Grain seed={33} opacity={0.05} />
		<Gutter side="left" strength={0.4} />
	</div>
);

/* ───────────────────────── 3D page with a real curl ───────────────────────── */

/**
 * A leaf hinged on its left edge, built from vertical strips: each strip is rotated a little more than the one
 * before, so the free edge leads and the paper bends. Front and back faces are lit by their angle.
 */
const Leaf: React.FC<{
	readonly theta: number;
	readonly bend: number;
	readonly strips: number;
	readonly w: number;
	readonly h: number;
	readonly front: React.ReactNode;
	readonly back: React.ReactNode;
}> = ({theta, bend, strips, w, h, front, back}) => {
	const sw = w / strips;
	const OV = strips > 1 ? 3 : 0; // strips overlap so no hairline seams show
	const build = (i: number): React.ReactNode => {
		if (i >= strips) return null;
		const angle = theta + i * bend; // this strip's angle from flat
		const frontShade = 0.42 * Math.min(1, Math.max(0, angle / 165));
		const backShade = 0.38 * Math.min(1, Math.max(0, (180 - angle) / 165));
		const curlLight = strips > 1 ? 0.1 * Math.sin((Math.PI * Math.min(180, angle)) / 180) * (i / strips) : 0;
		return (
			<div key={i} style={{position: 'absolute', left: i === 0 ? 0 : sw, top: 0, width: sw, height: h, transformOrigin: '0 50%', transform: `rotateY(${-(i === 0 ? theta : bend)}deg)`, transformStyle: 'preserve-3d'}}>
				<div style={{position: 'absolute', left: -OV, top: 0, width: sw + 2 * OV, height: h, overflow: 'hidden', backfaceVisibility: 'hidden'}}>
					<div style={{position: 'absolute', left: -i * sw + OV, top: 0, width: w, height: h}}>{front}</div>
					<div style={{position: 'absolute', inset: 0, background: `rgba(8,11,28,${frontShade})`}} />
					<div style={{position: 'absolute', inset: 0, background: `rgba(255,255,255,${curlLight})`}} />
				</div>
				<div style={{position: 'absolute', left: -OV, top: 0, width: sw + 2 * OV, height: h, overflow: 'hidden', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>
					<div style={{position: 'absolute', left: -(w - (i + 1) * sw) + OV, top: 0, width: w, height: h}}>{back}</div>
					<div style={{position: 'absolute', inset: 0, background: `rgba(8,11,28,${backShade})`}} />
				</div>
				{build(i + 1)}
			</div>
		);
	};
	return <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d'}}>{build(0)}</div>;
};

/** Each leaf gets its own 3D context, so leaves stack in DOM order instead of z-fighting when they lie flat. */
const Stage: React.FC<{readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly children: React.ReactNode}> = ({x, y, w, h, children}) => (
	<div style={{position: 'absolute', inset: 0, perspective: 2600, perspectiveOrigin: ORIGIN}}>
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, transformStyle: 'preserve-3d'}}>{children}</div>
	</div>
);

/* ───────────────────────── the shot ───────────────────────── */

export const Opening: React.FC = () => {
	const f = useCurrentFrame();

	// camera: starts close on the cover, pulls back to the book, leans in to read, eases out for the turn
	const pull = p(f, OB.pullBack[0], OB.pullBack[1], IN_OUT);
	const lean = p(f, OB.cover[1], OB.cover[1] + 90, IN_OUT);
	const ease = p(f, OB.turn[0] - 30, OB.turn[0] + 10, IN_OUT);
	const read = p(f, OB.turn[1] - 6, OB.turn[1] + 100, IN_OUT);
	const hand = p(f, OB.handoff[0], OB.handoff[1], IN_OUT);
	let S = mix(2, 1, pull);
	S = mix(S, 1.05, lean);
	S = mix(S, 1.0, ease);
	S = mix(S, 1.07, read);
	S = mix(S, 0.44, hand);
	const fadeOut = p(f, OPENING_LEN - 2, OPENING_LEN + 12, IN);

	const cover = p(f, OB.cover[0], OB.cover[1], IN_OUT);
	const coverTheta = 180 * cover;
	const turnT = p(f, OB.turn[0], OB.turn[1], IN_OUT);
	const turnTheta = 180 * turnT;
	const turnBend = 5.2 * Math.sin(Math.PI * turnT) * (1 - turnT * 0.35);
	const turning = f >= OB.turn[0];
	const coverDone = f >= OB.cover[1];

	// the turning leaf's shadow on the page underneath
	const outer = Math.min(90, turnTheta + 9 * turnBend);
	const edge = PW * Math.cos((outer * Math.PI) / 180);
	const shadowA = 0.55 * Math.sin(Math.PI * turnT);

	const coverStage = (
		<Stage key="cover" x={CX} y={CY} w={CW} h={CH}>
			<Leaf theta={coverTheta} bend={0} strips={1} w={CW} h={CH} front={<CoverFront />} back={<CoverInside />} />
		</Stage>
	);
	const pageStage = (
		<Stage key="page" x={PX} y={PY} w={PW} h={PH}>
			{turning ? (
				<Leaf theta={turnTheta} bend={turnBend} strips={10} w={PW} h={PH} front={<FirstPage written="done" />} back={<FirstPageBack />} />
			) : (
				<FirstPage written="live" />
			)}
		</Stage>
	);

	return (
		<AbsoluteFill style={{opacity: 1 - fadeOut}}>
			<div style={{position: 'absolute', inset: 0, transformOrigin: ORIGIN, transform: `translateY(${hand * 30}px) scale(${S})`}}>
				{/* the book's shadow on the table */}
				<div style={{position: 'absolute', left: CX + (cover > 0.5 ? -CW * cover : 0), top: CY + 30, width: CW * (1 + cover), height: CH, background: 'rgba(0,0,0,0.55)', filter: 'blur(44px)', opacity: pull}} />
				{/* page block edges */}
				{[6, 4, 2].map((o) => (
					<div key={o} style={{position: 'absolute', left: PX + o, top: PY + o, width: PW, height: PH, background: o === 6 ? '#cfccc3' : '#e4e1d9', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.12)'}} />
				))}
				{/* page 2: Chapter 1 */}
				<div style={{position: 'absolute', left: PX, top: PY, width: PW, height: PH}}>
					<ChapterPage />
					<div style={{position: 'absolute', inset: 0, opacity: turning ? 1 : 0, background: `linear-gradient(90deg, rgba(0,0,0,${shadowA * 0.5}) 0px, rgba(0,0,0,${shadowA}) ${Math.max(0, edge - 30)}px, rgba(0,0,0,0) ${Math.max(0, edge) + 120}px)`}} />
				</div>
				{/* closed: the cover lies over page 1; once open, page 1 turns over on top of the open cover */}
				{coverDone ? [coverStage, pageStage] : [pageStage, coverStage]}
			</div>
		</AbsoluteFill>
	);
};

/**
 * The first frame of the video, re-usable: the camera close on the navy cover, before the hand rises.
 * The last scene dissolves into this, so the Reel loops seamlessly.
 */
export const LoopFrame: React.FC = () => (
	<AbsoluteFill>
		<div style={{position: 'absolute', inset: 0, transformOrigin: ORIGIN, transform: 'scale(2)'}}>
			<div style={{position: 'absolute', left: CX, top: CY, width: CW, height: CH}}>
				<CoverFront still />
			</div>
		</div>
	</AbsoluteFill>
);
