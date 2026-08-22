import type { CoverVariant } from "@/lib/posts";

const NAVY = "#1A1A2E";
const CREAM = "#F3EEDD";
const PERI = "#C9D6F7";
const LAVENDER = "#B9A8D9";
const SAGE = "#8FBFA8";
const BLUSH = "#D68FA0";
const GOLD = "#E8B04B";
const OLIVE = "#5B6B4F";
const DUSTY = "#7C8FE0";

function Botanical() {
  const bunches = [
    { x: 70, tilt: -8 },
    { x: 140, tilt: 4 },
    { x: 210, tilt: -3 },
    { x: 280, tilt: 7 },
    { x: 340, tilt: -6 },
  ];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <rect width="400" height="300" fill={CREAM} />
      {bunches.map((b, i) => (
        <g key={i} transform={`translate(${b.x} 260) rotate(${b.tilt})`}>
          <line x1="0" y1="0" x2="0" y2="-90" stroke={OLIVE} strokeWidth="3" />
          {Array.from({ length: 6 }).map((_, j) => (
            <ellipse
              key={j}
              cx={(j % 2 === 0 ? -6 : 6)}
              cy={-95 - j * 9}
              rx="6"
              ry="4"
              fill={LAVENDER}
              opacity={0.9}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

function Handwritten() {
  const lines = [70, 105, 140, 175, 210];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <rect width="400" height="300" fill={CREAM} />
      {lines.map((y, i) => (
        <path
          key={i}
          d={`M40,${y} Q90,${y - 10} 140,${y} T240,${y} T340,${y}`}
          fill="none"
          stroke={NAVY}
          strokeWidth={i === 2 ? "3" : "2"}
          opacity={0.75 - i * 0.08}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function Moonlight() {
  const stars = [
    [60, 50], [320, 40], [90, 120], [340, 150], [50, 200],
    [300, 220], [200, 60], [150, 240], [370, 90],
  ];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <rect width="400" height="300" fill={NAVY} />
      {stars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.5 : 1.6} fill={CREAM} opacity={0.85} />
      ))}
      <circle cx="230" cy="150" r="55" fill={CREAM} />
      <circle cx="255" cy="135" r="55" fill={NAVY} />
    </svg>
  );
}

function Polaroid() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <rect width="400" height="300" fill={PERI} />
      <g transform="rotate(-4 200 150)">
        <rect x="110" y="55" width="180" height="200" fill={CREAM} stroke={NAVY} strokeWidth="1.5" />
        <rect x="124" y="68" width="152" height="130" fill={DUSTY} opacity="0.55" />
        <rect x="124" y="68" width="152" height="130" fill={LAVENDER} opacity="0.35" />
      </g>
      <rect x="150" y="30" width="70" height="24" fill={BLUSH} opacity="0.8" transform="rotate(-6 185 42)" />
    </svg>
  );
}

function Vinyl() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <rect width="400" height="300" fill={CREAM} />
      <circle cx="200" cy="150" r="110" fill={NAVY} />
      {[92, 74, 56].map((r, i) => (
        <circle key={i} cx="200" cy="150" r={r} fill="none" stroke={CREAM} strokeWidth="1" opacity="0.3" />
      ))}
      <circle cx="200" cy="150" r="38" fill={GOLD} />
      <circle cx="200" cy="150" r="6" fill={NAVY} />
    </svg>
  );
}

function Linen() {
  const rows = 16;
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <rect width="400" height="300" fill={PERI} />
      {Array.from({ length: rows }).map((_, i) => (
        <line
          key={i}
          x1="0"
          y1={i * 20}
          x2="400"
          y2={i * 20 - 40}
          stroke={CREAM}
          strokeWidth="6"
          opacity="0.35"
        />
      ))}
    </svg>
  );
}

function Wildflower() {
  const flowers = [
    { x: 60, y: 220, color: BLUSH },
    { x: 130, y: 180, color: LAVENDER },
    { x: 200, y: 230, color: GOLD },
    { x: 270, y: 170, color: BLUSH },
    { x: 330, y: 210, color: LAVENDER },
    { x: 100, y: 260, color: GOLD },
  ];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <rect width="400" height="300" fill={CREAM} />
      {flowers.map((f, i) => (
        <g key={i}>
          <line x1={f.x} y1={f.y} x2={f.x} y2={f.y + 60} stroke={OLIVE} strokeWidth="2.5" />
          {Array.from({ length: 5 }).map((_, j) => {
            const angle = (j / 5) * Math.PI * 2;
            return (
              <ellipse
                key={j}
                cx={f.x + Math.cos(angle) * 9}
                cy={f.y + Math.sin(angle) * 9}
                rx="6"
                ry="4"
                fill={f.color}
                transform={`rotate(${(angle * 180) / Math.PI} ${f.x + Math.cos(angle) * 9} ${
                  f.y + Math.sin(angle) * 9
                })`}
              />
            );
          })}
          <circle cx={f.x} cy={f.y} r="4" fill={GOLD} />
        </g>
      ))}
    </svg>
  );
}

function Dusk() {
  const bands = [
    { y: 0, color: DUSTY },
    { y: 60, color: PERI },
    { y: 130, color: LAVENDER },
    { y: 190, color: BLUSH },
    { y: 240, color: NAVY },
  ];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      {bands.map((b, i) => (
        <rect key={i} x="0" y={b.y} width="400" height="70" fill={b.color} />
      ))}
      <circle cx="200" cy="150" r="34" fill={GOLD} opacity="0.9" />
    </svg>
  );
}

const VARIANTS: Record<CoverVariant, () => JSX.Element> = {
  botanical: Botanical,
  handwritten: Handwritten,
  moonlight: Moonlight,
  polaroid: Polaroid,
  vinyl: Vinyl,
  linen: Linen,
  wildflower: Wildflower,
  dusk: Dusk,
};

export default function Cover({ variant }: { variant: CoverVariant }) {
  const Variant = VARIANTS[variant];
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line">
      <Variant />
    </div>
  );
}
