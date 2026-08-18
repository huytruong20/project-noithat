"use client";

import { useState } from "react";

/**
 * Tab lọc nhanh ở trang chủ. Nội dung mỗi tab được render sẵn ở phía server
 * rồi truyền xuống, nên đổi tab không phải gọi lại dữ liệu.
 */
export function FeaturedTabs({
  tabs,
}: {
  tabs: { key: string; label: string; count: number; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.key);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Nhóm sản phẩm nổi bật"
        className="mb-6 flex gap-2 overflow-x-auto border-b border-line no-scrollbar"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={active === tab.key}
            onClick={() => setActive(tab.key)}
            className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              active === tab.key
                ? "border-walnut text-walnut"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs font-normal opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div key={tab.key} role="tabpanel" hidden={active !== tab.key}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
