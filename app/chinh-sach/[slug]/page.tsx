import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolicy, policies, policyShortTitle } from "@/lib/data/policies";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return { title: "Không tìm thấy trang" };
  return {
    title: policy.title,
    description: policy.summary,
    alternates: { canonical: `/chinh-sach/${slug}` },
  };
}

export default async function PolicyPage({ params }: Params) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <>
      <Breadcrumbs items={[{ label: "Chính sách" }, { label: policy.title }]} />

      <section className="shell grid gap-10 py-10 md:py-14 lg:grid-cols-[220px_1fr] lg:gap-16">
        {/* Điều hướng giữa các chính sách */}
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-3">Chính sách</p>
          <ul className="space-y-1">
            {policies.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/chinh-sach/${item.slug}`}
                  className={`block border-l-2 py-2 pl-3 text-sm transition-colors ${
                    item.slug === slug
                      ? "border-walnut font-medium text-walnut"
                      : "border-line text-muted hover:border-muted hover:text-ink"
                  }`}
                >
                  {policyShortTitle(item)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 border border-line bg-sand p-4 text-sm">
            <p className="font-medium">Cần hỏi trực tiếp?</p>
            <p className="mt-1 leading-relaxed text-muted">
              Gọi{" "}
              <a href={site.hotlineHref} className="font-semibold text-walnut">
                {site.hotline}
              </a>{" "}
              để được giải đáp ngay.
            </p>
          </div>
        </aside>

        <article className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl">{policy.title}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{policy.summary}</p>
          <p className="mt-4 border-b border-line pb-5 text-xs text-muted">
            Cập nhật lần cuối: {policy.updated}
          </p>

          <div className="prose-vn mt-8">
            {policy.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-12 border border-line bg-white p-6">
            <p className="font-display text-lg">Vẫn chưa rõ điều gì?</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Chính sách viết ngắn gọn nên khó bao hết mọi tình huống. Cứ gọi hoặc nhắn
              cho chúng tôi, trường hợp của bạn sẽ được trả lời cụ thể.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/lien-he" className="btn btn-primary">
                Gửi câu hỏi
              </Link>
              <a href={site.hotlineHref} className="btn btn-outline">
                Gọi {site.hotline}
              </a>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
