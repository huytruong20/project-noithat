import type { Product } from "@/lib/types";
import { site, siteUrl } from "@/lib/site";
import { formatDimensions, formatWarranty } from "@/lib/format";

/**
 * Dữ liệu có cấu trúc (schema.org) giúp Google hiểu trang và hiện giá, sao
 * đánh giá ngay trên kết quả tìm kiếm.
 */
function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Dữ liệu do chính chúng ta tạo, không phải input người dùng
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "FurnitureStore",
        name: site.name,
        description: site.tagline,
        url: siteUrl,
        telephone: site.hotline,
        email: site.email,
        priceRange: "1.000.000₫ - 45.000.000₫",
        address: site.showrooms.map((showroom) => ({
          "@type": "PostalAddress",
          streetAddress: showroom.address,
          addressLocality: showroom.city,
          addressCountry: "VN",
        })),
        openingHours: "Mo-Su 08:00-20:00",
        sameAs: site.socials.map((social) => social.href),
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.short,
        sku: product.slug,
        brand: { "@type": "Brand", name: site.name },
        material: product.materials.join(", "),
        weight: { "@type": "QuantitativeValue", value: product.weight, unitCode: "KGM" },
        size: formatDimensions(product.dimensions),
        color: product.colors.map((color) => color.name).join(", "),
        offers: {
          "@type": "Offer",
          url: `${siteUrl}/san-pham/${product.slug}`,
          priceCurrency: "VND",
          price: product.price,
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: site.name },
          warranty: formatWarranty(product.warrantyMonths),
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
          bestRating: 5,
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: `${siteUrl}${item.href}`,
        })),
      }}
    />
  );
}
