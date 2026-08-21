import { Inbox, Loader2, AlertCircle } from "lucide-react";

export function EmptyState({ icon: Icon = Inbox, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-base-panel border border-base-border flex items-center justify-center mb-4">
        <Icon size={24} className="text-zinc-500" />
      </div>
      <p className="text-zinc-200 font-medium">{title}</p>
      {sub && <p className="text-sm text-zinc-500 mt-1 max-w-sm">{sub}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-zinc-500 text-sm">
      <Loader2 size={16} className="animate-spin" />
      {label}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
      <AlertCircle size={16} className="shrink-0" />
      {message}
    </div>
  );
}
