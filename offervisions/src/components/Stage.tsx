import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';

/** Full-frame SVG canvas using the video's pixel coordinates (1080×1920). */
export const Stage: React.FC<{
	readonly children: React.ReactNode;
	readonly style?: React.CSSProperties;
}> = ({children, style}) => {
	const {width, height} = useVideoConfig();
	return (
		<AbsoluteFill style={style}>
			<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
				{children}
			</svg>
		</AbsoluteFill>
	);
};
