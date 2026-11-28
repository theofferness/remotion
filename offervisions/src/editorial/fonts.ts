import {loadFont} from '@remotion/fonts';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

/** Literata (editorial serif, as on the covers) + Inter (sans). Bundled locally. */
if (typeof document !== 'undefined') {
	const handle = delayRender('Loading editorial fonts');
	Promise.all([
		loadFont({family: 'Literata', url: staticFile('fonts/Literata.woff2'), weight: '200 900', style: 'normal'}),
		loadFont({family: 'Literata', url: staticFile('fonts/Literata-Italic.woff2'), weight: '200 900', style: 'italic'}),
		loadFont({family: 'Inter', url: staticFile('fonts/Inter.woff2'), weight: '100 900'}),
	])
		.then(() => continueRender(handle))
		.catch((err) => cancelRender(err));
}

export const SERIF = '"Literata", Georgia, serif';
export const SANS = '"Inter", "Helvetica Neue", Arial, sans-serif';
