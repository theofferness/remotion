import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SOFT, prog} from './anim';
import {BOLD, HAND, ITALIC} from './fonts';
import {Logo} from './Logo';
import {alpha, usePalette} from './palette';
import {SERIES} from './series';

/**
 * Closing call to action: logo → show name → "what to do" line → when/where.
 * Enters in a calm stagger from `at` (local frame) and stays visible to the end.
 */
export const Cta: React.FC<{
	readonly at: number;
	/** e.g. "The book opens Monday, 11 AM." */
	readonly line: string;
	/** e.g. "Introduction · Monday, January 11" */
	readonly detail?: string;
	readonly top?: number;
}> = ({at, line, detail, top = 330}) => {
	const frame = useCurrentFrame();
	const {ink} = usePalette();
	const step = (i: number) => prog(frame, at + i * 7, at + i * 7 + 16, SOFT);
	const rise = (i: number) => ({opacity: step(i), translate: `0px ${(1 - step(i)) * 14}px`});
	return (
		<div style={{position: 'absolute', top, left: 80, right: 80, textAlign: 'center', color: ink}}>
			<div style={{display: 'flex', justifyContent: 'center', ...rise(0)}}>
				<Logo width={190} rise={step(0)} draw={step(0)} glow={0.7} />
			</div>
			<div
				style={{
					fontFamily: BOLD,
					fontWeight: 900,
					fontSize: 100,
					letterSpacing: '0.04em',
					lineHeight: 1,
					marginTop: 6,
					textShadow: `0 0 26px ${alpha(ink, 0.45)}`,
					...rise(1),
				}}
			>
				{SERIES.show}
			</div>
			<div style={{fontFamily: ITALIC, fontStyle: 'italic', fontSize: 56, marginTop: 14, ...rise(2)}}>{line}</div>
			<div
				style={{
					fontFamily: BOLD,
					fontWeight: 800,
					fontSize: 30,
					letterSpacing: '0.28em',
					marginTop: 18,
					paddingLeft: '0.28em',
					textShadow: `0 0 18px ${alpha(ink, 0.5)}`,
					...rise(3),
				}}
			>
				{`${SERIES.airtime.toUpperCase()} · ${SERIES.station.toUpperCase()}`}
			</div>
			{detail ? <div style={{fontFamily: HAND, fontWeight: 600, fontSize: 44, marginTop: 8, opacity: 0.9 * step(4)}}>{detail}</div> : null}
		</div>
	);
};
