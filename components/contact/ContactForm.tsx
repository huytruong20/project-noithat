"use client";

import { useState } from "react";

const topics = [
  "Tư vấn chọn đồ theo diện tích",
  "Hỏi về một sản phẩm cụ thể",
  "Báo giá nội thất cả căn / văn phòng",
  "Hỗ trợ đơn hàng đã đặt",
  "Bảo hành, sửa chữa",
  "Khác",
];

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    topic: topics[0],
    message: "",
  });

  const update =
    (key: keyof typeof form) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }));

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const digits = form.phone.replace(/\D/g, "");
    if (form.name.trim().length < 2) {
      setError("Vui lòng nhập họ tên.");
      return;
    }
    if (digits.length < 9 || digits.length > 11) {
      setError("Số điện thoại chưa đúng. Ví dụ: 0912 345 678.");
      return;
    }
    if (form.message.trim().length < 10) {
      setError("Mô tả giúp chúng tôi rõ hơn một chút (tối thiểu 10 ký tự).");
      return;
    }
    setError(null);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-line bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-xl">Đã gửi yêu cầu</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Cảm ơn {form.name.trim()}. Đội tư vấn sẽ liên hệ số {form.phone.trim()} trong
          giờ làm việc, chậm nhất 24 giờ. Nếu cần gấp, bạn gọi thẳng 0931 619 177 nhé.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm({ name: "", phone: "", email: "", topic: topics[0], message: "" });
          }}
          className="btn btn-outline mt-6"
        >
          Gửi yêu cầu khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-line bg-white p-6 md:p-8">
      <h2 className="font-display text-xl">Gửi yêu cầu tư vấn</h2>
      <p className="mt-1 text-sm text-muted">
        Điền thông tin, chúng tôi gọi lại trong giờ làm việc. Miễn phí và không ràng
        buộc phải mua.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm font-medium">
            Họ và tên <span className="text-clay">*</span>
          </label>
          <input
            id="contact-name"
            value={form.name}
            onChange={update("name")}
            className="field"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium">
            Số điện thoại <span className="text-clay">*</span>
          </label>
          <input
            id="contact-phone"
            value={form.phone}
            onChange={update("phone")}
            className="field"
            placeholder="0912 345 678"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-email" className="mb-1 block text-sm font-medium">
            Email <span className="font-normal text-muted">(không bắt buộc)</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={update("email")}
            className="field"
            placeholder="ban@email.com"
            autoComplete="email"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-topic" className="mb-1 block text-sm font-medium">
            Nội dung cần hỗ trợ
          </label>
          <select
            id="contact-topic"
            value={form.topic}
            onChange={update("topic")}
            className="field"
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="mb-1 block text-sm font-medium">
            Mô tả chi tiết <span className="text-clay">*</span>
          </label>
          <textarea
            id="contact-message"
            value={form.message}
            onChange={update("message")}
            rows={5}
            className="field resize-y"
            placeholder="Ví dụ: Căn hộ 2 phòng ngủ 68m² ở An Khê, cần sofa và bàn ăn, ngân sách khoảng 40 triệu. Phòng khách rộng 3.4 × 4.2m."
          />
          <p className="mt-1 text-xs text-muted">
            Nói rõ diện tích và ngân sách sẽ giúp chúng tôi tư vấn sát hơn ngay từ lần
            gọi đầu.
          </p>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-clay">{error}</p>}

      <button type="submit" className="btn btn-accent mt-6 w-full sm:w-auto">
        Gửi yêu cầu tư vấn
      </button>
      <p className="mt-3 text-xs text-muted">
        Thông tin của bạn chỉ dùng để liên hệ tư vấn, không chia sẻ cho bên thứ ba.
      </p>
    </form>
  );
}
