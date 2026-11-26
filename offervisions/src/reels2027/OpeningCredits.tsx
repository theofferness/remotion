import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '../editorial/fonts';
import {Atmos, hexA, Motes} from '../editorial/Atmos';
import {SANS} from '../editorial/fonts';
import {LightLine, type LineKey} from '../editorial/Line';
import {BrandLogo, RATIO} from '../editorial/Logo';
import {EXPO_OUT, IN_OUT, QUART_OUT, mix, p} from '../editorial/motion';
import {PageTurn} from '../editorial/PageTurn';
import {BloomReveal, CloseReveal, IrisReveal, RiseReveal, UnfoldReveal} from '../editorial/Reveals';
import {BRAND, type Season, SEASONS, type SeasonKey} from '../editorial/theme';
import {Rule, SansTitle, SerifWords, Tracked} from '../editorial/Type';
import type {Pt} from '../reels/kit/shapes';
import {SFX} from '../reels/kit/Sfx';

/*
 * READABILITY SCALE (1080 px wide ≈ 390 pt on a phone, so divide by ~2.8):
 *   headline 130–200 px · supporting sentence 56–64 px (Literata 400) · labels 40–52 px (Inter 500, light tracking)
 *   All text at full opacity. One idea per screen.
 */
const TYPE = {headline: 136, support: 60, label: 44};

/* ─────────────── timeline (frames @ 30 fps) ─────────────── */
const PAGE_LEN = 92;
const PARTS: SeasonKey[] = ['winter', 'spring', 'summer', 'fall', 'epilogue'];
const T = {
	hook: [0, 92],
	brand: [92, 192],
	tagline: [192, 344],
	host: [344, 450],
	radio: [450, 550],
	year: [550, 620],
} as const;
const PAGES_START = 614;
const CH = PAGES_START + PAGE_LEN * 5;
const T2 = {
	chapters: [CH, CH + 100],
	invite: [CH + 100, CH + 172],
	end: [CH + 172, CH + 172 + 225],
} as const;
export const OPENING_FRAMES = T2.end[1];

/** How each section of the book opens – one family, five treatments. Frames each reveal takes. */
const REVEAL: Record<SeasonKey | 'close', number> = {intro: 0, winter: 24, spring: 16, summer: 18, fall: 20, epilogue: 24, close: 18};
const WINTER_DOT = {x: 220, y: 1060};

const INTRO = SEASONS.intro;
const INK = INTRO.ink;

/** Copy for Video 1 – all from the 2027 scripts and the Introduction cover. */
export const OPENING_COPY = {
	hook: ['This year', 'is built like a book.'],
	podcast: 'A self-development podcast',
	tagline: 'Opening up to yourself, to others, and to everything life has to offer.',
	hostedBy: 'Hosted by',
	hostLine: 'A fellow learner, not an expert.',
	slot: ['Mondays', '11 AM'],
	year: ['Four seasons.', 'One epilogue.'],
	chapters: '24 chapters.',
	chaptersSub: 'A new one every other Monday.',
	invite: 'Invitations, not homework.',
	end: {title: 'Introduction', subtitle: 'Welcome to Offervisions', quote: '“What do I want this year to offer me?”'},
};

/* ─────────────── helpers ─────────────── */

