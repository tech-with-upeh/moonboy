"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_FEATURED_POST,
  FEATURED_POST_KEY,
  type FeaturedPost,
} from "@/lib/featuredPost";

function IconImage() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <circle cx="9" cy="10" r="1.7" />
      <path d="M4.5 17.5 9 13l3 3 4-4.5 3.5 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminFeatured() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(FEATURED_POST_KEY);
      const current: FeaturedPost = stored ? JSON.parse(stored) : DEFAULT_FEATURED_POST;
      setTitle(current.title);
      setText(current.text);
      setPhoto(current.photo);
    } catch {
      setTitle(DEFAULT_FEATURED_POST.title);
      setText(DEFAULT_FEATURED_POST.text);
    }
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }

  function save() {
    const next: FeaturedPost = { photo, title: title.trim(), text: text.trim() };
    try {
      window.localStorage.setItem(FEATURED_POST_KEY, JSON.stringify(next));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore persistence errors
    }
  }

  function resetToDefault() {
    setTitle(DEFAULT_FEATURED_POST.title);
    setText(DEFAULT_FEATURED_POST.text);
    setPhoto(DEFAULT_FEATURED_POST.photo);
    setSaved(false);
  }

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-script text-3xl text-ink">Homepage</h1>
      <p className="mt-1 font-body text-[14px] text-ink-soft">
        Edit the featured block at the top of the homepage — a photo and a
        paragraph about the blog.
      </p>

      <div className="mt-8 max-w-2xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-[4/3] w-full shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line text-ink-soft transition-colors hover:border-ink hover:text-ink sm:w-56"
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="Preview" className="h-full w-full rounded-xl object-cover" />
            ) : (
              <>
                <IconImage />
                <span className="font-ui text-[12px]">Add a photo</span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />

          <div className="flex flex-1 flex-col gap-3">
            <div>
              <label className="mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-line bg-sky px-4 py-2.5 font-body text-[15px] text-ink focus:border-ink focus:outline-none"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <label className="mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                Paragraph
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                className="w-full flex-1 resize-none rounded-xl border border-line bg-sky px-4 py-2.5 font-body text-[15px] leading-relaxed text-ink focus:border-ink focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            className="rounded-full bg-ink px-5 py-2.5 font-ui text-[12px] font-semibold uppercase tracking-[0.1em] text-sky transition-opacity hover:opacity-90"
          >
            {saved ? "Saved ✓" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={resetToDefault}
            className="rounded-full border border-line px-5 py-2.5 font-ui text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-soft hover:text-ink"
          >
            Reset to default
          </button>
        </div>
      </div>
    </div>
  );
}
