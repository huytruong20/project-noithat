import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Các trang cá nhân hoá, không có giá trị với công cụ tìm kiếm
      disallow: [
        "/gio-hang",
        "/thanh-toan",
        "/tra-cuu-don",
        "/tim-kiem",
        // Khu đăng nhập và quản trị: không có gì để tìm kiếm, và không nên
        // để đường dẫn quản trị nằm trong kết quả tìm kiếm của Google
        "/dang-nhap",
        "/dang-ky",
        "/tai-khoan",
        "/admin",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
