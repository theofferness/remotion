/**
 * ─────────────────────────────────────────────────────────────
 *  OFFERVISIONS 2027 – OFFICIAL IDENTITY (from the six chapter covers)
 * ─────────────────────────────────────────────────────────────
 *  Colours are sampled from the supplied covers in brand-assets/. Do not
 *  replace them with generic seasonal palettes.
 */
export type SeasonKey = 'intro' | 'winter' | 'spring' | 'summer' | 'fall' | 'epilogue';

export type Season = {
	bg: string;
	ink: string;
	/** Which supplied logo file to use on this background. */
	logo: 'white' | 'black';
	overline: string;
	theme: string;
	months: string;
	/** Line from the 2027 scripts describing the part. */
	line: string;
	numeral: string;
};

export const SEASONS: Record<SeasonKey, Season> = {
	intro: {bg: '#0d0d0d', ink: '#ffffff', logo: 'white', overline: 'OPENING CREDITS', theme: 'January 11, 2027', months: 'JANUARY 11', line: '', numeral: ''},
	winter: {
		bg: '#141a36',
		ink: '#ffffff',
		logo: 'white',
		overline: 'PART ONE · WINTER',
		theme: 'Visualisation',
		months: 'JANUARY – FEBRUARY',
		line: 'Seeing clearly who we want to become.',
		numeral: 'I',
	},
	spring: {
		bg: '#142a20',
		ink: '#ffffff',
		logo: 'white',
		overline: 'PART TWO · SPRING',
		theme: 'Realisation',
		months: 'MARCH – MAY',
		line: 'We start making that vision real.',
		numeral: 'II',
	},
	summer: {
		bg: '#c99a2e',
		ink: '#2a1810',
		logo: 'black',
		overline: 'PART THREE · SUMMER',
		theme: 'Connection',
		months: 'JUNE – AUGUST',
		line: 'Connecting with who we really are.',
		numeral: 'III',
	},
	fall: {
		bg: '#4a1420',
		ink: '#ffffff',
		logo: 'white',
		overline: 'PART FOUR · FALL',
		theme: 'Integration',
		months: 'SEPTEMBER – NOVEMBER',
		line: 'Everything we’ve practiced comes together.',
		numeral: 'IV',
	},
	epilogue: {
		bg: '#f3ede2',
		ink: '#1f1f1f',
		logo: 'black',
		overline: 'EPILOGUE · DECEMBER',
		theme: 'Clear the Way',
		months: 'DECEMBER',
		line: 'Letting go, and making room for what’s next.',
		numeral: '',
	},
};

export const BRAND = {
	/** As written on the logo and covers. (Scripts say "The Offerness" – pending Lucie's decision.) */
	wordmark: 'OFFERVISIONS',
	station: 'BIG BANG RADIO',
	slot: 'MONDAYS 11 AM',
	host: 'Lucie',
};

export const SAFE = {top: 250, bottom: 400};
