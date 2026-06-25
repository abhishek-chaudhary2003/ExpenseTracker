import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./ui/Modal.jsx";
import { useCreateExpense, useUpdateExpense } from "../hooks/useExpenses.js";
import { CATEGORIES, todayStr } from "../lib/constants.js";

const empty = { amount: "", category: "Food", date: todayStr(), note: "" };

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function ExpenseForm({ editTarget, onClose }) {
  const [form,   setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  const create = useCreateExpense();
  const update = useUpdateExpense();
  const busy   = create.isPending || update.isPending;

  useEffect(() => {
    setForm(editTarget
      ? { amount: String(editTarget.amount), category: editTarget.category, date: editTarget.date, note: editTarget.note ?? "" }
      : empty
    );
    setErrors({});
  }, [editTarget]);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) e.amount = "Enter a positive amount";
    if (!form.date)             e.date = "Pick a date";
    else if (form.date > todayStr()) e.date = "Date cannot be in the future";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);

    const payload = { amount: parseFloat(form.amount), category: form.category, date: form.date, note: form.note };

    try {
      if (editTarget) await update.mutateAsync({ id: editTarget.id, ...payload });
      else            await create.mutateAsync(payload);
      onClose();
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) setErrors({ server: serverErrors.join(", ") });
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
    }`;

  return (
    <Modal title={editTarget ? "Edit Expense" : "Add Expense"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.server && (
          <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{errors.server}</p>
        )}

        <Field label="Amount (₹)" error={errors.amount}>
          <input type="number" step="0.01" min="0.01" placeholder="0.00"
            className={inputClass("amount")} value={form.amount} onChange={set("amount")} />
        </Field>

        <Field label="Category">
          <select className={inputClass("category")} value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Date" error={errors.date}>
          <input type="date" max={todayStr()}
            className={inputClass("date")} value={form.date} onChange={set("date")} />
        </Field>

        <Field label="Note (optional)">
          <input type="text" placeholder="e.g. Dinner with friends"
            className={inputClass("note")} value={form.note} onChange={set("note")} />
        </Field>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={busy}
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {busy && <Loader2 size={14} className="animate-spin" />}
            {editTarget ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
