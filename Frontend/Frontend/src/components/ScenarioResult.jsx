import React from "react";
import { ArrowRight, AlertOctagon } from "lucide-react";

const ScenarioResult = ({ simulation }) => {
  if (!simulation) return null;

  const { baseline, scenario, impact } = simulation;

  const isPositive = impact.monthlyImprovement >= 0;

  return (
    <div className="relative overflow-hidden card p-6">
      {/* =====================================
          SIMULATION LABEL
      ====================================== */}

      <div className="absolute top-0 right-0 bg-amber-500/10 border-l border-b border-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1.5 flex items-center gap-1.5 rounded-bl-xl">
        <AlertOctagon className="w-3.5 h-3.5" />
        SIMULATED - NOT ACTUAL
      </div>

      {/* =====================================
          HEADER
      ====================================== */}

      <h3 className="text-xl font-bold text-white mb-6">
        Simulation Results
      </h3>

      {/* =====================================
          RESULTS
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        {/* MONTHLY SAVINGS */}
        <div className="p-5 rounded-xl bg-base-panel border border-base-border">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide mb-3">
            Monthly Savings
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-lg font-semibold text-zinc-600 line-through">
              ${baseline.savings}
            </span>

            <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0" />

            <span className="text-2xl font-bold text-brand">
              ${scenario.savings}
            </span>
          </div>
        </div>

        {/* SAVINGS RATE */}
        <div className="p-5 rounded-xl bg-base-panel border border-base-border">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide mb-3">
            Savings Rate
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-lg font-semibold text-zinc-600 line-through">
              {baseline.savingsRate}%
            </span>

            <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0" />

            <span className="text-2xl font-bold text-brand">
              {scenario.savingsRate}%
            </span>
          </div>
        </div>

        {/* PROJECTED IMPACT */}
        <div
          className={`p-5 rounded-xl border ${
            isPositive
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-red-500/10 border-red-500/20"
          }`}
        >
          <p
            className={`text-xs font-medium uppercase tracking-wide mb-2 ${
              isPositive
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            Projected Impact
          </p>

          <p
            className={`text-2xl font-bold ${
              isPositive
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {isPositive ? "+" : "-"}$
            {Math.abs(impact.monthlyImprovement)}
            <span className="text-sm font-normal ml-1">
              /mo
            </span>
          </p>

          <p
            className={`text-sm mt-1 ${
              isPositive
                ? "text-emerald-500"
                : "text-red-400"
            }`}
          >
            ({isPositive ? "+" : "-"}$
            {Math.abs(impact.annualImprovement)} /year)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScenarioResult;
