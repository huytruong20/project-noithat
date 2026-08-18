import type { MetadataRoute } from "next";
import { categories, roomCollections } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { policies } from "@/lib/data/policies";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${siteUrl}${path}`;

  return [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/danh-muc"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/bo-suu-tap"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/ve-chung-toi"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/lien-he"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/chinh-sach"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: url("/tra-cuu-don"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },

    ...categories.map((item) => ({
      url: url(`/danh-muc/${item.slug}`),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...products.map((item) => ({
      url: url(`/san-pham/${item.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...roomCollections.map((item) => ({
      url: url(`/bo-suu-tap/${item.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...policies.map((item) => ({
      url: url(`/chinh-sach/${item.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
