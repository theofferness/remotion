import React, {useId} from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {hexA} from '../../editorial/Atmos';
import {SANS} from '../../editorial/fonts';
import {RATIO} from '../../editorial/Logo';

/*
 * THE DARKROOM – building blocks for Winter V3.
 * Navy = the darkroom, white = paper and light, navy ink on paper / white ink on navy.
 */

export const NAVY = '#141a36';
export const NIGHT = '#0b0f22'; // the darkest corners of the darkroom (navy, deeper)
export const PAPER = '#f6f5f1';
export const INK_ON_PAPER = NAVY;

/** The room: deep navy, a soft working light, heavy vignette, film grain. */
export const Room: React.FC<{readonly light?: {x: number; y: number}}> = ({light = {x: 50, y: 46}}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{backgroundColor: NIGHT}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 85% 60% at ${light.x}% ${light.y}%, ${NAVY} 0%, ${NAVY} 30%, ${NIGHT} 100%)`}} />
			<Grain seed={Math.floor(frame / 2)} opacity={0.09} />
		</AbsoluteFill>
	);
};

export const Grain: React.FC<{readonly seed: number; readonly opacity?: number}> = ({seed, opacity = 0.08}) => {
	const id = useId().replace(/:/g, '');
	return (
		<svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity, mixBlendMode: 'screen', pointerEvents: 'none'}}>
			<filter id={`g${id}`}>
				<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed % 50} />
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter={`url(#g${id})`} />
		</svg>
	);
};

/**
 * A sheet lying in space (CSS 3D). Children are drawn in the sheet's own pixel space.
 * `ripple` > 0 adds the developer-liquid shimmer.
 */
export const Sheet: React.FC<{
	readonly x: number;
	readonly y: number;
	readonly w: number;
	readonly h: number;
	readonly rx?: number;
	readonly ry?: number;
	readonly rz?: number;
	readonly shadow?: number;
	readonly color?: string;
	readonly children?: React.ReactNode;
}> = ({x, y, w, h, rx = 0, ry = 0, rz = 0, shadow = 0.5, color = PAPER, children}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, height: h, perspective: 2200, perspectiveOrigin: '50% 30%'}}>
		<div
			style={{
				position: 'absolute',
				inset: 0,
				background: color,
				transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
				transformOrigin: '50% 50%',
				boxShadow: `0 ${50 * shadow}px ${110 * shadow}px rgba(0,0,0,${0.55 * shadow}), 0 ${8 * shadow}px ${20 * shadow}px rgba(0,0,0,${0.35 * shadow})`,
				overflow: 'hidden',
			}}
		>
			{children}
		</div>
	</div>
);

/** A developing tray: a darker basin with a faint rim and a sheen of liquid. */
export const Tray: React.FC<{readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly rx?: number; readonly rz?: number}> = ({x, y, w, h, rx = 0, rz = 0}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, height: h, perspective: 2200, perspectiveOrigin: '50% 30%'}}>
		<div
			style={{
				position: 'absolute',
				inset: 0,
				borderRadius: 28,
				background: `linear-gradient(160deg, ${hexA('#ffffff', 0.05)} 0%, rgba(0,0,0,0.38) 40%, rgba(0,0,0,0.5) 100%)`,
				boxShadow: `inset 0 0 0 2px ${hexA('#ffffff', 0.07)}, inset 0 30px 80px rgba(0,0,0,0.5)`,
				transform: `rotateX(${rx}deg) rotateZ(${rz}deg)`,
			}}
		/>
	</div>
);

/** Liquid sheen laid over a sheet in the tray. */
export const Sheen: React.FC<{readonly angle?: number; readonly at?: number}> = ({angle = 115, at = 30}) => (
	<div
		style={{
			position: 'absolute',
			inset: 0,
			background: `linear-gradient(${angle}deg, transparent ${at - 14}%, rgba(255,255,255,0.16) ${at}%, transparent ${at + 10}%, transparent ${at + 30}%, rgba(255,255,255,0.07) ${at + 38}%, transparent ${at + 46}%)`,
			mixBlendMode: 'screen',
			pointerEvents: 'none',
		}}
	/>
);

/**
 * Development mask: noise thresholded by `progress` (0 = latent, 1 = fully developed),
 * so an image emerges unevenly, the way it does on photographic paper.
 */
