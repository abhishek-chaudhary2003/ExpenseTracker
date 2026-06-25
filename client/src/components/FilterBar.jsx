import { useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { CATEGORIES, todayStr } from "../lib/constants.js";
import { csvDownloadUrl } from "../lib/api.js";
import { toast } from "sonner";

const firstOfMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};
const firstOfLastMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() - 1, 1)
    .toISOString()
    .split("T")[0];
};
const lastOfLastMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 0).toISOString().split("T")[0];
};

const PRESETS = [
  { label: "All time", value: "all" },
  { label: "This month", value: "this_month" },
  { label: "Last month", value: "last_month" },
  { label: "Custom", value: "custom" },
];

const Select = ({ value, onChange, children }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none border border-gray-200 rounded-xl px-3 py-2 text-sm pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
    >
      {children}
    </select>
    <ChevronDown
      size={14}
      className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none"
    />
  </div>
);

export default function FilterBar({ filters, onChange }) {
  const [preset, setPreset] = useState("all");

  const applyPreset = (p) => {
    setPreset(p);
    if (p === "all") onChange({ ...filters, startDate: "", endDate: "" });
    if (p === "this_month")
      onChange({ ...filters, startDate: firstOfMonth(), endDate: todayStr() });
    if (p === "last_month")
      onChange({
        ...filters,
        startDate: firstOfLastMonth(),
        endDate: lastOfLastMonth(),
      });
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Category */}
        <div className="flex flex-col gap-1 min-w-32.5">
          <label className="text-xs font-medium text-gray-400">Category</label>
          <Select
            value={filters.category ?? "All"}
            onChange={(v) => onChange({ ...filters, category: v })}
          >
            <option>All</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>


        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">Period</label>
          <div className="flex gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => applyPreset(p.value)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  preset === p.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>


        {preset === "custom" && (
          <div className="flex gap-2 items-end flex-wrap">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">From</label>
              <input
                type="date"
                max={todayStr()}
                value={filters.startDate ?? ""}
                onChange={(e) =>
                  onChange({ ...filters, startDate: e.target.value })
                }
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">To</label>
              <input
                type="date"
                max={todayStr()}
                value={filters.endDate ?? ""}
                onChange={(e) =>
                  onChange({ ...filters, endDate: e.target.value })
                }
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}


        <div className="flex gap-2 ml-auto items-end">
          <div className="flex flex-col gap-1 min-w-30">
            <label className="text-xs font-medium text-gray-400">Sort by</label>
            <Select
              value={filters.sortBy ?? "date"}
              onChange={(v) => onChange({ ...filters, sortBy: v })}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </Select>
          </div>

          <a
            href={csvDownloadUrl({
              category: filters.category,
              startDate: filters.startDate,
              endDate: filters.endDate,
            })}
            download
             onClick={() => toast.success("CSV download started")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
          >
            <Download size={14} />
            CSV
          </a>
        </div>
      </div>
    </div>
  );
}
