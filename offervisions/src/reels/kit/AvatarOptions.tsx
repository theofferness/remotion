import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SOFT, prog} from './anim';
import {Backdrop, Particles} from './Atmosphere';
import {AVATAR_INFO, Avatar, type AvatarVariant} from './Avatars';
import {BOLD, HAND, ITALIC} from './fonts';
import {HandSvg} from './HandSvg';
import {alpha, PaletteProvider} from './palette';
import {SEASONS} from './series';

const ORDER: AvatarVariant[] = ['classic', 'pebble', 'sprout', 'page', 'bird', 'ember'];
const ROW_Y = [500, 960];
const COL_X = [320, 960, 1600];

/** Review sheet: the current learner + 5 alternatives, walking then holding up their book. */
export const AvatarOptions: React.FC<{readonly order?: AvatarVariant[]; readonly subtitle?: string; readonly firstLabel?: string}> = ({
	order = ORDER,
	subtitle = 'current + five options',
	firstLabel = 'NOW · ',
}) => {
	const frame = useCurrentFrame();
	const ink = SEASONS.winter.ink;
	const walking = frame < 60;
	const raise = prog(frame, 64, 84, SOFT);
	return (
		<PaletteProvider palette={SEASONS.winter}>
			<AbsoluteFill>
				<Backdrop />
				<Particles count={30} />
				<HandSvg>
					{ROW_Y.map((y) => (
						<line key={y} x1={40} x2={1880} y1={y} y2={y} stroke={ink} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
					))}
					{order.map((v, i) => (
						<Avatar
							key={v}
							variant={v}
							x={COL_X[i % 3]}
							y={ROW_Y[Math.floor(i / 3)]}
							scale={0.95}
							walk={walking ? frame / 4 + i : undefined}
							raise={raise * 0.5}
							bookGlow={0.2 + raise * 0.8}
							tilt={-6}
						/>
					))}
				</HandSvg>
				<div style={{position: 'absolute', top: 34, left: 0, right: 0, textAlign: 'center', color: ink}}>
					<span style={{fontFamily: BOLD, fontWeight: 900, fontSize: 40, letterSpacing: '0.14em'}}>THE LEARNER</span>
					<span style={{fontFamily: ITALIC, fontStyle: 'italic', fontSize: 38, marginLeft: 18, opacity: 0.85}}>{subtitle}</span>
				</div>
				{order.map((v, i) => (
					<div
						key={v}
						style={{
							position: 'absolute',
							left: COL_X[i % 3] - 300,
							width: 600,
							top: ROW_Y[Math.floor(i / 3)] + 14,
							textAlign: 'center',
							color: ink,
						}}
					>
						<div style={{fontFamily: BOLD, fontWeight: 900, fontSize: 34, letterSpacing: '0.06em', textShadow: `0 0 16px ${alpha(ink, 0.4)}`}}>
							{i === 0 ? firstLabel : order === ORDER ? `${i} · ` : ''}
							{AVATAR_INFO[v].name.toUpperCase()}
						</div>
						<div style={{fontFamily: HAND, fontWeight: 600, fontSize: 32, opacity: 0.85}}>{AVATAR_INFO[v].idea}</div>
					</div>
				))}
			</AbsoluteFill>
		</PaletteProvider>
	);
};
