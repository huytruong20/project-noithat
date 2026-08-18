import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory, roomCollections } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductBrowser } from "@/components/product/ProductBrowser";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Không tìm thấy danh mục" };
  return {
    title: category.name,
    description: category.blurb,
    alternates: { canonical: `/danh-muc/${slug}` },
    openGraph: {
      type: "website",
      title: category.name,
      description: category.blurb,
      url: `/danh-muc/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = getProductsByCategory(slug);
  const relatedRooms = roomCollections.filter((room) =>
    room.categories.includes(slug),
  );

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Sản phẩm", href: "/danh-muc" }, { label: category.name }]}
      />

      <section className="border-b border-line bg-sand">
        <div className="shell py-10 md:py-14">
          <p className="eyebrow mb-2">{category.tagline}</p>
          <h1 className="text-3xl md:text-4xl">{category.name}</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
            {category.blurb}
          </p>

          {relatedRooms.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">Xem theo không gian:</span>
              {relatedRooms.map((room) => (
                <Link
                  key={room.slug}
                  href={`/bo-suu-tap/${room.slug}`}
                  className="border border-line bg-white px-3 py-1.5 text-xs transition-colors hover:border-walnut hover:text-walnut"
                >
                  {room.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="shell py-10 pb-20">
        <ProductBrowser products={items} />
      </section>

      {/* Điều hướng chéo sang danh mục khác */}
      <section className="border-t border-line bg-sand py-12">
        <div className="shell">
          <p className="eyebrow mb-4">Danh mục khác</p>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((item) => item.slug !== slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/danh-muc/${item.slug}`}
                  className="border border-line bg-white px-4 py-2 text-sm transition-colors hover:border-walnut hover:text-walnut"
                >
                  {item.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
