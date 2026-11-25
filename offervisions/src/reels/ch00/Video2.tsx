import {Audio} from '@remotion/media';
import React, {useMemo} from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import '../kit/fonts';
import {Backdrop, Particles} from '../kit/Atmosphere';
import {buildCaptions, Captions} from '../kit/Captions';
import {HorizonLine, type HorizonKey} from '../kit/HorizonLine';
import {PaletteProvider} from '../kit/palette';
import {Progress} from '../kit/Progress';
import {SEASONS} from '../kit/series';
import {SfxTrack, type SfxHit} from '../kit/Sfx';
import {TitleBanner} from '../kit/TitleBanner';
import type {Pt} from '../kit/shapes';
import {CHAPTER, type ReelScene, VIDEO2} from './chapter';
import {BOOK_EDGE_Y, TABLE_Y} from './v1scenes';
import * as S from './v2scenes';

export const V2_FPS = 30;
export type V2Cut = 'master' | 'cut30' | 'cut15';

const scenesFor = (cut: V2Cut): ReelScene[] => (cut === 'cut30' ? VIDEO2.cut30 : cut === 'cut15' ? VIDEO2.cut15 : VIDEO2.scenes);

export const getV2Timeline = (fps: number, cut: V2Cut = 'master') => {
	let t = 0;
	return scenesFor(cut).map((s) => {
		const dur = Math.round(s.sec * fps);
		const out = {...s, start: t, dur};
		t += dur;
		return out;
	});
};

export const getV2Duration = (fps: number, cut: V2Cut = 'master') => {
	const tl = getV2Timeline(fps, cut);
	const last = tl[tl.length - 1];
	return last.start + last.dur;
};

const COMPONENTS: Record<string, React.FC<S.V2SceneProps>> = {
	hook: S.HookScene,
	list: S.ListScene,
	pile: S.PileScene,
	notfailure: S.NotFailureScene,
	wrongq: S.WrongQScene,
	story: S.StoryScene,
	should: S.ShouldScene,
	homework: S.HomeworkScene,
	different: S.DifferentScene,
	twist: S.TwistScene,
	direction: S.DirectionScene,
	rules: S.RulesScene,
	firstpage: S.FirstPageScene,
	chapters: S.ChaptersScene,
	invitation: S.InvitationScene,
	challenge: S.ChallengeScene,
	sentence: S.SentenceScene,
	seeit: S.SeeItScene,
	days: S.DaysScene,
	cta: S.CtaScene,
};

const flat = (y: number): Pt[] => [
	[-40, y],
	[1120, y],
];

const pageEdge = (): Pt[] => [
	[-40, TABLE_Y],
	[60, TABLE_Y],
	[112, BOOK_EDGE_Y],
	[968, BOOK_EDGE_Y],
	[1020, TABLE_Y],
	[1120, TABLE_Y],
];

/** An anxious heartbeat along the ground that speeds up and grows through the scene. */
const heartbeat = (start: number, dur: number) => (f: number): Pt[] => {
	const t = Math.max(0, f - start);
	const amp = 20 + 90 * Math.min(1, t / dur);
	const speed = 3 + 6 * Math.min(1, t / dur);
	const period = 300;
	const offset = (t * speed) % period;
	const pts: Pt[] = [];
	for (let x = -40; x <= 1120; x += 6) {
		const d = ((x + offset) % period) - period / 2;
		const spike = Math.exp(-((d / 7) ** 2)) - 0.45 * Math.exp(-(((d - 16) / 7) ** 2)) + 0.18 * Math.exp(-(((d + 40) / 14) ** 2));
		pts.push([x, S.G - amp * spike]);
	}
	return pts;
};

const mirror = (): Pt[] => {
	const {l, r, top, shoulder} = S.MIRROR;
	const cx = (l + r) / 2;
	const rx = (r - l) / 2;
	const arc: Pt[] = Array.from({length: 13}, (_, i) => {
		const a = Math.PI + (i / 12) * Math.PI;
		return [cx + Math.cos(a) * rx, shoulder + Math.sin(a) * (shoulder - top)];
	});
	return [[-40, S.G], [l, S.G], ...arc, [r, S.G], [1120, S.G]];
};

const shapeFor = (id: string, start: number, dur: number): HorizonKey['shape'] => {
	switch (id) {
		case 'hook':
		case 'firstpage':
		case 'chapters':
			return pageEdge;
		case 'pile':
			return heartbeat(start, dur);
		case 'story':
		case 'challenge':
		case 'sentence':
			return () => flat(S.DESK);
		case 'seeit':
		case 'days':
			return mirror;
		case 'cta':
			return () => flat(TABLE_Y);
		default:
			return () => flat(S.G);
	}
};

