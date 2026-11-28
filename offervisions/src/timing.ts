import type {Script} from './schema';

export const SCENE_ORDER = [
	'hook',
	'spike',
	'stairs',
	'compound',
	'vision',
	'cta',
] as const;
export type SceneId = (typeof SCENE_ORDER)[number];

export type SceneTiming = {
	id: SceneId;
	/** Absolute start frame in the final video. */
	from: number;
	durationInFrames: number;
};

/** Absolute timing of every scene, accounting for transition overlaps. */
export const getSceneTimings = (
	script: Script,
	fps: number,
	transitionFrames: number,
): SceneTiming[] => {
	let cursor = 0;
	return SCENE_ORDER.map((id, i) => {
		const durationInFrames = Math.round(script[id].durationSec * fps);
		const from = cursor - (i === 0 ? 0 : transitionFrames);
		cursor = from + durationInFrames;
		return {id, from, durationInFrames};
	});
};

export const getTotalFrames = (
	script: Script,
	fps: number,
	transitionFrames: number,
) => {
	const t = getSceneTimings(script, fps, transitionFrames);
	const last = t[t.length - 1];
	return last.from + last.durationInFrames;
};
