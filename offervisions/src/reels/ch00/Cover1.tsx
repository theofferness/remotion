import React from 'react';
import {AbsoluteFill} from 'remotion';
import '../kit/fonts';
import {Backdrop, Particles} from '../kit/Atmosphere';
import {Book, PAGE_H} from '../kit/Book';
import {TeaCup} from '../kit/Cozy';
import {HandSvg} from '../kit/HandSvg';
import {Learner} from '../kit/Learner';
import {OnScreenText} from '../kit/OnScreenText';
import {ChapterPage, InsideCover} from '../kit/Pages';
import {PaletteProvider} from '../kit/palette';
import {SEASONS, SERIES} from '../kit/series';
import {TitleBanner} from '../kit/TitleBanner';
import {CHAPTER, VIDEO1} from './chapter';

const TABLE_Y = 1410;

/**
 * Cover frame for Video 1: the open book on the chapter page, the learner,
 * and max-5-word cover text. Key content stays inside the centre 3:4 crop
 * Instagram uses on the profile grid.
 */
export const Ch00Cover1: React.FC = () => {
	const season = SEASONS[CHAPTER.season];
	const s = 0.9;
	return (
		<PaletteProvider palette={season}>
			<AbsoluteFill>
				<Backdrop />
				<Particles />
				<HandSvg>
					<line x1={-40} y1={TABLE_Y} x2={1120} y2={TABLE_Y} stroke={season.ink} strokeWidth={4.5} strokeLinecap="round" />
					<g transform={`translate(600 ${TABLE_Y - (PAGE_H * s) / 2 - 14}) scale(${s})`}>
						<Book
							open={1}
							left={<InsideCover lines={['for anyone', 'who wants to grow']} />}
							right={
								<ChapterPage
									overline={`${season.part.toUpperCase()} · ${season.season.toUpperCase()}`}
									number={CHAPTER.number}
									title={CHAPTER.title}
									subtitle={CHAPTER.subtitle}
									numberGlow={1.4}
									pageNo="p. 1"
								/>
							}
							glow={0.5}
						/>
					</g>
					<Learner x={120} y={TABLE_Y} scale={0.72} bookGlow={0.6} tilt={-6} />
					<TeaCup x={1000} y={TABLE_Y} scale={0.62} />
				</HandSvg>
				<TitleBanner text={`${SERIES.show} · ${SERIES.year}`} />
				<OnScreenText small={`${CHAPTER.title} · ${CHAPTER.airs}`} big={VIDEO1.cover.text} start={-100} bigSize={104} top={380} />
			</AbsoluteFill>
		</PaletteProvider>
	);
};
