"use client";

import { useEffect, useState } from "react";
import Cover from "@/components/Cover";
import {
  DEFAULT_FEATURED_POST,
  FEATURED_POST_KEY,
  type FeaturedPost as FeaturedPostData,
} from "@/lib/featuredPost";

type FeaturedPostProps = {
  background?: string; // optional override; leave out to use the CSS default
};

function FeaturedShimmer() {
  return (
    <div className="flex animate-pulse flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-8 lg:gap-12">
      <div className="aspect-[4/5] w-full max-w-[7rem] shrink-0 bg-amber-900/10 sm:w-[14rem] sm:max-w-none lg:w-[18rem]" />
      <div className="flex w-full flex-col items-center space-y-3 sm:items-start">
        <div className="h-8 w-3/4 bg-amber-900/10" />
        <div className="h-3 w-full max-w-md bg-amber-900/10" />
        <div className="h-3 w-5/6 max-w-md bg-amber-900/10" />
      </div>
    </div>
  );
}

export default function FeaturedPost({ background }: FeaturedPostProps) {
  const [post, setPost] = useState<FeaturedPostData | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(FEATURED_POST_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.title === "string") {
          setPost(parsed);
          return;
        }
      }
    } catch {}
    setPost(DEFAULT_FEATURED_POST);
  }, []);

  const image = post?.photo ? (
    <img
      src={post.photo}
      alt=""
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  ) : (
    <Cover variant="moonlight" />
  );

  return (
  <section
    className="section-featured relative isolate overflow-hidden"
    style={
      background ? { backgroundImage: `url("${background}")` } : undefined
    }
  >
    <article className="relative z-10 mx-auto w-full max-w-4xl">
      {!post ? (
        <FeaturedShimmer />
      ) : (
        <div className="flex flex-col items-center  mb-8 sm:flex-row sm:items-center sm:justify-center sm:gap-8 lg:gap-12">
          {/* Featured image: small and centered on phones, left and vertically centered from tablet up */}
          <div className="w-full max-w-[7rem] shrink-0 sm:w-[14rem] sm:max-w-none lg:w-[18rem]">
            <div className="relative overflow-hidden">
              {post.link ? (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${post.title}`}
                  className="block h-full w-full"
                >
                  {image}
                </a>
              ) : (
                image
              )}
            </div>
          </div>

          {/* Featured text */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h1 className="max-w-xl font-script text-2xl leading-tight text-[#39200f] sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-2 max-w-xs md:max-w-md font-ui text-xs leading-[1.7] text-[#4b301d]  sm:mt-3 sm:text-base sm:leading-[1.9]">
              {post.text}
            </p>
          </div>
        </div>
      )}
    </article>
  </section>
);
}