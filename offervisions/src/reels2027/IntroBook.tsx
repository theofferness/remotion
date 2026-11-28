import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, Freeze, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '../editorial/fonts';
import {Motes} from '../editorial/Atmos';
import {LightLine} from '../editorial/Line';
import {IN_OUT, mix, p} from '../editorial/motion';
import {SEASONS} from '../editorial/theme';
import {SFX} from '../reels/kit/Sfx';
import {PAPER} from './darkroom/Darkroom';
import {CH, CoverFront, CoverInside, CW, CX, CY, Gutter, Leaf, type Line, LoopFrame, OB, ORIGIN, PH, PW, PX, PY, Stage, Written} from './darkroom/Opening';
import {SANS} from '../editorial/fonts';
import {Book, Chapters, EndCard, Hook, Host, type InkPalette, InkCtx, LINE_KEYS, PAGE_LEN, PARTS, Radio, SeasonPage, T, Year} from './OpeningCredits';

/*
 * VIDEO 1 – OPENING CREDITS & INTRODUCTION, AS A BOOK.
 * Opens like Video 2 (the hand offers the O, "Be visionary.", the cover opens) – on a black cover, on black.
 * Every screen of the original Video 1 is then a page of the book, with the same copy, fonts, timing and
 * animations; between screens the page really turns.
 */

const BLACK = '#0d0d0d';
const CREAM: InkPalette = {ink: '#1f1f1f', bg: PAPER, logo: 'black'};
const NIGHT_PAGE: InkPalette = {ink: '#ffffff', bg: BLACK, logo: 'white'};

const OFFSET = 150;
const END_EXTRA = 40; // time for the invitation before the loop
const LOOP = 26; // the last frames dissolve back into the first frame // the first page starts as the cover swings open
const TURN = 28;
const CAM_S = 1.32;
const CONTENT_SCALE = PW / 1080;
const CONTENT_Y = PH / 2 - 1000 * CONTENT_SCALE; // the screens' optical centre (y ≈ 1000) sits mid-page

const CTA_LINE: readonly Line[] = [{text: 'Listen to the podcast', center: true, x: PW / 2, y: 852, size: 44, italic: true, weight: 300}];

type Scene = {readonly key: string; readonly name: string; readonly span: readonly [number, number]; readonly freeze: number; readonly pal: InkPalette; readonly el: React.ReactNode};
const sh = (span: readonly [number, number]) => [span[0] + OFFSET, span[1] + OFFSET] as const;

const SCENES: Scene[] = [
	{key: 'hook', name: '1 · This year is built like a book', span: sh(T.hook), freeze: 116, pal: CREAM, el: <Hook />},
	{key: 'book', name: '2 · Offervisions', span: sh(T.book), freeze: 188, pal: CREAM, el: <Book />},
	{key: 'host', name: '3 · Hosted by Lucia', span: sh(T.host), freeze: 112, pal: CREAM, el: <Host />},
	{key: 'radio', name: '4 · On air', span: sh(T.radio), freeze: 102, pal: CREAM, el: <Radio />},
	{key: 'year', name: '5 · Four seasons', span: sh(T.year), freeze: T.year[1] - T.year[0] - 1, pal: CREAM, el: <Year />},
	...PARTS.map(
		(k, i): Scene => ({
			key: k,
			name: `6 · ${SEASONS[k].theme}`,
			span: sh([T.pages[0] + i * PAGE_LEN, T.pages[0] + (i + 1) * PAGE_LEN]),
			freeze: PAGE_LEN - 1,
			pal: CREAM,
			el: <SeasonPage season={SEASONS[k]} index={i} />,
		}),
	),
	{key: 'chapters', name: '7 · 24 chapters', span: sh(T.chapters), freeze: 103, pal: CREAM, el: <Chapters />},
	{key: 'end', name: '8 · Introduction', span: [T.end[0] + OFFSET, T.end[1] + OFFSET + END_EXTRA] as const, freeze: T.end[1] - T.end[0] + END_EXTRA, pal: NIGHT_PAGE, el: <EndCard />},
];
export const INTRO_BOOK_FRAMES = SCENES[SCENES.length - 1].span[1];
const FIRST_TURN_END = SCENES[1].span[0] + TURN;

