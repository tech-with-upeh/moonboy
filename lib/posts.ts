export type CoverVariant =
  | "botanical"
  | "handwritten"
  | "moonlight"
  | "polaroid"
  | "vinyl"
  | "linen"
  | "wildflower"
  | "dusk";

export type Category = "musings" | "thoughts" | "poetry" | "stories" | "playlists";

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "musings", label: "musings" },
  { slug: "thoughts", label: "thoughts" },
  { slug: "poetry", label: "poetry" },
  { slug: "stories", label: "stories" },
  { slug: "playlists", label: "playlists" },
];

export interface Author {
  name: string;
  initials: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  cover: CoverVariant;
  category: Category;
  date: string; // ISO date
  readTime: number; // minutes
  author: Author;
  favorite?: boolean;
}

const MOONBOY: Author = { name: "Moonboy", initials: "MB" };

export const posts: Post[] = [
  {
    slug: "on-slow-mornings-and-lavender-bunches",
    title: "On slow mornings and lavender bunches",
    excerpt: "The market stall, the window light, and why I keep buying more than I need.",
    cover: "botanical",
    category: "musings",
    date: "2026-07-28",
    readTime: 4,
    author: MOONBOY,
    favorite: true,
  },
  {
    slug: "what-ive-been-turning-over-lately",
    title: "What I've been turning over lately",
    excerpt: "A few half-finished thoughts I didn't want to lose.",
    cover: "handwritten",
    category: "thoughts",
    date: "2026-07-14",
    readTime: 5,
    author: MOONBOY,
    favorite: true,
  },
  {
    slug: "a-poem-for-the-space-between-phases",
    title: "A poem for the space between phases",
    excerpt: "Written on a night the moon was somewhere between new and full.",
    cover: "moonlight",
    category: "poetry",
    date: "2026-06-30",
    readTime: 2,
    author: MOONBOY,
    favorite: true,
  },
  {
    slug: "the-summer-we-chased-fireflies",
    title: "The summer we chased fireflies",
    excerpt: "A story about staying out past when we were supposed to.",
    cover: "polaroid",
    category: "stories",
    date: "2026-06-11",
    readTime: 6,
    author: MOONBOY,
  },
  {
    slug: "songs-for-late-night-drives",
    title: "Songs for late-night drives",
    excerpt: "A playlist for empty roads and open windows.",
    cover: "vinyl",
    category: "playlists",
    date: "2026-05-22",
    readTime: 3,
    author: MOONBOY,
  },
  {
    slug: "the-quiet-parts-of-the-day",
    title: "The quiet parts of the day",
    excerpt: "In defense of doing absolutely nothing for a little while.",
    cover: "linen",
    category: "musings",
    date: "2026-05-05",
    readTime: 4,
    author: MOONBOY,
  },
  {
    slug: "a-letter-i-never-sent",
    title: "A letter I never sent",
    excerpt: "Some things are better written than said.",
    cover: "wildflower",
    category: "stories",
    date: "2026-04-19",
    readTime: 5,
    author: MOONBOY,
  },
  {
    slug: "learning-to-sit-with-uncertainty",
    title: "Learning to sit with uncertainty",
    excerpt: "Notes on not needing to have it all figured out yet.",
    cover: "dusk",
    category: "thoughts",
    date: "2026-04-02",
    readTime: 6,
    author: MOONBOY,
  },
];
