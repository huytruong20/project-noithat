"use client";

import { useRef, useState } from "react";

/**
 * Cắt một ảnh ghép thành nhiều ảnh nhỏ rồi lưu vào đúng sản phẩm.
 * Dùng khi có một tấm ảnh chứa nhiều món (ảnh chụp màn hình, ảnh catalogue).
 *
 * Toàn bộ việc cắt làm ngay trên trình duyệt bằng canvas, chỉ phần ảnh đã cắt
 * mới được gửi lên máy chủ.
 */

type Muc = { value: string; label: string };

type Vung = { x: number; y: number; w: number; h: number };

export function CatAnhGhep({ nhom }: { nhom: { ten: string; muc: Muc[] }[] }) {
  const [anhGoc, setAnhGoc] = useState<string | null>(null);
  const [vung, setVung] = useState<Vung | null>(null);
  const [dangKeo, setDangKeo] = useState(false);
  const [dich, setDich] = useState("");
  const [nhatKy, setNhatKy] = useState<string[]>([]);
  const [dangLuu, setDangLuu] = useState(false);

  const anhRef = useRef<HTMLImageElement>(null);
  const batDau = useRef<{ x: number; y: number } | null>(null);

  /** Đổi toạ độ chuột sang toạ độ trong khung ảnh đang hiển thị */
  function toaDo(e: React.MouseEvent) {
    const el = anhRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(e.clientX - r.left, r.width)),
      y: Math.max(0, Math.min(e.clientY - r.top, r.height)),
    };
  }

  function xuongChuot(e: React.MouseEvent) {
    const p = toaDo(e);
    batDau.current = p;
    setVung({ x: p.x, y: p.y, w: 0, h: 0 });
    setDangKeo(true);
  }

  function diChuyen(e: React.MouseEvent) {
    if (!dangKeo || !batDau.current) return;
    const p = toaDo(e);
    const s = batDau.current;
    setVung({
      x: Math.min(s.x, p.x),
      y: Math.min(s.y, p.y),
      w: Math.abs(p.x - s.x),
      h: Math.abs(p.y - s.y),
    });
  }

  function nhaChuot() {
    setDangKeo(false);
  }

  function chonFile(file?: File | null) {
    if (!file) return;
    setAnhGoc(URL.createObjectURL(file));
    setVung(null);
    setNhatKy([]);
  }

  /** Cắt vùng đã khoanh và gửi lên máy chủ */
  async function luuVung() {
    const el = anhRef.current;
    if (!el || !vung || vung.w < 10 || vung.h < 10) {
      setNhatKy((n) => ["⚠ Khoanh một vùng lớn hơn trước khi lưu.", ...n]);
      return;
    }
    if (!dich) {
      setNhatKy((n) => ["⚠ Chọn sản phẩm cần gắn ảnh.", ...n]);
      return;
    }

    setDangLuu(true);

    // Khung hiển thị có thể bị thu nhỏ so với ảnh gốc — quy đổi lại tỉ lệ
    const tiLe = el.naturalWidth / el.clientWidth;
    const sx = Math.round(vung.x * tiLe);
    const sy = Math.round(vung.y * tiLe);
    const sw = Math.round(vung.w * tiLe);
    const sh = Math.round(vung.h * tiLe);

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    canvas.getContext("2d")?.drawImage(el, sx, sy, sw, sh, 0, 0, sw, sh);

    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob((b) => res(b), "image/jpeg", 0.92),
    );
    if (!blob) {
      setNhatKy((n) => ["✗ Không cắt được ảnh.", ...n]);
      setDangLuu(false);
      return;
    }

    const [folder, slug] = dich.split("|");
    const form = new FormData();
    form.append("folder", folder);
    form.append("slug", slug);
    form.append("file", new File([blob], `${slug}.jpg`, { type: "image/jpeg" }));

    const res = await fetch("/api/tai-anh", { method: "POST", body: form });
    const kq = (await res.json()) as { ok: boolean; error?: string; path?: string };

    setNhatKy((n) => [
      kq.ok
        ? `✓ ${slug} — đã lưu ${sw}×${sh}px vào ${kq.path}`
        : `✗ ${slug} — ${kq.error}`,
      ...n,
    ]);
    setDangLuu(false);
    setVung(null);
  }

  return (
    <div className="border border-line bg-white p-5 md:p-6">
      <p className="font-display text-lg">Cắt ảnh ghép thành nhiều ảnh</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Có một tấm ảnh chứa nhiều món? Thả vào đây, dùng chuột khoanh từng món,
        chọn sản phẩm rồi bấm lưu. Làm lần lượt cho tới khi hết món.
      </p>

      <label className="btn btn-outline mt-4 inline-flex cursor-pointer">
        {anhGoc ? "Chọn ảnh ghép khác" : "Chọn ảnh ghép"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => chonFile(e.target.files?.[0])}
        />
      </label>

      {anhGoc && (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
          {/* Khung khoanh vùng */}
          <div>
            <div
              className="relative inline-block max-w-full cursor-crosshair select-none border border-line"
              onMouseDown={xuongChuot}
              onMouseMove={diChuyen}
              onMouseUp={nhaChuot}
              onMouseLeave={nhaChuot}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={anhRef}
                src={anhGoc}
                alt="Ảnh ghép cần cắt"
                className="block max-w-full"
                draggable={false}
              />
              {vung && vung.w > 0 && (
                <div
                  className="pointer-events-none absolute border-2 border-walnut bg-walnut/15"
                  style={{
                    left: vung.x,
                    top: vung.y,
                    width: vung.w,
                    height: vung.h,
                  }}
                />
              )}
            </div>
            <p className="mt-2 text-xs text-muted">
              Bấm giữ chuột và kéo để khoanh vùng cần cắt.
            </p>
          </div>

          {/* Bảng điều khiển */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Gắn vùng này vào
              </label>
              <select
                value={dich}
                onChange={(e) => setDich(e.target.value)}
                className="field"
              >
                <option value="">— Chọn sản phẩm —</option>
                {nhom.map((g) => (
                  <optgroup key={g.ten} label={g.ten}>
                    {g.muc.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {vung && vung.w > 10 && anhRef.current && (
              <p className="text-xs text-muted">
                Vùng đã chọn:{" "}
                {Math.round((vung.w * anhRef.current.naturalWidth) / anhRef.current.clientWidth)}
                {" × "}
                {Math.round((vung.h * anhRef.current.naturalWidth) / anhRef.current.clientWidth)}
                {" px"}
              </p>
            )}

            <button
              type="button"
              onClick={luuVung}
              disabled={dangLuu}
              className="btn btn-accent w-full"
            >
              {dangLuu ? "Đang lưu…" : "Lưu vùng đã khoanh"}
            </button>

            {nhatKy.length > 0 && (
              <div className="border border-line bg-sand p-3">
                <p className="text-xs font-semibold">Đã làm</p>
                <ul className="mt-1 space-y-1">
                  {nhatKy.map((d, i) => (
                    <li key={i} className="break-all text-[11px] text-muted">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
