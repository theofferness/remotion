import {zColor} from '@remotion/zod-types';
import {z} from 'zod';
import {AUDIO, BRAND, FORMAT, SCRIPT, THEME} from './config';

const scene = {
	durationSec: z.number().min(1).max(20),
	caption: z.string(),
};

export const offervisionsSchema = z.object({
	brand: z.object({
		name: z.string(),
		tagline: z.string(),
		handle: z.string(),
		platforms: z.array(z.string()),
		followLabel: z.string(),
		followedLabel: z.string(),
		listenLabel: z.string(),
		badge: z.string(),
	}),
	theme: z.object({
		background: zColor(),
		backgroundGlow: zColor(),
		ink: zColor(),
		muted: zColor(),
		accent: zColor(),
		onAccent: zColor(),
		headlineFont: z.string(),
		serifFont: z.string(),
	}),
	audio: z.object({
		music: z.string().nullable(),
		musicVolume: z.number().min(0).max(1),
		musicDuckedVolume: z.number().min(0).max(1),
		voiceover: z.string().nullable(),
		voiceoverVolume: z.number().min(0).max(1),
		sfxEnabled: z.boolean(),
		sfxVolume: z.number().min(0).max(1),
		sfx: z.object({
			whoosh: z.string(),
			pop: z.string(),
			ding: z.string(),
			click: z.string(),
			riser: z.string(),
		}),
	}),
	script: z.object({
		hook: z.object({...scene, kicker: z.string(), headline: z.string()}),
		spike: z.object({
			...scene,
			kicker: z.string(),
			headline: z.string(),
			graphLabel: z.string(),
			dropLabel: z.string(),
		}),
		stairs: z.object({
			...scene,
			kicker: z.string(),
			headline: z.string(),
			stepLabel: z.string(),
		}),
		compound: z.object({
			...scene,
			kicker: z.string(),
			headline: z.string(),
			counterTo: z.number(),
			counterSuffix: z.string(),
			formula: z.string(),
		}),
		vision: z.object({...scene, kicker: z.string(), headline: z.string()}),
		cta: z.object(scene),
	}),
	showCaptions: z.boolean(),
	captionsOnCta: z.boolean(),
	transitionFrames: z.number().int().min(0).max(30),
});

export type OffervisionsProps = z.infer<typeof offervisionsSchema>;
export type Brand = OffervisionsProps['brand'];
export type Theme = OffervisionsProps['theme'];
export type Script = OffervisionsProps['script'];

export const defaultProps: OffervisionsProps = {
	brand: BRAND,
	theme: THEME,
	audio: AUDIO,
	script: SCRIPT,
	showCaptions: FORMAT.showCaptions,
	captionsOnCta: FORMAT.captionsOnCta,
	transitionFrames: FORMAT.transitionFrames,
};
