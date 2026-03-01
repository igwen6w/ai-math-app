import type { Metadata, Viewport } from "next";
import "./globals.css";

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
  themeColor: "#4F46E5",
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
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
