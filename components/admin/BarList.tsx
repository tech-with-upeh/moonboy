interface BarItem {
  label: string;
  value: number;
  href?: string;
}

export default function BarList({
  items,
  color,
}: {
  items: BarItem[];
  color: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="truncate font-body text-[13px] text-ink">{item.label}</span>
            <span className="shrink-0 font-ui text-[12px] text-ink-soft">{item.value}</span>
          </div>
          <div className="h-2 w-full bg-line">
            <div
              className="h-2"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
