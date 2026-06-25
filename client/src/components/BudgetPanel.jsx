import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import {
  useBudgets,
  useSetBudget,
  useDeleteBudget,
} from "../hooks/useBudgets.js";
import { CATEGORY_META, formatCurrency } from "../lib/constants.js";

function BudgetRow({ item }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.limit ?? "");
  const setMutation = useSetBudget();
  const deleteMutation = useDeleteBudget();

  const pct = item.limit ? Math.min((item.spent / item.limit) * 100, 100) : 0;
  const over = item.isOverBudget;
  const meta = CATEGORY_META[item.category] ?? CATEGORY_META.Other;
  const barColor = over
    ? "bg-red-500"
    : pct > 75
      ? "bg-amber-400"
      : "bg-emerald-400";

  const save = async () => {
    const limit = parseFloat(value);
    if (!limit || limit <= 0) return;
    await setMutation.mutateAsync({ category: item.category, limit });
    setEditing(false);
  };

  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
          <span className="text-sm font-medium text-gray-700">
            {item.category}
          </span>
          {over && (
            <span className="text-xs bg-red-100 text-red-600 font-medium px-1.5 py-0.5 rounded-full">
              Over budget
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-24 text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && save()}
              />
              <button
                onClick={save}
                className="p-1 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => setEditing(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <span className="text-xs text-gray-400">
                {item.limit
                  ? `${formatCurrency(item.spent)} / ${formatCurrency(item.limit)}`
                  : "No limit set"}
              </span>
              <button
                onClick={() => {
                  setValue(item.limit ?? "");
                  setEditing(true);
                }}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <Pencil size={13} />
              </button>
              {item.limit && (
                <button
                  onClick={() => deleteMutation.mutate(item.category)}
                  className="p-1 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </>
          )}
        </div>
      </div>


      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        {item.limit && (
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}

export default function BudgetPanel() {
  const { data: budgets, isLoading } = useBudgets();

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Monthly Budgets
      </p>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-1.5 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {(budgets ?? []).map((item) => (
            <BudgetRow key={item.category} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
