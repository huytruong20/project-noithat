"use client";

import { useState } from "react";
import { categories, roomCollections } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { projects } from "@/lib/data/projects";
import { posts } from "@/lib/data/posts";
import { CatAnhGhep } from "@/components/upload/CatAnhGhep";

/**
 * Trang nội bộ để tải ảnh lên bằng cách kéo thả — chỉ dùng khi chạy npm run dev.
 * Xoá thư mục app/tai-anh và app/api/tai-anh trước khi đưa web lên production.
 */

type Muc = { slug: string; ten: string };

const nhomAnh: { folder: string; tieuDe: string; moTa: string; muc: Muc[] }[] = [
  {
    folder: "categories",
    tieuDe: "Ảnh danh mục",
    moTa: "Hiện ở khối “Khám phá theo nhu cầu” trang chủ. Tỉ lệ ngang 3:2.",
    muc: categories.map((c) => ({ slug: c.slug, ten: c.name })),
  },
  {
    folder: "products",
    tieuDe: "Ảnh sản phẩm",
    moTa: "Ảnh đại diện của từng món. Tỉ lệ dọc 4:5. Thêm ảnh 2, 3, 4 ở ô nhập bên dưới.",
    muc: products.map((p) => ({ slug: p.slug, ten: p.name })),
  },
  {
    folder: "rooms",
    tieuDe: "Ảnh không gian",
    moTa: "Dùng cho các bộ sưu tập theo phòng. Tỉ lệ ngang 3:2.",
    muc: roomCollections.map((r) => ({ slug: r.slug, ten: r.name })),
  },
  {
    folder: "projects",
    tieuDe: "Ảnh dự án",
    moTa: "Ảnh bìa từng dự án. Tỉ lệ ngang 3:2.",
    muc: projects.map((p) => ({ slug: p.slug, ten: p.title })),
  },
  {
    folder: "blog",
    tieuDe: "Ảnh bài viết",
    moTa: "Ảnh bìa bài tư vấn. Tỉ lệ ngang 3:2.",
    muc: posts.map((p) => ({ slug: p.slug, ten: p.title })),
  },
];

async function guiFile(folder: string, slug: string, file: File) {
  const form = new FormData();
  form.append("folder", folder);
  form.append("slug", slug);
  form.append("file", file);
  const res = await fetch("/api/tai-anh", { method: "POST", body: form });
  return (await res.json()) as { ok: boolean; error?: string; path?: string };
}

function OTaiAnh({
  folder,
  slug,
  ten,
}: {
  folder: string;
  slug: string;
  ten: string;
}) {
  const [trangThai, setTrangThai] = useState<"cho" | "dang" | "xong" | "loi">("cho");
  const [thongBao, setThongBao] = useState("");
  const [xemTruoc, setXemTruoc] = useState<string | null>(null);
  const [keo, setKeo] = useState(false);

  async function nhan(file?: File | null) {
    if (!file) return;
    setTrangThai("dang");
    setThongBao("");
    const ketQua = await guiFile(folder, slug, file);
    if (ketQua.ok) {
      setTrangThai("xong");
      // Thêm tham số thời gian để trình duyệt không dùng lại ảnh cũ trong bộ nhớ đệm
      setXemTruoc(`${ketQua.path}?v=${Date.now()}`);
      setThongBao(ketQua.path ?? "");
    } else {
      setTrangThai("loi");
      setThongBao(ketQua.error ?? "Tải lên thất bại.");
    }
  }

  const vien =
    trangThai === "xong"
      ? "border-sage bg-sage/5"
      : trangThai === "loi"
        ? "border-clay bg-clay/5"
        : keo
          ? "border-walnut bg-walnut/5"
          : "border-line bg-white";

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setKeo(true);
      }}
      onDragLeave={() => setKeo(false)}
      onDrop={(e) => {
        e.preventDefault();
        setKeo(false);
        nhan(e.dataTransfer.files?.[0]);
      }}
      className={`flex cursor-pointer items-center gap-3 border border-dashed p-3 transition-colors ${vien}`}
    >
      <div className="h-14 w-20 shrink-0 overflow-hidden border border-line bg-sand">
        {xemTruoc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={xemTruoc} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">
            trống
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{ten}</p>
        <p className="truncate font-mono text-[11px] text-muted">
          {slug}.jpg
        </p>
        {trangThai === "dang" && (
          <p className="text-[11px] text-walnut">Đang tải lên…</p>
        )}
        {trangThai === "xong" && (
          <p className="truncate text-[11px] text-sage">✓ Đã lưu {thongBao}</p>
        )}
        {trangThai === "loi" && (
          <p className="text-[11px] text-clay">{thongBao}</p>
        )}
      </div>

      <span className="shrink-0 border border-line px-3 py-1.5 text-xs">Chọn ảnh</span>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => nhan(e.target.files?.[0])}
      />
    </label>
  );
}

