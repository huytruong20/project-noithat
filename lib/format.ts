/**
 * 14900000 -> "14.900.000đ"
 * Dùng "đ" thay ký hiệu ₫ (U+20AB): glyph ₫ trong đa số font bị nhỏ và lệch
 * lên trên, còn "đ" là cách viết quen thuộc trên các sàn thương mại Việt Nam.
 */
export function formatPrice(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

/** Rút gọn cho nhãn bộ lọc: 14900000 -> "14,9 triệu" */
export function formatShortPrice(value: number) {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const text = Number.isInteger(millions)
      ? millions.toString()
      : millions.toFixed(1).replace(".", ",");
    return `${text} triệu`;
  }
  return `${(value / 1000).toFixed(0)} nghìn`;
}

export function discountPercent(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function formatDimensions(d: { long: number; wide: number; high: number }) {
  return `D${d.long} × R${d.wide} × C${d.high} cm`;
}

/**
 * Thời hạn bảo hành nói bằng NĂM cho khách dễ hình dung: 60 -> "5 năm".
 * Chỉ rơi về tháng khi con số không tròn năm, ví dụ 18 -> "18 tháng".
 * Dữ liệu vẫn lưu bằng tháng ở trường `warrantyMonths`, chỉ đổi cách hiển thị.
 */
export function formatWarranty(months: number) {
  if (months === 0) return "Không áp dụng";
  if (months % 12 === 0) return `${months / 12} năm`;
  return `${months} tháng`;
}

/** Mã đơn dạng HT-8F2K31 — tạo từ thời điểm đặt hàng */
export function makeOrderCode(seed = Date.now()) {
  return `HT-${seed.toString(36).slice(-6).toUpperCase()}`;
}
