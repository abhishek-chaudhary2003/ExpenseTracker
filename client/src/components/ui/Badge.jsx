import { CATEGORY_META } from "../../lib/constants.js";

export default function Badge({ category }) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.Other;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${meta.bg} ${meta.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {category}
    </span>
  );
}
