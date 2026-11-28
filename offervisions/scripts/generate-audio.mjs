// Generates the original placeholder music bed + sound effects into public/audio/.
// Run: npm run audio   (requires ffmpeg on PATH for the mp3 conversion)
// You can replace any of the generated files with your own audio – keep the
// filenames, or point src/config.ts at new ones.

import {execFileSync} from 'node:child_process';
import {mkdirSync, unlinkSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const SR = 44100;
const OUT = path.join(import.meta.dirname, '..', 'public', 'audio');
mkdirSync(OUT, {recursive: true});

// ---------- helpers ----------
const midi = (n) => 440 * 2 ** ((n - 69) / 12);
let seed = 7;
const rand = () => {
	seed = (seed * 16807) % 2147483647;
	return seed / 2147483647;
};

const writeWav = (name, left, right = left) => {
	const n = left.length;
	const buf = Buffer.alloc(44 + n * 4);
	buf.write('RIFF', 0);
	buf.writeUInt32LE(36 + n * 4, 4);
	buf.write('WAVE', 8);
	buf.write('fmt ', 12);
	buf.writeUInt32LE(16, 16);
	buf.writeUInt16LE(1, 20);
	buf.writeUInt16LE(2, 22);
	buf.writeUInt32LE(SR, 24);
	buf.writeUInt32LE(SR * 4, 28);
	buf.writeUInt16LE(4, 32);
	buf.writeUInt16LE(16, 34);
	buf.write('data', 36);
	buf.writeUInt32LE(n * 4, 40);
	let peak = 0;
	for (let i = 0; i < n; i++) {
		peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
	}
	const norm = peak > 0.98 ? 0.98 / peak : 1;
	for (let i = 0; i < n; i++) {
		buf.writeInt16LE(Math.round(left[i] * norm * 32767), 44 + i * 4);
		buf.writeInt16LE(Math.round(right[i] * norm * 32767), 46 + i * 4);
	}
	const wav = path.join(OUT, `${name}.wav`);
	writeFileSync(wav, buf);
	execFileSync('ffmpeg', [
		'-y',
		'-v',
		'error',
		'-i',
		wav,
		'-b:a',
		'192k',
		path.join(OUT, `${name}.mp3`),
	]);
	unlinkSync(wav);
	console.log(`wrote public/audio/${name}.mp3`);
};

// One-pole low-pass, used to soften noise and pads.
const lowpass = (arr, cutoffAt) => {
	let y = 0;
	for (let i = 0; i < arr.length; i++) {
		const c = cutoffAt(i);
		const a = 1 - Math.exp((-2 * Math.PI * c) / SR);
		y += a * (arr[i] - y);
		arr[i] = y;
	}
	return arr;
};

// ---------- music bed (32s, 96 BPM, A minor) ----------
const music = () => {
	const dur = 32;
	const n = dur * SR;
	const L = new Float32Array(n);
	const R = new Float32Array(n);
	const bpm = 96;
	const beat = 60 / bpm;
	const bar = beat * 4;
	// Am – F – C – G, voiced as warm triads + 7ths
	const chords = [
		[57, 60, 64, 67],
		[53, 57, 60, 64],
		[48, 55, 60, 64],
		[55, 59, 62, 67],
	];
	const roots = [45, 41, 48, 43];
	const buildAt = 20.5; // energy lift for the "vision" + CTA section

	for (let i = 0; i < n; i++) {
		const t = i / SR;
		const barIdx = Math.floor(t / bar) % 4;
		const inBar = (t % bar) / bar;
		const chord = chords[barIdx];
		const lift = t > buildAt ? Math.min(1, (t - buildAt) / 1.5) : 0;
		// Pad: detuned saws approximated by a few harmonics, slow swell per bar
		const swell = 0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, inBar * 1.1));
		let padL = 0;
		let padR = 0;
		for (const note of chord) {
			const f = midi(note);
			for (let h = 1; h <= 4; h++) {
				const amp = 1 / (h * h * 1.6);
				padL += amp * Math.sin(2 * Math.PI * f * h * t * 1.0015);
				padR += amp * Math.sin(2 * Math.PI * f * h * t * 0.9985 + 0.7);
			}
		}
		padL *= 0.05 * swell * (1 + 0.4 * lift);
		padR *= 0.05 * swell * (1 + 0.4 * lift);

		// Sub bass on the root
		const subEnv = Math.min(1, inBar * 20) * (1 - inBar * 0.4);
		const sub = 0.16 * subEnv * Math.sin(2 * Math.PI * midi(roots[barIdx] - 12) * t);

		// Kick on every beat after the intro (fades in 2s → 4s)
		const kickGain = Math.min(1, Math.max(0, (t - 2) / 2));
		const tb = t % beat;
		const kick =
			kickGain *
			0.55 *
			Math.exp(-tb * 14) *
			Math.sin(2 * Math.PI * (48 + 110 * Math.exp(-tb * 40)) * tb);

		// Arp pluck: 8th notes over chord tones, brighter after the lift
		const eighth = beat / 2;
		const step = Math.floor(t / eighth);
		const te = t % eighth;
		const arpNote = chord[(step * 3) % chord.length] + 12 + (lift > 0 && step % 4 === 3 ? 12 : 0);
		const arpGain = Math.min(1, Math.max(0, (t - 4) / 3)) * (0.5 + 0.5 * lift);
		const pluck = arpGain * 0.07 * Math.exp(-te * 9) * Math.sin(2 * Math.PI * midi(arpNote) * t);

		L[i] = padL + sub + kick + pluck * 0.8;
		R[i] = padR + sub + kick + pluck * 1.2;
	}

	// Hats: filtered noise on off-beats after 8s
	const hat = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const t = i / SR;
		const off = (t + beat / 2) % beat;
		const g = t > 8 ? 0.05 + (t > buildAt ? 0.03 : 0) : 0;
		hat[i] = g * Math.exp(-off * 60) * (rand() * 2 - 1);
	}
	// crude high-pass = noise minus its low-passed self
	const hatLow = lowpass(Float32Array.from(hat), () => 4000);
	for (let i = 0; i < n; i++) {
		L[i] += hat[i] - hatLow[i];
		R[i] += hat[i] - hatLow[i];
	}

	// Master fade in/out
	for (let i = 0; i < n; i++) {
		const t = i / SR;
		const g = Math.min(1, t / 1.2) * Math.min(1, (dur - t) / 2);
		L[i] *= g;
		R[i] *= g;
	}
	writeWav('music', L, R);
};

