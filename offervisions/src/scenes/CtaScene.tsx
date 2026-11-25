import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {BACK_OUT, EASE_IN_OUT, prog} from '../components/anim';
import {Stage} from '../components/Stage';
import type {Brand} from '../schema';
import {fontStack, glow, useTheme} from '../theme';

const LOGO_Y = 560;
const LOGO_R = 120;

/** Frame where the cursor clicks "Follow" (used for the "click" sfx). */
export const CTA_CLICK_FRAME = 74;

/** Scene 6 – logo, wordmark, follow button click and "listen on" platforms. */
export const CtaScene: React.FC<{readonly brand: Brand}> = ({brand}) => {
	const frame = useCurrentFrame();
	const theme = useTheme();
	const headline = fontStack(theme.headlineFont, 'sans');

	const ring = prog(frame, 0, 26, EASE_IN_OUT);
	const sun = prog(frame, 10, 36, BACK_OUT);
	const tagline = prog(frame, 30, 46);
	const button = prog(frame, 38, 54, BACK_OUT);
	const clicked = frame >= CTA_CLICK_FRAME;
	const press = interpolate(frame, [CTA_CLICK_FRAME - 3, CTA_CLICK_FRAME, CTA_CLICK_FRAME + 6], [1, 0.92, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const idlePulse = clicked ? 1 : 1 + 0.03 * Math.sin(frame / 4);
	const burst = prog(frame, CTA_CLICK_FRAME, CTA_CLICK_FRAME + 18);
	const cursorIn = prog(frame, 48, CTA_CLICK_FRAME - 2, EASE_IN_OUT);
	const cursorOut = prog(frame, CTA_CLICK_FRAME + 14, CTA_CLICK_FRAME + 30, EASE_IN_OUT);
	const letters = brand.name.split('');

	return (
		<AbsoluteFill>
			<Stage>
				{/* Logo mark: an eye-shaped horizon with a rising sun */}
				<g transform={`translate(540 ${LOGO_Y})`}>
					<circle r={LOGO_R * 2.2} fill={theme.accent} opacity={0.08 * sun} />
					<circle
						r={LOGO_R}
						fill="none"
						stroke={theme.ink}
						strokeWidth={8}
						pathLength={1}
						strokeDasharray={1}
						strokeDashoffset={1 - ring}
						transform="rotate(-90)"
						style={{filter: glow(theme.ink, 0.9)}}
					/>
					<clipPath id="logoClip">
						<rect x={-LOGO_R} y={-LOGO_R} width={LOGO_R * 2} height={LOGO_R + 18} />
					</clipPath>
					<circle
						cy={18 + 70 * (1 - sun)}
						r={56}
						fill={theme.accent}
						clipPath="url(#logoClip)"
						style={{filter: glow(theme.accent, 1.4)}}
					/>
					<line x1={-LOGO_R + 22} y1={18} x2={LOGO_R - 22} y2={18} stroke={theme.ink} strokeWidth={8} strokeLinecap="round" opacity={ring} />
					<line x1={-50} y1={52} x2={50} y2={52} stroke={theme.ink} strokeWidth={8} strokeLinecap="round" opacity={ring * 0.6} />
				</g>
			</Stage>

			{/* Wordmark */}
			<div
				style={{
					position: 'absolute',
					left: 40,
					right: 40,
					top: LOGO_Y + LOGO_R + 50,
					textAlign: 'center',
					fontFamily: headline,
					fontWeight: 900,
					fontSize: Math.min(112, 980 / (letters.length * 0.72)),
					letterSpacing: '0.02em',
					color: theme.ink,
					whiteSpace: 'nowrap',
				}}
			>
				{letters.map((ch, i) => {
					const p = prog(frame, 14 + i * 2, 30 + i * 2, BACK_OUT);
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								opacity: p,
								translate: `0px ${(1 - p) * 50}px`,
								filter: `blur(${(1 - p) * 8}px)`,
								textShadow: `0 0 30px ${theme.ink}55`,
							}}
						>
							{ch === ' ' ? ' ' : ch}
						</span>
					);
				})}
			</div>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: LOGO_Y + LOGO_R + 190,
					textAlign: 'center',
					fontFamily: fontStack(theme.serifFont, 'serif'),
					fontStyle: 'italic',
					fontSize: 58,
					color: theme.ink,
					opacity: tagline * 0.9,
					translate: `0px ${(1 - tagline) * 16}px`,
				}}
			>
				{brand.tagline}
			</div>

			{/* Follow button */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 1070,
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<div style={{position: 'relative'}}>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							borderRadius: 999,
							border: `4px solid ${theme.accent}`,
							scale: String(1 + burst * 0.45),
							opacity: clicked ? 1 - burst : 0,
						}}
					/>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 18,
							padding: '30px 64px',
							borderRadius: 999,
							fontFamily: headline,
							fontWeight: 900,
							fontSize: 54,
							letterSpacing: '0.08em',
							backgroundColor: clicked ? 'transparent' : theme.accent,
							color: clicked ? theme.accent : theme.onAccent,
							border: `4px solid ${theme.accent}`,
							boxShadow: `0 0 40px ${theme.accent}66`,
							opacity: button,
							scale: String((0.6 + 0.4 * button) * press * idlePulse),
						}}
					>
						<span style={{fontSize: 60, lineHeight: 1}}>{clicked ? '✓' : '+'}</span>
						{clicked ? brand.followedLabel : brand.followLabel}
					</div>
				</div>
			</div>

			{/* Listen on … */}
			<div
				style={{
					position: 'absolute',
					left: 60,
					right: 60,
					top: 1230,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 16,
					fontFamily: headline,
				}}
			>
				<span
					style={{
						width: '100%',
						textAlign: 'center',
						fontWeight: 600,
						fontSize: 30,
						letterSpacing: '0.3em',
						textTransform: 'uppercase',
						color: theme.muted,
						opacity: prog(frame, 84, 96),
						marginBottom: 6,
					}}
				>
					{brand.listenLabel}
				</span>
				{brand.platforms.map((pl, i) => {
					const p = prog(frame, 88 + i * 5, 102 + i * 5, BACK_OUT);
					return (
						<span
							key={pl}
							style={{
								padding: '14px 28px',
								borderRadius: 999,
								border: `3px solid ${theme.ink}55`,
								color: theme.ink,
								fontWeight: 800,
								fontSize: 34,
								opacity: p,
								scale: String(0.7 + 0.3 * p),
							}}
						>
							{pl}
						</span>
					);
				})}
			</div>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 1400,
					textAlign: 'center',
					fontFamily: headline,
					fontWeight: 800,
					fontSize: 40,
					letterSpacing: '0.04em',
					color: theme.accent,
					opacity: prog(frame, 104, 118),
				}}
			>
				{brand.handle}
			</div>

			{/* Cursor */}
			<svg
				width={70}
				height={70}
				viewBox="0 0 24 24"
				style={{
					position: 'absolute',
					left: interpolate(cursorIn, [0, 1], [900, 600]) + cursorOut * 240,
					top: interpolate(cursorIn, [0, 1], [1500, 1125]) + cursorOut * 300,
					opacity: cursorIn * (1 - cursorOut),
					scale: String(press),
					filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))',
				}}
			>
				<path d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.3 L11.4 13.7 L17.5 13.4 Z" fill={theme.ink} stroke={theme.background} strokeWidth={1.4} strokeLinejoin="round" />
			</svg>
		</AbsoluteFill>
	);
};

