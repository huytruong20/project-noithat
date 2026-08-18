"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { getProduct } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";

/** Thông báo trượt lên góc màn hình sau khi thêm vào giỏ */
export function CartFlash() {
  const { flash, dismissFlash, count, subtotal } = useCart();
  if (!flash) return null;

  const product = getProduct(flash.slug);
  if (!product) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[60] w-[calc(100vw-2rem)] max-w-sm border border-line bg-white shadow-lift"
    >
      <div className="flex items-start gap-3 p-4">
        <div className="h-16 w-20 shrink-0 overflow-hidden bg-sand">
          <ProductImage product={product} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-sage">✓ Đã thêm vào giỏ</p>
          <p className="mt-0.5 truncate text-sm font-medium">{product.name}</p>
          <p className="text-xs text-muted">
            {flash.color} · SL {flash.quantity} · {formatPrice(product.price)}
          </p>
        </div>
        <button
          type="button"
          onClick={dismissFlash}
          aria-label="Đóng thông báo"
          className="-mr-1 -mt-1 p-1 text-muted hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-between border-t border-line bg-sand px-4 py-2.5 text-xs">
        <span className="text-muted">
          Giỏ hàng: {count} món · <strong className="text-ink">{formatPrice(subtotal)}</strong>
        </span>
        <Link href="/gio-hang" className="font-semibold text-walnut hover:underline">
          Xem giỏ hàng →
        </Link>
      </div>
    </div>
  );
}
