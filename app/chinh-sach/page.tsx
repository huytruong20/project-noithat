import type { Metadata } from "next";
import Link from "next/link";
import { policies } from "@/lib/data/policies";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Chính sách",
  description:
    "Chính sách giao hàng và lắp đặt, đổi trả, bảo hành, thanh toán và bảo mật thông tin.",
};

export default function PolicyIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Chính sách" }]} />

      <section className="border-b border-line bg-sand">
        <div className="shell py-10 md:py-14">
          <p className="eyebrow mb-2">Minh bạch</p>
          <h1 className="text-3xl md:text-4xl">Chính sách mua hàng</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
            Toàn bộ điều khoản viết bằng tiếng Việt dễ hiểu, không giấu chữ nhỏ. Nếu có
            điểm nào mâu thuẫn với lời tư vấn viên nói, chúng tôi xử lý theo hướng có
            lợi hơn cho bạn.
          </p>
        </div>
      </section>

      <section className="shell grid gap-5 py-12 pb-20 md:grid-cols-2">
        {policies.map((policy) => (
          <Link
            key={policy.slug}
            href={`/chinh-sach/${policy.slug}`}
            className="group flex flex-col border border-line bg-white p-6 transition-shadow hover:shadow-soft"
          >
            <h2 className="font-display text-xl group-hover:text-walnut">
              {policy.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {policy.summary}
            </p>
            <p className="mt-4 text-xs text-muted">Cập nhật {policy.updated}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
