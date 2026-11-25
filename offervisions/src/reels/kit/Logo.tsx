import React from 'react';
import {softGlow, usePalette} from './palette';

/** The Offervisions mark: a horizon line with a half-risen sun. Drawn in SVG units around (0,0). */
export const LogoMark: React.FC<{readonly size?: number; readonly rise?: number; readonly glow?: number; readonly draw?: number}> = ({
	size = 1,
	rise = 1,
	glow = 0.6,
	draw = 1,
}) => {
	const {ink} = usePalette();
	return (
		<g transform={`scale(${size})`} style={{filter: softGlow(ink, glow)}} stroke={ink} strokeLinecap="round" fill="none">
			<clipPath id="logo-sun">
				<rect x={-60} y={-60} width={120} height={60} />
			</clipPath>
			<circle cx={0} cy={44 * (1 - rise)} r={36} strokeWidth={5} clipPath="url(#logo-sun)" opacity={rise} />
			<line x1={-90 * draw} y1={0} x2={90 * draw} y2={0} strokeWidth={5} />
			<line x1={-56 * draw} y1={20} x2={56 * draw} y2={20} strokeWidth={4} opacity={0.6} />
		</g>
	);
};

/** HTML wrapper so the mark can be placed in layouts. */
export const Logo: React.FC<{readonly width?: number; readonly rise?: number; readonly glow?: number; readonly draw?: number}> = ({
	width = 200,
	...rest
}) => (
	<svg width={width} height={width * 0.55} viewBox="-100 -60 200 110" style={{overflow: 'visible'}}>
		<LogoMark {...rest} />
	</svg>
);
