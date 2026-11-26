import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../editorial/fonts";
import { Atmos, hexA, Motes } from "../editorial/Atmos";
import { SANS, SERIF } from "../editorial/fonts";
import { LightLine, type LineKey } from "../editorial/Line";
import { BrandLogo, RATIO } from "../editorial/Logo";
import { EXPO_OUT, IN_OUT, QUART_OUT, mix, p } from "../editorial/motion";
import { PageTurn } from "../editorial/PageTurn";
import {
  BloomReveal,
  CloseReveal,
  IrisReveal,
  RiseReveal,
  UnfoldReveal,
} from "../editorial/Reveals";
import {
  BRAND,
  type Season,
  SEASONS,
  type SeasonKey,
} from "../editorial/theme";
import { Rule, SansTitle, SerifWords, Tracked } from "../editorial/Type";
import type { Pt } from "../reels/kit/shapes";
import { SFX } from "../reels/kit/Sfx";

/* ─────────────── timeline (frames @ 30 fps) ─────────────── */
const PAGE_LEN = 70;
const PARTS: SeasonKey[] = ["winter", "spring", "summer", "fall", "epilogue"];
const PAGES_START = 494;
const T = {
  hook: [0, 100],
  book: [100, 220],
  host: [220, 325],
  radio: [325, 430],
  year: [430, 500],
  chapters: [PAGES_START + PAGE_LEN * 5, PAGES_START + PAGE_LEN * 5 + 80],
  end: [PAGES_START + PAGE_LEN * 5 + 80, PAGES_START + PAGE_LEN * 5 + 80 + 190],
} as const;
export const OPENING_FRAMES = T.end[1];

/** How each section of the book opens – one family, five treatments. Frames each reveal takes. */
const REVEAL: Record<SeasonKey | "close", number> = {
  intro: 0,
  winter: 24,
  spring: 16,
  summer: 18,
  fall: 20,
  epilogue: 24,
  close: 18,
};
const WINTER_DOT = { x: 220, y: 1040 };

const INTRO = SEASONS.intro;
const INK = INTRO.ink;

/** Copy for Video 1 – all from the 2027 scripts and the Introduction cover. */
export const OPENING_COPY = {
  hook: ["This year", "is built like a book."],
  hookSub: "The first page opens January 11",
  podcast: "A self-development podcast",
  tagline: [
    "Opening up to yourself, to others,",
    "and to everything life has to offer.",
  ],
  hostedBy: "Hosted by",
  hostLine: "A fellow learner, not an expert.",
  slot: "Mondays, 11 AM",
  year: ["Four seasons.", "One epilogue."],
  yearSub: "Four parts · one epilogue · 24 chapters",
  chapters: "24 chapters.",
  chaptersSub: "A new one every other Monday",
  invite: "Invitations, not homework.",
  end: {
    title: "Introduction",
    subtitle: "Welcome to Offervisions",
    quote: ["“What do I want this year", "to offer me?”"],
  },
};

/* ─────────────── helpers ─────────────── */

const Center: React.FC<{
  readonly top: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ top, children, style }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 70,
      right: 70,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

const hline = (y: number, x1: number, x2: number): Pt[] => [
  [x1, y],
  [x2, y],
];

/* ─────────────── 1 · hook: a point of light becomes the horizon ─────────────── */

