import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { policies, policyShortTitle } from "@/lib/data/policies";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-sand">
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-semibold">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {site.tagline}. Chúng tôi làm đồ để dùng mười năm, không phải để chụp ảnh
            một lần.
          </p>
          <div className="mt-5 space-y-1 text-sm">
            <p>
              Hotline:{" "}
              <a href={site.hotlineHref} className="font-semibold hover:text-walnut">
                {site.hotline}
              </a>
            </p>
            <p>
              Email:{" "}
              <a href={`mailto:${site.email}`} className="hover:text-walnut">
                {site.email}
              </a>
            </p>
            <p className="text-muted">{site.workingHours}</p>
          </div>
          <div className="mt-5 flex gap-4 text-sm">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-walnut"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Danh mục sản phẩm</p>
          <ul className="space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/danh-muc/${category.slug}`}
                  className="text-muted hover:text-walnut"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Chính sách</p>
          <ul className="space-y-2 text-sm">
            {policies.map((policy) => (
              <li key={policy.slug}>
                <Link
                  href={`/chinh-sach/${policy.slug}`}
                  className="text-muted hover:text-walnut"
                >
                  {policyShortTitle(policy)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/tra-cuu-don" className="text-muted hover:text-walnut">
                Tra cứu đơn hàng
              </Link>
            </li>
            <li>
              <Link href="/lien-he" className="text-muted hover:text-walnut">
                Liên hệ &amp; góp ý
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Showroom</p>
          <ul className="space-y-4 text-sm">
            {site.showrooms.map((showroom) => (
              <li key={showroom.city}>
                <p className="font-semibold">{showroom.city}</p>
                <p className="text-muted">{showroom.address}</p>
                <p className="text-muted">
                  {showroom.phone} · {showroom.hours}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line/70">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Công ty TNHH Nội thất HT · MST 0101234567.
          </p>
          <p>Đã đăng ký với Bộ Công Thương</p>
        </div>
      </div>
    </footer>
  );
}
