import React from 'react';
import {useCurrentFrame} from 'remotion';
import {HAND} from './fonts';
import {softGlow, usePalette} from './palette';

type Base = {readonly x: number; readonly y: number; readonly scale?: number; readonly glow?: number; readonly opacity?: number; readonly rotate?: number};

const useInk = () => {
	const {ink, bg} = usePalette();
	return {ink, bg, s: {stroke: ink, strokeWidth: 4.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const}};
};

const Wrap: React.FC<Base & {readonly children: React.ReactNode}> = ({x, y, scale = 1, glow = 0, opacity = 1, rotate = 0, children}) => {
	const {ink} = usePalette();
	return (
		<g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity} style={glow > 0 ? {filter: softGlow(ink, glow)} : undefined}>
			{children}
		</g>
	);
};

/** Hanging lantern; (x, y) = the hook it hangs from. `lit` 0–1 lights the flame. */
export const Lantern: React.FC<Base & {readonly lit?: number}> = ({lit = 1, ...p}) => {
	const frame = useCurrentFrame();
	const {ink, bg, s} = useInk();
	const flick = 1 + 0.07 * Math.sin(frame / 3.2) + 0.04 * Math.sin(frame / 1.9);
	const sway = Math.sin(frame / 34) * 2.5;
	return (
		<Wrap {...p} rotate={(p.rotate ?? 0) + sway}>
			<defs>
				<radialGradient id="lanternHalo">
					<stop offset="0%" stopColor={ink} stopOpacity={0.35 * lit} />
					<stop offset="100%" stopColor={ink} stopOpacity={0} />
				</radialGradient>
			</defs>
			<circle cx={0} cy={110} r={230} fill="url(#lanternHalo)" />
			<line x1={0} y1={0} x2={0} y2={26} {...s} strokeWidth={3} />
			<circle cx={0} cy={34} r={9} fill="none" {...s} strokeWidth={3.5} />
			<path d="M -36 70 L -20 44 L 20 44 L 36 70 Z" fill={bg} {...s} />
			<rect x={-38} y={70} width={76} height={92} rx={8} fill={bg} {...s} />
			<line x1={-14} y1={74} x2={-14} y2={158} {...s} strokeWidth={2.5} opacity={0.5} />
			<line x1={14} y1={74} x2={14} y2={158} {...s} strokeWidth={2.5} opacity={0.5} />
			<path d="M -44 162 L 44 162 L 34 178 L -34 178 Z" fill={bg} {...s} />
			<g transform={`translate(0 140) scale(${flick * (0.4 + 0.6 * lit)})`} opacity={0.25 + 0.75 * lit} style={{filter: softGlow(ink, 1.6 * lit)}}>
				<path d="M 0 -46 C 16 -24, 15 -4, 0 0 C -15 -4, -16 -24, 0 -46 Z" fill={ink} />
			</g>
		</Wrap>
	);
};

/** A sticky note with a scribble. (x, y) = centre. */
export const StickyNote: React.FC<Base & {readonly seed?: number}> = ({seed = 0, ...p}) => {
	const {bg, s} = useInk();
	const w1 = 34 + ((seed * 13) % 26);
	return (
		<Wrap {...p}>
			<path d="M -45 -45 L 45 -45 L 45 30 L 30 45 L -45 45 Z" fill={bg} {...s} strokeWidth={3.5} />
			<path d="M 45 30 L 30 30 L 30 45" fill="none" {...s} strokeWidth={3} />
			<line x1={-28} y1={-18} x2={-28 + w1} y2={-18} {...s} strokeWidth={3} opacity={0.75} />
			<line x1={-28} y1={6} x2={-28 + 50 - (seed % 3) * 10} y2={6} {...s} strokeWidth={3} opacity={0.75} />
		</Wrap>
	);
};

