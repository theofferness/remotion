import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {SOFT, prog} from './anim';
import {BOLD} from './fonts';
import {alpha, usePalette} from './palette';

/**
 * Burned-in captions (see the `captions` skill):
 *  - 2–5 words per block, one emphasis word marked *like this* in the VO line
 *  - fixed band y ≈ 1430–1510 (inside Instagram's safe area, ≥180 px margin)
 *  - a block is held back when the same words are already on screen as the scene's text
 *
 * Until Lucie's voice is recorded, words are timed from the script across each scene.
 * Once recorded, pass `override` blocks built from a transcript of her take.
 */

export type CaptionScene = {start: number; dur: number; vo: string; small?: string; big?: string};
export type CaptionWord = {text: string; emph: boolean};
export type CaptionBlock = {words: CaptionWord[]; from: number; to: number; hidden: boolean};

const norm = (s: string) =>
	s
		.toLowerCase()
		.replace(/[*’']/g, '')
		.replace(/[^a-z0-9 ]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

const MAX_WORDS = 4;
const MAX_CHARS = 24;

export const buildCaptions = (scenes: CaptionScene[], fps: number): CaptionBlock[] => {
	const blocks: CaptionBlock[] = [];
	for (const sc of scenes) {
		const raw = sc.vo.split(/\s+/).filter(Boolean);
		if (raw.length === 0) continue;
		const words = raw.map((w) => ({text: w.replace(/\*/g, ''), emph: /\*/.test(w)}));
		// split into phrases at punctuation, then each phrase into balanced blocks (≤ MAX_WORDS / MAX_CHARS)
		const phrases: CaptionWord[][] = [];
		let cur: CaptionWord[] = [];
		for (const w of words) {
			cur.push(w);
			if (/[.,:;!?…]$/.test(w.text)) {
				phrases.push(cur);
				cur = [];
			}
		}
		if (cur.length) phrases.push(cur);
		const chunks: CaptionWord[][] = [];
		for (const ph of phrases) {
			const chars = ph.map((w) => w.text).join(' ').length;
			const k = Math.max(Math.ceil(ph.length / MAX_WORDS), Math.ceil(chars / MAX_CHARS));
			const size = Math.ceil(ph.length / k);
			for (let i = 0; i < ph.length; i += size) chunks.push(ph.slice(i, i + size));
		}
		// no single-word blocks: merge with a neighbour (max 5 words)
		for (let i = 0; i < chunks.length; i++) {
			if (chunks[i].length === 1 && chunks.length > 1) {
				const prev = chunks[i - 1];
				const next = chunks[i + 1];
				if (next && next.length < 5 && (!prev || prev.length >= next.length)) {
					chunks[i + 1] = [...chunks[i], ...next];
				} else if (prev && prev.length < 5) {
					chunks[i - 1] = [...prev, ...chunks[i]];
				} else continue;
				chunks.splice(i, 1);
				i--;
			}
		}
		// time: spread across the scene, weighted by length + pauses after punctuation
		const from0 = sc.start + Math.round(0.15 * fps);
		const to0 = sc.start + sc.dur - Math.round(0.2 * fps);
		const weight = (c: CaptionWord[]) =>
			c.reduce((a, w) => a + w.text.length + 2, 0) + (/[.!?]$/.test(c[c.length - 1].text) ? 6 : 2);
		const total = chunks.reduce((a, c) => a + weight(c), 0);
		const onScreen = norm(`${sc.small ?? ''} ${sc.big ?? ''}`);
		let cursor = from0;
		for (const c of chunks) {
			const len = ((to0 - from0) * weight(c)) / total;
			const text = norm(c.map((w) => w.text).join(' '));
			blocks.push({words: c, from: Math.round(cursor), to: Math.round(cursor + len), hidden: text.length > 0 && onScreen.includes(text)});
			cursor += len;
		}
	}
	return blocks;
};

/** Words per minute of a scene's VO for a given duration (for QA). */
export const wpm = (vo: string, seconds: number) => (vo.split(/\s+/).filter(Boolean).length / seconds) * 60;

export const Captions: React.FC<{readonly blocks: CaptionBlock[]; readonly top?: number}> = ({blocks, top = 1430}) => {
	const frame = useCurrentFrame();
	const {ink} = usePalette();
	const block = useMemo(() => blocks.find((b) => frame >= b.from && frame < b.to), [blocks, frame]);
	if (!block || block.hidden) return null;
	const inP = prog(frame, block.from, block.from + 4, SOFT);
	const outP = 1 - prog(frame, block.to - 3, block.to, SOFT);
	return (
		<div
			style={{
				position: 'absolute',
				top,
				left: 90,
				right: 90,
				height: 80,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				gap: '0.28em',
				fontFamily: BOLD,
				fontSize: 58,
				color: ink,
				opacity: inP * outP,
				translate: `0px ${(1 - inP) * 6}px`,
				textShadow: `0 2px 14px rgba(8,12,35,0.85)`,
			}}
		>
			{block.words.map((w, i) => (
				<span
					key={i}
					style={{
						fontWeight: w.emph ? 900 : 650,
						opacity: w.emph ? 1 : 0.92,
						textShadow: w.emph ? `0 2px 14px rgba(8,12,35,0.85), 0 0 22px ${alpha(ink, 0.6)}` : undefined,
					}}
				>
					{w.text}
				</span>
			))}
		</div>
	);
};