const Hook: React.FC = () => {
  const t = useCurrentFrame();
  const spark = 1 - p(t, 6, 22);
  return (
    <AbsoluteFill
      style={{ scale: String(interpolate(t, [0, 100], [1, 1.035])) }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 260px at 540px 1010px, ${hexA(INK, 0.18 * spark)}, transparent 70%)`,
        }}
      />
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <circle
          cx={540}
          cy={1010}
          r={5}
          fill={INK}
          opacity={spark}
          style={{ filter: `drop-shadow(0 0 10px ${INK})` }}
        />
      </svg>
      <Center top={712}>
        <SerifWords
          text={OPENING_COPY.hook[0]}
          at={3}
          out={86}
          color={INK}
          size={128}
        />
        <SerifWords
          text={OPENING_COPY.hook[1]}
          at={9}
          out={86}
          color={INK}
          size={98}
          italic
          weight={300}
        />
      </Center>
      <Center top={1050}>
        <Tracked
          text={OPENING_COPY.hookSub}
          at={26}
          out={86}
          color={INK}
          size={30}
          spacing={0.3}
          style={{ opacity: 0.9 }}
        />
      </Center>
    </AbsoluteFill>
  );
};

/* ─────────────── 2 · the book opens and the logo appears in its light ─────────────── */

const Book: React.FC = () => {
  const t = useCurrentFrame();
  const open = p(t, 4, 40, IN_OUT);
  const out = p(t, 104, 118, QUART_OUT);
  const W = 340;
  const top = 640;
  const bottom = 1240;
  const page = (side: -1 | 1) => {
    const ox = 540 + side * W * open;
    const pinch = Math.sin(Math.PI * open) * 26;
    return `540,${top} ${ox},${top + pinch} ${ox},${bottom - pinch} 540,${bottom}`;
  };
  const gutter = p(t, 22, 40, IN_OUT);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${120 + open * 280}px 440px at 540px 940px, ${hexA(INK, 0.15 * open)}, transparent 75%)`,
        }}
      />
      <Motes ink={INK} count={10} opacity={open} />
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <g
          fill="none"
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
          opacity={0.85}
        >
          <polyline points={page(-1)} />
          <polyline points={page(1)} />
          <line
            x1={540}
            x2={540}
            y1={top}
            y2={mix(top + (bottom - top) * 0.5, top + 120, gutter)}
          />
          <line
            x1={540}
            x2={540}
            y1={bottom}
            y2={mix(bottom - (bottom - top) * 0.5, bottom - 140, gutter)}
          />
        </g>
        <g stroke={INK} strokeWidth={1.5} opacity={0.16 * open}>
          {[top + 70, top + 112, bottom - 112, bottom - 70].map((y, i) => (
            <g key={i}>
              <line x1={540 - W * open + 40} x2={540 - 40} y1={y} y2={y} />
              <line
                x1={540 + 40}
                x2={540 + W * open - 40 - (i % 3) * 30}
                y1={y}
                y2={y}
              />
            </g>
          ))}
        </g>
      </svg>
      <Center top={790}>
        <BrandLogo variant="white" width={260} reveal={p(t, 28, 56, IN_OUT)} />
        <div style={{ height: 32 }} />
        <Tracked
          text={BRAND.wordmark}
          at={46}
          color={INK}
          size={38}
          weight={400}
          spacing={0.34}
        />
        <div style={{ height: 14 }} />
        <Tracked
          text={OPENING_COPY.podcast}
          at={58}
          color={INK}
          size={26}
          spacing={0.26}
          style={{ opacity: 0.88 }}
        />
      </Center>
      <Center top={1290}>
        <SerifWords
          text={OPENING_COPY.tagline[0]}
          at={70}
          color={INK}
          size={44}
          italic
          weight={300}
          stagger={2}
        />
        <SerifWords
          text={OPENING_COPY.tagline[1]}
          at={76}
          color={INK}
          size={44}
          italic
          weight={300}
          stagger={2}
        />
      </Center>
    </AbsoluteFill>
  );
};

/* ─────────────── 3 · hosted by Lucie, inside a ring that echoes the logo ─────────────── */

const Host: React.FC = () => {
  const t = useCurrentFrame();
  const ring = p(t, 4, 52, IN_OUT);
  const out = p(t, 90, 104, QUART_OUT);
  return (
    <>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, opacity: 1 - out }}
      >
        <g transform={`rotate(${-90 + t * 0.12} 540 905)`}>
          <circle
            cx={540}
            cy={905}
            r={300}
            fill="none"
            stroke={INK}
            strokeWidth={1.5}
            opacity={0.28}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - ring}
          />
        </g>
        <circle
          cx={540}
          cy={905}
          r={318}
          fill="none"
          stroke={INK}
          strokeWidth={1}
          opacity={0.1 * ring}
        />
      </svg>
      <Center top={752}>
        <Tracked
          text={OPENING_COPY.hostedBy}
          at={6}
          out={90}
          color={INK}
          size={30}
          spacing={0.32}
          style={{ opacity: 0.9 }}
        />
        <div style={{ height: 14 }} />
        <SerifWords
          text={BRAND.host}
          at={10}
          out={90}
          color={INK}
          size={200}
          italic
          weight={300}
          tracking="-0.02em"
        />
      </Center>
      <Center top={1046}>
        <SerifWords
          text={OPENING_COPY.hostLine}
          at={28}
          out={90}
          color={INK}
          size={46}
          italic
          weight={300}
          stagger={2}
        />
      </Center>
    </>
  );
};

/* ─────────────── 4 · on air: the line becomes a voice ─────────────── */

