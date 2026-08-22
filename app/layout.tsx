import type { Metadata } from "next";
import { Lora, Quicksand, WindSong } from "next/font/google";
import "./globals.css";

const windsong = WindSong({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Moonboy Newsletter",
  description: "Musings, thoughts, poetry, stories, and playlists. Thanks for stopping by.",
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
    <html lang="en" suppressHydrationWarning className={windsong.variable}>
      <body className="min-h-screen bg-sky font-body text-ink antialiased">
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
