"use client";

import { useState } from "react";

export type AccordionItem = {
  id: string;
  title: string;
  hint?: string;
  content: React.ReactNode;
};

/**
 * Danh sách gập/mở cho phần chi tiết sản phẩm.
 * Mục đầu mở sẵn, các mục còn lại gập lại để trang không quá dài trên điện thoại.
 */
export function Accordion({
  items,
  defaultOpenId,
}: {
  items: AccordionItem[];
  defaultOpenId?: string;
}) {
  const [open, setOpen] = useState<string[]>([defaultOpenId ?? items[0]?.id]);

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => {
        const expanded = open.includes(item.id);
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={expanded}
                aria-controls={`panel-${item.id}`}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span>
                  <span className="font-display text-lg">{item.title}</span>
                  {item.hint && (
                    <span className="mt-0.5 block font-sans text-xs text-muted">
                      {item.hint}
                    </span>
                  )}
                </span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-xl leading-none text-walnut transition-transform ${
                    expanded ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={`panel-${item.id}`}
              hidden={!expanded}
              className="pb-6 text-sm leading-relaxed text-muted"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Chuyển giữa Đánh giá và Hỏi đáp */
export function Tabs({
  tabs,
}: {
  tabs: { key: string; label: string; count?: number; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.key);

  return (
    <div>
      <div role="tablist" className="mb-6 flex gap-2 border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={active === tab.key}
            onClick={() => setActive(tab.key)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              active === tab.key
                ? "border-walnut text-walnut"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs font-normal opacity-70">({tab.count})</span>
            )}
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
