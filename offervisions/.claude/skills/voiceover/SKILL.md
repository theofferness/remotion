---
name: voiceover
description: Voiceover guidance for Offervisions — Lucia records her own voice; writing for her mouth, pacing 140–175 wpm, the [My story here] slot, recording and file handoff, re-timing scenes and captions to the real take. Use when writing VO, preparing recording notes, or integrating a recorded take.
---

# Voiceover

*(No rules were supplied for this skill, so these are drawn from Lucia's briefs. Replace them with your own wording any time.)*

## Principles
- **Lucia's own recorded voice is the main sound.** Never generate a synthetic voice for her or imitate it.
- Write for speaking: short sentences, natural contractions, words she would actually say. Read every line aloud before delivering.
- Pace **140–175 wpm** (matches `captions`). Main Reel 60–75 s ≈ 150–180 words; 30 s ≈ 70–85 words.
- One **[My story here]** slot in each Main Reel, for one true sentence from her life. Suggest what kind of moment fits, but never write it for her.

## Recording notes (include in each package)
- Quiet room, phone 15–20 cm away, slightly off-axis. Record each sentence as its own take with a 1-second pause between.
- Warm and conversational, a little slower than feels natural. Smile on the hopeful lines.
- Export WAV or high-quality M4A/MP3, mono is fine. Name it `chNN-vN-voice.wav` and drop it in `public/audio/reels/`.

## Integrating the take
1. Set `voiceover` in `src/reels/chNN/chapter.ts`.
2. Measure each sentence (silence detection with ffmpeg, or transcription timestamps) and set every scene's `sec` to match.
3. Replace placeholder captions with a transcript of the take (`captions` skill).
4. Mix: voice peaks around −3 dBFS, with music ducked under it (`sound-design`).
5. Re-render and run `quality-review`.
