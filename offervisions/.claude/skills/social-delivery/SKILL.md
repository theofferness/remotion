---
name: social-delivery
description: Delivering Offervisions videos to social platforms — 9:16 H.264 masters for Reels, Shorts and TikTok, 15/30/60-second cuts, platform-ready titles, captions, hashtags and covers. Use when exporting final files or writing post copy.
---

# Social Delivery

Create 9:16 masters for Reels, Shorts, and TikTok.
Use **H.264, 1080×1920, 30 or 60 FPS.**
Generate platform-ready **title, caption, and hashtags.**
Produce a **15-second cut, 30-second cut, and 60-second cut** where appropriate.

## Export
```bash
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell   # cloud container only
npx remotion render src/index.ts Master out/chNN/chNN-vN-master.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --browser-executable=$B
npx remotion still  src/index.ts ChNN-VideoN-Cover out/chNN/chNN-vN-cover.png --browser-executable=$B
```
- Cuts are separate compositions built from the same `chapter.ts` scene list (`ChNN-VideoN-15s`, `-30s`, `-60s`), not trims of the master:
  - **60 s:** the full Main Reel (or the brief's length).
  - **30 s:** the five-beat version (`scriptwriter`).
  - **15 s:** hook → one insight line → CTA, with the book signature kept short.
  - "Where appropriate": a 30 s trailer gets 15 s + 30 s. Don't pad a short video to 60 s.
- File names: `chNN-vN-<role>-<15s|30s|60s>.mp4`.

## Platform copy (write all three in the package)
| | Instagram Reels | YouTube Shorts | TikTok |
|---|---|---|---|
| Title | (none; first caption line is the hook) | ≤ 60 chars, hook-led | (none) |
| Caption | < 80 words, ends `New chapter Monday 11 AM on Big Bang Radio.` | 1–2 lines + "Listen Mondays 11 AM on Big Bang Radio" | ≤ 150 chars |
| Hashtags | the brief's set (5) | 3 (incl. `#Shorts`, `#Offervisions`) | 3–5 from the brief's set |
| Cover | `chNN-vN-cover.png` (≤ 5 words, centre 3:4 safe) | first frame / custom thumbnail | cover frame chosen in-app |

- Safe zones: Reels 250 px top / 400 px bottom. These also clear Shorts' and TikTok's UI. Keep ≥ 120 px on the right for the button column.
- Music is added in-app from each platform's own library. Never bake in copyrighted music.
