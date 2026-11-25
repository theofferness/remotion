import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import '../kit/fonts';
import {Backdrop, Particles} from '../kit/Atmosphere';
import {HorizonLine, type HorizonKey} from '../kit/HorizonLine';
import {PaletteProvider} from '../kit/palette';
import {SEASONS} from '../kit/series';
import {SfxTrack, type SfxHit} from '../kit/Sfx';
import {TitleBanner} from '../kit/TitleBanner';
import type {Pt} from '../kit/shapes';
import {CHAPTER, VIDEO1} from './chapter';
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

export const getV1Timeline = (fps: number) => {
	let t = 0;
	return VIDEO1.scenes.map((s) => {
		const dur = Math.round(s.sec * fps);
		const out = {...s, start: t, dur};
		t += dur;
		return out;
	});
};

export const getV1Duration = (fps: number) => {
	const tl = getV1Timeline(fps);
	const last = tl[tl.length - 1];
	return last.start + last.dur;
};

const flat = (y: number): Pt[] => [
	[-40, y],
	[1120, y],
];

/** Video 1 – episode-day trailer: the year's table of contents. */
export const Ch00Video1: React.FC = () => {
	const {fps} = useVideoConfig();
	const tl = getV1Timeline(fps);
	const at = (id: string) => tl.find((s) => s.id === id)!;
	const palette = SEASONS[CHAPTER.season];

	const map = at('map');
	const horizon: HorizonKey[] = [
		{at: 0, shape: () => flat(TABLE_Y)},
		{
			at: at('open').start + 8,
			morph: 40,
			shape: () => [
				[-40, TABLE_Y],
				[60, TABLE_Y],
				[112, BOOK_EDGE_Y],
				[968, BOOK_EDGE_Y],
				[1020, TABLE_Y],
				[1120, TABLE_Y],
			],
		},
		{
			at: map.start - 6,
			morph: 36,
			shape: (f) => {
				const s = scrollAt(f - map.start);
				return Array.from({length: 40}, (_, i): Pt => {
					const x = -40 + (i / 39) * 1160;
					return [x, pathY(x + s)];
				});
			},
		},
		{at: at('shelf').start, morph: 30, shape: () => flat(SHELF_Y)},
		{
			at: at('host').start,
			morph: 36,
			shape: () => {
				const {l, r, top, sill} = HOST_WINDOW;
				return [
					[-40, sill],
					[l, sill],
					[l, top],
					[r, top],
					[r, sill],
					[1120, sill],
				];
			},
		},
		{at: at('close').start, morph: 34, shape: () => flat(TABLE_Y)},
	];

	const {arrivals} = MAP_TIMING;
	const hits: SfxHit[] = [
		{sfx: 'air', at: 2, volume: 0.5},
		{sfx: 'pageTurn', at: at('open').start + 22},
		{sfx: 'pageTurn', at: at('open').start + 72, volume: 0.85},
		{sfx: 'air', at: map.start - 14, volume: 0.8},
		...arrivals.map((a, i): SfxHit => ({sfx: 'pop', at: map.start + a + 6, volume: 0.6 + i * 0.06})),
		...Array.from({length: 6}, (_, i): SfxHit => ({sfx: 'pop', at: at('shelf').start + 8 + i * 10, volume: 0.3})),
		{sfx: 'pageTurn', at: at('inside').start + 6, volume: 0.6},
		{sfx: 'pencil', at: at('inside').start + 34, volume: 0.8},
		{sfx: 'pop', at: at('inside').start + 36, volume: 0.5},
		{sfx: 'pop', at: at('inside').start + 54, volume: 0.5},
		{sfx: 'pop', at: at('inside').start + 72, volume: 0.5},
		{sfx: 'chime', at: at('host').start + 30, volume: 0.45},
		{sfx: 'bookClose', at: at('close').start + 50},
		{sfx: 'chime', at: at('close').start + 62, volume: 0.8},
	];

	const scene = (id: string, Comp: React.FC<SceneProps>, first = false) => {
		const s = at(id);
		return (
			<Sequence key={id} name={`Scene · ${id}`} from={s.start - PAD} durationInFrames={s.dur + PAD * 2}>
				<Comp dur={s.dur} scene={s} first={first} />
			</Sequence>
		);
	};

	return (
		<PaletteProvider palette={palette}>
			<AbsoluteFill>
				<Backdrop />
				<Particles />
				<HorizonLine keys={horizon} />
				{scene('hook', HookScene, true)}
				{scene('open', OpenScene)}
				{scene('map', MapScene)}
				{scene('shelf', ShelfScene)}
				{scene('inside', InsideScene)}
				{scene('host', HostScene)}
				{scene('close', CloseScene)}
				<TitleBanner text={CHAPTER.banner} from={at('open').start} to={at('close').start + 10} />
				<SfxTrack hits={hits} volume={VIDEO1.sfxVolume} />
				{VIDEO1.voiceover ? (
					<Audio name="Voiceover" src={staticFile(VIDEO1.voiceover)} volume={VIDEO1.voiceoverVolume} />
				) : null}
			</AbsoluteFill>
		</PaletteProvider>
	);
};
