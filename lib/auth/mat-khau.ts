import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  matKhau: string,
  muoi: Buffer,
  doDai: number,
) => Promise<Buffer>;

/**
 * BĂM MẬT KHẨU
 *
 * Không bao giờ lưu mật khẩu nguyên văn. Nếu file dữ liệu lọt ra ngoài, kẻ lấy
 * được sẽ có luôn mật khẩu của mọi khách — và phần lớn người dùng đặt cùng một
 * mật khẩu cho email, ngân hàng, nên thiệt hại vượt xa phạm vi trang này.
 *
 * Dùng scrypt: cố tình chạy chậm và ngốn bộ nhớ để máy dò thử hàng triệu mật
 * khẩu mỗi giây trở nên vô nghĩa. SHA-256 hay MD5 chạy quá nhanh nên không
 * dùng để băm mật khẩu được.
 *
 * Mỗi mật khẩu có một chuỗi muối riêng, nên hai người đặt trùng mật khẩu vẫn
 * ra hai chuỗi băm khác nhau — kẻ tấn công không thể tra bảng dựng sẵn.
 */

const DAI_MUOI = 16;
const DAI_KHOA = 64;

export async function bam(matKhau: string) {
  const muoi = randomBytes(DAI_MUOI);
  const khoa = await scryptAsync(matKhau.normalize("NFKC"), muoi, DAI_KHOA);
  return `${muoi.toString("hex")}:${khoa.toString("hex")}`;
}

/** So mật khẩu người dùng nhập với chuỗi băm đã lưu. */
export async function doiChieu(matKhau: string, daBam: string) {
  const [muoiHex, khoaHex] = daBam.split(":");
  if (!muoiHex || !khoaHex) return false;

  const khoaCu = Buffer.from(khoaHex, "hex");
  const khoaMoi = await scryptAsync(
    matKhau.normalize("NFKC"),
    Buffer.from(muoiHex, "hex"),
    khoaCu.length,
  );

  /*
    So bằng timingSafeEqual chứ không dùng === : phép so sánh chuỗi thường dừng
    ngay tại ký tự đầu tiên khác nhau, nên thời gian trả lời tiết lộ đoán đúng
    được bao nhiêu ký tự. timingSafeEqual luôn chạy hết, thời gian như nhau.
  */
  return khoaCu.length === khoaMoi.length && timingSafeEqual(khoaCu, khoaMoi);
}
