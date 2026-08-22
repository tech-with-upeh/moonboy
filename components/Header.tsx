"use client";

import { useState } from "react";
import Link from "next/link";
import DragonflyMark from "@/components/DragonflyMark";
import ThemeToggle from "@/components/ThemeToggle";
import { CATEGORIES } from "@/lib/posts";
import Image from "next/image";

const NAV_LINKS = [{ label: "home", href: "/" }, ...CATEGORIES.map((c) => ({
  label: c.label,
  href: `/category/${c.slug}`,
}))];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="px-6 pt-10 md:px-10">
      <div className="mx-auto max-w-page">
        <div className="flex justify-center">
          <Image
            src="/butterflyh.png"
            width={80}
            height={80}
            alt="Dragonfly mark"
            className="h-20 w-20 md:h-24 md:w-24"
          />
        </div>

        <Link
          href="/"
          className="mt-2 block text-center font-script text-[42px] leading-none text-ink sm:text-[56px] md:text-[64px]"
        >
          Moonboy Newsletter
        </Link>

        <div className="mt-8">
          <div className="rule" />
          <div className="mt-[3px] rule" />

          {/* Desktop nav */}
          <nav className="hidden items-center justify-center gap-8 py-3 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-script text-xl text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="rounded-full border border-ink px-4 py-1 font-ui text-[12px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-sky"
            >
              Log in
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile bar: hamburger + theme toggle */}
          <div className="flex items-center justify-center gap-3 py-3 md:hidden">
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
            >
              <span
                className={`block h-[1.5px] w-6 bg-ink transition-transform duration-200 ${
                  open ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-6 bg-ink transition-opacity duration-150 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-[1.5px] w-6 bg-ink transition-transform duration-200 ${
                  open ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            </button>
            <ThemeToggle />
          </div>

          <div className="rule" />
        </div>

        {/* Mobile nav panel */}
        <div
          className={`mx-auto overflow-hidden transition-[max-height] duration-300 ease-in-out md:hidden ${
            open ? "max-h-96" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col items-center gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 font-script text-2xl text-ink-soft"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full border border-ink px-5 py-1.5 font-ui text-[12px] font-semibold uppercase tracking-[0.1em] text-ink"
            >
              Log in
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
