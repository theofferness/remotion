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

/* ─────────── VIDEO 2 · Main Reel (Thu Jan 14) – "The question becomes a lantern" ─────────── */
/*  Five beats scaled to ~74 s (scriptwriter): tension 0–7 · pattern break 7–22 ·
    insight 22–51 · practical shift 51–66 · CTA 66–74.
    Acts: struggle = hook…story · turn = should…invitation · small step = challenge…cta.
    `vo` lines are what Lucie records; *word* = caption emphasis.                     */

export const MY_STORY = '[My story here]';

export const VIDEO2 = {
	voiceover: null as string | null,
	voiceover30: null as string | null,
	voiceover15: null as string | null,
	voiceoverVolume: 1,
	sfxVolume: 0.7,
	scenes: [
		/* ACT 1 · THE STRUGGLE */
		{id: 'hook', sec: 4.2, vo: 'It’s mid-January, and my resolutions are already *slipping*.', small: 'Resolutions slipping by mid-January?', big: 'Maybe it’s the question.'},
		{id: 'list', sec: 3.0, vo: 'Read more. Move more. Be *more*.', small: 'New year, new list.'},
		{id: 'pile', sec: 3.4, vo: 'The list grows. And somehow, you feel *smaller*.', small: 'The list grows.', big: 'And you feel smaller.'},
		{id: 'notfailure', sec: 2.6, vo: 'But that’s not *failure*.', small: 'Here’s the thing.', big: 'That’s not failure.'},
		{id: 'wrongq', sec: 3.0, vo: 'Maybe it’s just the wrong first *question*.', small: 'Maybe it’s just', big: 'The wrong first question.'},
		{id: 'story', sec: 6.0, vo: MY_STORY, small: 'A moment from my own January.'},
		/* ACT 2 · THE TURN */
		{id: 'should', sec: 3.8, vo: 'Most of us ask: what *should* I do this year?', small: 'Most of us ask:', big: 'What should I do?'},
		{id: 'homework', sec: 2.8, vo: 'That turns a year into *homework*.', small: 'That turns a year', big: 'Into homework.'},
		{id: 'different', sec: 2.8, vo: 'So I’m trying a different *question*.', small: 'So I’m trying', big: 'A different question.'},
		{id: 'twist', sec: 4.6, vo: 'What do I want this year to *offer* me?', small: 'What do I want this year', big: 'To offer me?'},
		{id: 'direction', sec: 2.6, vo: 'Not a list. A *direction*.', small: 'Not a list.', big: 'A direction.'},
		{id: 'rules', sec: 3.8, vo: 'One good question can light more than ten *rules*.', small: 'One good question lights more', big: 'Than ten rules.'},
		{id: 'firstpage', sec: 3.8, vo: 'This is the first page of a year-long *book*.', small: 'This is the first page', big: 'Of a year-long book.'},
		{id: 'chapters', sec: 5.0, vo: 'A chapter every two weeks. One struggle, one positive, one small *challenge*.', small: 'A chapter every two weeks.', big: 'One struggle. One positive. One challenge.'},
		{id: 'invitation', sec: 2.2, vo: 'Invitations, not *homework*.', small: 'Every challenge is optional.', big: 'Invitations, not homework.'},
		/* ACT 3 · THE SMALL STEP */
		{id: 'challenge', sec: 5.0, vo: 'Your first challenge: ask yourself what you want this year to *offer* you.', small: 'Your first small challenge:', big: 'One question.'},
		{id: 'sentence', sec: 2.8, vo: 'Write the answer in one *sentence*.', small: 'Write the answer', big: 'In one sentence.'},
		{id: 'seeit', sec: 4.2, vo: 'Keep it somewhere you’ll see it. The mirror. The *kettle*.', small: 'Keep it somewhere', big: 'You’ll see it.'},
		{id: 'days', sec: 3.6, vo: 'Let it look back at you every *morning*.', small: 'Let it look back at you', big: 'Every morning.'},
		{id: 'cta', sec: 5.0, vo: 'Listen Mondays at eleven, on Big Bang Radio. Come *learn* with me.', small: 'Listen Mondays, 11 AM.'},
	] satisfies ReelScene[],
	/** 30-second cut (five beats: tension · break · insight · shift · CTA). */
	cut30: [
		{id: 'hook', sec: 4.2, vo: 'It’s mid-January, and my resolutions are already *slipping*.', small: 'Resolutions slipping by mid-January?', big: 'Maybe it’s the question.'},
		{id: 'notfailure', sec: 2.6, vo: 'But that’s not *failure*.', small: 'Here’s the thing.', big: 'That’s not failure.'},
		{id: 'wrongq', sec: 3.0, vo: 'Maybe it’s just the wrong first *question*.', small: 'Maybe it’s just', big: 'The wrong first question.'},
		{id: 'twist', sec: 4.6, vo: 'What do I want this year to *offer* me?', small: 'What do I want this year', big: 'To offer me?'},
		{id: 'direction', sec: 2.6, vo: 'Not a list. A *direction*.', small: 'Not a list.', big: 'A direction.'},
		{id: 'challenge', sec: 5.0, vo: 'Your first challenge: ask yourself what you want this year to *offer* you.', small: 'Your first small challenge:', big: 'One question.'},
		{id: 'sentence', sec: 2.8, vo: 'Write the answer in one *sentence*.', small: 'Write the answer', big: 'In one sentence.'},
		{id: 'cta', sec: 5.2, vo: 'Listen Mondays at eleven, on Big Bang Radio. Come *learn* with me.', small: 'Listen Mondays, 11 AM.'},
	] satisfies ReelScene[],
	/** 15-second cut: hook → the one insight → CTA. */
	cut15: [
		{id: 'hook', sec: 4.2, vo: 'It’s mid-January, and my resolutions are already *slipping*.', small: 'Resolutions slipping by mid-January?', big: 'Maybe it’s the question.'},
		{id: 'twist', sec: 4.6, vo: 'Try asking: what do I want this year to *offer* me?', small: 'What do I want this year', big: 'To offer me?'},
		{id: 'sentence', sec: 2.6, vo: 'Answer in one *sentence*.', small: 'Write the answer', big: 'In one sentence.'},
		{id: 'cta', sec: 3.6, vo: 'Mondays at eleven, on Big Bang *Radio*.', small: 'Listen Mondays, 11 AM.'},
	] satisfies ReelScene[],
	listItems: ['read more', 'move more', 'be more', 'wake up at 5', 'drink water', 'learn French', 'journal daily', 'be calmer'],
	question: ['What do I want this year', 'to offer me?'],
	chapterTags: ['one struggle', 'one positive', 'one small challenge'],
	cover: {text: 'What will 2027 offer you?'},
};

