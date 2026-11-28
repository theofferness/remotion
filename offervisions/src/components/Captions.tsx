import type {Caption} from '@remotion/captions';
import React, {useMemo} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Script} from '../schema';
import {fontStack, useTheme} from '../theme';
import type {SceneTiming} from '../timing';

const MAX_WORDS_PER_PAGE = 4;
const MAX_CHARS_PER_PAGE = 22;

/**
 * Builds word-level captions from the script, spreading each scene's
 * caption across the time that scene is fully on screen.
 * Swap this for real transcription output (same `Caption` type) if you
 * record a voiceover – see README.
 */
export const captionsFromScript = (
	script: Script,
	timings: SceneTiming[],
	fps: number,
	transitionFrames: number,
): Caption[] => {
	const out: Caption[] = [];
	for (const t of timings) {
		const words = script[t.id].caption.split(/\s+/).filter(Boolean);
		const startMs = ((t.from + transitionFrames * 0.6) / fps) * 1000 + 150;
		const endMs = ((t.from + t.durationInFrames - transitionFrames) / fps) * 1000 - 250;
		// Weight by length (+ pause after punctuation) so timing feels spoken.
		const weights = words.map((w) => w.length + 3 + (/[.,!?…]$/.test(w) ? 5 : 0));
		const total = weights.reduce((a, b) => a + b, 0);
		let cursor = startMs;
		words.forEach((w, i) => {
			const len = ((endMs - startMs) * weights[i]) / total;
			out.push({
				text: (i === 0 ? '' : ' ') + w,
				startMs: cursor,
				endMs: cursor + len,
				timestampMs: cursor + len / 2,
				confidence: null,
				pageBreakAfter: i === words.length - 1,
			});
			cursor += len;
		});
	}
	return out;
};

type Page = {words: Caption[]; startMs: number; endMs: number};

const paginate = (captions: Caption[]): Page[] => {
	const pages: Page[] = [];
	let current: Caption[] = [];
	const flush = () => {
		if (current.length === 0) return;
		pages.push({
			words: current,
			startMs: current[0].startMs,
			endMs: current[current.length - 1].endMs,
		});
		current = [];
	};
	for (const c of captions) {
		const chars = current.map((w) => w.text).join('').length + c.text.length;
		if (current.length >= MAX_WORDS_PER_PAGE || (current.length > 0 && chars > MAX_CHARS_PER_PAGE)) {
			flush();
		}
		current.push(c);
		if (c.pageBreakAfter || /[.!?]$/.test(c.text.trim())) flush();
	}
	flush();
	return pages;
};

/** Bold word-by-word captions in the lower third, active word highlighted. */
export const Captions: React.FC<{readonly captions: Caption[]; readonly bottom?: number}> = ({
	captions,
	bottom = 440,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const theme = useTheme();
	const pages = useMemo(() => paginate(captions), [captions]);
	const ms = (frame / fps) * 1000;

	const page = pages.find((p) => ms >= p.startMs && ms < p.endMs + 120);
	if (!page) return null;

	const pageOut = interpolate(ms, [page.endMs, page.endMs + 120], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: 90,
				right: 90,
				bottom,
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				alignItems: 'baseline',
				fontFamily: fontStack(theme.headlineFont, 'sans'),
				fontWeight: 800,
				fontSize: 66,
				lineHeight: 1.15,
				letterSpacing: '-0.01em',
				opacity: pageOut,
			}}
		>
			{page.words.map((w, i) => {
				const appear = interpolate(ms, [w.startMs - 60, w.startMs + 140], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.34, 1.56, 0.64, 1),
				});
				const active = ms >= w.startMs && ms < w.endMs;
				return (
					<span
						key={i}
						style={{
							whiteSpace: 'pre',
							opacity: Math.min(1, appear * 1.4),
							scale: String((0.7 + 0.3 * appear) * (active ? 1.08 : 1)),
							translate: `0px ${(1 - appear) * 18}px`,
							display: 'inline-block',
							color: active ? theme.accent : theme.ink,
							textShadow: `0 4px 18px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)${
								active ? `, 0 0 26px ${theme.accent}88` : ''
							}`,
						}}
					>
						{w.text}
					</span>
				);
			})}
		</div>
	);
};
