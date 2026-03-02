import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./cute-theme.css";

export const metadata: Metadata = {
  title: "AI Math App - 儿童数学游戏",
  description: "专为学前儿童设计的数学学习游戏，支持数数、加减法、数字配对和大小比较",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI Math App",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FFB6C1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased cute-body">
        {children}
      </body>
    </html>
  );
}
