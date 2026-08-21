import { LogOut, ShieldCheck, Mail, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../api/client";

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Your account details and connection info.
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand-light text-xl font-semibold">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              {user?.username}
            </p>
            <p className="text-sm text-zinc-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-base-panel border border-base-border">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <UserCircle2 size={16} className="text-zinc-500" />
              Username
            </div>
            <span className="text-sm text-white font-medium">
              {user?.username}
            </span>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-base-panel border border-base-border">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Mail size={16} className="text-zinc-500" />
              Email
            </div>
            <span className="text-sm text-white font-medium">
              {user?.email}
            </span>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-base-panel border border-base-border">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <ShieldCheck size={16} className="text-zinc-500" />
              Connected API
            </div>
            <span className="text-sm text-zinc-400 font-mono">
              {API_BASE_URL}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-600 mt-4">
          Profile editing isn't available yet — the backend doesn't expose an
          update-profile endpoint.
        </p>
      </div>

      <button onClick={logout} className="btn-danger px-4 py-2.5">
        <LogOut size={15} /> Log out
      </button>
    </div>
  );
}
