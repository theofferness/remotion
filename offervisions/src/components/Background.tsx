import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useTheme} from '../theme';

/** Continuous background shared by every scene: spotlight, dot grid, vignette, grain. */
export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const theme = useTheme();

	return (
		<AbsoluteFill style={{backgroundColor: theme.background, overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 70% 45% at 50% 50%, ${theme.backgroundGlow} 0%, transparent 70%)`,
					translate: `0px ${interpolate(frame, [0, durationInFrames], [-60, 60])}px`,
					scale: String(1 + 0.05 * Math.sin(frame / 40)),
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundImage: `radial-gradient(${theme.ink}22 1.6px, transparent 1.8px)`,
					backgroundSize: '54px 54px',
					backgroundPosition: `27px ${27 - ((frame * 0.4) % 54)}px`,
					maskImage:
						'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 85%)',
				}}
			/>
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)',
				}}
			/>
			<svg
				width="100%"
				height="100%"
				style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'screen'}}
			>
				<filter id="grain">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.9"
						numOctaves={2}
						seed={Math.floor(frame / 2) % 50}
						stitchTiles="stitch"
					/>
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};
