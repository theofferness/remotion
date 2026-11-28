import React from 'react';
import {useCurrentFrame} from 'remotion';
import {softGlow, usePalette} from './palette';

type Base = {
	readonly x: number;
	readonly y: number;
	readonly scale?: number;
	readonly glow?: number;
	readonly opacity?: number;
};

const useStroke = () => {
	const {ink, bg} = usePalette();
	return {ink, bg, s: {stroke: ink, strokeWidth: 4.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const}};
};

const Wrap: React.FC<Base & {readonly children: React.ReactNode}> = ({x, y, scale = 1, glow = 0, opacity = 1, children}) => {
	const {ink} = usePalette();
	return (
		<g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity} style={glow > 0 ? {filter: softGlow(ink, glow)} : undefined}>
			{children}
		</g>
	);
};

/** Tea cup with rising steam. (x, y) = bottom centre of the saucer. */
export const TeaCup: React.FC<Base> = (p) => {
	const frame = useCurrentFrame();
	const {bg, s} = useStroke();
	return (
		<Wrap {...p}>
			<path d="M -70 0 Q 0 14 70 0" fill="none" {...s} />
			<path d="M -46 -8 L -40 -70 L 40 -70 L 46 -8 Q 0 4 -46 -8 Z" fill={bg} {...s} />
			<path d="M 42 -58 C 74 -58, 74 -22, 44 -24" fill="none" {...s} />
			{[0, 1, 2].map((i) => {
				const t = ((frame / 60 + i / 3) % 1);
				const xo = -18 + i * 18;
				return (
					<path
						key={i}
						d={`M ${xo} -86 C ${xo - 14} -106, ${xo + 14} -126, ${xo} -146`}
						fill="none"
						{...s}
						strokeWidth={3.5}
						opacity={Math.sin(Math.PI * t) * 0.8}
						transform={`translate(${Math.sin(frame / 20 + i) * 4} ${-t * 34})`}
					/>
				);
			})}
		</Wrap>
	);
};

/** Desk lamp with a soft light cone. (x, y) = bottom of the base. */
export const Lamp: React.FC<Base & {readonly light?: number}> = ({light = 1, ...p}) => {
	const {ink, bg, s} = useStroke();
	return (
		<Wrap {...p}>
			<defs>
				<linearGradient id="lampCone" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={ink} stopOpacity={0.22 * light} />
					<stop offset="100%" stopColor={ink} stopOpacity={0} />
				</linearGradient>
			</defs>
			<path d="M -18 -250 L -120 30 L 160 30 L 58 -250 Z" fill="url(#lampCone)" />
			<path d="M -46 0 Q 0 -14 46 0 Z" fill={bg} {...s} />
			<path d="M 0 -6 L 0 -150 L 40 -230" fill="none" {...s} />
			<path d="M -10 -260 L 90 -260 L 64 -210 L 16 -210 Z" fill={bg} {...s} transform="rotate(14 40 -235)" />
			<circle cx={40} cy={-202} r={9} fill={ink} opacity={light} style={{filter: softGlow(ink, light)}} />
		</Wrap>
	);
};

/** Potted plant with gently swaying leaves. (x, y) = bottom of the pot. */
export const Plant: React.FC<Base> = (p) => {
	const frame = useCurrentFrame();
	const {bg, s} = useStroke();
	const sway = Math.sin(frame / 40) * 4;
	const leaves = [
		{a: -38, l: 90},
		{a: -12, l: 120},
		{a: 14, l: 105},
		{a: 40, l: 80},
	];
	return (
		<Wrap {...p}>
			{leaves.map((lf, i) => (
				<g key={i} transform={`translate(0 -78) rotate(${lf.a + sway * (i % 2 ? 1 : -1)})`}>
					<path d={`M 0 0 Q ${-22} ${-lf.l * 0.5} 0 ${-lf.l} Q ${22} ${-lf.l * 0.5} 0 0 Z`} fill={bg} {...s} />
					<path d={`M 0 -6 L 0 ${-lf.l + 14}`} {...s} strokeWidth={2.5} opacity={0.7} />
				</g>
			))}
			<path d="M -46 -80 L 46 -80 L 36 0 L -36 0 Z" fill={bg} {...s} />
			<path d="M -50 -80 L 50 -80" {...s} />
		</Wrap>
	);
};

