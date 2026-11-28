import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {BACK_OUT, EASE_IN_OUT, EASE_OUT, prog} from '../components/anim';
import {Figure} from '../components/Figure';
import {Headline} from '../components/Headline';
import {Stage} from '../components/Stage';
import type {Script} from '../schema';
import {fontStack, glow, useTheme} from '../theme';

const STEPS = 6;
const STEP_W = 128;
const STEP_H = 82;
const BASE_X = 150;
const BASE_Y = 1250;
const FIRST_STEP = 22;
const STEP_EVERY = 18;
const JUMP = 12;

/** Frames (inside the scene) where each step lands – used for "pop" sfx. */
export const STAIRS_STEP_FRAMES = Array.from(
	{length: STEPS},
	(_, i) => FIRST_STEP + i * STEP_EVERY + JUMP,
);

const stepTop = (i: number) => ({
	x: BASE_X + (i + 1) * STEP_W,
	y: BASE_Y - (i + 1) * STEP_H,
});

/** Scene 3 – a glowing staircase builds one step at a time as the figure climbs. */
export const StairsScene: React.FC<{readonly script: Script['stairs']}> = ({script}) => {
	const frame = useCurrentFrame();
	const theme = useTheme();

	// Resting spots: on the ground, then the centre of each step's tread.
	const spots = [
		{x: BASE_X - 45, y: BASE_Y},
		...Array.from({length: STEPS}, (_, i) => ({x: stepTop(i).x - STEP_W / 2, y: stepTop(i).y})),
	];
	const raw = (frame - FIRST_STEP) / STEP_EVERY;
	const jumpIdx = Math.max(0, Math.min(STEPS - 1, Math.floor(raw)));
	const local = frame - (FIRST_STEP + jumpIdx * STEP_EVERY);
	const jumpT = raw < 0 ? 0 : interpolate(local, [0, JUMP], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: EASE_IN_OUT,
	});
	const a = spots[jumpIdx];
	const b = spots[jumpIdx + 1];
	const fx = a.x + (b.x - a.x) * jumpT;
	const fy = a.y + (b.y - a.y) * jumpT - Math.sin(Math.PI * jumpT) * 70;
	const landing = raw < 0 ? 0 : interpolate(local, [JUMP, JUMP + 3, JUMP + 8], [0, 0.12, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const done = prog(frame, STAIRS_STEP_FRAMES[STEPS - 1], STAIRS_STEP_FRAMES[STEPS - 1] + 20, BACK_OUT);
	// Camera rises with the figure.
	const camY = interpolate(frame, [FIRST_STEP, STAIRS_STEP_FRAMES[STEPS - 1] + 10], [0, 60], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: EASE_IN_OUT,
	});

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{translate: `0px ${camY}px`}}>
				<Stage>
					<line
						x1={60}
						y1={BASE_Y}
						x2={60 + (BASE_X - 60) * prog(frame, 0, 14)}
						y2={BASE_Y}
						stroke={theme.ink}
						strokeWidth={6}
						strokeLinecap="round"
						style={{filter: glow(theme.ink, 0.7)}}
					/>
					{Array.from({length: STEPS}).map((_, i) => {
						const appear = prog(frame, FIRST_STEP + i * STEP_EVERY - 6, FIRST_STEP + i * STEP_EVERY + 6, EASE_OUT);
						const x0 = BASE_X + i * STEP_W;
						const y0 = BASE_Y - i * STEP_H;
						const top = stepTop(i);
						// riser then tread, drawn as one stroke
						const d = `M ${x0} ${y0} L ${x0} ${top.y} L ${top.x} ${top.y}`;
						return (
							<path
								key={i}
								d={d}
								fill="none"
								stroke={theme.ink}
								strokeWidth={6}
								strokeLinecap="round"
								strokeLinejoin="round"
								pathLength={1}
								strokeDasharray={1}
								strokeDashoffset={1 - appear}
								style={{filter: glow(theme.ink, 0.7)}}
							/>
						);
					})}
					{STAIRS_STEP_FRAMES.map((f, i) => {
						const p = prog(frame, f, f + 12, BACK_OUT);
						const fade = prog(frame, f + 30, f + 50);
						const top = stepTop(i);
						return (
							<text
								key={i}
								x={top.x - STEP_W / 2}
								y={top.y + 54}
								textAnchor="middle"
								fontFamily={fontStack(theme.headlineFont, 'sans')}
								fontWeight={900}
								fontSize={30}
								fill={theme.accent}
								opacity={p * (1 - 0.55 * fade)}
								transform={`translate(0 ${(1 - p) * -16})`}
							>
								{script.stepLabel}
							</text>
						);
					})}
					<Figure
						x={fx}
						y={fy}
						color={theme.ink}
						visorColor={theme.background}
						scale={0.62}
						squash={landing}
						armRaise={0.25 * Math.sin(Math.PI * jumpT) + 0.75 * done}
					/>
				</Stage>
			</AbsoluteFill>
			<Headline kicker={script.kicker} headline={script.headline} headlineStart={56} />
		</AbsoluteFill>
	);
};
