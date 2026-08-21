import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import Modal from "./Modal";
import { ErrorBanner } from "./Feedback";
import { addAccountApi, ACCOUNT_TYPES } from "../api/accounts";

const emptyForm = { name: "", type: "", balance: "" };

export default function AddAccountModal({ open, onClose, onSaved }) {
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

    if (!form.name || !form.type) {
      setError("Name and account type are required");
      return;
    }

    setSubmitting(true);
    try {
      await addAccountApi({
        name: form.name,
        type: form.type,
        balance: form.balance ? Number(form.balance) : 0,
      });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Account">
      <ErrorBanner message={error} />
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Account Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. HDFC Regalia"
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Account Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="input-field"
          >
            <option value="">Select Type</option>
            {ACCOUNT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Starting Balance</label>
          <input
            type="number"
            step="0.01"
            value={form.balance}
            onChange={(e) => setForm({ ...form, balance: e.target.value })}
            placeholder="0.00"
            className="input-field"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-border mt-6">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            <CheckCircle2 size={16} />
            {submitting ? "Saving..." : "Save Account"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
