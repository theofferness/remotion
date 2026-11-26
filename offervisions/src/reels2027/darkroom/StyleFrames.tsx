import React from 'react';
import {AbsoluteFill} from 'remotion';
import '../../editorial/fonts';
import {SANS, SERIF} from '../../editorial/fonts';
import {SEASONS, type SeasonKey} from '../../editorial/theme';
import {CropMarks, DevelopMask, EdgeCode, Grain, INK_ON_PAPER, LogoImage, NAVY, PAPER, Room, Sheen, Sheet, Sprockets} from './Darkroom';

/* ─────────────────────────────────────────────────────────────
 * STYLE FRAME A – "Latent": the first page developing in the tray.
 * ───────────────────────────────────────────────────────────── */
export const StyleFrameA: React.FC = () => {
	const W = 840;
	const H = 1080;
	return (
		<AbsoluteFill>
			<Room light={{x: 52, y: 48}} />
			<Sheet x={120} y={470} w={W} h={H} rx={34} rz={-7} shadow={0.7}>
				<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
					<DevelopMask id="a1" w={W} h={H} progress={0.92} seed={4} />
					<DevelopMask id="a2" w={W} h={H} progress={0.62} seed={9} />
					<DevelopMask id="a3" w={W} h={H} progress={0.8} seed={2} scale={0.02} />
					<g mask="url(#a3)">
						<EdgeCode x={60} y={78} text="OFFERVISIONS 2027  ▸  PART ONE  ▸  WINTER" color={INK_ON_PAPER} size={17} opacity={0.75} />
						<EdgeCode x={W - 160} y={78} text="FRAME 00" color={INK_ON_PAPER} size={17} opacity={0.75} />
						<line x1={60} y1={100} x2={W - 60} y2={100} stroke={INK_ON_PAPER} strokeWidth={1.5} opacity={0.3} />
					</g>
					<g mask="url(#a1)">
						<text x={60} y={380} fill={INK_ON_PAPER} fontFamily={SERIF} fontSize={124} fontWeight={400} letterSpacing={-2}>
							The first
						</text>
						<text x={60} y={510} fill={INK_ON_PAPER} fontFamily={SERIF} fontSize={124} fontWeight={400} letterSpacing={-2}>
							page
						</text>
					</g>
					<g mask="url(#a2)">
						<text x={60} y={650} fill={INK_ON_PAPER} fontFamily={SERIF} fontStyle="italic" fontSize={78} fontWeight={300}>
							isn’t about
						</text>
						<text x={60} y={740} fill={INK_ON_PAPER} fontFamily={SERIF} fontStyle="italic" fontSize={78} fontWeight={300}>
							fixing anything.
						</text>
					</g>
					<g mask="url(#a3)" opacity={0.5}>
						<EdgeCode x={60} y={H - 54} text="▸ 00   ▸ 00A   ▸ 01   ▸ 01A   ▸ 02" color={INK_ON_PAPER} size={15} opacity={0.6} />
					</g>
				</svg>
				<Sheen angle={118} at={34} />
			</Sheet>
			<Grain seed={7} opacity={0.08} />
		</AbsoluteFill>
	);
};

/* ─────────────────────────────────────────────────────────────
 * STYLE FRAME B – "Contact sheet": the year as 24 frames; Part One selected.
 * ───────────────────────────────────────────────────────────── */
const partOf = (c: number): SeasonKey => (c <= 4 ? 'winter' : c <= 10 ? 'spring' : c <= 16 ? 'summer' : c <= 22 ? 'fall' : 'epilogue');

