import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Gọi 0931 619 177 gặp người thật. Hai showroom ở Gia Lai và TP.HCM, mở cả cuối tuần. Gửi mặt bằng nhờ tư vấn không mất phí.",
};

const faqs = [
  {
    q: "Muốn sờ tận tay trước khi xuống tiền thì sao?",
    a: "Cứ tới showroom, mở 8:00 – 20:00 mọi ngày kể cả thứ Bảy Chủ nhật, không cần hẹn trước. Món bạn đang nhắm mà showroom chưa bày thì gọi báo trước một hôm, chúng tôi chuyển từ kho lên cho bạn xem.",
  },
  {
    q: "Gửi form xong bao lâu có người gọi?",
    a: "Trong giờ làm thì thường chưa tới 30 phút. Gửi lúc đêm hôm thì sáng hôm sau chúng tôi gọi, chậm nhất là trong 24 giờ.",
  },
  {
    q: "Cần báo giá cho nguyên căn hộ hoặc cả văn phòng?",
    a: "Gửi mặt bằng qua form bên cạnh, chụp ảnh bản vẽ bằng điện thoại cũng đọc được. Nói thêm bạn định chi khoảng bao nhiêu để chúng tôi chọn cho vừa túi. Trong 24 giờ có sơ đồ kê đồ và bảng giá từng món. Không tính phí, không mua cũng không sao.",
  },
  {
    q: "Đồ mua rồi bị hỏng thì gọi ai?",
    a: "Gọi thẳng 0931 619 177, đọc số điện thoại hồi đặt hàng là xong — chúng tôi tra ra bạn mua gì ngày nào, không cần giữ hoá đơn. Thợ sẽ hẹn ngày tới xem.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Liên hệ" }]} />

      <section className="border-b border-line bg-sand">
        <div className="shell py-10 md:py-14">
          <p className="eyebrow mb-2">Liên hệ</p>
          <h1 className="text-3xl md:text-4xl">Bấm số là gặp người</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
            Không có tổng đài bấm phím một phím hai. Gọi {site.hotline} trong khoảng 8:00 –
            20:00 là có nhân viên tư vấn nhấc máy. Bận thì để lại form, chúng tôi gọi lại.
          </p>
        </div>
      </section>

      <section className="shell grid gap-10 py-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <ContactForm />

        <aside className="space-y-4">
          <div className="border border-line bg-white p-6">
            <p className="eyebrow mb-3">Liên hệ nhanh</p>
            <a
              href={site.hotlineHref}
              className="flex items-center gap-3 border-b border-line pb-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-walnut/10 text-walnut">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 4h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <span className="block text-xs text-muted">Hotline</span>
                <span className="block font-display text-lg font-semibold">
                  {site.hotline}
                </span>
              </span>
            </a>

            <a
              href={`mailto:${site.email}`}
              className="mt-4 flex items-center gap-3 border-b border-line pb-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-walnut/10 text-walnut">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M3 6l9 7 9-7" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <span>
                <span className="block text-xs text-muted">Email</span>
                <span className="block font-medium">{site.email}</span>
              </span>
            </a>

            <p className="mt-4 text-sm text-muted">{site.workingHours}</p>

            <div className="mt-4 flex flex-wrap gap-3 border-t border-line pt-4 text-sm">
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

          {site.showrooms.map((showroom) => (
            <div key={showroom.city} className="border border-line bg-white p-6">
              <p className="font-display text-lg">Showroom {showroom.city}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{showroom.address}</p>
              <p className="mt-1 text-sm text-muted">{showroom.hours}</p>
              <a
                href={`tel:${showroom.phone.replace(/\s/g, "")}`}
                className="mt-3 inline-block text-sm font-semibold text-walnut hover:underline"
              >
                {showroom.phone}
              </a>
              {/* Chèn iframe Google Maps vào đây khi có toạ độ thật */}
              <div className="mt-4 flex aspect-[16/9] items-center justify-center border border-dashed border-line bg-sand text-xs text-muted">
                Bản đồ {showroom.city}
              </div>
            </div>
          ))}

          <div className="border border-line bg-sand p-6">
            <p className="font-display text-lg">Đã đặt hàng rồi?</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Tra cứu tình trạng đơn bằng mã đơn hoặc số điện thoại đặt hàng.
            </p>
            <Link href="/tra-cuu-don" className="btn btn-outline mt-4 w-full">
              Tra cứu đơn hàng
            </Link>
          </div>
        </aside>
      </section>

      <section className="border-t border-line bg-white/60 py-14">
        <div className="shell max-w-3xl">
          <p className="eyebrow mb-2">Câu hỏi thường gặp</p>
          <h2 className="text-2xl md:text-3xl">Có thể bạn đang thắc mắc</h2>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-5">
                <dt className="font-medium">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{faq.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-muted">
            Câu hỏi về giao hàng, đổi trả và bảo hành xem đầy đủ ở{" "}
            <Link href="/chinh-sach/giao-hang-lap-dat" className="text-walnut underline">
              trang chính sách
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
