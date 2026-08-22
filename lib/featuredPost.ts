export interface FeaturedPost {
  photo: string | null; // data URL, uploaded from /admin
  title: string;
  text: string;
}

export const FEATURED_POST_KEY = "moonboy-featured-post";

export const DEFAULT_FEATURED_POST: FeaturedPost = {
  photo: null,
  title: "About this newsletter",
  text: "Moonboy Newsletter is a little corner of the internet for musings, thoughts, poetry, stories, and playlists — written slow, mostly at night, and shared because keeping it all to myself stopped feeling right. Thanks for stopping by.",
};
