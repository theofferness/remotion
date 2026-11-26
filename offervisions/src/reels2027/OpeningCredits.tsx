import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '../editorial/fonts';
import {Atmos, hexA, Motes} from '../editorial/Atmos';
import {SANS, SERIF} from '../editorial/fonts';
import {LightLine, type LineKey} from '../editorial/Line';
import {BrandLogo} from '../editorial/Logo';
import {EXPO_OUT, IN_OUT, QUART_OUT, p} from '../editorial/motion';
import {PageTurn} from '../editorial/PageTurn';
import {BRAND, type Season, SEASONS, type SeasonKey} from '../editorial/theme';
import {Rule, SansTitle, SerifWords, Tracked} from '../editorial/Type';
import type {Pt} from '../reels/kit/shapes';
import {SFX} from '../reels/kit/Sfx';

/* ─────────────── timeline (frames @ 30 fps) ─────────────── */
// Timing revision (Lucie): same design and animation speeds as the first version;
// every screen holds until all of its sentences can be read (~0.3 s per word).
const T = {
	hook: [0, 130],
	book: [130, 335],
	host: [335, 463],
	radio: [463, 581],
	year: [581, 686],
	pages: [686, 1206],
	chapters: [1206, 1332],
	end: [1332, 1532],
} as const;
export const OPENING_FRAMES = T.end[1];
const PAGE_LEN = 104;
const PARTS: SeasonKey[] = ['winter', 'spring', 'summer', 'fall', 'epilogue'];

const INTRO = SEASONS.intro;
const INK = INTRO.ink;

/** Copy for Video 1 – all from the 2027 scripts and the Introduction cover. */
export const OPENING_COPY = {
	hook: ['This year', 'is built like a book.'],
	hookSub: 'The first page opens January 11',
	podcast: 'A self-development podcast',
	tagline: ['Opening up to yourself, to others,', 'and to everything life has to offer.'],
	hostedBy: 'Hosted by',
	hostLine: 'A fellow learner, not an expert.',
	slot: ['Mondays,', '11 AM'],
	year: ['Four seasons.', 'One epilogue.'],
	yearSub: 'Four parts · one epilogue · 24 chapters',
	chapters: '24 chapters.',
	chaptersSub: 'A new one every other Monday',
	invite: 'Invitations, not homework.',
	end: {title: 'Introduction', subtitle: 'Welcome to Offervisions', quote: ['“What do I want this year', 'to offer me?”']},
};

/* ─────────────── helpers ─────────────── */

