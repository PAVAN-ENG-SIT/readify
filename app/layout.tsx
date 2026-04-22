import type { Metadata } from "next";
import "./globals.css";
import ReaderPanel from "@/components/reader/ReaderPanel";

export const metadata: Metadata = {
  title: "Readify",
  description: "Read, track, and form unbreakable habits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark theme-dark">
        {children}
        <ReaderPanel />
      </body>
    </html>
  );
}