/** Sound cues: texture under edits, ≤2 impacts per 30 s (twist chime, book-close, end chime only in the master), ≤3 quiet pops per 30 s. */
const sfxFor = (id: string, start: number, dur: number, short: boolean): SfxHit[] => {
	switch (id) {
		case 'hook':
			return [
				{sfx: 'air', at: 0, volume: 0.4},
				{sfx: 'pageTurn', at: 6},
				{sfx: 'pageTurn', at: 36, volume: 0.8},
				{sfx: 'air', at: dur - 22, volume: 0.55},
			];
		case 'list':
			return [{sfx: 'pencil', at: start + 4, volume: 0.45}];
		case 'notfailure':
			return [{sfx: 'air', at: start, volume: 0.5}];
		case 'wrongq':
			return [{sfx: 'pencil', at: start + 2, volume: 0.4}];
		case 'should':
			return [{sfx: 'pencil', at: start + 10, volume: 0.35}];
		case 'twist':
			return [
				{sfx: 'air', at: start + 8, volume: 0.5},
				{sfx: 'chime', at: start + S.TWIST_LIGHT, volume: 0.7},
			];
		case 'rules':
			return [{sfx: 'air', at: start + dur - 20, volume: 0.5}];
		case 'firstpage':
			return [{sfx: 'pageTurn', at: start + 2, volume: 0.4}];
		case 'chapters':
			return [
				{sfx: 'pageTurn', at: start + 8, volume: 0.8},
				{sfx: 'pageTurn', at: start + 62, volume: 0.8},
				...[0, 1, 2].map((i): SfxHit => ({sfx: 'pop', at: start + 100 + i * 10, volume: 0.35})),
			];
		case 'invitation':
			return [{sfx: 'pageTurn', at: start + 2, volume: 0.5}];
		case 'challenge':
			return [{sfx: 'pencil', at: start + 10, volume: 0.65}];
		case 'sentence':
			return [{sfx: 'pencil', at: start + 6, volume: 0.65}];
		case 'seeit':
			return [
				{sfx: 'air', at: start, volume: 0.4},
				{sfx: 'pop', at: start + 50, volume: 0.35},
				{sfx: 'pop', at: start + 84, volume: 0.35},
			];
		case 'days':
			return [{sfx: 'pop', at: start + 4 + 13 * S.DAY_BLOCK_EVERY + 4, volume: 0.35}];
		case 'cta':
			return short
				? [{sfx: 'bookClose', at: start + 36}]
				: [
						{sfx: 'bookClose', at: start + 36},
						{sfx: 'chime', at: start + 46, volume: 0.6},
					];
		default:
			return [];
	}
};

/** Video 2 – the main Reel: "The question becomes a lantern". */
export const Ch00Video2: React.FC<{readonly cut?: V2Cut}> = ({cut = 'master'}) => {
	const {fps} = useVideoConfig();
	const tl = getV2Timeline(fps, cut);
	const palette = SEASONS[CHAPTER.season];
	const short = cut !== 'master';

	const horizon: HorizonKey[] = tl.map((s, i) => ({
		at: i === 0 ? 0 : s.start - 8,
		morph: 26,
		shape: shapeFor(s.id, s.start, s.dur),
	}));
	const hits = tl.flatMap((s) => sfxFor(s.id, s.start, s.dur, short));
	const captions = useMemo(() => buildCaptions(tl, fps), [tl, fps]);
	const ctaStart = tl[tl.length - 1].start;
	const voice = cut === 'cut30' ? VIDEO2.voiceover30 : cut === 'cut15' ? VIDEO2.voiceover15 : VIDEO2.voiceover;

	return (
		<PaletteProvider palette={palette}>
			<AbsoluteFill>
				<Backdrop />
				<Particles />
				<HorizonLine keys={horizon} />
				{tl.map((s, i) => {
					const Comp = COMPONENTS[s.id];
					return (
						<Sequence key={`${s.id}-${i}`} name={`${i + 1} · ${s.id}`} from={s.start - S.PAD} durationInFrames={s.dur + S.PAD * 2}>
							<Comp dur={s.dur} scene={s} first={i === 0} last={i === tl.length - 1} next={tl[i + 1]?.id} />
						</Sequence>
					);
				})}
				<TitleBanner text={CHAPTER.banner} from={tl[1].start} to={ctaStart} />
				<Progress />
				<Captions blocks={captions} />
				<SfxTrack hits={hits} volume={VIDEO2.sfxVolume} />
				{voice ? <Audio name="Voiceover" src={staticFile(voice)} volume={VIDEO2.voiceoverVolume} /> : null}
			</AbsoluteFill>
		</PaletteProvider>
	);
};
