"use client";

import Link from "next/link";
import { useState } from "react";
import {
  findOrders,
  orderStatusLabels,
  orderSteps,
  type Order,
} from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function OrderLookupPage() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Order[] | null>(null);

  function search(event: React.FormEvent) {
    event.preventDefault();
    setResults(findOrders(keyword));
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Tra cứu đơn hàng" }]} />

      <section className="shell max-w-3xl py-10 md:py-14">
        <p className="eyebrow mb-2">Sau khi mua</p>
        <h1 className="text-3xl md:text-4xl">Tra cứu đơn hàng</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Nhập mã đơn (dạng HT-XXXXXX) hoặc số điện thoại bạn đã dùng khi đặt hàng.
          Không cần đăng nhập.
        </p>

        <form onSubmit={search} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="field flex-1"
            placeholder="HT-8F2K31 hoặc 0912345678"
            aria-label="Mã đơn hàng hoặc số điện thoại"
          />
          <button type="submit" className="btn btn-accent shrink-0">
            Tra cứu
          </button>
        </form>

        {results !== null && results.length === 0 && (
          <div className="mt-8 border border-dashed border-line bg-white p-8 text-center">
            <p className="font-display text-lg">Không tìm thấy đơn hàng nào</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              Kiểm tra lại mã đơn hoặc số điện thoại. Đơn đặt qua điện thoại với nhân
              viên có thể chưa hiện ở đây — gọi{" "}
              <a href={site.hotlineHref} className="font-semibold text-walnut">
                {site.hotline}
              </a>{" "}
              để được tra giúp.
            </p>
          </div>
        )}

        {results?.map((order) => {
          const stepIndex = orderSteps.indexOf(order.status);
          return (
            <article key={order.code} className="mt-8 border border-line bg-white">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-6">
                <div>
                  <p className="text-xs text-muted">Mã đơn hàng</p>
                  <p className="price text-2xl">{order.code}</p>
                  <p className="mt-1 text-xs text-muted">
                    Đặt ngày{" "}
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">Tổng tiền</p>
                  <p className="price text-2xl">
                    {formatPrice(order.total)}
                  </p>
                  {order.discount ? (
                    <p className="mt-1 text-xs text-sage">
                      Đã giảm {formatPrice(order.discount)} bằng mã {order.voucherCode}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-muted">{order.payment}</p>
                </div>
              </div>

              {/* Tiến trình đơn */}
              <div className="border-b border-line p-6">
                <ol className="grid gap-3 sm:grid-cols-4">
                  {orderSteps.map((step, index) => {
                    const done = index <= stepIndex;
                    return (
                      <li key={step}>
                        <div
                          className={`h-1 w-full ${done ? "bg-walnut" : "bg-line"}`}
                          aria-hidden="true"
                        />
                        <p
                          className={`mt-2 text-xs ${
                            done ? "font-medium text-ink" : "text-muted"
                          }`}
                        >
                          {orderStatusLabels[step]}
                        </p>
                      </li>
                    );
                  })}
                </ol>
                {order.quick && (
                  <p className="mt-4 border border-line bg-sand p-3 text-xs text-muted">
                    Đây là đơn đặt nhanh. Nhân viên sẽ gọi xác nhận địa chỉ và phương
                    thức thanh toán trước khi giao.
                  </p>
                )}
              </div>

              <div className="divide-y divide-line">
                {order.items.map((item) => (
                  <div
                    key={`${item.slug}-${item.color}`}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/san-pham/${item.slug}`}
                        className="text-sm font-medium hover:text-walnut"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted">
                        Màu {item.color} · SL {item.quantity}
                      </p>
                      {item.note && (
                        <p className="mt-0.5 text-xs italic text-walnut">“{item.note}”</p>
                      )}
                    </div>
                    <p className="shrink-0 text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-1 border-t border-line bg-sand p-6 text-sm">
                <p>
                  <span className="text-muted">Người nhận:</span>{" "}
                  {order.customer.name} · {order.customer.phone}
                </p>
                {order.customer.address && (
                  <p>
                    <span className="text-muted">Địa chỉ:</span> {order.customer.address}
                  </p>
                )}
                {order.customer.note && (
                  <p>
                    <span className="text-muted">Ghi chú:</span> {order.customer.note}
                  </p>
                )}
                <p className="pt-2 text-xs text-muted">
                  Cần đổi địa chỉ hay lịch giao? Gọi {site.hotline}, báo trước 24 giờ là
                  đổi được miễn phí.
                </p>
              </div>
            </article>
          );
        })}

        <div className="mt-10 border border-line bg-sand p-6">
          <p className="font-display text-lg">Đơn hàng được lưu ở đâu?</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Bản dựng này lưu đơn ngay trên trình duyệt của bạn để bạn xem thử luồng tra
            cứu. Khi nối với hệ thống bán hàng thật, chỉ cần thay hai hàm trong{" "}
            <code className="bg-white px-1 py-0.5 text-xs">lib/orders.ts</code> bằng lời
            gọi API — phần giao diện giữ nguyên.
          </p>
        </div>
      </section>
    </>
  );
}
