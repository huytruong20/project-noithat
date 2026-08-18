"use client";

import { useState } from "react";
import {
  hanMucCOD,
  kyHanTraGop,
  loaiThe,
  nganHangTraGop,
  phuongThucThanhToan,
  taiKhoanNganHang,
  toiThieuTraGop,
  viDienTu,
  type MaThanhToan,
} from "@/lib/data/thanh-toan";
import { formatPrice } from "@/lib/format";
import { BieuTuongThanhToan } from "./BieuTuongThanhToan";

/**
 * Khối chọn phương thức thanh toán.
 *
 * Khác với danh sách radio trơn trước đây, mỗi lựa chọn khi được chọn sẽ mở ra
 * phần chi tiết ngay bên dưới: số tài khoản để chuyển, danh sách ví, loại thẻ
 * máy POS nhận, hay bảng kỳ hạn trả góp kèm số tiền mỗi tháng. Khách không
 * phải đặt hàng xong mới biết mình sẽ trả bằng cách nào.
 */
export function ChonThanhToan({
  gia,
  total,
  onChange,
  kyHan,
  onKyHan,
}: {
  /** Mã phương thức đang chọn */
  gia: MaThanhToan;
  /** Tổng tiền đơn, dùng để khoá COD và tính tiền trả góp mỗi tháng */
  total: number;
  onChange: (ma: MaThanhToan) => void;
  kyHan: number;
  onKyHan: (thang: number) => void;
}) {
  const [daChep, setDaChep] = useState("");

  const chep = async (text: string, ten: string) => {
    try {
      await navigator.clipboard.writeText(text.replace(/\s/g, ""));
      setDaChep(ten);
      setTimeout(() => setDaChep(""), 2000);
    } catch {
      // Trình duyệt chặn clipboard (thường do trang chưa chạy HTTPS).
      // Không báo lỗi đỏ làm khách hoảng — số vẫn hiện sẵn để bôi đen chép tay.
      setDaChep("");
    }
  };

  const khoaCOD = total >= hanMucCOD;
  const khoaTraGop = total < toiThieuTraGop;

  const biKhoa = (ma: MaThanhToan) =>
    (ma === "cod" && khoaCOD) || (ma === "tra-gop" && khoaTraGop);

  const lyDoKhoa = (ma: MaThanhToan) =>
    ma === "cod"
      ? `Đơn từ ${formatPrice(hanMucCOD)} không áp dụng COD — chọn hình thức khác giúp chúng tôi.`
      : `Trả góp áp dụng cho đơn từ ${formatPrice(toiThieuTraGop)}.`;

  return (
    <div className="space-y-2">
      {phuongThucThanhToan.map((method) => {
        const dangChon = gia === method.key;
        const khoa = biKhoa(method.key);

        return (
          <div
            key={method.key}
            className={`border transition-colors ${
              dangChon ? "border-walnut bg-walnut-soft/40" : "border-line bg-white"
            } ${khoa ? "opacity-55" : ""}`}
          >
            <label
              className={`flex items-start gap-3 p-4 ${
                khoa ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.key}
                checked={dangChon}
                disabled={khoa}
                onChange={() => onChange(method.key)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#8a5a3b]"
              />

              <span
                className={`mt-0.5 shrink-0 ${dangChon ? "text-walnut" : "text-muted"}`}
              >
                <BieuTuongThanhToan ma={method.key} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-medium">{method.label}</span>
                  {method.badge && !khoa && (
                    <span className="border border-walnut/30 bg-white px-1.5 py-0.5 text-[0.6875rem] font-semibold text-walnut">
                      {method.badge}
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">
                  {khoa ? lyDoKhoa(method.key) : method.note}
                </span>
              </span>
            </label>

            {/* Chi tiết chỉ hiện cho mục đang chọn, đỡ rối mắt */}
            {dangChon && !khoa && (
              <div className="animate-truot-xuong border-t border-walnut/20 px-4 py-4 text-sm">
                {method.key === "cod" && (
                  <ul className="space-y-1.5 text-xs leading-relaxed text-muted">
                    <li>· Chuẩn bị đúng {formatPrice(total)} tiền mặt khi nhận hàng.</li>
                    <li>
                      · Mở hộp kiểm tra trước mặt nhân viên giao, thiếu hoặc xước được
                      từ chối nhận ngay.
                    </li>
                    <li>· Nhân viên gọi trước 30 phút, không phải chờ ở nhà cả ngày.</li>
                  </ul>
                )}

                {method.key === "chuyen-khoan" && (
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                    <dl className="min-w-0 space-y-2">
                      <Dong nhan="Ngân hàng" giaTri={taiKhoanNganHang.nganHang} />
                      <Dong
                        nhan="Số tài khoản"
                        giaTri={taiKhoanNganHang.soTaiKhoan}
                        dam
                        onChep={() => chep(taiKhoanNganHang.soTaiKhoan, "stk")}
                        daChep={daChep === "stk"}
                      />
                      <Dong nhan="Chủ tài khoản" giaTri={taiKhoanNganHang.chuTaiKhoan} />
                      <Dong nhan="Nội dung" giaTri="Họ tên + số điện thoại đặt hàng" />
                      <p className="pt-1 text-xs leading-relaxed text-muted">
                        Chuyển xong không cần gửi ảnh — chúng tôi đối soát và nhắn xác
                        nhận trong 15 phút giờ hành chính.
                      </p>
                    </dl>

                    {/* Ô mã QR: có ảnh thì hiện ảnh, chưa có thì hiện ô hướng dẫn */}
                    <div className="mx-auto w-32 shrink-0 sm:mx-0">
                      {taiKhoanNganHang.anhQR ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={taiKhoanNganHang.anhQR}
                          alt="Mã QR chuyển khoản"
                          className="w-32 border border-line bg-white p-2"
                        />
                      ) : (
                        <div className="flex aspect-square w-32 flex-col items-center justify-center border border-dashed border-line bg-white p-3 text-center text-muted">
                          <BieuTuongThanhToan ma="vi-dien-tu" />
                          <span className="mt-2 text-[0.6875rem] leading-tight">
                            Mã QR gửi kèm tin nhắn xác nhận đơn
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {method.key === "vi-dien-tu" && (
                  <div>
                    <p className="mb-3 text-xs text-muted">
                      Chọn ví bạn dùng, mã QR hiện ra ngay sau khi đặt đơn:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {viDienTu.map((vi) => (
                        <span
                          key={vi.ten}
                          className="flex items-center gap-2 border border-line bg-white px-3 py-1.5 text-xs font-medium"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: vi.mau }}
                            aria-hidden
                          />
                          {vi.ten}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {method.key === "the" && (
                  <div>
                    <p className="mb-3 text-xs leading-relaxed text-muted">
                      Nhân viên mang máy POS tới tận nơi. Không thu phụ phí quẹt thẻ.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {loaiThe.map((the) => (
                        <span
                          key={the}
                          className="border border-line bg-white px-3 py-1.5 text-xs font-medium"
                        >
                          {the}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {method.key === "tra-gop" && (
                  <div>
                    <p className="mb-3 text-xs text-muted">Chọn kỳ hạn:</p>
                    <div className="flex flex-wrap gap-2">
                      {kyHanTraGop.map((thang) => {
                        const chon = kyHan === thang;
                        return (
                          <button
                            key={thang}
                            type="button"
                            onClick={() => onKyHan(thang)}
                            className={`border px-3 py-2 text-left transition-colors ${
                              chon
                                ? "border-walnut bg-white text-walnut"
                                : "border-line bg-white hover:border-walnut"
                            }`}
                          >
                            <span className="block text-xs font-semibold">
                              {thang} tháng
                            </span>
                            <span className="price mt-0.5 block text-xs">
                              {formatPrice(Math.round(total / thang))}/tháng
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-muted">
                      Lãi suất 0%, không phí chuyển đổi. Áp dụng thẻ tín dụng của:{" "}
                      {nganHangTraGop.join(" · ")}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Một dòng "nhãn — giá trị" trong bảng thông tin chuyển khoản */
function Dong({
  nhan,
  giaTri,
  dam,
  onChep,
  daChep,
}: {
  nhan: string;
  giaTri: string;
  dam?: boolean;
  onChep?: () => void;
  daChep?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <dt className="w-28 shrink-0 text-xs text-muted">{nhan}</dt>
      <dd className={`min-w-0 flex-1 text-sm ${dam ? "price text-base tracking-wide" : ""}`}>
        {giaTri}
        {onChep && (
          <button
            type="button"
            onClick={onChep}
            className="ml-2 align-middle text-xs font-semibold text-walnut hover:underline"
          >
            {daChep ? "Đã chép ✓" : "Chép"}
          </button>
        )}
      </dd>
    </div>
  );
}
