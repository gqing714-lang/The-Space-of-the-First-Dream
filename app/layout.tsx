import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "一梦间",
  description: "两位朋友与 AI 角色共同生活的私密朋友圈。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
