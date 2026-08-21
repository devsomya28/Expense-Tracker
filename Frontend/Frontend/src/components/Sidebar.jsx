import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Wallet,
  FileText,
  RotateCcw,
  Landmark,
  Users,
  LineChart,
  PiggyBank,
  Settings as SettingsIcon,
  Sparkles,
  LogOut,
  Target,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/expenses", label: "Expenses", icon: Wallet },
  { to: "/income", label: "Income", icon: FileText },
  { to: "/recurring", label: "Recurring", icon: RotateCcw },
  { to: "/accounts", label: "Accounts", icon: Landmark },
  { to: "/split-expenses", label: "Split Expenses", icon: Users },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/budget", label: "Budget", icon: PiggyBank },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/forecast", label: "Forecast", icon: TrendingUp },
  { to: "/scenarios", label: "What-If", icon: Activity },
  { to: "/ask-ai", label: "Ask AI", icon: Sparkles },
  { to: "/pricing", label: "Pricing", icon: Zap },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col w-[280px] shrink-0 border-r border-base-border bg-base-panel/40 min-h-screen px-4 py-6">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-glow">
          <Landmark size={18} className="text-white" />
        </div>
        <div>
          <p className="text-lg font-bold text-white leading-none">
            Finora
          </p>
          <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-1">
            Premium Finance
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-brand text-white shadow-glow"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-base-hover"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-base-border pt-4 mt-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand-light text-sm font-semibold shrink-0">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="text-sm text-zinc-300 truncate">
            {user?.username}
          </span>
        </div>
        <button
          onClick={logout}
          title="Log out"
          className="text-zinc-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-base-hover"
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}