/* ─────────── VIDEO 3 · Follow-up (Sun Jan 17) – "Write it on the window" ─────────── */
/*  30 s, five beats: tension 0–3.8 · pattern break 3.8–7.8 · insight 7.8–17.4 ·
    practical shift 17.4–25.4 · CTA 25.4–30.                                        */

export const VIDEO3 = {
	voiceover: null as string | null,
	voiceover15: null as string | null,
	voiceoverVolume: 1,
	sfxVolume: 0.7,
	scenes: [
		{id: 'hook', sec: 3.8, vo: 'Still haven’t written your sentence? That’s *okay*.', small: 'Still haven’t written your sentence?', big: 'No homework, remember.'},
		{id: 'breathe', sec: 4.0, vo: 'Here’s a smaller step. Breathe on a cold *window*.', small: 'Here’s a smaller step:', big: 'Breathe on a cold window.'},
		{id: 'write', sec: 5.0, vo: 'Write the start with your finger: I want this year to *offer* me…', small: 'With one finger, write:'},
		{id: 'clear', sec: 4.6, vo: 'Finish the sentence, and watch what starts to *clear*.', small: 'Finish the sentence,', big: 'Watch what clears.'},
		{id: 'copy', sec: 4.4, vo: 'Copy it onto paper. Keep it where you’ll *see* it.', small: 'Copy it onto paper.', big: 'Keep it in sight.'},
		{id: 'bridge', sec: 3.6, vo: 'One sentence. A small *bridge* into the year.', small: 'One sentence.', big: 'A small bridge.'},
		{id: 'cta', sec: 4.6, vo: 'Listen Mondays at eleven, on Big Bang Radio. Come *learn* with me.', small: 'Listen Mondays, 11 AM.'},
	] satisfies ReelScene[],
	cut15: [
		{id: 'hook', sec: 3.8, vo: 'Still haven’t written your sentence? That’s *okay*.', small: 'Still haven’t written your sentence?', big: 'No homework, remember.'},
		{id: 'write', sec: 5.0, vo: 'Breathe on a window and write: I want this year to *offer* me…', small: 'Breathe on a window, then write:'},
		{id: 'clear', sec: 2.0, vo: 'Watch what *clears*.', small: 'Finish the sentence,', big: 'Watch what clears.'},
		{id: 'cta', sec: 4.2, vo: 'Mondays at eleven, on Big Bang *Radio*.', small: 'Listen Mondays, 11 AM.'},
	] satisfies ReelScene[],
	/** Written in the fog, then copied onto the note. */
	glass: ['I want this year', 'to offer me…'],
	cover: {text: 'Write it on the window'},
};
