import Link from "next/link";
import type { Product } from "@/lib/types";
import {
  discountPercent,
  formatDimensions,
  formatPrice,
  formatWarranty,
} from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuickAdd } from "@/components/product/QuickAdd";
import { Reveal } from "@/components/ui/Reveal";

/** Đồ nhỏ giao qua chuyển phát, không có thợ tới lắp */
const noAssembly = ["trang-tri", "den-chieu-sang"];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      <svg width="12" height="12" viewBox="0 0 20 20" className="text-walnut" aria-hidden="true">
        <path
          fill="currentColor"
          d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"
        />
      </svg>
      {rating.toFixed(1)}
    </span>
  );
}

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    <article className="group relative flex flex-col border border-line bg-white transition-shadow hover:shadow-lift">
      <Link href={`/san-pham/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-sand">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
            <ProductImage product={product} priority={priority} />
          </div>

          <div className="absolute left-0 top-3 flex flex-col items-start gap-1">
            {discount > 0 && (
              <span className="bg-clay px-2 py-1 text-[11px] font-bold text-white">
                −{discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-ink px-2 py-1 text-[11px] font-bold text-white">
                Mới về
              </span>
            )}
            {product.isBestSeller && !product.isNew && (
              <span className="bg-walnut px-2 py-1 text-[11px] font-bold text-white">
                Bán chạy
              </span>
            )}
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-bone/70">
              <span className="bg-ink px-3 py-1.5 text-xs font-semibold text-white">
                Đã bán hết
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <Stars rating={product.rating} />
          <span className="text-[11px] text-muted">Đã bán {product.sold.toLocaleString("vi-VN")}</span>
        </div>

        <h3 className="font-display text-[15px] leading-snug">
          <Link href={`/san-pham/${product.slug}`} className="hover:text-walnut">
            {product.name}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
          {product.short}
        </p>

        {/* Kích thước chính — khách nội thất luôn cần số này ngay ở danh sách */}
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M1.5 5.5h13v5h-13zM4.5 5.5v2M8 5.5v3M11.5 5.5v2"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          {formatDimensions(product.dimensions)}
        </p>

        {/* Tag cam kết — lý do khách chọn mua ở đây thay vì chỗ khác */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.warrantyMonths > 0 && (
            <span className="border border-line bg-sand px-1.5 py-0.5 text-[10px] text-muted">
              BH {formatWarranty(product.warrantyMonths)}
            </span>
          )}
          <span className="border border-line bg-sand px-1.5 py-0.5 text-[10px] text-muted">
            {noAssembly.includes(product.category) ? "Giao miễn phí" : "Giao & lắp miễn phí"}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          {product.colors.slice(0, 4).map((color) => (
            <span
              key={color.name}
              title={color.name}
              className="h-3.5 w-3.5 rounded-full border border-line"
              style={{ backgroundColor: color.hex }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[11px] text-muted">+{product.colors.length - 4}</span>
          )}
        </div>

        <div className="mt-auto pt-4">
          {/* flex-wrap: trên màn hình hẹp, giá gốc gạch ngang phải xuống dòng
              thay vì đẩy tràn thẻ sản phẩm ra ngoài màn hình */}
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="price text-lg">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-muted line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-muted">{product.leadTime}</p>
        </div>
      </div>

      {product.inStock && (
        <div className="px-4 pb-4">
          <QuickAdd slug={product.slug} color={product.colors[0].name} />
        </div>
      )}
    </article>
  );
}

export function ProductGrid({
  products,
  priorityCount = 0,
}: {
  products: Product[];
  priorityCount?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      {products.map((product, index) => (
        /*
          Các thẻ hiện lên so le nhau chứ không bật ra cùng lúc — mắt bắt được
          nhịp và trang bớt cảm giác "vẽ sẵn". Chỉ cộng dồn trong một hàng bốn
          thẻ rồi lặp lại, nếu nhân mãi thì thẻ thứ 20 phải chờ hai giây mới hiện.
        */
        <Reveal key={product.slug} delay={(index % 4) * 70}>
          <ProductCard product={product} priority={index < priorityCount} />
        </Reveal>
      ))}
    </div>
  );
}
