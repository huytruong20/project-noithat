"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductImage, galleryLength, viewLabels } from "@/components/ui/ProductImage";
import { discountPercent } from "@/lib/format";

export function ProductGallery({ product }: { product: Product }) {
  const total = galleryLength(product);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const discount = discountPercent(product.price, product.oldPrice);

  const step = (delta: number) =>
    setActive((current) => (current + delta + total) % total);

  // Điều khiển lớp phóng to bằng bàn phím
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomed, total]);

  return (
    <div className="lg:sticky lg:top-28">
      <div className="group relative aspect-square overflow-hidden border border-line bg-white">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="h-full w-full cursor-zoom-in"
          aria-label="Phóng to ảnh sản phẩm"
        >
          <ProductImage product={product} view={active} priority />
        </button>

        <div className="pointer-events-none absolute left-0 top-4 flex flex-col items-start gap-1">
          {discount > 0 && (
            <span className="bg-clay px-2.5 py-1 text-xs font-bold text-white">
              Giảm {discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-ink px-2.5 py-1 text-xs font-bold text-white">Mới về</span>
          )}
          {product.isBestSeller && (
            <span className="bg-walnut px-2.5 py-1 text-xs font-bold text-white">
              Bán chạy
            </span>
          )}
        </div>

        {/* Nút chuyển ảnh, hiện khi rê chuột */}
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Ảnh trước"
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-line bg-bone/90 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Ảnh tiếp theo"
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-line bg-bone/90 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
        >
          ›
        </button>

        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 bg-ink/75 px-2 py-1 text-[11px] text-white">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 5v4M5 7h4M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Bấm để phóng to
        </span>
      </div>

      {/* Bốn góc chụp chuẩn: tổng thể, góc nghiêng, cận chất liệu, trong không gian */}
      <div className="mt-3 grid grid-cols-4 gap-3">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Xem ảnh ${viewLabels[index % viewLabels.length]}`}
            aria-current={active === index}
            className="text-left"
          >
            <span
              className={`block aspect-square overflow-hidden border bg-white transition-colors ${
                active === index ? "border-walnut" : "border-line hover:border-muted"
              }`}
            >
              <ProductImage product={product} view={index} />
            </span>
            <span
              className={`mt-1.5 block text-center text-[11px] ${
                active === index ? "text-walnut" : "text-muted"
              }`}
            >
              {viewLabels[index % viewLabels.length]}
            </span>
          </button>
        ))}
      </div>

      {/* Lớp phủ phóng to */}
      {zoomed && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-ink/95">
          <div className="flex items-center justify-between px-4 py-3 text-white md:px-6">
            <p className="text-sm">
              {product.name}
              <span className="ml-3 text-white/60">
                {active + 1}/{total}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setZoomed(false)}
              aria-label="Đóng ảnh phóng to"
              className="p-2 text-white/80 hover:text-white"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center p-4 md:p-10">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Ảnh trước"
              className="absolute left-2 flex h-11 w-11 items-center justify-center text-2xl text-white/70 hover:text-white md:left-6"
            >
              ‹
            </button>

            <div className="max-h-full w-full max-w-lg overflow-hidden bg-white">
              <div className="aspect-square">
                <ProductImage product={product} view={active} priority />
              </div>
            </div>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Ảnh tiếp theo"
              className="absolute right-2 flex h-11 w-11 items-center justify-center text-2xl text-white/70 hover:text-white md:right-6"
            >
              ›
            </button>
          </div>

          <div className="flex justify-center gap-2 px-4 pb-6">
            {Array.from({ length: total }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Xem ảnh ${index + 1}`}
                className={`overflow-hidden border bg-white transition-opacity ${
                  active === index ? "border-white" : "border-white/30 opacity-50"
                }`}
              >
                <div className="aspect-square w-14">
                  <ProductImage product={product} view={index} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
