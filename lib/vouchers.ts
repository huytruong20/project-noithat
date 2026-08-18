/**
 * Mã giảm giá. Thêm/sửa mã ngay trong mảng dưới đây.
 * Khi nối backend, thay `findVoucher` bằng lời gọi API kiểm tra mã.
 */

export type Voucher = {
  code: string;
  label: string;
  description: string;
  /** Giá trị đơn tối thiểu để dùng được mã */
  minSubtotal: number;
  /** Giảm theo phần trăm (0.1 = 10%) */
  percent?: number;
  /** Giảm số tiền cố định */
  amount?: number;
  /** Trần số tiền được giảm khi dùng phần trăm */
  maxDiscount?: number;
  /** Miễn phí vận chuyển mọi khu vực */
  freeShipping?: boolean;
  /** Hiện gợi ý ở trang giỏ hàng */
  promoted?: boolean;
};

export const vouchers: Voucher[] = [
  {
    code: "NHAMOC10",
    label: "Giảm 10%",
    description: "Giảm 10% cho đơn từ 5 triệu, tối đa 2 triệu.",
    minSubtotal: 5_000_000,
    percent: 0.1,
    maxDiscount: 2_000_000,
    promoted: true,
  },
  {
    code: "GIAM500",
    label: "Giảm 500.000đ",
    description: "Bớt thẳng 500.000đ cho đơn từ 10 triệu.",
    minSubtotal: 10_000_000,
    amount: 500_000,
    promoted: true,
  },
  {
    code: "FREESHIP",
    label: "Miễn phí vận chuyển",
    description: "Miễn phí giao hàng mọi tỉnh thành, không giới hạn giá trị đơn.",
    minSubtotal: 0,
    freeShipping: true,
    promoted: true,
  },
  {
    code: "NOITHAT5",
    label: "Giảm 5%",
    description: "Giảm 5% cho đơn từ 3 triệu, không giới hạn mức giảm.",
    minSubtotal: 3_000_000,
    percent: 0.05,
  },
];

export function findVoucher(code: string) {
  const key = code.trim().toUpperCase();
  return vouchers.find((voucher) => voucher.code === key);
}

export type VoucherCheck =
  | { ok: true; voucher: Voucher; discount: number }
  | { ok: false; error: string };

export function checkVoucher(code: string, subtotal: number): VoucherCheck {
  const voucher = findVoucher(code);
  if (!voucher) {
    return { ok: false, error: "Mã giảm giá không tồn tại hoặc đã hết hạn." };
  }
  if (subtotal < voucher.minSubtotal) {
    const missing = voucher.minSubtotal - subtotal;
    return {
      ok: false,
      error: `Mã này áp dụng cho đơn từ ${voucher.minSubtotal.toLocaleString("vi-VN")}đ. Bạn cần mua thêm ${missing.toLocaleString("vi-VN")}đ.`,
    };
  }
  return { ok: true, voucher, discount: discountOf(voucher, subtotal) };
}

/** Số tiền được giảm trên giá trị hàng (chưa tính phí vận chuyển) */
export function discountOf(voucher: Voucher | null, subtotal: number) {
  if (!voucher || subtotal < voucher.minSubtotal) return 0;
  if (voucher.amount) return Math.min(voucher.amount, subtotal);
  if (voucher.percent) {
    const raw = Math.round(subtotal * voucher.percent);
    return voucher.maxDiscount ? Math.min(raw, voucher.maxDiscount) : raw;
  }
  return 0;
}
