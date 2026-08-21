import React, { useEffect, useState } from "react";
import { getHealthScore } from "../api/intelligence";
import {
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";

const FinancialHealthCard = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getHealthScore();

        if (data?.success) {
          setHealthData(data.health);
        }
      } catch (error) {
        console.error("Failed to fetch health score:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  /* =====================================
      LOADING
  ====================================== */

  if (loading) {
    return (
      <div className="card min-h-[280px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-brand" />

          <p className="text-sm text-zinc-500">
            Analyzing financial health...
          </p>
        </div>
      </div>
    );
  }

  if (!healthData) {
    return null;
  }

  /* =====================================
      DATA
  ====================================== */

  const {
    score = 0,
    status = "UNKNOWN",
    dimensions = {},
    reasons = [],
  } = healthData;

  const safeReasons = Array.isArray(reasons) ? reasons : [];

  const topPositive = safeReasons.find(
    (reason) => reason.direction === "positive"
  );

  const topNegative = safeReasons.find(
    (reason) => reason.direction === "negative"
  );

  /* =====================================
      STATUS
  ====================================== */

  const getStatusConfig = (currentStatus) => {
    switch (currentStatus) {
      case "EXCELLENT":
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
        };

      case "HEALTHY":
        return {
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/20",
        };

      case "FAIR":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
        };

      case "AT_RISK":
        return {
          color: "text-orange-400",
          bg: "bg-orange-500/10",
          border: "border-orange-500/20",
        };

      case "CRITICAL":
        return {
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
        };

      default:
        return {
          color: "text-zinc-400",
          bg: "bg-zinc-500/10",
          border: "border-zinc-500/20",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  /* =====================================
      DIMENSION COLOR
  ====================================== */

  const getDimensionColor = (value) => {
    if (value > 75) {
      return {
        text: "text-emerald-400",
        bar: "bg-emerald-500",
      };
    }

    if (value > 40) {
      return {
        text: "text-yellow-400",
        bar: "bg-yellow-500",
      };
    }

    return {
      text: "text-red-400",
      bar: "bg-red-500",
    };
  };

  /* =====================================
      FORMAT LABEL
  ====================================== */

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase())
      .trim();
  };

  /* =====================================
      RENDER
  ====================================== */

  return (
    <div className="card w-full min-w-0 overflow-hidden p-5 sm:p-6">
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-[130px_minmax(0,1fr)]
          xl:grid-cols-[130px_minmax(0,1fr)_205px]
          gap-5
          xl:gap-6
          min-w-0
        "
      >
        {/* =====================================
            SCORE
        ====================================== */}

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            min-w-0
            pb-5
            lg:pb-0
            lg:border-r
            border-base-border
            lg:pr-5
          "
        >
          <div
            className={`
              w-14
              h-14
              rounded-2xl
              flex
              items-center
              justify-center
              mb-3
              border
              ${statusConfig.bg}
              ${statusConfig.border}
            `}
          >
            <Activity
              className={`w-7 h-7 ${statusConfig.color}`}
            />
          </div>

          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider text-center">
            Health Score
          </p>

          <div
            className={`
              text-5xl
              font-bold
              leading-none
              my-3
              ${statusConfig.color}
            `}
          >
            {score}
          </div>

          <span
            className={`
              px-3
              py-1.5
              rounded-lg
              border
              text-xs
              font-semibold
              whitespace-nowrap
              ${statusConfig.color}
              ${statusConfig.bg}
              ${statusConfig.border}
            `}
          >
            {String(status).replace(/_/g, " ")}
          </span>
        </div>

        {/* =====================================
            SCORE BREAKDOWN
        ====================================== */}

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h3 className="text-sm font-bold text-white">
              Score Breakdown
            </h3>

            <span className="text-xs text-zinc-600 whitespace-nowrap">
              Out of 100
            </span>
          </div>

          {/* ONE COLUMN ONLY */}
          <div className="space-y-4">
            {Object.entries(dimensions).map(([key, value]) => {
              const numericValue = Number(value) || 0;

              const dimensionColor =
                getDimensionColor(numericValue);

              const label = formatLabel(key);

              return (
                <div
                  key={key}
                  className="w-full min-w-0"
                >
                  {/* LABEL + VALUE */}
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-xs text-zinc-500 font-medium truncate">
                      {label}
                    </span>

                    <span
                      className={`
                        text-xs
                        font-semibold
                        whitespace-nowrap
                        shrink-0
                        ${dimensionColor.text}
                      `}
                    >
                      {numericValue}/100
                    </span>
                  </div>

                  {/* BAR */}
                  <div className="w-full h-1.5 rounded-full bg-base-panel border border-base-border overflow-hidden">
                    <div
                      className={`
                        h-full
                        rounded-full
                        transition-all
                        duration-500
                        ${dimensionColor.bar}
                      `}
                      style={{
                        width: `${Math.min(
                          Math.max(numericValue, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================
            INSIGHTS
        ====================================== */}

        <div
          className="
            min-w-0
            flex
            flex-col
            justify-center
            gap-3
            lg:col-span-2
            xl:col-span-1
            xl:border-l
            border-base-border
            xl:pl-5
          "
        >
          {/* DOING WELL */}

          {topPositive && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-emerald-300">
                  Doing well
                </p>

                <p className="text-xs text-emerald-400/80 mt-1 leading-relaxed">
                  {topPositive.impact}
                </p>
              </div>
            </div>
          )}

          {/* NEGATIVE */}

          {topNegative && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4 text-red-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-red-300">
                  Needs attention
                </p>

                <p className="text-xs text-red-400/80 mt-1 leading-relaxed">
                  {topNegative.impact}
                </p>
              </div>
            </div>
          )}

          {/* ON TRACK */}

          {!topNegative && topPositive && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand/10 border border-brand/20 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-brand" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-violet-300">
                  On Track
                </p>

                <p className="text-xs text-violet-400/80 mt-1 leading-relaxed">
                  Keep up your current financial habits.
                </p>
              </div>
            </div>
          )}

          {/* DEFAULT */}

          {!topPositive && !topNegative && (
            <div className="p-4 rounded-xl bg-base-panel border border-base-border">
              <p className="text-sm font-medium text-zinc-300">
                Your financial health is being monitored.
              </p>

              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Keep tracking your income and expenses to improve
                your score.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthCard;
