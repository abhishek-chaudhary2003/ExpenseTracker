import { Wallet, Tag, TrendingUp } from "lucide-react";
import { useSummary } from "../hooks/useExpenses.js";
import { formatCurrency, formatDate } from "../lib/constants.js";

function Card({ icon: Icon, iconBg, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
      <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1 truncate">{sub}</p>}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="h-7 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { data, isLoading } = useSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const topCat = data?.byCategory?.reduce((max, c) => (!max || c.total > max.total ? c : max), null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card
        icon={Wallet}
        iconBg="bg-blue-500"
        label="This Month"
        value={formatCurrency(data?.totalThisMonth)}
        sub={`${data?.thisMonthCount ?? 0} transactions`}
      />
      <Card
        icon={Tag}
        iconBg="bg-violet-500"
        label="Top Category"
        value={topCat?.category ?? "—"}
        sub={topCat ? formatCurrency(topCat.total) : "No data yet"}
      />
      <Card
        icon={TrendingUp}
        iconBg="bg-rose-500"
        label="Highest Expense"
        value={data?.highest ? formatCurrency(data.highest.amount) : "—"}
        sub={data?.highest ? `${data.highest.category} · ${formatDate(data.highest.date)}` : "No data yet"}
      />
    </div>
  );
}
