import React, { useEffect, useState } from "react";
import { getCashFlowForecast } from "../api/forecast";
import ForecastChart from "./ForecastChart";
import {
  TrendingUp,
  AlertTriangle,
  Info,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const ForecastCard = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getCashFlowForecast(30)
      .then((data) => {
        if (!cancelled && data?.success) {
          setForecastData(data.forecast);
        }
      })
      .catch((error) => {
        console.error("Failed to load forecast:", error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================
      LOADING
  ====================================== */

  if (loading) {
    return (
      <div className="card p-6 flex items-center justify-center min-h-[280px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-brand" />

          <p className="text-sm text-zinc-500">
            Loading forecast...
          </p>
        </div>
      </div>
    );
  }

  if (!forecastData) {
    return null;
  }

  /* =====================================
      STATUS
  ====================================== */

  const getStatusDisplay = (status) => {
    switch (status) {
      case "RISK":
        return {
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          icon: AlertTriangle,
        };

      case "WATCH":
        return {
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          icon: Info,
        };

      default:
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          icon: TrendingUp,
        };
    }
  };

  const statusConfig = getStatusDisplay(
    forecastData.status
  );

  const StatusIcon = statusConfig.icon;

  const confidenceColor =
    forecastData.confidence === "HIGH"
      ? "text-emerald-400"
      : forecastData.confidence === "MEDIUM"
      ? "text-amber-400"
      : "text-red-400";

  /* =====================================
      RENDER
  ====================================== */

  return (
    <div className="card p-5 sm:p-6 overflow-hidden min-w-0">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col gap-4 mb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-brand" />
            </div>

            <h3 className="font-bold text-white text-lg truncate">
              30-Day Forecast
            </h3>
          </div>

          {/* STATUS BADGE */}
          <div
            className={`
              inline-flex
              items-center
              gap-1.5
              px-2.5
              py-1.5
              rounded-lg
              text-xs
              font-semibold
              border
              shrink-0
              ${statusConfig.bg}
              ${statusConfig.border}
              ${statusConfig.color}
            `}
          >
            <StatusIcon className="w-3.5 h-3.5" />

            <span>{forecastData.status}</span>
          </div>
        </div>

        <p className="text-zinc-500 text-sm leading-relaxed max-w-full">
          {forecastData.explanation}
        </p>
      </div>

      {/* =====================================
          STATS
      ====================================== */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        {/* CURRENT BALANCE */}

        <div className="min-w-0 p-3.5 rounded-xl bg-base-panel border border-base-border">
          <p className="text-[10px] sm:text-[11px] text-zinc-600 font-medium uppercase tracking-wide leading-tight">
            Current Balance
          </p>

          <p className="text-base sm:text-lg font-bold text-white mt-1 truncate">
            ${forecastData.currentBalance}
          </p>
        </div>

        {/* EXPECTED INCOME */}

        <div className="min-w-0 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <p className="text-[10px] sm:text-[11px] text-zinc-600 font-medium uppercase tracking-wide leading-tight">
            Expected Income
          </p>

          <p className="text-base sm:text-lg font-bold text-emerald-400 mt-1 truncate">
            +${forecastData.projectedIncome}
          </p>
        </div>

        {/* PROJECTED BILLS */}

        <div className="min-w-0 p-3.5 rounded-xl bg-red-500/5 border border-red-500/10">
          <p className="text-[10px] sm:text-[11px] text-zinc-600 font-medium uppercase tracking-wide leading-tight">
            Projected Bills
          </p>

          <p className="text-base sm:text-lg font-bold text-red-400 mt-1 truncate">
            -${forecastData.projectedRecurringExpenses}
          </p>
        </div>

        {/* MONTH END */}

        <div className="min-w-0 p-3.5 rounded-xl bg-brand/10 border border-brand/20">
          <p className="text-[10px] sm:text-[11px] text-brand/70 font-medium uppercase tracking-wide leading-tight">
            Est. 30-Day Balance
          </p>

          <p className="text-base sm:text-lg font-bold text-brand mt-1 truncate">
            ${forecastData.projectedMonthEndBalance}
          </p>
        </div>
      </div>

      {/* =====================================
          CHART
      ====================================== */}

      <div className="pt-1 min-w-0 overflow-hidden">
        <ForecastChart
          data={forecastData.dailyProjection}
        />
      </div>

      {/* =====================================
          FOOTER
      ====================================== */}

      <div className="mt-5 pt-4 border-t border-base-border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <span className="text-xs text-zinc-600">
          Confidence:{" "}
          <strong className={confidenceColor}>
            {forecastData.confidence}
          </strong>
        </span>

        <Link
          to="/forecast"
          className="
            inline-flex
            items-center
            gap-1.5
            text-xs
            text-brand
            hover:text-violet-300
            font-medium
            transition
            min-w-0
          "
        >
          <span className="truncate">
            View Detailed Assumptions
          </span>

          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
      </div>
    </div>
  );
};

export default ForecastCard;