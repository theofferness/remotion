import {linearTiming, TransitionSeries} from '@remotion/transitions';
import React, {useMemo} from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {Background} from './components/Background';
import {Captions, captionsFromScript} from './components/Captions';
import {Chrome} from './components/Chrome';
import {zoomBlur} from './components/zoomBlur';
import {CAPTIONS_OVERRIDE} from './config';
import {CompoundScene} from './scenes/CompoundScene';
import {CtaScene} from './scenes/CtaScene';
import {HookScene} from './scenes/HookScene';
import {SpikeScene} from './scenes/SpikeScene';
import {StairsScene} from './scenes/StairsScene';
import {VisionScene} from './scenes/VisionScene';
import type {OffervisionsProps} from './schema';
import {SoundDesign} from './SoundDesign';
import {ThemeProvider} from './theme';
import {getSceneTimings} from './timing';

export const Offervisions: React.FC<OffervisionsProps> = (props) => {
	const {brand, theme, audio, script, showCaptions, captionsOnCta, transitionFrames} = props;
	const {fps} = useVideoConfig();
	const timings = useMemo(() => getSceneTimings(script, fps, transitionFrames), [script, fps, transitionFrames]);
	const captions = useMemo(
		() =>
			CAPTIONS_OVERRIDE ??
			captionsFromScript(
				script,
				timings.filter((t) => captionsOnCta || t.id !== 'cta'),
				fps,
				transitionFrames,
			),
		[script, timings, fps, transitionFrames, captionsOnCta],
	);
	const frames = (sec: number) => Math.round(sec * fps);
	const transition =
		transitionFrames > 0 ? (
			<TransitionSeries.Transition presentation={zoomBlur()} timing={linearTiming({durationInFrames: transitionFrames})} />
		) : null;
	const ctaFrom = timings[timings.length - 1].from;

	return (
		<ThemeProvider theme={theme}>
			<AbsoluteFill style={{backgroundColor: theme.background}}>
				<Background />
				<TransitionSeries name="Scenes">
					<TransitionSeries.Sequence name="1 · Hook" durationInFrames={frames(script.hook.durationSec)}>
						<HookScene script={script.hook} />
					</TransitionSeries.Sequence>
					{transition}
					<TransitionSeries.Sequence name="2 · Motivation spike" durationInFrames={frames(script.spike.durationSec)}>
						<SpikeScene script={script.spike} />
					</TransitionSeries.Sequence>
					{transition}
					<TransitionSeries.Sequence name="3 · Discipline stairs" durationInFrames={frames(script.stairs.durationSec)}>
						<StairsScene script={script.stairs} />
					</TransitionSeries.Sequence>
					{transition}
					<TransitionSeries.Sequence name="4 · Compounding" durationInFrames={frames(script.compound.durationSec)}>
						<CompoundScene script={script.compound} />
					</TransitionSeries.Sequence>
					{transition}
					<TransitionSeries.Sequence name="5 · Vision" durationInFrames={frames(script.vision.durationSec)}>
						<VisionScene script={script.vision} />
					</TransitionSeries.Sequence>
					{transition}
					<TransitionSeries.Sequence name="6 · Follow CTA" durationInFrames={frames(script.cta.durationSec)}>
						<CtaScene brand={brand} />
					</TransitionSeries.Sequence>
				</TransitionSeries>
				{showCaptions ? <Captions captions={captions} /> : null}
				<Chrome brand={brand} hideAfterFrame={ctaFrom} />
				<SoundDesign audio={audio} timings={timings} transitionFrames={transitionFrames} />
			</AbsoluteFill>
		</ThemeProvider>
	);
};
