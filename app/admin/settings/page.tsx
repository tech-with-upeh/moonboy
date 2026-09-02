"use client";

import { FormEvent, useState } from "react";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to update your password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Your password has been updated successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen px-6 py-10 md:px-10 lg:px-14">
      <div className="mx-auto max-w-3xl">
        <div className="border-b border-line pb-6">
          <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
            Admin
          </p>
          <h1 className="mt-2 font-script text-4xl text-ink">Settings</h1>
          <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-ink-soft">
            Manage your administrator account and security settings.
          </p>
        </div>

        <div className="mt-8 max-w-xl rounded-2xl border border-line bg-surface p-6 md:p-8">
          <div className="mb-7">
            <h2 className="font-ui text-base font-semibold text-ink">
              Change password
            </h2>
            <p className="mt-1.5 font-body text-sm leading-relaxed text-ink-soft">
              Choose a strong password you do not use elsewhere.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="current-password"
                className="mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft"
              >
                Current password
              </label>
              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none"
              />
              <p className="mt-1.5 font-body text-xs text-ink-soft">
                Minimum 8 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft"
              >
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>

            {error && (
              <p role="alert" className="font-body text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="font-body text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-ink px-6 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-sky transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