const Center: React.FC<{readonly top: number; readonly children: React.ReactNode; readonly style?: React.CSSProperties}> = ({top, children, style}) => (
	<div style={{position: 'absolute', top, left: 80, right: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', ...style}}>{children}</div>
);

const hline = (y: number, x1: number, x2: number): Pt[] => [
	[x1, y],
	[x2, y],
];

/* ─────────────── shots ─────────────── */

const Hook: React.FC = () => (
	<>
		<Center top={720}>
			<SerifWords text={OPENING_COPY.hook[0]} at={6} out={118} color={INK} size={124} />
			<SerifWords text={OPENING_COPY.hook[1]} at={13} out={118} color={INK} size={96} italic weight={300} />
		</Center>
		<Center top={1052}>
			<Tracked text={OPENING_COPY.hookSub} at={34} out={118} color={INK} size={22} spacing={0.32} style={{opacity: 0.75}} />
		</Center>
	</>
);

/** The book opens: two hairline pages swing out from the spine, light spills, the logo appears. */
const Book: React.FC = () => {
	const t = useCurrentFrame();
	const open = p(t, 4, 40, IN_OUT);
	const out = p(t, 190, 204, QUART_OUT);
	const W = 330;
	const top = 640;
	const bottom = 1240;
	const page = (side: -1 | 1) => {
		const ox = 540 + side * W * open;
		const pinch = Math.sin(Math.PI * open) * 26;
		// open polyline: the shared spine is drawn separately so it can part around the logo
		return `540,${top} ${ox},${top + pinch} ${ox},${bottom - pinch} 540,${bottom}`;
	};
	return (
		<AbsoluteFill style={{opacity: 1 - out}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse ${120 + open * 260}px 420px at 540px 940px, ${hexA(INK, 0.16 * open)}, transparent 75%)`}} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<g fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" opacity={0.85}>
					<polyline points={page(-1)} />
					<polyline points={page(1)} />
					{/* the gutter, parted around the logo and wordmark */}
					<line x1={540} x2={540} y1={top} y2={top + (1 - p(t, 26, 44, IN_OUT)) * (bottom - top) * 0.5 + p(t, 26, 44, IN_OUT) * 120} />
					<line x1={540} x2={540} y1={bottom} y2={bottom - (1 - p(t, 26, 44, IN_OUT)) * (bottom - top) * 0.5 - p(t, 26, 44, IN_OUT) * 140} />
				</g>
				{/* a few faint lines of text on the pages, appearing as they open */}
				<g stroke={INK} strokeWidth={1.5} opacity={0.18 * open}>
					{[top + 70, top + 112, top + 154, bottom - 112, bottom - 70].map((y, i) => (
						<g key={i}>
							<line x1={540 - W * open + 40} x2={540 - 40} y1={y} y2={y} />
							<line x1={540 + 40} x2={540 + W * open - 40 - (i % 3) * 30} y1={y} y2={y} />
						</g>
					))}
				</g>
			</svg>
			<Center top={800}>
				<BrandLogo variant="white" width={250} reveal={p(t, 30, 58, IN_OUT)} />
				<div style={{height: 34}} />
				<Tracked text={BRAND.wordmark} at={48} color={INK} size={34} weight={400} spacing={0.34} />
				<div style={{height: 14}} />
				<Tracked text={OPENING_COPY.podcast} at={60} color={INK} size={19} spacing={0.32} style={{opacity: 0.7}} />
			</Center>
			<Center top={1290}>
				<SerifWords text={OPENING_COPY.tagline[0]} at={72} color={INK} size={38} italic weight={300} stagger={2} />
				<SerifWords text={OPENING_COPY.tagline[1]} at={78} color={INK} size={38} italic weight={300} stagger={2} />
			</Center>
		</AbsoluteFill>
	);
};

const Host: React.FC = () => (
	<>
		<Center top={760}>
			<Tracked text={OPENING_COPY.hostedBy} at={4} out={114} color={INK} size={22} spacing={0.34} style={{opacity: 0.8}} />
			<div style={{height: 18}} />
			<SerifWords text={BRAND.host} at={8} out={114} color={INK} size={200} italic weight={300} tracking="-0.02em" />
		</Center>
		<Center top={1046}>
			<SerifWords text={OPENING_COPY.hostLine} at={28} out={114} color={INK} size={42} italic weight={300} stagger={2} />
		</Center>
	</>
);

const Radio: React.FC = () => {
	const t = useCurrentFrame();
	const lit = p(t, 10, 16, (x) => x);
	const out = p(t, 104, 116, QUART_OUT);
	return (
		<>
			<Center top={700} style={{opacity: 1 - out}}>
				<div
					style={{
						padding: '12px 26px 12px 34px',
						border: `2px solid ${INK}`,
						borderRadius: 10,
						fontFamily: SANS,
						fontWeight: 600,
						fontSize: 22,
						letterSpacing: '0.34em',
						color: lit > 0.5 ? INTRO.bg : INK,
						background: lit > 0.5 ? INK : 'transparent',
						boxShadow: lit > 0.5 ? `0 0 34px ${hexA(INK, 0.22)}` : 'none',
						opacity: p(t, 0, 10),
					}}
				>
					ON AIR
				</div>
			</Center>
			<Center top={820}>
				<SerifWords text={`${OPENING_COPY.slot[0]} ${OPENING_COPY.slot[1]}`} at={16} out={104} color={INK} size={118} weight={400} />
			</Center>
			<Center top={1000}>
				<Tracked text={BRAND.station} at={30} out={104} color={INK} size={30} weight={500} spacing={0.3} />
			</Center>
		</>
	);
};

const Year: React.FC = () => {
	const t = useCurrentFrame();
	return (
		<>
			<Center top={760}>
				<SerifWords text={OPENING_COPY.year[0]} at={4} color={INK} size={112} />
				<SerifWords text={OPENING_COPY.year[1]} at={10} color={INK} size={112} italic weight={300} />
			</Center>
			<Center top={1080}>
				<Tracked text={OPENING_COPY.yearSub} at={24} color={INK} size={21} spacing={0.3} style={{opacity: 0.75}} />
			</Center>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{PARTS.map((k, i) => {
					const s = p(t, 26 + i * 4, 40 + i * 4, EXPO_OUT);
					return <circle key={k} cx={220 + i * 160} cy={1040} r={11 * s} fill={SEASONS[k].bg} stroke={INK} strokeWidth={2} />;
				})}
			</svg>
		</>
	);
};

/** One full-bleed seasonal page, laid out like the official chapter covers. */
const SeasonPage: React.FC<{readonly season: Season; readonly index: number}> = ({season, index}) => {
	const t = useCurrentFrame();
	const ink = season.ink;
	const themeSize = season.theme.length > 11 ? 112 : 132;
	return (
		<AbsoluteFill>
			<Atmos bg={season.bg} ink={ink} light={0.07} grain={0.07} />
			{season.numeral ? (
				<div
					style={{
						position: 'absolute',
						top: 520,
						left: 0,
						right: 0,
						textAlign: 'center',
						fontFamily: SERIF,
						fontWeight: 200,
						fontSize: 720,
						lineHeight: 1,
						color: ink,
						opacity: 0.05 * p(t, 8, 40),
						translate: `0px ${interpolate(t, [0, PAGE_LEN + 14], [20, -20])}px`,
					}}
				>
					{season.numeral}
				</div>
			) : null}
			<Center top={690}>
				<Tracked text={season.overline} at={8} color={ink} size={26} weight={500} spacing={0.3} />
				<div style={{height: 22}} />
				<SerifWords text={season.theme} at={12} color={ink} size={themeSize} italic weight={300} />
				<div style={{height: 26}} />
				<Rule at={20} width={64} color={ink} />
				<div style={{height: 30}} />
				<SerifWords text={season.line} at={24} color={ink} size={season.line.length > 38 ? 38 : 44} weight={350} stagger={2} style={{maxWidth: 920}} />
			</Center>
			<Center top={1140}>
				<Tracked text={season.months} at={30} color={ink} size={21} spacing={0.32} style={{opacity: 0.7}} />
			</Center>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<line x1={540 - 400 * p(t, 4, 30, IN_OUT)} x2={540 + 400 * p(t, 4, 30, IN_OUT)} y1={1250} y2={1250} stroke={ink} strokeWidth={2} opacity={0.6} />
			</svg>
			<Center top={1400}>
				<div style={{fontFamily: SANS, fontSize: 20, letterSpacing: '0.3em', color: ink, opacity: 0.55 * p(t, 20, 40)}}>{`0${index + 1} / 05`}</div>
			</Center>
		</AbsoluteFill>
	);
};

const Chapters: React.FC = () => {
	const t = useCurrentFrame();
	const close = p(t, 104, 122, IN_OUT);
	// Chapter → part (from the script index): 1–4 winter, 5–10 spring, 11–16 summer, 17–22 fall, 23–24 epilogue.
	const partOf = (c: number): SeasonKey => (c <= 4 ? 'winter' : c <= 10 ? 'spring' : c <= 16 ? 'summer' : c <= 22 ? 'fall' : 'epilogue');
	return (
		<AbsoluteFill>
			<Atmos bg={INTRO.bg} ink={INK} />
			<Center top={740}>
				<SerifWords text={OPENING_COPY.chapters} at={8} out={106} color={INK} size={128} />
			</Center>
			<Center top={920}>
				<Tracked text={OPENING_COPY.chaptersSub} at={20} out={106} color={INK} size={22} spacing={0.32} style={{opacity: 0.8}} />
			</Center>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{Array.from({length: 24}).map((_, i) => {
					const s = p(t, 12 + i * 1.4, 28 + i * 1.4, EXPO_OUT);
					const x0 = 200 + i * (680 / 23);
					const x = x0 + (540 - x0) * close;
					const h = 96 * s * (1 - close * 0.9);
					return (
						<g key={i}>
							<line x1={x} x2={x} y1={1250} y2={1250 - h} stroke={INK} strokeWidth={2} opacity={0.75} />
							<circle cx={x} cy={1250 - h - 10} r={5 * s * (1 - close)} fill={SEASONS[partOf(i + 1)].bg} stroke={INK} strokeWidth={1.5} />
						</g>
					);
				})}
			</svg>
			<Center top={1320}>
				<SerifWords text={OPENING_COPY.invite} at={40} out={106} color={INK} size={52} italic weight={300} />
			</Center>
		</AbsoluteFill>
	);
};

/** End card: the official Introduction cover, re-composed for 9:16, building in sequence. */
const EndCard: React.FC = () => {
	const t = useCurrentFrame();
	const c = OPENING_COPY.end;
	return (
		<AbsoluteFill>
			<Center top={440}>
				<BrandLogo variant="white" width={140} reveal={p(t, 6, 30, IN_OUT)} />
				<div style={{height: 34}} />
				<Tracked text={BRAND.wordmark} at={16} color={INK} size={30} weight={400} spacing={0.34} />
			</Center>
			<Center top={720}>
				<Tracked text={INTRO.overline} at={26} color={INK} size={26} weight={500} spacing={0.3} style={{opacity: 0.88}} />
				<div style={{height: 10}} />
				<SerifWords text={INTRO.theme} at={30} color={INK} size={36} italic weight={300} />
			</Center>
			<Center top={830}>
				<SerifWords text={c.title} at={36} color={INK} size={150} weight={400} tracking="-0.015em" />
				<div style={{height: 8}} />
				<SansTitle text={c.subtitle} at={46} color={INK} size={64} weight={600} />
			</Center>
			<Center top={1150}>
				<SerifWords text={c.quote[0]} at={60} color={INK} size={40} italic weight={300} stagger={2} />
				<SerifWords text={c.quote[1]} at={64} color={INK} size={40} italic weight={300} stagger={2} />
			</Center>
			<Center top={1350}>
				<Tracked text={`${BRAND.slot} · ${BRAND.station}`} at={72} color={INK} size={28} weight={500} spacing={0.1} />
			</Center>
		</AbsoluteFill>
	);
};

/* ─────────────── the line of light ─────────────── */

const LINE_KEYS: LineKey[] = [
	{at: 0, shape: (f) => hline(1010, 540 - 400 * p(f, 0, 26, IN_OUT), 540 + 400 * p(f, 0, 26, IN_OUT))},
	{at: T.book[0], morph: 18, shape: () => [[540, 640], [540, 1240]]},
	{at: T.book[0] + 22, morph: 10, opacity: 0, shape: () => [[540, 640], [540, 1240]]},
	{at: T.host[0], morph: 18, shape: () => hline(1012, 470, 610)},
	{
		at: T.radio[0],
		morph: 18,
		shape: (f) => {
			const lt = f - T.radio[0];
			const amp = 54 * p(lt, 6, 30) * (1 - p(lt, 100, 116));
			return Array.from({length: 120}, (_, i): Pt => {
				const u = i / 119;
				const env = Math.sin(Math.PI * u) ** 1.5;
				const y = 1170 + amp * env * (Math.sin(u * 38 + lt * 0.35) * 0.6 + Math.sin(u * 91 - lt * 0.55) * 0.4);
				return [120 + u * 840, y];
			});
		},
	},
	{at: T.year[0], morph: 18, shape: () => hline(1040, 140, 940)},
	{at: T.pages[0] - 6, morph: 8, opacity: 0, shape: () => hline(1040, 140, 940)},
	{at: T.chapters[0] + 4, morph: 16, shape: () => hline(1250, 180, 900)},
	{at: T.chapters[0] + 106, morph: 16, shape: () => hline(1250, 538, 542)},
	{at: T.end[0], morph: 22, opacity: 0.7, shape: () => hline(1118, 505, 575)},
];

/* ─────────────── sound (≤2 impacts: logo chime, book-close) ─────────────── */

const Cue: React.FC<{readonly at: number; readonly src: string; readonly volume: number; readonly name: string}> = ({at, src, volume, name}) => (
	<Sequence from={at} durationInFrames={90} layout="none" name={name}>
		<Audio src={staticFile(src)} volume={volume} />
	</Sequence>
);

const Sound: React.FC = () => {
	const {fps, durationInFrames} = useVideoConfig();
	return (
		<>
			<Audio
				name="Ambient bed"
				src={staticFile('audio/2027/ambient.mp3')}
				volume={(f) => 0.55 * interpolate(f, [0, fps * 1.5, durationInFrames - fps * 2, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
			/>
			<Cue name="air" at={0} src={SFX.air} volume={0.3} />
			<Cue name="book opens" at={T.book[0] + 4} src={SFX.pageTurn} volume={0.5} />
			<Cue name="logo chime" at={T.book[0] + 36} src={SFX.chime} volume={0.4} />
			<Cue name="on air" at={T.radio[0] + 10} src={SFX.pop} volume={0.3} />
			{PARTS.map((k, i) => (
				<Cue key={k} name={`page · ${k}`} at={T.pages[0] + i * PAGE_LEN} src={SFX.pageTurn} volume={0.45} />
			))}
			<Cue name="page · back" at={T.chapters[0]} src={SFX.pageTurn} volume={0.4} />
			<Cue name="book closes" at={T.chapters[0] + 108} src={SFX.bookClose} volume={0.6} />
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
		<Motes ink={INK} />
		<Shot span={T.hook} name="1 · Hook">
			<Hook />
		</Shot>
		<Shot span={T.book} name="2 · The book opens">
			<Book />
		</Shot>
		<Shot span={T.host} name="3 · Hosted by Lucie">
			<Host />
		</Shot>
		<Shot span={T.radio} name="4 · On air">
			<Radio />
		</Shot>
		<Shot span={T.year} name="5 · Four seasons" tail={14}>
			<Year />
		</Shot>
		{PARTS.map((k, i) => (
			<Sequence key={k} from={T.pages[0] + i * PAGE_LEN} durationInFrames={PAGE_LEN + 14} name={`6 · ${SEASONS[k].theme}`}>
				<PageFor season={SEASONS[k]} index={i} />
			</Sequence>
		))}
		<Sequence from={T.chapters[0]} durationInFrames={T.chapters[1] - T.chapters[0]} name="7 · 24 chapters">
			<Turn>
				<Chapters />
			</Turn>
		</Sequence>
		<Shot span={T.end} name="8 · End card">
			<EndCard />
		</Shot>
		<LightLine keys={LINE_KEYS} color={INK} width={3} />
		<Sound />
	</AbsoluteFill>
);

/** Wraps a page so it turns in over 14 frames from the previous page. */
const Turn: React.FC<{readonly children: React.ReactNode}> = ({children}) => {
	const t = useCurrentFrame();
	return <PageTurn progress={t / 14}>{children}</PageTurn>;
};

const PageFor: React.FC<{readonly season: Season; readonly index: number}> = ({season, index}) => (
	<Turn>
		<SeasonPage season={season} index={index} />
	</Turn>
);
