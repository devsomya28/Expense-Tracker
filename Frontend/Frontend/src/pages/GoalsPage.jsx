import React, { useEffect, useState } from "react";
import { getGoals } from "../api/goals";
import GoalCard from "../components/GoalCard";
import FeatureLocked from "../components/FeatureLocked";
import { Loader2, Plus, Target } from "lucide-react";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadGoals = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getGoals();

        if (cancelled) return;

        if (res?.success) {
          setGoals(
            Array.isArray(res.goals)
              ? res.goals
              : []
          );
        } else {
          setError(
            res?.message || "Failed to load goals."
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Goals error:", err);

          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load goals."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadGoals();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <FeatureLocked
      feature="financial_goals"
      title="Financial Goals"
      description="Set targets, track progress, and let AI build your roadmap to wealth."
    >
      <div className="space-y-6">
        {/* =====================================
            HEADER
        ====================================== */}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-brand" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">
                Your Financial Goals
              </h1>

              <p className="text-zinc-500 text-sm mt-1">
                Track your goals and build your financial future.
              </p>
            </div>
          </div>

          {/* New Goal */}
          <button
            className="btn-primary"
            type="button"
          >
            <Plus className="w-4 h-4" />
            New Goal
          </button>
        </div>

        {/* =====================================
            ERROR
        ====================================== */}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* =====================================
            LOADING
        ====================================== */}

        {loading ? (
          <div className="card flex flex-col items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand mb-3" />

            <p className="text-sm text-zinc-500">
              Loading your goals...
            </p>
          </div>
        ) : goals.length === 0 ? (
          /* =====================================
              EMPTY STATE
          ====================================== */

          <div className="card text-center p-12">
            <div className="w-14 h-14 mx-auto rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mb-4">
              <Target className="w-7 h-7 text-brand" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              No active goals
            </h3>

            <p className="text-zinc-500 text-sm max-w-md mx-auto mb-5">
              Start planning for your future by creating your
              first financial goal.
            </p>

            <button
              className="btn-primary mx-auto"
              type="button"
            >
              <Plus className="w-4 h-4" />
              Create Your First Goal
            </button>
          </div>
        ) : (
          /* =====================================
              GOAL GRID
          ====================================== */

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
              />
            ))}
          </div>
        )}
      </div>
    </FeatureLocked>
  );
};

export default GoalsPage;
