import { useEffect, useState, useCallback } from "react";
import {
  TrendingUp,
  Calendar,
  Award,
  Activity,
  AlertTriangle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { getAnalyticsApi } from "../api/analytics";
import StatCard from "../components/StatCard";
import { Loader, EmptyState, ErrorBanner } from "../components/Feedback";
import { formatCurrency, formatDate } from "../utils/format";

const COLORS = [
  "#7c3aed",
  "#a78bfa",
  "#c4b5fd",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAnalyticsApi();
      setAnalytics(res.analytics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loader label="Crunching your numbers..." />;

  const categoryData = (analytics?.categorySpending || []).map((c) => ({
    name: c._id,
    value: c.total,
  }));

  const dailyData = (analytics?.dailySpending || []).map((d) => ({
    date: d._id?.slice(5),
    amount: d.total,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-zinc-500 text-sm mt-1">
          A closer look at how you're spending this month.
        </p>
      </div>

      <ErrorBanner message={error} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Monthly Total"
          value={formatCurrency(analytics?.monthlyTotal)}
          sub="Spent this month"
          icon={TrendingUp}
          iconTone="brand"
        />
        <StatCard
          label="Weekly Total"
          value={formatCurrency(analytics?.weeklyTotal)}
          sub="Spent this week"
          icon={Calendar}
          iconTone="amber"
        />
        <StatCard
          label="Average Expense"
          value={formatCurrency(analytics?.averageExpense)}
          sub="Per transaction"
          icon={Activity}
          iconTone="emerald"
        />
        <StatCard
          label="Highest Expense"
          value={
            analytics?.highestExpense
              ? formatCurrency(analytics.highestExpense.amount)
              : "—"
          }
          sub={analytics?.highestExpense?.title || "No expenses yet"}
          icon={Award}
          iconTone="red"
        />
      </div>

      {analytics?.budgetExceeded && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4">
          <AlertTriangle size={18} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300">
            You've exceeded your monthly budget by{" "}
            <span className="font-semibold">
              {formatCurrency(analytics.budgetExceededAmount)}
            </span>
            .
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 ">
          <h3 className="font-semibold text-white mb-4">
            Spending by Category
          </h3>
          {categoryData.length === 0 ? (
            <EmptyState
              title="No category data yet"
              sub="Add expenses this month to see a breakdown."
            />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#141419",
                      border: "1px solid #232329",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(v) => formatCurrency(v)}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-white mb-4">Daily Spending</h3>
          {dailyData.length === 0 ? (
            <EmptyState
              title="No daily data yet"
              sub="Your daily spend pattern will appear here."
            />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#232329"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#52525b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#52525b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#141419",
                      border: "1px solid #232329",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(v) => formatCurrency(v)}
                    cursor={{ fill: "rgba(124,58,237,0.08)" }}
                  />
                  <Bar dataKey="amount" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {analytics?.highestExpense && (
        <div className="card p-6">
          <h3 className="font-semibold text-white mb-4">
            Highest Expense This Month
          </h3>
          <div className="flex items-center justify-between p-4 rounded-xl bg-base-panel border border-base-border">
            <div>
              <p className="font-medium text-white">
                {analytics.highestExpense.title}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {analytics.highestExpense.category} ·{" "}
                {formatDate(analytics.highestExpense.date)}
              </p>
            </div>
            <p className="text-xl font-bold text-white">
              {formatCurrency(analytics.highestExpense.amount)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
