import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {seeded} from './anim';
import {alpha, usePalette} from './palette';

/** Season-colour background with a soft lighter centre, paper grain and vignette. */
export const Backdrop: React.FC = () => {
	const frame = useCurrentFrame();
	const {bg, ink} = usePalette();
	return (
		<AbsoluteFill style={{backgroundColor: bg}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 75% 50% at 50% ${48 + 2 * Math.sin(frame / 90)}%, ${alpha(ink, 0.1)} 0%, transparent 70%)`,
				}}
			/>
			<svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.06, mixBlendMode: 'screen'}}>
				<filter id="paper">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} seed={Math.floor(frame / 3) % 30} />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#paper)" />
			</svg>
			<AbsoluteFill
				style={{background: 'radial-gradient(ellipse 90% 75% at 50% 50%, transparent 60%, rgba(5,8,25,0.45) 100%)'}}
			/>
		</AbsoluteFill>
	);
};

/** Soft floating light particles in three depth layers. */
export const Particles: React.FC<{readonly count?: number; readonly opacity?: number}> = ({count = 42, opacity = 1}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const {ink} = usePalette();
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity}}>
			{Array.from({length: count}).map((_, i) => {
				const depth = i % 3; // 0 far, 2 near
				const size = [3, 5, 9][depth] * (0.7 + seeded(i) * 0.6);
				const speed = [0.25, 0.45, 0.8][depth] * (0.7 + seeded(i + 9) * 0.6);
				const x = seeded(i + 30) * width + Math.sin((frame + i * 37) / (70 + depth * 20)) * (14 + depth * 10);
				const y = (height + 100 - ((frame * speed + seeded(i + 60) * (height + 200)) % (height + 200))) - 50;
				const twinkle = 0.55 + 0.45 * Math.sin((frame + i * 13) / 22);
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
							backgroundColor: ink,
							opacity: [0.25, 0.4, 0.3][depth] * twinkle,
							filter: `blur(${[1.5, 1, 3][depth]}px)`,
							boxShadow: `0 0 ${size * 2}px ${alpha(ink, 0.6)}`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
