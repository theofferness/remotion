import type {Caption} from '@remotion/captions';

/**
 * ─────────────────────────────────────────────────────────────
 *  OFFERVISIONS PROMO – EDIT EVERYTHING HERE
 * ─────────────────────────────────────────────────────────────
 *  • BRAND   – podcast name, handle, platforms, CTA text
 *  • THEME   – colours + fonts
 *  • AUDIO   – music bed, voiceover, sound effects, volumes
 *  • SCRIPT  – every line of on-screen text, captions and scene lengths
 *
 *  Total length is calculated automatically from the scene durations,
 *  so you can lengthen/shorten scenes freely. (Default = exactly 30s.)
 *
 *  All of these values are also exposed as editable props in
 *  Remotion Studio's right-hand panel (npm run dev).
 */

export const BRAND = {
	name: 'OFFERVISIONS',
	tagline: 'The self-development podcast',
	handle: '@offervisions',
	/** Shown under the follow button. */
	platforms: ['Spotify', 'Apple Podcasts', 'YouTube'],
	followLabel: 'FOLLOW',
	followedLabel: 'FOLLOWING',
	listenLabel: 'Listen on',
	/** Tiny badge shown top-left during the whole video. */
	badge: 'PODCAST',
};

export const THEME = {
	/** Page background. */
	background: '#07070A',
	/** Soft spotlight colour behind the action. */
	backgroundGlow: '#23202E',
	/** Lines, figures and main text. */
	ink: '#F4F1EA',
	/** Secondary text. */
	muted: '#8C8899',
	/** Highlight colour: emphasis words, active caption word, sun, button. */
	accent: '#F5C451',
	/** Text colour placed on top of the accent (e.g. the follow button). */
	onAccent: '#0B0B0F',
	/** Font family names – must match a `family` in FONTS below. */
	headlineFont: 'Inter',
	serifFont: 'Instrument Serif',
};

/**
 * Font files bundled in /public/fonts (so renders work offline).
 * To change fonts: drop .woff2/.ttf files into public/fonts, list them here,
 * and set THEME.headlineFont / THEME.serifFont to the new family names.
 */
export const FONTS = [
	{family: 'Inter', file: 'fonts/Inter.woff2', weight: '100 900', style: 'normal'},
	{family: 'Instrument Serif', file: 'fonts/InstrumentSerif-Regular.woff2', weight: '400', style: 'normal'},
	{family: 'Instrument Serif', file: 'fonts/InstrumentSerif-Italic.woff2', weight: '400', style: 'italic'},
];

export const AUDIO = {
	/** Files live in /public. Set to null to disable. */
	music: 'audio/music.mp3' as string | null,
	musicVolume: 0.6,
	/** While a voiceover plays, music is ducked to this fraction. */
	musicDuckedVolume: 0.25,
	/** Optional voiceover file in /public, e.g. 'audio/voiceover.mp3'. */
	voiceover: null as string | null,
	voiceoverVolume: 1,
	sfxEnabled: true,
	sfxVolume: 0.55,
	sfx: {
		whoosh: 'audio/whoosh.mp3',
		pop: 'audio/pop.mp3',
		ding: 'audio/ding.mp3',
		click: 'audio/click.mp3',
		riser: 'audio/riser.mp3',
	},
};

/**
 * The script. Each scene has:
 *  - durationSec : how long the scene is on screen
 *  - caption     : the subtitle / voiceover line (animated word-by-word)
 *  - kicker      : small italic serif line at the top
 *  - headline    : big bold line. Wrap a word in *asterisks* to colour it with the accent.
 *
 * Scene visuals (in order): staircase hook → motivation spike graph →
 * discipline staircase climb → 1% compounding counter → vision sunrise → follow CTA.
 */
export const SCRIPT = {
	hook: {
		durationSec: 5,
		kicker: 'Most people don’t fail.',
		headline: 'They never *start*.',
		caption: 'Most people don’t fail. They just never start.',
	},
	spike: {
		durationSec: 5,
		kicker: 'Motivation is a spike.',
		headline: 'It *fades*.',
		graphLabel: 'MOTIVATION',
		dropLabel: 'MONDAY',
		caption: 'Motivation is a spike. By Monday, it’s gone.',
	},
	stairs: {
		durationSec: 6,
		kicker: 'Discipline is a staircase.',
		headline: 'One *step* a day.',
		stepLabel: '+1%',
		caption: 'Discipline is a staircase. One small step, every single day.',
	},
	compound: {
		durationSec: 5.5,
		kicker: '1% better, every day.',
		headline: 'For one *year*.',
		/** Counter animates to this value. 1.01^365 ≈ 37.8 */
		counterTo: 37.8,
		counterSuffix: '×',
		formula: '1.01³⁶⁵ ≈ 37.8',
		caption: 'Get one percent better each day, and in a year you’re thirty-seven times better.',
	},
	vision: {
		durationSec: 5,
		kicker: 'Stop waiting to feel ready.',
		headline: 'Offer yourself a *vision*.',
		caption: 'Stop waiting to feel ready. Offer yourself a vision.',
	},
	cta: {
		durationSec: 5.5,
		caption: 'Follow Offervisions. New episodes every week.',
	},
};

/** Video format. 1080×1920 = vertical 9:16 (TikTok, Reels, Shorts). */
export const FORMAT = {
	width: 1080,
	height: 1920,
	fps: 30,
	/** Length of each scene transition in frames (overlaps neighbouring scenes). */
	transitionFrames: 12,
	/** Show the word-by-word captions. */
	showCaptions: true,
	/** Also caption the final CTA scene (off by default – the CTA text speaks for itself). */
	captionsOnCta: false,
};

/**
 * Recorded a voiceover? Transcribe it (e.g. with @remotion/install-whisper-cpp
 * or any tool that outputs word timestamps) and paste the words here in
 * Remotion's Caption format to sync captions to your real voice:
 *   [{text: 'Most', startMs: 200, endMs: 480, timestampMs: 340, confidence: null}, ...]
 * Leave as null to auto-time captions from SCRIPT.
 */
export const CAPTIONS_OVERRIDE: Caption[] | null = null;
