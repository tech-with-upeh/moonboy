import Link from "next/link";
import Image from "next/image";
import Cover from "@/components/Cover";
import PostMeta from "@/components/PostMeta";
import LikeButton from "@/components/LikeButton";
import type { Post } from "@/lib/posts";

function IconComment(){return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5.5h16v10H9.5L5 19.5v-4H4v-10Z" strokeLinejoin="round" strokeLinecap="round"/></svg>}
function PostCover({post}:{post:Post}){if(post.coverUrl)return <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line"><Image src={post.coverUrl} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover"/></div>;return post.cover?<Cover variant={post.cover}/>:<div className="aspect-[4/3] w-full rounded-2xl border border-line bg-moon"/>}
export default function ArticleCard({post,likes=0,commentCount=0}:{post:Post & {likes?:number;commentCount?:number};likes?:number;commentCount?:number}){const liveLikes=post.likes ?? likes; const liveComments=post.commentCount ?? commentCount; return <Link href={`/${post.slug}`} className="group block"><PostCover post={post}/><span className="mt-4 block text-center font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">{post.category}</span><h3 className="mt-1 text-center font-script text-[30px] leading-tight text-ink transition-colors group-hover:text-moon-deep">{post.title}</h3><div className="mt-3"><PostMeta author={post.author} date={post.date} readTime={post.readTime} size="sm"/></div><div className="mt-3 flex items-center justify-center gap-5"><LikeButton slug={post.slug} initialLikes={liveLikes} size="sm"/><span className="flex items-center gap-2 font-ui text-[13px] text-ink-soft"><span className="flex h-8 w-8 items-center justify-center rounded-full text-ink"><IconComment/></span>{liveComments}</span></div></Link>}