/** Ô nhập tự do: dùng khi cần thêm ảnh 2, 3, 4 cho một sản phẩm */
function TaiTheoTen() {
  const [folder, setFolder] = useState("products");
  const [slug, setSlug] = useState("");
  const [thongBao, setThongBao] = useState("");

  async function nhan(file?: File | null) {
    if (!file) return;
    if (!slug.trim()) {
      setThongBao("Nhập tên file trước khi chọn ảnh.");
      return;
    }
    setThongBao("Đang tải lên…");
    const ketQua = await guiFile(folder, slug.trim(), file);
    setThongBao(ketQua.ok ? `✓ Đã lưu ${ketQua.path}` : (ketQua.error ?? "Lỗi"));
  }

  return (
    <div className="border border-line bg-white p-5">
      <p className="font-display text-lg">Tải theo tên tự nhập</p>
      <p className="mt-1 text-sm text-muted">
        Dùng khi cần thêm ảnh thứ 2, 3, 4 cho một sản phẩm. Ví dụ nhập{" "}
        <code className="bg-sand px-1">sofa-vang-mila-2</code> để thêm ảnh góc nghiêng.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="field w-auto"
        >
          <option value="products">products — sản phẩm</option>
          <option value="categories">categories — danh mục</option>
          <option value="rooms">rooms — không gian</option>
          <option value="projects">projects — dự án</option>
          <option value="blog">blog — bài viết</option>
        </select>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="sofa-vang-mila-2"
          className="field w-64 font-mono text-sm"
        />
        <label className="btn btn-outline cursor-pointer">
          Chọn ảnh
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => nhan(e.target.files?.[0])}
          />
        </label>
      </div>
      {thongBao && <p className="mt-3 text-sm text-muted">{thongBao}</p>}
    </div>
  );
}

export default function TaiAnhPage() {
  return (
    <section className="shell py-10 md:py-14">
      <p className="eyebrow mb-2">Trang nội bộ</p>
      <h1 className="text-3xl md:text-4xl">Tải ảnh lên website</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
        Kéo ảnh thả vào ô tương ứng, hoặc bấm “Chọn ảnh”. File được lưu thẳng vào
        thư mục <code className="bg-sand px-1">public/images/</code> với đúng tên,
        và trang web cập nhật ngay — không cần đổi tên file thủ công.
      </p>

      <div className="mt-6 border border-clay/40 bg-clay/5 p-4 text-sm">
        <p className="font-semibold text-clay">Lưu ý</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-muted">
          <li>
            Trang này chỉ hoạt động khi chạy <code className="bg-white px-1">npm run dev</code>{" "}
            trên máy bạn. Khi web lên production nó tự khoá.
          </li>
          <li>
            Xoá hai thư mục <code className="bg-white px-1">app/tai-anh</code> và{" "}
            <code className="bg-white px-1">app/api/tai-anh</code> trước khi bàn giao.
          </li>
          <li>Chỉ dùng ảnh bạn có quyền sử dụng, tránh ảnh có watermark của bên khác.</li>
        </ul>
      </div>

      {/* Cắt ảnh ghép — đặt lên đầu vì hay dùng nhất khi mới bắt đầu */}
      <div className="mt-10">
        <CatAnhGhep
          nhom={nhomAnh.map((n) => ({
            ten: n.tieuDe,
            muc: n.muc.map((m) => ({
              value: `${n.folder}|${m.slug}`,
              label: m.ten,
            })),
          }))}
        />
      </div>

      <div className="mt-12 space-y-12">
        {nhomAnh.map((nhom) => (
          <div key={nhom.folder}>
            <h2 className="text-xl">{nhom.tieuDe}</h2>
            <p className="mt-1 text-sm text-muted">{nhom.moTa}</p>
            <p className="mt-1 font-mono text-xs text-muted">
              public/images/{nhom.folder}/
            </p>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {nhom.muc.map((m) => (
                <OTaiAnh
                  key={m.slug}
                  folder={nhom.folder}
                  slug={m.slug}
                  ten={m.ten}
                />
              ))}
            </div>
          </div>
        ))}

        <TaiTheoTen />
      </div>
    </section>
  );
}
