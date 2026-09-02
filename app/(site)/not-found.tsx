import Link from "next/link";

export default function PostNotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-page flex-col items-center justify-center px-6 pb-28 pt-10 text-center md:px-10">
      <img src="/nopost.svg" alt="Post not found" className="h-auto w-full max-w-[360px]" />
      <div className="mt-7 max-w-md">
        <h2 className="font-script text-4xl text-ink sm:text-5xl">Page not found</h2>
        <p className="mt-3 font-body text-[15px] leading-7 text-ink-soft">
          This post doesn&apos;t exist, or it may have been moved or unpublished.
          Let&apos;s get you back to something worth reading.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-ink px-7 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-sky transition-opacity hover:opacity-90"
        >
          Back to the newsletter
        </Link>
      </div>
    </section>
  );
}