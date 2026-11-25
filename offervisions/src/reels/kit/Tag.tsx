import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ARRIVE, prog} from './anim';
import {BOLD, HAND} from './fonts';
import {softGlow, usePalette} from './palette';

/**
 * A little glowing gift-tag on a string that pops onto an object.
 * (x, y) = where the string attaches to the object. The tag hangs at (x+dx, y+dy).
 */
export const Tag: React.FC<{
	readonly x: number;
	readonly y: number;
	readonly dx?: number;
	readonly dy?: number;
	readonly text: string;
	/** Optional tiny all-caps line above the handwritten text. */
	readonly overline?: string;
	/** Frame (local) when the tag pops in. */
	readonly at: number;
	readonly out?: number;
	readonly size?: number;
	readonly glow?: number;
}> = ({x, y, dx = 0, dy = -120, text, overline, at, out, size = 46, glow = 0.6}) => {
	const frame = useCurrentFrame();
	const {ink, bg} = usePalette();
	const p = prog(frame, at, at + 14, ARRIVE);
	const string = prog(frame, at - 4, at + 8);
	const fade = out === undefined ? 1 : 1 - prog(frame, out, out + 14);
	if (p <= 0 && string <= 0) return null;
	const textW = Math.max(text.length * size * 0.42, overline ? overline.length * 15 : 0);
	const w = textW + 70;
	const h = overline ? size + 48 : size + 26;
	const tx = x + dx;
	const ty = y + dy;
	const sway = Math.sin(frame / 30 + x) * 2;
	return (
		<g opacity={fade}>
			<path
				d={`M ${x} ${y} Q ${(x + tx) / 2} ${(y + ty) / 2 + 20} ${tx} ${ty}`}
				fill="none"
				stroke={ink}
				strokeWidth={2.5}
				strokeDasharray="1"
				pathLength={1}
				strokeDashoffset={1 - string}
				opacity={0.8}
			/>
			<g transform={`translate(${tx} ${ty}) rotate(${sway}) scale(${0.85 + 0.15 * p})`} opacity={p} style={{filter: softGlow(ink, glow)}}>
				<path
					d={`M 0 0 L 22 ${-h / 2} L ${w} ${-h / 2} Q ${w + 8} ${-h / 2} ${w + 8} ${-h / 2 + 8} L ${w + 8} ${h / 2 - 8} Q ${w + 8} ${h / 2} ${w} ${h / 2} L 22 ${h / 2} Z`}
					fill={bg}
					stroke={ink}
					strokeWidth={3.5}
					strokeLinejoin="round"
				/>
				<circle cx={20} cy={0} r={6} fill="none" stroke={ink} strokeWidth={3} />
				{overline ? (
					<text
						x={36 + (w - 30) / 2}
						y={-h / 2 + 30}
						textAnchor="middle"
						fontFamily={BOLD}
						fontWeight={900}
						fontSize={18}
						letterSpacing="0.18em"
						fill={ink}
						opacity={0.85}
					>
						{overline}
					</text>
				) : null}
				<text
					x={36 + (w - 30) / 2}
					y={overline ? h / 2 - 16 : size * 0.34}
					textAnchor="middle"
					fontFamily={HAND}
					fontWeight={700}
					fontSize={size}
					fill={ink}
				>
					{text}
				</text>
			</g>
		</g>
	);
};
