import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SceneImage } from "@/components/ui/ProductImage";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description:
    "Nội thất HT là xưởng nội thất gỗ tại Gia Lai và TP.HCM, làm đồ để dùng lâu dài với vật liệu công bố minh bạch.",
};

const timeline = [
  {
    year: "2016",
    title: "Bắt đầu từ một xưởng mộc nhỏ",
    text: "Ba người thợ, một xưởng 200m² ở An Khê, nhận đóng đồ theo yêu cầu cho khách quen giới thiệu nhau.",
  },
  {
    year: "2019",
    title: "Mở showroom đầu tiên",
    text: "Khách muốn ngồi thử trước khi mua. Chúng tôi mở showroom đầu tiên tại An Khê để trưng bày các mẫu tiêu chuẩn.",
  },
  {
    year: "2022",
    title: "Vào thị trường phía Nam",
    text: "Showroom TP.HCM đi vào hoạt động cùng kho trung chuyển, rút thời gian giao hàng miền Nam xuống 3–5 ngày.",
  },
  {
    year: "2025",
    title: "Hơn 400 dự án bàn giao",
    text: "Từ căn hộ 45m² tới văn phòng 320m². Đội lắp đặt riêng, không thuê ngoài, để kiểm soát chất lượng cuối cùng.",
  },
];

const principles = [
  {
    title: "Công bố đúng vật liệu",
    text: "Ghi rõ loại gỗ, độ dày mút, tỷ trọng, xuất xứ phụ kiện. Nếu sai lệch so với công bố, chúng tôi hoàn tiền 100% chứ không đổi hàng cho qua chuyện.",
  },
  {
    title: "Tư vấn cả khi bạn không nên mua",
    text: "Nếu món đồ không lọt cửa nhà bạn hoặc không hợp diện tích, nhân viên sẽ nói thẳng và gợi ý mẫu khác — kể cả mẫu rẻ hơn.",
  },
  {
    title: "Đội lắp đặt là người của công ty",
    text: "Không thuê ngoài theo đơn. Thợ được đào tạo và chịu trách nhiệm tới cùng, nên chất lượng lắp đặt không phụ thuộc may rủi.",
  },
  {
    title: "Sửa được thì sửa, không đẩy sang mua mới",
    text: "Bảo trì miễn phí trọn đời sản phẩm. Ốc lỏng, cánh xệ, chân cập kênh — gọi là có người tới, kể cả đã hết bảo hành nhiều năm.",
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
              Chúng tôi làm đồ gỗ để dùng mười năm, không phải để bán một lần.
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              Nội thất HT bắt đầu năm 2016 từ một xưởng mộc nhỏ ở An Khê. Đến nay chúng tôi
              có hai showroom, một xưởng sản xuất và đội lắp đặt riêng — nhưng cách làm
              vẫn như cũ: nói đúng vật liệu, làm chắc mối ghép, và có mặt khi khách cần
              sửa.
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
            { value: "400+", label: "Dự án đã bàn giao" },
            { value: "2", label: "Showroom Gia Lai – TP.HCM" },
            { value: "5 năm", label: "Bảo hành tối đa" },
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
          <h2 className="text-2xl md:text-3xl">Bốn nguyên tắc không thoả hiệp</h2>
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
            <h2 className="text-2xl md:text-3xl">Từ xưởng mộc tới hai showroom</h2>
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
          <h2 className="text-2xl text-white md:text-3xl">Ngồi thử trước khi mua</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
            Ảnh không thay được cảm giác ngồi. Cả hai showroom đều trưng bày đầy đủ các
            mẫu bán chạy, mở cửa cả cuối tuần và không cần đặt lịch trước.
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
