import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import Modal from "./Modal";
import { ErrorBanner } from "./Feedback";
import { addRecurringApi, FREQUENCIES } from "../api/recurring";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "../api/expenses";

const emptyForm = {
  title: "",
  amount: "",
  category: "",
  paymentMethod: "",
  frequency: "Monthly",
  nextDueDate: new Date().toISOString().slice(0, 10),
};

export default function AddRecurringModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setError("");
    }
  }, [open]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.title ||
      !form.amount ||
      !form.category ||
      !form.paymentMethod ||
      !form.frequency ||
      !form.nextDueDate
    ) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      await addRecurringApi({ ...form, amount: Number(form.amount) });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Recurring Expense">
      <ErrorBanner message={error} />
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Netflix"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Frequency</label>
            <select
              value={form.frequency}
              onChange={(e) =>
                setForm({ ...form, frequency: e.target.value })
              }
              className="input-field"
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
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
        </div>

        <div>
          <label className="label">Next Due Date</label>
          <input
            type="date"
            value={form.nextDueDate}
            onChange={(e) =>
              setForm({ ...form, nextDueDate: e.target.value })
            }
            className="input-field"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-border mt-6">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            <CheckCircle2 size={16} />
            {submitting ? "Saving..." : "Save Recurring Expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
