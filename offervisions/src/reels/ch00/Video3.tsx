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
import {PAD} from '../kit/scene';
import {SEASONS} from '../kit/series';
import {SfxTrack, type SfxHit} from '../kit/Sfx';
import {TitleBanner} from '../kit/TitleBanner';
import type {Pt} from '../kit/shapes';
import {CHAPTER, type ReelScene, VIDEO3} from './chapter';
import {BOOK_EDGE_Y, TABLE_Y} from './v1scenes';
import {CtaScene, HookScene, type V2SceneProps} from './v2scenes';
import {BreatheScene, BridgeScene, CLEAR_AT, ClearScene, CopyScene, G, WIN, WriteScene, bridgeY} from './v3scenes';

export const V3_FPS = 30;
export type V3Cut = 'master' | 'cut15';

const scenesFor = (cut: V3Cut): ReelScene[] => (cut === 'cut15' ? VIDEO3.cut15 : VIDEO3.scenes);

export const getV3Timeline = (fps: number, cut: V3Cut = 'master') => {
	let t = 0;
	return scenesFor(cut).map((s) => {
		const dur = Math.round(s.sec * fps);
		const out = {...s, start: t, dur};
		t += dur;
		return out;
	});
};

export const getV3Duration = (fps: number, cut: V3Cut = 'master') => {
	const tl = getV3Timeline(fps, cut);
	const last = tl[tl.length - 1];
	return last.start + last.dur;
};

const COMPONENTS: Record<string, React.FC<V2SceneProps>> = {
	hook: HookScene,
	breathe: BreatheScene,
	write: WriteScene,
	clear: ClearScene,
	copy: CopyScene,
	bridge: BridgeScene,
	cta: CtaScene,
};

const flat = (y: number): Pt[] => [
	[-40, y],
	[1120, y],
];

const shapeFor = (id: string): HorizonKey['shape'] => {
	switch (id) {
		case 'hook':
			return () => [
				[-40, TABLE_Y],
				[60, TABLE_Y],
				[112, BOOK_EDGE_Y],
				[968, BOOK_EDGE_Y],
				[1020, TABLE_Y],
				[1120, TABLE_Y],
			];
		case 'breathe':
		case 'write':
		case 'clear':
		case 'copy':
			return () => [
				[-40, WIN.sill],
				[WIN.l, WIN.sill],
				[WIN.l, WIN.top],
				[WIN.r, WIN.top],
				[WIN.r, WIN.sill],
				[1120, WIN.sill],
			];
		case 'bridge':
			return () => Array.from({length: 60}, (_, i): Pt => {
				const x = -40 + (i / 59) * 1160;
				return [x, bridgeY(x)];
			});
		case 'cta':
			return () => flat(TABLE_Y);
		default:
			return () => flat(G);
	}
};

/** ≤2 impacts per 30 s: the chime when the view clears + the book-close. Texture under the rest. */
const sfxFor = (id: string, start: number, dur: number): SfxHit[] => {
	switch (id) {
		case 'hook':
			return [
				{sfx: 'air', at: 0, volume: 0.4},
				{sfx: 'pageTurn', at: 6},
				{sfx: 'pageTurn', at: 36, volume: 0.8},
				{sfx: 'air', at: dur - 22, volume: 0.5},
			];
		case 'breathe':
			return [{sfx: 'air', at: start + 6, volume: 0.6}];
		case 'write':
			return [{sfx: 'pencil', at: start + 10, volume: 0.35}];
		case 'clear':
			return [{sfx: 'chime', at: start + CLEAR_AT, volume: 0.6}];
		case 'copy':
			return [
				{sfx: 'pop', at: start + 6, volume: 0.35},
				{sfx: 'pencil', at: start + 14, volume: 0.6},
			];
		case 'bridge':
			return [{sfx: 'air', at: start, volume: 0.35}];
		case 'cta':
			return [{sfx: 'bookClose', at: start + 36}];
		default:
			return [];
	}
};

/** Video 3 – follow-up: "Write it on the window". */
export const Ch00Video3: React.FC<{readonly cut?: V3Cut; readonly intro?: boolean}> = ({cut = 'master', intro = false}) => {
	const {fps} = useVideoConfig();
	const tl = getV3Timeline(fps, cut);
	const palette = SEASONS[CHAPTER.season];
	const horizon: HorizonKey[] = tl.map((s, i) => ({at: i === 0 ? 0 : s.start - 8, morph: 26, shape: shapeFor(s.id)}));
	const hits = tl.flatMap((s) => sfxFor(s.id, s.start, s.dur));
	const captions = useMemo(() => buildCaptions(tl, fps), [tl, fps]);
	const voice = cut === 'cut15' ? VIDEO3.voiceover15 : VIDEO3.voiceover;
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
							<Sequence key={`${s.id}-${i}`} name={`${i + 1} · ${s.id}`} from={s.start - PAD} durationInFrames={s.dur + PAD * 2}>
								<Comp dur={s.dur} scene={s} first={i === 0} last={i === tl.length - 1} next={tl[i + 1]?.id} />
							</Sequence>
						);
					})}
					<TitleBanner text={CHAPTER.banner} from={tl[1].start} to={tl[tl.length - 1].start} />
					<Progress />
					<Captions blocks={captions} />
					<SfxTrack hits={hits} volume={VIDEO3.sfxVolume} />
					{voice ? <Audio name="Voiceover" src={staticFile(voice)} volume={VIDEO3.voiceoverVolume} /> : null}
				</AbsoluteFill>
			</WithIntro>
		</PaletteProvider>
	);
};
