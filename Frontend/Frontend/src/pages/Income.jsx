import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus,
  TrendingUp,
  WalletCards,
  LineChart,
  FileText,
} from "lucide-react";

import { getIncomeApi } from "../api/income";
import AddIncomeModal from "../components/AddIncomeModal";
import StatCard from "../components/StatCard";
import {
  Loader,
  EmptyState,
  ErrorBanner,
} from "../components/Feedback";

import {
  formatCurrency,
  formatDate,
  isSameMonth,
  sourceIconMap,
} from "../utils/format";

export default function Income() {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getIncomeApi();

      console.log("Income API response:", res);

      setIncome(Array.isArray(res?.income) ? res.income : []);
    } catch (err) {
      console.error("Failed to load income:", err);
      setError(err?.message || "Failed to load income");
      setIncome([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const now = new Date();

    const monthly = income
      .filter((item) => isSameMonth(item.date, now))
      .reduce((sum, item) => {
        return sum + Number(item.amount || 0);
      }, 0);

    const ytd = income
      .filter((item) => {
        const date = new Date(item.date);
        return date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, item) => {
        return sum + Number(item.amount || 0);
      }, 0);

    const monthsElapsed = now.getMonth() + 1;

    const average =
      monthsElapsed > 0 ? ytd / monthsElapsed : 0;

    return {
      monthly,
      ytd,
      average,
    };
  }, [income]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Income
          </h1>

          <p className="text-zinc-500 text-sm mt-1">
            Manage your earnings.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={16} />
          Add Income
        </button>
      </div>

      {/* Statistics */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          label="Monthly Income"
          value={formatCurrency(stats.monthly)}
          sub="This month"
          icon={TrendingUp}
          iconTone="emerald"
        />

        <StatCard
          label="Total Income (YTD)"
          value={formatCurrency(stats.ytd)}
          sub={`Year ${new Date().getFullYear()}`}
          icon={WalletCards}
          iconTone="brand"
        />

        <StatCard
          label="Average Income"
          value={formatCurrency(stats.average)}
          sub="Per month average"
          icon={LineChart}
          iconTone="amber"
        />
      </div>

      {/* Recent Income */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-base-border">
          <h3 className="font-semibold text-white">
            Recent Income
          </h3>
        </div>

        <ErrorBanner message={error} />

        {loading ? (
          <Loader label="Loading income..." />
        ) : income.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No income recorded yet"
            sub="Add your salary, freelance, or other earnings."
            action={
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary text-sm"
              >
                <Plus size={15} />
                Add Income
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 text-xs uppercase border-b border-base-border">
                  <th className="px-6 py-3 font-medium">
                    Title
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Source
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Date
                  </th>

                  <th className="px-6 py-3 font-medium text-right">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {income.map((item) => (
                  <tr
                    key={item._id}
                    className="table-row"
                  >
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-base shrink-0">
                          {sourceIconMap[item.source] || "💰"}
                        </div>

                        <span className="font-medium text-white">
                          {item.title}
                        </span>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="px-6 py-4">
                      <span className="badge text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                        {item.source}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-zinc-400">
                      {formatDate(item.date)}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right font-mono text-emerald-400">
                      +
                      {formatCurrency(
                        Number(item.amount || 0)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Income Modal */}
      <AddIncomeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
