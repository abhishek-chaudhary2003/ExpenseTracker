import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useSummary } from "../hooks/useExpenses.js";
import { CATEGORY_META, formatCurrency } from "../lib/constants.js";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white shadow-xl rounded-xl px-4 py-2.5 text-sm border border-gray-100">
      <p className="font-semibold text-gray-700">{name}</p>
      <p className="text-gray-500 mt-0.5">{formatCurrency(value)}</p>
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
    {payload.map((entry) => (
      <span key={entry.value} className="flex items-center gap-1.5 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
        {entry.value}
      </span>
    ))}
  </div>
);

export default function CategoryChart() {
  const { data, isLoading } = useSummary();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-72 flex items-center justify-center animate-pulse">
        <div className="w-40 h-40 rounded-full bg-gray-200" />
      </div>
    );
  }

  const chartData = data?.byCategory ?? [];

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-72 flex flex-col items-center justify-center gap-2 text-gray-400">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">📊</div>
        <p className="text-sm">No spending data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Spending by Category</p>
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={88}
            paddingAngle={3}
          >
            {chartData.map((entry) => (
              <Cell key={entry.category} fill={CATEGORY_META[entry.category]?.color ?? "#6b7280"} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
