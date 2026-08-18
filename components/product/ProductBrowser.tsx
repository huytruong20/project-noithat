"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { sizeBuckets, sizeOf, styles } from "@/lib/product-info";

/* ------------------------------ Nhóm bộ lọc ------------------------------ */

const priceBuckets = [
  { key: "duoi-3", label: "Dưới 3 triệu", test: (v: number) => v < 3_000_000 },
  { key: "3-8", label: "3 – 8 triệu", test: (v: number) => v >= 3_000_000 && v < 8_000_000 },
  { key: "8-15", label: "8 – 15 triệu", test: (v: number) => v >= 8_000_000 && v < 15_000_000 },
  { key: "15-25", label: "15 – 25 triệu", test: (v: number) => v >= 15_000_000 && v < 25_000_000 },
  { key: "tren-25", label: "Trên 25 triệu", test: (v: number) => v >= 25_000_000 },
];

const materialGroups = [
  { key: "go-tu-nhien", label: "Gỗ tự nhiên", pattern: /sồi|óc chó|cao su|thông|me tây/i },
  { key: "go-cong-nghiep", label: "Gỗ công nghiệp", pattern: /mdf|melamine|veneer/i },
  { key: "vai", label: "Vải & nỉ", pattern: /vải|nỉ|nhung|linen|len|lưới/i },
  { key: "da", label: "Da", pattern: /\bda\b|microfiber/i },
  { key: "kim-loai", label: "Kim loại", pattern: /thép|nhôm|đồng|gang|sắt/i },
  { key: "kinh-da", label: "Kính, đá & gốm", pattern: /kính|ceramic|đá|gốm/i },
];

const sortOptions = [
  { key: "pho-bien", label: "Phổ biến nhất" },
  { key: "moi-nhat", label: "Mới nhất" },
  { key: "gia-tang", label: "Giá thấp → cao" },
  { key: "gia-giam", label: "Giá cao → thấp" },
  { key: "danh-gia", label: "Đánh giá cao nhất" },
];

function materialsOf(product: Product) {
  return product.materials.join(" ");
}

/* ------------------------------- Giao diện ------------------------------- */

