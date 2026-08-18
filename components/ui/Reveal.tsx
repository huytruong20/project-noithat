"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Khối con hiện dần lên khi cuộn tới.
 *
 * Dùng IntersectionObserver thay vì bắt sự kiện scroll: trình duyệt tự báo khi
 * phần tử lọt vào màn hình, không phải tính toán lại vị trí ở mỗi khung hình
 * nên cuộn không bị giật ngay cả khi trang có vài chục khối.
 *
 * Hiện xong là ngắt theo dõi luôn — cuộn ngược lên không cho chạy lại, vì hiệu
 * ứng lặp đi lặp lại làm người đọc mệt mắt.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Thẻ HTML muốn dựng ra — mặc định là div */
  as?: ElementType;
  /** Trễ bao nhiêu mili giây, dùng để các thẻ trong lưới hiện so le nhau */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Máy không hỗ trợ thì hiện luôn, đừng để nội dung ẩn vĩnh viễn
    if (typeof IntersectionObserver === "undefined") {
      node.dataset.hien = "roi";
      return;
    }

    const theoDoi = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.hien = "roi";
          theoDoi.unobserve(entry.target);
        }
      },
      // Lùi mép dưới 80px để khối hiện xong ngay trước khi mắt nhìn tới
      { rootMargin: "0px 0px -80px 0px", threshold: 0.05 },
    );

    theoDoi.observe(node);
    return () => theoDoi.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-hien=""
      style={delay ? ({ "--tre": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
