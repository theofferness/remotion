// Soft, original sound effects for the chapter Reels → public/audio/reels/
// Run: npm run audio:reels   (needs ffmpeg on PATH)
// Replace any file with your own recording – keep the filename.

import {execFileSync} from 'node:child_process';
import {mkdirSync, unlinkSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const SR = 44100;
const OUT = path.join(import.meta.dirname, '..', 'public', 'audio', 'reels');
mkdirSync(OUT, {recursive: true});

let seed = 11;
const rand = () => {
	seed = (seed * 16807) % 2147483647;
	return seed / 2147483647;
};
const noise = () => rand() * 2 - 1;
const midi = (n) => 440 * 2 ** ((n - 69) / 12);

const lowpass = (arr, cutoffAt) => {
	let y = 0;
	for (let i = 0; i < arr.length; i++) {
		const a = 1 - Math.exp((-2 * Math.PI * cutoffAt(i)) / SR);
		y += a * (arr[i] - y);
		arr[i] = y;
	}
	return arr;
};
const highpass = (arr, cutoff) => {
	const low = lowpass(Float32Array.from(arr), () => cutoff);
	for (let i = 0; i < arr.length; i++) arr[i] -= low[i];
	return arr;
};

const write = (name, L, R = L, peakTarget = 0.7) => {
	const n = L.length;
	let peak = 0;
	for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
	const g = peak > 0 ? peakTarget / peak : 1;
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
		buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4);
		buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4);
	}
	const wav = path.join(OUT, `${name}.wav`);
	writeFileSync(wav, buf);
	execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', wav, '-b:a', '192k', path.join(OUT, `${name}.mp3`)]);
	unlinkSync(wav);
	console.log(`wrote public/audio/reels/${name}.mp3`);
};

// Paper page turn: a soft swish with small crinkles, panning left→right.
const pageTurn = () => {
	const d = 0.9;
	const n = Math.floor(d * SR);
	const a = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const x = i / n;
		const env = Math.sin(Math.PI * Math.min(1, x * 1.15)) ** 2;
		const crinkle = rand() < 0.004 ? 4 : 1;
		a[i] = noise() * env * crinkle;
	}
	lowpass(a, (i) => 900 + 3500 * Math.sin((Math.PI * i) / n));
	highpass(a, 250);
	const L = Float32Array.from(a, (v, i) => v * (1 - 0.5 * (i / n)));
	const R = Float32Array.from(a, (v, i) => v * (0.5 + 0.5 * (i / n)));
	write('page-turn', L, R, 0.6);
};

// Book closing softly: low thump + short paper puff.
const bookClose = () => {
	const d = 0.7;
	const n = Math.floor(d * SR);
	const a = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const t = i / SR;
		const thump = Math.exp(-t * 22) * Math.sin(2 * Math.PI * (70 + 60 * Math.exp(-t * 30)) * t);
		const puff = Math.exp(-t * 14) * noise() * 0.35;
		a[i] = thump + puff;
	}
	lowpass(a, () => 1800);
	write('book-close', a, a, 0.65);
};

// Pencil scratch: bursts of bright, grainy noise like writing a short word.
const pencil = () => {
	const d = 1.3;
	const n = Math.floor(d * SR);
	const a = new Float32Array(n);
	const strokes = [
		[0.0, 0.22],
		[0.27, 0.45],
		[0.5, 0.62],
		[0.68, 0.95],
		[1.0, 1.2],
	];
	for (let i = 0; i < n; i++) {
		const t = i / SR;
		let env = 0;
		for (const [s, e] of strokes) {
			if (t >= s && t <= e) env = Math.sin((Math.PI * (t - s)) / (e - s)) ** 0.6;
		}
		const grain = 0.6 + 0.4 * Math.sin(2 * Math.PI * 38 * t + Math.sin(t * 9));
		a[i] = noise() * env * grain;
	}
	highpass(a, 2500);
	lowpass(a, () => 7000);
	write('pencil', a, a, 0.45);
};

// Gentle chime: two soft bell tones (a fifth apart), long airy decay.
const chime = () => {
	const d = 2.6;
	const n = Math.floor(d * SR);
	const L = new Float32Array(n);
	const R = new Float32Array(n);
	const tones = [
		[midi(79), 0, 1],
		[midi(86), 0.12, 0.6],
	];
	for (let i = 0; i < n; i++) {
		const t = i / SR;
		let l = 0;
		let r = 0;
		for (const [f, delay, amp] of tones) {
			const tt = t - delay;
			if (tt < 0) continue;
			const env = Math.exp(-tt * 1.8) * Math.min(1, tt * 300);
			const v =
				amp *
				env *
				(Math.sin(2 * Math.PI * f * tt) +
					0.3 * Math.sin(2 * Math.PI * f * 2.01 * tt) * Math.exp(-tt * 3) +
					0.12 * Math.sin(2 * Math.PI * f * 3.98 * tt) * Math.exp(-tt * 5));
			l += v * (delay === 0 ? 1 : 0.6);
			r += v * (delay === 0 ? 0.6 : 1);
		}
		L[i] = l;
		R[i] = r;
	}
	write('chime', L, R, 0.5);
};

// Air: a slow, quiet breathy swell for camera moves / zoom-throughs.
const air = () => {
	const d = 1.6;
	const n = Math.floor(d * SR);
	const a = new Float32Array(n);
	for (let i = 0; i < n; i++) a[i] = noise() * Math.sin((Math.PI * i) / n) ** 2;
	lowpass(a, (i) => 400 + 1600 * Math.sin((Math.PI * i) / n));
	write('air', a, Float32Array.from(a).reverse(), 0.35);
};

// Pop: tiny soft "tick" for tags appearing.
const pop = () => {
	const d = 0.15;
	const n = Math.floor(d * SR);
	const a = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const t = i / SR;
		a[i] = Math.exp(-t * 40) * Math.sin(2 * Math.PI * (880 + 500 * Math.exp(-t * 50)) * t);
	}
	write('pop', a, a, 0.35);
};

pageTurn();
bookClose();
pencil();
chime();
air();
pop();
