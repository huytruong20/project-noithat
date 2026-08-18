import type { Metadata } from "next";
import Link from "next/link";
import { roomCollections, getCategory } from "@/lib/data/categories";
import { getProductsByRoom } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SceneImage } from "@/components/ui/ProductImage";

export const metadata: Metadata = {
  title: "Bộ sưu tập theo không gian",
  description:
    "Phòng mẫu theo từng không gian: phòng khách, phòng ngủ, bếp và phòng ăn, phòng làm việc, căn hộ nhỏ. Các món đã được phối sẵn về tỉ lệ và màu sắc.",
};

export default function CollectionIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Bộ sưu tập" }]} />

      <section className="border-b border-line bg-sand">
        <div className="shell py-10 md:py-14">
          <p className="eyebrow mb-2">Phòng mẫu</p>
          <h1 className="text-3xl md:text-4xl">Bộ sưu tập theo không gian</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
            Thay vì chọn từng món rời rạc, hãy bắt đầu từ căn phòng. Mỗi bộ sưu tập là
            các món chúng tôi đã cân sẵn về tỉ lệ, chiều cao và tông màu — mua cả bộ
            không sợ lệch nhau.
          </p>
        </div>
      </section>

      <section className="shell space-y-6 py-12 pb-20">
        {roomCollections.map((room, index) => {
          const items = getProductsByRoom(room.slug);
          const cheapest = Math.min(...items.map((item) => item.price));

          return (
            <article
              key={room.slug}
              className="grid items-stretch gap-0 border border-line bg-white md:grid-cols-2"
            >
              <Link
                href={`/bo-suu-tap/${room.slug}`}
                className={`group aspect-[3/2] overflow-hidden bg-sand md:aspect-auto ${
                  index % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                  <SceneImage
                    tint={room.tint}
                    seed={index}
                    src={room.image}
                    kind="rooms"
                    slug={room.slug}
                    label={room.name}
                  />
                </div>
              </Link>

              <div className="flex flex-col justify-center p-6 md:p-10">
                <p className="eyebrow mb-2">{room.tagline}</p>
                <h2 className="text-2xl md:text-3xl">
                  <Link href={`/bo-suu-tap/${room.slug}`} className="hover:text-walnut">
                    {room.name}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{room.blurb}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {room.categories.map((slug) => (
                    <Link
                      key={slug}
                      href={`/danh-muc/${slug}`}
                      className="border border-line px-3 py-1.5 text-xs transition-colors hover:border-walnut hover:text-walnut"
                    >
                      {getCategory(slug)?.name}
                    </Link>
                  ))}
                </div>

                <p className="mt-5 text-sm text-muted">
                  {items.length} sản phẩm · từ{" "}
                  <strong className="text-ink">{formatPrice(cheapest)}</strong>
                </p>

                <Link
                  href={`/bo-suu-tap/${room.slug}`}
                  className="btn btn-primary mt-6 self-start"
                >
                  Xem bộ sưu tập
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
