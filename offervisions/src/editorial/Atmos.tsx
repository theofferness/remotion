import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {rnd} from './motion';

/** Background colour + very soft light falloff + film grain + vignette. Restrained. */
export const Atmos: React.FC<{readonly bg: string; readonly ink: string; readonly light?: number; readonly grain?: number}> = ({bg, ink, light = 0.06, grain = 0.06}) => {
	const frame = useCurrentFrame();
	const dark = isDark(bg);
	return (
		<AbsoluteFill style={{backgroundColor: bg}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 70% 45% at 50% 46%, ${hexA(ink, light)} 0%, transparent 70%)`}} />
			<svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: grain, mixBlendMode: dark ? 'screen' : 'multiply'}}>
				<filter id="ed-grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(frame / 2) % 40} />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#ed-grain)" />
			</svg>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 95% 80% at 50% 50%, transparent 60%, ${dark ? 'rgba(0,0,0,0.5)' : 'rgba(60,40,20,0.12)'} 100%)`}} />
		</AbsoluteFill>
	);
};

/** A few slow, out-of-focus motes of light for depth (cinematic, not decorative confetti). */
export const Motes: React.FC<{readonly ink: string; readonly count?: number; readonly opacity?: number}> = ({ink, count = 14, opacity = 1}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	return (
		<AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
			{Array.from({length: count}).map((_, i) => {
				const size = 6 + rnd(i) * 22;
				const x = rnd(i + 3) * width + Math.sin((frame + i * 50) / 120) * 20;
				const y = ((rnd(i + 7) * height - frame * (0.15 + rnd(i + 9) * 0.25)) % height + height) % height;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: size,
							height: size,
							borderRadius: '50%',
							background: ink,
							opacity: 0.05 + rnd(i + 11) * 0.08,
							filter: `blur(${2 + size / 4}px)`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

export const isDark = (hex: string) => {
	const n = parseInt(hex.slice(1), 16);
	const r = (n >> 16) & 255;
	const g = (n >> 8) & 255;
	const b = n & 255;
	return 0.299 * r + 0.587 * g + 0.114 * b < 140;
};

export const hexA = (hex: string, a: number) =>
	`${hex}${Math.round(Math.max(0, Math.min(1, a)) * 255)
		.toString(16)
		.padStart(2, '0')}`;