export const StyleFrameB: React.FC = () => {
	const W = 900;
	const H = 980;
	const cols = 4;
	const fw = 176;
	const fh = 118;
	const gx = 22;
	const left = (W - (cols * fw + (cols - 1) * gx)) / 2;
	const rowH = 150;
	const top0 = 96;
	return (
		<AbsoluteFill>
			<Room light={{x: 40, y: 60}} />
			{/* caption, set like a photo-editor's note */}
			<div style={{position: 'absolute', top: 290, left: 84, right: 84, color: '#fff'}}>
				<div style={{fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: '0.24em'}}>IN PART ONE</div>
				<div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 92, lineHeight: 1.02, marginTop: 14, letterSpacing: '-0.01em'}}>Letting Go of</div>
				<div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 300, fontSize: 92, lineHeight: 1.02, letterSpacing: '-0.01em'}}>Resolutions</div>
				<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: '0.2em', marginTop: 22, opacity: 0.9}}>CH 01 · MONDAY, JANUARY 18</div>
			</div>
			<Sheet x={120} y={640} w={W} h={H} rx={16} rz={-4} shadow={0.6}>
				<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
					<EdgeCode x={left} y={56} text="OFFERVISIONS 2027  ▸  CONTACT SHEET  ▸  ROLL 01" color={INK_ON_PAPER} size={16} opacity={0.7} />
					{Array.from({length: 6}).map((_, row) => {
						const y = top0 + row * rowH;
						return (
							<g key={row}>
								{/* film strip behind each row */}
								<rect x={left - 18} y={y - 18} width={cols * fw + (cols - 1) * gx + 36} height={fh + 36} fill={NAVY} opacity={0.94} />
								<Sprockets x={left - 6} y={y - 14} length={cols * fw + (cols - 1) * gx + 12} color={PAPER} />
								<Sprockets x={left - 6} y={y + fh + 4} length={cols * fw + (cols - 1) * gx + 12} color={PAPER} />
								{Array.from({length: cols}).map((__, c) => {
									const n = row * cols + c + 1;
									const s = SEASONS[partOf(n)];
									const x = left + c * (fw + gx);
									const selected = n <= 4;
									return (
										<g key={c} opacity={selected ? 1 : 0.55}>
											<rect x={x} y={y} width={fw} height={fh} fill={s.bg} stroke={selected ? PAPER : 'none'} strokeWidth={1} />
											<text x={x + 14} y={y + fh - 16} fill={s.ink} fontFamily={SERIF} fontSize={44} fontWeight={300}>
												{String(n).padStart(2, '0')}
											</text>
											<text x={x + fw - 12} y={y + 22} textAnchor="end" fill={s.ink} opacity={0.7} fontFamily={SANS} fontSize={11} fontWeight={600} letterSpacing={2}>
												{selected ? 'WINTER' : ''}
											</text>
										</g>
									);
								})}
							</g>
						);
					})}
					{/* grease-pencil selection on Chapter 1 */}
					<CropMarks x={left} y={top0} w={fw} h={fh} color={PAPER} gap={7} len={26} width={4} />
				</svg>
			</Sheet>
			<Grain seed={11} opacity={0.08} />
		</AbsoluteFill>
	);
};

/* ─────────────────────────────────────────────────────────────
 * STYLE FRAME C – "Final print": the logo develops, the sheet darkens into the Chapter 1 cover.
 * ───────────────────────────────────────────────────────────── */
export const StyleFrameC: React.FC = () => {
	const W = 860;
	const H = 1120;
	return (
		<AbsoluteFill>
			<Room light={{x: 50, y: 52}} />
			<Sheet x={110} y={440} w={W} h={H} rx={20} rz={2.5} shadow={0.7}>
				<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
					<DevelopMask id="c-dark" w={W} h={H} progress={0.86} seed={6} scale={0.004} />
					<DevelopMask id="c-logo" w={W} h={H} progress={0.9} seed={13} scale={0.01} />
					<DevelopMask id="c-type" w={W} h={H} progress={0.78} seed={21} scale={0.01} />
					<DevelopMask id="c-sub" w={W} h={H} progress={0.6} seed={5} scale={0.01} />
					{/* the paper darkening to midnight navy */}
					<rect width={W} height={H} fill={NAVY} mask="url(#c-dark)" />
					<g mask="url(#c-logo)">
						<LogoImage x={W / 2 - 80} y={150} w={160} variant="white" />
						<text x={W / 2} y={330} textAnchor="middle" fill="#fff" fontFamily={SANS} fontSize={26} fontWeight={400} letterSpacing={8.5}>
							OFFERVISIONS
						</text>
					</g>
					<g mask="url(#c-type)">
						<text x={W / 2} y={470} textAnchor="middle" fill="#fff" fontFamily={SANS} fontSize={24} fontWeight={500} letterSpacing={7}>
							PART ONE · WINTER
						</text>
						<text x={W / 2} y={515} textAnchor="middle" fill="#fff" fontFamily={SERIF} fontStyle="italic" fontSize={34} fontWeight={300}>
							Visualisation
						</text>
						<text x={W / 2} y={680} textAnchor="middle" fill="#fff" fontFamily={SERIF} fontSize={150} fontWeight={400} letterSpacing={-2}>
							Chapter 1
						</text>
					</g>
					<g mask="url(#c-sub)">
						<text x={W / 2} y={780} textAnchor="middle" fill="#fff" fontFamily={SANS} fontSize={54} fontWeight={600}>
							Letting Go of Resolutions
						</text>
						<text x={W / 2} y={900} textAnchor="middle" fill="#fff" fontFamily={SERIF} fontStyle="italic" fontSize={38} fontWeight={300}>
							Monday, January 18
						</text>
					</g>
					<g mask="url(#c-dark)">
						<EdgeCode x={56} y={H - 50} text="OFFERVISIONS 2027  ▸  PART ONE  ▸  CHAPTER 01" color="#ffffff" size={16} opacity={0.6} />
					</g>
				</svg>
				<Sheen angle={112} at={58} />
			</Sheet>
			<Grain seed={3} opacity={0.08} />
		</AbsoluteFill>
	);
};
