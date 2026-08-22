# Moonboy Newsletter

A responsive personal blog built with Next.js (App Router) and TypeScript,
styled after moonboynewsletter.com — periwinkle "day sky" / midnight "night
sky" themes, a script wordmark, and a masthead with a hand-drawn dragonfly.

## Design

- **Palette:** periwinkle sky (`#C9D6F7`) / deep royal-blue ink in light
  mode, flipping to a midnight navy sky with pale lavender ink in dark mode
  — see the CSS variables in `app/globals.css`.
- **Type:** Mrs Saint Delafield (script — headings, nav, wordmark), Lora
  (body copy), Quicksand (UI labels, buttons, meta text).
- **Theme toggle:** light/dark, persisted to `localStorage`, no flash on
  load (see the inline script in `app/layout.tsx`).
- Admin sidebar stays a fixed dark navy in both themes — deliberate, fixed
  brand chrome rather than something that flips with the toggle.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Footer images

The footer expects two images at `public/left.png` and `public/right.png`
(the decorative flourishes flanking the "Thanks for stopping by!" block).
Add your own files there — until you do, that spot will just show a broken
image icon.

They're recolored with a CSS `filter` in `components/Footer.tsx` (the
`FLOURISH_FILTER` constant) so they read as the ink color in light mode and
the pale-lavender ink in dark mode. This assumes **black line art on a
transparent background** — the filter math (`invert`/`sepia`/`hue-rotate`)
only works cleanly from black. If your PNGs are already colored, delete
`FLOURISH_FILTER` from the `className` and let them show their own color
instead. The filter values are a close approximation, not a pixel-exact
match — nudge `hue-rotate`/`brightness`/`saturate` a few degrees/percent if
the tint looks off with your actual artwork.

## Structure

```
app/
  layout.tsx           root layout — fonts, theme-init script, html/body shell
  (site)/              public site route group (adds Header + Footer)
    layout.tsx
    page.tsx            home page — featured block + Fortnight Favorites + rest
    [slug]/page.tsx      individual post page
    category/[category]/page.tsx   musings / thoughts / poetry / stories / playlists
    about-me/, privacy-policy/, login/
  admin/               dashboard route group (its own sidebar, no public Header)
    layout.tsx
    page.tsx            overview
    featured/page.tsx    edit the homepage featured block
    posts/page.tsx       manage posts
    analytics/page.tsx   engagement charts
    comments/page.tsx    moderate comments
components/
  Header.tsx            centered masthead — dragonfly, wordmark, nav, login, theme toggle
  Footer.tsx             "Thanks for stopping by!" + nav + left.png/right.png
  DragonflyMark.tsx       original hand-drawn-style dragonfly illustration
  FeaturedPost.tsx        read-only homepage featured block (photo + paragraph)
  Cover.tsx               8 generated cover-art variants for post cards
  ArticleCard.tsx         post card (cover + title + meta + likes/comments)
  admin/                  dashboard-only components (Sidebar, StatCard, Donut, BarList, ActionCard, Greeting)
lib/
  posts.ts               sample post data + categories — replace with real content or a CMS
  social.ts               seed likes/comments per post
  admin.ts                combines posts + social into dashboard-ready stats
  featuredPost.ts          shared type/default for the homepage featured block
```

## Swapping in real content

Edit `lib/posts.ts` — each post needs a `slug`, `title`, `excerpt`, a
`cover` variant (`botanical | handwritten | moonlight | polaroid | vinyl |
linen | wildflower | dusk`), a `category` (`musings | thoughts | poetry |
stories | playlists`), a `date`, a `readTime` (minutes), an `author`
(`name` + `initials`), and optionally `favorite: true` to feature it in
"The Fortnight Favorites" on the homepage.

Share links use `NEXT_PUBLIC_SITE_URL` (falls back to a placeholder domain)
to build the shared URL — set this env var to your real domain in production.

## Likes & comments

Both are client-side only, backed by `localStorage`, seeded from
`lib/social.ts` (one `likes` count and an array of `comments` per slug).
There's no server, so likes/comments are per-browser, not shared across
visitors — swap the `LikeButton` and `Comments` components over to real API
calls (or something like Supabase/Firebase) when you're ready to persist
this for real.

## Homepage featured block

`FeaturedPost` at the top of the homepage (photo + title + paragraph, about
the blog rather than a specific post) is edited from `/admin/featured` —
upload a photo, set the title and paragraph, save. It's stored in the
visitor's `localStorage` under the key `moonboy-featured-post`, same
caveat as likes/comments: this is per-browser, not shared with real
visitors, until you wire it up to a real backend. If nothing's been saved
yet, it falls back to a default blurb about the blog.

## Admin dashboard (`/admin`)

A separate dashboard shell (dark sidebar, its own layout — no public
Header/Footer) for managing posts, the homepage block, and skimming
analytics:

- `/admin` — overview: quick actions, totals, an engagement donut, recent
  posts, recent comments
- `/admin/featured` — edit the homepage's featured photo + paragraph
- `/admin/posts` — table of all posts with stats (Edit/Delete are inert —
  no backend wired up)
- `/admin/analytics` — totals, an engagement donut, top posts by likes and
  by comments
- `/admin/comments` — every comment across every post, with post links

"Editor" appears in the sidebar as requested but isn't wired to a route
(shows a "Soon" tag) — build `app/admin/editor/page.tsx` and point the nav
item at it when you're ready to add real post editing.

All post/engagement figures come from `lib/admin.ts`, which combines
`lib/posts.ts` and `lib/social.ts` — no separate admin dataset to maintain.

Note: `/admin` isn't authenticated. Add real auth (middleware, NextAuth,
etc.) before deploying this anywhere public.

## Notes

- Fonts load from Google Fonts at build time via `next/font/google`, so the
  build machine needs normal internet access.
- All post cover art is inline SVG — no image assets to manage there. The
  dragonfly mark is inline SVG too. The only real image assets this project
  expects are `public/left.png` / `public/right.png` for the footer, and
  whatever photo you upload via `/admin/featured`.
# moonboy
