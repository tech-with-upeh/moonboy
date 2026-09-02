"use client";

import { useEffect } from "react";

export default function PostAnalytics({ slug }: { slug: string }) {
  useEffect(() => {
    let active = true;
    const send = (action: "view" | "read_start" | "read_complete") => {
      if (!active) return;
      fetch("/api/social", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, action }), keepalive: action === "read_complete" }).catch(() => {});
    };

    send("view");
    const startTimer = window.setTimeout(() => send("read_start"), 1000);
    const completeTimer = window.setTimeout(() => send("read_complete"), 30000);

    return () => {
      active = false;
      window.clearTimeout(startTimer);
      window.clearTimeout(completeTimer);
    };
  }, [slug]);

  return null;
}
