// Original ambient bed for the 2027 title sequences → public/audio/2027/ambient.mp3
// Slow, warm, beatless: an evolving A-minor(add9) pad with a soft sub and air.
// Run: node scripts/generate-ambient.mjs   (needs ffmpeg). Replace with a licensed track any time.
import {execFileSync} from 'node:child_process';
import {mkdirSync, unlinkSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const SR = 44100;
const DUR = 75;
const OUT = path.join(import.meta.dirname, '..', 'public', 'audio', '2027');
mkdirSync(OUT, {recursive: true});
const midi = (n) => 440 * 2 ** ((n - 69) / 12);
let seed = 3;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

const n = DUR * SR;
const L = new Float32Array(n);
const R = new Float32Array(n);
// two chords that slowly cross-fade (Am(add9) → Fmaj7(#11)), each voice with its own slow swell
const chords = [
	[45, 52, 59, 60, 64, 71],
	[41, 48, 55, 57, 64, 71],
];
const cycle = 16; // seconds per chord
let lp = 0;
let lp2 = 0;
for (let i = 0; i < n; i++) {
	const t = i / SR;
	const phase = (t / cycle) % 2;
	const mix = 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, phase < 1 ? phase : 2 - phase));
	let l = 0;
	let r = 0;
	chords.forEach((ch, ci) => {
		const w = ci === 0 ? 1 - mix : mix;
		ch.forEach((note, k) => {
			const f = midi(note);
			const swell = 0.55 + 0.45 * Math.sin((2 * Math.PI * t) / (9 + k * 2.3) + k);
			const amp = (w * swell) / (1 + k * 0.5);
			l += amp * (Math.sin(2 * Math.PI * f * t * 1.002) + 0.25 * Math.sin(4 * Math.PI * f * t));
			r += amp * (Math.sin(2 * Math.PI * f * t * 0.998 + 0.6) + 0.25 * Math.sin(4 * Math.PI * f * t + 0.3));
		});
	});
	const sub = 0.5 * Math.sin(2 * Math.PI * midi(33) * t) * (0.6 + 0.4 * Math.sin((2 * Math.PI * t) / 11));
	// breathy air: low-passed noise
	lp += 0.02 * (rand() - lp);
	lp2 += 0.3 * (lp - lp2);
	L[i] = 0.06 * l + 0.05 * sub + 0.5 * lp2;
	R[i] = 0.06 * r + 0.05 * sub + 0.5 * lp2;
}
// gentle global fades
for (let i = 0; i < n; i++) {
	const t = i / SR;
	const g = Math.min(1, t / 2.5) * Math.min(1, (DUR - t) / 4);
	L[i] *= g;
	R[i] *= g;
}
let peak = 0;
for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const k = 0.5 / peak;
const buf = Buffer.alloc(44 + n * 4);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + n * 4, 4);
buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write('data', 36);
buf.writeUInt32LE(n * 4, 40);
for (let i = 0; i < n; i++) {
	buf.writeInt16LE(Math.round(L[i] * k * 32767), 44 + i * 4);
	buf.writeInt16LE(Math.round(R[i] * k * 32767), 46 + i * 4);
}
const wav = path.join(OUT, 'ambient.wav');
writeFileSync(wav, buf);
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', wav, '-b:a', '192k', path.join(OUT, 'ambient.mp3')]);
unlinkSync(wav);
console.log('wrote public/audio/2027/ambient.mp3');
