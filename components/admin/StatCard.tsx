export default function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border border-line bg-surface px-5 py-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-sky">
        {icon}
      </span>
      <div>
        <div className="font-ui text-2xl font-bold text-ink">{value}</div>
        <div className="font-ui text-[11px] uppercase tracking-[0.1em] text-ink-soft">
          {label}
        </div>
      </div>
    </div>
  );
}