/** Clipboard checklist. `ticked` 0–rows ticks rows progressively. (x, y) = bottom centre. */
export const Clipboard: React.FC<Base & {readonly rows?: string[]; readonly ticked?: number}> = ({rows = [], ticked = 0, ...p}) => {
	const {ink, bg, s} = useInk();
	return (
		<Wrap {...p}>
			<rect x={-120} y={-330} width={240} height={330} rx={14} fill={bg} {...s} />
			<rect x={-50} y={-346} width={100} height={34} rx={8} fill={bg} {...s} />
			{rows.map((r, i) => {
				const y = -260 + i * 70;
				const t = Math.max(0, Math.min(1, ticked - i));
				return (
					<g key={i}>
						<rect x={-92} y={y - 20} width={34} height={34} rx={6} fill="none" {...s} strokeWidth={3.5} />
						<path d={`M ${-86} ${y - 2} L ${-77} ${y + 8} L ${-62} ${y - 12}`} fill="none" {...s} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
						<text x={-44} y={y + 8} fontFamily={HAND} fontWeight={700} fontSize={36} fill={ink}>
							{r}
						</text>
					</g>
				);
			})}
		</Wrap>
	);
};

export const Stone: React.FC<Base> = (p) => {
	const {bg, s} = useInk();
	return (
		<Wrap {...p}>
			<path d="M -60 0 C -70 -40, -30 -70, 10 -66 C 50 -62, 72 -34, 62 -4 Q 0 8 -60 0 Z" fill={bg} {...s} />
			<path d="M -24 -40 Q -8 -50 12 -46" fill="none" {...s} strokeWidth={3} opacity={0.6} />
		</Wrap>
	);
};

export const PencilIcon: React.FC<Base> = (p) => {
	const {bg, s} = useInk();
	return (
		<Wrap {...p}>
			<g transform="rotate(-40)">
				<rect x={-12} y={-90} width={24} height={110} rx={4} fill={bg} {...s} />
				<path d="M -12 20 L 0 46 L 12 20 Z" fill={bg} {...s} />
				<line x1={-12} y1={-70} x2={12} y2={-70} {...s} strokeWidth={3} />
			</g>
		</Wrap>
	);
};

export const Kettle: React.FC<Base> = (p) => {
	const frame = useCurrentFrame();
	const {bg, s} = useInk();
	return (
		<Wrap {...p}>
			<path d="M -60 0 L -52 -90 Q 0 -112 52 -90 L 60 0 Z" fill={bg} {...s} />
			<path d="M -36 -102 Q 0 -150 36 -102" fill="none" {...s} />
			<path d="M 56 -70 L 92 -96 L 96 -88 L 62 -40" fill={bg} {...s} />
			<path d={`M 96 -104 C 90 -124, 108 -134, 100 -${154 + Math.sin(frame / 10) * 6}`} fill="none" {...s} strokeWidth={3} opacity={0.6} />
		</Wrap>
	);
};

/** Envelope whose flap opens (0–1) and card slides up (0–1). (x, y) = bottom centre. */
export const Envelope: React.FC<Base & {readonly open?: number; readonly card?: number; readonly text?: string}> = ({open = 0, card = 0, text = '', ...p}) => {
	const {ink, bg, s} = useInk();
	const flapY = -220 + 220 * 0; // envelope top edge
	const flipped = open > 0.5;
	const k = Math.abs(Math.cos(Math.PI * open));
	return (
		<Wrap {...p}>
			{flipped ? <path d={`M -170 ${flapY} L 0 ${flapY - 130 * k} L 170 ${flapY}`} fill={bg} {...s} /> : null}
			<g transform={`translate(0 ${-card * 200})`}>
				<rect x={-140} y={-200} width={280} height={190} rx={10} fill={bg} {...s} style={{filter: softGlow(ink, 0.6 * card)}} />
				<text x={0} y={-108} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={50} fill={ink} opacity={card}>
					{text}
				</text>
			</g>
			<path d="M -170 -220 L -170 0 L 170 0 L 170 -220 L 0 -90 Z" fill={bg} {...s} />
			<path d="M -170 0 L -40 -110 M 170 0 L 40 -110" fill="none" {...s} strokeWidth={3} opacity={0.6} />
			{!flipped ? <path d={`M -170 ${flapY} L 0 ${flapY + 130 * k} L 170 ${flapY}`} fill={bg} {...s} /> : null}
		</Wrap>
	);
};
