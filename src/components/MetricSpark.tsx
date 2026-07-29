'use client';

/**
 * MetricSpark — enquiries sparkline for the featured case study.
 *
 * Hand-rolled SVG (viewBox-based, no DOM measurement). Recharts'
 * ResponsiveContainer measures its parent at mount and renders at -1px on the
 * server / inside GSAP-hidden containers — a runtime warning and a hydration
 * liability. Eight data points don't need a charting library; they need a path.
 */
const DATA = [12, 14, 13, 19, 24, 31, 29, 38];

const W = 200;
const H = 58;
const PAD = 4;

const max = Math.max(...DATA);
const min = Math.min(...DATA);

const pts = DATA.map((v, i) => {
  const x = PAD + (i / (DATA.length - 1)) * (W - PAD * 2);
  const y = H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
  return [x, y] as const;
});

/** Catmull-Rom → cubic bezier for a smooth line */
function smoothPath(points: readonly (readonly [number, number])[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

const line = smoothPath(pts);
const area = `${line} L ${pts[pts.length - 1][0]},${H} L ${pts[0][0]},${H} Z`;
const last = pts[pts.length - 1];

export default function MetricSpark() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF4D1C" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#FF4D1C" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkFill)" />
      <path
        d={line}
        fill="none"
        stroke="#FF4D1C"
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last[0]} cy={last[1]} r={3} fill="#FF4D1C" />
      <circle cx={last[0]} cy={last[1]} r={6.5} fill="none" stroke="#FF4D1C" strokeOpacity={0.35} />
    </svg>
  );
}