function CheckboxRow({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count: number;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2.5 py-1.5 text-sm ${
        count === 0 ? "opacity-40" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={count === 0 && !checked}
        className="h-4 w-4 accent-[#8a5a3b]"
      />
      <span className="flex-1">{label}</span>
      <span className="text-xs text-muted">{count}</span>
    </label>
  );
}

export function ProductBrowser({ products }: { products: Product[] }) {
  const [sort, setSort] = useState("pho-bien");
  const [prices, setPrices] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [styleFilter, setStyleFilter] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const colorOptions = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((product) =>
      product.colors.forEach((color) => map.set(color.name, color.hex)),
    );
    return Array.from(map, ([name, hex]) => ({ name, hex }));
  }, [products]);

  const toggle = (
    value: string,
    list: string[],
    setter: (next: string[]) => void,
  ) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      if (inStockOnly && !product.inStock) return false;

      if (prices.length) {
        const match = priceBuckets
          .filter((bucket) => prices.includes(bucket.key))
          .some((bucket) => bucket.test(product.price));
        if (!match) return false;
      }

      if (materials.length) {
        const text = materialsOf(product);
        const match = materialGroups
          .filter((group) => materials.includes(group.key))
          .some((group) => group.pattern.test(text));
        if (!match) return false;
      }

      if (colors.length) {
        const match = product.colors.some((color) => colors.includes(color.name));
        if (!match) return false;
      }

      if (sizes.length) {
        const match = sizeBuckets
          .filter((bucket) => sizes.includes(bucket.key))
          .some((bucket) => bucket.test(sizeOf(product)));
        if (!match) return false;
      }

      if (styleFilter.length && !styleFilter.includes(product.style)) return false;

      return true;
    });

    /*
      Hàng đã bán hết luôn xếp cuối, bất kể khách chọn sắp xếp kiểu nào —
      không có lý do gì đưa món không mua được lên đầu danh sách.
      Tiêu chí khách chọn chỉ quyết định thứ tự trong từng nhóm.
    */
    const theoTieuChi = (a: Product, b: Product) => {
      switch (sort) {
        case "gia-tang":
          return a.price - b.price;
        case "gia-giam":
          return b.price - a.price;
        case "danh-gia":
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
        case "moi-nhat":
          return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
        default:
          return b.sold - a.sold;
      }
    };

    return [...result].sort(
      (a, b) =>
        Number(Boolean(b.inStock)) - Number(Boolean(a.inStock)) ||
        theoTieuChi(a, b),
    );
  }, [products, prices, materials, colors, sizes, styleFilter, inStockOnly, sort]);

  /** Đếm số sản phẩm còn lại nếu bật thêm một lựa chọn — giúp tránh bộ lọc cụt */
  const countIf = (predicate: (product: Product) => boolean) =>
    products.filter(predicate).length;

  const activeCount =
    prices.length +
    materials.length +
    colors.length +
    sizes.length +
    styleFilter.length +
    (inStockOnly ? 1 : 0);

  const clearAll = () => {
    setPrices([]);
    setMaterials([]);
    setColors([]);
    setSizes([]);
    setStyleFilter([]);
    setInStockOnly(false);
  };

  const filterPanel = (
    <div className="space-y-7">
      <div>
        <p className="eyebrow mb-2">Khoảng giá</p>
        {priceBuckets.map((bucket) => (
          <CheckboxRow
            key={bucket.key}
            label={bucket.label}
            checked={prices.includes(bucket.key)}
            onChange={() => toggle(bucket.key, prices, setPrices)}
            count={countIf((product) => bucket.test(product.price))}
          />
        ))}
      </div>

      <div>
        <p className="eyebrow mb-2">Chất liệu</p>
        {materialGroups.map((group) => (
          <CheckboxRow
            key={group.key}
            label={group.label}
            checked={materials.includes(group.key)}
            onChange={() => toggle(group.key, materials, setMaterials)}
            count={countIf((product) => group.pattern.test(materialsOf(product)))}
          />
        ))}
      </div>

      <div>
        <p className="eyebrow mb-2">Kích thước</p>
        {sizeBuckets.map((bucket) => (
          <CheckboxRow
            key={bucket.key}
            label={bucket.label}
            checked={sizes.includes(bucket.key)}
            onChange={() => toggle(bucket.key, sizes, setSizes)}
            count={countIf((product) => bucket.test(sizeOf(product)))}
          />
        ))}
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          Tính theo chiều ngang lớn nhất — số đo bạn cần khi đo chỗ kê.
        </p>
      </div>

      <div>
        <p className="eyebrow mb-2">Phong cách</p>
        {styles.map((style) => (
          <CheckboxRow
            key={style.slug}
            label={style.name}
            checked={styleFilter.includes(style.slug)}
            onChange={() => toggle(style.slug, styleFilter, setStyleFilter)}
            count={countIf((product) => product.style === style.slug)}
          />
        ))}
      </div>

      <div>
        <p className="eyebrow mb-3">Màu sắc</p>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => {
            const active = colors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => toggle(color.name, colors, setColors)}
                title={color.name}
                aria-pressed={active}
                className={`flex items-center gap-1.5 border px-2 py-1 text-xs transition-colors ${
                  active ? "border-walnut bg-walnut/10" : "border-line hover:border-muted"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full border border-line"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly((value) => !value)}
            className="h-4 w-4 accent-[#8a5a3b]"
          />
          Chỉ hiện hàng có sẵn
        </label>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm font-semibold text-walnut hover:underline"
        >
          Xoá tất cả bộ lọc ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-10">
      {/* Bộ lọc — cột trái trên desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">{filterPanel}</div>
      </aside>

      <div>
        <div className="mb-6 flex items-center justify-between gap-3 border-b border-line pb-4">
          <p className="text-sm text-muted">
            <strong className="text-ink">{filtered.length}</strong> sản phẩm
            {activeCount > 0 && ` (đã lọc từ ${products.length})`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 border border-line px-3 py-2 text-sm lg:hidden"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Lọc{activeCount > 0 && ` (${activeCount})`}
            </button>

            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-muted sm:inline">Sắp xếp:</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="border border-line bg-white px-2 py-2 text-sm"
                aria-label="Sắp xếp sản phẩm"
              >
                {sortOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-line py-20 text-center">
            <p className="font-display text-lg">Không có sản phẩm nào khớp bộ lọc</p>
            <p className="mt-2 text-sm text-muted">
              Thử bỏ bớt một vài điều kiện, hoặc gọi {""}
              <a href="tel:0931619177" className="font-semibold text-walnut">
                0931 619 177
              </a>{" "}
              để chúng tôi tìm giúp bạn.
            </p>
            <button type="button" onClick={clearAll} className="btn btn-outline mt-6">
              Xoá bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Bộ lọc — ngăn kéo trên mobile */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setFiltersOpen(false)}
            aria-label="Đóng bộ lọc"
          />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-bone">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="font-display text-lg">Bộ lọc</p>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Đóng">
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{filterPanel}</div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="btn btn-primary w-full"
              >
                Xem {filtered.length} sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
