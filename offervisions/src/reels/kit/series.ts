import type {AvatarVariant} from './Avatars';

/**
 * ─────────────────────────────────────────────────────────────
 *  OFFERVISIONS 2027 – SERIES SETTINGS (shared by every Reel)
 * ─────────────────────────────────────────────────────────────
 */
export const SERIES = {
	show: 'OFFERVISIONS',
	station: 'Big Bang Radio',
	airtime: 'Mondays · 11 AM',
	host: 'Lucia',
	hostRole: 'a fellow learner',
	year: '2027',
	/** The learner's design in every Reel – see the Avatar-Options composition. */
	learner: 'classic' as AvatarVariant,
};

/**
 * One colour pair per season: `bg` fills the whole frame,
 * `ink` is used for every line, glow and piece of text.
 * Add spring/summer/autumn/epilogue colours here when those parts start.
 */
export const SEASONS = {
	winter: {part: 'Part One', season: 'Winter', theme: 'Visualisation', bg: '#2E3A6B', ink: '#FFFFFF'},
} as const;

export type SeasonKey = keyof typeof SEASONS;

/** Instagram Reels safe zones (px) – nothing important is placed here. */
export const SAFE = {top: 250, bottom: 400};

/** Fonts bundled in /public/fonts. */
export const REEL_FONTS = {
	/** Bold all-caps key phrases. */
	bold: 'Nunito',
	/** Small italic setup lines. */
	italic: 'Instrument Serif',
	/** Handwritten tags and labels. */
	hand: 'Caveat',
};
