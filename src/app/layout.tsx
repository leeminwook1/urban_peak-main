import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DesignEffects from "@/components/ui/DesignEffects";
import "./globals.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://urbanpeak-seven.vercel.app"),
  title: {
    default: "Urban Peak — 새로운 장면을 만드는 문화 기획 스튜디오",
    template: "%s | Urban Peak",
  },
  description:
    "인디 공연의 감도와 도시의 취향을 연결해, 다시 찾아올 만한 장면을 설계하는 문화 기획 스튜디오입니다.",
  keywords: [
    "어반피크",
    "urban peak",
    "공연 기획",
    "인디 공연",
    "문화 기획",
    "큐레이션",
    "인디씬",
    "공연 스튜디오",
  ],
  authors: [{ name: "Urban Peak" }],
  creator: "Urban Peak",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://urbanpeak-seven.vercel.app",
    siteName: "Urban Peak",
    title: "Urban Peak — 새로운 장면을 만드는 문화 기획 스튜디오",
    description:
      "인디 공연의 감도와 도시의 취향을 연결해, 다시 찾아올 만한 장면을 설계하는 문화 기획 스튜디오입니다.",
    images: [
      {
        url: "/images/logos/logo-stacked.png",
        width: 800,
        height: 800,
        alt: "Urban Peak",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Urban Peak — 새로운 장면을 만드는 문화 기획 스튜디오",
    description:
      "인디 공연의 감도와 도시의 취향을 연결해, 다시 찾아올 만한 장면을 설계하는 문화 기획 스튜디오입니다.",
    images: ["/images/logos/logo-stacked.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="min-h-screen antialiased">
        <DesignEffects />
        <Navbar />
        <main className="pt-[63px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
