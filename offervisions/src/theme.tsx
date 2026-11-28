import {loadFont} from '@remotion/fonts';
import React, {createContext, useContext} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import {FONTS} from './config';
import type {Theme} from './schema';

// Load every bundled font once, blocking rendering until they're ready.
const fontHandle = delayRender('Loading fonts');
Promise.all(
	FONTS.map((f) =>
		loadFont({
			family: f.family,
			url: staticFile(f.file),
			weight: f.weight,
			style: f.style,
		}),
	),
)
	.then(() => continueRender(fontHandle))
	.catch((err) => cancelRender(err));

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider: React.FC<{
	readonly theme: Theme;
	readonly children: React.ReactNode;
}> = ({theme, children}) => (
	<ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

export const useTheme = () => {
	const theme = useContext(ThemeContext);
	if (!theme) {
		throw new Error('useTheme() must be used inside <ThemeProvider>');
	}
	return theme;
};

export const fontStack = (family: string, fallback: 'sans' | 'serif') =>
	`"${family}", ${
		fallback === 'sans'
			? 'system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif'
			: 'Georgia, "Times New Roman", serif'
	}`;

/** Glow used on lines and figures. */
export const glow = (color: string, strength = 1) =>
	`drop-shadow(0 0 ${6 * strength}px ${color}) drop-shadow(0 0 ${18 * strength}px ${color}88)`;
