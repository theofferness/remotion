import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Brand} from '../schema';
import {fontStack, useTheme} from '../theme';

/** Persistent overlay: "on air" brand badge + thin progress bar. */
export const Chrome: React.FC<{readonly brand: Brand; readonly hideAfterFrame: number}> = ({
	brand,
	hideAfterFrame,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const theme = useTheme();
	const intro = interpolate(frame, [4, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const outro = interpolate(frame, [hideAfterFrame, hideAfterFrame + 10], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const pulse = 0.5 + 0.5 * Math.sin(frame / 5);

	return (
		<>
			<div
				style={{
					position: 'absolute',
					top: 130,
					left: 80,
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					opacity: intro * outro,
					translate: `${(1 - intro) * -20}px 0px`,
					fontFamily: fontStack(theme.headlineFont, 'sans'),
					fontWeight: 800,
					fontSize: 26,
					letterSpacing: '0.22em',
					color: theme.ink,
				}}
			>
				<div
					style={{
						width: 14,
						height: 14,
						borderRadius: 7,
						backgroundColor: theme.accent,
						boxShadow: `0 0 ${8 + 10 * pulse}px ${theme.accent}`,
					}}
				/>
				<span>{brand.name}</span>
				<span
					style={{
						padding: '6px 12px',
						border: `2px solid ${theme.muted}`,
						borderRadius: 8,
						color: theme.muted,
						fontSize: 20,
					}}
				>
					{brand.badge}
				</span>
			</div>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					height: 6,
					width: `${(frame / (durationInFrames - 1)) * 100}%`,
					backgroundColor: theme.accent,
					boxShadow: `0 0 16px ${theme.accent}`,
					opacity: 0.9,
				}}
			/>
		</>
	);
};
