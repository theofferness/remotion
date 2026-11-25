import React from 'react';
import {PAGE_H, PAGE_W} from './Book';
import {BOLD, HAND, ITALIC} from './fonts';
import {softGlow, usePalette} from './palette';

const cx = PAGE_W / 2;

/** Front cover of the closed book: show name + a little horizon-and-sun mark. */
export const CoverFront: React.FC<{readonly title: string; readonly year: string}> = ({title, year}) => {
	const {ink} = usePalette();
	return (
		<g>
			<g transform={`translate(${cx} ${PAGE_H * 0.4})`} stroke={ink} strokeWidth={4} fill="none" strokeLinecap="round">
				<path d="M -34 0 A 34 34 0 0 1 34 0" />
				<line x1={-80} y1={0} x2={80} y2={0} />
				<line x1={-50} y1={18} x2={50} y2={18} opacity={0.6} />
			</g>
			<text x={cx} y={PAGE_H * 0.58} textAnchor="middle" fontFamily={BOLD} fontWeight={900} fontSize={34} letterSpacing="0.12em" fill={ink}>
				{title}
			</text>
			<text x={cx} y={PAGE_H * 0.68} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={40} fill={ink} opacity={0.85}>
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
