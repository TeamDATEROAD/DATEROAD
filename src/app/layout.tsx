import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "데이트로드 관리자",
  description: "데이트로드 관리자 페이지 - 사용자, 코스, 통계 관리",
  keywords: ["데이트로드", "관리자", "데이트", "코스", "통계"],
  authors: [{ name: "데이트로드" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "noindex, nofollow", // 관리자 페이지는 검색엔진에서 제외
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.className}>
      <body className="min-h-screen bg-background antialiased">{children}</body>
    </html>
  );
}
