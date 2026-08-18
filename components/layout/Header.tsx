"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { categories, roomCollections } from "@/lib/data/categories";
import { mainNav, site } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { MenuTaiKhoan } from "./MenuTaiKhoan";

function CartIcon({ count }: { count: number }) {
  return (
    <span className="relative inline-flex">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 7h16l-1.5 12.5a2 2 0 01-2 1.5H7.5a2 2 0 01-2-1.5L4 7z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 7V5.5a3.5 3.5 0 117 0V7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-bold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, ready } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Đóng mọi lớp phủ khi chuyển trang
  useEffect(() => {
    setMenuOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/tim-kiem?q=${encodeURIComponent(q)}`);
    setMenuOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bone/95 backdrop-blur">
      {/* Dải thông tin trên cùng */}
      <div className="hidden bg-ink text-white md:block">
        <div className="shell flex h-9 items-center justify-between text-xs">
          <p>Miễn phí giao &amp; lắp đặt nội thành Gia Lai – TP.HCM · Bảo hành tới 5 năm</p>
          <div className="flex items-center gap-5">
            <Link href="/tra-cuu-don" className="hover:text-white/70">
              Tra cứu đơn hàng
            </Link>
            <Link href="/chinh-sach/bao-hanh" className="hover:text-white/70">
              Bảo hành
            </Link>
            <a href={site.hotlineHref} className="font-semibold">
              Hotline {site.hotline}
            </a>
          </div>
        </div>
      </div>

      <div className="shell flex h-16 items-center gap-4 md:h-20 md:gap-5 xl:gap-8">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="-ml-1 p-1 md:hidden"
          aria-label="Mở menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </button>

        <Link href="/" className="flex shrink-0 items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight">
            {site.name}
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted xl:inline">
            Gỗ tự nhiên
          </span>
        </Link>

        {/* Điều hướng chính */}
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <Link
              href="/danh-muc"
              className={`flex items-center gap-1 whitespace-nowrap px-2 py-2 text-sm font-medium transition-colors hover:text-walnut xl:px-3 ${
                isActive("/danh-muc") ? "text-walnut" : ""
              }`}
              aria-expanded={productsOpen}
            >
              Sản phẩm
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
              </svg>
            </Link>

            {productsOpen && (
              <div className="absolute left-0 top-full w-[680px] border border-line bg-white p-6 shadow-lift">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="eyebrow mb-3">Theo loại đồ</p>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {categories.map((category) => (
                        <li key={category.slug}>
                          <Link
                            href={`/danh-muc/${category.slug}`}
                            className="block py-1 text-sm hover:text-walnut"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow mb-3">Theo không gian</p>
                    <ul className="space-y-1.5">
                      {roomCollections.map((room) => (
                        <li key={room.slug}>
                          <Link
                            href={`/bo-suu-tap/${room.slug}`}
                            className="block py-1 text-sm hover:text-walnut"
                          >
                            {room.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                  <Link href="/danh-muc" className="font-semibold text-walnut hover:underline">
                    Xem tất cả sản phẩm →
                  </Link>
                  <span className="text-muted">Tư vấn miễn phí: {site.hotline}</span>
                </div>
              </div>
            )}
          </div>

          {mainNav.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-2 py-2 text-sm font-medium transition-colors hover:text-walnut xl:px-3 ${
                isActive(item.href) ? "text-walnut" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Tìm kiếm + giỏ hàng */}
        <div className="ml-auto flex items-center gap-2 md:gap-4">
          <form onSubmit={submitSearch} className="hidden lg:block">
            <label className="flex h-10 w-44 items-center gap-2 border border-line bg-white px-3 focus-within:border-walnut xl:w-56">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm sofa, giường, bàn ăn…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
                aria-label="Tìm kiếm sản phẩm"
              />
            </label>
          </form>

          <Link href="/tim-kiem" className="p-2 lg:hidden" aria-label="Tìm kiếm">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>

          <a
            href={site.hotlineHref}
            className="hidden items-center gap-2 whitespace-nowrap text-sm font-semibold xl:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 4h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            {site.hotline}
          </a>

          <span className="hidden md:inline-flex">
            <MenuTaiKhoan />
          </span>

          <Link href="/gio-hang" className="p-2" aria-label="Giỏ hàng">
            <CartIcon count={ready ? count : 0} />
          </Link>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMenuOpen(false)}
            aria-label="Đóng menu"
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-bone">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-display text-xl font-semibold">{site.name}</span>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Đóng">
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </button>
            </div>

            <form onSubmit={submitSearch} className="border-b border-line px-5 py-4">
              <label className="flex h-11 items-center gap-2 border border-line bg-white px-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Bạn cần tìm gì?"
                  className="w-full bg-transparent text-sm outline-none"
                  aria-label="Tìm kiếm sản phẩm"
                />
              </label>
            </form>

            <div className="px-5 py-4">
              <p className="eyebrow mb-3">Danh mục sản phẩm</p>
              <ul className="mb-6 space-y-0.5">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/danh-muc/${category.slug}`}
                      className="block border-b border-line/60 py-2.5 text-[15px]"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="eyebrow mb-3">Theo không gian</p>
              <ul className="mb-6 space-y-0.5">
                {roomCollections.map((room) => (
                  <li key={room.slug}>
                    <Link
                      href={`/bo-suu-tap/${room.slug}`}
                      className="block border-b border-line/60 py-2.5 text-[15px]"
                    >
                      {room.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="space-y-0.5">
                {mainNav.slice(1).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block border-b border-line/60 py-2.5 text-[15px] font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/tra-cuu-don" className="block py-2.5 text-[15px] font-medium">
                    Tra cứu đơn hàng
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-auto border-t border-line bg-sand px-5 py-4">
              <div className="mb-3 flex justify-center">
                <MenuTaiKhoan gonGang />
              </div>
              <a href={site.hotlineHref} className="btn btn-accent w-full">
                Gọi tư vấn {site.hotline}
              </a>
              <p className="mt-2 text-center text-xs text-muted">{site.workingHours}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
