export type Point = readonly [number, number];

/** Total length of a polyline. */
const segmentLengths = (points: readonly Point[]) =>
	points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));

/**
 * Returns the partial SVG path of a polyline drawn up to `progress` (0–1),
 * plus the point at the drawing head – handy for a glowing "pen" dot.
 */
export const partialPolyline = (points: readonly Point[], progress: number) => {
	const lengths = segmentLengths(points);
	const total = lengths.reduce((a, b) => a + b, 0);
	let remaining = Math.max(0, Math.min(1, progress)) * total;
	let d = `M ${points[0][0]} ${points[0][1]}`;
	let head: Point = points[0];
	for (let i = 0; i < lengths.length; i++) {
		const [ax, ay] = points[i];
		const [bx, by] = points[i + 1];
		if (remaining >= lengths[i]) {
			d += ` L ${bx} ${by}`;
			head = points[i + 1];
			remaining -= lengths[i];
			continue;
		}
		const t = lengths[i] === 0 ? 0 : remaining / lengths[i];
		head = [ax + (bx - ax) * t, ay + (by - ay) * t];
		d += ` L ${head[0]} ${head[1]}`;
		break;
	}
	return {d, head};
};

/** Deterministic pseudo-random number in [0, 1) for a given seed. */
export const seeded = (seed: number) => {
	const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
	return x - Math.floor(x);
};
