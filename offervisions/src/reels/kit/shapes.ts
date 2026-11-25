export type Pt = readonly [number, number];

/** Resample a polyline to exactly `n` points spaced evenly along its length. */
export const resample = (pts: readonly Pt[], n: number): Pt[] => {
	const seg: number[] = [];
	let total = 0;
	for (let i = 1; i < pts.length; i++) {
		const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
		seg.push(l);
		total += l;
	}
	const out: Pt[] = [];
	let si = 0;
	let acc = 0;
	for (let k = 0; k < n; k++) {
		const target = (k / (n - 1)) * total;
		while (si < seg.length - 1 && acc + seg[si] < target) {
			acc += seg[si];
			si++;
		}
		const t = seg[si] === 0 ? 0 : (target - acc) / seg[si];
		const a = pts[si];
		const b = pts[si + 1] ?? a;
		out.push([a[0] + (b[0] - a[0]) * Math.min(1, t), a[1] + (b[1] - a[1]) * Math.min(1, t)]);
	}
	return out;
};

export const lerpPts = (a: readonly Pt[], b: readonly Pt[], t: number): Pt[] =>
	a.map((p, i) => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t]);

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
export const smoothPath = (pts: readonly Pt[], tension = 0.5) => {
	if (pts.length < 2) return '';
	let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
	for (let i = 0; i < pts.length - 1; i++) {
		const p0 = pts[i - 1] ?? pts[i];
		const p1 = pts[i];
		const p2 = pts[i + 1];
		const p3 = pts[i + 2] ?? p2;
		const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2;
		const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2;
		const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2;
		const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2;
		d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
	}
	return d;
};
