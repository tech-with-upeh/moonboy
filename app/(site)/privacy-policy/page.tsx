export default function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-[560px] px-6 py-16 md:px-10">
      <h1 className="text-center font-script text-5xl text-ink">
        Privacy policy
      </h1>
      <div className="mx-auto mt-6 h-[2px] w-16 bg-rule" />

      <div className="mt-8 space-y-5 font-body text-[15px] leading-loose text-ink-soft">
        <p>
          This is a placeholder privacy policy. Replace it with your actual
          policy before this site goes live — covering what's collected
          (email for subscriptions, comment names, likes stored in the
          visitor's own browser), how it's used, and how someone can ask to
          have their information removed.
        </p>
        <p>
          Likes and comments on this site are stored locally in each
          visitor's browser and aren't sent to a server, unless you connect
          this to a real backend.
        </p>
        <p>
          If you subscribe by email, that address is used only to send new
          posts, and you can unsubscribe at any time.
        </p>
      </div>
    </main>
  );
}
