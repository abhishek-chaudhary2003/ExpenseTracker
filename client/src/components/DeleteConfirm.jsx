import { Loader2, Trash2 } from "lucide-react";
import Modal from "./ui/Modal.jsx";
import { useDeleteExpense } from "../hooks/useExpenses.js";
import { formatCurrency } from "../lib/constants.js";

export default function DeleteConfirm({ expense, onClose }) {
  const { mutateAsync, isPending } = useDeleteExpense();

  const confirm = async () => {
    await mutateAsync(expense.id);
    onClose();
  };

  return (
    <Modal title="Delete Expense" onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-red-50 rounded-xl p-4 text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">
            {formatCurrency(expense.amount)} — {expense.category}
          </span>
          ? This cannot be undone.
        </div>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={confirm} disabled={isPending}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
