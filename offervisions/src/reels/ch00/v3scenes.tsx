import React, {useId} from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {ARRIVE, SOFT, SOFT_IN_OUT, lerp, prog, seeded} from '../kit/anim';
import {HAND} from '../kit/fonts';
import {HandSvg} from '../kit/HandSvg';
import {Learner} from '../kit/Learner';
import {Lantern} from '../kit/Objects';
import {Plant, TeaCup} from '../kit/Cozy';
import {softGlow, usePalette} from '../kit/palette';
import {PAD, SceneText, useScene} from '../kit/scene';
import {VIDEO3} from './chapter';
import type {V2SceneProps} from './v2scenes';

/** The big window the horizon line becomes, and the bridge ground. */
export const WIN = {l: 170, r: 910, top: 640, sill: 1330};
export const G = 1350;

/** Snowy night outside the window: moon, hills, a far-off lit lantern (a callback to Video 2), falling snow. */
const Outside: React.FC<{readonly t: number}> = ({t}) => {
	const {ink} = usePalette();
	const {l, r, top, sill} = WIN;
	return (
		<g>
			<path d="M 790 760 A 46 46 0 1 1 744 702 A 36 36 0 1 0 790 760 Z" fill={ink} opacity={0.9} style={{filter: softGlow(ink, 0.6)}} />
			<path d={`M ${l} ${sill - 150} Q ${l + 200} ${sill - 260} ${l + 420} ${sill - 170} T ${r} ${sill - 200}`} fill="none" stroke={ink} strokeWidth={4} opacity={0.75} />
			<path d={`M ${l} ${sill - 70} Q ${l + 300} ${sill - 150} ${r} ${sill - 90}`} fill="none" stroke={ink} strokeWidth={4} opacity={0.6} />
			<g transform={`translate(${l + 590} ${sill - 175}) scale(0.32)`}>
				<path d="M 0 0 L 0 -300 Q 0 -360 60 -360 L 110 -360" fill="none" stroke={ink} strokeWidth={12} strokeLinecap="round" />
				<Lantern x={110} y={-360} scale={1} lit={1} glow={1.2} />
			</g>
			{Array.from({length: 30}).map((_, i) => {
				const x = l + seeded(i + 2) * (r - l) + Math.sin((t + i * 21) / 25) * 10;
				const y = top + ((t * (0.9 + seeded(i + 6)) * 1.5 + seeded(i + 4) * 700) % (sill - top));
				return <circle key={i} cx={x} cy={y} r={2 + seeded(i + 8) * 3} fill={ink} opacity={0.7} />;
			})}
		</g>
	);
};

/**
 * The window with fogged glass. `fog` 0–1 = how fogged the pane is, `write` 0–1 = how much of the
 * sentence has been written (letters clear the fog), `clear` 0–1 = the fog melting away around the words.
 */
const FoggedWindow: React.FC<{readonly t: number; readonly fog: number; readonly write: number; readonly clear: number; readonly finger?: boolean}> = ({
	t,
	fog,
	write,
	clear,
	finger = false,
}) => {
	const {ink} = usePalette();
	const id = useId().replace(/:/g, '');
	const {l, r, top, sill} = WIN;
	const w = r - l;
	const h = sill - top;
	const lines = VIDEO3.glass;
	const lineY = [top + 250, top + 360];
	const total = lines.reduce((a, s) => a + s.length, 0);
	let used = 0;
	const reveal = lines.map((s) => {
		const start = used / total;
		used += s.length;
		const end = used / total;
		return Math.max(0, Math.min(1, (write - start) / (end - start)));
	});
	// Fingertip follows the end of the current line being written.
	const active = reveal.findIndex((p) => p > 0 && p < 1);
	const textW = 620;
	const fx = l + (w - textW) / 2 + textW * (active >= 0 ? reveal[active] : 0);
	const fy = lineY[Math.max(0, active)] - 20;
	return (
		<g>
			<defs>
				<clipPath id={`glass-${id}`}>
					<rect x={l + 4} y={top + 4} width={w - 8} height={h - 8} />
				</clipPath>
				<mask id={`fog-${id}`} maskUnits="userSpaceOnUse" x={l} y={top} width={w} height={h}>
					<rect x={l} y={top} width={w} height={h} fill="white" />
					{lines.map((s, i) => (
						<g key={s}>
							<clipPath id={`wr-${id}-${i}`}>
								<rect x={l} y={lineY[i] - 90} width={(w - textW) / 2 + textW * reveal[i] + 4} height={120} />
							</clipPath>
							<text x={l + w / 2} y={lineY[i]} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={92} fill="black" stroke="black" strokeWidth={10} clipPath={`url(#wr-${id}-${i})`}>
								{s}
							</text>
						</g>
					))}
					<ellipse cx={l + w / 2} cy={top + 300} rx={60 + clear * 520} ry={40 + clear * 420} fill="black" opacity={clear} style={{filter: 'blur(40px)'}} />
				</mask>
			</defs>
			<g clipPath={`url(#glass-${id})`}>
				<Outside t={t} />
				<g mask={`url(#fog-${id})`} opacity={fog}>
					<rect x={l} y={top} width={w} height={h} fill={ink} opacity={0.3} />
					{Array.from({length: 220}).map((_, i) => (
						<circle key={i} cx={l + seeded(i + 50) * w} cy={top + seeded(i + 90) * h} r={1.5 + seeded(i + 13) * 4} fill={ink} opacity={0.35} />
					))}
				</g>
			</g>
			{/* the finger marks stay readable once the fog thins */}
			{clear > 0
				? lines.map((line, i) => (
						<text
							key={line}
							x={l + w / 2}
							y={lineY[i]}
							textAnchor="middle"
							fontFamily={HAND}
							fontWeight={700}
							fontSize={92}
							fill="none"
							stroke={ink}
							strokeWidth={3}
							opacity={Math.min(1, clear * 1.4) * 0.9}
							style={{filter: softGlow(ink, 0.5)}}
						>
							{line}
						</text>
					))
				: null}
			{finger && active >= 0 ? <circle cx={fx} cy={fy} r={13} fill={ink} style={{filter: softGlow(ink, 1.2)}} /> : null}
			{/* window cross-bar at the top, and the sill shelf */}
			<line x1={l} y1={top + 110} x2={r} y2={top + 110} stroke={ink} strokeWidth={4} opacity={0.8} />
			<line x1={l - 30} y1={WIN.sill} x2={r + 30} y2={WIN.sill} stroke={ink} strokeWidth={5} strokeLinecap="round" />
		</g>
	);
};

