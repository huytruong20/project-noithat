import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SceneImage } from "@/components/ui/ProductImage";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description:
    "Xưởng mộc ở An Khê, Gia Lai và showroom TP.HCM. Đóng đồ gỗ dùng lâu năm, ghi rõ vật liệu để khách kiểm được.",
};

const timeline = [
  {
    year: "2016",
    title: "Ba người thợ và một cái xưởng 200m²",
    text: "Không quảng cáo, không biển hiệu. Khách quen giới thiệu nhau tới đặt đóng tủ, đóng giường theo số đo nhà mình.",
  },
  {
    year: "2019",
    title: "Mở chỗ cho khách ngồi thử",
    text: "Nghe tả thì khó hình dung, ngồi vào mới biết cao thấp có vừa không. Chúng tôi mở showroom tại An Khê bày sẵn các mẫu làm nhiều nhất.",
  },
  {
    year: "2022",
    title: "Xuống Sài Gòn",
    text: "Mở showroom TP.HCM kèm một kho trung chuyển. Khách miền Nam từ đó nhận hàng trong 3–5 ngày thay vì chờ xe từ Gia Lai vào.",
  },
  {
    year: "2025",
    title: "Hơn 400 căn đã lắp xong",
    text: "Nhỏ nhất là căn hộ 45m², lớn nhất là văn phòng 320m². Thợ lắp là người của công ty, không gọi thầu phụ — khâu cuối cùng khách nhìn thấy phải do mình chịu trách nhiệm.",
  },
];

const principles = [
  {
    title: "Ghi gì thì đúng cái đó",
    text: "Loại gỗ, mút dày mấy phân, tỷ trọng bao nhiêu, phụ kiện của hãng nào — ghi hết trên trang sản phẩm. Bạn cầm thước đo lại thấy lệch thì chúng tôi trả đủ tiền, không mặc cả đổi món khác cho qua.",
  },
  {
    title: "Nói thẳng cả khi mất đơn",
    text: "Món đồ không lọt cửa, kê vào thì chật lối đi, hay đơn giản là quá khổ so với phòng — nhân viên nói thẳng và chỉ mẫu khác, kể cả mẫu rẻ hơn nhiều. Bán được một lần rồi khách bực thì không đáng.",
  },
  {
    title: "Thợ lắp ăn lương công ty",
    text: "Không gọi thầu phụ theo từng đơn. Thợ được dạy nghề tại chỗ và theo món hàng tới lúc bạn ký nhận, nên gặp phải kíp cẩu thả hay kíp tử tế không còn là chuyện hên xui.",
  },
  {
    title: "Sửa được thì sửa",
    text: "Ốc lỏng, cánh tủ xệ, chân bàn cập kênh — gọi là có thợ tới, không tính công, kể cả khi đã hết bảo hành mấy năm. Chúng tôi không lấy cái hỏng vặt làm cớ mời bạn mua đồ mới.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Về chúng tôi" }]} />

      <section className="border-b border-line bg-sand">
        <div className="shell grid items-center gap-10 py-12 md:py-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow mb-3">Về {site.name}</p>
            <h1 className="text-3xl leading-tight md:text-4xl">
              Đóng một cái tủ mất ba ngày. Nó phải đứng được mười năm.
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              Năm 2016 chỗ này còn là cái xưởng mộc 200m² ở An Khê với ba người thợ. Bây giờ
              có thêm hai showroom và đội lắp đặt riêng, nhưng ba việc thì vẫn làm y như
              hồi đó: nói đúng loại gỗ, ghép mộng cho chắc, và khi khách gọi sửa thì có mặt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/danh-muc" className="btn btn-primary">
                Xem sản phẩm
              </Link>
              <Link href="/lien-he" className="btn btn-outline">
                Ghé showroom
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 aspect-[3/2] overflow-hidden border border-line bg-white">
              <SceneImage tint="#8a5a3b" seed={1} label="Xưởng sản xuất" />
            </div>
            <div className="aspect-square overflow-hidden border border-line bg-white">
              <SceneImage tint="#c9b7a2" seed={3} label="Showroom Gia Lai" />
            </div>
            <div className="aspect-square overflow-hidden border border-line bg-white">
              <SceneImage tint="#5f6b53" seed={5} label="Đội lắp đặt" />
            </div>
          </div>
        </div>
      </section>

      {/* Con số */}
      <section className="border-b border-line">
        <div className="shell grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {[
            { value: "2016", label: "Năm thành lập" },
            { value: "400+", label: "Căn nhà đã lắp" },
            { value: "2", label: "Showroom Gia Lai – TP.HCM" },
            { value: "5 năm", label: "Bảo hành gỗ tự nhiên" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nguyên tắc */}
      <section className="shell py-14 md:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-2">Cách chúng tôi làm việc</p>
          <h2 className="text-2xl md:text-3xl">Bốn điều không đổi từ ngày đầu</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {principles.map((item, index) => (
            <div key={item.title} className="border border-line bg-white p-6">
              <span className="text-xs text-muted">0{index + 1}</span>
              <h3 className="mt-2 font-display text-lg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chặng đường */}
      <section className="border-y border-line bg-sand py-14 md:py-20">
        <div className="shell">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow mb-2">Chặng đường</p>
            <h2 className="text-2xl md:text-3xl">Mười năm, từ ba người thợ</h2>
          </div>
          <ol className="grid gap-6 md:grid-cols-4">
            {timeline.map((item) => (
              <li key={item.year} className="border-t-2 border-walnut pt-4">
                <p className="font-display text-2xl font-semibold">{item.year}</p>
                <p className="mt-2 font-medium">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Showroom */}
      <section className="border-t border-line bg-ink py-14 text-white md:py-16">
        <div className="shell">
          <p className="eyebrow mb-2 text-white/60">Ghé thăm</p>
          <h2 className="text-2xl text-white md:text-3xl">Cứ tới ngồi thử đã</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
            Nhìn ảnh không biết được đệm cứng hay mềm, tựa lưng cao hay thấp. Hai showroom
            bày sẵn các mẫu bán nhiều nhất, mở cả thứ Bảy Chủ nhật, cứ tới không cần hẹn.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {site.showrooms.map((showroom) => (
              <div key={showroom.city} className="border border-white/20 p-6">
                <p className="font-display text-xl">{showroom.city}</p>
                <p className="mt-2 text-sm text-white/70">{showroom.address}</p>
                <p className="mt-1 text-sm text-white/70">{showroom.hours}</p>
                <a
                  href={`tel:${showroom.phone.replace(/\s/g, "")}`}
                  className="mt-3 inline-block text-sm font-semibold text-white hover:underline"
                >
                  {showroom.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