/* ───────────────────────── pages ───────────────────────── */

const PageContent: React.FC<{readonly scene: Scene}> = ({scene}) => (
	<InkCtx.Provider value={scene.pal}>
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: scene.pal.bg}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translateY(${CONTENT_Y}px) scale(${CONTENT_SCALE})`}}>
				{scene.el}
				<Sequence from={-(scene.span[0] - OFFSET)} layout="none">
					<LightLine keys={LINE_KEYS} color={scene.pal.ink} width={3} />
				</Sequence>
			</div>
			<Gutter side="right" strength={scene.pal.bg === PAPER ? 0.16 : 0.45} />
		</div>
	</InkCtx.Provider>
);

/** The page in the book; once its screen is complete it holds that frame, ready to turn. */
const SettledPage: React.FC<{readonly scene: Scene}> = ({scene}) => {
	const f = useCurrentFrame();
	const page = <PageContent scene={scene} />;
	return <div style={{position: 'absolute', left: PX, top: PY, width: PW, height: PH}}>{f > scene.freeze ? <Freeze frame={scene.freeze}>{page}</Freeze> : page}</div>;
};

const PaperBack: React.FC = () => (
	<div style={{position: 'absolute', inset: 0, background: '#efede6'}}>
		<Gutter side="left" />
	</div>
);

/** The outgoing page turning over the spine (sequence-local frames). */
const TurningPage: React.FC<{readonly scene: Scene}> = ({scene}) => {
	const f = useCurrentFrame();
	const t = p(f, 0, TURN, IN_OUT);
	const bend = 5.2 * Math.sin(Math.PI * t) * (1 - 0.35 * t);
	const outer = Math.min(90, 180 * t + 9 * bend);
	const edge = PW * Math.cos((outer * Math.PI) / 180);
	const a = 0.5 * Math.sin(Math.PI * t);
	return (
		<>
			<div style={{position: 'absolute', left: PX, top: PY, width: PW, height: PH, pointerEvents: 'none', background: `linear-gradient(90deg, rgba(0,0,0,${a * 0.5}) 0px, rgba(0,0,0,${a}) ${Math.max(0, edge - 30)}px, transparent ${Math.max(0, edge) + 120}px)`}} />
			<Stage x={PX} y={PY} w={PW} h={PH}>
				<Leaf
					theta={180 * t}
					bend={bend}
					strips={10}
					w={PW}
					h={PH}
					front={
						<Freeze frame={scene.freeze}>
							<PageContent scene={scene} />
						</Freeze>
					}
					back={<PaperBack />}
				/>
			</Stage>
		</>
	);
};

/* ───────────────────────── sound ───────────────────────── */

const Cue: React.FC<{readonly at: number; readonly src: string; readonly volume: number; readonly name: string}> = ({at, src, volume, name}) => (
	<Sequence from={Math.max(0, Math.round(at))} durationInFrames={90} layout="none" name={name}>
		<Audio src={staticFile(src)} volume={volume} />
	</Sequence>
);

const Sound: React.FC = () => {
	const {durationInFrames} = useVideoConfig();
	return (
		<>
			<Audio name="Ambient bed" src={staticFile('audio/2027/ambient.mp3')} volume={(fr) => 0.5 * interpolate(fr, [0, 6, durationInFrames - 6, durationInFrames], [0.6, 1, 1, 0.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
			<Cue name="air" at={0} src={SFX.air} volume={0.26} />
			<Cue name="the O arrives (impact 1)" at={OB.o[1] - 10} src={SFX.chime} volume={0.3} />
			<Cue name="cover opens" at={OB.cover[0] + 4} src={SFX.pageTurn} volume={0.42} />
			<Cue name="on air" at={T.radio[0] + OFFSET + 10} src={SFX.pop} volume={0.3} />
			{SCENES.slice(1).map((s) => (
				<Cue key={s.key} name={`page turns → ${s.name}`} at={s.span[0] + 1} src={SFX.pageTurn} volume={0.45} />
			))}
			<Cue name="last page (impact 2)" at={T.end[0] + OFFSET + 30} src={SFX.chime} volume={0.3} />
		</>
	);
};

/* ───────────────────────── the shot ───────────────────────── */

export const IntroBook: React.FC = () => {
	const f = useCurrentFrame();
	const pull = p(f, OB.pullBack[0], OB.pullBack[1], IN_OUT);
	const lean = p(f, OB.cover[1] - 10, OB.cover[1] + 40, IN_OUT);
	const loop = p(f, INTRO_BOOK_FRAMES - LOOP, INTRO_BOOK_FRAMES - 1, IN_OUT);
	const S = mix(mix(2, 1, pull), CAM_S, lean) * (1 + 0.3 * loop);
	const ctaAt = SCENES[SCENES.length - 1].span[0] + 96;
	const cover = 180 * p(f, OB.cover[0], OB.cover[1], IN_OUT);
	const coverDone = f >= OB.cover[1];

	const coverStage = (
		<Stage key="cover" x={CX} y={CY} w={CW} h={CH}>
			<Leaf theta={cover} bend={0} strips={1} w={CW} h={CH} front={<CoverFront color={BLACK} />} back={<CoverInside color="#0a0a0a" />} />
		</Stage>
	);
	const pages = (
		<React.Fragment key="pages">
			<div style={{position: 'absolute', left: PX, top: PY, width: PW, height: PH, background: PAPER}}>
				<Gutter side="right" />
			</div>
			{SCENES.map((s) => (
				<Sequence key={s.key} from={s.span[0]} durationInFrames={s.span[1] - s.span[0]} name={s.name} layout="none">
					<SettledPage scene={s} />
				</Sequence>
			))}
		</React.Fragment>
	);
	const leftPaper = f >= FIRST_TURN_END ? (
		<div key="left" style={{position: 'absolute', left: PX - PW, top: PY, width: PW, height: PH}}>
			<PaperBack />
		</div>
	) : null;
	const turns = SCENES.slice(1).map((s, i) => (
		<Sequence key={`turn-${s.key}`} from={s.span[0]} durationInFrames={TURN + 1} name={`turn → ${s.name}`} layout="none">
			<TurningPage scene={SCENES[i]} />
		</Sequence>
	));

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 50% 46%, #151515 0%, #040404 78%)'}} />
			<div style={{position: 'absolute', inset: 0, transformOrigin: ORIGIN, transform: `scale(${S})`}}>
				<div style={{position: 'absolute', left: CX - (cover > 90 ? CW : 0), top: CY + 30, width: CW * (cover > 90 ? 2 : 1), height: CH, background: 'rgba(0,0,0,0.8)', filter: 'blur(44px)', opacity: pull}} />
				{[6, 4, 2].map((o) => (
					<div key={o} style={{position: 'absolute', left: PX + o, top: PY + o, width: PW, height: PH, background: o === 6 ? '#bdb9b0' : '#dcd9d1'}} />
				))}
				{coverDone ? [coverStage, pages, leftPaper] : [pages, coverStage]}
				{turns}
				{/* the invitation, written by hand on the last page before the loop */}
				{f >= ctaAt - 2 ? (
					<svg width={PW} height={PH} style={{position: 'absolute', left: PX, top: PY}}>
						<Written id="cta" lines={CTA_LINE} start={ctaAt} color="#ffffff" speed={0.34} outline={false} feather={0.3} />
						<text x={PW / 2} y={898} textAnchor="middle" fill="#fff" opacity={0.85 * p(f, ctaAt + 40, ctaAt + 58)} fontFamily={SANS} fontWeight={600} fontSize={18} letterSpacing={5}>
							LINK IN BIO
						</text>
					</svg>
				) : null}
			</div>
			<Motes ink="#ffffff" opacity={0.35 * (1 - loop)} />
			<AbsoluteFill style={{opacity: loop}}>
				<LoopFrame color={BLACK} />
			</AbsoluteFill>
			<Sound />
		</AbsoluteFill>
	);
};
