import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { RATIO } from "./Logo";
import { IN_OUT, QUART_OUT } from "./motion";

/**
 * Section reveals for the book – one family, five treatments.
 * Each takes `progress` 0→1 and reveals `children` (the incoming section) over the current frame.
 */

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/** A circle of light opens from a point (used for the first section: Winter). */
export const IrisReveal: React.FC<{
  readonly progress: number;
  readonly cx: number;
  readonly cy: number;
  readonly children: React.ReactNode;
}> = ({ progress, cx, cy, children }) => {
  if (progress <= 0) return null;
  const t = IN_OUT(clamp(progress));
  const r = 8 + t * 2300;
  return (
    <>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
        {children}
      </AbsoluteFill>
      {t < 1 ? (
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#ffffff"
            strokeWidth={2}
            opacity={0.55 * (1 - t)}
          />
        </svg>
      ) : null}
    </>
  );
};

/** The book unfolds from its spine: the section opens outward from the centre (Summer). */
export const UnfoldReveal: React.FC<{
  readonly progress: number;
  readonly children: React.ReactNode;
}> = ({ progress, children }) => {
  if (progress <= 0) return null;
  const t = IN_OUT(clamp(progress));
  const half = 540 * t;
  const shade = 0.35 * Math.sin(Math.PI * t);
  return (
    <>
      <AbsoluteFill
        style={{ clipPath: `inset(0 ${540 - half}px 0 ${540 - half}px)` }}
      >
        {children}
        {/* light falls across the opening pages */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(to right, rgba(0,0,0,${shade}) 0%, transparent 18%, transparent 82%, rgba(0,0,0,${shade}) 100%)`,
            clipPath: `inset(0 ${540 - half}px 0 ${540 - half}px)`,
          }}
        />
      </AbsoluteFill>
      {t < 1 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              left: 540 - half - 1,
              top: 0,
              bottom: 0,
              width: 2,
              background: "rgba(255,255,255,0.5)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 540 + half - 1,
              top: 0,
              bottom: 0,
              width: 2,
              background: "rgba(255,255,255,0.5)",
            }}
          />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

/** A horizon rises and carries the new section up with it (Autumn). */
export const RiseReveal: React.FC<{
  readonly progress: number;
  readonly lineColor: string;
  readonly children: React.ReactNode;
}> = ({ progress, lineColor, children }) => {
  if (progress <= 0) return null;
  const t = IN_OUT(clamp(progress));
  const y = 1920 * (1 - t);
  return (
    <>
      <AbsoluteFill style={{ clipPath: `inset(${y}px 0 0 0)` }}>
        <AbsoluteFill style={{ translate: `0px ${(1 - t) * 120}px` }}>
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
      {t < 1 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: y - 1,
              height: 2,
              background: lineColor,
              boxShadow: `0 0 18px ${lineColor}`,
              opacity: 0.9,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: y - 160,
              height: 160,
              background:
                "linear-gradient(to bottom, transparent, rgba(0,0,0,0.25))",
            }}
          />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

/** The section emerges through a soft bloom of warm light (Epilogue · Clear the Way). */
export const BloomReveal: React.FC<{
  readonly progress: number;
  readonly glow?: string;
  readonly children: React.ReactNode;
}> = ({ progress, glow = "#fffaf0", children }) => {
  if (progress <= 0) return null;
  const t = clamp(progress);
  const flash = Math.sin(Math.PI * Math.min(1, t * 1.15));
  return (
    <>
      <AbsoluteFill style={{ opacity: QUART_OUT(clamp((t - 0.2) / 0.8)) }}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 47%, ${glow}, transparent 75%)`,
          opacity: 0.85 * flash,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

/** The book closes: the incoming section slides in from both edges and meets at the spine. */
export const CloseReveal: React.FC<{
  readonly progress: number;
  readonly children: React.ReactNode;
}> = ({ progress, children }) => {
  if (progress <= 0) return null;
  const t = IN_OUT(clamp(progress));
  const edge = 540 * t;
  return (
    <>
      <AbsoluteFill
        style={{
          clipPath: `polygon(0 0, ${edge}px 0, ${edge}px 100%, 0 100%, 0 0, 1080px 0, 1080px 100%, ${1080 - edge}px 100%, ${1080 - edge}px 0, 1080px 0)`,
        }}
      >
        {children}
      </AbsoluteFill>
      {t < 1 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              left: edge - 140,
              top: 0,
              bottom: 0,
              width: 140,
              background:
                "linear-gradient(to right, transparent, rgba(0,0,0,0.3))",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 1080 - edge,
              top: 0,
              bottom: 0,
              width: 140,
              background:
                "linear-gradient(to left, transparent, rgba(0,0,0,0.3))",
            }}
          />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

/** A single specular sweep across the supplied logo (mask = the logo file itself, so the shape is untouched). */
export const LogoSheen: React.FC<{
  readonly width: number;
  readonly progress: number;
  readonly variant?: "white" | "black";
}> = ({ width, progress, variant = "white" }) => {
  if (progress <= 0 || progress >= 1) return null;
  const x = -60 + progress * 220;
  const src = staticFile(`brand/offervisions-logo-${variant}.png`);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width,
        height: width * RATIO,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        background: `linear-gradient(105deg, transparent ${x - 18}%, rgba(255,255,255,0.0) ${x - 10}%, rgba(255,255,255,0.95) ${x}%, rgba(255,255,255,0.0) ${x + 10}%, transparent ${x + 18}%)`,
        mixBlendMode: variant === "white" ? "normal" : "screen",
      }}
    />
  );
};
