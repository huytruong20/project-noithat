"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Order, OrderStatus } from "@/lib/orders";
import { luuDon, doiTrangThai as doiTrangThaiKho } from "./don-hang-may-chu";
import {
  capNhatHoSo,
  doiVaiTro as doiVaiTroKho,
  kiemTraDangNhap,
  taoNguoiDung,
  type VaiTro,
} from "./nguoi-dung";
import { batBuocAdmin, batBuocDangNhap, dongPhien, moPhien, nguoiDangDangNhap } from "./phien";

/**
 * CÁC THAO TÁC CHẠY Ở MÁY CHỦ
 *
 * "use server" ở đầu file khiến mọi hàm dưới đây trở thành điểm gọi từ trình
 * duyệt. Chính vì thế phải coi mọi thứ nhận vào là do người lạ gửi lên: kiểm
 * tra lại toàn bộ dữ liệu và kiểm tra lại quyền ngay trong từng hàm, không tin
 * vào việc giao diện đã chặn sẵn. Người ta gọi thẳng vào đây được mà không cần
 * mở trang.
 */

export type KetQua = { loi?: string; xong?: string };

/* ------------------------------ Đăng ký ------------------------------ */

export async function dangKy(_truoc: KetQua, form: FormData): Promise<KetQua> {
  const hoTen = String(form.get("hoTen") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const soDienThoai = String(form.get("soDienThoai") ?? "").trim();
  const matKhau = String(form.get("matKhau") ?? "");
  const nhapLai = String(form.get("nhapLai") ?? "");

  if (hoTen.length < 2) return { loi: "Cho chúng tôi biết tên bạn với." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { loi: "Email chưa đúng dạng, kiểm tra lại giúp bạn nhé." };
  if (soDienThoai && !/^0\d{9}$/.test(soDienThoai.replace(/\s/g, "")))
    return { loi: "Số điện thoại phải có 10 số và bắt đầu bằng 0." };
  if (matKhau.length < 8) return { loi: "Mật khẩu cần ít nhất 8 ký tự." };
  if (matKhau !== nhapLai) return { loi: "Hai lần nhập mật khẩu chưa giống nhau." };

  const ketQua = await taoNguoiDung({ email, matKhau, hoTen, soDienThoai });
  if (!ketQua.ok) return { loi: ketQua.loi };

  await moPhien(ketQua.nguoiDung.id);
  redirect("/tai-khoan");
}

/* ----------------------------- Đăng nhập ----------------------------- */

export async function dangNhap(_truoc: KetQua, form: FormData): Promise<KetQua> {
  const email = String(form.get("email") ?? "").trim();
  const matKhau = String(form.get("matKhau") ?? "");
  const tiep = String(form.get("tiep") ?? "/tai-khoan");

  if (!email || !matKhau) return { loi: "Nhập đủ email và mật khẩu giúp bạn nhé." };

  const nguoiDung = await kiemTraDangNhap(email, matKhau);
  if (!nguoiDung) {
    // Cùng một câu cho cả hai trường hợp sai email và sai mật khẩu. Nếu tách
    // ra thành "email không tồn tại" thì người lạ dò được email nào đã đăng ký.
    return { loi: "Email hoặc mật khẩu không đúng." };
  }

  await moPhien(nguoiDung.id);

  // Chỉ nhận đường dẫn nội bộ. Không có dòng này thì gắn ?tiep=https://trang-gia-mao
  // vào link là lừa được khách đăng nhập xong nhảy thẳng sang trang lừa đảo.
  redirect(tiep.startsWith("/") && !tiep.startsWith("//") ? tiep : "/tai-khoan");
}

/* ----------------------------- Đăng xuất ----------------------------- */

export async function dangXuat() {
  await dongPhien();
  redirect("/");
}

/* -------------------------- Sửa thông tin --------------------------- */

export async function suaHoSo(_truoc: KetQua, form: FormData): Promise<KetQua> {
  const nguoiDung = await batBuocDangNhap();

  const hoTen = String(form.get("hoTen") ?? "").trim();
  const soDienThoai = String(form.get("soDienThoai") ?? "").trim();

  if (hoTen.length < 2) return { loi: "Tên chưa hợp lệ." };
  if (soDienThoai && !/^0\d{9}$/.test(soDienThoai.replace(/\s/g, "")))
    return { loi: "Số điện thoại phải có 10 số và bắt đầu bằng 0." };

  await capNhatHoSo(nguoiDung.id, { hoTen, soDienThoai });
  revalidatePath("/tai-khoan");
  return { xong: "Đã lưu thông tin." };
}

/* -------------------------- Ghi đơn hàng ---------------------------- */

/**
 * Gọi từ trang thanh toán sau khi đặt hàng.
 *
 * Không dùng số tiền do trình duyệt gửi lên để làm gì khác ngoài lưu lại xem —
 * khi nối cổng thanh toán thật, số tiền phải tính lại từ giỏ hàng ở máy chủ,
 * nếu không người ta sửa được giá ngay trong trình duyệt.
 */
export async function ghiDonLenMayChu(don: Order) {
  const nguoiDung = await nguoiDangDangNhap();
  await luuDon({ ...don, idNguoiDung: nguoiDung?.id });
}

/* ---------------------- Thao tác của quản trị ----------------------- */

export async function doiTrangThaiDon(ma: string, trangThai: OrderStatus) {
  await batBuocAdmin();
  await doiTrangThaiKho(ma, trangThai);
  revalidatePath("/admin");
  revalidatePath("/admin/don-hang");
}

export async function doiVaiTro(id: string, vaiTro: VaiTro) {
  const admin = await batBuocAdmin();

  // Tự hạ quyền chính mình sẽ khoá luôn cửa vào trang quản trị nếu đây là
  // admin cuối cùng — chặn ngay từ đây cho chắc.
  if (id === admin.id) return;

  await doiVaiTroKho(id, vaiTro);
  revalidatePath("/admin/nguoi-dung");
}
