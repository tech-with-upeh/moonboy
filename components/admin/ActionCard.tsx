import Link from "next/link";

export default function ActionCard({
  href,
  title,
  subtitle,
  icon,
  accent,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-1 items-center gap-3.5 border border-line bg-surface px-5 py-4 transition-colors hover:border-ink"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: accent }}
      >
        {icon}
      </span>
      <div>
        <div className="font-ui text-[15px] font-semibold text-ink">{title}</div>
        <div className="font-ui text-[11px] text-ink-soft">{subtitle}</div>
      </div>
    </Link>
  );
}
