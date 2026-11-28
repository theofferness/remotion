import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontStack, useTheme} from '../theme';

/** Splits "Offer yourself a *vision*." into words, flagging *accent* words. */
export const parseAccent = (text: string) =>
	text
		.split(/\s+/)
		.filter(Boolean)
		.map((word) => {
			const m = word.match(/^\*([^*]+)\*(.*)$/);
			return m
				? {text: m[1], trailing: m[2], accent: true}
				: {text: word.replace(/\*/g, ''), trailing: '', accent: false};
		});

/**
 * Top-of-frame title block used by every scene:
 * a small italic serif "kicker" that types on, then a big bold headline
 * whose words rise in one by one.
 */
export const Headline: React.FC<{
	readonly kicker: string;
	readonly headline: string;
	/** Frame (within the scene) the kicker starts typing. */
	readonly kickerStart?: number;
	/** Frame (within the scene) the headline starts revealing. */
	readonly headlineStart?: number;
	readonly top?: number;
}> = ({kicker, headline, kickerStart = 6, headlineStart = 40, top = 250}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const theme = useTheme();

	const charsPerFrame = 1.1;
	const typed = Math.max(0, Math.floor((frame - kickerStart) * charsPerFrame));
	const typing = typed > 0 && typed < kicker.length;
	const words = parseAccent(headline);

	// Everything drifts up & fades just before the scene ends.
	const exit = interpolate(frame, [durationInFrames - 14, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.cubic),
	});

	return (
		<div
			style={{
				position: 'absolute',
				top,
				left: 80,
				right: 80,
				textAlign: 'center',
				opacity: 1 - exit,
				translate: `0px ${-30 * exit}px`,
			}}
		>
			<div
				style={{
					fontFamily: fontStack(theme.serifFont, 'serif'),
					fontStyle: 'italic',
					fontSize: 64,
					color: theme.ink,
					opacity: 0.88,
					minHeight: 80,
				}}
			>
				{kicker.slice(0, typed)}
				<span
					style={{
						display: 'inline-block',
						width: 3,
						height: 54,
						marginLeft: 6,
						translate: '0px 8px',
						backgroundColor: theme.accent,
						opacity: typing || (typed === 0 && frame >= kickerStart - 4) ? 1 : 0,
					}}
				/>
			</div>
			<div
				style={{
					marginTop: 14,
					fontFamily: fontStack(theme.headlineFont, 'sans'),
					fontWeight: 900,
					fontSize: 108,
					lineHeight: 1.02,
					letterSpacing: '-0.035em',
					textTransform: 'uppercase',
					color: theme.ink,
				}}
			>
				{words.map((w, i) => {
					const start = headlineStart + i * 4;
					const p = interpolate(frame, [start, start + 0.5 * fps], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					});
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								marginRight: '0.22em',
								opacity: p,
								translate: `0px ${(1 - p) * 60}px`,
								scale: String(0.9 + 0.1 * p),
								filter: `blur(${(1 - p) * 10}px)`,
								color: w.accent ? theme.accent : theme.ink,
								textShadow: w.accent
									? `0 0 24px ${theme.accent}99, 0 0 60px ${theme.accent}55`
									: `0 0 30px ${theme.ink}44`,
							}}
						>
							{w.text}
							<span style={{color: theme.ink}}>{w.trailing}</span>
						</span>
					);
				})}
			</div>
		</div>
	);
};
