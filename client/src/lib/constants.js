export const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

export const CATEGORY_META = {
  Food:          { color: "#f97316", bg: "bg-orange-100",  text: "text-orange-600",  dot: "bg-orange-400" },
  Transport:     { color: "#3b82f6", bg: "bg-blue-100",    text: "text-blue-600",    dot: "bg-blue-400"   },
  Bills:         { color: "#ef4444", bg: "bg-red-100",     text: "text-red-600",     dot: "bg-red-400"    },
  Entertainment: { color: "#a855f7", bg: "bg-purple-100",  text: "text-purple-600",  dot: "bg-purple-400" },
  Other:         { color: "#6b7280", bg: "bg-gray-100",    text: "text-gray-600",    dot: "bg-gray-400"   },
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount ?? 0);

export const formatDate = (dateStr) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));

export const todayStr = () => new Date().toISOString().split("T")[0];
