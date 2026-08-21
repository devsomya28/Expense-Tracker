import { useEffect, useState, useCallback } from "react";
import { PiggyBank, CheckCircle2, AlertTriangle } from "lucide-react";
import { setBudgetApi } from "../api/budget";
import { getAnalyticsApi } from "../api/analytics";
import { Loader, ErrorBanner } from "../components/Feedback";
import { formatCurrency } from "../utils/format";

export default function Budget() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAnalyticsApi();
      setAnalytics(res.analytics);
      setAmount(res.analytics?.monthlyBudget || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (amount === "" || Number(amount) < 0) {
      setError("Please enter a valid monthly budget");
      return;
    }

    setSubmitting(true);
    try {
      await setBudgetApi({ monthlyBudget: Number(amount) });
      setSuccess("Monthly budget updated successfully");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading budget..." />;

  const spent = analytics?.monthlyTotal || 0;
  const budget = analytics?.monthlyBudget || 0;
  const pct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Budget</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Set a spending limit for the month and track it in real time.
        </p>
      </div>

      <ErrorBanner message={error} />
      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl px-4 py-3">
          <CheckCircle2 size={16} className="shrink-0" />
          {success}
        </div>
      )}

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-brand/15 flex items-center justify-center">
            <PiggyBank size={20} className="text-brand-light" />
          </div>
          <div>
            <p className="font-semibold text-white">Monthly Budget</p>
            <p className="text-xs text-zinc-500">
              Applies to the current calendar month
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="label">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg font-semibold">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="20000"
                className="input-field pl-9 text-lg font-semibold"
              />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary py-3">
            {submitting ? "Saving..." : "Save Budget"}
          </button>
        </form>
      </div>

      {budget > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">This Month's Status</h3>
            {analytics?.budgetExceeded && (
              <span className="badge text-red-400 border-red-500/20 bg-red-500/10">
                Over budget
              </span>
            )}
          </div>

          <div className="flex justify-between text-sm mb-2">
            <div>
              <p className="text-zinc-500 text-xs">Spent</p>
              <p className="font-semibold text-white text-lg">
                {formatCurrency(spent)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs">Remaining</p>
              <p
                className={`font-semibold text-lg ${
                  analytics?.budgetRemaining < 0
                    ? "text-red-400"
                    : "text-brand-light"
                }`}
              >
                {formatCurrency(analytics?.budgetRemaining)}
              </p>
            </div>
          </div>

          <div className="h-2.5 rounded-full bg-base-panel overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all ${
                analytics?.budgetExceeded ? "bg-red-500" : "bg-brand"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">
            {pct}% of {formatCurrency(budget)} used
          </p>

          {analytics?.budgetExceeded && (
            <div className="flex items-center gap-2 mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertTriangle size={15} className="shrink-0" />
              You're {formatCurrency(analytics.budgetExceededAmount)} over
              your budget this month.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
