import {Audio} from '@remotion/media';
import React, {useMemo} from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import '../kit/fonts';
import {Backdrop, Particles} from '../kit/Atmosphere';
import {buildCaptions, Captions} from '../kit/Captions';
import {HorizonLine, type HorizonKey} from '../kit/HorizonLine';
import {WithIntro} from '../kit/LogoIntro';
import {PaletteProvider} from '../kit/palette';
import {Progress} from '../kit/Progress';
import {SEASONS} from '../kit/series';
import {SfxTrack, type SfxHit} from '../kit/Sfx';
import {TitleBanner} from '../kit/TitleBanner';
import type {Pt} from '../kit/shapes';
import {CHAPTER, type ReelScene, VIDEO1} from './chapter';
import {
	BOOK_EDGE_Y,
	HOST_WINDOW,
	MAP_TIMING,
	PAD,
	SHELF_Y,
	TABLE_Y,
	pathY,
	scrollAt,
	CloseScene,
	HookScene,
	HostScene,
	InsideScene,
	MapScene,
	OpenScene,
	ShelfScene,
	type SceneProps,
} from './v1scenes';

export const V1_FPS = 30;
export type V1Cut = 'master' | 'cut15';

const scenesFor = (cut: V1Cut): ReelScene[] => (cut === 'cut15' ? VIDEO1.cut15 : VIDEO1.scenes);

export const getV1Timeline = (fps: number, cut: V1Cut = 'master') => {
	let t = 0;
	return scenesFor(cut).map((s) => {
		const dur = Math.round(s.sec * fps);
		const out = {...s, start: t, dur};
		t += dur;
		return out;
	});
};

export const getV1Duration = (fps: number, cut: V1Cut = 'master') => {
	const tl = getV1Timeline(fps, cut);
	const last = tl[tl.length - 1];
	return last.start + last.dur;
};

const flat = (y: number): Pt[] => [
	[-40, y],
	[1120, y],
];

const COMPONENTS: Record<string, React.FC<SceneProps>> = {
	hook: HookScene,
	open: OpenScene,
	map: MapScene,
	shelf: ShelfScene,
	inside: InsideScene,
	host: HostScene,
	close: CloseScene,
};

/** What the continuous horizon line becomes in each scene. */
const shapeFor = (id: string, start: number): HorizonKey['shape'] => {
	switch (id) {
		case 'open':
			return () => [
				[-40, TABLE_Y],
				[60, TABLE_Y],
				[112, BOOK_EDGE_Y],
				[968, BOOK_EDGE_Y],
				[1020, TABLE_Y],
				[1120, TABLE_Y],
			];
		case 'map':
			return (f) => {
				const s = scrollAt(f - start);
				return Array.from({length: 40}, (_, i): Pt => {
					const x = -40 + (i / 39) * 1160;
					return [x, pathY(x + s)];
				});
			};
		case 'shelf':
		case 'inside':
			return () => flat(SHELF_Y);
		case 'host':
			return () => {
				const {l, r, top, sill} = HOST_WINDOW;
				return [
					[-40, sill],
					[l, sill],
					[l, top],
					[r, top],
					[r, sill],
					[1120, sill],
				];
			};
		default:
			return () => flat(TABLE_Y);
	}
};

/** Sound cues per scene (sound-design: ≤2 impacts per 30 s, ≤3 quiet pops, every cue on an edit or keyword). */
const sfxFor = (id: string, start: number, dur: number): SfxHit[] => {
	switch (id) {
		case 'hook':
			return [{sfx: 'air', at: 2, volume: 0.45}];
		case 'open': {
			const turnEnd = Math.min(106, dur - 26);
			return [
				{sfx: 'pageTurn', at: start + 16},
				{sfx: 'pageTurn', at: start + turnEnd - 36, volume: 0.8},
				{sfx: 'air', at: start + dur - 22, volume: 0.6},
			];
		}
		case 'map':
			return [0, 2, 4].map((i): SfxHit => ({sfx: 'pop', at: start + MAP_TIMING.arrivals[i] + 6, volume: 0.4}));
		case 'shelf':
			return [{sfx: 'air', at: start, volume: 0.4}];
		case 'inside':
			return [
				{sfx: 'pageTurn', at: start + 2, volume: 0.5},
				{sfx: 'pencil', at: start + 34, volume: 0.75},
			];
		case 'close':
			return [
				{sfx: 'bookClose', at: start + 36},
				{sfx: 'chime', at: start + 46, volume: 0.75},
			];
		default:
			return [];
	}
};

/** Video 1 – episode-day trailer: the year's table of contents. */
/** `intro` prepends the 1.5 s logo sting (off by default so the hook lands in the first 2 s). */
export const Ch00Video1: React.FC<{readonly cut?: V1Cut; readonly intro?: boolean}> = ({cut = 'master', intro = false}) => {
	const {fps} = useVideoConfig();
	const tl = getV1Timeline(fps, cut);
	const palette = SEASONS[CHAPTER.season];

	const horizon: HorizonKey[] = tl.map((s, i) => ({
		at: i === 0 ? 0 : s.start - (s.id === 'open' ? -3 : 6),
		morph: s.id === 'open' ? 34 : 28,
		shape: shapeFor(s.id, s.start),
	}));
	const hits = tl.flatMap((s) => sfxFor(s.id, s.start, s.dur));
	const captions = useMemo(() => buildCaptions(tl, fps), [tl, fps]);
	const closeStart = tl[tl.length - 1].start;
	const voice = cut === 'cut15' ? VIDEO1.voiceover15 : VIDEO1.voiceover;

	return (
		<PaletteProvider palette={palette}>
			<WithIntro intro={intro}>
			<AbsoluteFill>
				<Backdrop />
				<Particles />
				<HorizonLine keys={horizon} />
				{tl.map((s, i) => {
					const Comp = COMPONENTS[s.id];
					return (
						<Sequence key={s.id} name={`Scene · ${s.id}`} from={s.start - PAD} durationInFrames={s.dur + PAD * 2}>
							<Comp dur={s.dur} scene={s} first={i === 0} />
						</Sequence>
					);
				})}
				<TitleBanner text={CHAPTER.banner} from={tl[1].start} to={closeStart} />
				<Progress />
				<Captions blocks={captions} />
				<SfxTrack hits={hits} volume={VIDEO1.sfxVolume} />
				{voice ? <Audio name="Voiceover" src={staticFile(voice)} volume={VIDEO1.voiceoverVolume} /> : null}
			</AbsoluteFill>
			</WithIntro>
		</PaletteProvider>
	);
};
