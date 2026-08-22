"use client";

import { useState } from "react";

function IconLink() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5" strokeLinecap="round" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.36-1.36" strokeLinecap="round" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M4 3h3.6l4.1 5.6L16.4 3H20l-6.2 8.1L20.3 21h-3.6l-4.5-6.1L7.2 21H3.6l6.6-8.6L4 3Z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M6.5 8.5H3.8V20h2.7V8.5Zm-1.35-4.3a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM20.2 20h-2.7v-6.1c0-1.45-.03-3.3-2.02-3.3-2.02 0-2.33 1.58-2.33 3.2V20H10.4V8.5h2.6v1.57h.04c.36-.68 1.25-1.4 2.57-1.4 2.75 0 3.26 1.81 3.26 4.17V20Z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M14.5 8.5H16V5.6c-.26-.03-1.15-.1-2.2-.1-2.18 0-3.67 1.33-3.67 3.77v2.2H7.8v3.2h2.33V21h3.2v-6.33h2.24l.36-3.2h-2.6V9.6c0-.68.19-1.1 1.17-1.1Z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — fail silently
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <IconX />,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <IconLinkedIn />,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <IconFacebook />,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="mr-1 font-ui font-medium text-[11px] uppercase tracking-[0.12em] text-ink-soft">
        Share
      </span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-sky"
        >
          {link.icon}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-sky"
      >
        {copied ? <IconCheck /> : <IconLink />}
      </button>
    </div>
  );
}
