import { useState, useEffect } from "react";
import { CheckCircle2, Plus, X } from "lucide-react";
import Modal from "./Modal";
import { ErrorBanner } from "./Feedback";
import { addSplitApi } from "../api/splits";
import { formatCurrency } from "../utils/format";

const emptyParticipant = () => ({ name: "", amount: "", paid: "" });

export default function AddSplitModal({ open, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [participants, setParticipants] = useState([
    emptyParticipant(),
    emptyParticipant(),
  ]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle("");
      setTotalAmount("");
      setParticipants([emptyParticipant(), emptyParticipant()]);
      setError("");
    }
  }, [open]);

  const participantTotal = participants.reduce(
    (s, p) => s + (Number(p.amount) || 0),
    0
  );
  const diff = Number(totalAmount || 0) - participantTotal;

  const updateParticipant = (idx, patch) => {
    setParticipants((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, ...patch } : p))
    );
  };

  const addParticipant = () =>
    setParticipants((prev) => [...prev, emptyParticipant()]);

  const removeParticipant = (idx) =>
    setParticipants((prev) => prev.filter((_, i) => i !== idx));

  const splitEvenly = () => {
    if (!totalAmount || participants.length === 0) return;
    const each = (Number(totalAmount) / participants.length).toFixed(2);
    setParticipants((prev) =>
      prev.map((p, i) =>
        i === prev.length - 1
          ? {
              ...p,
              amount: (
                Number(totalAmount) -
                Number(each) * (prev.length - 1)
              ).toFixed(2),
            }
          : { ...p, amount: each }
      )
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !totalAmount || participants.some((p) => !p.name)) {
      setError("Title, total amount and participant names are required");
      return;
    }
    if (Math.abs(diff) > 0.009) {
      setError(
        `Participant amounts must add up to the total (currently off by ${formatCurrency(
          diff
        )})`
      );
      return;
    }

    setSubmitting(true);
    try {
      await addSplitApi({
        title,
        totalAmount: Number(totalAmount),
        participants: participants.map((p) => ({
          name: p.name,
          amount: Number(p.amount) || 0,
          paid: Number(p.paid) || 0,
        })),
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
    <Modal open={open} onClose={onClose} title="Split an Expense" wide>
      <ErrorBanner message={error} />
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Goa Trip"
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Total Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="0.00"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label mb-0">Participants</label>
            <button
              type="button"
              onClick={splitEvenly}
              className="text-xs text-brand-light hover:underline"
            >
              Split evenly
            </button>
          </div>

          <div className="space-y-3">
            {participants.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={p.name}
                  onChange={(e) =>
                    updateParticipant(idx, { name: e.target.value })
                  }
                  placeholder="Name"
                  className="input-field flex-[1.4]"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={p.amount}
                  onChange={(e) =>
                    updateParticipant(idx, { amount: e.target.value })
                  }
                  placeholder="Share"
                  className="input-field flex-1"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={p.paid}
                  onChange={(e) =>
                    updateParticipant(idx, { paid: e.target.value })
                  }
                  placeholder="Paid"
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeParticipant(idx)}
                  disabled={participants.length <= 2}
                  className="p-2.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition shrink-0"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addParticipant}
            className="btn-ghost text-sm mt-3 px-0"
          >
            <Plus size={14} /> Add participant
          </button>

          <div
            className={`mt-3 text-xs rounded-lg px-3 py-2 border ${
              Math.abs(diff) > 0.009
                ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            }`}
          >
            {Math.abs(diff) > 0.009
              ? `Shares don't add up yet — ${formatCurrency(diff)} remaining`
              : "Shares match the total amount ✓"}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-border">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            <CheckCircle2 size={16} />
            {submitting ? "Saving..." : "Save Split"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
