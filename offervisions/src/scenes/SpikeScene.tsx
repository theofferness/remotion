import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BACK_OUT, EASE_IN_OUT, prog} from '../components/anim';
import {partialPolyline, type Point} from '../components/geometry';
import {Headline} from '../components/Headline';
import {Stage} from '../components/Stage';
import type {Script} from '../schema';
import {fontStack, glow, useTheme} from '../theme';

const BASE_Y = 1260;
const LINE_Y = 1200;
const PEAK: Point = [500, 720];
const POINTS: Point[] = [
	[130, LINE_Y],
	[400, LINE_Y],
	PEAK,
	[600, LINE_Y],
	[950, LINE_Y + 8],
];
const DRAW_START = 10;
const DRAW_END = 84;

/** Frame where the drawing pen reaches the peak (used for the "pop" sfx). */
export const SPIKE_PEAK_FRAME = 40;
/** Frame where the "Monday" label lands. */
export const SPIKE_DROP_FRAME = 60;

/** Scene 2 – motivation spikes, then crashes back to flat. */
export const SpikeScene: React.FC<{readonly script: Script['spike']}> = ({script}) => {
	const frame = useCurrentFrame();
	const theme = useTheme();

	const axes = prog(frame, 0, 18, EASE_IN_OUT);
	const draw = prog(frame, DRAW_START, DRAW_END, (t) => t);
	const {d, head} = partialPolyline(POINTS, draw);
	const peakLabel = prog(frame, SPIKE_PEAK_FRAME, SPIKE_PEAK_FRAME + 12, BACK_OUT);
	const fadePeak = prog(frame, SPIKE_DROP_FRAME + 6, SPIKE_DROP_FRAME + 26);
	const drop = prog(frame, SPIKE_DROP_FRAME, SPIKE_DROP_FRAME + 12, BACK_OUT);
	const lineColor = fadePeak > 0.5 ? theme.muted : theme.ink;

	const days = ['FRI', 'SAT', 'SUN', 'MON', 'TUE'];
	const dayX = [220, 360, 500, 640, 820];

	return (
		<AbsoluteFill>
			<Stage>
				{/* axes */}
				<line
					x1={130}
					y1={BASE_Y}
					x2={130 + 820 * axes}
					y2={BASE_Y}
					stroke={theme.muted}
					strokeWidth={4}
					strokeLinecap="round"
				/>
				<line
					x1={130}
					y1={BASE_Y}
					x2={130}
					y2={BASE_Y - 620 * axes}
					stroke={theme.muted}
					strokeWidth={4}
					strokeLinecap="round"
				/>
				{days.map((day, i) => {
					const x = dayX[i];
					const o = prog(frame, 8 + i * 4, 20 + i * 4);
					const isDrop = day === 'MON';
					return (
						<text
							key={day}
							x={x}
							y={BASE_Y + 56}
							textAnchor="middle"
							fontFamily={fontStack(theme.headlineFont, 'sans')}
							fontWeight={800}
							fontSize={28}
							letterSpacing="0.15em"
							fill={isDrop && drop > 0 ? theme.accent : theme.muted}
							opacity={o}
						>
							{day}
						</text>
					);
				})}
				{/* motivation curve */}
				<path
					d={d}
					fill="none"
					stroke={lineColor}
					strokeWidth={7}
					strokeLinejoin="round"
					strokeLinecap="round"
					style={{filter: glow(theme.ink, 0.9)}}
				/>
				{draw > 0 && draw < 1 ? (
					<circle cx={head[0]} cy={head[1]} r={13} fill={theme.accent} style={{filter: glow(theme.accent, 1.5)}} />
				) : null}
				{/* peak marker */}
				<g opacity={1 - fadePeak * 0.6}>
					<circle
						cx={PEAK[0]}
						cy={PEAK[1]}
						r={20 * peakLabel}
						fill="none"
						stroke={theme.accent}
						strokeWidth={4}
						style={{filter: glow(theme.accent, 1)}}
					/>
					<text
						x={PEAK[0]}
						y={PEAK[1] - 52}
						textAnchor="middle"
						fontFamily={fontStack(theme.headlineFont, 'sans')}
						fontWeight={900}
						fontSize={42}
						letterSpacing="0.12em"
						fill={theme.accent}
						opacity={peakLabel}
						transform={`translate(0 ${(1 - peakLabel) * 20})`}
					>
						{script.graphLabel}
					</text>
				</g>
				{/* drop annotation: dashed line from peak height down to the crash */}
				<line
					x1={640}
					y1={PEAK[1]}
					x2={640}
					y2={PEAK[1] + (LINE_Y - 30 - PEAK[1]) * drop}
					stroke={theme.accent}
					strokeWidth={4}
					strokeDasharray="10 12"
					opacity={drop}
				/>
				<path
					d={`M ${624} ${LINE_Y - 56} L 640 ${LINE_Y - 34} L 656 ${LINE_Y - 56}`}
					fill="none"
					stroke={theme.accent}
					strokeWidth={4}
					strokeLinecap="round"
					strokeLinejoin="round"
					opacity={drop}
				/>
			</Stage>
			<div
				style={{
					position: 'absolute',
					left: 670,
					top: (PEAK[1] + LINE_Y) / 2 - 40,
					fontFamily: fontStack(theme.serifFont, 'serif'),
					fontStyle: 'italic',
					fontSize: 50,
					color: theme.ink,
					opacity: drop,
					translate: `${(1 - drop) * -20}px 0px`,
				}}
			>
				{script.dropLabel.charAt(0) + script.dropLabel.slice(1).toLowerCase()}…
			</div>
			<Headline kicker={script.kicker} headline={script.headline} headlineStart={62} />
		</AbsoluteFill>
	);
};