/** Candle with a flickering flame. (x, y) = bottom of the candle. */
export const Candle: React.FC<Base & {readonly lit?: number}> = ({lit = 1, ...p}) => {
	const frame = useCurrentFrame();
	const {ink, bg, s} = useStroke();
	const flick = 1 + 0.08 * Math.sin(frame / 3) + 0.05 * Math.sin(frame / 1.7);
	return (
		<Wrap {...p}>
			<path d="M -60 0 Q 0 10 60 0" fill="none" {...s} />
			<rect x={-26} y={-150} width={52} height={150} rx={8} fill={bg} {...s} />
			<path d="M -26 -140 Q -10 -126 -4 -144" fill="none" {...s} strokeWidth={3} opacity={0.7} />
			<line x1={0} y1={-150} x2={0} y2={-166} {...s} strokeWidth={3} />
			<g transform={`translate(0 -168) scale(${flick * lit})`} opacity={lit} style={{filter: softGlow(ink, 1.4 * lit)}}>
				<path d="M 0 -50 C 18 -26, 16 -4, 0 0 C -16 -4, -18 -26, 0 -50 Z" fill={ink} />
			</g>
		</Wrap>
	);
};

/** Spiral notebook, optionally with lines "written" up to `written` (0–1). */
export const Notebook: React.FC<Base & {readonly written?: number}> = ({written = 1, ...p}) => {
	const {bg, s} = useStroke();
	return (
		<Wrap {...p}>
			<rect x={-110} y={-150} width={220} height={150} rx={10} fill={bg} {...s} />
			{Array.from({length: 7}).map((_, i) => (
				<circle key={i} cx={-84 + i * 28} cy={-150} r={7} fill={bg} {...s} strokeWidth={3} />
			))}
			{[0, 1, 2].map((i) => (
				<line
					key={i}
					x1={-80}
					y1={-104 + i * 32}
					x2={-80 + (150 - i * 30) * Math.max(0, Math.min(1, written * 3 - i))}
					y2={-104 + i * 32}
					{...s}
					strokeWidth={3}
					opacity={0.7}
				/>
			))}
		</Wrap>
	);
};

/* ——— small seasonal icons ——— */

export const Snowflake: React.FC<Base & {readonly spin?: number}> = ({spin = 0, ...p}) => {
	const {s} = useStroke();
	return (
		<Wrap {...p}>
			<g transform={`rotate(${spin})`} fill="none" {...s}>
				{Array.from({length: 6}).map((_, i) => (
					<g key={i} transform={`rotate(${i * 60})`}>
						<line x1={0} y1={0} x2={0} y2={-60} />
						<path d="M -14 -38 L 0 -26 L 14 -38" />
						<path d="M -10 -56 L 0 -48 L 10 -56" />
					</g>
				))}
			</g>
		</Wrap>
	);
};

export const Sprout: React.FC<Base & {readonly grow?: number}> = ({grow = 1, ...p}) => {
	const {bg, s} = useStroke();
	return (
		<Wrap {...p}>
			<path d={`M 0 0 L 0 ${-90 * grow}`} fill="none" {...s} />
			<g transform={`translate(0 ${-80 * grow}) scale(${grow})`}>
				<path d="M 0 0 C -20 -40, -70 -40, -76 -14 C -50 -2, -18 -2, 0 0 Z" fill={bg} {...s} />
				<path d="M 0 -10 C 18 -54, 70 -58, 80 -30 C 54 -14, 20 -10, 0 -10 Z" fill={bg} {...s} />
			</g>
		</Wrap>
	);
};

export const Bridge: React.FC<Base> = (p) => {
	const {s} = useStroke();
	return (
		<Wrap {...p}>
			<g fill="none" {...s}>
				<path d="M -110 0 Q 0 -110 110 0" />
				<path d="M -110 -40 Q 0 -150 110 -40" strokeWidth={3.5} />
				{[-70, -35, 0, 35, 70].map((x) => {
					const yBot = -(1 - (x / 110) ** 2) * 55;
					return <line key={x} x1={x} y1={yBot} x2={x} y2={yBot - 40} strokeWidth={3} />;
				})}
			</g>
		</Wrap>
	);
};

export const Leaf: React.FC<Base & {readonly sway?: number}> = ({sway = 0, ...p}) => {
	const {bg, s} = useStroke();
	return (
		<Wrap {...p}>
			<g transform={`rotate(${sway})`}>
				<path d="M 0 0 C -50 -20, -50 -90, 0 -120 C 50 -90, 50 -20, 0 0 Z" fill={bg} {...s} />
				<path d="M 0 10 L 0 -100" fill="none" {...s} strokeWidth={3} />
				{[-30, -55, -80].map((y, i) => (
					<g key={i} fill="none" {...s} strokeWidth={2.5} opacity={0.7}>
						<path d={`M 0 ${y} L -22 ${y - 18}`} />
						<path d={`M 0 ${y} L 22 ${y - 18}`} />
					</g>
				))}
			</g>
		</Wrap>
	);
};
