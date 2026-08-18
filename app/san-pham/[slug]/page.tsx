import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/data/categories";
import { getProduct, getRelated, products } from "@/lib/data/products";
import {
  careTips,
  finishOf,
  frequentlyBoughtWith,
  installNoteOf,
  qaFor,
  roomFitText,
  styleName,
} from "@/lib/product-info";
import {
  discountPercent,
  formatDimensions,
  formatPrice,
  formatWarranty,
} from "@/lib/format";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { BuyPanel } from "@/components/product/BuyPanel";
import { BundleOffer } from "@/components/product/BundleOffer";
import { ProductGrid } from "@/components/product/ProductCard";
import { Accordion, Tabs } from "@/components/ui/Accordion";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/Section";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };
  const description = `${product.short} ${formatDimensions(product.dimensions)}. Bảo hành ${formatWarranty(product.warrantyMonths)}. Giá ${formatPrice(product.price)}, miễn phí giao và lắp đặt nội thành.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/san-pham/${slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `/san-pham/${slug}`,
    },
  };
}

/** Đánh giá mẫu — thay bằng dữ liệu thật khi nối hệ thống review */
const reviewTemplates = [
  {
    name: "Nguyễn Thanh Tùng",
    days: 12,
    rating: 5,
    text: "Hàng đúng như mô tả, kích thước khớp với số đo trên web nên kê vừa khít chỗ đã tính. Thợ lắp nhanh gọn, dọn sạch trước khi về.",
  },
  {
    name: "Trần Thị Mai",
    days: 34,
    rating: 5,
    text: "Dùng hơn tháng rồi, chưa thấy vấn đề gì. Màu ngoài đời hơi trầm hơn ảnh một chút nhưng lại hợp với nhà mình hơn.",
  },
  {
    name: "Lê Hoàng Nam",
    days: 58,
    rating: 4,
    text: "Chất lượng tốt so với tầm giá. Trừ một sao vì giao chậm hơn hẹn một ngày, có báo trước nên cũng không ảnh hưởng gì.",
  },
];

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getRelated(product, 4);
  const companions = frequentlyBoughtWith(product, 3);
  const discount = discountPercent(product.price, product.oldPrice);
  const fit = roomFitText(product);
  const qa = qaFor(product);
  const care = careTips(product);
  const finish = finishOf(product);

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Sản phẩm", href: "/danh-muc" },
          { label: category?.name ?? "Danh mục", href: `/danh-muc/${product.category}` },
          { label: product.name, href: `/san-pham/${product.slug}` },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Sản phẩm", href: "/danh-muc" },
          { label: category?.name ?? "Danh mục", href: `/danh-muc/${product.category}` },
          { label: product.name },
        ]}
      />

      {/* ================= Above the fold: ảnh + mua hàng ================= */}
      <section className="shell grid gap-10 py-10 lg:grid-cols-2 lg:gap-14 lg:py-14">
        <ProductGallery product={product} />

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/danh-muc/${product.category}`} className="eyebrow hover:underline">
              {category?.name}
            </Link>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs text-muted">
              Phong cách {styleName(product.style)}
            </span>
          </div>

          <h1 className="mt-2 text-3xl leading-tight md:text-4xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <a href="#danh-gia" className="inline-flex items-center gap-1 hover:text-walnut">
              <span className="text-walnut">★</span>
              <strong className="text-ink">{product.rating.toFixed(1)}</strong>
              <span>({product.reviewCount} đánh giá)</span>
            </a>
            <span>Đã bán {product.sold.toLocaleString("vi-VN")}</span>
            <span className={product.inStock ? "text-sage" : "text-clay"}>
              {product.inStock ? "● Còn hàng" : "● Đã bán hết"}
            </span>
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-muted">{product.short}</p>

          {/* Giá */}
          <div className="mt-6 flex flex-wrap items-baseline gap-3 border-y border-line py-5">
            <span className="price text-3xl">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-base text-muted line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="bg-clay px-2 py-0.5 text-xs font-bold text-white">
                  Tiết kiệm {formatPrice(product.oldPrice - product.price)} (−{discount}%)
                </span>
              </>
            )}
            <span className="w-full text-xs text-muted">
              Giá đã gồm VAT, phí giao và lắp đặt nội thành.
            </span>
          </div>

          {/* Thông tin nhanh: bảo hành · giao hàng · lắp đặt */}
          <div className="mt-5 grid grid-cols-3 gap-px border border-line bg-line">
            <div className="bg-white p-3 text-center">
              <p className="text-[11px] text-muted">Bảo hành</p>
              <p className="mt-1 text-sm font-semibold">
                {formatWarranty(product.warrantyMonths)}
              </p>
            </div>
            <div className="bg-white p-3 text-center">
              <p className="text-[11px] text-muted">Thời gian giao</p>
              <p className="mt-1 text-sm font-semibold">
                {product.leadTime.replace("Giao trong ", "").replace("Đặt sản xuất ", "")}
              </p>
            </div>
            <div className="bg-white p-3 text-center">
              <p className="text-[11px] text-muted">Phí lắp đặt</p>
              <p className="mt-1 text-sm font-semibold">
                {installNoteOf(product).replace("Miễn phí — đã gồm trong giá", "Miễn phí")}
              </p>
            </div>
          </div>

          {/* Kích thước & chất liệu ngay trên nút mua */}
          <dl className="mt-4 divide-y divide-line border border-line bg-white text-sm">
            <div className="flex gap-4 px-4 py-3">
              <dt className="w-24 shrink-0 text-muted">Kích thước</dt>
              <dd className="flex-1">{formatDimensions(product.dimensions)}</dd>
            </div>
            <div className="flex gap-4 px-4 py-3">
              <dt className="w-24 shrink-0 text-muted">Chất liệu</dt>
              <dd className="flex-1">{product.materials.join(" · ")}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <BuyPanel product={product} />
          </div>

          <ul className="mt-8 grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-2">
            {[
              "Miễn phí giao & lắp đặt nội thành",
              "Đổi trả trong 7 ngày nếu còn nguyên trạng",
              "Bảo trì miễn phí trọn đời sản phẩm",
              "Trả góp 0% qua thẻ tín dụng",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-muted">
                <span className="mt-0.5 text-sage">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ==================== Chi tiết dạng gập/mở ==================== */}
      <section className="border-t border-line bg-white/60 py-14">
        <div className="shell max-w-4xl">
          <h2 className="mb-6 text-2xl">Thông tin chi tiết</h2>

          <Accordion
            items={[
              {
                id: "mo-ta",
                title: "Mô tả & phù hợp không gian",
                hint: "Sản phẩm này hợp với nhà như thế nào",
                content: (
                  <div className="space-y-4">
                    <p>{product.description}</p>

                    <div>
                      <p className="font-medium text-ink">Phù hợp không gian</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {product.rooms.map((room, index) => (
                          <Link
                            key={room}
                            href={`/bo-suu-tap/${room}`}
                            className="border border-line bg-white px-3 py-1.5 text-xs transition-colors hover:border-walnut hover:text-walnut"
                          >
                            {fit.rooms[index]}
                          </Link>
                        ))}
                      </div>
                      <p className="mt-3">{fit.advice}</p>
                    </div>

                    <p>
                      Chưa chắc kê vừa nhà mình?{" "}{" "}
                      hoặc gửi ảnh cho đội tư vấn kiểm tra giúp.
                    </p>
                  </div>
                ),
              },
              {
                id: "thong-so",
                title: "Thông số kỹ thuật",
                hint: "Kích thước, trọng lượng, tải trọng",
                content: (
                  <table className="w-full border border-line bg-white text-sm">
                    <tbody className="divide-y divide-line">
                      <tr>
                        <th scope="row" className="w-2/5 px-4 py-3 text-left font-normal text-muted">
                          Kích thước (D × R × C)
                        </th>
                        <td className="px-4 py-3 text-ink">
                          {formatDimensions(product.dimensions)}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 text-left font-normal text-muted">
                          Trọng lượng
                        </th>
                        <td className="px-4 py-3 text-ink">{product.weight} kg</td>
                      </tr>
                      {product.loadCapacity && (
                        <tr>
                          <th scope="row" className="px-4 py-3 text-left font-normal text-muted">
                            Tải trọng cho phép
                          </th>
                          <td className="px-4 py-3 text-ink">{product.loadCapacity} kg</td>
                        </tr>
                      )}
                      <tr>
                        <th scope="row" className="px-4 py-3 text-left font-normal text-muted">
                          Phong cách
                        </th>
                        <td className="px-4 py-3 text-ink">{styleName(product.style)}</td>
                      </tr>
                      {product.specs.map((spec) => (
                        <tr key={spec.label}>
                          <th scope="row" className="px-4 py-3 text-left font-normal text-muted">
                            {spec.label}
                          </th>
                          <td className="px-4 py-3 text-ink">{spec.value}</td>
                        </tr>
                      ))}
                      <tr>
                        <th scope="row" className="px-4 py-3 text-left font-normal text-muted">
                          Số màu lựa chọn
                        </th>
                        <td className="px-4 py-3 text-ink">
                          {product.colors.length} màu —{" "}
                          {product.colors.map((color) => color.name).join(", ")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ),
              },
              {
                id: "chat-lieu",
                title: "Chất liệu & hoàn thiện",
                hint: "Gỗ gì, sơn gì, vải gì",
                content: (
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-ink">Chất liệu sử dụng</p>
                      <ul className="mt-2 space-y-2">
                        {product.materials.map((material) => (
                          <li key={material} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-walnut" />
                            {material}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium text-ink">Hoàn thiện bề mặt</p>
                      <ul className="mt-2 space-y-2">
                        {finish.map((line) => (
                          <li key={line} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-walnut" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium text-ink">Bảng màu</p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        {product.colors.map((color) => (
                          <span key={color.name} className="flex items-center gap-2 text-sm">
                            <span
                              className="h-6 w-6 rounded-full border border-line"
                              style={{ backgroundColor: color.hex }}
                            />
                            {color.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="border-l-2 border-walnut bg-white p-3 text-xs">
                      Chúng tôi cam kết vật liệu đúng như công bố ở trên. Nếu kiểm tra thấy
                      sai lệch, bạn được hoàn tiền 100%.
                    </p>
                  </div>
                ),
              },
              {
                id: "bao-quan",
                title: "Hướng dẫn bảo quản",
                hint: "Làm đúng thì dùng được lâu gấp đôi",
                content: (
                  <ul className="space-y-2">
                    {care.map((tip) => (
                      <li key={tip} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-sage">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                id: "van-chuyen",
                title: "Vận chuyển & lắp đặt",
                hint: product.leadTime,
                content: (
                  <div className="space-y-3">
                    <p>
                      <strong className="text-ink">Vận chuyển:</strong> {product.shipping}.{" "}
                      {product.leadTime}.
                    </p>
                    <p>
                      <strong className="text-ink">Phí lắp đặt:</strong>{" "}
                      {installNoteOf(product)}. Kỹ thuật viên mang theo thảm lót sàn, hút
                      bụi khu vực làm việc và mang toàn bộ bao bì đi khi hoàn tất.
                    </p>
                    <p>
                      <strong className="text-ink">Kiện hàng:</strong> nặng {product.weight} kg.
                      Nếu thang máy không đủ kích thước, chúng tôi hỗ trợ khiêng thang bộ
                      miễn phí tới tầng 5; từ tầng 6 phụ thu 50.000đ mỗi tầng mỗi kiện.
                    </p>
                    <p>
                      Bạn có quyền mở kiện kiểm tra trước khi ký nhận. Phát hiện xước hay
                      móp do vận chuyển thì báo ngay tại chỗ, chúng tôi mang về đổi mới.
                    </p>
                    <p>
                      Chi tiết đầy đủ tại{" "}
                      <Link href="/chinh-sach/giao-hang-lap-dat" className="text-walnut underline">
                        chính sách giao hàng &amp; lắp đặt
                      </Link>
                      .
                    </p>
                  </div>
                ),
              },
              {
                id: "bao-hanh",
                title: "Bảo hành & đổi trả",
                hint: formatWarranty(product.warrantyMonths),
                content: (
                  <div className="space-y-3">
                    <p>
                      <strong className="text-ink">Bảo hành:</strong>{" "}
                      {formatWarranty(product.warrantyMonths)} cho lỗi kết cấu và lỗi nhà
                      sản xuất. Hoá đơn mua hàng chính là phiếu bảo hành — bạn chỉ cần đọc
                      số điện thoại đặt hàng, không phải giữ giấy tờ.
                    </p>
                    <p>
                      <strong className="text-ink">Bảo trì trọn đời:</strong> hết hạn bảo
                      hành chúng tôi vẫn siết ốc, chỉnh cánh và cân chân miễn phí tại nội
                      thành Gia Lai – TP.HCM, bạn chỉ trả tiền linh kiện nếu phải thay.
                    </p>
                    <p>
                      <strong className="text-ink">Đổi trả:</strong> trong 7 ngày với hàng
                      còn nguyên trạng, chưa qua sử dụng, còn đủ bao bì. Hàng lỗi do nhà
                      sản xuất được đổi mới hoặc hoàn tiền 100%, chúng tôi chịu phí vận
                      chuyển hai chiều.
                    </p>
                    <p className="text-xs">
                      Lưu ý: sản phẩm đặt sản xuất riêng theo yêu cầu không áp dụng đổi trả.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-1">
                      <Link href="/chinh-sach/bao-hanh" className="text-walnut underline">
                        Chính sách bảo hành
                      </Link>
                      <Link href="/chinh-sach/doi-tra" className="text-walnut underline">
                        Chính sách đổi trả
                      </Link>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* ===================== Thường mua kèm ===================== */}
      {companions.length > 0 && (
        <section className="shell max-w-4xl py-12">
          <BundleOffer product={product} companions={companions} />
        </section>
      )}

      {/* ===================== Đánh giá & Hỏi đáp ===================== */}
      <section id="danh-gia" className="border-t border-line py-14 scroll-mt-24">
        <div className="shell max-w-4xl">
          <Tabs
            tabs={[
              {
                key: "review",
                label: "Đánh giá",
                count: product.reviewCount,
                content: (
                  <div>
                    <div className="mb-6 flex flex-wrap items-center gap-6 border border-line bg-white p-5">
                      <div className="text-center">
                        <p className="price text-4xl">
                          {product.rating.toFixed(1)}
                        </p>
                        <div className="mt-1 flex justify-center gap-0.5 text-walnut">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span
                              key={index}
                              className={index < Math.round(product.rating) ? "" : "opacity-25"}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-muted">{product.reviewCount} đánh giá</p>
                      </div>
                      <p className="flex-1 text-sm leading-relaxed text-muted">
                        Chỉ khách đã mua hàng mới đánh giá được. Chúng tôi không xoá đánh
                        giá tiêu cực — nếu có vấn đề, đội chăm sóc sẽ trả lời công khai
                        ngay dưới đánh giá đó.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      {reviewTemplates.map((review) => (
                        <blockquote key={review.name} className="border border-line bg-white p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex gap-0.5 text-walnut" aria-label={`${review.rating}/5 sao`}>
                              {Array.from({ length: 5 }).map((_, index) => (
                                <span key={index} className={index < review.rating ? "" : "opacity-25"}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-muted">{review.days} ngày trước</span>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-muted">
                            “{review.text}”
                          </p>
                          <footer className="mt-4 flex items-center gap-2 text-xs">
                            <span className="font-semibold">{review.name}</span>
                            <span className="text-sage">✓ Đã mua hàng</span>
                          </footer>
                        </blockquote>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                key: "qa",
                label: "Hỏi đáp",
                count: qa.length,
                content: (
                  <div>
                    <dl className="divide-y divide-line border-y border-line">
                      {qa.map((item) => (
                        <div key={item.question} className="py-5">
                          <dt className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-ink text-[10px] font-bold text-white">
                              H
                            </span>
                            <span className="font-medium">{item.question}</span>
                          </dt>
                          <dd className="mt-3 flex items-start gap-3">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-walnut text-[10px] font-bold text-white">
                              Đ
                            </span>
                            <span className="text-sm leading-relaxed text-muted">
                              {item.answer}
                            </span>
                          </dd>
                          <p className="mt-2 pl-8 text-xs text-muted">
                            {item.asker} hỏi {item.daysAgo} ngày trước · Nội thất HT trả lời
                          </p>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-line bg-sand p-5">
                      <p className="text-sm text-muted">
                        Câu hỏi của bạn chưa có ở đây? Chúng tôi trả lời trong 24 giờ.
                      </p>
                      <div className="flex gap-3">
                        <Link href={`/lien-he?sp=${product.slug}`} className="btn btn-accent">
                          Đặt câu hỏi
                        </Link>
                        <a href="tel:0931619177" className="btn btn-outline">
                          Gọi 0931 619 177
                        </a>
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* ===================== Sản phẩm liên quan ===================== */}
      {related.length > 0 && (
        <section className="border-t border-line bg-sand py-14">
          <div className="shell">
            <SectionHeading
              eyebrow="Gợi ý"
              title="Khách xem sản phẩm này cũng quan tâm"
              href={`/danh-muc/${product.category}`}
              linkLabel={`Xem tất cả ${category?.name.toLowerCase()}`}
            />
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  );
}
