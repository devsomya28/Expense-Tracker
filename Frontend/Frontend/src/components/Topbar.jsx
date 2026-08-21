import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onMenuClick, search, onSearchChange }) {
  const { user } = useAuth();

  return (
    <header className="flex items-center gap-4 px-4 lg:px-8 py-4 border-b border-base-border sticky top-0 bg-base-bg/80 backdrop-blur-md z-20">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-zinc-400 hover:text-white p-2 -ml-2"
      >
        <Menu size={22} />
      </button>

      {onSearchChange ? (
        <div className="flex-1 max-w-md relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-base-panel border border-base-border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-zinc-500 outline-none focus:border-brand transition"
          />
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <button className="relative p-2 text-gray-500 hover:text-gray-700 transition">
        <Bell className="w-5 h-5" />
      </button>

      <div className="w-9 h-9 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand-light text-sm font-semibold">
        {user?.username?.[0]?.toUpperCase() || "U"}
      </div>
    </header>
  );
}