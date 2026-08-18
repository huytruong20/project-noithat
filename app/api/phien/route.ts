import { NextResponse } from "next/server";
import { nguoiDangDangNhap } from "@/lib/auth/phien";

/**
 * Cho header biết ai đang đăng nhập.
 *
 * Vì sao phải qua API mà không đọc thẳng cookie trong layout: chỉ cần layout
 * gốc chạm vào cookie là Next chuyển TOÀN BỘ trang sang dựng theo từng lượt
 * truy cập, mất sạch 60+ trang tĩnh đang có. Trang sản phẩm khi đó chậm hẳn đi
 * chỉ để hiển thị đúng một cái tên trên header — không đáng.
 *
 * Chỉ trả về tên và vai trò. Email, số điện thoại, id đều không cần cho header
 * nên không gửi ra; gửi thừa dữ liệu cá nhân ra ngoài là tự tạo rủi ro.
 */
export async function GET() {
  const nguoiDung = await nguoiDangDangNhap();

  return NextResponse.json(
    nguoiDung ? { hoTen: nguoiDung.hoTen, vaiTro: nguoiDung.vaiTro } : null,
    // Cấm mọi tầng đệm nhớ lại kết quả này — nhớ nhầm là người này thấy tên
    // của người kia
    { headers: { "Cache-Control": "no-store, private" } },
  );
}
