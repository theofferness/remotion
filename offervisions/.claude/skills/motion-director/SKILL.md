---
name: motion-director
description: Motion rules for Offervisions Reels — restrained easing, 8–12 frame transitions, no excessive zoom/spin/bounce, attention guided by visual weight, gradual energy build. Use when animating or reviewing any scene timing, easing or transition.
---

# Motion Direction

Use restrained spring or cubic-bezier easing.
Do not use excessive zooms, spinning text, or bouncing.
**Transitions should last 8–12 frames.**
Visual weight should guide attention toward the spoken idea.
Build energy gradually rather than animating everything simultaneously.

## In this project (`src/reels/kit/anim.ts`)
- Default easings: `SOFT` = bezier(0.33, 0, 0.2, 1), `SOFT_IN_OUT` = bezier(0.6, 0, 0.4, 1).
- For springs use `Easing.spring({damping: 200})`-style, i.e. **no overshoot**.
- `GENTLE_BACK` (overshoot 1.35) reads as a bounce. Don't use it for new work. Tag pops should scale in with `SOFT` plus a short fade.
- **Scene transitions (cross-dissolve, zoom-through, cut-on-motion): 8–12 frames.** Set `PAD` to 5 (cross-fade = 2 × PAD = 10 frames).
- The **continuous horizon-line morph** isn't a scene transition. It can take longer (20–36 frames), but it has to start inside the outgoing scene so the cut itself stays within 8–12 frames.
- One zoom-through per video at most, and keep it slow. No rotating or spinning text. Icons can turn gently (≤ 0.5°/frame).

## Attention
- Each scene has **one** focal object: give it the glow, the movement and the largest size. Keep everything else still or faint.
- Text enters first, then the focal drawing moves on the spoken keyword, then supporting details settle in.
- Stagger entrances by 4–8 frames. Never start more than two motions on the same frame.
- Energy curve: calm open → build through the insight (more elements, a slightly faster rhythm) → settle for the practical shift → one clear, still CTA.
