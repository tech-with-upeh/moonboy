import type { Metadata } from "next";
import "@fontsource/windsong/400.css";
import "@fontsource/lora/400.css";
import "@fontsource/lora/500.css";
import "@fontsource/lora/600.css";
import "@fontsource/lora/400-italic.css";
import "@fontsource/lora/500-italic.css";
import "@fontsource/lora/600-italic.css";
import "@fontsource/quicksand/500.css";
import "@fontsource/quicksand/600.css";
import "@fontsource/quicksand/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jaylynne's Spot",
  description: "Musings, thoughts, poetry, stories, and playlists. Thanks for stopping by.",
  icons: {
    icon: "/icon.png",
  },
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    localStorage.removeItem("moonboy-theme");
    document.documentElement.classList.remove("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-sky font-body text-ink antialiased">
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
