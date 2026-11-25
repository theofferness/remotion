import React, {createContext, useContext} from 'react';

export type Palette = {bg: string; ink: string};

const Ctx = createContext<Palette>({bg: '#2E3A6B', ink: '#FFFFFF'});

export const PaletteProvider: React.FC<{readonly palette: Palette; readonly children: React.ReactNode}> = ({
	palette,
	children,
}) => <Ctx.Provider value={palette}>{children}</Ctx.Provider>;

export const usePalette = () => useContext(Ctx);

/** Soft glow for "the one object that matters" in a scene. */
export const softGlow = (color: string, strength = 1) =>
	`drop-shadow(0 0 ${5 * strength}px ${color}) drop-shadow(0 0 ${16 * strength}px ${color}99) drop-shadow(0 0 ${40 * strength}px ${color}55)`;

/** Hex colour with alpha (0–1). */
export const alpha = (hex: string, a: number) =>
	`${hex}${Math.round(Math.max(0, Math.min(1, a)) * 255)
		.toString(16)
		.padStart(2, '0')}`;
