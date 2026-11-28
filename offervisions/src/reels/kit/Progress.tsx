import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, usePalette} from './palette';
import {SAFE} from './series';

/** A thin progress line at the top edge of the safe area. */
export const Progress: React.FC<{readonly opacity?: number}> = ({opacity = 0.55}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const {ink} = usePalette();
	return (
		<div
			style={{
				position: 'absolute',
				top: SAFE.top,
				left: 90,
				width: 900 * Math.min(1, frame / (durationInFrames - 1)),
				height: 3,
				borderRadius: 2,
				backgroundColor: ink,
				opacity,
				boxShadow: `0 0 10px ${alpha(ink, 0.7)}`,
			}}
		/>
	);
};
