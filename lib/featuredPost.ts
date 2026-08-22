export interface FeaturedPost {
  photo: string | null;
  title: string;
  text: string;
  link: string;
}

export const FEATURED_POST_KEY = "moonboy-featured-post";

export const DEFAULT_FEATURED_POST: FeaturedPost = {
  photo: null,
  title: "Blue Almonds",
  text: "A little corner for the music I want to share on the blog — songs, playlists, and sounds worth lingering over.",
  link: "",
};
