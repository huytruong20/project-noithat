import Link from "next/link";
import { categories } from "@/lib/data/categories";

export default function NotFound() {
  return (
    <section className="shell max-w-2xl py-24 text-center md:py-32">
      <p className="eyebrow mb-3">Lỗi 404</p>
      <h1 className="text-3xl md:text-4xl">Không tìm thấy trang này</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Có thể đường dẫn đã thay đổi hoặc sản phẩm đã ngừng kinh doanh. Thử tìm lại từ
        danh mục bên dưới, hoặc gọi 0931 619 177 để chúng tôi tìm giúp bạn.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Về trang chủ
        </Link>
        <Link href="/danh-muc" className="btn btn-outline">
          Xem tất cả sản phẩm
        </Link>
      </div>

      <div className="mt-12 border-t border-line pt-8">
        <p className="eyebrow mb-4">Danh mục sản phẩm</p>
        <div className="flex flex-wrap justify-center gap-2">
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
      </div>
    </section>
  );
}
