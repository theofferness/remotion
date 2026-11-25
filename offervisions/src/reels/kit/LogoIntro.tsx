import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {ARRIVE, SOFT, SOFT_IN_OUT, prog} from './anim';
import {Backdrop, Particles} from './Atmosphere';
import {BOLD} from './fonts';
import {LogoMark} from './Logo';
import {alpha, softGlow, usePalette} from './palette';
import {SERIES} from './series';
import {SFX} from './Sfx';

/** Length of the logo intro: 1.5 s at 30 fps. */
export const INTRO_FRAMES = 45;

/**
 * 1.5-second logo sting: a thin horizon line opens from the centre, the logo
 * sweeps in along it (left → right, like the wave), glows once, the show name
 * settles underneath, then everything dissolves to the background.
 */
export const LogoIntro: React.FC<{readonly withSound?: boolean; readonly fadeOut?: boolean}> = ({withSound = true, fadeOut = true}) => {
	const frame = useCurrentFrame();
	const {ink} = usePalette();
	const line = prog(frame, 0, 16, SOFT_IN_OUT);
	const draw = prog(frame, 6, 26, SOFT_IN_OUT);
	const glowPulse = prog(frame, 20, 27) * (1 - prog(frame, 27, 40));
	const out = fadeOut ? prog(frame, 37, INTRO_FRAMES, SOFT) : 0;
	const letters = SERIES.show.split('');
	const cy = 880;
	return (
		<AbsoluteFill>
			<Backdrop />
			<Particles />
			<AbsoluteFill style={{opacity: 1 - out}}>
				<svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
					<g style={{filter: softGlow(ink, 0.4)}}>
						<rect x={0} y={0} width={1080} height={1920} fill="none" />
						<line
							x1={540 - 420 * line}
							x2={540 + 420 * line}
							y1={cy + 150}
							y2={cy + 150}
							stroke={ink}
							strokeWidth={4}
							strokeLinecap="round"
							opacity={1 - prog(frame, 22, 36)}
						/>
					</g>
					<g transform={`translate(540 ${cy})`}>
						<LogoMark size={2.1 * (0.95 + 0.05 * draw)} draw={draw} rise={Math.min(1, draw * 1.6)} glow={0.6 + glowPulse * 1.4} />
					</g>
				</svg>
				<div
					style={{
						position: 'absolute',
						top: cy + 190,
						left: 0,
						right: 0,
						textAlign: 'center',
						fontFamily: BOLD,
						fontWeight: 900,
						fontSize: 78,
						letterSpacing: '0.12em',
						paddingLeft: '0.12em',
						color: ink,
						textShadow: `0 0 24px ${alpha(ink, 0.5)}`,
					}}
				>
					{letters.map((ch, i) => {
						const p = prog(frame, 16 + i * 1.2, 28 + i * 1.2, ARRIVE);
						return (
							<span key={i} style={{display: 'inline-block', opacity: p, translate: `0px ${(1 - p) * 18}px`}}>
								{ch}
							</span>
						);
					})}
				</div>
				<div
					style={{
						position: 'absolute',
						top: cy + 300,
						left: 0,
						right: 0,
						textAlign: 'center',
						fontFamily: BOLD,
						fontWeight: 800,
						fontSize: 26,
						letterSpacing: '0.34em',
						paddingLeft: '0.34em',
						color: ink,
						opacity: prog(frame, 24, 34) * 0.85,
					}}
				>
					{SERIES.station.toUpperCase()}
				</div>
			</AbsoluteFill>
			{withSound ? (
				<>
					<Sequence durationInFrames={60} layout="none" name="SFX · air">
						<Audio src={staticFile(SFX.air)} volume={0.35} />
					</Sequence>
					<Sequence from={20} durationInFrames={70} layout="none" name="SFX · chime (sonic logo)">
						<Audio src={staticFile(SFX.chime)} volume={0.45} />
					</Sequence>
				</>
			) : null}
		</AbsoluteFill>
	);
};

/** Plays the logo intro, then the wrapped video. Add INTRO_FRAMES to the composition duration. */
export const WithIntro: React.FC<{readonly intro: boolean; readonly children: React.ReactNode}> = ({intro, children}) =>
	intro ? (
		<>
			<Sequence name="Logo intro" durationInFrames={INTRO_FRAMES}>
				<LogoIntro />
			</Sequence>
			<Sequence name="Video" from={INTRO_FRAMES}>
				{children}
			</Sequence>
		</>
	) : (
		<>{children}</>
	);
