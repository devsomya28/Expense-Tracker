import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus,
  Search,
  Trash2,
  Clock,
  RotateCcw,
  Tv,
  Home,
  Wifi,
  ShoppingBag,
  Zap,
  Film,
  Package,
} from "lucide-react";
import {
  getRecurringApi,
  deleteRecurringApi,
} from "../api/recurring";
import AddRecurringModal from "../components/AddRecurringModal";
import { Loader, EmptyState, ErrorBanner } from "../components/Feedback";
import { formatCurrency, relativeDueLabel } from "../utils/format";

const categoryIcons = {
  Entertainment: Tv,
  Bills: Zap,
  Shopping: ShoppingBag,
  Food: Home,
  Travel: Home,
  Other: Package,
};

const categoryDot = {
  Entertainment: "bg-red-400",
  Bills: "bg-sky-400",
  Shopping: "bg-amber-400",
  Food: "bg-emerald-400",
  Travel: "bg-purple-400",
  Other: "bg-zinc-400",
};

const TABS = ["All Subscriptions", "Active", "Paused"];

export default function Recurring() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(TABS[0]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getRecurringApi();
      setItems(res.recurringExpenses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onDelete = async (id) => {
    if (!confirm("Delete this recurring expense?")) return;
    setDeletingId(id);
    try {
      await deleteRecurringApi(id);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (tab === "Active" && !i.isActive) return false;
      if (tab === "Paused" && i.isActive) return false;
      if (search && !i.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [items, tab, search]);

  const upcoming7Days = useMemo(() => {
    const now = new Date();
    const in7 = new Date();
    in7.setDate(now.getDate() + 7);
    return items
      .filter((i) => i.isActive)
      .filter((i) => {
        const due = new Date(i.nextDueDate);
        return due >= now && due <= in7;
      })
      .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));
  }, [items]);

  const totalDue7Days = upcoming7Days.reduce((s, i) => s + i.amount, 0);

  const monthlyTotal = items
    .filter((i) => i.isActive)
    .reduce((s, i) => s + i.amount, 0);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    items
      .filter((i) => i.isActive)
      .forEach((i) => {
        map[i.category] = (map[i.category] || 0) + i.amount;
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Recurring Expenses
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Automate recurring payments and never forget a bill.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Add Recurring
        </button>
      </div>

      <ErrorBanner message={error} />

      <div className="grid xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-base-panel border border-base-border rounded-xl p-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                    tab === t
                      ? "bg-base-hover text-white"
                      : "text-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="input-field pl-9 w-56"
              />
            </div>
          </div>

          {loading ? (
            <Loader label="Loading recurring expenses..." />
          ) : filtered.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={RotateCcw}
                title="No recurring expenses found"
                sub="Automate a subscription or bill so you never miss a due date."
                action={
                  <button
                    onClick={() => setModalOpen(true)}
                    className="btn-primary text-sm"
                  >
                    <Plus size={15} /> Add Recurring
                  </button>
                }
              />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((r) => {
                const Icon = categoryIcons[r.category] || Package;
                return (
                  <div key={r._id} className="card p-5 relative group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-base-panel border border-base-border flex items-center justify-center">
                          <Icon size={17} className="text-zinc-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {r.title}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {r.category}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`badge ${
                          r.isActive
                            ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                            : "text-zinc-500"
                        }`}
                      >
                        {r.isActive ? "Active" : "Paused"}
                      </span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">
                          {r.frequency}
                        </p>
                        <p className="text-xl font-bold text-white">
                          {formatCurrency(r.amount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500 mb-1">
                          Next Due
                        </p>
                        <p className="text-sm font-medium text-zinc-200">
                          {relativeDueLabel(r.nextDueDate)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDelete(r._id)}
                      disabled={deletingId === r._id}
                      title="Delete"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                      style={{ right: r.isActive === false ? undefined : "3.75rem" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}

              <button
                onClick={() => setModalOpen(true)}
                className="card p-5 border-dashed flex flex-col items-center justify-center gap-3 text-zinc-500 hover:text-zinc-300 hover:border-brand/40 transition min-h-[148px]"
              >
                <div className="w-10 h-10 rounded-full bg-base-panel flex items-center justify-center">
                  <Plus size={18} />
                </div>
                Add new recurring expense
              </button>
            </div>
          )}
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={15} className="text-amber-400" />
              <h3 className="font-semibold text-white text-sm">
                Upcoming (7 Days)
              </h3>
            </div>
            {upcoming7Days.length === 0 ? (
              <p className="text-sm text-zinc-500">Nothing due this week.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {upcoming7Days.map((r) => {
                  const Icon = categoryIcons[r.category] || Package;
                  return (
                    <div
                      key={r._id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-base-panel border border-base-border"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-base-hover flex items-center justify-center shrink-0">
                          <Icon size={14} className="text-zinc-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">
                            {r.title}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {relativeDueLabel(r.nextDueDate)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-white shrink-0">
                        {formatCurrency(r.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="pt-3 border-t border-base-border">
              <p className="text-xs text-zinc-500 mb-1.5">
                Total Due Next 7 Days
              </p>
              <p className="text-lg font-bold text-white">
                {formatCurrency(totalDue7Days)}
              </p>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-white text-sm mb-4">
              Monthly Summary
            </h3>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-400">Total Recurring</p>
              <p className="text-base font-bold text-white">
                {formatCurrency(monthlyTotal)}
              </p>
            </div>
            {categoryBreakdown.length > 0 && (
              <div className="space-y-2.5">
                {categoryBreakdown.map(([cat, total]) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2 text-zinc-400">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          categoryDot[cat] || "bg-zinc-400"
                        }`}
                      />
                      {cat}
                    </div>
                    <span className="text-zinc-300 font-mono">
                      {formatCurrency(total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddRecurringModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
