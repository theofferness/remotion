---
name: brand
description: Offervisions brand — voice (thoughtful, direct, hopeful, practical), show facts, typography and safe zones. Load before writing or designing ANY Offervisions content. Precedence rules for all skills live here.
---

# Brand

Use this voice: **thoughtful, direct, hopeful, and practical.**
Avoid clichés, aggressive urgency, and exaggerated claims.

Typography: **clean, modern, highly readable.**
All 1080×1920 compositions must preserve the platform safe zones.

## Precedence (applies to every skill)
1. **Lucia's brief for a specific video** wins (length, scene count, wording, colours, required lines).
2. Then these skills.
3. If a brief and a skill conflict, follow the brief, apply the skill wherever it still fits
   (e.g. use the skill's rules for the cut-downs), and **name the conflict in the reply**.

## The show (facts – never invent others)
- **OFFERVISIONS** – a 15-minute self-development podcast on **Big Bang Radio**, a non-commercial college radio station. Airs **Mondays at 11 AM**.
- Host **Lucia** is **not** a psychologist or teacher – a **fellow learner** sharing what she's learning about growth. Never present her as an expert or authority.
- Audience: open-minded people of any age who want to grow.
- **2027 is structured like a book**: four seasonal parts (Visualisation · Realisation · Connection · Integration) + a December epilogue; one new chapter every two weeks. Each chapter: one struggle, one positive, one small challenge – **invitations, not homework**.

## Voice in practice
- Short, concrete sentences in simple spoken English; "I" and "you".
- Hopeful without promising outcomes; practical = every idea ends in something doable.
- Banned: *must, should, hack, secret, life-changing, crush it, grind, guru*, "you won't believe", countdown urgency.

## Typography (bundled in `public/fonts`)
| Use | Font | Notes |
|-----|------|-------|
| Key phrase | Nunito 900, ALL CAPS | ≤ 6 words, ~92 px |
| Setup line | Instrument Serif italic | one line, ~58 px |
| Captions / UI | Nunito 700–800 | highest readability |
| Tags / labels | Caveat 600–700 | short words only (≤ 4) – never for captions or key info |

## Safe zones (1080×1920)
- Instagram/Reels: nothing important in the **top 250 px** or **bottom 400 px** → content band **y = 250–1520**.
- Keep ≥ 80 px side margins for text.
- Captions additionally follow the `captions` skill margins.

## Logo
- The official mark is the **ring with a wave** (an "O" with a sweeping wing).
  - Master file: `public/brand/offervisions-logo.png`. Trimmed, white on transparent, 543×388. Originals are in `brand-assets/`.
- In videos, always use the kit's `Logo`/`LogoMark` component. It masks the file and fills it with the season ink, so it never clashes with the palette.
- Never redraw, distort, rotate, outline or recolour it outside the season ink. Keep clear space of at least ½ the logo's height around it.
- Where it appears: the book's front cover, the CTA end card (top), and optionally covers. Captions never cover it.

## Fixed lines
- Captions end with `New chapter Monday 11 AM on Big Bang Radio.` then hashtags beginning `#Offervisions`.

## 2027 campaign identity (current – supersedes the 2026 Reel styling)
Source of truth: the six chapter covers in `brand-assets/` → `src/editorial/theme.ts`.

| Section | Background | Ink | Logo file |
|---|---|---|---|
| Opening Introduction | `#0d0d0d` black | `#ffffff` | white |
| Part One · Winter · Visualisation | `#141a36` midnight navy | `#ffffff` | white |
| Part Two · Spring · Realisation | `#142a20` forest green | `#ffffff` | white |
| Part Three · Summer · Connection | `#c99a2e` golden ochre | `#2a1810` | black |
| Part Four · Fall · Integration | `#4a1420` deep burgundy | `#ffffff` | white |
| Epilogue · December · Clear the Way | `#f3ede2` warm ivory | `#1f1f1f` | black |

- **Typography (as on the covers):** Literata for expressive titles, phrases and quotes (regular or italic, light weights at large sizes). Inter 500–600 for chapter titles and supporting text. Inter 500 caps tracked about 0.3em for overlines, credits and the footer (`MONDAYS 11 AM · BIG BANG RADIO`). The wordmark under the logo is Inter 400, tracked about 0.34em.
- **Content:** `THE OFFERNESS: 2027 Scripts` (docx) is the master content source. Titles, order, dates and themes come from it. Broadcast dates (Mondays) are separate from social posting dates.
- **Naming (confirmed by Lucia):** the show is **Offervisions**, written OFFERVISIONS in the wordmark. "The Offerness" in the script document is a typo. Whenever you quote or adapt the scripts, say and write **Offervisions**.
- **Never:** stick figures, characters, cartoons, clip art, childish drawings, excessive glow, template-looking motion, invented chapter content.
