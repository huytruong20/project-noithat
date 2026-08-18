"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { formatPrice, makeOrderCode } from "@/lib/format";
import { saveOrder } from "@/lib/orders";

export function BuyPanel({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const [color, setColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [quickOpen, setQuickOpen] = useState(false);

  function buyNow() {
    add(product.slug, quantity, color);
    router.push("/thanh-toan");
  }

  return (
    <div className="space-y-6">
      {/* Chọn màu */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-sm font-semibold">
            Màu sắc:{" "}
            <span className="font-normal text-muted">{color}</span>
          </p>
          <span className="text-xs text-muted">{product.colors.length} lựa chọn</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((option) => (
            <button
              key={option.name}
              type="button"
              onClick={() => setColor(option.name)}
              aria-pressed={color === option.name}
              className={`flex items-center gap-2 border px-3 py-2 text-sm transition-colors ${
                color === option.name
                  ? "border-walnut bg-walnut/10"
                  : "border-line hover:border-muted"
              }`}
            >
              <span
                className="h-4 w-4 rounded-full border border-line"
                style={{ backgroundColor: option.hex }}
              />
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Số lượng */}
      <div>
        <p className="mb-2 text-sm font-semibold">Số lượng</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-line bg-white">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="px-3.5 py-2.5 text-lg leading-none hover:text-walnut"
              aria-label="Giảm số lượng"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  Math.min(99, Math.max(1, Number(event.target.value) || 1)),
                )
              }
              className="w-14 border-x border-line py-2.5 text-center text-sm outline-none"
              aria-label="Số lượng"
            />
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(99, value + 1))}
              className="px-3.5 py-2.5 text-lg leading-none hover:text-walnut"
              aria-label="Tăng số lượng"
            >
              +
            </button>
          </div>
          <p className="text-sm text-muted">
            Tạm tính:{" "}
            <strong className="text-ink">
              {formatPrice(product.price * quantity)}
            </strong>
          </p>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => add(product.slug, quantity, color)}
            disabled={!product.inStock}
            className="btn btn-outline w-full"
          >
            Thêm vào giỏ
          </button>
          <button
            type="button"
            onClick={buyNow}
            disabled={!product.inStock}
            className="btn btn-accent w-full"
          >
            Mua ngay
          </button>
        </div>

        <button
          type="button"
          onClick={() => setQuickOpen(true)}
          className="w-full border border-dashed border-walnut/50 py-3 text-sm font-semibold text-walnut transition-colors hover:bg-walnut/5"
        >
          Đặt hàng nhanh — chỉ cần tên &amp; số điện thoại
        </button>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1 text-sm">
          <Link
            href={`/lien-he?sp=${product.slug}`}
            className="inline-flex items-center gap-1.5 font-medium text-muted underline-offset-4 hover:text-walnut hover:underline"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M21 12a8 8 0 11-3.2-6.4M21 5v4h-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Nhận tư vấn sản phẩm này
          </Link>
          <a
            href="tel:0931619177"
            className="inline-flex items-center gap-1.5 font-medium text-muted underline-offset-4 hover:text-walnut hover:underline"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 4h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            Gọi 0931 619 177
          </a>
        </div>

        {!product.inStock && (
          <p className="text-center text-sm text-clay">
            Sản phẩm đã bán hết. Để lại số điện thoại, chúng tôi báo ngay khi có
            hàng về đợt mới.
          </p>
        )}
      </div>

      {quickOpen && (
        <QuickOrderDialog
          product={product}
          color={color}
          quantity={quantity}
          onClose={() => setQuickOpen(false)}
        />
      )}
    </div>
  );
}

/* --------------------------- Đặt hàng nhanh --------------------------- */

function QuickOrderDialog({
  product,
  color,
  quantity,
  onClose,
}: {
  product: Product;
  color: string;
  quantity: number;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (name.trim().length < 2) {
      setError("Vui lòng nhập họ tên.");
      return;
    }
    if (digits.length < 9 || digits.length > 11) {
      setError("Số điện thoại chưa đúng. Ví dụ: 0912 345 678.");
      return;
    }

    const orderCode = makeOrderCode();
    const total = product.price * quantity;
    saveOrder({
      code: orderCode,
      createdAt: new Date().toISOString(),
      status: "cho-xac-nhan",
      customer: { name: name.trim(), phone: phone.trim(), note: note.trim() },
      items: [
        {
          slug: product.slug,
          color,
          quantity,
          name: product.name,
          price: product.price,
        },
      ],
      subtotal: total,
      shipping: 0,
      total,
      payment: "Nhân viên tư vấn xác nhận qua điện thoại",
      quick: true,
    });
    setError(null);
    setCode(orderCode);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/50"
        onClick={onClose}
        aria-label="Đóng"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Đặt hàng nhanh"
        className="relative w-full max-w-md border border-line bg-bone p-6 shadow-lift"
      >
        {code ? (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-xl">Đã nhận yêu cầu đặt hàng</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Mã đơn của bạn là{" "}
              <strong className="text-ink">{code}</strong>. Nhân viên sẽ gọi xác nhận
              trong 30 phút (giờ làm việc 8:00 – 20:00) để chốt địa chỉ và lịch giao.
            </p>
            <div className="mt-6 grid gap-2">
              <a href="/tra-cuu-don" className="btn btn-primary w-full">
                Tra cứu đơn hàng
              </a>
              <button type="button" onClick={onClose} className="btn btn-outline w-full">
                Tiếp tục xem sản phẩm
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl">Đặt hàng nhanh</h3>
                <p className="mt-1 text-sm text-muted">
                  Không cần điền địa chỉ. Chúng tôi gọi lại để chốt trong 30 phút.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng"
                className="-mr-1 -mt-1 p-1 text-muted hover:text-ink"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
            </div>

            <div className="mt-5 border border-line bg-white p-3 text-sm">
              <p className="font-medium">{product.name}</p>
              <p className="mt-0.5 text-xs text-muted">
                Màu {color} · Số lượng {quantity}
              </p>
              <p className="mt-2 price text-lg">
                {formatPrice(product.price * quantity)}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="quick-name" className="mb-1 block text-sm font-medium">
                  Họ và tên <span className="text-clay">*</span>
                </label>
                <input
                  id="quick-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="field"
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="quick-phone" className="mb-1 block text-sm font-medium">
                  Số điện thoại <span className="text-clay">*</span>
                </label>
                <input
                  id="quick-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="field"
                  placeholder="0912 345 678"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor="quick-note" className="mb-1 block text-sm font-medium">
                  Ghi chú <span className="font-normal text-muted">(không bắt buộc)</span>
                </label>
                <input
                  id="quick-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="field"
                  placeholder="Gọi sau 18h giúp mình"
                />
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-clay">{error}</p>}

            <button type="submit" className="btn btn-accent mt-5 w-full">
              Gửi yêu cầu đặt hàng
            </button>
            <p className="mt-3 text-center text-xs text-muted">
              Gửi yêu cầu chưa phải thanh toán. Bạn có thể huỷ khi nhân viên gọi lại.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
