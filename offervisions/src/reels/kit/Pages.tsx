import React from 'react';
import {PAGE_H, PAGE_W} from './Book';
import {BOLD, HAND, ITALIC} from './fonts';
import {LogoMark} from './Logo';
import {softGlow, usePalette} from './palette';

const cx = PAGE_W / 2;

/** Front cover of the closed book: the Offervisions logo, show name and year. */
export const CoverFront: React.FC<{readonly title: string; readonly year: string}> = ({title, year}) => {
	const {ink} = usePalette();
	return (
		<g>
			<g transform={`translate(${cx} ${PAGE_H * 0.38})`}>
				<LogoMark size={0.72} glow={0.4} />
			</g>
			<text x={cx} y={PAGE_H * 0.6} textAnchor="middle" fontFamily={BOLD} fontWeight={900} fontSize={34} letterSpacing="0.12em" fill={ink}>
				{title}
			</text>
			<text x={cx} y={PAGE_H * 0.7} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={40} fill={ink} opacity={0.85}>
				{year}
			</text>
		</g>
	);
};

/** Inside of the cover: a short handwritten dedication. */
export const InsideCover: React.FC<{readonly lines: string[]}> = ({lines}) => {
	const {ink} = usePalette();
	return (
		<g>
			{lines.map((l, i) => (
				<text key={i} x={cx} y={PAGE_H * 0.42 + i * 52} textAnchor="middle" fontFamily={HAND} fontWeight={600} fontSize={42} fill={ink} opacity={0.9}>
					{l}
				</text>
			))}
		</g>
	);
};

/** Title page: show name in caps with a serif subtitle. */
export const TitlePage: React.FC<{readonly title: string; readonly subtitle: string}> = ({title, subtitle}) => {
	const {ink} = usePalette();
	return (
		<g>
			<text x={cx} y={PAGE_H * 0.44} textAnchor="middle" fontFamily={BOLD} fontWeight={900} fontSize={38} letterSpacing="0.1em" fill={ink}>
				{title}
			</text>
			<line x1={cx - 60} y1={PAGE_H * 0.5} x2={cx + 60} y2={PAGE_H * 0.5} stroke={ink} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
			<text x={cx} y={PAGE_H * 0.6} textAnchor="middle" fontFamily={ITALIC} fontStyle="italic" fontSize={38} fill={ink} opacity={0.9}>
				{subtitle}
			</text>
		</g>
	);
};

/** Chapter opener: overline, a big glowing chapter number, title and subtitle. */
export const ChapterPage: React.FC<{
	readonly overline: string;
	readonly number: string;
	readonly title: string;
	readonly subtitle?: string;
	readonly numberGlow?: number;
	readonly pageNo?: string;
}> = ({overline, number, title, subtitle, numberGlow = 1, pageNo}) => {
	const {ink} = usePalette();
	return (
		<g>
			<text x={cx} y={78} textAnchor="middle" fontFamily={BOLD} fontWeight={900} fontSize={20} letterSpacing="0.22em" fill={ink} opacity={0.85}>
				{overline}
			</text>
			<text
				x={cx}
				y={268}
				textAnchor="middle"
				fontFamily={ITALIC}
				fontSize={200}
				fill={ink}
				style={{filter: softGlow(ink, numberGlow)}}
			>
				{number}
			</text>
			<text x={cx} y={340} textAnchor="middle" fontFamily={ITALIC} fontStyle="italic" fontSize={54} fill={ink}>
				{title}
			</text>
			{subtitle ? (
				<text x={cx} y={392} textAnchor="middle" fontFamily={HAND} fontWeight={600} fontSize={36} fill={ink} opacity={0.8}>
					{subtitle}
				</text>
			) : null}
			{pageNo ? (
				<text x={cx} y={PAGE_H - 30} textAnchor="middle" fontFamily={HAND} fontSize={28} fill={ink} opacity={0.6}>
					{pageNo}
				</text>
			) : null}
		</g>
	);
};
