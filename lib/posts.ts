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
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: CoverVariant | null;
  coverUrl: string | null;
  category: Category;
  date: string;
  readTime: number;
  author: Author;
  favorite: boolean;
  published: boolean;
}

export function toPost(row: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string | null;
  coverUrl: string | null;
  category: string;
  date: Date;
  readTime: number;
  authorName: string;
  authorInitials: string;
  favorite: boolean;
  published: boolean;
}): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    cover: row.cover as CoverVariant | null,
    coverUrl: row.coverUrl,
    category: row.category as Category,
    date: row.date.toISOString(),
    readTime: row.readTime,
    author: { name: row.authorName, initials: row.authorInitials },
    favorite: row.favorite,
    published: row.published,
  };
}
