import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SOFT_IN_OUT, prog} from './anim';
import {OnScreenText} from './OnScreenText';

/** Frames each scene overlaps its neighbours: cross-dissolve = 2 × PAD = 10 frames (motion-director). */
export const PAD = 5;

export type SceneData = {id: string; sec: number; vo: string; small: string; big?: string};
export type SceneProps = {readonly dur: number; readonly scene: SceneData; readonly first?: boolean; readonly last?: boolean};

/** Own time `t` (0 = official scene start) and cross-fade opacity for a scene inside its padded Sequence. */
export const useScene = (dur: number, first?: boolean, last?: boolean) => {
	const f = useCurrentFrame();
	const t = f - PAD;
	const fadeIn = first ? 1 : prog(f, 0, PAD * 2, SOFT_IN_OUT);
	const fadeOut = last ? 1 : 1 - prog(f, dur, dur + PAD * 2, SOFT_IN_OUT);
	return {t, fade: fadeIn * fadeOut};
};

/** The scene's small italic line + bold key phrase, timed to the scene. */
export const SceneText: React.FC<{readonly scene: SceneData; readonly dur: number; readonly hook?: boolean}> = ({scene, dur, hook}) => (
	<OnScreenText
		small={scene.small}
		big={scene.big}
		start={hook ? 0 : PAD + 2}
		bigDelay={hook ? 10 : 12}
		end={PAD + dur - 14}
		bigSize={scene.big && scene.big.split(' ').length > 4 ? 84 : 92}
	/>
);