const Radio: React.FC = () => {
  const t = useCurrentFrame();
  const lit = p(t, 10, 16, (x) => x);
  const out = p(t, 92, 104, QUART_OUT);
  return (
    <>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, opacity: (1 - out) * lit }}
      >
        {[0, 1, 2].map((k) => {
          const r = 70 + ((t * 1.1 + k * 34) % 102);
          return (
            <path
              key={k}
              d={`M ${540 - r} 735 A ${r} ${r} 0 0 1 ${540 + r} 735`}
              fill="none"
              stroke={INK}
              strokeWidth={1.5}
              opacity={0.32 * (1 - (r - 70) / 102)}
            />
          );
        })}
      </svg>
      <Center top={704} style={{ opacity: 1 - out }}>
        <div
          style={{
            padding: "13px 28px 13px 37px",
            border: `2px solid ${INK}`,
            borderRadius: 10,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: "0.34em",
            color: lit > 0.5 ? INTRO.bg : INK,
            background: lit > 0.5 ? INK : "transparent",
            boxShadow: lit > 0.5 ? `0 0 30px ${hexA(INK, 0.2)}` : "none",
            opacity: p(t, 0, 10),
          }}
        >
          ON AIR
        </div>
      </Center>
      <Center top={830}>
        <SerifWords
          text={OPENING_COPY.slot}
          at={16}
          out={92}
          color={INK}
          size={120}
          weight={400}
        />
      </Center>
      <Center top={1010}>
        <Tracked
          text={BRAND.station}
          at={30}
          out={92}
          color={INK}
          size={38}
          weight={500}
          spacing={0.28}
        />
      </Center>
    </>
  );
};

/* ─────────────── 5 · four seasons: five points on the line; the first one opens ─────────────── */

const Year: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <>
      <Center top={752}>
        <SerifWords
          text={OPENING_COPY.year[0]}
          at={4}
          out={48}
          color={INK}
          size={114}
        />
        <SerifWords
          text={OPENING_COPY.year[1]}
          at={10}
          out={48}
          color={INK}
          size={114}
          italic
          weight={300}
        />
      </Center>
      <Center top={1086}>
        <Tracked
          text={OPENING_COPY.yearSub}
          at={20}
          out={48}
          color={INK}
          size={27}
          spacing={0.18}
          style={{ opacity: 0.9 }}
        />
      </Center>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        {PARTS.map((k, i) => {
          const s = p(t, 22 + i * 4, 36 + i * 4, EXPO_OUT);
          const isWinter = i === 0;
          const fade = isWinter ? 1 : 1 - p(t, 48, 58);
          const grow = isWinter ? 1 + p(t, 52, 64, IN_OUT) * 0.8 : 1;
          return (
            <circle
              key={k}
              cx={220 + i * 160}
              cy={1040}
              r={12 * s * grow}
              fill={SEASONS[k].bg}
              stroke={INK}
              strokeWidth={2}
              opacity={fade}
            />
          );
        })}
      </svg>
    </>
  );
};

/* ─────────────── 6 · a seasonal page, laid out like the official covers ─────────────── */

