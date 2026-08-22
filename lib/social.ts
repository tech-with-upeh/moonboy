export interface Comment {
  id: string;
  name: string;
  initials: string;
  date: string; // ISO date
  body: string;
}

interface SeedEntry {
  likes: number;
  comments: Comment[];
}

const SEED: Record<string, SeedEntry> = {
  "on-slow-mornings-and-lavender-bunches": {
    likes: 42,
    comments: [
      {
        id: "c1",
        name: "Priya",
        initials: "P",
        date: "2026-07-29",
        body: "This made me want to slow down my whole morning routine.",
      },
      {
        id: "c2",
        name: "Dele",
        initials: "D",
        date: "2026-07-30",
        body: "Which market stall?? I need to know.",
      },
    ],
  },
  "what-ive-been-turning-over-lately": {
    likes: 31,
    comments: [
      {
        id: "c1",
        name: "Sam",
        initials: "S",
        date: "2026-07-15",
        body: "Needed to read this today, thank you.",
      },
    ],
  },
  "a-poem-for-the-space-between-phases": {
    likes: 58,
    comments: [
      {
        id: "c1",
        name: "Grace",
        initials: "G",
        date: "2026-07-01",
        body: "The last line stopped me completely.",
      },
      {
        id: "c2",
        name: "Marcus",
        initials: "M",
        date: "2026-07-02",
        body: "Reading this one again before bed.",
      },
    ],
  },
  "the-summer-we-chased-fireflies": {
    likes: 27,
    comments: [
      {
        id: "c1",
        name: "Ifeoma",
        initials: "I",
        date: "2026-06-12",
        body: "This brought back so many memories of my own summers.",
      },
    ],
  },
  "songs-for-late-night-drives": {
    likes: 35,
    comments: [],
  },
  "the-quiet-parts-of-the-day": {
    likes: 22,
    comments: [
      {
        id: "c1",
        name: "Tunde",
        initials: "T",
        date: "2026-05-06",
        body: "Saving this for the next time I feel guilty about resting.",
      },
    ],
  },
  "a-letter-i-never-sent": {
    likes: 19,
    comments: [],
  },
  "learning-to-sit-with-uncertainty": {
    likes: 33,
    comments: [
      {
        id: "c1",
        name: "Chidi",
        initials: "C",
        date: "2026-04-03",
        body: "Exactly where I am right now. Thank you for this.",
      },
      {
        id: "c2",
        name: "Naomi",
        initials: "N",
        date: "2026-04-04",
        body: "Bookmarking this for whenever I need the reminder.",
      },
    ],
  },
};

const FALLBACK: SeedEntry = { likes: 0, comments: [] };

export function seedFor(slug: string): SeedEntry {
  return SEED[slug] ?? FALLBACK;
}
