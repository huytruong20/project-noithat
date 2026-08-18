/**
 * Biểu tượng cho từng phương thức thanh toán.
 *
 * Vẽ tay bằng SVG thay vì tải logo thật vì logo Momo, Visa, Vietcombank… đều
 * là nhãn hiệu đã đăng ký — đưa lên trang bán hàng khi chưa có hợp đồng liên
 * kết là dùng sai. Hình vẽ ở đây chỉ mô tả loại hình thanh toán nên dùng thoải mái.
 */
import type { MaThanhToan } from "@/lib/data/thanh-toan";

const chung = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function BieuTuongThanhToan({ ma }: { ma: MaThanhToan }) {
  switch (ma) {
    case "cod": // tờ tiền
      return (
        <svg {...chung}>
          <rect x="2" y="6" width="20" height="12" rx="1.5" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M5 9.5v5M19 9.5v5" />
        </svg>
      );

    case "chuyen-khoan": // trụ sở ngân hàng
      return (
        <svg {...chung}>
          <path d="M3 9.5 12 4l9 5.5" />
          <path d="M5 10v8M10 10v8M14 10v8M19 10v8" />
          <path d="M3 20h18" />
        </svg>
      );

    case "vi-dien-tu": // điện thoại có mã QR
      return (
        <svg {...chung}>
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <rect x="9" y="6" width="3" height="3" />
          <rect x="9" y="12" width="3" height="3" />
          <path d="M15 6v3M15 12h.01M15 15h.01" />
        </svg>
      );

    case "the": // thẻ ngân hàng
      return (
        <svg {...chung}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
          <path d="M6 15h4" />
        </svg>
      );

    case "tra-gop": // lịch chia kỳ
      return (
        <svg {...chung}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
          <path d="M8 14h.01M12 14h.01M16 14h.01" />
        </svg>
      );
  }
}
