import type { Metadata } from "next";
import { Be_Vietnam_Pro, Lora } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartFlash } from "@/components/cart/CartFlash";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { site, siteUrl } from "@/lib/site";

/**
 * Be Vietnam Pro cho phần chữ đọc — thiết kế riêng cho tiếng Việt nên dấu
 * không bị chồng lên chữ như các font Latin thuần.
 */
const sans = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

/**
 * Font tiêu đề. Trước dùng Playfair Display nhưng nét thanh của nó quá mảnh:
 * dấu tiếng Việt (ẫ, ộ, ừ) mảnh gần như biến mất ở cỡ chữ nhỏ, và kiểu chữ đó
 * bị dùng quá nhiều nên trang nhìn như mẫu dựng sẵn.
 * Lora có nét đậm đều hơn, bộ dấu tiếng Việt được vẽ riêng nên rõ ở mọi cỡ.
 */
const display = Lora({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

const description =
  "Nội thất gỗ cho nhà ở và văn phòng: sofa, giường, tủ kệ, bàn ăn, bàn ghế văn phòng. Miễn phí giao và lắp đặt nội thành, bảo hành tới 5 năm.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description,
  keywords: [
    "nội thất",
    "sofa",
    "giường ngủ",
    "bàn ăn",
    "tủ quần áo",
    "nội thất văn phòng",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${sans.variable} ${display.variable}`}>
      {/*
        min-h-dvh + flex-col ở body và flex-1 ở <main> để chân trang luôn nằm
        sát đáy màn hình. Thiếu hai dòng này thì trang ngắn (giỏ hàng trống,
        404, tìm kiếm không ra kết quả) bị mảng trắng lớn phía dưới chân trang.
      */}
      <body className="flex min-h-dvh flex-col">
        <CartProvider>
          <a
            href="#noi-dung"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
          >
            Bỏ qua, tới nội dung chính
          </a>
          <Header />
          <main id="noi-dung" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartFlash />
          <OrganizationJsonLd />
        </CartProvider>
      </body>
    </html>
  );
}
