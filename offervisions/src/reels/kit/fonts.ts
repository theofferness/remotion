import {loadFont} from '@remotion/fonts';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

const handle = delayRender('Loading Reel fonts');
Promise.all([
	loadFont({family: 'Nunito', url: staticFile('fonts/Nunito.woff2'), weight: '200 1000'}),
	loadFont({family: 'Caveat', url: staticFile('fonts/Caveat.woff2'), weight: '400 700'}),
	loadFont({family: 'Instrument Serif', url: staticFile('fonts/InstrumentSerif-Italic.woff2'), weight: '400', style: 'italic'}),
	loadFont({family: 'Instrument Serif', url: staticFile('fonts/InstrumentSerif-Regular.woff2'), weight: '400', style: 'normal'}),
])
	.then(() => continueRender(handle))
	.catch((err) => cancelRender(err));

export const BOLD = '"Nunito", "Arial Rounded MT Bold", system-ui, sans-serif';
export const ITALIC = '"Instrument Serif", Georgia, serif';
export const HAND = '"Caveat", "Segoe Print", cursive';