export const DevelopMask: React.FC<{readonly id: string; readonly w: number; readonly h: number; readonly progress: number; readonly seed?: number; readonly scale?: number; readonly bias?: {x: number; y: number}}> = ({
	id,
	w,
	h,
	progress,
	seed = 3,
	scale = 0.011,
	bias,
}) => {
	// soft photographic development: density rises with progress, gently modulated by noise
	const k = 1.4;
	const pr = Math.max(0, Math.min(1, progress));
	const slope = k;
	const intercept = 1.6 * pr - 0.5 - k * 0.5;
	return (
		<defs>
			<filter id={`${id}-f`} x={0} y={0} width={w} height={h} filterUnits="userSpaceOnUse">
				<feTurbulence type="fractalNoise" baseFrequency={scale} numOctaves={3} seed={seed} result="n" />
				<feColorMatrix in="n" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="g" />
				<feComponentTransfer in="g">
					<feFuncR type="linear" slope={slope} intercept={intercept} />
					<feFuncG type="linear" slope={slope} intercept={intercept} />
					<feFuncB type="linear" slope={slope} intercept={intercept} />
				</feComponentTransfer>
			</filter>
			{bias ? (
				<radialGradient id={`${id}-b`} cx={bias.x} cy={bias.y} r={1.1} gradientUnits="objectBoundingBox">
					<stop offset="0%" stopColor="#fff" stopOpacity={1} />
					<stop offset="100%" stopColor="#fff" stopOpacity={Math.max(0, progress * 1.6 - 0.6)} />
				</radialGradient>
			) : null}
			<mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
				<rect width={w} height={h} filter={`url(#${id}-f)`} />
				{bias ? <rect width={w} height={h} fill={`url(#${id}-b)`} style={{mixBlendMode: 'multiply'}} /> : null}
			</mask>
		</defs>
	);
};

/** Film edge code – the brand's signature typographic detail. */
export const EdgeCode: React.FC<{readonly x: number; readonly y: number; readonly text: string; readonly color: string; readonly size?: number; readonly opacity?: number; readonly rotate?: number}> = ({
	x,
	y,
	text,
	color,
	size = 17,
	opacity = 0.7,
	rotate = 0,
}) => (
	<text x={x} y={y} fill={color} opacity={opacity} fontFamily={SANS} fontWeight={600} fontSize={size} letterSpacing={size * 0.22} transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}>
		{text}
	</text>
);

/** Photographic crop marks (L-corners) around a rectangle. */
export const CropMarks: React.FC<{readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly color: string; readonly gap?: number; readonly len?: number; readonly width?: number; readonly progress?: number}> = ({
	x,
	y,
	w,
	h,
	color,
	gap = 12,
	len = 34,
	width = 4,
	progress = 1,
}) => {
	const l = len * progress;
	const corners: [number, number, number, number][] = [
		[x - gap, y - gap, 1, 1],
		[x + w + gap, y - gap, -1, 1],
		[x - gap, y + h + gap, 1, -1],
		[x + w + gap, y + h + gap, -1, -1],
	];
	return (
		<g stroke={color} strokeWidth={width} strokeLinecap="square" fill="none">
			{corners.map(([cx, cy, sx, sy], i) => (
				<path key={i} d={`M ${cx} ${cy + sy * l} L ${cx} ${cy} L ${cx + sx * l} ${cy}`} />
			))}
		</g>
	);
};

/** Sprocket holes along a film edge. */
export const Sprockets: React.FC<{readonly x: number; readonly y: number; readonly length: number; readonly color: string; readonly vertical?: boolean; readonly pitch?: number}> = ({
	x,
	y,
	length,
	color,
	vertical = false,
	pitch = 26,
}) => (
	<g fill={color}>
		{Array.from({length: Math.floor(length / pitch)}).map((_, i) =>
			vertical ? <rect key={i} x={x} y={y + i * pitch} width={10} height={14} rx={2.5} /> : <rect key={i} x={x + i * pitch} y={y} width={14} height={10} rx={2.5} />,
		)}
	</g>
);

/** The supplied logo as an SVG <image> (white or black file, proportions locked). */
export const LogoImage: React.FC<{readonly x: number; readonly y: number; readonly w: number; readonly variant: 'white' | 'black'; readonly mask?: string}> = ({x, y, w, variant, mask}) => (
	<image href={staticFile(`brand/offervisions-logo-${variant}.png`)} x={x} y={y} width={w} height={w * RATIO} mask={mask ? `url(#${mask})` : undefined} />
);
