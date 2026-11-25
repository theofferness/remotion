---
name: remotion
description: How Offervisions Reels are built in this Remotion project — the shared reel kit, chapter folder pattern, composition naming, editing text/timing, rendering stills and MP4s in this environment, fonts and sound effects. Use whenever creating or changing an Offervisions Reel or cover in code.
---

# Building Offervisions Reels in Remotion

Project root: `offervisions/` (standalone, Remotion 4.0.547). For general Remotion API guidance also see the repo-level `remotion-best-practices` skill.

## Layout
```
src/reels/kit/          shared building blocks – reuse, don't fork
  series.ts             show facts, SEASONS colours, SAFE zones, fonts
  fonts.ts              loads Nunito / Caveat / Instrument Serif from public/fonts
  palette.tsx           PaletteProvider, usePalette(), softGlow(), alpha()
  anim.ts               prog(), SOFT / SOFT_IN_OUT / GENTLE_BACK easings, seeded()
  HandSvg.tsx           full-frame SVG with hand-drawn wobble filter (wrap all line art)
  HorizonLine.tsx       the continuous line; keys = [{at, shape(frame) → points, morph}]
  Book.tsx + Pages.tsx  signature book (open / turn / close) + CoverFront, TitlePage, ChapterPage…
  Learner.tsx           the character (stand/sit, walk, bookGlow, raise, tilt)
  Cozy.tsx              TeaCup, Lamp, Plant, Candle, Notebook, Snowflake, Sprout, Bridge, Leaf
  Tag.tsx               gift-tag on a string that pops onto an object
  TitleBanner.tsx, OnScreenText.tsx, Atmosphere.tsx (Backdrop, Particles), Sfx.tsx
src/reels/chNN/         one folder per chapter
  chapter.ts            ALL text + timing for that chapter's Reels (edit here)
  VideoN.tsx            composition: timeline, horizon keys, SFX hits
  vNscenes.tsx          scene components
  CoverN.tsx            cover Still
reels/chNN-<slug>/      written packages (script, storyboard, caption)
public/audio/reels/     SFX (regenerate: npm run audio:reels)
```

## Pattern for a new Reel
1. Put scenes in `chapter.ts` as `{id, sec, vo, small, big}` – one scene per VO sentence.
2. Timeline = cumulative `sec × fps`. Each scene is a `<Sequence from={start - PAD} durationInFrames={dur + 2*PAD}>` so neighbours cross-dissolve (PAD = 12). Use the `useScene(dur)` helper for own-time `t` and fade.
3. **One `HorizonLine` for the whole video** — add a key per scene whose shape matches that scene's drawing. Shapes are point lists in screen coords (resampled + morphed automatically). Shapes may depend on the frame (e.g. scroll for a pan).
4. Wrap line art in `<HandSvg>`; HTML text (OnScreenText, TitleBanner) stays outside it so text stays crisp.
5. Glow only the one object that matters per scene (`glow` / `bookGlow` props or `softGlow`).
6. Animate only with `useCurrentFrame()` + `interpolate`/`prog` – no CSS transitions.
7. Open with the Book page-turn to the chapter number; close with the Book shutting + show name.
8. Register in `src/Root.tsx` inside a `<Folder name="ChNN-…">`: `ChNN-VideoN-<Role>` composition + `ChNN-VideoN-Cover` still.
9. Voiceover: `voiceover` path in `chapter.ts`; once recorded, re-time scene `sec` values to her reading.

## Gotchas learned
- **Flat lines vanish** under SVG/CSS filters (zero-height bounding box). HandSvg uses `filterUnits="userSpaceOnUse"`; HorizonLine wraps the path with an invisible full-frame rect. Keep it that way.
- Fonts are bundled locally (`public/fonts`) so renders work offline – don't switch back to remote Google Fonts.
- `prog(frame, to, …)` with `Infinity` crashes `interpolate` – use `undefined` checks.
- Keep content in y = 250–1520 (`SAFE` in series.ts).

## Rendering in this cloud environment
Remotion's Chrome download host is blocked here; use the pre-installed headless shell:
```bash
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
npx remotion bundle --out-dir <scratch>/bundle
npx remotion still  <scratch>/bundle ChNN-VideoN-… frame.png --frame=120 --scale=0.4 --browser-executable=$B
npx remotion render <scratch>/bundle ChNN-VideoN-… out/chNN/videoN.mp4 --browser-executable=$B
```
On a normal machine: `npm run dev` (Studio) and `npm run render:ch00-v1` style scripts.
Always `npx tsc --noEmit` and `npx eslint src` before rendering. `out/` is git-ignored – send MP4/PNG to Lucie directly.
