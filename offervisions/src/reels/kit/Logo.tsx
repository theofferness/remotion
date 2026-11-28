import React, {useId} from 'react';
import {staticFile} from 'remotion';
import {softGlow, usePalette} from './palette';

/**
 * The real Offervisions logo (ring + wave), from public/brand/offervisions-logo.png.
 * It is used as a mask and filled with the season's ink colour, so it always matches the palette.
 */
export const LOGO_FILE = 'brand/offervisions-logo.png';
const RATIO = 388 / 543; // height / width of the trimmed file

/** SVG version, centred on (0, 0). `size` 1 = 180 px wide. `draw` wipes it in left→right, `rise` fades/lifts it. */
export const LogoMark: React.FC<{readonly size?: number; readonly rise?: number; readonly glow?: number; readonly draw?: number}> = ({
	size = 1,
	rise = 1,
	glow = 0.6,
	draw = 1,
}) => {
	const {ink} = usePalette();
	const id = useId().replace(/:/g, '');
	const w = 180;
	const h = w * RATIO;
	return (
		<g transform={`translate(0 ${(1 - rise) * 10}) scale(${size})`} opacity={rise} style={glow > 0 ? {filter: softGlow(ink, glow)} : undefined}>
			<defs>
				<mask id={`logo-${id}`} maskUnits="userSpaceOnUse" x={-w / 2} y={-h / 2} width={w} height={h}>
					<image href={staticFile(LOGO_FILE)} x={-w / 2} y={-h / 2} width={w} height={h} preserveAspectRatio="xMidYMid meet" />
				</mask>
				<clipPath id={`logo-wipe-${id}`}>
					<rect x={-w / 2} y={-h / 2} width={w * draw} height={h} />
				</clipPath>
			</defs>
			<rect x={-w / 2} y={-h / 2} width={w} height={h} fill={ink} mask={`url(#logo-${id})`} clipPath={`url(#logo-wipe-${id})`} />
		</g>
	);
};

/** HTML wrapper for layouts. */
export const Logo: React.FC<{readonly width?: number; readonly rise?: number; readonly glow?: number; readonly draw?: number}> = ({
	width = 200,
	...rest
}) => (
	<svg width={width} height={width * RATIO} viewBox={`-90 ${-90 * RATIO} 180 ${180 * RATIO}`} style={{overflow: 'visible'}}>
		<LogoMark {...rest} />
	</svg>
);
