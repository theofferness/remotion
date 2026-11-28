import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BACK_OUT, EASE_IN_OUT, EASE_OUT, prog} from '../components/anim';
import {Figure} from '../components/Figure';
import {seeded} from '../components/geometry';
import {Headline} from '../components/Headline';
import {Stage} from '../components/Stage';
import type {Script} from '../schema';
import {glow, useTheme} from '../theme';

const HORIZON_Y = 1280;
const SUN_R = 190;

/** Scene 5 – the figure stands on a hilltop as a sun of possibility rises. */
export const VisionScene: React.FC<{readonly script: Script['vision']}> = ({script}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const theme = useTheme();

	const horizon = prog(frame, 0, 20, EASE_IN_OUT);
	const sunRise = prog(frame, 6, 80, EASE_OUT);
	const sunY = interpolate(sunRise, [0, 1], [HORIZON_Y + SUN_R, HORIZON_Y - 150]);
	const rays = prog(frame, 40, 75);
	const arms = prog(frame, 58, 76, BACK_OUT);
	const push = interpolate(frame, [0, durationInFrames], [1, 1.08]);

	return (
		<AbsoluteFill style={{scale: String(push)}}>
			<Stage>
				<defs>
					<radialGradient id="sunGlow">
						<stop offset="0%" stopColor={theme.accent} stopOpacity={0.55} />
						<stop offset="100%" stopColor={theme.accent} stopOpacity={0} />
					</radialGradient>
					<clipPath id="aboveHorizon">
						<rect x={0} y={0} width={1080} height={HORIZON_Y} />
					</clipPath>
				</defs>
				<g clipPath="url(#aboveHorizon)">
					<circle cx={540} cy={sunY} r={SUN_R * 3} fill="url(#sunGlow)" opacity={sunRise} />
					<g transform={`translate(540 ${sunY}) rotate(${frame * 0.4})`} opacity={rays}>
						{Array.from({length: 16}).map((_, i) => {
							const a = (i / 16) * Math.PI * 2;
							const r1 = SUN_R + 40;
							const r2 = SUN_R + 40 + (i % 2 === 0 ? 120 : 70) * rays;
							return (
								<line
									key={i}
									x1={Math.cos(a) * r1}
									y1={Math.sin(a) * r1}
									x2={Math.cos(a) * r2}
									y2={Math.sin(a) * r2}
									stroke={theme.accent}
									strokeWidth={6}
									strokeLinecap="round"
								/>
							);
						})}
					</g>
					<circle cx={540} cy={sunY} r={SUN_R} fill={theme.accent} style={{filter: glow(theme.accent, 2)}} />
				</g>
				{/* rising light particles */}
				{Array.from({length: 26}).map((_, i) => {
					const speed = 2 + seeded(i) * 4;
					const x = 80 + seeded(i + 100) * 920;
					const y = HORIZON_Y - ((frame * speed + seeded(i + 200) * 900) % 900);
					return (
						<circle
							key={i}
							cx={x + Math.sin((frame + i * 20) / 18) * 12}
							cy={y}
							r={2 + seeded(i + 300) * 4}
							fill={theme.accent}
							opacity={sunRise * (0.25 + 0.6 * seeded(i + 400)) * interpolate(y, [HORIZON_Y - 900, HORIZON_Y - 650, HORIZON_Y], [0, 1, 0.4])}
						/>
					);
				})}
				{/* horizon + hill */}
				<line x1={540 - 480 * horizon} y1={HORIZON_Y} x2={540 + 480 * horizon} y2={HORIZON_Y} stroke={theme.ink} strokeWidth={5} strokeLinecap="round" style={{filter: glow(theme.ink, 0.6)}} />
				<path
					d={`M 300 ${HORIZON_Y} Q 540 ${HORIZON_Y - 150} 780 ${HORIZON_Y} Z`}
					fill={theme.background}
					stroke={theme.ink}
					strokeWidth={5}
					opacity={horizon}
					style={{filter: glow(theme.ink, 0.6)}}
				/>
				<Figure
					x={540}
					y={HORIZON_Y - 75}
					color={theme.background}
					visorColor={theme.accent}
					scale={0.9 * prog(frame, 10, 28, BACK_OUT)}
					armRaise={arms}
					glowStrength={0.7}
					glowColor={theme.accent}
				/>
			</Stage>
			<Headline kicker={script.kicker} headline={script.headline} headlineStart={44} />
		</AbsoluteFill>
	);
};
