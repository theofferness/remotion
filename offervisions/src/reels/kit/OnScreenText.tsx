import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SOFT, prog} from './anim';
import {BOLD, ITALIC} from './fonts';
import {alpha, usePalette} from './palette';

/**
 * The two-line text block used in every scene:
 * a small italic line, then (optionally) one bold ALL-CAPS key phrase.
 * Default position sits just under the title banner, clear of Instagram's UI.
 */
export const OnScreenText: React.FC<{
	readonly small?: string;
	readonly big?: string;
	/** Local frame the text starts appearing. */
	readonly start?: number;
	/** Local frame the text starts fading out (omit to keep it). */
	readonly end?: number;
	/** Delay before the bold line, in frames. */
	readonly bigDelay?: number;
	readonly top?: number;
	readonly bigSize?: number;
}> = ({small, big, start = 0, end, bigDelay = 14, top = 360, bigSize = 92}) => {
	const frame = useCurrentFrame();
	const {ink} = usePalette();
	const out = end === undefined ? 0 : prog(frame, end, end + 14);
	const sp = prog(frame, start, start + 18, SOFT);
	const words = (big ?? '').split(/\s+/).filter(Boolean);
	return (
		<div style={{position: 'absolute', top, left: 90, right: 90, textAlign: 'center', opacity: 1 - out}}>
			{small ? (
				<div
					style={{
						fontFamily: ITALIC,
						fontStyle: 'italic',
						fontSize: 58,
						lineHeight: 1.15,
						color: ink,
						opacity: 0.92 * sp,
						translate: `0px ${(1 - sp) * 16}px`,
						textShadow: `0 0 20px ${alpha(ink, 0.25)}`,
					}}
				>
					{small}
				</div>
			) : null}
			{words.length > 0 ? (
				<div
					style={{
						marginTop: 16,
						fontFamily: BOLD,
						fontWeight: 900,
						fontSize: bigSize,
						lineHeight: 1.02,
						letterSpacing: '0.01em',
						textTransform: 'uppercase',
						color: ink,
					}}
				>
					{words.map((w, i) => {
						const p = prog(frame, start + bigDelay + i * 4, start + bigDelay + i * 4 + 18);
						return (
							<span
								key={i}
								style={{
									display: 'inline-block',
									marginRight: '0.24em',
									opacity: p,
									translate: `0px ${(1 - p) * 26}px`,
									filter: `blur(${(1 - p) * 6}px)`,
									textShadow: `0 0 26px ${alpha(ink, 0.45)}, 0 0 60px ${alpha(ink, 0.2)}`,
								}}
							>
								{w}
							</span>
						);
					})}
				</div>
			) : null}
		</div>
	);
};