const Room: React.FC<{readonly t: number}> = () => (
	<>
		<Plant x={985} y={WIN.sill} scale={0.75} />
		<TeaCup x={830} y={WIN.sill} scale={0.55} />
	</>
);

export const BreatheScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const {ink} = usePalette();
	const fog = prog(t, 8, 70, SOFT);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<FoggedWindow t={t} fog={fog} write={0} clear={0} />
				<Room t={t} />
				{/* breath puffs drifting from the learner to the glass */}
				{[0, 1, 2].map((i) => {
					const p = prog(t, 6 + i * 16, 40 + i * 16);
					return <ellipse key={i} cx={lerp(330, 470, p)} cy={lerp(1110, 1000, p)} rx={18 + p * 40} ry={10 + p * 22} fill={ink} opacity={0.35 * Math.sin(Math.PI * p)} style={{filter: 'blur(6px)'}} />;
				})}
				<Learner x={260} y={WIN.sill} scale={0.72} tilt={-10} bookGlow={0.2} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const WriteScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<FoggedWindow t={t + 120} fog={1} write={prog(t, 10, dur - 14, (x) => x)} clear={0} finger />
				<Room t={t} />
				<Learner x={260} y={WIN.sill} scale={0.72} tilt={-10} raise={0.3} bookGlow={0.2} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

/** Frame inside the clear scene where the view opens (chime). */
export const CLEAR_AT = 20;

export const ClearScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const clear = prog(t, CLEAR_AT - 10, Math.min(dur - 4, CLEAR_AT + 70), SOFT_IN_OUT);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<FoggedWindow t={t + 270} fog={1 - clear * 0.55} write={1} clear={clear} />
				<Room t={t} />
				<Learner x={260} y={WIN.sill} scale={0.72} tilt={interpolate(clear, [0, 1], [-10, -16])} bookGlow={0.3 + clear * 0.5} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

export const CopyScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const {ink, bg} = usePalette();
	const note = prog(t, 4, 18, ARRIVE);
	const lines = VIDEO3.glass;
	const written = prog(t, 14, 70, (x) => x);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				<FoggedWindow t={t + 400} fog={0.45} write={1} clear={1} />
				<Room t={t} />
				<g transform={`translate(700 1180) rotate(-4) scale(${0.85 + 0.15 * note})`} opacity={note} style={{filter: softGlow(ink, 0.5 + written * 0.5)}}>
					<path d="M -120 -90 L 120 -90 L 120 60 L 96 90 L -120 90 Z" fill={bg} stroke={ink} strokeWidth={4.5} strokeLinejoin="round" />
					<path d="M 120 60 L 96 60 L 96 90" fill="none" stroke={ink} strokeWidth={3.5} />
					{lines.map((s, i) => (
						<text key={s} x={-100} y={-26 + i * 54} fontFamily={HAND} fontWeight={700} fontSize={34} fill={ink}>
							{s.slice(0, Math.floor(s.length * Math.max(0, Math.min(1, written * 2 - i))))}
						</text>
					))}
				</g>
				<Learner x={260} y={WIN.sill} scale={0.72} tilt={-6} bookGlow={0.5} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};

/** y of the bridge deck at x (matches the horizon-line shape in Video3.tsx). */
export const bridgeY = (x: number) => {
	if (x <= 260 || x >= 820) return G;
	const u = (x - 260) / 560;
	return G - 150 * Math.sin(Math.PI * u);
};

export const BridgeScene: React.FC<V2SceneProps> = ({dur, scene}) => {
	const {t, fade} = useScene(dur);
	const {ink} = usePalette();
	const walk = prog(t, 0, dur - 8, SOFT_IN_OUT);
	const lx = lerp(140, 860, walk);
	const posts = prog(t, -PAD, 20);
	return (
		<AbsoluteFill style={{opacity: fade}}>
			<HandSvg>
				{/* railing posts + handrail following the deck */}
				<g stroke={ink} strokeWidth={4} strokeLinecap="round" opacity={posts}>
					{[330, 400, 470, 540, 610, 680, 750].map((x) => (
						<line key={x} x1={x} y1={bridgeY(x)} x2={x} y2={bridgeY(x) - 70} />
					))}
					<path d={`M 300 ${bridgeY(300) - 70} Q 540 ${G - 337} 780 ${bridgeY(780) - 70}`} fill="none" />
				</g>
				<Learner x={lx} y={bridgeY(lx)} scale={0.62} walk={walk > 0 && walk < 1 ? t / 4 : undefined} bookGlow={0.8} />
			</HandSvg>
			<SceneText scene={scene} dur={dur} />
		</AbsoluteFill>
	);
};
