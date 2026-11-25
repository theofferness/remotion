---
name: sound-design
description: Sound design for Offervisions — subtle texture under narration, music ducked 6–10 dB under voice, two or fewer impact sounds per 30 s, every edit matched to rhythm, no generic motivational audio. Use when adding or reviewing music, SFX or the mix.
---

# Sound Design

Use subtle texture beneath narration.
Duck music **6–10 dB** under voice.
Use **two or fewer impact sounds per 30-second video.**
Match every major edit to rhythm, not random effects.
Avoid generic motivational audio.

## Offervisions specifics
- **Library** (`public/audio/reels/`, original, regenerate with `npm run audio:reels`):
  - texture: `air` (soft swell), `pencil` (scratch), `page-turn`
  - impacts: `book-close`, `chime`
  - accents: `pop` (very quiet, use sparingly)
- **Budget per 30 s:** at most 2 impacts (typically the book-close and one chime at the key insight). Texture sounds sit under scene changes. Keep `pop` to 3 or fewer per 30 s at low volume, and only when a tag lands on a beat.
- Place each SFX on the edit or on the spoken keyword it supports, never on a random frame.
- **Music:** none baked in by default. Lucie adds a quiet instrumental from Instagram's own library. If music is ever baked in, it must be original or licensed, and ducked 6–10 dB under the voice (`volume` callback: about 0.32–0.5× while she speaks).
  Never name or use copyrighted songs.
- **Levels:** voice peaks about −3 dBFS, SFX roughly 10–14 dB below the voice, no clipping (`ffmpeg -af volumedetect`, max_volume < −1 dB).
