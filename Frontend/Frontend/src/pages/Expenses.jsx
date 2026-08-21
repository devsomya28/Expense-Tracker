import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";
import {
  getExpensesApi,
  deleteExpenseApi,
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
} from "../api/expenses";
import AddExpenseModal from "../components/AddExpenseModal";
import { Loader, EmptyState, ErrorBanner } from "../components/Feedback";
import { formatCurrency, formatDate, categoryIconMap } from "../utils/format";

export default function Expenses() {
  const [data, setData] = useState({ expenses: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
      };
      if (filters.category) params.category = filters.category;
      if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await getExpensesApi(params);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    filters.category,
    filters.paymentMethod,
    filters.startDate,
    filters.endDate,
    filters.page,
    filters.limit,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  const updateFilter = (patch) =>
    setFilters((f) => ({ ...f, ...patch, page: 1 }));

  const onDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    setDeletingId(id);
    try {
      await deleteExpenseApi(id);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const visibleExpenses = filters.search
    ? data.expenses.filter((e) =>
        e.title.toLowerCase().includes(filters.search.toLowerCase())
      )
    : data.expenses;

  const pagination = data.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Expenses</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Track and manage your spending.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="card p-5 grid md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <label className="label text-[11px] uppercase">Search</label>
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search expenses..."
              className="input-field pl-2"
            />
          </div>
        </div>
        <div>
          <label className="label text-[11px] uppercase">Category</label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter({ category: e.target.value })}
            className="input-field"
          >
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label text-[11px] uppercase">
            Payment Method
          </label>
          <select
            value={filters.paymentMethod}
            onChange={(e) => updateFilter({ paymentMethod: e.target.value })}
            className="input-field"
          >
            <option value="">All Methods</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label text-[11px] uppercase">From</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => updateFilter({ startDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="label text-[11px] uppercase">To</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => updateFilter({ endDate: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <ErrorBanner message={error} />
        {loading ? (
          <Loader label="Loading expenses..." />
        ) : visibleExpenses.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No expenses found"
            sub="Try adjusting your filters or add a new expense."
            action={
              <button
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
                className="btn-primary text-sm"
              >
                <Plus size={15} /> Add Expense
              </button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-500 text-xs uppercase border-b border-base-border">
                    <th className="px-6 py-3 font-medium">Title</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Method</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleExpenses.map((e) => (
                    <tr key={e._id} className="table-row">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-base-panel border border-base-border flex items-center justify-center text-base shrink-0">
                            {categoryIconMap[e.category] || "📦"}
                          </div>
                          <span className="font-medium text-white">
                            {e.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge">{e.category}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-zinc-200">
                        {formatCurrency(e.amount)}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {e.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {formatDate(e.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditing(e);
                              setModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-base-hover transition"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => onDelete(e._id)}
                            disabled={deletingId === e._id}
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-base-border">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  Rows per page:
                  <select
                    value={filters.limit}
                    onChange={(e) =>
                      updateFilter({ limit: Number(e.target.value) })
                    }
                    className="bg-base-panel border border-base-border rounded-lg px-2 py-1 text-zinc-300 outline-none"
                  >
                    {[10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <span>
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                    –
                    {Math.min(
                      pagination.currentPage * pagination.itemsPerPage,
                      pagination.totalExpenses
                    )}{" "}
                    of {pagination.totalExpenses}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={!pagination.hasPreviousPage}
                      onClick={() =>
                        setFilters((f) => ({ ...f, page: f.page - 1 }))
                      }
                      className="p-1.5 rounded-lg border border-base-border disabled:opacity-30 hover:bg-base-hover transition"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      disabled={!pagination.hasNextPage}
                      onClick={() =>
                        setFilters((f) => ({ ...f, page: f.page + 1 }))
                      }
                      className="p-1.5 rounded-lg border border-base-border disabled:opacity-30 hover:bg-base-hover transition"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingExpense={editing}
        onSaved={load}
      />
    </div>
  );
}
