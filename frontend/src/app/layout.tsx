import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "ScamGuard — AI Scam & Fraud Message Detection",
    template: "%s · ScamGuard",
  },
  description:
    "Detect phishing, OTP scams, and fraudulent messages in real time using AI-powered NLP and machine learning.",
};

// Runs before React hydrates, so the correct theme class is present on
// first paint -- prevents a flash of the wrong theme on page load.
//
// IMPORTANT: this exact string is allow-listed in next.config.js via a
// CSP script-src hash. If you edit this script, you MUST recompute that
// hash (see the comment above THEME_SCRIPT_CSP_HASH in next.config.js)
// or dark-mode initialization will silently fail under CSP enforcement.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("scam_detection_theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`min-h-screen ${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
