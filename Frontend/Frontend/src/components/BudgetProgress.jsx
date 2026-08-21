import React from "react";
import { Target, AlertCircle } from "lucide-react";

const BudgetProgress = ({ budgetData }) => {
  // =========================================
  // EMPTY STATE
  // =========================================

  if (!budgetData || !budgetData.total) {
    return (
      <div className="card p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-3">
          <Target className="w-6 h-6 text-brand" />
        </div>

        <h3 className="text-sm font-semibold text-white mb-1">
          Monthly Budget
        </h3>

        <p className="text-sm text-zinc-500">
          No budget set for this month.
        </p>
      </div>
    );
  }

  const {
    total,
    utilized,
    remaining,
    utilizationPercentage,
  } = budgetData;

  const percentage = Number(utilizationPercentage) || 0;

  const isOver = percentage > 100;
  const isWarning = percentage > 85;

  // =========================================
  // PROGRESS COLORS
  // =========================================

  let progressColor = "bg-emerald-500";
  let progressGlow = "shadow-[0_0_12px_rgba(16,185,129,0.35)]";

  if (isOver) {
    progressColor = "bg-red-500";
    progressGlow = "shadow-[0_0_12px_rgba(239,68,68,0.35)]";
  } else if (isWarning) {
    progressColor = "bg-orange-500";
    progressGlow = "shadow-[0_0_12px_rgba(249,115,22,0.35)]";
  }

  return (
    <div className="card p-6">
      {/* =========================================
          HEADER
      ========================================== */}

      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
            Monthly Budget
          </h3>

          <p className="text-xs text-zinc-600 mt-1">
            Track your spending against your limit
          </p>
        </div>

        {isOver && (
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle
              className="w-4 h-4 text-red-400"
              title="Budget Exceeded"
            />

            <span className="text-xs font-medium text-red-400">
              Over budget
            </span>
          </div>
        )}
      </div>

      {/* =========================================
          AMOUNT
      ========================================== */}

      <div className="flex items-end gap-2 mb-4">
        <span
          className={`text-3xl font-bold ${
            isOver ? "text-red-400" : "text-white"
          }`}
        >
          ${Number(utilized || 0).toLocaleString()}
        </span>

        <span className="text-sm text-zinc-600 mb-1">
          / ${Number(total || 0).toLocaleString()}
        </span>
      </div>

      {/* =========================================
          PROGRESS BAR
      ========================================== */}

      <div className="w-full bg-base-panel border border-base-border rounded-full h-3 mb-3 overflow-hidden">
        <div
          className={`
            h-full
            rounded-full
            transition-all
            duration-700
            ${progressColor}
            ${progressGlow}
          `}
          style={{
            width: `${Math.min(Math.max(percentage, 0), 100)}%`,
          }}
        />
      </div>

      {/* =========================================
          FOOTER
      ========================================== */}

      <div className="flex justify-between items-center text-sm">
        <span
          className={`${
            isOver
              ? "text-red-400"
              : isWarning
              ? "text-orange-400"
              : "text-zinc-500"
          }`}
        >
          {percentage}% Used
        </span>

        <span
          className={`font-semibold ${
            isOver ? "text-red-400" : "text-zinc-300"
          }`}
        >
          {isOver
            ? `$${Math.abs(
                Number(remaining || 0)
              ).toLocaleString()} Over`
            : `$${Number(
                remaining || 0
              ).toLocaleString()} Left`}
        </span>
      </div>

      {/* =========================================
          WARNING MESSAGE
      ========================================== */}

      {isWarning && !isOver && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />

          <p className="text-xs text-orange-300">
            You are approaching your monthly spending limit.
          </p>
        </div>
      )}

      {isOver && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />

          <p className="text-xs text-red-300">
            Your spending has exceeded this month's budget.
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;
