"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice, formatDimensions, formatWarranty } from "@/lib/format";
import { getBestSellers } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductImage } from "@/components/ui/ProductImage";
import { ProductCard } from "@/components/product/ProductCard";
import { VoucherBox } from "@/components/cart/VoucherBox";

export default function CartPage() {
  const {
    lines,
    subtotal,
    savings,
    count,
    setQuantity,
    setNote,
    remove,
    ready,
    voucher,
    voucherDiscount,
    applyVoucher,
    removeVoucher,
  } = useCart();
  const suggestions = getBestSellers(4);
  const [openNote, setOpenNote] = useState<string | null>(null);

  return (
    <>
      <Breadcrumbs items={[{ label: "Giỏ hàng" }]} />

      <section className="shell py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl">Giỏ hàng</h1>
        <p className="mt-2 text-sm text-muted">
          {ready && count > 0
            ? `${count} món trong giỏ`
            : "Kiểm tra lại đơn hàng trước khi thanh toán"}
        </p>

        {!ready ? (
          <div className="mt-10 h-40 animate-pulse border border-line bg-white/60" />
        ) : lines.length === 0 ? (
          <div className="mt-10 border border-dashed border-line bg-white py-16 text-center">
            <p className="font-display text-xl">Giỏ hàng đang trống</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              Bạn chưa chọn món nào. Xem thử những mẫu bán chạy dưới đây, hoặc gọi
              0931 619 177 để được tư vấn theo diện tích nhà bạn.
            </p>
            <Link href="/danh-muc" className="btn btn-primary mt-6">
              Bắt đầu chọn đồ
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
            {/* Danh sách sản phẩm */}
            <div className="divide-y divide-line border-y border-line">
              {lines.map((line) => (
                <div
                  key={`${line.slug}-${line.color}`}
                  className="flex gap-4 py-5 sm:gap-6"
                >
                  <Link
                    href={`/san-pham/${line.slug}`}
                    className="h-24 w-28 shrink-0 overflow-hidden border border-line bg-white sm:h-28 sm:w-36"
                  >
                    <ProductImage product={line.product} />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          href={`/san-pham/${line.slug}`}
                          className="font-display text-[15px] hover:text-walnut sm:text-base"
                        >
                          {line.product.name}
                        </Link>
                        <p className="mt-1 text-xs text-muted">
                          Màu: {line.color} · {formatDimensions(line.product.dimensions)}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {line.product.leadTime} · Bảo hành{" "}
                          {formatWarranty(line.product.warrantyMonths)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.slug, line.color)}
                        className="shrink-0 text-xs text-muted underline hover:text-clay"
                      >
                        Xoá
                      </button>
                    </div>

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                      <div className="flex items-center border border-line bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(line.slug, line.color, line.quantity - 1)
                          }
                          className="px-3 py-1.5 leading-none hover:text-walnut"
                          aria-label={`Giảm số lượng ${line.product.name}`}
                        >
                          −
                        </button>
                        <span className="w-10 border-x border-line py-1.5 text-center text-sm">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(line.slug, line.color, line.quantity + 1)
                          }
                          className="px-3 py-1.5 leading-none hover:text-walnut"
                          aria-label={`Tăng số lượng ${line.product.name}`}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="price text-lg">
                          {formatPrice(line.lineTotal)}
                        </p>
                        {line.quantity > 1 && (
                          <p className="text-xs text-muted">
                            {formatPrice(line.product.price)} × {line.quantity}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Ghi chú riêng cho dòng hàng: yêu cầu về màu, kích thước, lắp đặt */}
                    <div className="pt-3">
                      {openNote === `${line.slug}-${line.color}` || line.note ? (
                        <label className="block">
                          <span className="mb-1 block text-xs text-muted">
                            Ghi chú cho món này (màu, kích thước, yêu cầu lắp đặt)
                          </span>
                          <textarea
                            value={line.note ?? ""}
                            onChange={(event) =>
                              setNote(line.slug, line.color, event.target.value)
                            }
                            rows={2}
                            maxLength={300}
                            className="field resize-y text-sm"
                            placeholder="Ví dụ: muốn màu đậm hơn ảnh, hoặc cần lắp quay tay vịn sang trái."
                          />
                        </label>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setOpenNote(`${line.slug}-${line.color}`)}
                          className="text-xs text-muted underline underline-offset-2 hover:text-walnut"
                        >
                          + Thêm ghi chú cho món này
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tóm tắt đơn hàng */}
            <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <div className="border border-line bg-white p-6">
                <h2 className="font-display text-xl">Tóm tắt đơn hàng</h2>

                {/* Mã giảm giá */}
                <div className="mt-5 border-b border-line pb-5">
                  <VoucherBox />
                </div>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Tạm tính ({count} món)</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between text-sage">
                      <dt>Mã {voucher?.code}</dt>
                      <dd>−{formatPrice(voucherDiscount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted">Phí giao &amp; lắp đặt</dt>
                    <dd className="text-right text-xs text-muted">
                      {voucher?.freeShipping ? "Miễn phí" : "Tính ở bước thanh toán"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="price text-2xl">
                    {formatPrice(subtotal - voucherDiscount)}
                  </span>
                </div>

                {/*
                  Khoản tiết kiệm nhờ giá khuyến mãi đã nằm trong giá bán, không
                  trừ thêm lần nữa — nên hiển thị như một ghi chú dưới tổng tiền.
                */}
                {savings > 0 && (
                  <p className="mt-2 text-xs text-sage">
                    Bạn tiết kiệm {formatPrice(savings)} so với giá gốc.
                  </p>
                )}

                <Link href="/thanh-toan" className="btn btn-accent mt-5 w-full">
                  Tiến hành thanh toán
                </Link>
                <Link
                  href="/danh-muc"
                  className="mt-3 block text-center text-sm text-muted hover:text-walnut"
                >
                  Tiếp tục mua sắm
                </Link>

                <ul className="mt-6 space-y-2 border-t border-line pt-5 text-xs text-muted">
                  <li>✓ Miễn phí giao &amp; lắp đặt nội thành Gia Lai – TP.HCM</li>
                  <li>✓ Đổi trả trong 7 ngày nếu còn nguyên trạng</li>
                  <li>✓ Trả góp 0% qua thẻ tín dụng 12 ngân hàng</li>
                </ul>
              </div>

              <div className="mt-4 border border-line bg-sand p-5 text-sm">
                <p className="font-semibold">Cần tư vấn thêm?</p>
                <p className="mt-1 leading-relaxed text-muted">
                  Gọi <a href="tel:0931619177" className="font-semibold text-walnut">0931 619 177</a>{" "}
                  (8:00 – 20:00) để kiểm tra kích thước và lịch giao trước khi đặt.
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>

      {/* Gợi ý mua thêm */}
      <section className="border-t border-line bg-sand py-14">
        <div className="shell">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Có thể bạn cần</p>
              <h2 className="text-2xl">Khách thường mua kèm</h2>
            </div>
            <Link href="/danh-muc" className="text-sm font-semibold text-walnut hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {suggestions.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
