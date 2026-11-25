# Offervisions · Introduction · Video 2: Main Reel

**Title:** "The question becomes a lantern"
**Post:** Thursday, January 14, 2027 (after the Mon Jan 11 episode).
**Masters:** 1080×1920 · H.264 · 30 fps · winter `#2E3A6B` + white ink

| File | Length | Use |
|---|---|---|
| `out/ch00/ch00-v2-main-74s.mp4` | 74.2 s | Instagram main Reel (the brief) |
| `out/ch00/ch00-v2-main-30s.mp4` | 30.0 s | five-beat cut: Reels, Shorts, TikTok |
| `out/ch00/ch00-v2-main-15s.mp4` | 15.0 s | hook → insight → CTA teaser |
| `out/ch00/ch00-v2-cover.png` | still | cover |

Source: `src/reels/ch00/chapter.ts` › `VIDEO2` (all copy and timing) · scenes in `v2scenes.tsx` · compositions `Ch00-Video2-Main`, `-30s`, `-15s`, `-Cover` · `Master` points here.

**Genuine tension:** resolutions slipping by mid-January, and feeling smaller under your own list.
**Truthful benefit:** one honest question gives the year a direction, and the show gives one small, optional challenge every two weeks.

---

## 1 · Hook (first 2 s)
> *Resolutions slipping by mid-January?*
> **MAYBE IT'S THE QUESTION.**

The text appears in the first second, over the signature: the book opening and its page turning to **0 · Introduction**.

## 2 · Voiceover script (your voice, 151 words + your story ≈ 165, ~74 s)
Each sentence is one scene. **Bold** marks the stressed word, which is also the bold caption word.

> It's mid-January, and my resolutions are already **slipping**.
> Read more. Move more. Be **more**.
> The list grows. And somehow, you feel **smaller**.
> But that's not **failure**.
> Maybe it's just the wrong first **question**.
> **[My story here]**
> Most of us ask: what **should** I do this year?
> That turns a year into **homework**.
> So I'm trying a different **question**.
> What do I want this year to **offer** me?
> Not a list. A **direction**.
> One good question can light more than ten **rules**.
> This is the first page of a year-long **book**.
> A chapter every two weeks. One struggle, one positive, one small **challenge**.
> Invitations, not **homework**.
> Your first challenge: ask yourself what you want this year to **offer** you.
> Write the answer in one **sentence**.
> Keep it somewhere you'll see it. The mirror. The **kettle**.
> Let it look back at you every **morning**.
> Listen Mondays at eleven, on Big Bang Radio. Come **learn** with me.

**[My story here]:** one true sentence, about 12–18 words. For example, a January when a list got the better of you, or the moment you noticed you were asking the wrong question. The scene allows 6 s. If your sentence runs longer, raise `story.sec` in `chapter.ts`.

**30 s cut VO (64 words):** It's mid-January, and my resolutions are already slipping. / But that's not failure. / Maybe it's just the wrong first question. / What do I want this year to offer me? / Not a list. A direction. / Your first challenge: ask yourself what you want this year to offer you. / Write the answer in one sentence. / Listen Mondays at eleven, on Big Bang Radio. Come learn with me.

**15 s cut VO (30 words):** It's mid-January, and my resolutions are already slipping. / Try asking: what do I want this year to offer me? / Answer in one sentence. / Mondays at eleven, on Big Bang Radio.

Recording: one sentence per take, with a 1-second pause between. Save as `public/audio/reels/ch00-v2-voice.wav` (plus `-30s` and `-15s` takes if you record the cuts), then set `voiceover`, `voiceover30` and `voiceover15` in `chapter.ts`. Re-time each scene's `sec` to your take and replace the auto-timed captions with a transcript.

## 3 · Visual idea
- **Fresh metaphor:** **the question becomes a lantern.** A hand-drawn "?" slowly bends into a lantern post, and its dot rises to become the lantern, which lights up. A good question gives light, not rules. Video 1's metaphor (the year as a table of contents) isn't repeated.
- **The horizon line** becomes: page edge → winter ground → **anxious heartbeat** → ground → desk → page edge → desk → **arched mirror/window** → table edge.
- **Builds over time:** the resolution list grows into a sticky-note tower, then a homework stack, then a **Day 1 → Day 14** row of blocks under the mirror.
- **Zoom-throughs:** into the book page (opening), into the "?" dot (to your story), into the lantern's glass (to the book).
- **Signature:** opens on the book turning to **0**, closes with the book shutting softly and the OFFERVISIONS end card.