const SeasonPage: React.FC<{
  readonly season: Season;
  readonly index: number;
  readonly delay: number;
}> = ({ season, index, delay }) => {
  const t = useCurrentFrame() - delay;
  const ink = season.ink;
  const themeSize = season.theme.length > 11 ? 116 : 136;
  const light = interpolate(t, [-delay, PAGE_LEN], [28, 64]);
  return (
    <AbsoluteFill>
      <Atmos bg={season.bg} ink={ink} light={0} grain={0.07} />
      {/* slow light moving across the page, like daylight on paper */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 65% 42% at ${light}% 44%, ${hexA("#ffffff", season.logo === "white" ? 0.07 : 0.16)}, transparent 72%)`,
        }}
      />
      {season.numeral ? (
        <div
          style={{
            position: "absolute",
            top: 500,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: SERIF,
            fontWeight: 200,
            fontSize: 740,
            lineHeight: 1,
            color: ink,
            opacity: 0.055 * p(t, 0, 30),
            translate: `0px ${interpolate(t, [-delay, PAGE_LEN], [24, -24])}px`,
          }}
        >
          {season.numeral}
        </div>
      ) : null}
      <Sequence from={delay} layout="none" name="page text">
        <Center top={668}>
          <Tracked
            text={season.overline}
            at={0}
            color={ink}
            size={32}
            weight={500}
            spacing={0.28}
          />
          <div style={{ height: 24 }} />
          <SerifWords
            text={season.theme}
            at={4}
            color={ink}
            size={themeSize}
            italic
            weight={300}
          />
          <div style={{ height: 26 }} />
          <Rule at={12} width={72} color={ink} opacity={0.8} />
          <div style={{ height: 32 }} />
          <SerifWords
            text={season.line}
            at={16}
            color={ink}
            size={season.line.length > 38 ? 44 : 50}
            weight={350}
            stagger={2}
            style={{ maxWidth: 940 }}
          />
        </Center>
        <Center top={1150}>
          <Tracked
            text={season.months}
            at={22}
            color={ink}
            size={28}
            spacing={0.28}
            style={{ opacity: 0.88 }}
          />
        </Center>
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", inset: 0 }}
        >
          <line
            x1={540 - 400 * p(t, 0, 26, IN_OUT)}
            x2={540 + 400 * p(t, 0, 26, IN_OUT)}
            y1={1260}
            y2={1260}
            stroke={ink}
            strokeWidth={2}
            opacity={0.6}
          />
        </svg>
        <Center top={1400}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: "0.3em",
              paddingLeft: "0.3em",
              color: ink,
              opacity: 0.75 * p(t, 14, 34),
            }}
          >{`0${index + 1} / 05`}</div>
        </Center>
      </Sequence>
    </AbsoluteFill>
  );
};

/** Each section of the book opens differently – circle of light, page turn, unfold, rising horizon, bloom. */
const SectionOpen: React.FC<{
  readonly k: SeasonKey;
  readonly index: number;
}> = ({ k, index }) => {
  const t = useCurrentFrame();
  const len = REVEAL[k];
  const prog = t / len;
  const page = <SeasonPage season={SEASONS[k]} index={index} delay={Math.max(6, len - 10)} />;
  switch (k) {
    case "winter":
      return (
        <IrisReveal progress={prog} cx={WINTER_DOT.x} cy={WINTER_DOT.y}>
          {page}
        </IrisReveal>
      );
    case "spring":
      return <PageTurn progress={prog}>{page}</PageTurn>;
    case "summer":
      return <UnfoldReveal progress={prog}>{page}</UnfoldReveal>;
    case "fall":
      return (
        <RiseReveal progress={prog} lineColor="#ffffff">
          {page}
        </RiseReveal>
      );
    default:
      return <BloomReveal progress={prog}>{page}</BloomReveal>;
  }
};

/* ─────────────── 7 · 24 chapters; the book closes ─────────────── */

const Chapters: React.FC = () => {
  const t = useCurrentFrame();
  const close = p(t, 60, 78, IN_OUT);
  const partOf = (c: number): SeasonKey =>
    c <= 4
      ? "winter"
      : c <= 10
        ? "spring"
        : c <= 16
          ? "summer"
          : c <= 22
            ? "fall"
            : "epilogue";
  return (
    <CloseReveal progress={t / REVEAL.close}>
      <AbsoluteFill>
        <Atmos bg={INTRO.bg} ink={INK} />
        <Center top={736}>
          <SerifWords
            text={OPENING_COPY.chapters}
            at={14}
            out={60}
            color={INK}
            size={130}
          />
        </Center>
        <Center top={920}>
          <Tracked
            text={OPENING_COPY.chaptersSub}
            at={22}
            out={60}
            color={INK}
            size={30}
            spacing={0.28}
            style={{ opacity: 0.9 }}
          />
        </Center>
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", inset: 0 }}
        >
          {Array.from({ length: 24 }).map((_, i) => {
            const s = p(t, 16 + i * 1.2, 30 + i * 1.2, EXPO_OUT);
            const x0 = 200 + i * (680 / 23);
            const x = x0 + (540 - x0) * close;
            const h = 100 * s * (1 - close * 0.92);
            return (
              <g key={i}>
                <line
                  x1={x}
                  x2={x}
                  y1={1250}
                  y2={1250 - h}
                  stroke={INK}
                  strokeWidth={2}
                  opacity={0.8}
                />
                <circle
                  cx={x}
                  cy={1250 - h - 11}
                  r={6 * s * (1 - close)}
                  fill={SEASONS[partOf(i + 1)].bg}
                  stroke={INK}
                  strokeWidth={1.5}
                />
              </g>
            );
          })}
        </svg>
        <Center top={1318}>
          <SerifWords
            text={OPENING_COPY.invite}
            at={34}
            out={60}
            color={INK}
            size={56}
            italic
            weight={300}
          />
        </Center>
      </AbsoluteFill>
    </CloseReveal>
  );
};

/* ─────────────── 8 · cinematic brand reveal → the Introduction cover ─────────────── */

const LOGO_BIG = 330;
const LOGO_SMALL = 150;

const EndCard: React.FC = () => {
  const t = useCurrentFrame();
  const c = OPENING_COPY.end;
  const bloom = p(t, 0, 16) * (1 - p(t, 40, 80));
  const reveal = p(t, 8, 44, IN_OUT);
  const settle = p(t, 66, 100, IN_OUT);
  // logo + wordmark glide from centre stage to the cover position
  const scale = mix(1, LOGO_SMALL / LOGO_BIG, settle);
  const blockTop = mix(700, 410, settle);
  const beamX = 540 - LOGO_BIG / 2 + LOGO_BIG * reveal;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 380px 300px at 540px 840px, ${hexA(INK, 0.16 * bloom)}, transparent 72%)`,
        }}
      />
      <Motes ink={INK} count={8} opacity={bloom} />
      {reveal > 0 && reveal < 1 ? (
        <div
          style={{
            position: "absolute",
            left: beamX - 2,
            top: 700 - 40,
            width: 4,
            height: LOGO_BIG * RATIO + 80,
            background: `linear-gradient(to bottom, transparent, ${INK}, transparent)`,
            boxShadow: `0 0 24px ${INK}`,
            opacity: Math.sin(Math.PI * reveal) * 0.8,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          top: blockTop,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            scale: String(scale * mix(1.05, 1, reveal)),
            transformOrigin: "center top",
          }}
        >
          <BrandLogo variant="white" width={LOGO_BIG} reveal={reveal} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: blockTop + LOGO_BIG * RATIO * scale + mix(46, 30, settle),
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tracked
          text={BRAND.wordmark}
          at={34}
          color={INK}
          size={mix(46, 34, settle)}
          weight={400}
          spacing={0.34}
        />
      </div>
      <Center top={720}>
        <Tracked
          text={INTRO.overline}
          at={84}
          color={INK}
          size={30}
          weight={500}
          spacing={0.28}
          style={{ opacity: 0.92 }}
        />
        <div style={{ height: 10 }} />
        <SerifWords
          text={INTRO.theme}
          at={88}
          color={INK}
          size={42}
          italic
          weight={300}
        />
      </Center>
      <Center top={850}>
        <SerifWords
          text={c.title}
          at={94}
          color={INK}
          size={150}
          weight={400}
          tracking="-0.015em"
        />
        <div style={{ height: 6 }} />
        <SansTitle
          text={c.subtitle}
          at={104}
          color={INK}
          size={68}
          weight={600}
        />
      </Center>
      <Center top={1162}>
        <SerifWords
          text={c.quote[0]}
          at={116}
          color={INK}
          size={46}
          italic
          weight={300}
          stagger={2}
        />
        <SerifWords
          text={c.quote[1]}
          at={120}
          color={INK}
          size={46}
          italic
          weight={300}
          stagger={2}
        />
      </Center>
      <Center top={1366}>
        <Tracked
          text={`${BRAND.slot} · ${BRAND.station}`}
          at={128}
          color={INK}
          size={32}
          weight={500}
          spacing={0.1}
        />
      </Center>
    </AbsoluteFill>
  );
};

