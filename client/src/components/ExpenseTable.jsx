import { useState } from "react";
import { Pencil, Trash2, ChevronDown, ChevronUp, ReceiptText } from "lucide-react";
import Badge from "./ui/Badge.jsx";
import { formatCurrency, formatDate } from "../lib/constants.js";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
      <ReceiptText size={40} strokeWidth={1.2} />
      <p className="text-sm font-medium">No expenses found</p>
      <p className="text-xs">Add your first expense using the button above</p>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-20" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-28" /></td>
      <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-20" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-32" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-16 ml-auto" /></td>
    </tr>
  );
}

export default function ExpenseTable({ expenses, isLoading, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Note</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[0,1,2,3].map(i => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  if (!expenses?.length) return <EmptyState />;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Note</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {expenses.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(e.date)}</td>
                <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{formatCurrency(e.amount)}</td>
                <td className="px-4 py-3"><Badge category={e.category} /></td>
                <td className="px-4 py-3 text-gray-400 max-w-50 truncate">{e.note || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(e)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => onDelete(e)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden divide-y divide-gray-50">
        {expenses.map((e) => (
          <div key={e.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold text-gray-800">{formatCurrency(e.amount)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(e.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge category={e.category} />
                <button onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                  className="p-1 text-gray-400">
                  {expanded === e.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
            {expanded === e.id && (
              <div className="mt-3 pt-3 border-t border-gray-50">
                {e.note && <p className="text-sm text-gray-500 mb-3">{e.note}</p>}
                <div className="flex gap-2">
                  <button onClick={() => onEdit(e)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => onDelete(e)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-500 text-sm font-medium">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