## 4 · Storyboard (20 scenes, three acts)
Scenes cross-dissolve in 10 frames and the line morphs across cuts. Text sits between y 250 and 1520, captions at y ≈ 1430–1510.

| # | Time | Beat | Voiceover | Drawn & moving | On-screen text |
|---|------|------|-----------|----------------|----------------|
| **ACT 1** | | **THE STRUGGLE** | | | |
| 1 | 0.0–4.2 | Tension | "It's mid-January, and my resolutions are already slipping." | The closed book opens; the page turns to PART ONE · WINTER / glowing **0** / *Introduction*; the camera zooms slowly into the page. The line is the page edge. | *Resolutions slipping by mid-January?* / **MAYBE IT'S THE QUESTION.** |
| 2 | 4.2–7.2 | Tension | "Read more. Move more. Be more." | Inside the page: a paper list unrolls (glowing) and handwritten items tick in (*read more, move more, be more, wake up at 5…*). The learner looks up at it. | *New year, new list.* |
| 3 | 7.2–10.6 | Pattern break | "The list grows. And somehow, you feel smaller." | 24 sticky notes settle into a tower. The learner shrinks beside it. The ground line turns into an **anxious heartbeat** that speeds up. | *The list grows.* / **AND YOU FEEL SMALLER.** |
| 4 | 10.6–13.2 | Pattern break | "But that's not failure." | The notes lift off and drift away, turning into **soft falling snow**. The heartbeat calms to flat and the learner returns to size. | *Here's the thing.* / **THAT'S NOT FAILURE.** |
| 5 | 13.2–16.2 | Pattern break | "Maybe it's just the wrong first question." | In the snow, a big hand-drawn **"?"** draws itself and its dot lands. The camera zooms into the dot. | *Maybe it's just* / **THE WRONG FIRST QUESTION.** |
| 6 | 16.2–22.2 | Pattern break | **[My story here]** | Inside the dot, a memory: the learner at a desk by a candle and notebook, with a thought cloud that slowly fills with scribbles. | *A moment from my own January.* |
| **ACT 2** | | **THE TURN** | | | |
| 7 | 22.2–26.0 | Insight | "Most of us ask: what should I do this year?" | Back at the "?". A clipboard appears with three *should…* rows ticking one by one. | *Most of us ask:* / **WHAT SHOULD I DO?** |
| 8 | 26.0–28.8 | Insight | "That turns a year into homework." | The clipboard becomes a growing stack of sheets with a **DUE: 2027** stamp. The learner slumps and the "?" dims. | *That turns a year* / **INTO HOMEWORK.** |
| 9 | 28.8–31.6 | Insight | "So I'm trying a different question." | The stack fades, and the learner walks up to the "?", which glows. | *So I'm trying* / **A DIFFERENT QUESTION.** |
| 10 | 31.6–36.2 | Insight · **twist** | "What do I want this year to offer me?" | **The "?" slowly bends into a lantern post. Its dot rises in an arc to the hook and becomes a lantern, which lights up** (chime). The learner looks up. | *What do I want this year* / **TO OFFER ME?** |
| 11 | 36.2–38.8 | Insight | "Not a list. A direction." | Pools of light open along the ground ahead, and small arrows point onward. | *Not a list.* / **A DIRECTION.** |
| 12 | 38.8–42.6 | Insight | "One good question can light more than ten rules." | Ten faint rule notes drift away unlit while the lantern glows. The camera zooms into the lantern's glass. | *One good question lights more* / **THAN TEN RULES.** |
| 13 | 42.6–46.4 | Insight | "This is the first page of a year-long book." | The open book: left page shows the lantern and the handwritten question, right page shows **0 · Introduction**. The line is the page edge. | *This is the first page* / **OF A YEAR-LONG BOOK.** |
| 14 | 46.4–51.4 | Insight | "A chapter every two weeks. One struggle, one positive, one small challenge." | Two gentle page turns: the snowflake *Visualisation* page, then a page where three items arrive with soft pops: a stone *one struggle*, a flame *one positive*, a pencil *one small challenge*. | *A chapter every two weeks.* / **ONE STRUGGLE. ONE POSITIVE. ONE CHALLENGE.** |
| 15 | 51.4–53.6 | Practical shift | "Invitations, not homework." | An envelope opens, and a glowing card slides up: *you're invited*. | *Every challenge is optional.* / **INVITATIONS, NOT HOMEWORK.** |
| **ACT 3** | | **THE SMALL STEP** | | | |
| 16 | 53.6–58.6 | Practical shift | "Your first challenge: ask yourself what you want this year to offer you." | At the desk, the lamp switches on and the tea steams. On a glowing card, the question writes itself by hand: *What do I want this year / to offer me?* (pencil). | *Your first small challenge:* / **ONE QUESTION.** |
| 17 | 58.6–61.4 | Practical shift | "Write the answer in one sentence." | A pencil draws one line under the question, ending in a glowing full stop. | *Write the answer* / **IN ONE SENTENCE.** |
| 18 | 61.4–65.6 | Practical shift | "Keep it somewhere you'll see it. The mirror. The kettle." | The line rises into an **arched mirror**. The card flies over and sticks to it; the learner's reflection appears. Tags *the mirror* and *the kettle* arrive. | *Keep it somewhere* / **YOU'LL SEE IT.** |
| 19 | 65.6–69.2 | CTA (lead-in) | "Let it look back at you every morning." | Blocks stack under the mirror from **Day 1 → Day 14**, and the card glows a little brighter each day. | *Let it look back at you* / **EVERY MORNING.** |
| 20 | 69.2–74.2 | CTA | "Listen Mondays at eleven, on Big Bang Radio. Come learn with me." | The line returns to the table edge. The book **shuts softly** (book-close), the glow rises (chime), and the end card builds: logo → **OFFERVISIONS** → *Listen Mondays, 11 AM.* → MONDAYS · 11 AM · BIG BANG RADIO → *Come learn with me.* It holds to the last frame. | (end card) |

