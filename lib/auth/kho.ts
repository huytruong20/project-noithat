import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * KHO DỮ LIỆU GHI RA FILE JSON
 *
 * Tài khoản và đơn hàng phải sống lâu hơn một lần mở trình duyệt, mà dự án
 * chưa gắn cơ sở dữ liệu, nên tạm ghi ra thư mục `.data/` ở gốc dự án.
 *
 * ⚠️ TRƯỚC KHI ĐƯA LÊN MẠNG THẬT
 * Vercel, Netlify và phần lớn nền tảng serverless không cho ghi file, mỗi lần
 * deploy lại là mất sạch. Khi lên thật, đổi hai hàm `doc` và `ghi` bên dưới
 * sang truy vấn cơ sở dữ liệu (Postgres, MySQL, Supabase…). Toàn bộ phần còn
 * lại của trang gọi qua hai hàm này nên không phải sửa chỗ khác.
 */

const thuMuc = join(process.cwd(), ".data");

/**
 * Nơi chạy này có ghi file được không?
 *
 * Cloudflare Workers có sẵn node:fs nhưng gọi vào thì báo "not implemented".
 * Không chặn trước thì người dựng web nhận đúng câu đó và không hiểu chuyện
 * gì xảy ra. Chặn ở đây để câu lỗi nói thẳng nguyên nhân và cách sửa.
 */
const laMoiTruongKhongGhiDuocFile =
  typeof navigator !== "undefined" &&
  navigator.userAgent === "Cloudflare-Workers";

function chanNeuKhongGhiDuoc() {
  if (!laMoiTruongKhongGhiDuocFile) return;
  throw new Error(
    "Cloudflare Workers không cho ghi file, nên kho .data/ không dùng được ở đây. " +
      "Hãy đặt biến DATABASE_URL để chuyển sang Postgres — xem HUONG-DAN-DATABASE.md.",
  );
}

/** Đọc file JSON. Chưa có file thì trả về giá trị mặc định thay vì ném lỗi. */
export async function doc<T>(ten: string, macDinh: T): Promise<T> {
  chanNeuKhongGhiDuoc();
  try {
    const noiDung = await readFile(join(thuMuc, ten), "utf8");
    return JSON.parse(noiDung) as T;
  } catch {
    return macDinh;
  }
}

/**
 * Ghi file JSON.
 *
 * Ghi ra file tạm rồi mới đổi tên đè lên file thật. Nếu ghi thẳng mà tiến
 * trình chết giữa chừng thì file gốc còn lại một nửa và hỏng hẳn — đổi tên là
 * thao tác nguyên khối ở mức hệ điều hành nên không bao giờ để lại file dở.
 */
export async function ghi(ten: string, duLieu: unknown) {
  chanNeuKhongGhiDuoc();

  const duong = join(thuMuc, ten);
  await mkdir(dirname(duong), { recursive: true });

  const tam = `${duong}.${process.pid}.tmp`;
  await writeFile(tam, JSON.stringify(duLieu, null, 2), "utf8");
  await rename(tam, duong);
}