/* ─────────────── the line of light ─────────────── */

const LINE_KEYS: LineKey[] = [
  {
    at: 0,
    shape: (f) =>
      hline(
        1010,
        540 - 400 * p(f, 2, 24, IN_OUT),
        540 + 400 * p(f, 2, 24, IN_OUT),
      ),
  },
  {
    at: T.book[0],
    morph: 18,
    shape: () => [
      [540, 640],
      [540, 1240],
    ],
  },
  {
    at: T.book[0] + 20,
    morph: 10,
    opacity: 0,
    shape: () => [
      [540, 640],
      [540, 1240],
    ],
  },
  { at: T.host[0], morph: 18, shape: () => hline(1014, 470, 610) },
  {
    at: T.radio[0],
    morph: 18,
    shape: (f) => {
      const lt = f - T.radio[0];
      const amp = 54 * p(lt, 6, 30) * (1 - p(lt, 86, 104));
      return Array.from({ length: 120 }, (_, i): Pt => {
        const u = i / 119;
        const env = Math.sin(Math.PI * u) ** 1.5;
        const y =
          1180 +
          amp *
            env *
            (Math.sin(u * 38 + lt * 0.35) * 0.6 +
              Math.sin(u * 91 - lt * 0.55) * 0.4);
        return [120 + u * 840, y];
      });
    },
  },
  { at: T.year[0], morph: 18, shape: () => hline(1040, 140, 940) },
  {
    at: T.year[0] + 50,
    morph: 10,
    opacity: 0,
    shape: () => hline(1040, 140, 940),
  },
  { at: T.chapters[0] + 10, morph: 16, shape: () => hline(1250, 180, 900) },
  { at: T.chapters[0] + 60, morph: 18, shape: () => hline(1250, 538, 542) },
  { at: T.end[0], morph: 12, opacity: 0, shape: () => hline(900, 539, 541) },
  {
    at: T.end[0] + 108,
    morph: 20,
    opacity: 0.75,
    shape: () => hline(1130, 500, 580),
  },
];

