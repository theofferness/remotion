---
name: captions
description: Burned-in caption rules for Offervisions videos — 2–5 word blocks, 140–175 wpm, one bold emphasis word, safe margins, never covering a face or logo, accuracy to the recorded voice. Use when adding, timing or reviewing captions.
---

# Captions

Use **2–5 words per caption block.**
Target **140–175 words per minute.**
**Bold only the word carrying the emotional or semantic emphasis.**
Keep at least **180 px of vertical safe margin.**
**Never cover a face or logo.**

## Offervisions specifics
- **Placement:** the band between the drawings and the bottom safe zone, about **y = 1330–1500**. That clears both the 180 px margin and Instagram's bottom 400 px (the stricter rule wins). Keep the same baseline for the whole video ("consistent subtitle margins").
- Don't let captions touch the learner's face, the logo mark or the CTA. If a scene's drawing reaches into the caption band, move the drawing.
- **Style:** Nunito 700 in ink colour, ~56–62 px, centred, soft dark shadow for legibility. The emphasis word is Nunito 900 with a soft glow. Only one per block, and not every block needs one.
- **Data:** use Remotion's `Caption` type (`@remotion/captions`).
  - Before the voice is recorded: auto-time from the script at ~155 wpm (placeholder only).
  - Once recorded: **transcribe Lucia's actual audio** (word timestamps) and replace the placeholder so captions match her words exactly, including any ad-libs.
- Mark the emphasis word in `chapter.ts` with `*asterisks*` in the VO line. The caption renderer bolds it.
- Captions shouldn't repeat the on-screen key phrase in the same frame. If the line is identical, show the caption and hold back the key phrase, or the reverse.
- Accuracy check: read the caption track against the audio before delivery, including spelling of names (Lucia, Offervisions, Big Bang Radio).
