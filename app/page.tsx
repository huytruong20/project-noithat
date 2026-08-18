import Link from "next/link";
import { categories, roomCollections } from "@/lib/data/categories";
import {
  getBestSellers,
  getNewArrivals,
  getOnSale,
  products,
} from "@/lib/data/products";
import { anhCoWatermark } from "@/lib/data/anh-ben-ngoai";
import { site } from "@/lib/site";
import { ProductGrid } from "@/components/product/ProductCard";
import { FeaturedTabs } from "@/components/home/FeaturedTabs";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import {
  CategoryImage,
  ProductImage,
  SceneImage,
  coAnhThat,
} from "@/components/ui/ProductImage";

const reviews = [
  {
    name: "Chị Thu Hà",
    place: "An Khê, Gia Lai",
    text: "Đội lắp đặt đến đúng giờ, trải thảm lót sàn rồi mới làm, xong dọn sạch mang hết bao bì đi. Sofa dùng 8 tháng vẫn chưa xẹp chỗ nào.",
    rating: 5,
  },
  {
    name: "Anh Đức Minh",
    place: "Thảo Điền, TP.HCM",
    text: "Tư vấn viên bảo tôi đo lại chiếu nghỉ cầu thang trước khi chốt, hoá ra đúng là không quay được bàn 1m8. Đổi sang mẫu khác, tránh được một phen mệt.",
    rating: 5,
  },
  {
    name: "Chị Ngọc Anh",
    place: "Công ty Bluewave, TP.HCM",
    text: "Đặt 40 bộ bàn ghế, lắp gọn trong ba ngày cuối tuần. Sáng thứ Hai nhân viên đến là ngồi làm luôn, không mất ngày công nào.",
    rating: 5,
  },
];

