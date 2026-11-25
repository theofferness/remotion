/**
 * ─────────────────────────────────────────────────────────────
 *  INTRODUCTION – Opening Credits and Introduction
 *  Part One: Visualisation (Winter) · airs Mon Jan 11, 2027, 11 AM
 * ─────────────────────────────────────────────────────────────
 *  Edit text and timing here. Each scene's `sec` is how long it lasts;
 *  once you've recorded your voiceover, adjust the durations so each
 *  scene matches its line, and set `voiceover` to your file in /public.
 */

export const CHAPTER = {
	season: 'winter' as const,
	/** Shown big on the page that turns in the opening. */
	number: '0',
	title: 'Introduction',
	subtitle: 'Opening Credits',
	/** Banner along the top of every scene. */
	banner: 'OFFERVISIONS · INTRODUCTION',
	airs: 'Monday, January 11 · 11 AM',
};

export type ReelScene = {
	id: string;
	sec: number;
	/** Voiceover line (for the script / your recording). */
	vo: string;
	/** Small italic on-screen line. */
	small: string;
	/** Bold ALL-CAPS key phrase (max 6 words), optional. */
	big?: string;
};

/* ─────────── VIDEO 1 · Episode-day trailer ("The table of contents") ─────────── */
/*  VO pacing target: 140–175 wpm per scene (captions skill). Mark the one
    emphasis word of a caption block with *asterisks*.                         */

export const VIDEO1 = {
	/** Optional: your recorded voiceover in /public, e.g. 'audio/reels/ch00-v1-voice.wav'. */
	voiceover: null as string | null,
	/** Separate take for the 15-second cut (its lines differ slightly). */
	voiceover15: null as string | null,
	voiceoverVolume: 1,
	sfxVolume: 0.7,
	/** 30-second master. */
	scenes: [
		{
			id: 'hook',
			sec: 3.2,
			vo: 'A new year doesn’t need a new *you*.',
			small: 'A new year doesn’t need a new you.',
			big: 'It needs a first page.',
		},
		{
			id: 'open',
			sec: 4.2,
			vo: 'It needs a first *page*. This year, Offervisions is a book.',
			small: 'This year, the show is a book.',
			big: 'Page one.',
		},
		{
			id: 'map',
			sec: 6.6,
			vo: 'Four seasonal parts. Visualisation. Realisation. Connection. Integration. And a December *epilogue* to close the year.',
			small: 'A year in four seasons.',
			big: 'Four parts. One epilogue.',
		},
		{
			id: 'shelf',
			sec: 3.0,
			vo: 'A new chapter every two *weeks*.',
			small: 'A new chapter every two weeks.',
			big: 'Every other Monday.',
		},
		{
			id: 'inside',
			sec: 4.4,
			vo: 'Each one: a struggle, a positive, one small *challenge*. Invitations, not homework.',
			small: 'One struggle. One positive. One small challenge.',
			big: 'Invitations, not homework.',
		},
		{
			id: 'host',
			sec: 4.0,
			vo: 'I’m Lucie. I’m not an expert, I’m *learning* too.',
			small: 'Hosted by Lucie, a fellow learner.',
			big: 'Mondays · 11 AM',
		},
		{
			id: 'close',
			sec: 4.6,
			vo: 'The book opens *Monday* at eleven, on Big Bang Radio.',
			small: 'The book opens Monday, 11 AM.',
		},
	] satisfies ReelScene[],
	/** 15-second cut: hook → signature → one insight → CTA. */
	cut15: [
		{
			id: 'hook',
			sec: 3.2,
			vo: 'A new year doesn’t need a new *you*.',
			small: 'A new year doesn’t need a new you.',
			big: 'It needs a first page.',
		},
		{
			id: 'open',
			sec: 4.0,
			vo: 'It needs a first *page*. Offervisions is a book.',
			small: 'This year, the show is a book.',
			big: 'Page one.',
		},
		{
			id: 'inside',
			sec: 4.2,
			vo: 'Every chapter: one small *challenge*. Invitations, not homework.',
			small: 'One struggle. One positive. One small challenge.',
			big: 'Invitations, not homework.',
		},
		{
			id: 'close',
			sec: 3.6,
			vo: 'Listen *Monday* at eleven, on Big Bang Radio.',
			small: 'The book opens Monday, 11 AM.',
		},
	] satisfies ReelScene[],
	/** Words on the four seasonal stops + epilogue in the "map" scene. */
	parts: [
		{overline: 'PART ONE · WINTER', name: 'Visualisation'},
		{overline: 'PART TWO · SPRING', name: 'Realisation'},
		{overline: 'PART THREE · SUMMER', name: 'Connection'},
		{overline: 'PART FOUR · AUTUMN', name: 'Integration'},
		{overline: 'DECEMBER', name: 'Epilogue'},
	],
	/** Labels on the three tags in the "inside" scene. */
	insideTags: ['one struggle', 'one positive', 'one small challenge'],
	cover: {
		/** Max 5 words. */
		text: 'The book opens Monday',
	},
};
