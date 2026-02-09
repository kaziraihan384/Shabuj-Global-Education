import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "University Finder - Find Your Perfect University Worldwide",
  description:
    "Discover and compare universities worldwide with our advanced search platform. Filter by tuition fees, rankings, location, and more. Find the best value universities that match your academic goals and budget.",
  keywords: [
    "university search",
    "college finder",
    "university comparison",
    "best universities",
    "affordable universities",
    "university rankings",
    "study abroad",
    "higher education",
    "tuition fees",
    "university by country",
    "top universities",
    "university filter",
    "compare universities",
    "best value universities",
    "university rankings worldwide",
    "international universities",
    "college search",
    "university admission",
    "education platform",
    "student resources",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
