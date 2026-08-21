import React, { useEffect, useState } from "react";
import { getCashFlowForecast } from "../api/forecast";
import ForecastChart from "../components/ForecastChart";
import { Loader2, Info, TrendingUp } from "lucide-react";

const ForecastPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getCashFlowForecast(30)
      .then((res) => {
        if (cancelled) return;

        if (res?.success) {
          setData(res.forecast);
        } else {
          setError(
            res?.message || "Failed to load forecast"
          );
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load forecast"
          );
        }
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
      <div className="min-h-full flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand mb-3" />

        <p className="text-sm text-zinc-500">
          Loading cash-flow forecast...
        </p>
      </div>
    );
  }

  /* =====================================
     ERROR
  ====================================== */

  if (error) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      </div>
    );
  }

  /* =====================================
     EMPTY
  ====================================== */

  if (!data) {
    return (
      <div className="card p-8 text-center">
        <p className="text-zinc-500">
          No forecast data is available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* =====================================
          HEADER
      ====================================== */}

      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-brand" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Detailed Cash-Flow Projection
            </h1>

            <p className="text-zinc-500 text-sm mt-1">
              Projected cash flow for the next 30 days.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          FORECAST CHART
      ====================================== */}

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              30-Day Trajectory
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Estimated balance based on your current
              financial activity.
            </p>
          </div>
        </div>

        <div className="w-full">
          <ForecastChart
            data={data.dailyProjection}
          />
        </div>
      </div>

      {/* =====================================
          MODEL ASSUMPTIONS
      ====================================== */}

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-base-panel border border-base-border flex items-center justify-center">
            <Info className="w-5 h-5 text-zinc-400" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Model Assumptions
            </h2>

            <p className="text-sm text-zinc-500 mt-0.5">
              Information used to generate this forecast.
            </p>
          </div>
        </div>

        <ul className="space-y-3">
          {Array.isArray(data.assumptions) &&
            data.assumptions.map(
              (assumption, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-zinc-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />

                  <span>{assumption}</span>
                </li>
              )
            )}

          <li className="flex items-start gap-3 text-sm text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />

            <span>
              Forecast confidence is currently marked as{" "}
              <strong className="text-white">
                {data.confidence}
              </strong>
              .
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ForecastPage;
