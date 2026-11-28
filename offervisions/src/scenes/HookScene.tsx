import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BACK_OUT, EASE_IN_OUT, prog} from '../components/anim';
import {Figure} from '../components/Figure';
import {Headline} from '../components/Headline';
import {Stage} from '../components/Stage';
import type {Script} from '../schema';
import {fontStack, glow, useTheme} from '../theme';

const GROUND_Y = 1290;
const STEPS = 5;
const STEP_W = 104;
const STEP_H = 96;
const STAIR_X = 470;

/** Frame (inside the scene) where the "someday…" thought bubble pops. */
export const HOOK_THOUGHT_FRAME = 62;

/** Scene 1 – a figure stares at a staircase it never climbs. */
export const HookScene: React.FC<{readonly script: Script['hook']}> = ({script}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const theme = useTheme();

	const ground = prog(frame, 0, 22, EASE_IN_OUT);
	const stairs = prog(frame, 14, 56, EASE_IN_OUT);
	const goal = prog(frame, 50, 64, BACK_OUT);
	const thought = prog(frame, HOOK_THOUGHT_FRAME, HOOK_THOUGHT_FRAME + 14, BACK_OUT);
	const figureIn = prog(frame, 8, 26, BACK_OUT);

	let stairD = `M ${STAIR_X} ${GROUND_Y}`;
	for (let i = 0; i < STEPS; i++) {
		const x = STAIR_X + i * STEP_W;
		const y = GROUND_Y - (i + 1) * STEP_H;
		stairD += ` L ${x} ${y} L ${x + STEP_W} ${y}`;
	}
	const topX = STAIR_X + STEPS * STEP_W - STEP_W / 2;
	const topY = GROUND_Y - STEPS * STEP_H;

	return (
		<AbsoluteFill
			style={{
				scale: String(interpolate(frame, [0, durationInFrames], [1, 1.06])),
			}}
		>
			<Stage>
				<line
					x1={60}
					y1={GROUND_Y}
					x2={60 + 960 * ground}
					y2={GROUND_Y}
					stroke={theme.ink}
					strokeWidth={5}
					strokeLinecap="round"
					style={{filter: glow(theme.ink, 0.6)}}
				/>
				<path
					d={stairD}
					fill="none"
					stroke={theme.muted}
					strokeWidth={5}
					strokeDasharray="16 14"
					strokeLinejoin="round"
					pathLength={1000}
					strokeDashoffset={0}
					style={{
						clipPath: `inset(-20px ${(1 - stairs) * 100}% -20px -20px)`,
					}}
				/>
				{/* Goal star at the top step */}
				<g
					transform={`translate(${topX} ${topY - 46}) scale(${goal}) rotate(${frame * 1.5})`}
					style={{filter: glow(theme.accent, 1.4)}}
				>
					<path
						d="M0 -30 L8 -8 L30 0 L8 8 L0 30 L-8 8 L-30 0 L-8 -8 Z"
						fill={theme.accent}
					/>
				</g>
				<Figure
					x={300}
					y={GROUND_Y}
					color={theme.ink}
					visorColor={theme.background}
					scale={1.15 * figureIn}
					squash={0.015 * Math.sin(frame / 7)}
				/>
			</Stage>
			{/* "someday…" thought bubble */}
			<div
				style={{
					position: 'absolute',
					left: 300 - 150,
					top: GROUND_Y - 420,
					width: 300,
					textAlign: 'center',
					fontFamily: fontStack(theme.serifFont, 'serif'),
					fontStyle: 'italic',
					fontSize: 54,
					color: theme.muted,
					opacity: thought,
					scale: String(0.6 + 0.4 * thought),
					translate: `0px ${(1 - thought) * 20}px`,
				}}
			>
				someday…
			</div>
			<Headline kicker={script.kicker} headline={script.headline} headlineStart={52} />
		</AbsoluteFill>
	);
};
