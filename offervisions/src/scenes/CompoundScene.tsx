import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {BACK_OUT, EASE_IN_OUT, prog} from '../components/anim';
import {Headline} from '../components/Headline';
import {Stage} from '../components/Stage';
import type {Script} from '../schema';
import {fontStack, glow, useTheme} from '../theme';

const CX = 540;
const CY = 930;
const R = 240;
const COUNT_START = 14;

/** Frame where the counter hits its final value (used for the "ding" sfx). */
export const COMPOUND_DONE_FRAME = 100;

/** Scene 4 – a ring fills while a counter compounds 1.00× → 37.8×. */
export const CompoundScene: React.FC<{readonly script: Script['compound']}> = ({script}) => {
	const frame = useCurrentFrame();
	const theme = useTheme();

	const ringIn = prog(frame, 0, 16, BACK_OUT);
	const p = prog(frame, COUNT_START, COMPOUND_DONE_FRAME, EASE_IN_OUT);
	// Compounding: value grows exponentially with the day count.
	const growth = Math.log(Math.max(1.0001, script.counterTo));
	const value = Math.exp(growth * p);
	const day = Math.round(365 * p);
	const flash = interpolate(frame, [COMPOUND_DONE_FRAME, COMPOUND_DONE_FRAME + 4, COMPOUND_DONE_FRAME + 24], [0, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const formula = prog(frame, COMPOUND_DONE_FRAME + 4, COMPOUND_DONE_FRAME + 20, BACK_OUT);
	const circumference = 2 * Math.PI * R;

	// Faint exponential curve sweeping behind the ring.
	const curvePts: string[] = [];
	for (let i = 0; i <= 60; i++) {
		const t = i / 60;
		if (t > p) break;
		const x = 90 + t * 900;
		const y = 1400 - (Math.exp(growth * t) - 1) / (script.counterTo - 1 || 1) * 700;
		curvePts.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
	}

	return (
		<AbsoluteFill>
			<Stage>
				<path d={curvePts.join(' ')} fill="none" stroke={theme.muted} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" opacity={0.6} />
				<g transform={`translate(${CX} ${CY}) scale(${ringIn * (1 + 0.04 * flash)})`}>
					<circle r={R} fill="none" stroke={theme.ink} strokeOpacity={0.14} strokeWidth={22} />
					{/* tick marks for each month */}
					{Array.from({length: 12}).map((_, i) => {
						const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
						const lit = p >= i / 12;
						return (
							<line
								key={i}
								x1={Math.cos(a) * (R + 30)}
								y1={Math.sin(a) * (R + 30)}
								x2={Math.cos(a) * (R + 46)}
								y2={Math.sin(a) * (R + 46)}
								stroke={lit ? theme.accent : theme.muted}
								strokeWidth={5}
								strokeLinecap="round"
								opacity={lit ? 1 : 0.5}
							/>
						);
					})}
					<circle
						r={R}
						fill="none"
						stroke={theme.accent}
						strokeWidth={22}
						strokeLinecap="round"
						strokeDasharray={`${circumference * p} ${circumference}`}
						transform="rotate(-90)"
						style={{filter: glow(theme.accent, 1 + flash * 1.5)}}
					/>
					<circle r={R - 40} fill={theme.accent} opacity={0.08 * flash} />
				</g>
			</Stage>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: CY - 130,
					textAlign: 'center',
					fontFamily: fontStack(theme.headlineFont, 'sans'),
					color: theme.ink,
					opacity: ringIn,
				}}
			>
				<div
					style={{
						fontSize: 170,
						fontWeight: 900,
						letterSpacing: '-0.05em',
						lineHeight: 1,
						fontVariantNumeric: 'tabular-nums',
						textShadow: `0 0 ${30 + flash * 50}px ${theme.ink}${flash > 0.2 ? '99' : '44'}`,
					}}
				>
					{value.toFixed(value >= 10 ? 1 : 2)}
					<span style={{color: theme.accent}}>{script.counterSuffix}</span>
				</div>
				<div
					style={{
						marginTop: 18,
						fontSize: 34,
						fontWeight: 800,
						letterSpacing: '0.3em',
						color: theme.muted,
					}}
				>
					DAY {day}
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: CY + R + 70,
					textAlign: 'center',
					fontFamily: fontStack(theme.serifFont, 'serif'),
					fontStyle: 'italic',
					fontSize: 60,
					color: theme.ink,
					opacity: formula,
					scale: String(0.85 + 0.15 * formula),
				}}
			>
				{script.formula}
			</div>
			<Headline kicker={script.kicker} headline={script.headline} headlineStart={48} />
		</AbsoluteFill>
	);
};
