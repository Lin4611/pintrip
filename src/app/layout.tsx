import type { Metadata } from "next";
import {
  Caveat,
  Noto_Sans_KR,
  Noto_Sans_TC,
  Playfair_Display,
  Quicksand,
} from "next/font/google";
import "@/styles/globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  preload: false,
});

// 繁體中文介面字體。Design System 只為韓文內文指定 Noto Sans KR，未涵蓋繁中；
// 選用同家族的 TC 版本以維持字重與字高一致，並取得正確的台灣字形。
const notoSansTc = Noto_Sans_TC({
  variable: "--font-noto-tc",
  preload: false,
});

// 文案依 docs/MVP.md §1 的產品目標，不自行發明定位。
export const metadata: Metadata = {
  title: "PinTrip｜旅遊收藏地圖",
  description:
    "把 Instagram 貼文裡的旅遊資訊，整理成可確認、可分類、可篩選並能顯示於地圖的地點收藏。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${playfairDisplay.variable} ${quicksand.variable} ${caveat.variable} ${notoSansKr.variable} ${notoSansTc.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
