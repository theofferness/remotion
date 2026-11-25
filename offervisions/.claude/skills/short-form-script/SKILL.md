---
name: short-form-script
description: How to write Offervisions Reel scripts — the three-Reel chapter set, hooks, voiceover length and style, the [My story here] slot, three-act storyboards, on-screen text limits, captions and audio notes. Use when writing any hook, voiceover, storyboard or caption for an Offervisions Reel.
---

# Writing Offervisions short-form scripts

Load the `brand` skill first – voice and facts come from there.

## The chapter set (3 Reels per chapter)
| Reel | When | Job | Length |
|------|------|-----|--------|
| **Video 1 – Trailer** | Episode day (Mon, before 11 AM) or the evening before | Announce the chapter; tease the idea; "listen Monday 11 AM" | 20–35 s |
| **Video 2 – Main Reel** | The Thursday after the episode | The key idea as a small animated film, ending with the challenge + invitation to listen | 60–75 s VO |
| **Video 3 – Follow-up** | A few days after Video 2 | Revisit the challenge (reminder, reflection prompt or community moment) | 15–35 s |

If a brief doesn't define a Reel's job, use this table and **state the assumption** to Lucie.

## Hook (first 2 seconds)
Two lines, both on screen within ~1 s:
- small *italic* setup line – a relatable, honest observation or question
- **BOLD ALL-CAPS** line that lands the point (≤ 6 words)

e.g. *Your resolution is already slipping?* / **THAT'S NOT FAILURE.** Honest, not clickbait.
No fake urgency, no "you won't believe", no shaming.

## Voiceover
- **Main Reel:** 150–180 words (60–75 s at a calm pace, ~150 wpm). Trailer: ~60–80 words. Follow-up: ~40–80 words.
- Simple spoken English. **Short sentences – each sentence becomes one scene.**
- Warm and encouraging, like talking to a friend; never preachy.
- Exactly one slot marked **[My story here]** in the Main Reel, for one real sentence from Lucie's life. Never invent her story.
- End the Main Reel with the **challenge**, then an **invitation to listen**.
- Count words with: `echo "<script>" | wc -w`.

## Storyboard (Main Reel: 15–25 scenes, three acts)
1. **The struggle** – show the problem as a small visual world.
2. **The turn** – the key idea, with **one surprising visual twist** (the chapter's fresh metaphor).
3. **The small step** – the challenge, made tiny and doable.

For every scene, give:
| # | Time | Voiceover line | What's drawn and how it moves | On-screen text |
- **Drawn/moves:** what the horizon line becomes, which object glows, the camera move (slow zoom into an object to reveal the next scene, pan along the line), what builds up over time (e.g. Day 1 → Day 14 blocks), which tags pop on, how one drawing morphs into the next.
- **On-screen text:** one small *italic* line plus **at most one** bold ALL-CAPS key phrase of **≤ 6 words**. Not every scene needs the bold line.
- Keep text inside y = 250–1520 px.

## Cover
The open book showing the chapter number, the learner, and cover text of **max 5 words**.

## Caption
Under 80 words; ends with `New chapter Monday 11 AM on Big Bang Radio.` then the hashtags. Count with `wc -w` (hashtags excluded).

## Audio notes (include in every package)
Lucie's voice is main; list the soft SFX used (page turn, pencil scratch, gentle chime…); optional quiet instrumental from Instagram's library – never name copyrighted songs.

## Deliverable file
Write the package to `reels/chNN-<slug>/video-N-<role>.md` with sections:
1 Hook · 2 Voiceover · 3 Visual idea (line transformations + fresh metaphor + signature) · 4 Storyboard table · 5 Cover · 6 Caption · 7 Audio.
