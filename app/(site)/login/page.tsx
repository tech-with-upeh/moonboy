"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Invalid email or password.");
        return;
      }

      const next = searchParams.get("next");
      const destination = next?.startsWith("/admin") ? next : "/admin";
      router.replace(destination);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
      <div className="w-full max-w-[380px]">
        <div className="flex flex-col items-center text-center">
          <MoonMark />
          <h1 className="mt-4 font-script text-4xl text-ink">Admin sign in</h1>
          <p className="mt-2 max-w-[300px] font-body text-[14px] leading-relaxed text-ink-soft">
            Sign in to manage your Moonboy blog.
          </p>
        </div>

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
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 font-body text-[15px] text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 font-body text-[15px] text-ink focus:border-ink focus:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="font-body text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink py-3 font-ui text-[12px] font-semibold uppercase tracking-[0.12em] text-sky transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
