"use client";

import { useEffect, useState } from "react";
import Cover from "@/components/Cover";
import { DEFAULT_FEATURED_POST, FEATURED_POST_KEY, type FeaturedPost as FeaturedPostData } from "@/lib/featuredPost";

function FeaturedShimmer(){return <article className="overflow-hidden bg-surface"><div className="flex flex-col sm:flex-row"><div className="aspect-[4/3] w-full animate-pulse bg-night/10 sm:aspect-auto sm:w-2/5 sm:shrink-0"/><div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-10"><div className="h-10 w-3/4 animate-pulse rounded bg-night/10 sm:h-12"/><div className="mt-5 h-4 w-full animate-pulse rounded bg-night/10"/><div className="mt-3 h-4 w-11/12 animate-pulse rounded bg-night/10"/><div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-night/10"/></div></div></article>}

export default function FeaturedPost(){
 const [post,setPost]=useState<FeaturedPostData|null>(null);
 useEffect(()=>{try{const stored=window.localStorage.getItem(FEATURED_POST_KEY);if(stored){setPost(JSON.parse(stored));return;}}catch{}setPost(DEFAULT_FEATURED_POST)},[]);
 if(!post)return <FeaturedShimmer/>;
 const image=post.photo?<img src={post.photo} alt="" className="h-full w-full object-cover"/>:<Cover variant="moonlight"/>;
 return <article className="overflow-hidden bg-surface"><div className="flex flex-col sm:flex-row"><div className="aspect-[4/3] w-full sm:aspect-auto sm:w-2/5 sm:shrink-0">{post.link?<a href={post.link} target="_blank" rel="noreferrer" aria-label={`Open ${post.title}`} className="block h-full w-full">{image}</a>:image}</div><div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-10"><h1 className="font-script text-4xl text-ink sm:text-5xl">{post.title}</h1><p className="mt-4 max-w-[440px] font-body text-[16px] leading-loose text-ink-soft">{post.text}</p></div></div></article>;
}
