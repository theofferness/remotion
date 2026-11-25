---
name: quality-review
description: Pre-delivery quality checklist for Offervisions videos — immediate hook, no clipping or UI collision, subtitle margins, caption accuracy, audio, continuity, dimensions, CTA visibility, focus on the message, playback — plus brand, brief and ethics checks with commands. Run before sending anything to Lucie.
---

# Quality Review

Check:
- Hook is understandable immediately
- No text clipping or UI collision
- Consistent subtitle margins
- Caption accuracy
- Audio not clipped
- Transitions preserve continuity
- 1080×1920 dimensions
- CTA remains visible
- No visual element competes with the speaker or message
- Final output opens and plays correctly

## How to check (commands)
```bash
npx remotion compositions src/index.ts                      # dims / fps / duration
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration -of compact out/video.mp4
ffmpeg -i out/video.mp4 -af volumedetect -vn -f null - 2>&1 | grep max_volume   # must be < -1 dB
ffmpeg -i out/video.mp4 -vf "select='eq(n\,30)+eq(n\,120)+…',scale=300:-1,tile=8x1" -frames:v 1 sheet.png
ffmpeg -v error -i out/video.mp4 -f null -                   # decodes end to end = plays
echo "<text>" | wc -w                                         # VO / caption word counts
```
Look at the sheet. Include frames from the first second, every scene midpoint, mid-transition frames, and the last second.

## Offervisions additions
- **Brief:** every numbered item delivered. Undefined items stated as assumptions. Brief/skill conflicts named (see `brand` › Precedence).
- **Facts:** Big Bang Radio · Mondays 11 AM · Lucie a fellow learner. Chapter, part, date and challenge match the brief.
- **Script:** five beats on time (`scriptwriter`). Pace 140–175 wpm. Exactly one `[My story here]` in Main Reels. Key phrases ≤ 6 words. Cover ≤ 5 words.
- **Visual:** season background + single ink colour. Horizon line present in every frame. Book signature at open and close. Learner present. One focal object per scene. Fresh metaphor not used in earlier Reels.
- **Safe zones:** nothing important at y < 250 or y > 1520. Captions in their fixed band.
- **Motion:** transitions 8–12 frames. No bounce, spin or excessive zoom (`motion-director`).
- **Sound:** ≤ 2 impacts per 30 s. Music (if any) ducked 6–10 dB. No copyrighted songs.
- **Ethics:** no invented stats, testimonials, urgency or authority (`marketing-psychology`).
- **Caption copy:** < 80 words, ends `New chapter Monday 11 AM on Big Bang Radio.` + hashtags.
- **Code:** `npx tsc --noEmit` and `npx eslint src` pass. Copy and durations live in `chapter.ts`.
- **Handoff:** committed and pushed. MP4(s), cover PNG and package `.md` sent.

Report any check that fails or couldn't be run. Don't mark it passed.
