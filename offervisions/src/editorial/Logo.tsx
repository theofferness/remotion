import React from 'react';
import {Img, staticFile} from 'remotion';

/**
 * The supplied OFFERVISIONS logo, never redrawn: the white or black file, chosen by background.
 * `reveal` 0–1 wipes it in left → right (the direction of the wave). Proportions are locked.
 */
export const RATIO = 388 / 543;

export const BrandLogo: React.FC<{readonly variant: 'white' | 'black'; readonly width: number; readonly reveal?: number; readonly opacity?: number; readonly style?: React.CSSProperties}> = ({
	variant,
	width,
	reveal = 1,
	opacity = 1,
	style,
}) => (
	<div style={{width, height: width * RATIO, position: 'relative', opacity, clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`, ...style}}>
		<Img src={staticFile(`brand/offervisions-logo-${variant}.png`)} style={{width: '100%', height: '100%', display: 'block'}} />
	</div>
);
