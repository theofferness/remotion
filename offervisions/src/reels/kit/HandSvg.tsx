import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Full-frame SVG whose contents look slightly hand-drawn:
 * a gentle displacement wobble that "boils" a few times per second.
 */
export const HandSvg: React.FC<{
	readonly children: React.ReactNode;
	readonly style?: React.CSSProperties;
	/** Wobble amount in px. */
	readonly wobble?: number;
}> = ({children, style, wobble = 3.2}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const slot = Math.floor(frame / 5) % 6;
	const id = `hand-${slot}-${wobble}`;
	return (
		<AbsoluteFill style={{pointerEvents: 'none', ...style}}>
			<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
				<defs>
					<filter id={id} filterUnits="userSpaceOnUse" x={-200} y={-200} width={width + 400} height={height + 400}>
						<feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={slot + 1} result="n" />
						<feDisplacementMap in="SourceGraphic" in2="n" scale={wobble} xChannelSelector="R" yChannelSelector="G" />
					</filter>
				</defs>
				<g filter={`url(#${id})`}>{children}</g>
			</svg>
		</AbsoluteFill>
	);
};
