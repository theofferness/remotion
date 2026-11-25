import {Audio} from '@remotion/media';
import React from 'react';
import {Sequence, staticFile} from 'remotion';

export const SFX = {
	pageTurn: 'audio/reels/page-turn.mp3',
	bookClose: 'audio/reels/book-close.mp3',
	pencil: 'audio/reels/pencil.mp3',
	chime: 'audio/reels/chime.mp3',
	air: 'audio/reels/air.mp3',
	pop: 'audio/reels/pop.mp3',
} as const;

export type SfxName = keyof typeof SFX;
export type SfxHit = {sfx: SfxName; at: number; volume?: number};

/** Renders a list of sound-effect hits at absolute frames. */
export const SfxTrack: React.FC<{readonly hits: SfxHit[]; readonly volume: number}> = ({hits, volume}) => (
	<>
		{hits.map((h, i) => (
			<Sequence key={`${h.sfx}-${i}`} name={`SFX · ${h.sfx}`} from={Math.max(0, Math.round(h.at))} durationInFrames={90} layout="none">
				<Audio src={staticFile(SFX[h.sfx])} volume={volume * (h.volume ?? 1)} />
			</Sequence>
		))}
	</>
);
