import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { getProductsByCategory, products } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductBrowser } from "@/components/product/ProductBrowser";
import { CategoryImage } from "@/components/ui/ProductImage";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description:
    "Toàn bộ sản phẩm nội thất: sofa, bàn ghế, giường, tủ kệ, bàn ăn, đồ trang trí, nội thất văn phòng và đèn chiếu sáng.",
};

export default function CategoryIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Sản phẩm" }]} />

      <section className="shell py-10 md:py-14">
        <p className="eyebrow mb-2">Danh mục</p>
        <h1 className="text-3xl md:text-4xl">Tất cả sản phẩm</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          {products.length} mẫu đang bán, chia thành {categories.length} nhóm. Mỗi sản
          phẩm đều ghi rõ kích thước, chất liệu, màu, thời gian bảo hành và cách giao
          lắp — không có dòng nào để trống.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/danh-muc/${category.slug}`}
              className="group flex items-center gap-3 border border-line bg-white p-3 transition-shadow hover:shadow-soft"
            >
              <div className="h-12 w-14 shrink-0 overflow-hidden bg-sand">
                <CategoryImage
                  categorySlug={category.slug}
                  seed={index}
                  label={category.name}
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium group-hover:text-walnut">
                  {category.name}
                </p>
                <p className="text-xs text-muted">
                  {getProductsByCategory(category.slug).length} mẫu
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell pb-20">
        <ProductBrowser products={products} />
      </section>
    </>
  );
}
