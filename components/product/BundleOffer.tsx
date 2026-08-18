"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * "Thường mua kèm" — chọn nhanh vài món đi cùng rồi thêm cả cụm vào giỏ
 * trong một lần bấm, thay vì phải vào từng trang sản phẩm.
 */
export function BundleOffer({
  product,
  companions,
}: {
  product: Product;
  companions: Product[];
}) {
  const { add } = useCart();
  const [picked, setPicked] = useState<string[]>(companions.map((item) => item.slug));
  const [added, setAdded] = useState(false);

  if (companions.length === 0) return null;

  const chosen = companions.filter((item) => picked.includes(item.slug));
  const total = product.price + chosen.reduce((sum, item) => sum + item.price, 0);
  const separate = product.price + companions.reduce((sum, item) => sum + item.price, 0);

  const toggle = (slug: string) =>
    setPicked((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );

  function addAll() {
    add(product.slug, 1, product.colors[0].name);
    chosen.forEach((item) => add(item.slug, 1, item.colors[0].name));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 3000);
  }

  const row = (item: Product, isMain: boolean) => (
    <div
      key={item.slug}
      className={`flex items-center gap-3 border border-line bg-white p-3 ${
        !isMain && !picked.includes(item.slug) ? "opacity-50" : ""
      }`}
    >
      {isMain ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center bg-walnut text-[10px] text-white">
          ✓
        </span>
      ) : (
        <input
          type="checkbox"
          checked={picked.includes(item.slug)}
          onChange={() => toggle(item.slug)}
          className="h-4 w-4 shrink-0 accent-[#8a5a3b]"
          aria-label={`Chọn ${item.name}`}
        />
      )}

      <div className="h-14 w-16 shrink-0 overflow-hidden bg-sand">
        <ProductImage product={item} />
      </div>

      <div className="min-w-0 flex-1">
        {isMain ? (
          <p className="truncate text-sm font-medium">{item.name}</p>
        ) : (
          <Link
            href={`/san-pham/${item.slug}`}
            className="block truncate text-sm font-medium hover:text-walnut"
          >
            {item.name}
          </Link>
        )}
        <p className="text-xs text-muted">
          {isMain ? "Sản phẩm đang xem" : item.short}
        </p>
      </div>

      <p className="shrink-0 text-sm font-semibold">{formatPrice(item.price)}</p>
    </div>
  );

  return (
    <div className="border border-line bg-sand p-6">
      <p className="eyebrow mb-1">Thường mua kèm</p>
      <h3 className="font-display text-xl">Khách mua món này hay lấy thêm</h3>
      <p className="mt-1 text-sm text-muted">
        Bỏ tích món không cần, rồi thêm cả cụm vào giỏ trong một lần bấm.
      </p>

      <div className="mt-5 space-y-2">
        {row(product, true)}
        {companions.map((item) => row(item, false))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <div>
          <p className="text-xs text-muted">
            Tổng {chosen.length + 1} món
            {chosen.length < companions.length && ` (đã bỏ ${companions.length - chosen.length})`}
          </p>
          <p className="price text-2xl">{formatPrice(total)}</p>
          {chosen.length === companions.length && separate > total && (
            <p className="text-xs text-muted">
              Mua rời từng món: {formatPrice(separate)}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={addAll}
          className={`btn ${added ? "btn-outline" : "btn-accent"}`}
        >
          {added ? "✓ Đã thêm vào giỏ" : `Thêm ${chosen.length + 1} món vào giỏ`}
        </button>
      </div>
    </div>
  );
}
