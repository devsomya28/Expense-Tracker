import React from "react";
import {
  AlertTriangle,
  TrendingUp,
  Info,
  X,
  CheckCircle2,
} from "lucide-react";

const SEVERITY_CONFIG = {
  HIGH: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: AlertTriangle,
  },

  MEDIUM: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: Info,
  },

  LOW: {
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
    icon: TrendingUp,
  },
};

const InsightCard = ({
  insight,
  onDismiss,
  onResolve,
}) => {
  if (!insight) return null;

  const config =
    SEVERITY_CONFIG[insight.severity] ||
    SEVERITY_CONFIG.LOW;

  const Icon = config.icon;

  return (
    <div
      className={`
        flex
        items-start
        gap-3
        p-4
        rounded-xl
        border
        ${config.bg}
        ${config.border}
        transition
        hover:bg-base-hover/60
      `}
    >
      {/* Severity Icon */}
      <div
        className={`
          w-9
          h-9
          rounded-lg
          flex
          items-center
          justify-center
          shrink-0
          ${config.bg}
        `}
      >
        <Icon
          className={`w-5 h-5 ${config.color}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {insight.title && (
          <p className="text-sm font-semibold text-white">
            {insight.title}
          </p>
        )}

        <p
          className={`
            text-sm
            text-zinc-400
            leading-relaxed
            ${insight.title ? "mt-1" : ""}
          `}
        >
          {insight.message}
        </p>

        {/* Severity */}
        <span
          className={`
            inline-flex
            items-center
            mt-2
            px-2
            py-0.5
            rounded-md
            text-[10px]
            font-semibold
            uppercase
            tracking-wide
            ${config.bg}
            ${config.color}
            border
            ${config.border}
          `}
        >
          {insight.severity || "LOW"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Resolve */}
        <button
          type="button"
          onClick={() =>
            onResolve?.(insight._id)
          }
          title="Mark as resolved"
          className="
            p-1.5
            rounded-lg
            text-zinc-600
            hover:text-emerald-400
            hover:bg-emerald-500/10
            transition
          "
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>

        {/* Dismiss */}
        <button
          type="button"
          onClick={() =>
            onDismiss?.(insight._id)
          }
          title="Dismiss"
          className="
            p-1.5
            rounded-lg
            text-zinc-600
            hover:text-zinc-200
            hover:bg-base-hover
            transition
          "
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InsightCard;
