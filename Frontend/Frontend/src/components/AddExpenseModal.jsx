import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import Modal from "./Modal";
import { ErrorBanner } from "./Feedback";
import {
  addExpenseApi,
  updateExpenseApi,
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
} from "../api/expenses";

const emptyForm = {
  amount: "",
  title: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: "",
};

export default function AddExpenseModal({
  open,
  onClose,
  onSaved,
  editingExpense,
}) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editingExpense) {
      setForm({
        amount: editingExpense.amount,
        title: editingExpense.title,
        category: editingExpense.category,
        date: editingExpense.date?.slice(0, 10),
        paymentMethod: editingExpense.paymentMethod,
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [open, editingExpense]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.amount ||
      !form.title ||
      !form.category ||
      !form.date ||
      !form.paymentMethod
    ) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (editingExpense) {
        await updateExpenseApi(editingExpense._id, payload);
      } else {
        await addExpenseApi(payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingExpense ? "Edit Expense" : "Add Expense"}
    >
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
            placeholder="e.g. Dinner with clients"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="input-field"
            >
              <option value="">Select Category</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Payment Method</label>
            <select
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({ ...form, paymentMethod: e.target.value })
              }
              className="input-field"
            >
              <option value="">Select Method</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-border mt-6">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            <CheckCircle2 size={16} />
            {submitting ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
