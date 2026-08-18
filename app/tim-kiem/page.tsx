import type { Metadata } from "next";
import Link from "next/link";
import { searchProducts, getBestSellers } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductBrowser } from "@/components/product/ProductBrowser";
import { ProductGrid } from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: "Tìm kiếm",
  description: "Tìm sản phẩm nội thất theo tên, chất liệu hoặc công dụng.",
};

const suggestions = ["sofa", "giường", "bàn ăn", "gỗ sồi", "văn phòng", "đèn"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? searchProducts(query) : [];

  return (
    <>
      <Breadcrumbs items={[{ label: "Tìm kiếm" }]} />

      <section className="border-b border-line bg-sand">
        <div className="shell py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl">
            {query ? `Kết quả cho “${query}”` : "Tìm kiếm sản phẩm"}
          </h1>
          {query && (
            <p className="mt-2 text-sm text-muted">
              {results.length} sản phẩm
            </p>
          )}

          <form action="/tim-kiem" className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              name="q"
              defaultValue={query}
              className="field flex-1"
              placeholder="Nhập tên sản phẩm, chất liệu hoặc công dụng…"
              aria-label="Từ khoá tìm kiếm"
            />
            <button type="submit" className="btn btn-accent shrink-0">
              Tìm kiếm
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">Gợi ý:</span>
            {suggestions.map((word) => (
              <Link
                key={word}
                href={`/tim-kiem?q=${encodeURIComponent(word)}`}
                className="border border-line bg-white px-3 py-1.5 text-xs transition-colors hover:border-walnut hover:text-walnut"
              >
                {word}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-10 pb-20">
        {!query ? (
          <div>
            <p className="eyebrow mb-4">Duyệt theo danh mục</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/danh-muc/${category.slug}`}
                  className="border border-line bg-white px-4 py-2 text-sm transition-colors hover:border-walnut hover:text-walnut"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="mt-12">
              <p className="eyebrow mb-4">Khách tìm nhiều nhất</p>
              <ProductGrid products={getBestSellers(4)} />
            </div>
          </div>
        ) : results.length > 0 ? (
          <ProductBrowser products={results} />
        ) : (
          <div className="border border-dashed border-line bg-white py-16 text-center">
            <p className="font-display text-xl">
              Không tìm thấy sản phẩm nào khớp “{query}”
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              Thử từ khoá ngắn hơn, hoặc gọi 0931 619 177 để chúng tôi tìm giúp. Nhiều mẫu
              đóng theo yêu cầu chưa lên website.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/danh-muc" className="btn btn-primary">
                Xem tất cả sản phẩm
              </Link>
              <Link href="/lien-he" className="btn btn-outline">
                Nhờ tư vấn tìm giúp
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
