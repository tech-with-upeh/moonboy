"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type Mode = "login" | "subscribe";

function MoonMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden>
      <circle cx="32" cy="32" r="26" fill="#F3EEDD" stroke="#1A1A2E" strokeWidth="2" />
      <clipPath id="login-moon-clip">
        <circle cx="32" cy="32" r="25" />
      </clipPath>
      <circle cx="46" cy="32" r="25" fill="#1A1A2E" clipPath="url(#login-moon-clip)" />
    </svg>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    // Placeholder — wire this up to your auth provider of choice.
    setTimeout(() => setStatus("done"), 900);
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-[380px]">
        <div className="flex flex-col items-center text-center">
          <MoonMark />
          <h1 className="mt-4 font-script text-4xl text-ink">
            {mode === "login" ? "Log in" : "Subscribe"}
          </h1>
          <p className="mt-2 max-w-[300px] font-body text-[14px] leading-relaxed text-ink-soft">
            {mode === "login"
              ? "For subscribers — read member posts and leave comments."
              : "Get new posts in your inbox. No spam, unsubscribe anytime."}
          </p>
        </div>

        {status === "done" ? (
          <div className="mt-8 rounded-2xl border border-line px-5 py-6 text-center">
            <p className="font-ui text-[13px] font-semibold uppercase tracking-[0.1em] text-ink">
              Check your email
            </p>
            <p className="mt-2 font-body text-[14px] leading-relaxed text-ink-soft">
              {mode === "login"
                ? "We sent a sign-in link to your inbox."
                : "Confirm your email to start receiving posts."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 font-body text-[15px] text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
              />
            </div>

            {mode === "login" && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft"
                  >
                    Password
                  </label>
                  <Link
                    href="/login"
                    className="font-ui text-[11px] text-ink-soft underline decoration-line underline-offset-2 hover:text-ink"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 font-body text-[15px] text-ink focus:border-ink focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-ink py-3 font-ui text-[12px] font-semibold uppercase tracking-[0.12em] text-sky transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === "loading"
                ? "One moment…"
                : mode === "login"
                ? "Sign in"
                : "Subscribe"}
            </button>
          </form>
        )}

        <div className="mt-6 hairline" />

        <p className="mt-6 text-center font-ui text-[12px] text-ink-soft">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("subscribe");
                  setStatus("idle");
                }}
                className="font-semibold text-ink underline decoration-line underline-offset-2"
              >
                Subscribe instead
              </button>
            </>
          ) : (
            <>
              Already a subscriber?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setStatus("idle");
                }}
                className="font-semibold text-ink underline decoration-line underline-offset-2"
              >
                Log in instead
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
