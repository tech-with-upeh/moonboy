const PALETTE = ["#E8B04B", "#7C8FE0", "#D68FA0", "#8FBFA8"];

function colorFor(name: string) {
  const sum = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

export default function Avatar({
  name,
  initials,
  size = 36,
}: {
  name: string;
  initials: string;
  size?: number;
}) {
  const bg = colorFor(name);
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border border-ink/70"
      style={{ width: size, height: size, backgroundColor: bg }}
      aria-hidden
    >
      <span
        className="font-ui font-semibold text-ink"
        style={{ fontSize: size * 0.36 }}
      >
        {initials}
      </span>
    </div>
  );
}
