interface Segment {
  label: string;
  value: number;
  color: string;
}

export default function Donut({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: Segment[];
  centerLabel: string;
  centerValue: string | number;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = 70;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const arcs = segments.map((segment) => {
    const fraction = segment.value / total;
    const dash = fraction * circumference;
    const arc = {
      ...segment,
      dasharray: `${dash} ${circumference - dash}`,
      dashoffset: -offset,
    };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <svg viewBox="0 0 200 200" className="h-40 w-40 shrink-0 -rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#E4E1D6" strokeWidth={strokeWidth} />
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={arc.dasharray}
            strokeDashoffset={arc.dashoffset}
          />
        ))}
      </svg>

      <div className="flex flex-col items-center sm:items-start">
        <div className="text-center sm:text-left">
          <div className="font-ui text-3xl font-bold text-ink">{centerValue}</div>
          <div className="font-ui text-[11px] uppercase tracking-[0.1em] text-ink-soft">
            {centerLabel}
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {segments.map((segment) => (
            <li key={segment.label} className="flex items-center gap-2 font-ui text-[12px] text-ink-soft">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              {segment.label} — {segment.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
