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
  const [link, setLink] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(FEATURED_POST_KEY);
      const current: FeaturedPost = stored
        ? { ...DEFAULT_FEATURED_POST, ...JSON.parse(stored) }
        : DEFAULT_FEATURED_POST;
      setTitle(current.title);
      setText(current.text);
      setLink(current.link ?? "");
      setPhoto(current.photo);
    } catch {
      setTitle(DEFAULT_FEATURED_POST.title);
      setText(DEFAULT_FEATURED_POST.text);
      setLink(DEFAULT_FEATURED_POST.link);
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
    const next: FeaturedPost = {
      photo,
      title: title.trim(),
      text: text.trim(),
      link: link.trim(),
    };
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
    setLink(DEFAULT_FEATURED_POST.link);
    setPhoto(DEFAULT_FEATURED_POST.photo);
    setSaved(false);
  }

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-script text-3xl text-ink">Blue Almonds</h1>
      <p className="mt-1 font-body text-[14px] text-ink-soft">
        Edit the featured music block on the homepage.
      </p>

      <div className="mt-8 max-w-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-[4/3] w-full shrink-0 flex-col items-center justify-center gap-2 border border-dashed border-line text-ink-soft transition-colors hover:border-ink hover:text-ink sm:w-56"
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <>
                <IconImage />
                <span className="font-ui text-[12px]">Add a photo</span>
              </>
            )}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

          <div className="flex flex-1 flex-col gap-3">
            <div>
              <label className="mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-line bg-sky px-4 py-2.5 font-body text-[15px] text-ink focus:border-ink focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Photo link</label>
              <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://open.spotify.com/..." className="w-full border border-line bg-sky px-4 py-2.5 font-body text-[15px] text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none" />
              <p className="mt-1.5 font-body text-[12px] text-ink-soft">Clicking the photo will open this link in a new tab.</p>
            </div>
            <div className="flex flex-1 flex-col">
              <label className="mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Description</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className="w-full flex-1 resize-none border border-line bg-sky px-4 py-2.5 font-body text-[15px] leading-relaxed text-ink focus:border-ink focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="button" onClick={save} className="rounded-full bg-ink px-5 py-2.5 font-ui text-[12px] font-semibold uppercase tracking-[0.1em] text-sky transition-opacity hover:opacity-90">
            {saved ? "Saved ✓" : "Save changes"}
          </button>
          <button type="button" onClick={resetToDefault} className="rounded-full border border-line px-5 py-2.5 font-ui text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-soft hover:text-ink">
            Reset to default
          </button>
        </div>
      </div>
    </div>
  );
}