// ---------- sound effects ----------
const whoosh = () => {
	const d = 0.7;
	const n = Math.floor(d * SR);
	const a = new Float32Array(n);
	for (let i = 0; i < n; i++) a[i] = rand() * 2 - 1;
	lowpass(a, (i) => 300 + 5000 * Math.sin((Math.PI * i) / n) ** 2);
	for (let i = 0; i < n; i++) {
		const x = i / n;
		a[i] *= Math.sin(Math.PI * x) ** 1.5 * 1.6;
	}
	const L = Float32Array.from(a, (v, i) => v * (1 - (0.6 * i) / n));
	const R = Float32Array.from(a, (v, i) => v * (0.4 + (0.6 * i) / n));
	writeWav('whoosh', L, R);
};

const pop = () => {
	const d = 0.18;
	const n = Math.floor(d * SR);
	const a = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const t = i / SR;
		a[i] = 0.7 * Math.exp(-t * 28) * Math.sin(2 * Math.PI * (500 + 900 * Math.exp(-t * 35)) * t);
	}
	writeWav('pop', a);
};

const ding = () => {
	const d = 1.8;
	const n = Math.floor(d * SR);
	const a = new Float32Array(n);
	const partials = [
		[1, 1],
		[2.76, 0.45],
		[5.4, 0.25],
		[8.93, 0.12],
	];
	for (let i = 0; i < n; i++) {
		const t = i / SR;
		let v = 0;
		for (const [m, amp] of partials) {
			v += amp * Math.exp(-t * (2.2 + m)) * Math.sin(2 * Math.PI * midi(81) * m * t);
		}
		a[i] = 0.45 * v * Math.min(1, t * 400);
	}
	writeWav('ding', a);
};

const click = () => {
	const d = 0.08;
	const n = Math.floor(d * SR);
	const a = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const t = i / SR;
		a[i] = 0.8 * Math.exp(-t * 120) * ((rand() * 2 - 1) * 0.5 + Math.sin(2 * Math.PI * 2200 * t));
	}
	writeWav('click', a);
};

const riser = () => {
	const d = 1.6;
	const n = Math.floor(d * SR);
	const a = new Float32Array(n);
	for (let i = 0; i < n; i++) a[i] = rand() * 2 - 1;
	lowpass(a, (i) => 200 + 7000 * (i / n) ** 2);
	for (let i = 0; i < n; i++) {
		const x = i / n;
		const t = i / SR;
		a[i] = a[i] * x ** 2 * 1.2 + 0.08 * x * Math.sin(2 * Math.PI * (220 + 660 * x * x) * t);
	}
	writeWav('riser', a);
};

music();
whoosh();
pop();
ding();
click();
riser();
