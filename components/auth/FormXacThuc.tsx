"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { KetQua } from "@/lib/auth/thao-tac";

/**
 * Khung dùng chung cho form đăng nhập, đăng ký và sửa hồ sơ.
 *
 * Gom vào một chỗ vì cả ba đều cần đúng ba thứ giống nhau: khoá nút trong lúc
 * gửi để khỏi bấm hai lần, chỗ hiện lỗi từ máy chủ, và báo lỗi bằng vùng
 * aria-live để trình đọc màn hình đọc lên thay vì người mù ngồi chờ vô ích.
 */
export function FormXacThuc({
  thaoTac,
  nutChu,
  children,
}: {
  thaoTac: (truoc: KetQua, form: FormData) => Promise<KetQua>;
  nutChu: string;
  children: React.ReactNode;
}) {
  const [ketQua, gui] = useActionState(thaoTac, {} as KetQua);

  return (
    <form action={gui} className="space-y-4">
      {children}

      <div aria-live="polite">
        {ketQua.loi && (
          <p className="animate-truot-xuong border border-clay/40 bg-clay/5 px-3 py-2.5 text-sm text-clay">
            {ketQua.loi}
          </p>
        )}
        {ketQua.xong && (
          <p className="animate-truot-xuong border border-sage/40 bg-sage/5 px-3 py-2.5 text-sm text-sage">
            {ketQua.xong}
          </p>
        )}
      </div>

      <NutGui chu={nutChu} />
    </form>
  );
}

/**
 * Nút gửi tự khoá khi form đang chạy.
 * useFormStatus chỉ đọc được trạng thái khi nằm TRONG thẻ form, nên phải tách
 * ra thành component riêng chứ không viết thẳng ở trên được.
 */
function NutGui({ chu }: { chu: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full">
      {pending && (
        <span
          className="animate-xoay h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white"
          aria-hidden
        />
      )}
      {pending ? "Đang xử lý…" : chu}
    </button>
  );
}

/** Một ô nhập kèm nhãn, dùng lại cho mọi form xác thực. */
export function O({
  ten,
  nhan,
  loai = "text",
  batBuoc,
  macDinh,
  goiY,
  tuDien,
}: {
  ten: string;
  nhan: string;
  loai?: string;
  batBuoc?: boolean;
  macDinh?: string;
  goiY?: string;
  /** Gợi ý cho trình duyệt tự điền, ví dụ "current-password" */
  tuDien?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {nhan}
        {batBuoc && <span className="ml-1 text-clay">*</span>}
      </span>
      <input
        name={ten}
        type={loai}
        required={batBuoc}
        defaultValue={macDinh}
        autoComplete={tuDien}
        className="field"
      />
      {goiY && <span className="mt-1 block text-xs text-muted">{goiY}</span>}
    </label>
  );
}
