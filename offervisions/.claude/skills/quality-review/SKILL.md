---
name: quality-review
description: Pre-delivery checklist for Offervisions Reels — brief compliance, brand, script word counts, text limits, safe zones, visual polish, audio and caption checks, with the commands to verify them. Run before sending any Reel, cover, script or caption to Lucie.
---

# Offervisions quality review

Run every check; fix failures before delivering. Report anything you couldn't check.

## 1 · Brief compliance
- [ ] Every numbered item in Lucie's brief is delivered (hook, VO, visual style, storyboard, colours, cover, caption, audio…).
- [ ] Anything the brief left undefined is stated as an explicit assumption in the reply.
- [ ] Reels made one at a time, in order, when the brief asks for that ("next").

## 2 · Facts & voice (see `brand`)
- [ ] Show facts are exact: Big Bang Radio · Mondays 11 AM · 15 minutes · Lucie is a fellow learner (never an expert).
- [ ] Chapter title, part, season, air date and challenge match the brief word-for-word in meaning.
- [ ] Tone: warm, honest, not preachy, not clickbait; no "must/should/hack/secret".
- [ ] No invented personal story for Lucie – `[My story here]` slot present (Main Reel only, exactly once).

## 3 · Script numbers
```bash
echo "<voiceover text>" | wc -w         # Main Reel 150–180 · trailer ~60–80
echo "<caption without hashtags>" | wc -w   # < 80
```
- [ ] Bold key phrases ≤ 6 words; cover text ≤ 5 words; one small italic line per scene.
- [ ] Main Reel storyboard: 15–25 scenes, three acts (struggle · turn with a twist · small step).
- [ ] Caption ends exactly with `New chapter Monday 11 AM on Big Bang Radio.` then the required hashtags.

## 4 · Visuals – render and look
Render stills at each scene's midpoint plus mid-transition frames, tile them, and inspect:
```bash
ffmpeg -i out/chNN/videoN.mp4 -vf "select='eq(n\,90)+eq(n\,200)+…',scale=300:-1,tile=8x1" -frames:v 1 sheet.png
```
- [ ] 1080×1920, 30 fps; duration as planned (`ffprobe -show_entries format=duration`).
- [ ] Background = season colour; all lines/text = ink colour; no stray colours.
- [ ] Horizon line visible in **every** frame and morphs (never cuts or disappears – watch flat-line scenes).
- [ ] Opens on the book page-turn to the chapter number; closes with the book shutting + show name.
- [ ] Learner present and recognisable (headphones + small open book); one glowing object per scene.
- [ ] The chapter's fresh metaphor is clearly different from the other Reels'.
- [ ] Nothing important in top 250 px / bottom 400 px; nothing cut off at the sides; text never overlaps drawings or tags.
- [ ] Hook fully readable within the first 2 s.
- [ ] Calm pacing: no fast cuts; transitions are dissolves/morphs/zoom-throughs.
- [ ] Cover: open book + chapter number + learner + ≤5-word text, inside the centre 3:4 area.

## 5 · Audio
- [ ] Voiceover (if provided) is the loudest element; SFX are soft (`ffmpeg -af volumedetect`).
- [ ] Only page turn / pencil / chime-style SFX; no baked-in copyrighted music; no song named.

## 6 · Code & handoff
- [ ] `npx tsc --noEmit` and `npx eslint src` pass.
- [ ] Text/timing live in `src/reels/chNN/chapter.ts`; package written to `reels/chNN-<slug>/`.
- [ ] Committed and pushed to the working branch; MP4 + cover PNG + package `.md` sent to Lucie.
