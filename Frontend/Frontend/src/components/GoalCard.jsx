import React from "react";
import {
  Target,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const GoalCard = ({ goal, compact = false }) => {
  const { metrics = {} } = goal || {};

  const isComplete = goal?.status === "COMPLETED";
  const progress = Math.min(
    Math.max(Number(metrics.progressPercentage) || 0, 0),
    100
  );

  const isOnTrack = metrics.onTrack;

  const statusConfig = isComplete
    ? {
        label: "Completed",
        icon: CheckCircle,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        progress: "bg-emerald-500",
      }
    : isOnTrack
    ? {
        label: "On Track",
        icon: Target,
        color: "text-brand",
        bg: "bg-brand/10",
        border: "border-brand/20",
        progress: "bg-brand",
      }
    : {
        label: "Needs Attention",
        icon: AlertCircle,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        progress: "bg-amber-500",
      };

  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`
        card
        ${compact ? "p-4" : "p-6"}
        transition
        hover:border-brand/30
      `}
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex justify-between items-start gap-4 mb-5">
        <div className="min-w-0">
          <h3 className="font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-brand" />
            </div>

            <span className="truncate">
              {goal?.name || "Financial Goal"}
            </span>
          </h3>

          <p className="text-sm text-zinc-500 mt-2">
            $
            {(Number(goal?.currentAmount) || 0).toLocaleString()}
            <span className="text-zinc-700 mx-1">/</span>
            $
            {(Number(goal?.targetAmount) || 0).toLocaleString()}
          </p>
        </div>

        {/* STATUS */}
        <span
          className={`
            inline-flex
            items-center
            gap-1.5
            text-[10px]
            font-bold
            uppercase
            tracking-wide
            px-2.5
            py-1.5
            rounded-lg
            border
            shrink-0
            ${statusConfig.bg}
            ${statusConfig.color}
            ${statusConfig.border}
          `}
        >
          <StatusIcon className="w-3 h-3" />

          {statusConfig.label}
        </span>
      </div>

      {/* =====================================
          PROGRESS
      ====================================== */}

      <div className="mb-4">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-medium text-zinc-500">
            Progress
          </span>

          <span
            className={`font-semibold ${statusConfig.color}`}
          >
            {progress}%
          </span>
        </div>

        <div className="w-full bg-base-panel border border-base-border rounded-full h-2 overflow-hidden">
          <div
            className={`
              h-full
              rounded-full
              transition-all
              duration-500
              ${statusConfig.progress}
            `}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* =====================================
          DETAILS
      ====================================== */}

      {!compact && !isComplete && (
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-base-border">
          {/* MONTHLY CONTRIBUTION */}
          <div>
            <p className="text-zinc-600 text-[11px] uppercase tracking-wide mb-1">
              Required / Month
            </p>

            <p className="font-semibold text-zinc-200">
              $
              {(
                Number(
                  metrics.requiredMonthlyContribution
                ) || 0
              ).toLocaleString()}
            </p>
          </div>

          {/* TARGET DATE */}
          <div>
            <p className="text-zinc-600 text-[11px] uppercase tracking-wide mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Target Date
            </p>

            <p
              className={`font-semibold ${
                metrics.isOverdue
                  ? "text-red-400"
                  : "text-zinc-200"
              }`}
            >
              {goal?.targetDate
                ? new Date(
                    goal.targetDate
                  ).toLocaleDateString(undefined, {
                    month: "short",
                    year: "numeric",
                  })
                : "No date"}
            </p>
          </div>
        </div>
      )}

      {/* =====================================
          OVERDUE WARNING
      ====================================== */}

      {!compact &&
        !isComplete &&
        metrics.isOverdue && (
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />

            <span className="text-xs text-red-400">
              This goal is currently overdue.
            </span>
          </div>
        )}

      {/* =====================================
          COMPLETED MESSAGE
      ====================================== */}

      {!compact && isComplete && (
        <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />

          <span className="text-xs text-emerald-400">
            Congratulations! You reached this goal.
          </span>
        </div>
      )}
    </div>
  );
};

export default GoalCard;
