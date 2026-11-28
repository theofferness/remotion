import React from 'react';
import {AbsoluteFill} from 'remotion';
import '../kit/fonts';
import {Backdrop, Particles} from '../kit/Atmosphere';
import {Book, PAGE_H} from '../kit/Book';
import {HandSvg} from '../kit/HandSvg';
import {Learner} from '../kit/Learner';
import {Lantern} from '../kit/Objects';
import {OnScreenText} from '../kit/OnScreenText';
import {ChapterPage} from '../kit/Pages';
import {PaletteProvider} from '../kit/palette';
import {SEASONS, SERIES} from '../kit/series';
import {TitleBanner} from '../kit/TitleBanner';
import {CHAPTER, VIDEO2} from './chapter';

const TABLE_Y = 1410;

/** Cover for Video 2: open book on the chapter number, the learner, the lit lantern, ≤5-word text. */
export const Ch00Cover2: React.FC = () => {
	const season = SEASONS[CHAPTER.season];
	const s = 0.82;
	return (
		<PaletteProvider palette={season}>
			<AbsoluteFill>
				<Backdrop />
				<Particles />
				<HandSvg>
					<line x1={-40} y1={TABLE_Y} x2={1120} y2={TABLE_Y} stroke={season.ink} strokeWidth={4.5} strokeLinecap="round" />
					<g transform={`translate(560 ${TABLE_Y - (PAGE_H * s) / 2 - 14}) scale(${s})`}>
						<Book
							open={1}
							left={
								<g transform="translate(190 120)">
									<Lantern x={0} y={0} scale={1.1} lit={1} glow={0.8} />
								</g>
							}
							right={
								<ChapterPage
									overline={`${season.part.toUpperCase()} · ${season.season.toUpperCase()}`}
									number={CHAPTER.number}
									title={CHAPTER.title}
									subtitle="page one"
									numberGlow={1.3}
								/>
							}
							glow={0.5}
						/>
					</g>
					<Learner x={115} y={TABLE_Y} scale={0.72} bookGlow={0.6} tilt={-8} />
				</HandSvg>
				<TitleBanner text={`${SERIES.show} · ${CHAPTER.title.toUpperCase()}`} />
				<OnScreenText small="One question for the year:" big={VIDEO2.cover.text} start={-100} bigSize={100} top={380} />
			</AbsoluteFill>
		</PaletteProvider>
	);
};