/* ─────────────── sound (impacts: book-close + final logo chime) ─────────────── */

const Cue: React.FC<{
  readonly at: number;
  readonly src: string;
  readonly volume: number;
  readonly name: string;
}> = ({ at, src, volume, name }) => (
  <Sequence from={at} durationInFrames={90} layout="none" name={name}>
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

const pageStart = (i: number) => PAGES_START + i * PAGE_LEN;

const Sound: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <>
      <Audio
        name="Ambient bed"
        src={staticFile("audio/2027/ambient.mp3")}
        volume={(f) =>
          0.55 *
          interpolate(
            f,
            [0, fps * 1, durationInFrames - fps * 2, durationInFrames],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      <Cue name="spark" at={0} src={SFX.air} volume={0.35} />
      <Cue
        name="book opens"
        at={T.book[0] + 4}
        src={SFX.pageTurn}
        volume={0.5}
      />
      <Cue name="logo light" at={T.book[0] + 26} src={SFX.air} volume={0.4} />
      <Cue name="on air" at={T.radio[0] + 10} src={SFX.pop} volume={0.3} />
      <Cue
        name="winter · circle of light"
        at={pageStart(0)}
        src={SFX.air}
        volume={0.45}
      />
      <Cue
        name="spring · page turn"
        at={pageStart(1)}
        src={SFX.pageTurn}
        volume={0.45}
      />
      <Cue
        name="summer · unfold"
        at={pageStart(2)}
        src={SFX.pageTurn}
        volume={0.4}
      />
      <Cue
        name="fall · rising horizon"
        at={pageStart(3)}
        src={SFX.air}
        volume={0.4}
      />
      <Cue
        name="epilogue · bloom"
        at={pageStart(4)}
        src={SFX.air}
        volume={0.5}
      />
      <Cue
        name="book closes"
        at={T.chapters[0] + 2}
        src={SFX.bookClose}
        volume={0.55}
      />
      <Cue name="logo chime" at={T.end[0] + 10} src={SFX.chime} volume={0.45} />
    </>
  );
};

/* ─────────────── composition ─────────────── */

const Shot: React.FC<{
  readonly span: readonly [number, number];
  readonly name: string;
  readonly children: React.ReactNode;
  readonly tail?: number;
}> = ({ span, name, children, tail = 0 }) => (
  <Sequence
    from={span[0]}
    durationInFrames={span[1] - span[0] + tail}
    name={name}
  >
    {children}
  </Sequence>
);

/** VIDEO 1 – Opening Credits & Introduction (black). */
export const OpeningCredits: React.FC = () => (
  <AbsoluteFill>
    <Atmos bg={INTRO.bg} ink={INK} />
    <Shot span={T.hook} name="1 · Hook">
      <Hook />
    </Shot>
    <Shot span={T.book} name="2 · The book opens">
      <Book />
    </Shot>
    <Shot span={T.host} name="3 · Hosted by Lucie">
      <Host />
    </Shot>
    <Shot span={T.radio} name="4 · On air">
      <Radio />
    </Shot>
    <Shot span={T.year} name="5 · Four seasons" tail={REVEAL.winter}>
      <Year />
    </Shot>
    {PARTS.map((k, i) => (
      <Sequence
        key={k}
        from={pageStart(i)}
        durationInFrames={PAGE_LEN + 26}
        name={`6 · ${SEASONS[k].theme}`}
      >
        <SectionOpen k={k} index={i} />
      </Sequence>
    ))}
    <Shot span={T.chapters} name="7 · 24 chapters">
      <Chapters />
    </Shot>
    <Shot span={T.end} name="8 · Brand reveal">
      <EndCard />
    </Shot>
    <LightLine keys={LINE_KEYS} color={INK} width={3} />
    <Sound />
  </AbsoluteFill>
);
