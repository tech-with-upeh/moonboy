// A hand-drawn-style dragonfly, echoing the illustration used above the
// masthead on the reference site — original artwork, not a reproduction.

export default function DragonflyMark({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} role="img" aria-label="A dragonfly">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* wings */}
        <path
          d="M100 60c-14-28-46-40-66-34-9 3-11 14-4 21 10 10 26 14 40 15"
          fill="#EFE6C8"
          stroke="#5B6B4F"
          strokeWidth="1.6"
        />
        <path
          d="M100 60c14-28 46-40 66-34 9 3 11 14 4 21-10 10-26 14-40 15"
          fill="#EFE6C8"
          stroke="#5B6B4F"
          strokeWidth="1.6"
        />
        <path
          d="M104 70c-10-16-36-24-52-19-7 2-8 11-2 16 8 7 21 10 32 10"
          fill="#EFE6C8"
          stroke="#5B6B4F"
          strokeWidth="1.4"
        />
        <path
          d="M104 70c10-16 36-24 52-19 7 2 8 11 2 16-8 7-21 10-32 10"
          fill="#EFE6C8"
          stroke="#5B6B4F"
          strokeWidth="1.4"
        />
        {/* wing tips */}
        <path d="M34 26c-2 6 1 12 8 13" stroke="#2F6F6B" strokeWidth="3" />
        <path d="M166 26c2 6-1 12-8 13" stroke="#2F6F6B" strokeWidth="3" />
        <path d="M52 51c-2 5 1 10 7 11" stroke="#2F6F6B" strokeWidth="2.5" />
        <path d="M148 51c2 5-1 10-7 11" stroke="#2F6F6B" strokeWidth="2.5" />

        {/* body */}
        <path
          d="M100 48v92"
          stroke="#5B6B4F"
          strokeWidth="4.5"
        />
        <ellipse cx="100" cy="44" rx="6.5" ry="7" fill="#5B6B4F" />
        {/* tail segments */}
        <path d="M100 62v10M100 78v10M100 94v10M100 110v10M100 126v10" stroke="#EFE6C8" strokeWidth="3" />
      </g>
    </svg>
  );
}
