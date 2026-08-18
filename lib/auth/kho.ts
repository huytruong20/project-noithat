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

/** Đọc file JSON. Chưa có file thì trả về giá trị mặc định thay vì ném lỗi. */
export async function doc<T>(ten: string, macDinh: T): Promise<T> {
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
  const duong = join(thuMuc, ten);
  await mkdir(dirname(duong), { recursive: true });

  const tam = `${duong}.${process.pid}.tmp`;
  await writeFile(tam, JSON.stringify(duLieu, null, 2), "utf8");
  await rename(tam, duong);
}
