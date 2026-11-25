---
name: remotion-renderer
description: How Offervisions videos are built and rendered in Remotion — shot-as-composition structure, the reusable component kit (typography, progress, captions, background, logo, CTA), centralized duration and copy, pre-render validation, and the Master render command. Use whenever creating, changing or rendering a video in code.
---

# Remotion

Treat every shot as a React composition.
Create reusable components for:
- Typography
- Progress
- Captions
- Background
- Logo
- CTA

Centralize duration and copy.
Validate dimensions, FPS, and overflow before rendering.
Use `npx remotion render src/index.ts Master out/video.mp4`

## Project map (`offervisions/`, Remotion 4.0.547)
| Required component | Lives in `src/reels/kit/` | Status |
|---|---|---|
| Typography | `OnScreenText.tsx`, `TitleBanner.tsx`, `fonts.ts` | ✅ |
| Background | `Atmosphere.tsx` (`Backdrop`, `Particles`), `HandSvg.tsx`, `HorizonLine.tsx` | ✅ |
| Progress | `Progress.tsx` | ✅ thin ink line at y = 250 |
| Captions | `Captions.tsx` | ✅ `buildCaptions()` from scene VO; skips `[placeholders]`, hides blocks already on screen |
| Logo | `Logo.tsx` | ✅ real logo (`public/brand/offervisions-logo.png`) masked in season ink |
| CTA | `Cta.tsx` | ✅ logo → show name → line → MONDAYS · 11 AM · BIG BANG RADIO → detail |
Also: `scene.tsx` (PAD = 5, `useScene`, `SceneText`), `Objects.tsx` (Lantern, StickyNote, Clipboard, Stone, PencilIcon, Kettle, Envelope), `Book.tsx`/`Pages.tsx` (signature), `Learner.tsx`, `Cozy.tsx`, `Tag.tsx`, `Sfx.tsx`, `palette.tsx`, `anim.ts`, `series.ts` (show facts, seasons, `SAFE`).

## Shots as compositions
- One folder per chapter, `src/reels/chNN/`: `chapter.ts` (**all copy and durations**), `VideoN.tsx` (timeline + horizon keys + SFX), `vNscenes.tsx` (one component per shot), `CoverN.tsx`.
- Each substantial shot should also be registerable alone (`<Composition id="ChNN-V2-Shot03" …>`) so it can be previewed in isolation.
- Durations are computed from `chapter.ts` (`sec × fps`). Never hard-code a total.
- **`Master`** in `src/Root.tsx` points at the video currently in production (change the `MASTER` constant there). That makes the standard command render the right thing:
  `npx remotion render src/index.ts Master out/video.mp4`

## Validate before rendering
1. `npx tsc --noEmit && npx eslint src` and `npx -y tsx scripts/qa-captions.ts` (pace + caption blocks)
2. `npx remotion compositions src/index.ts` → confirm **1080×1920**, **30 fps** (or 60), expected duration.
3. Overflow: render stills at every scene midpoint (`--frame=N --scale=0.4`), tile with ffmpeg, and check that no text is clipped and nothing sits in y < 250 or y > 1520. Use `@remotion/layout-utils` `measureText`/`fitText` for long lines.
4. After render: `ffprobe` dimensions, fps, duration, and that the audio stream exists.

## This cloud container
Remotion's Chrome download is blocked here, so pass the pre-installed shell:
```bash
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
npx remotion render src/index.ts Master out/video.mp4 --browser-executable=$B
```

## Gotchas
- Flat SVG lines vanish under filters (zero-height bounding box). Keep `filterUnits="userSpaceOnUse"` in `HandSvg` and the invisible rect in `HorizonLine`.
- Fonts are local (`public/fonts`). Don't switch back to remote Google Fonts.
- Never pass `Infinity` into `interpolate`. Animate only with `useCurrentFrame()`.
- `out/` is git-ignored, so deliver files directly.
