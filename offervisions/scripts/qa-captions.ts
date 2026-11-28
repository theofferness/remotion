// Prints caption blocks + per-scene pace for a Reel's scene list.
// Usage: npx tsx scripts/qa-captions.ts
import {buildCaptions, wpm} from '../src/reels/kit/Captions';
import {VIDEO1, VIDEO2, VIDEO3} from '../src/reels/ch00/chapter';

const FPS = 30;
const lists: Record<string, {id: string; sec: number; vo: string; small?: string; big?: string}[]> = {
	'ch00 v1 master': VIDEO1.scenes,
	'ch00 v1 15s': VIDEO1.cut15,
	'ch00 v2 main': VIDEO2.scenes,
	'ch00 v2 30s': VIDEO2.cut30,
	'ch00 v2 15s': VIDEO2.cut15,
	'ch00 v3 30s': VIDEO3.scenes,
	'ch00 v3 15s': VIDEO3.cut15,
};

for (const [name, scenes] of Object.entries(lists)) {
	let t = 0;
	const tl = scenes.map((s) => {
		const out = {...s, start: t, dur: Math.round(s.sec * FPS)};
		t += out.dur;
		return out;
	});
	const total = tl.reduce((a, s) => a + s.sec, 0);
	const words = tl.reduce((a, s) => a + s.vo.split(/\s+/).filter(Boolean).length, 0);
	console.log(`\n=== ${name}: ${total.toFixed(1)} s, ${words} words, ${((words / total) * 60).toFixed(0)} wpm overall`);
	for (const s of tl) {
		const w = wpm(s.vo, s.sec - 0.35);
		console.log(`  ${s.id.padEnd(10)} ${s.sec.toFixed(1)}s  ${w.toFixed(0).padStart(3)} wpm ${w > 175 ? '⚠ fast' : ''}`);
	}
	for (const b of buildCaptions(tl, FPS)) {
		const n = b.words.length;
		const flag = n < 2 || n > 5 ? '⚠' : ' ';
		console.log(`   ${flag} ${String(b.from).padStart(4)}–${String(b.to).padEnd(4)} ${b.hidden ? '(on screen) ' : ''}${b.words.map((w) => (w.emph ? w.text.toUpperCase() : w.text)).join(' ')}`);
	}
}