export default function HomePage() {
  const bestSellers = getBestSellers(8);
  const newArrivals = getNewArrivals(8);
  const onSale = getOnSale(8);

  /*
    Khối ảnh hero chỉ lấy sản phẩm ĐÃ CÓ ảnh chụp thật và ảnh đó KHÔNG dính
    watermark của đơn vị khác. Trước đây lấy theo vị trí cố định nên khi danh
    sách sản phẩm đổi, một ô rơi vào món chưa có ảnh và hiện hình minh hoạ giữa
    các ảnh thật — nhìn như thiếu ảnh.

    Nếu số ảnh sạch chưa đủ 3 thì mới lấy tạm ảnh còn watermark, để khối này
    không bao giờ bị trống ô.
  */
  const anhDaCo = products.filter(coAnhThat);
  const anhSach = anhDaCo.filter((item) => !anhCoWatermark.includes(item.slug));
  const anhHero = [...anhSach, ...anhDaCo].slice(0, 3);

  return (
    <>
      {/* ---------------------------- 1. Hero ---------------------------- */}
      <section className="border-b border-line bg-sand">
        <div className="shell grid items-center gap-10 py-12 lg:grid-cols-[1.18fr_1fr] lg:py-20">
          <div>
            <p className="eyebrow mb-4">Nội thất gỗ · Giao &amp; lắp đặt tận nhà</p>

            {/* Câu chính: nói cả độ bền lẫn thẩm mỹ trong một dòng */}
            {/* text-balance: trình duyệt tự cân độ dài hai dòng khi màn hình hẹp */}
            <h1 className="text-balance text-4xl leading-[1.12] md:text-5xl lg:text-[3.05rem]">
              Đủ bền cho thập kỷ,
              <br className="hidden lg:inline" />{" "}
              đủ đẹp cho mọi góc nhìn.
            </h1>

            {/* Câu dẫn: nhấn giá trị dùng lâu, đối lại thói quen mua theo ảnh đẹp */}
            <p className="mt-4 max-w-lg font-display text-lg leading-snug text-walnut md:text-xl">
              Giá trị 10 năm, không dừng lại ở một bức hình.
            </p>

            {/* Đoạn chứng minh: con số cụ thể để câu khẩu hiệu phía trên có cơ sở */}
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
              Gỗ sấy đúng độ ẩm 8–12%, mút D40 chính hãng, mối ghép chắc. Mọi thông số
              kích thước, chất liệu và bảo hành đều ghi rõ trên từng sản phẩm — bạn
              biết chính xác mình mua gì trước khi đặt.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/danh-muc" className="btn btn-primary">
                Xem danh mục sản phẩm
              </Link>
              <Link href="/lien-he" className="btn btn-outline">
                Tư vấn miễn phí
              </Link>
            </div>

            {/* Ba khẳng định ngắn, tách bằng dấu chấm giữa dòng */}
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium">
              <span>Nội thất thật</span>
              <span className="text-walnut" aria-hidden="true">
                ·
              </span>
              <span>Giá trị thật</span>
              <span className="text-walnut" aria-hidden="true">
                ·
              </span>
              <span>Bền bỉ theo năm tháng</span>
            </p>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
              <div>
                <dt className="text-2xl font-semibold">{products.length}+</dt>
                <dd className="mt-0.5 text-xs text-muted">Mẫu đang bán</dd>
              </div>
              <div>
                <dt className="text-2xl font-semibold">400+</dt>
                <dd className="mt-0.5 text-xs text-muted">Dự án đã bàn giao</dd>
              </div>
              <div>
                <dt className="text-2xl font-semibold">5 năm</dt>
                <dd className="mt-0.5 text-xs text-muted">Bảo hành tối đa</dd>
              </div>
            </dl>
          </div>

          {/*
            Ba ảnh vuông 1:1 xếp lưới 2×2, ô thứ tư là câu chú thích.
            Ô thứ hai lệch xuống một nhịp cho bố cục bớt phẳng.
          */}
          <div className="grid grid-cols-2 gap-3">
            {anhHero.map((item, index) => (
              <Link
                key={item.slug}
                href={`/san-pham/${item.slug}`}
                className={`group aspect-square overflow-hidden border border-line bg-white ${
                  index === 1 ? "mt-6 md:mt-10" : ""
                }`}
                title={item.name}
              >
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                  <ProductImage product={item} priority />
                </div>
              </Link>
            ))}

            {/* Ô cuối: chú thích thay vì để trống */}
            <div className="flex flex-col justify-end pb-1 pl-1">
              <p className="font-display text-base leading-snug text-ink md:text-lg">
                Đẹp vượt thời gian,
                <br />
                bền qua từng trải nghiệm.
              </p>
              <Link
                href="/danh-muc"
                className="mt-3 text-sm font-semibold text-walnut hover:underline"
              >
                Xem tất cả mẫu →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------ 2. Danh mục nhanh ----------------------- */}
      <Reveal as="section" className="shell py-14 md:py-20">
        <SectionHeading
          eyebrow="Phong cách Tối giản & Tinh tế (Hợp với đồ Decor, Nội thất, Thời trang)"
          eyebrowTone="plain"
          title="Khám phá theo nhu cầu"
          description="Dễ dàng tìm thấy sản phẩm hoàn hảo nhờ bộ lọc thông minh theo giá, chất liệu và kích cỡ."
          href="/danh-muc"
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/danh-muc/${category.slug}`}
              className="group border border-line bg-white transition-shadow hover:shadow-lift"
            >
              <div className="aspect-[3/2] overflow-hidden bg-sand">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                  <CategoryImage
                    categorySlug={category.slug}
                    seed={index}
                    label={category.name}
                  />
                </div>
              </div>
              <div className="p-4">
                <p className="font-display text-base group-hover:text-walnut">
                  {category.name}
                </p>
                <p className="mt-0.5 text-xs text-muted">{category.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>

      {/* ---------------------- 3. Sản phẩm nổi bật ---------------------- */}
      <Reveal as="section" className="border-y border-line bg-white/60 py-14 md:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Nổi bật"
            title="Sản phẩm khách chọn nhiều nhất"
            description="Bán chạy dựa trên số đơn thực tế 90 ngày gần nhất, không phải xếp thủ công."
            href="/danh-muc"
            linkLabel="Xem toàn bộ"
          />

          <FeaturedTabs
            tabs={[
              {
                key: "best",
                label: "Bán chạy",
                count: bestSellers.length,
                content: <ProductGrid products={bestSellers} />,
              },
              {
                key: "new",
                label: "Mới về",
                count: newArrivals.length,
                content: <ProductGrid products={newArrivals} />,
              },
              {
                key: "sale",
                label: "Đang giảm giá",
                count: onSale.length,
                content: <ProductGrid products={onSale} />,
              },
            ]}
          />
        </div>
      </Reveal>

      {/* ------------------ 4. Bộ sưu tập theo không gian ----------------- */}
      <Reveal as="section" className="shell py-14 md:py-20">
        <SectionHeading
          eyebrow="Bộ sưu tập"
          title="Chọn theo không gian trong nhà"
          description="Mỗi bộ sưu tập là các món đã được phối sẵn về tỉ lệ và màu — mua trọn bộ không sợ lệch tông."
          href="/bo-suu-tap"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {roomCollections.slice(0, 2).map((room, index) => (
            <Link
              key={room.slug}
              href={`/bo-suu-tap/${room.slug}`}
              className="group relative overflow-hidden border border-line md:col-span-3 lg:col-span-1"
            >
              <div className="aspect-[3/2] bg-sand transition-transform duration-500 group-hover:scale-105">
                <SceneImage
                  tint={room.tint}
                  seed={index}
                  src={room.image}
                  kind="rooms"
                  slug={room.slug}
                  label={room.name}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5 pt-16 text-white">
                <p className="font-display text-xl">{room.name}</p>
                <p className="mt-1 text-xs text-white/80">{room.tagline}</p>
              </div>
            </Link>
          ))}

          <div className="grid gap-4 sm:grid-cols-3 md:col-span-3 lg:col-span-1 lg:grid-cols-1">
            {roomCollections.slice(2).map((room, index) => (
              <Link
                key={room.slug}
                href={`/bo-suu-tap/${room.slug}`}
                className="group flex items-center gap-4 border border-line bg-white p-3 transition-shadow hover:shadow-soft lg:p-4"
              >
                <div className="h-16 w-20 shrink-0 overflow-hidden bg-sand">
                  <SceneImage
                    tint={room.tint}
                    seed={index + 2}
                    src={room.image}
                  kind="rooms"
                  slug={room.slug}
                    label={room.name}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-[15px] group-hover:text-walnut">
                    {room.name}
                  </p>
                  <p className="truncate text-xs text-muted">{room.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      {/* -------------------------- 5. Cam kết --------------------------- */}
      <Reveal as="section" className="border-y border-line bg-ink py-14 text-white md:py-16">
        <div className="shell">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow mb-2 text-white/60">Cam kết</p>
            <h2 className="text-2xl leading-snug text-white md:text-3xl">
              {site.commitmentHeading}
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {site.commitments.map((item, index) => (
              <div key={item.title} className="border-t border-white/20 pt-5">
                <span className="text-xs text-white/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 font-display text-lg leading-snug">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* --------------------- 6. Đánh giá khách hàng --------------------- */}
      <Reveal as="section" className="shell py-14 md:py-20">
        <SectionHeading
          eyebrow="Khách hàng nói gì"
          title="Nhận xét sau khi nhận hàng và dùng thử"
          description="Chỉ khách đã mua mới được đánh giá. Chúng tôi không xoá đánh giá tiêu cực."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <blockquote
              key={review.name}
              className="border border-line bg-white p-5"
            >
              <div className="flex gap-0.5 text-walnut" aria-label={`${review.rating} trên 5 sao`}>
                {Array.from({ length: review.rating }).map((_, index) => (
                  <svg key={index} width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"
                    />
                  </svg>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">“{review.text}”</p>
              <footer className="mt-4 text-xs">
                <span className="font-semibold">{review.name}</span>
                <span className="text-muted"> · {review.place}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </Reveal>

      {/* ------------------------ 7. CTA tư vấn -------------------------- */}
      <Reveal as="section" className="shell py-14 md:py-20">
        <div className="flex flex-col items-start gap-6 border border-line bg-white p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl">Chưa biết bắt đầu từ đâu?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Gửi mặt bằng hoặc vài tấm ảnh căn nhà, đội tư vấn sẽ gợi ý bố trí và
              danh sách đồ kèm ngân sách dự kiến trong 24 giờ. Hoàn toàn miễn phí và
              không ràng buộc phải mua.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/lien-he" className="btn btn-accent">
              Nhận tư vấn miễn phí
            </Link>
            <a href={site.hotlineHref} className="btn btn-outline">
              Gọi {site.hotline}
            </a>
          </div>
        </div>
      </Reveal>
    </>
  );
}
