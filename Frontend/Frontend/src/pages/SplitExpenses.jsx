import { useEffect, useState, useCallback } from "react";
import { Plus, Users, ChevronDown, ChevronUp } from "lucide-react";
import { getSplitsApi } from "../api/splits";
import AddSplitModal from "../components/AddSplitModal";
import { Loader, EmptyState, ErrorBanner } from "../components/Feedback";
import { formatCurrency, formatDate } from "../utils/format";

export default function SplitExpenses() {
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getSplitsApi();
      setSplits(res.splits || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Split Expenses</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Track shared bills and who owes what.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> New Split
        </button>
      </div>

      <ErrorBanner message={error} />

      {loading ? (
        <Loader label="Loading splits..." />
      ) : splits.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Users}
            title="No split expenses yet"
            sub="Create a split for a shared trip, dinner, or bill."
            action={
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary text-sm"
              >
                <Plus size={15} /> New Split
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {splits.map((s) => {
            const totalPaid = s.participants.reduce(
              (sum, p) => sum + (p.paid || 0),
              0
            );
            const settled = totalPaid >= s.totalAmount;
            const isOpen = expandedId === s._id;

            return (
              <div key={s._id} className="card overflow-hidden">
                <button
                  onClick={() => setExpandedId(isOpen ? null : s._id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand/15 flex items-center justify-center shrink-0">
                      <Users size={18} className="text-brand-light" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{s.title}</p>
                      <p className="text-xs text-zinc-500">
                        {s.participants.length} participants ·{" "}
                        {formatDate(s.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(s.totalAmount)}
                      </p>
                      <span
                        className={`badge ${
                          settled
                            ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                            : "text-amber-400 border-amber-500/20 bg-amber-500/10"
                        }`}
                      >
                        {settled ? "Settled" : "Pending"}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-zinc-500" />
                    ) : (
                      <ChevronDown size={18} className="text-zinc-500" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-base-border px-5 py-4">
                    <div className="sm:hidden mb-4 flex items-center justify-between">
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(s.totalAmount)}
                      </p>
                      <span
                        className={`badge ${
                          settled
                            ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                            : "text-amber-400 border-amber-500/20 bg-amber-500/10"
                        }`}
                      >
                        {settled ? "Settled" : "Pending"}
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {s.participants.map((p, idx) => {
                        const owes = p.amount - (p.paid || 0);
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl bg-base-panel border border-base-border"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-base-hover flex items-center justify-center text-xs font-semibold text-zinc-300">
                                {p.name?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {p.name}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  Share {formatCurrency(p.amount)} · Paid{" "}
                                  {formatCurrency(p.paid || 0)}
                                </p>
                              </div>
                            </div>
                            <p
                              className={`text-sm font-semibold ${
                                owes > 0.009
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              {owes > 0.009
                                ? `Owes ${formatCurrency(owes)}`
                                : "Paid up"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddSplitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
