"use client";

import { useCart } from "@/lib/cart";

/** Nút thêm nhanh trên thẻ sản phẩm — lấy màu đầu tiên làm mặc định */
export function QuickAdd({
  slug,
  color,
  label = "Thêm vào giỏ",
}: {
  slug: string;
  color: string;
  label?: string;
}) {
  const { add } = useCart();
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        add(slug, 1, color);
      }}
      className="w-full bg-ink py-2.5 text-xs font-semibold text-white transition-colors hover:bg-walnut"
    >
      {label}
    </button>
  );
}
