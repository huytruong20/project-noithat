import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Xem tất cả",
  align = "left",
  eyebrowTone = "caps",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  /**
   * "caps"  — chữ nhỏ in hoa giãn ký tự, hợp nhãn ngắn 1–3 từ (mặc định)
   * "plain" — giữ nguyên hoa thường, dùng cho câu dài vì in hoa cả câu dài
   *           sẽ giãn ra rất khó đọc
   */
  eyebrowTone?: "caps" | "plain";
}) {
  return (
    <div
      className={`mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between ${
        align === "center" ? "text-center md:flex-col md:items-center" : ""
      }`}
    >
      <div className={align === "center" ? "max-w-2xl" : "max-w-xl"}>
        {eyebrow &&
          (eyebrowTone === "plain" ? (
            <p className="mb-2 text-sm font-semibold text-walnut">{eyebrow}</p>
          ) : (
            <p className="eyebrow mb-2">{eyebrow}</p>
          ))}
        <h2 className="text-2xl md:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm font-semibold text-walnut hover:underline"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
