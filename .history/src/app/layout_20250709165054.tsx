import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./Providers";

const expletusSans = localFont({
  src: "./fonts/ExpletusSans.ttf",
  variable: "--font-expletus-sans",
  weight: "400 500 600 700",
});

export const metadata: Metadata = {
  title: "Portal Berita Lokal Indonesia",
  description:
    "This project aims to create a web-based local news portal that maintains the accuracy and quality of news, while providing an interactive and personalized user experience. By raising public awareness and encouraging participation in local journalism, I hope this portal will become a trusted source of information for the community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta
        name="google-site-verification"
        content="g1K9uwCjFYm6Emspt7Ch4BHgj7FLBnqOW-770w8_uP8"
      />
      <meta
        name="google-adsense-account"
        content="ca-pub-7686429509274648"
      >
      <body
        className={`${expletusSans.variable} antialiased overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
