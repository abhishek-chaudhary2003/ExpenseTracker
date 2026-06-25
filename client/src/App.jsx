import { useState } from "react";
import { Plus, LayoutDashboard, List } from "lucide-react";
import SummaryCards from "./components/SummaryCards.jsx";
import CategoryChart from "./components/CategoryChart.jsx";
import BudgetPanel from "./components/BudgetPanel.jsx";
import FilterBar from "./components/FilterBar.jsx";
import ExpenseTable from "./components/ExpenseTable.jsx";
import ExpenseForm from "./components/ExpenseForm.jsx";
import DeleteConfirm from "./components/DeleteConfirm.jsx";
import { useExpenses } from "./hooks/useExpenses.js";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "expenses",  label: "Expenses",  icon: List },
];

export default function App() {
  const [tab,          setTab]          = useState("dashboard");
  const [filters,      setFilters]      = useState({ category: "All", sortBy: "date" });
  const [showForm,     setShowForm]     = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useExpenses(filters);
  const expenses = data?.data ?? [];

  const openEdit  = (expense) => { setEditTarget(expense); setShowForm(true); };
  const closeForm = ()        => { setShowForm(false); setEditTarget(null); };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl overflow-hidden">
  <img
    src="/logo.png"
    alt="ExpenseTracker Logo"
    className="w-full h-full object-cover"
  />
</div>
            <span className="font-bold text-gray-800 text-base tracking-tight">ExpenseTracker</span>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  tab === id ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}>
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => { setEditTarget(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Mobile tabs */}
        <div className="sm:hidden flex border-t border-gray-100">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                tab === id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"
              }`}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Dashboard */}
        {tab === "dashboard" && (
          <>
            <SummaryCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CategoryChart />
              <BudgetPanel />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">Recent Expenses</h2>
                <button onClick={() => setTab("expenses")} className="text-xs text-blue-600 hover:underline font-medium">
                  View all →
                </button>
              </div>
              <ExpenseTable
                expenses={expenses.slice(0, 5)}
                isLoading={isLoading}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            </div>
          </>
        )}

        {/* Expenses */}
        {tab === "expenses" && (
          <>
            <FilterBar filters={filters} onChange={setFilters} />
            <p className="text-sm text-gray-400">
              {isLoading ? "Loading…" : `${data?.total ?? 0} expense${data?.total !== 1 ? "s" : ""}`}
            </p>
            <ExpenseTable
              expenses={expenses}
              isLoading={isLoading}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          </>
        )}
      </main>

      {/* Modals */}
      {showForm     && <ExpenseForm    editTarget={editTarget} onClose={closeForm} />}
      {deleteTarget && <DeleteConfirm  expense={deleteTarget}  onClose={() => setDeleteTarget(null)} />}
    </div>
  );
}
