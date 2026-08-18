import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { doc, ghi } from "./kho";
import { cheDauMatKhau, timTheoId, type NguoiDungCongKhai } from "./nguoi-dung";

/**
 * PHIÊN ĐĂNG NHẬP
 *
 * Sau khi đăng nhập, trình duyệt giữ một chiếc bánh quy (cookie) ghi id người
 * dùng kèm chữ ký. Chữ ký tạo bằng HMAC với khoá bí mật chỉ máy chủ biết, nên
 * khách sửa id trong cookie thành id của người khác thì chữ ký không khớp và
 * phiên bị coi là hỏng. Không có chữ ký thì ai cũng tự phong mình làm admin.
 *
 * Cookie đặt httpOnly nên JavaScript trên trang không đọc được — mã độc chèn
 * vào trang cũng không lấy được phiên đăng nhập mang đi nơi khác.
 */

const TEN_COOKIE = "phien_ht";
const HAN_NGAY = 30;

/**
 * Khoá ký. Ưu tiên biến môi trường AUTH_SECRET; chạy máy cá nhân chưa đặt biến
 * thì tự sinh một khoá ngẫu nhiên và cất vào .data/ để mỗi lần khởi động lại
 * không làm văng hết người đang đăng nhập.
 */
let khoaDangDung: string | null = null;

async function layKhoa() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (khoaDangDung) return khoaDangDung;

  const daLuu = await doc<{ khoa?: string }>("khoa-phien.json", {});
  if (daLuu.khoa) {
    khoaDangDung = daLuu.khoa;
    return khoaDangDung;
  }

  const moi = randomBytes(32).toString("hex");
  await ghi("khoa-phien.json", { khoa: moi });
  khoaDangDung = moi;
  return moi;
}

async function ky(duLieu: string) {
  return createHmac("sha256", await layKhoa()).update(duLieu).digest("hex");
}

/** Ghép id với chữ ký của nó thành nội dung cookie. */
async function dongGoi(id: string) {
  return `${id}.${await ky(id)}`;
}

/** Tách cookie ra, trả về id nếu chữ ký hợp lệ. */
async function moGoi(gia: string) {
  const cham = gia.lastIndexOf(".");
  if (cham < 1) return null;

  const id = gia.slice(0, cham);
  const chuKy = gia.slice(cham + 1);
  const dung = await ky(id);

  // So từng byte với thời gian cố định, tránh lộ thông tin qua độ trễ trả lời
  const a = Buffer.from(chuKy);
  const b = Buffer.from(dung);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  return id;
}

export async function moPhien(idNguoiDung: string) {
  const kho = await cookies();
  kho.set(TEN_COOKIE, await dongGoi(idNguoiDung), {
    httpOnly: true,
    sameSite: "lax",
    // Chỉ gửi qua HTTPS khi chạy thật; ở máy cá nhân là http nên phải tắt,
    // không thì cookie không bao giờ được lưu và đăng nhập xong lại văng ra.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: HAN_NGAY * 24 * 60 * 60,
  });
}

export async function dongPhien() {
  const kho = await cookies();
  kho.delete(TEN_COOKIE);
}

/** Người đang đăng nhập, hoặc null nếu là khách vãng lai. */
export async function nguoiDangDangNhap(): Promise<NguoiDungCongKhai | null> {
  const kho = await cookies();
  const gia = kho.get(TEN_COOKIE)?.value;
  if (!gia) return null;

  const id = await moGoi(gia);
  if (!id) return null;

  const nguoiDung = await timTheoId(id);
  // Tài khoản đã bị xoá nhưng cookie còn — coi như chưa đăng nhập
  return nguoiDung ? cheDauMatKhau(nguoiDung) : null;
}

/**
 * Bắt buộc phải đăng nhập mới xem được.
 * Chưa đăng nhập thì đá về trang đăng nhập, kèm địa chỉ đang muốn vào để đăng
 * nhập xong quay lại đúng chỗ đó thay vì rơi về trang chủ.
 */
export async function batBuocDangNhap(quayVe = "/tai-khoan") {
  const nguoiDung = await nguoiDangDangNhap();
  if (!nguoiDung) {
    redirect(`/dang-nhap?tiep=${encodeURIComponent(quayVe)}`);
  }
  return nguoiDung;
}

/** Bắt buộc phải là quản trị viên. */
export async function batBuocAdmin(quayVe = "/admin") {
  const nguoiDung = await batBuocDangNhap(quayVe);
  if (nguoiDung.vaiTro !== "admin") {
    // Đá về trang chủ chứ không hiện "bạn không đủ quyền" — báo như vậy là
    // xác nhận cho người lạ biết đường dẫn quản trị này có thật.
    redirect("/");
  }
  return nguoiDung;
}
