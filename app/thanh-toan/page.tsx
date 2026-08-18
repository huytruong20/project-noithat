"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { shippingFee, shippingZones, useCart, type ShippingZone } from "@/lib/cart";
import { formatPrice, makeOrderCode } from "@/lib/format";
import { saveOrder, type Order } from "@/lib/orders";
import { ghiDonLenMayChu } from "@/lib/auth/thao-tac";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductImage } from "@/components/ui/ProductImage";
import { VoucherBox } from "@/components/cart/VoucherBox";
import { ChonThanhToan } from "@/components/checkout/ChonThanhToan";
import {
  hanMucCOD,
  phuongThucThanhToan,
  toiThieuTraGop,
  type MaThanhToan,
} from "@/lib/data/thanh-toan";


type Errors = Partial<Record<"name" | "phone" | "city" | "district" | "address", string>>;

export default function CheckoutPage() {
  const { lines, subtotal, savings, count, clear, ready, voucher, voucherDiscount } =
    useCart();

  const [zone, setZone] = useState<ShippingZone>("noi-thanh");
  const [payment, setPayment] = useState<MaThanhToan>("cod");
  /** Kỳ hạn trả góp khách chọn, chỉ dùng khi payment === "tra-gop" */
  const [kyHan, setKyHan] = useState(6);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    address: "",
    note: "",
  });
  const [needInvoice, setNeedInvoice] = useState(false);
  const [company, setCompany] = useState({ name: "", tax: "", address: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [placed, setPlaced] = useState<{ code: string; total: number } | null>(null);

  // Mã FREESHIP miễn phí vận chuyển mọi khu vực
  const feeFor = (target: ShippingZone) =>
    voucher?.freeShipping ? 0 : shippingFee(target, subtotal);
  const fee = feeFor(zone);
  const total = subtotal - voucherDiscount + fee;

  /** Chính sách: COD chỉ áp dụng cho đơn dưới hạn mức, tính trên số tiền phải trả */
  const codBlocked = total >= hanMucCOD;

  // Đổi số lượng ở tab khác có thể đẩy đơn vượt hạn mức COD khi đã chọn sẵn COD.
  // Không có bước này, đơn vẫn gửi đi với hình thức thanh toán đang bị khoá.
  useEffect(() => {
    if (codBlocked && payment === "cod") setPayment("chuyen-khoan");
    // Bỏ bớt hàng làm đơn tụt dưới mức trả góp tối thiểu — nhả lựa chọn ra,
    // nếu không đơn vẫn gửi đi với hình thức đang bị khoá.
    if (total < toiThieuTraGop && payment === "tra-gop") setPayment("cod");
  }, [codBlocked, payment, total]);

  const update = (key: keyof typeof form) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  function validate(): boolean {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Vui lòng nhập họ tên người nhận.";
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 11)
      next.phone = "Số điện thoại chưa đúng. Ví dụ: 0912 345 678.";
    if (!form.city.trim()) next.city = "Nhập tỉnh / thành phố.";
    if (!form.district.trim()) next.district = "Nhập quận / huyện.";
    if (form.address.trim().length < 5)
      next.address = "Nhập số nhà, tên đường cụ thể để shipper tìm được.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) {
      document.getElementById("thong-tin-nhan-hang")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    const moTaThanhToan = () => {
      const ten =
        phuongThucThanhToan.find((method) => method.key === payment)?.label ?? payment;
      return payment === "tra-gop" ? `${ten} — kỳ hạn ${kyHan} tháng` : ten;
    };

    const code = makeOrderCode();
    const don: Order = {
      code,
      createdAt: new Date().toISOString(),
      status: "cho-xac-nhan",
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        address: `${form.address.trim()}, ${form.district.trim()}, ${form.city.trim()}`,
        note:
          [form.note.trim(), needInvoice ? `Xuất hoá đơn: ${company.name} — MST ${company.tax}` : ""]
            .filter(Boolean)
            .join(" | ") || undefined,
      },
      items: lines.map((line) => ({
        slug: line.slug,
        color: line.color,
        quantity: line.quantity,
        note: line.note,
        name: line.product.name,
        price: line.product.price,
      })),
      subtotal,
      discount: voucherDiscount || undefined,
      voucherCode: voucher?.code,
      shipping: fee,
      total,
      payment: moTaThanhToan(),
    };

    // Lưu vào trình duyệt để khách tra cứu được ngay, kể cả khi chưa đăng nhập
    saveOrder(don);

    /*
      Gửi thêm một bản lên máy chủ cho nhân viên xử lý. Cố tình KHÔNG await:
      máy chủ lỗi cũng không được chặn màn hình cảm ơn của khách — họ đã đặt
      xong rồi. Đơn vẫn còn ở trình duyệt nên không mất dấu.
    */
    void ghiDonLenMayChu(don).catch(() => {});

    setPlaced({ code, total });
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ------------------------- Màn hình cảm ơn ------------------------- */
  if (placed) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Thanh toán" }, { label: "Hoàn tất" }]} />
        <section className="shell max-w-2xl py-16 text-center md:py-24">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/15 text-sage">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl md:text-4xl">Đặt hàng thành công</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Cảm ơn bạn đã tin tưởng Nội thất HT. Nhân viên sẽ gọi xác nhận đơn và hẹn lịch
            giao trong vòng 30 phút giờ làm việc.
          </p>

          <div className="mt-8 border border-line bg-white p-6 text-left">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <p className="text-xs text-muted">Mã đơn hàng</p>
                <p className="price text-2xl">{placed.code}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Tổng thanh toán</p>
                <p className="price text-2xl">
                  {formatPrice(placed.total)}
                </p>
              </div>
            </div>
            <ol className="mt-5 space-y-3 text-sm text-muted">
              <li>
                <strong className="text-ink">1.</strong> Chúng tôi gọi xác nhận đơn và
                kiểm tra lại kích thước lối vào.
              </li>
              <li>
                <strong className="text-ink">2.</strong> Chuẩn bị hàng và báo trước khung
                giờ giao 1 ngày.
              </li>
              <li>
                <strong className="text-ink">3.</strong> Giao, lắp đặt tại nhà và dọn sạch
                bao bì.
              </li>
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/tra-cuu-don" className="btn btn-primary">
              Tra cứu đơn hàng
            </Link>
            <Link href="/danh-muc" className="btn btn-outline">
              Tiếp tục mua sắm
            </Link>
          </div>
        </section>
      </>
    );
  }

  /* ------------------------- Giỏ hàng trống ------------------------- */
  if (ready && lines.length === 0) {
    return (
      <>
        <Breadcrumbs items={[{ label: "Thanh toán" }]} />
        <section className="shell max-w-xl py-20 text-center">
          <h1 className="text-3xl">Chưa có gì để thanh toán</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Giỏ hàng của bạn đang trống. Chọn vài món rồi quay lại bước này nhé.
          </p>
          <Link href="/danh-muc" className="btn btn-primary mt-6">
            Xem sản phẩm
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Giỏ hàng", href: "/gio-hang" }, { label: "Thanh toán" }]} />

      <form onSubmit={placeOrder} className="shell py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl">Thanh toán</h1>
        <p className="mt-2 text-sm text-muted">
          Điền thông tin nhận hàng. Chúng tôi gọi xác nhận trước khi giao, chưa trừ tiền
          ở bước này.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div className="space-y-10">
            {/* Thông tin nhận hàng */}
            <fieldset id="thong-tin-nhan-hang">
              <legend className="mb-4 font-display text-xl">Thông tin nhận hàng</legend>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium">
                    Họ và tên <span className="text-clay">*</span>
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={update("name")}
                    className="field"
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="mt-1 text-xs text-clay">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                    Số điện thoại <span className="text-clay">*</span>
                  </label>
                  <input
                    id="phone"
                    value={form.phone}
                    onChange={update("phone")}
                    className="field"
                    placeholder="0912 345 678"
                    inputMode="tel"
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-clay">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className="mb-1 block text-sm font-medium">
                    Email <span className="font-normal text-muted">(để nhận hoá đơn điện tử)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    className="field"
                    placeholder="ban@email.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="mb-1 block text-sm font-medium">
                    Tỉnh / Thành phố <span className="text-clay">*</span>
                  </label>
                  <input
                    id="city"
                    value={form.city}
                    onChange={update("city")}
                    className="field"
                    placeholder="Gia Lai"
                    autoComplete="address-level1"
                    aria-invalid={Boolean(errors.city)}
                  />
                  {errors.city && <p className="mt-1 text-xs text-clay">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="district" className="mb-1 block text-sm font-medium">
                    Quận / Huyện <span className="text-clay">*</span>
                  </label>
                  <input
                    id="district"
                    value={form.district}
                    onChange={update("district")}
                    className="field"
                    placeholder="An Khê"
                    autoComplete="address-level2"
                    aria-invalid={Boolean(errors.district)}
                  />
                  {errors.district && (
                    <p className="mt-1 text-xs text-clay">{errors.district}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="mb-1 block text-sm font-medium">
                    Địa chỉ cụ thể <span className="text-clay">*</span>
                  </label>
                  <input
                    id="address"
                    value={form.address}
                    onChange={update("address")}
                    className="field"
                    placeholder="Số nhà, tên đường, toà nhà, tầng"
                    autoComplete="street-address"
                    aria-invalid={Boolean(errors.address)}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-clay">{errors.address}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="note" className="mb-1 block text-sm font-medium">
                    Ghi chú cho đơn hàng
                  </label>
                  <textarea
                    id="note"
                    value={form.note}
                    onChange={update("note")}
                    rows={3}
                    className="field resize-y"
                    placeholder="Ví dụ: Thang máy chỉ chở được kiện dài dưới 2m, giao sau 18h giúp mình."
                  />
                  <p className="mt-1 text-xs text-muted">
                    Nếu thang máy nhỏ hoặc cầu thang hẹp, ghi vào đây để chúng tôi bố trí
                    đủ người khiêng.
                  </p>
                </div>
              </div>
            </fieldset>

            {/* Khu vực giao hàng */}
            <fieldset>
              <legend className="mb-4 font-display text-xl">Khu vực giao hàng</legend>
              <div className="space-y-2">
                {shippingZones.map((option) => {
                  const optionFee = feeFor(option.value);
                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
                        zone === option.value ? "border-walnut bg-walnut/5" : "border-line bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="zone"
                        value={option.value}
                        checked={zone === option.value}
                        onChange={() => setZone(option.value)}
                        className="mt-1 h-4 w-4 accent-[#8a5a3b]"
                      />
                      <span className="flex-1">
                        <span className="block text-sm font-medium">{option.label}</span>
                        <span className="mt-0.5 block text-xs text-muted">{option.note}</span>
                      </span>
                      <span className="text-sm font-semibold">
                        {optionFee === 0 ? "Miễn phí" : formatPrice(optionFee)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Phương thức thanh toán */}
            <fieldset>
              <legend className="mb-4 font-display text-xl">Phương thức thanh toán</legend>
              <ChonThanhToan
                gia={payment}
                total={total}
                onChange={setPayment}
                kyHan={kyHan}
                onKyHan={setKyHan}
              />

              <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={needInvoice}
                  onChange={() => setNeedInvoice((value) => !value)}
                  className="h-4 w-4 accent-[#8a5a3b]"
                />
                Xuất hoá đơn công ty
              </label>

              {needInvoice && (
                <div className="mt-3 grid gap-3 border border-line bg-white p-4 sm:grid-cols-2">
                  <input
                    value={company.name}
                    onChange={(event) =>
                      setCompany((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="field"
                    placeholder="Tên công ty"
                    aria-label="Tên công ty"
                  />
                  <input
                    value={company.tax}
                    onChange={(event) =>
                      setCompany((prev) => ({ ...prev, tax: event.target.value }))
                    }
                    className="field"
                    placeholder="Mã số thuế"
                    aria-label="Mã số thuế"
                  />
                  <input
                    value={company.address}
                    onChange={(event) =>
                      setCompany((prev) => ({ ...prev, address: event.target.value }))
                    }
                    className="field sm:col-span-2"
                    placeholder="Địa chỉ đăng ký kinh doanh"
                    aria-label="Địa chỉ công ty"
                  />
                  <p className="text-xs text-muted sm:col-span-2">
                    Thông tin hoá đơn phải cung cấp ngay khi đặt hàng, không bổ sung sau
                    30 ngày theo quy định thuế.
                  </p>
                </div>
              )}
            </fieldset>
          </div>

          {/*
            Tóm tắt đơn.
            min-w-0: ô lưới mặc định là `min-width: auto` nên không co xuống dưới
            min-content của nội dung bên trong. Tên sản phẩm dùng `truncate`
            (white-space: nowrap) sẽ đẩy cả cột rộng ra và làm tràn ngang trên
            điện thoại. Đặt min-w-0 để cột co lại và cho truncate làm việc.
          */}
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-white">
              <div className="border-b border-line p-5">
                <h2 className="font-display text-xl">Đơn hàng của bạn</h2>
                <p className="mt-1 text-xs text-muted">{count} món</p>
              </div>

              <div className="max-h-72 divide-y divide-line overflow-y-auto">
                {lines.map((line) => (
                  <div key={`${line.slug}-${line.color}`} className="flex gap-3 p-4">
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden border border-line bg-sand">
                      <ProductImage product={line.product} />
                      <span className="absolute right-0 top-0 bg-ink px-1.5 text-[11px] font-bold text-white">
                        {line.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{line.product.name}</p>
                      <p className="text-xs text-muted">{line.color}</p>
                      {line.note && (
                        <p className="mt-0.5 text-xs italic text-walnut">“{line.note}”</p>
                      )}
                    </div>
                    <p className="shrink-0 text-sm font-semibold">
                      {formatPrice(line.lineTotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-line p-5">
                <VoucherBox compact />
              </div>

              <dl className="space-y-2.5 border-t border-line p-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Tạm tính</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-sage">
                    <dt>Mã {voucher?.code}</dt>
                    <dd>−{formatPrice(voucherDiscount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted">Phí giao &amp; lắp đặt</dt>
                  <dd>
                    {fee === 0 ? (
                      <span className={voucher?.freeShipping ? "text-sage" : ""}>
                        Miễn phí
                      </span>
                    ) : (
                      formatPrice(fee)
                    )}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-3">
                  <dt className="font-semibold">Tổng cộng</dt>
                  <dd className="price text-2xl">
                    {formatPrice(total)}
                  </dd>
                </div>
                {/*
                  Khoản này đã nằm sẵn trong giá bán nên KHÔNG được trừ thêm lần nữa.
                  Đặt dưới tổng tiền và bỏ dấu trừ để khách không hiểu nhầm.
                */}
                {savings > 0 && (
                  <p className="pt-1 text-xs text-sage">
                    Bạn tiết kiệm {formatPrice(savings)} so với giá gốc.
                  </p>
                )}
              </dl>

              <div className="border-t border-line p-5">
                <button type="submit" className="btn btn-accent w-full">
                  Đặt hàng · {formatPrice(total)}
                </button>
                <p className="mt-3 text-center text-xs leading-relaxed text-muted">
                  Bấm đặt hàng đồng nghĩa bạn đồng ý với{" "}
                  <Link href="/chinh-sach/doi-tra" className="underline hover:text-walnut">
                    chính sách đổi trả
                  </Link>{" "}
                  và{" "}
                  <Link href="/chinh-sach/bao-mat" className="underline hover:text-walnut">
                    chính sách bảo mật
                  </Link>
                  .
                </p>
              </div>
            </div>

            <Link
              href="/gio-hang"
              className="mt-4 block text-center text-sm text-muted hover:text-walnut"
            >
              ← Quay lại giỏ hàng
            </Link>
          </aside>
        </div>
      </form>
    </>
  );
}
