import React from 'react';
import {glow} from '../theme';

const ARM_LENGTH = 58;

/**
 * Original glowing character, drawn in SVG coordinates.
 * (x, y) is the point between the feet.
 */
export const Figure: React.FC<{
	readonly x: number;
	readonly y: number;
	readonly color: string;
	readonly visorColor: string;
	readonly scale?: number;
	/** 0 = arms down, 1 = arms raised. */
	readonly armRaise?: number;
	/** Small vertical squash for idle breathing / landing. */
	readonly squash?: number;
	readonly opacity?: number;
	readonly glowStrength?: number;
	/** Defaults to `color`. Use a bright colour on a dark silhouette for rim light. */
	readonly glowColor?: string;
}> = ({
	x,
	y,
	color,
	visorColor,
	scale = 1,
	armRaise = 0,
	squash = 0,
	opacity = 1,
	glowStrength = 1,
	glowColor,
}) => {
	const angle = ((15 + armRaise * 135) * Math.PI) / 180;
	const arm = (side: 1 | -1) => {
		const sx = side * 24;
		const sy = -135;
		return {
			x1: sx,
			y1: sy,
			x2: sx + side * Math.sin(angle) * ARM_LENGTH,
			y2: sy + Math.cos(angle) * ARM_LENGTH,
		};
	};
	return (
		<g
			transform={`translate(${x} ${y}) scale(${scale} ${scale * (1 - squash)})`}
			opacity={opacity}
			style={{filter: glow(glowColor ?? color, glowStrength)}}
		>
			<g stroke={color} strokeWidth={10} strokeLinecap="round">
				<line x1={-12} y1={-70} x2={-15} y2={0} />
				<line x1={12} y1={-70} x2={15} y2={0} />
				<line {...arm(-1)} />
				<line {...arm(1)} />
			</g>
			<rect x={-27} y={-152} width={54} height={90} rx={25} fill={color} />
			<circle cx={0} cy={-192} r={31} fill={color} />
			<rect x={-19} y={-200} width={38} height={10} rx={5} fill={visorColor} />
		</g>
	);
};
