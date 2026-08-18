import { writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import { join, extname } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

/**
 * Nhận file ảnh từ trang /tai-anh và lưu vào public/images/<thư mục>/<slug>.<đuôi>
 *
 * CHỈ CHẠY Ở CHẾ ĐỘ DEV. Khi build production, route này trả 403 để không ai
 * ngoài internet ghi file được vào máy chủ.
 */

const THU_MUC_HOP_LE = ["products", "categories", "rooms", "projects", "blog"];
const DUOI_HOP_LE = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const DUNG_LUONG_TOI_DA = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      { ok: false, error: "Trang tải ảnh chỉ dùng khi chạy npm run dev." },
      { status: 403 },
    );
  }

  const form = await request.formData();
  const folder = String(form.get("folder") ?? "");
  const slug = String(form.get("slug") ?? "");
  const file = form.get("file");

  if (!THU_MUC_HOP_LE.includes(folder)) {
    return Response.json({ ok: false, error: "Thư mục không hợp lệ." }, { status: 400 });
  }
  // Chỉ cho chữ thường, số và dấu gạch ngang — chặn đường dẫn kiểu ../
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return Response.json(
      { ok: false, error: "Tên file chỉ được gồm chữ thường, số và dấu gạch ngang." },
      { status: 400 },
    );
  }
  if (!(file instanceof File)) {
    return Response.json({ ok: false, error: "Chưa chọn file." }, { status: 400 });
  }
  if (file.size > DUNG_LUONG_TOI_DA) {
    return Response.json(
      { ok: false, error: "Ảnh nặng quá 10MB, nén lại trước khi tải lên." },
      { status: 400 },
    );
  }

  const ext = extname(file.name).toLowerCase();
  if (!DUOI_HOP_LE.includes(ext)) {
    return Response.json(
      { ok: false, error: `Chỉ nhận ${DUOI_HOP_LE.join(", ")}` },
      { status: 400 },
    );
  }

  const dir = join(process.cwd(), "public", "images", folder);
  await mkdir(dir, { recursive: true });

  // Xoá bản cũ cùng slug nhưng khác đuôi, tránh có cả .jpg lẫn .png cùng lúc
  try {
    for (const ten of await readdir(dir)) {
      const base = ten.slice(0, ten.lastIndexOf("."));
      if (base === slug && ten !== `${slug}${ext}`) {
        await unlink(join(dir, ten));
      }
    }
  } catch {
    // Thư mục mới tạo, chưa có gì để dọn
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, `${slug}${ext}`), buffer);

  // Quét lại để cập nhật lib/data/images.generated.ts, trang tự tải lại
  await run("node", ["scripts/quet-anh.mjs"], { cwd: process.cwd() });

  return Response.json({ ok: true, path: `/images/${folder}/${slug}${ext}` });
}
