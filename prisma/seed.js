const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const posts = [
  ["on-slow-mornings-and-lavender-bunches", "On slow mornings and lavender bunches", "The market stall, the window light, and why I keep buying more than I need.", "musings", "botanical", "2026-07-28", 4, true],
  ["what-ive-been-turning-over-lately", "What I've been turning over lately", "A few half-finished thoughts I didn't want to lose.", "thoughts", "handwritten", "2026-07-14", 5, true],
  ["a-poem-for-the-space-between-phases", "A poem for the space between phases", "Written on a night the moon was somewhere between new and full.", "poetry", "moonlight", "2026-06-30", 2, true],
  ["the-summer-we-chased-fireflies", "The summer we chased fireflies", "A story about staying out past when we were supposed to.", "stories", "polaroid", "2026-06-11", 6, false],
  ["songs-for-late-night-drives", "Songs for late-night drives", "A playlist for empty roads and open windows.", "playlists", "vinyl", "2026-05-22", 3, false],
  ["the-quiet-parts-of-the-day", "The quiet parts of the day", "In defense of doing absolutely nothing for a little while.", "musings", "linen", "2026-05-05", 4, false],
  ["a-letter-i-never-sent", "A letter I never sent", "Some things are better written than said.", "stories", "wildflower", "2026-04-19", 5, false],
  ["learning-to-sit-with-uncertainty", "Learning to sit with uncertainty", "Notes on not needing to have it all figured out yet.", "thoughts", "dusk", "2026-04-02", 6, false],
];

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Moonboy";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured before seeding.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });

  for (const [slug, title, excerpt, category, cover, date, readTime, favorite] of posts) {
    await prisma.post.upsert({
      where: { slug },
      update: { title, excerpt, category, cover, date: new Date(date), readTime, favorite, published: true },
      create: {
        slug,
        title,
        excerpt,
        content: "This post is ready for its full content to be written.",
        category,
        cover,
        date: new Date(date),
        readTime,
        favorite,
        published: true,
      },
    });
  }

  console.log(`Admin ${email} is ready. Seeded ${posts.length} posts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
