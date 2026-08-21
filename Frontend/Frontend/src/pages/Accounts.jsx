import { useEffect, useState, useCallback } from "react";
import { Plus, Landmark, Wallet, CreditCard, Smartphone, Banknote } from "lucide-react";
import { getAccountsApi } from "../api/accounts";
import AddAccountModal from "../components/AddAccountModal";
import { Loader, EmptyState, ErrorBanner } from "../components/Feedback";
import { formatCurrency } from "../utils/format";

const typeIcon = {
  Cash: Banknote,
  "Bank Account": Landmark,
  UPI: Smartphone,
  "Credit Card": CreditCard,
};

const typeTone = {
  Cash: "bg-emerald-500/15 text-emerald-400",
  "Bank Account": "bg-brand/15 text-brand-light",
  UPI: "bg-sky-500/15 text-sky-400",
  "Credit Card": "bg-amber-500/15 text-amber-400",
};

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAccountsApi();
      setAccounts(res.accounts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Accounts</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Every wallet, card, and bank account in one place.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Add Account
        </button>
      </div>

      <div className="card p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400 mb-1">Total Balance</p>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(totalBalance)}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-brand/15 flex items-center justify-center">
          <Wallet size={22} className="text-brand-light" />
        </div>
      </div>

      <ErrorBanner message={error} />

      {loading ? (
        <Loader label="Loading accounts..." />
      ) : accounts.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Landmark}
            title="No accounts yet"
            sub="Add a bank account, card, or wallet to start tracking balances."
            action={
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary text-sm"
              >
                <Plus size={15} /> Add Account
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((a) => {
            const Icon = typeIcon[a.type] || Wallet;
            return (
              <div key={a._id} className="card p-5">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      typeTone[a.type] || "bg-base-panel text-zinc-400"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="badge">{a.type}</span>
                </div>
                <p className="text-sm text-zinc-500 mb-1">{a.name}</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(a.balance)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <AddAccountModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