**30 s cut:** scenes 1 → 4 → 5 → 10 → 11 → 16 → 17 → 20. **15 s cut:** scenes 1 → 10 → 17 → 20.

## 5 · Cover
`ch00-v2-cover.png`: the open book with the lit **lantern** on the left page and **0 · Introduction** on the right, plus the learner.
**Cover text (5 words): WHAT WILL 2027 OFFER YOU?** with *One question for the year:* above it. Everything sits inside the centre 3:4 area.

## 6 · Platform copy

**Instagram caption** (59 words, excluding hashtags and emoji):
> Resolutions slipping by mid-January? Maybe it's not failure. Maybe it's the question. 🏮 This year I'm swapping "What should I do?" for "What do I want this year to offer me?" Your first small challenge: answer it in one sentence and keep it somewhere you'll see it. An invitation, not homework.
> New chapter Monday 11 AM on Big Bang Radio.
>
> #Offervisions #NewBeginnings #SelfGrowth #MindsetShift #Intentions

**YouTube Shorts (30 s cut).** Title: *Maybe it's not failure. Maybe it's the question.* · Description: *One question for 2027: what do I want this year to offer me? Listen Mondays 11 AM on Big Bang Radio.* · #Shorts #Offervisions #Intentions

**TikTok (30 s or 15 s cut):** *Swap "what should I do this year?" for "what do I want this year to offer me?" 🏮 One sentence. Somewhere you'll see it.* #Offervisions #NewBeginnings #SelfGrowth #Intentions

## 7 · Audio
- **Main sound:** your recorded voice. Burned-in captions are timed from the script for now and need to be re-timed to your take.
- **Sound effects** (original, soft): air swells on the zoom-throughs, page turns (opening and chapter pages), pencil on the list, "?", ticks, question and sentence, and a few very quiet pops (chapter items, mirror and kettle tags, Day 14).
- **Impacts:** 3 in the 74 s master (lantern chime, book-close, end chime) and 2 in each cut.
- **Music:** none baked in. If you want some, add a quiet instrumental from Instagram's library, about 6–10 dB under your voice.

## Notes for Lucie
- The brief asks for the caption to end with *"New chapter Monday 11 AM on Big Bang Radio."* I kept that exactly. But if chapters arrive every two weeks, the Monday after this Thursday post (Jan 18) may not be a new chapter. That's why the **voiceover and end card say "Listen Mondays at eleven"** instead. If Jan 18 *is* a new chapter, both can say it.
- The season-to-part order (Winter = Visualisation and so on) follows the order in your brief.
