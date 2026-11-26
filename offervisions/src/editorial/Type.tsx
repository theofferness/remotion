import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SANS, SERIF} from './fonts';
import {EXPO_OUT, QUART_OUT, p} from './motion';

type Common = {
	readonly text: string;
	/** Local frame the reveal starts. */
	readonly at: number;
	/** Local frame the text starts leaving (optional). */
	readonly out?: number;
	readonly color: string;
	readonly size: number;
	readonly style?: React.CSSProperties;
};

const exit = (frame: number, out?: number) => (out === undefined ? 0 : p(frame, out, out + 12, QUART_OUT));

/**
 * Editorial serif line: each word rises out of its own mask, staggered.
 * `italic` for expressive phrases, regular for titles.
 */
export const SerifWords: React.FC<Common & {readonly italic?: boolean; readonly weight?: number; readonly stagger?: number; readonly tracking?: string; readonly lineHeight?: number}> = ({
	text,
	at,
	out,
	color,
	size,
	italic = false,
	weight = 400,
	stagger = 3,
	tracking = '-0.01em',
	lineHeight = 1.08,
	style,
}) => {
	const frame = useCurrentFrame();
	const e = exit(frame, out);
	const words = text.split(' ');
	return (
		<div
			style={{
				fontFamily: SERIF,
				fontStyle: italic ? 'italic' : 'normal',
				fontWeight: weight,
				fontSize: size,
				lineHeight,
				letterSpacing: tracking,
				color,
				opacity: 1 - e,
				translate: `0px ${-e * 14}px`,
				fontVariationSettings: `"opsz" ${Math.min(72, Math.max(7, size / 2))}`,
				...style,
			}}
		>
			{words.map((w, i) => {
				const k = p(frame, at + i * stagger, at + i * stagger + 22, EXPO_OUT);
				return (
					<span key={i} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.12em', marginBottom: '-0.12em'}}>
						<span style={{display: 'inline-block', translate: `0px ${(1 - k) * 105}%`}}>
							{w}
							{i < words.length - 1 ? ' ' : ''}
						</span>
					</span>
				);
			})}
		</div>
	);
};

/** Small tracked sans caps that settle from wide letter-spacing (like film credits). */
export const Tracked: React.FC<Common & {readonly weight?: number; readonly spacing?: number}> = ({text, at, out, color, size, weight = 500, spacing = 0.3, style}) => {
	const frame = useCurrentFrame();
	const k = p(frame, at, at + 26, EXPO_OUT);
	const e = exit(frame, out);
	const ls = spacing + (1 - k) * 0.25;
	return (
		<div
			style={{
				fontFamily: SANS,
				fontWeight: weight,
				fontSize: size,
				letterSpacing: `${ls}em`,
				paddingLeft: `${ls}em`,
				textTransform: 'uppercase',
				color,
				whiteSpace: 'nowrap',
				...style,
				opacity: k * (1 - e) * (typeof style?.opacity === 'number' ? style.opacity : 1),
			}}
		>
			{text}
		</div>
	);
};

/** Bold sans line (as the chapter titles on the covers). Rises from a mask as one line. */
export const SansTitle: React.FC<Common & {readonly weight?: number}> = ({text, at, out, color, size, weight = 600, style}) => {
	const frame = useCurrentFrame();
	const k = p(frame, at, at + 22, EXPO_OUT);
	const e = exit(frame, out);
	return (
		<div style={{overflow: 'hidden', paddingBottom: '0.1em', opacity: 1 - e, ...style}}>
			<div style={{fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: '-0.015em', color, translate: `0px ${(1 - k) * 105}%`, lineHeight: 1.1}}>{text}</div>
		</div>
	);
};

/** Hairline rule that draws out from its centre. */
export const Rule: React.FC<{readonly at: number; readonly width: number; readonly color: string; readonly out?: number; readonly thickness?: number; readonly opacity?: number}> = ({
	at,
	width,
	color,
	out,
	thickness = 2,
	opacity = 0.7,
}) => {
	const frame = useCurrentFrame();
	const k = p(frame, at, at + 20, EXPO_OUT);
	const e = exit(frame, out);
	return <div style={{width: width * k, height: thickness, background: color, opacity: opacity * (1 - e), margin: '0 auto'}} />;
};
