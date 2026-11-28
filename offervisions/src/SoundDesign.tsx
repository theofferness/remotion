import {Audio} from '@remotion/media';
import React from 'react';
import {interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {HOOK_THOUGHT_FRAME} from './scenes/HookScene';
import {SPIKE_PEAK_FRAME} from './scenes/SpikeScene';
import {STAIRS_STEP_FRAMES} from './scenes/StairsScene';
import {COMPOUND_DONE_FRAME} from './scenes/CompoundScene';
import {CTA_CLICK_FRAME} from './scenes/CtaScene';
import type {OffervisionsProps} from './schema';
import type {SceneId, SceneTiming} from './timing';

const src = (path: string) => (/^https?:\/\//.test(path) ? path : staticFile(path));

/** Music bed, optional voiceover and every sound effect, synced to scene timings. */
export const SoundDesign: React.FC<{
	readonly audio: OffervisionsProps['audio'];
	readonly timings: SceneTiming[];
	readonly transitionFrames: number;
}> = ({audio, timings, transitionFrames}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const at = (id: SceneId) => timings.find((t) => t.id === id)!.from;
	const musicLevel = audio.voiceover ? audio.musicVolume * audio.musicDuckedVolume : audio.musicVolume;

	type Hit = {name: string; file: string; from: number; volume?: number};
	const hits: Hit[] = [];
	// Whoosh into every scene change.
	timings.slice(1).forEach((t) => {
		hits.push({name: `Whoosh → ${t.id}`, file: audio.sfx.whoosh, from: t.from - Math.round(transitionFrames * 0.6)});
	});
	hits.push({name: 'Thought pop', file: audio.sfx.pop, from: at('hook') + HOOK_THOUGHT_FRAME, volume: 0.6});
	hits.push({name: 'Spike peak', file: audio.sfx.pop, from: at('spike') + SPIKE_PEAK_FRAME});
	STAIRS_STEP_FRAMES.forEach((f, i) => {
		hits.push({name: `Step ${i + 1}`, file: audio.sfx.pop, from: at('stairs') + f, volume: 0.55 + i * 0.07});
	});
	hits.push({name: 'Counter ding', file: audio.sfx.ding, from: at('compound') + COMPOUND_DONE_FRAME});
	hits.push({name: 'Riser into CTA', file: audio.sfx.riser, from: at('cta') - Math.round(1.6 * fps), volume: 0.7});
	hits.push({name: 'Follow click', file: audio.sfx.click, from: at('cta') + CTA_CLICK_FRAME - 1});
	hits.push({name: 'Followed ding', file: audio.sfx.ding, from: at('cta') + CTA_CLICK_FRAME + 2, volume: 0.5});

	return (
		<>
			{audio.music ? (
				<Audio
					name="Music"
					src={src(audio.music)}
					volume={(f) =>
						musicLevel *
						interpolate(f, [0, fps * 0.6, durationInFrames - fps * 1.5, durationInFrames], [0, 1, 1, 0], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						})
					}
				/>
			) : null}
			{audio.voiceover ? (
				<Audio name="Voiceover" src={src(audio.voiceover)} volume={audio.voiceoverVolume} />
			) : null}
			{audio.sfxEnabled
				? hits.map((h) => (
						<Sequence key={h.name} name={h.name} from={Math.max(0, h.from)} layout="none" durationInFrames={2 * fps}>
							<Audio src={src(h.file)} volume={audio.sfxVolume * (h.volume ?? 1)} />
						</Sequence>
					))
				: null}
		</>
	);
};
