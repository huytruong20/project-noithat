import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getRoom, roomCollections } from "@/lib/data/categories";
import { getProductsByRoom } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductBrowser } from "@/components/product/ProductBrowser";
import { SceneImage } from "@/components/ui/ProductImage";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return roomCollections.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) return { title: "Không tìm thấy bộ sưu tập" };
  return {
    title: `Bộ sưu tập ${room.name}`,
    description: room.blurb,
    alternates: { canonical: `/bo-suu-tap/${slug}` },
  };
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();

  const items = getProductsByRoom(slug);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const cheapest = Math.min(...items.map((item) => item.price));

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Bộ sưu tập", href: "/bo-suu-tap" }, { label: room.name }]}
      />

      <section className="border-b border-line bg-sand">
        <div className="shell grid items-center gap-8 py-10 md:py-14 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="eyebrow mb-2">{room.tagline}</p>
            <h1 className="text-3xl md:text-4xl">Bộ sưu tập {room.name}</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{room.blurb}</p>

            <dl className="mt-6 flex flex-wrap gap-8 border-t border-line pt-5">
              <div>
                <dt className="text-xs text-muted">Số sản phẩm</dt>
                <dd className="mt-0.5 price text-xl">
                  {items.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Giá từ</dt>
                <dd className="mt-0.5 price text-xl">
                  {formatPrice(cheapest)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Trọn bộ tham khảo</dt>
                <dd className="mt-0.5 price text-xl">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              {room.categories.map((categorySlug) => (
                <Link
                  key={categorySlug}
                  href={`/danh-muc/${categorySlug}`}
                  className="border border-line bg-white px-3 py-1.5 text-xs transition-colors hover:border-walnut hover:text-walnut"
                >
                  {getCategory(categorySlug)?.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="aspect-[3/2] overflow-hidden border border-line bg-white">
            <SceneImage tint={room.tint} seed={2} src={room.image} kind="rooms" slug={room.slug} label={room.name} />
          </div>
        </div>
      </section>

      <section className="shell py-10 pb-16">
        <ProductBrowser products={items} />
      </section>

    </>
  );
}
