import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import Modal from "./Modal";
import { ErrorBanner } from "./Feedback";
import { addIncomeApi, INCOME_SOURCES } from "../api/income";
import { getAccountsApi } from "../api/accounts";

const emptyForm = {
  amount: "",
  title: "",
  source: "",
  date: new Date().toISOString().slice(0, 10),
  account: "",
};

export default function AddIncomeModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(emptyForm);
    setError("");
    getAccountsApi()
      .then((d) => setAccounts(d.accounts || []))
      .catch(() => {});
  }, [open]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.amount || !form.title || !form.source) {
      setError("Amount, title and source are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        account: form.account || undefined,
      };
      await addIncomeApi(payload);
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Income">
      <ErrorBanner message={error} />

      <div className="text-center mb-6">
        <label className="label justify-center flex">Amount</label>
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-bold text-zinc-500">₹</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="0.00"
            className="text-4xl font-bold bg-transparent text-center w-48 outline-none placeholder-zinc-700 text-white"
          />
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Tech Corp Salary"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Source</label>
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="input-field"
            >
              <option value="">Select Source</option>
              {INCOME_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="label">Account</label>
          <select
            value={form.account}
            onChange={(e) => setForm({ ...form, account: e.target.value })}
            className="input-field"
          >
            <option value="">Select Account (optional)</option>
            {accounts.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-border mt-6">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            <CheckCircle2 size={16} />
            {submitting ? "Saving..." : "Save Income"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