const Center: React.FC<{readonly top: number; readonly children: React.ReactNode; readonly style?: React.CSSProperties}> = ({top, children, style}) => (
	<div style={{position: 'absolute', top, left: 70, right: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', ...style}}>{children}</div>
);

const hline = (y: number, x1: number, x2: number): Pt[] => [
	[x1, y],
	[x2, y],
];

/* ─────────────── 1 · hook: a point of light becomes the horizon ─────────────── */

const Hook: React.FC = () => {
	const t = useCurrentFrame();
	const spark = 1 - p(t, 6, 22);
	return (
		<AbsoluteFill style={{scale: String(interpolate(t, [0, 92], [1, 1.03]))}}>
			<AbsoluteFill style={{background: `radial-gradient(circle 260px at 540px 1030px, ${hexA(INK, 0.18 * spark)}, transparent 70%)`}} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<circle cx={540} cy={1030} r={5} fill={INK} opacity={spark} style={{filter: `drop-shadow(0 0 10px ${INK})`}} />
			</svg>
			<Center top={680}>
				<SerifWords text={OPENING_COPY.hook[0]} at={3} out={80} color={INK} size={150} />
				<SerifWords text={OPENING_COPY.hook[1]} at={8} out={80} color={INK} size={100} italic weight={400} />
			</Center>
		</AbsoluteFill>
	);
};

/* ─────────────── 2 · the book opens; the logo and the show appear in its light ─────────────── */

const Brand: React.FC = () => {
	const t = useCurrentFrame();
	const open = p(t, 2, 32, IN_OUT);
	const out = p(t, 88, 100, QUART_OUT);
	const W = 380;
	const top = 580;
	const bottom = 1300;
	const page = (side: -1 | 1) => {
		const ox = 540 + side * W * open;
		const pinch = Math.sin(Math.PI * open) * 30;
		return `540,${top} ${ox},${top + pinch} ${ox},${bottom - pinch} 540,${bottom}`;
	};
	const gutter = p(t, 16, 32, IN_OUT);
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse ${140 + open * 300}px 480px at 540px 940px, ${hexA(INK, 0.15 * open)}, transparent 75%)`}} />
			<Motes ink={INK} count={10} opacity={open} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<g fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" opacity={0.7}>
					<polyline points={page(-1)} />
					<polyline points={page(1)} />
					<line x1={540} x2={540} y1={top} y2={mix(top + (bottom - top) * 0.5, top + 90, gutter)} />
					<line x1={540} x2={540} y1={bottom} y2={mix(bottom - (bottom - top) * 0.5, bottom - 90, gutter)} />
				</g>
			</svg>
			<Center top={720}>
				<BrandLogo variant="white" width={320} reveal={p(t, 18, 42, IN_OUT)} />
				<div style={{height: 40}} />
				<Tracked text={BRAND.wordmark} at={34} color={INK} size={60} weight={500} spacing={0.24} />
				<div style={{height: 26}} />
				<SerifWords text={OPENING_COPY.podcast} at={42} color={INK} size={TYPE.support} italic weight={400} stagger={1} />
			</Center>
		</AbsoluteFill>
	);
};

/* ─────────────── 3 · the show's promise, on its own ─────────────── */

const Tagline: React.FC = () => (
	<Center top={700}>
		<div style={{maxWidth: 900}}>
			<SerifWords text={OPENING_COPY.tagline} at={4} out={140} color={INK} size={84} weight={400} stagger={1} lineHeight={1.18} />
		</div>
	</Center>
);

/* ─────────────── 4 · hosted by Lucie, inside a ring that echoes the logo ─────────────── */

const Host: React.FC = () => {
	const t = useCurrentFrame();
	const ring = p(t, 2, 40, IN_OUT);
	const out = p(t, 94, 106, QUART_OUT);
	return (
		<>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
				<g transform={`rotate(${-90 + t * 0.12} 540 900)`}>
					<circle cx={540} cy={900} r={360} fill="none" stroke={INK} strokeWidth={2} opacity={0.3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} />
				</g>
			</svg>
			<Center top={700}>
				<Tracked text={OPENING_COPY.hostedBy} at={3} out={94} color={INK} size={TYPE.label} weight={500} spacing={0.2} />
				<div style={{height: 10}} />
				<SerifWords text={BRAND.host} at={6} out={94} color={INK} size={230} italic weight={300} tracking="-0.02em" />
			</Center>
			<Center top={1080}>
				<SerifWords text={OPENING_COPY.hostLine} at={16} out={94} color={INK} size={TYPE.support} italic weight={400} stagger={1} />
			</Center>
		</>
	);
};

/* ─────────────── 5 · on air: the line becomes a voice ─────────────── */

const Radio: React.FC = () => {
	const t = useCurrentFrame();
	const lit = p(t, 6, 12, (x) => x);
	const out = p(t, 88, 100, QUART_OUT);
	return (
		<>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: (1 - out) * lit}}>
				{[0, 1, 2].map((k) => {
					const r = 90 + ((t * 1.1 + k * 34) % 102);
					return <path key={k} d={`M ${540 - r} 640 A ${r} ${r} 0 0 1 ${540 + r} 640`} fill="none" stroke={INK} strokeWidth={2} opacity={0.35 * (1 - (r - 90) / 102)} />;
				})}
			</svg>
			<Center top={596} style={{opacity: 1 - out}}>
				<div
					style={{
						padding: '14px 30px 14px 40px',
						border: `3px solid ${INK}`,
						borderRadius: 12,
						fontFamily: SANS,
						fontWeight: 600,
						fontSize: 40,
						letterSpacing: '0.26em',
						color: lit > 0.5 ? INTRO.bg : INK,
						background: lit > 0.5 ? INK : 'transparent',
						opacity: p(t, 0, 10),
					}}
				>
					ON AIR
				</div>
			</Center>
			<Center top={740}>
				<SerifWords text={OPENING_COPY.slot[0]} at={10} out={88} color={INK} size={160} weight={400} />
				<SerifWords text={OPENING_COPY.slot[1]} at={14} out={88} color={INK} size={160} italic weight={300} />
			</Center>
			<Center top={1140}>
				<Tracked text={BRAND.station} at={22} out={88} color={INK} size={52} weight={500} spacing={0.2} />
			</Center>
		</>
	);
};

/* ─────────────── 6 · four seasons: five points on the line; the first one opens ─────────────── */

const Year: React.FC = () => {
	const t = useCurrentFrame();
	return (
		<>
			<Center top={720}>
				<SerifWords text={OPENING_COPY.year[0]} at={3} out={48} color={INK} size={140} />
				<SerifWords text={OPENING_COPY.year[1]} at={7} out={48} color={INK} size={140} italic weight={300} />
			</Center>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{PARTS.map((k, i) => {
					const s = p(t, 12 + i * 3, 26 + i * 3, EXPO_OUT);
					const isWinter = i === 0;
					const fade = isWinter ? 1 : 1 - p(t, 48, 58);
					const grow = isWinter ? 1 + p(t, 50, 62, IN_OUT) * 0.8 : 1;
					return <circle key={k} cx={220 + i * 160} cy={1060} r={16 * s * grow} fill={SEASONS[k].bg} stroke={INK} strokeWidth={2.5} opacity={fade} />;
				})}
			</svg>
		</>
	);
};

/* ─────────────── 7 · a seasonal page, laid out like the official covers ─────────────── */

const SeasonPage: React.FC<{readonly season: Season; readonly delay: number}> = ({season, delay}) => {
	const t = useCurrentFrame() - delay;
	const ink = season.ink;
	const light = interpolate(t, [-delay, PAGE_LEN], [30, 62]);
	return (
		<AbsoluteFill>
			<Atmos bg={season.bg} ink={ink} light={0} grain={0.06} />
			<AbsoluteFill style={{background: `radial-gradient(ellipse 65% 42% at ${light}% 44%, ${hexA('#ffffff', season.logo === 'white' ? 0.06 : 0.1)}, transparent 72%)`}} />
			<Sequence from={delay} layout="none" name="page text">
				<Center top={600}>
					<Tracked text={season.overline} at={0} color={ink} size={TYPE.label} weight={600} spacing={0.18} />
					<div style={{height: 28}} />
					<SerifWords text={season.theme} at={4} color={ink} size={season.theme.length > 11 ? 140 : 156} italic weight={400} />
					<div style={{height: 34}} />
					<Rule at={12} width={90} color={ink} opacity={1} thickness={3} />
					<div style={{height: 40}} />
					<div style={{maxWidth: 900}}>
						<SerifWords text={season.line} at={10} color={ink} size={64} weight={400} stagger={1} lineHeight={1.18} />
					</div>
				</Center>
				<Center top={1250}>
					<Tracked text={season.months} at={14} color={ink} size={40} weight={500} spacing={0.16} />
				</Center>
			</Sequence>
		</AbsoluteFill>
	);
};

/** Each section of the book opens differently – circle of light, page turn, unfold, rising horizon, bloom. */
const SectionOpen: React.FC<{readonly k: SeasonKey}> = ({k}) => {
	const t = useCurrentFrame();
	const len = REVEAL[k];
	const prog = t / len;
	const page = <SeasonPage season={SEASONS[k]} delay={Math.max(6, len - 10)} />;
	switch (k) {
		case 'winter':
			return (
				<IrisReveal progress={prog} cx={WINTER_DOT.x} cy={WINTER_DOT.y}>
					{page}
				</IrisReveal>
			);
		case 'spring':
			return <PageTurn progress={prog}>{page}</PageTurn>;
		case 'summer':
			return <UnfoldReveal progress={prog}>{page}</UnfoldReveal>;
		case 'fall':
			return (
				<RiseReveal progress={prog} lineColor="#ffffff">
					{page}
				</RiseReveal>
			);
		default:
			return <BloomReveal progress={prog}>{page}</BloomReveal>;
	}
};

/* ─────────────── 8 · 24 chapters; the book closes ─────────────── */

const partOf = (c: number): SeasonKey => (c <= 4 ? 'winter' : c <= 10 ? 'spring' : c <= 16 ? 'summer' : c <= 22 ? 'fall' : 'epilogue');

const Chapters: React.FC = () => {
	const t = useCurrentFrame();
	return (
		<CloseReveal progress={t / REVEAL.close}>
			<AbsoluteFill>
				<Atmos bg={INTRO.bg} ink={INK} />
				<Center top={660}>
					<SerifWords text={OPENING_COPY.chapters} at={12} out={88} color={INK} size={160} />
				</Center>
				<Center top={880}>
					<SerifWords text={OPENING_COPY.chaptersSub} at={18} out={88} color={INK} size={TYPE.support} italic weight={400} stagger={1} />
				</Center>
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 1 - p(t, 88, 98)}}>
					{Array.from({length: 24}).map((_, i) => {
						const s = p(t, 18 + i * 1.2, 32 + i * 1.2, EXPO_OUT);
						const x = 180 + i * (720 / 23);
						const h = 120 * s;
						return (
							<g key={i}>
								<line x1={x} x2={x} y1={1250} y2={1250 - h} stroke={INK} strokeWidth={2.5} />
								<circle cx={x} cy={1250 - h - 13} r={8 * s} fill={SEASONS[partOf(i + 1)].bg} stroke={INK} strokeWidth={2} />
							</g>
						);
					})}
				</svg>
			</AbsoluteFill>
		</CloseReveal>
	);
};

const Invite: React.FC = () => (
	<Center top={760}>
		<div style={{maxWidth: 900}}>
			<SerifWords text={OPENING_COPY.invite} at={4} out={60} color={INK} size={130} italic weight={300} lineHeight={1.08} />
		</div>
	</Center>
);

/* ─────────────── 9 · cinematic brand reveal → the Introduction card ─────────────── */

const LOGO_BIG = 380;
const LOGO_SMALL = 170;

const EndCard: React.FC = () => {
	const t = useCurrentFrame();
	const c = OPENING_COPY.end;
	const bloom = p(t, 0, 14) * (1 - p(t, 36, 70));
	const reveal = p(t, 6, 36, IN_OUT);
	const settle = p(t, 44, 70, IN_OUT);
	const scale = mix(1, LOGO_SMALL / LOGO_BIG, settle);
	const blockTop = mix(660, 300, settle);
	const beamX = 540 - LOGO_BIG / 2 + LOGO_BIG * reveal;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 420px 320px at 540px 800px, ${hexA(INK, 0.16 * bloom)}, transparent 72%)`}} />
			<Motes ink={INK} count={8} opacity={bloom} />
			{reveal > 0 && reveal < 1 ? (
				<div
					style={{
						position: 'absolute',
						left: beamX - 2,
						top: 620,
						width: 4,
						height: LOGO_BIG * RATIO + 80,
						background: `linear-gradient(to bottom, transparent, ${INK}, transparent)`,
						boxShadow: `0 0 24px ${INK}`,
						opacity: Math.sin(Math.PI * reveal) * 0.8,
					}}
				/>
			) : null}
			<div style={{position: 'absolute', top: blockTop, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<div style={{scale: String(scale * mix(1.05, 1, reveal)), transformOrigin: 'center top'}}>
					<BrandLogo variant="white" width={LOGO_BIG} reveal={reveal} />
				</div>
			</div>
			<div style={{position: 'absolute', top: blockTop + LOGO_BIG * RATIO * scale + mix(50, 28, settle), left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<Tracked text={BRAND.wordmark} at={24} color={INK} size={mix(64, 46, settle)} weight={500} spacing={0.24} />
			</div>
			{/* the Introduction card, built once the logo has settled */}
			<Center top={590}>
				<SerifWords text={INTRO.theme} at={68} color={INK} size={52} italic weight={400} />
			</Center>
			<Center top={690}>
				<SerifWords text={c.title} at={72} color={INK} size={150} weight={400} tracking="-0.015em" />
				<div style={{height: 6}} />
				<SansTitle text={c.subtitle} at={80} color={INK} size={66} weight={600} />
			</Center>
			<Center top={1050}>
				<div style={{maxWidth: 860}}>
					<SerifWords text={c.quote} at={88} color={INK} size={58} italic weight={400} stagger={1} lineHeight={1.2} />
				</div>
			</Center>
			<Center top={1300}>
				<Tracked text={`${BRAND.slot} · ${BRAND.station}`} at={96} color={INK} size={42} weight={600} spacing={0.08} />
			</Center>
		</AbsoluteFill>
	);
};

/* ─────────────── the line of light ─────────────── */

const LINE_KEYS: LineKey[] = [
	{at: 0, shape: (f) => hline(1030, 540 - 420 * p(f, 2, 24, IN_OUT), 540 + 420 * p(f, 2, 24, IN_OUT))},
	{at: T.brand[0], morph: 18, shape: () => [[540, 580], [540, 1300]]},
	{at: T.brand[0] + 14, morph: 10, opacity: 0, shape: () => [[540, 580], [540, 1300]]},
	{at: T.tagline[0], morph: 18, shape: () => hline(1200, 440, 640)},
	{at: T.host[0], morph: 18, shape: () => hline(1048, 450, 630)},
	{
		at: T.radio[0],
		morph: 18,
		shape: (f) => {
			const lt = f - T.radio[0];
			const amp = 54 * p(lt, 6, 30) * (1 - p(lt, 86, 100));
			return Array.from({length: 120}, (_, i): Pt => {
				const u = i / 119;
				const env = Math.sin(Math.PI * u) ** 1.5;
				const y = 1270 + amp * env * (Math.sin(u * 38 + lt * 0.35) * 0.6 + Math.sin(u * 91 - lt * 0.55) * 0.4);
				return [120 + u * 840, y];
			});
		},
	},
	{at: T.year[0], morph: 18, shape: () => hline(1060, 140, 940)},
	{at: T.year[0] + 50, morph: 10, opacity: 0, shape: () => hline(1060, 140, 940)},
	{at: T2.chapters[0] + 10, morph: 16, shape: () => hline(1250, 160, 920)},
	{at: T2.invite[0], morph: 18, shape: () => hline(1090, 450, 630)},
	{at: T2.end[0], morph: 12, opacity: 0, shape: () => hline(800, 539, 541)},
	{at: T2.end[0] + 80, morph: 20, opacity: 0.85, shape: () => hline(1010, 490, 590)},
];

/* ─────────────── sound (impacts: book-close + final logo chime) ─────────────── */

const Cue: React.FC<{readonly at: number; readonly src: string; readonly volume: number; readonly name: string}> = ({at, src, volume, name}) => (
	<Sequence from={at} durationInFrames={90} layout="none" name={name}>
		<Audio src={staticFile(src)} volume={volume} />
	</Sequence>
);

const pageStart = (i: number) => PAGES_START + i * PAGE_LEN;

const Sound: React.FC = () => {
	const {fps, durationInFrames} = useVideoConfig();
	return (
		<>
			<Audio
				name="Ambient bed"
				src={staticFile('audio/2027/ambient.mp3')}
				volume={(f) => 0.55 * interpolate(f, [0, fps * 1, durationInFrames - fps * 2, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
			/>
			<Cue name="spark" at={0} src={SFX.air} volume={0.35} />
			<Cue name="book opens" at={T.brand[0] + 4} src={SFX.pageTurn} volume={0.5} />
			<Cue name="logo light" at={T.brand[0] + 26} src={SFX.air} volume={0.4} />
			<Cue name="on air" at={T.radio[0] + 10} src={SFX.pop} volume={0.3} />
			<Cue name="winter · circle of light" at={pageStart(0)} src={SFX.air} volume={0.45} />
			<Cue name="spring · page turn" at={pageStart(1)} src={SFX.pageTurn} volume={0.45} />
			<Cue name="summer · unfold" at={pageStart(2)} src={SFX.pageTurn} volume={0.4} />
			<Cue name="fall · rising horizon" at={pageStart(3)} src={SFX.air} volume={0.4} />
			<Cue name="epilogue · bloom" at={pageStart(4)} src={SFX.air} volume={0.5} />
			<Cue name="book closes" at={T2.chapters[0] + 2} src={SFX.bookClose} volume={0.55} />
			<Cue name="logo chime" at={T2.end[0] + 10} src={SFX.chime} volume={0.45} />
		</>
	);
};

/* ─────────────── composition ─────────────── */

const Shot: React.FC<{readonly span: readonly [number, number]; readonly name: string; readonly children: React.ReactNode; readonly tail?: number}> = ({span, name, children, tail = 0}) => (
	<Sequence from={span[0]} durationInFrames={span[1] - span[0] + tail} name={name}>
		{children}
	</Sequence>
);

/** VIDEO 1 – Opening Credits & Introduction (black). */
export const OpeningCredits: React.FC = () => (
	<AbsoluteFill>
		<Atmos bg={INTRO.bg} ink={INK} />
		<Shot span={T.hook} name="1 · Hook">
			<Hook />
		</Shot>
		<Shot span={T.brand} name="2 · The book opens">
			<Brand />
		</Shot>
		<Shot span={T.tagline} name="3 · Tagline">
			<Tagline />
		</Shot>
		<Shot span={T.host} name="4 · Hosted by Lucie">
			<Host />
		</Shot>
		<Shot span={T.radio} name="5 · On air">
			<Radio />
		</Shot>
		<Shot span={T.year} name="6 · Four seasons" tail={REVEAL.winter}>
			<Year />
		</Shot>
		{PARTS.map((k, i) => (
			<Sequence key={k} from={pageStart(i)} durationInFrames={PAGE_LEN + 26} name={`7 · ${SEASONS[k].theme}`}>
				<SectionOpen k={k} />
			</Sequence>
		))}
		<Shot span={T2.chapters} name="8 · 24 chapters">
			<Chapters />
		</Shot>
		<Shot span={T2.invite} name="9 · Invitations">
			<Invite />
		</Shot>
		<Shot span={T2.end} name="10 · Brand reveal">
			<EndCard />
		</Shot>
		<LightLine keys={LINE_KEYS} color={INK} width={3} />
		<Sound />
	</AbsoluteFill>
);
