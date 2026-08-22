"use client";

import { useEffect, useState } from "react";
import Cover from "@/components/Cover";
import {
  DEFAULT_FEATURED_POST,
  FEATURED_POST_KEY,
  type FeaturedPost as FeaturedPostData,
} from "@/lib/featuredPost";

export default function FeaturedPost() {
  const [post, setPost] = useState<FeaturedPostData>(DEFAULT_FEATURED_POST);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(FEATURED_POST_KEY);
      if (stored) setPost(JSON.parse(stored));
    } catch {
      // localStorage unavailable or corrupt — keep the default
    }
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex flex-col sm:flex-row">
        <div className="aspect-[4/3] w-full sm:aspect-auto sm:w-2/5 sm:shrink-0">
          {post.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <Cover variant="moonlight" />
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-10">
          <h1 className="font-script text-4xl text-ink sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-[440px] font-body text-[16px] leading-loose text-ink-soft">
            {post.text}
          </p>
        </div>
      </div>
    </div>
  );
}
