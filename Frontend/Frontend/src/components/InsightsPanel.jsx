import React, { useEffect, useState } from "react";
import {
  getActiveInsights,
  updateInsightStatus,
} from "../api/insights";
import InsightCard from "./InsightCard";
import { Sparkles } from "lucide-react";

const InsightsPanel = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const data = await getActiveInsights();

      if (data?.success) {
        // Limit to top 4 for dashboard UX
        setInsights(
          Array.isArray(data.insights)
            ? data.insights.slice(0, 4)
            : []
        );
      }
    } catch (error) {
      console.error("Failed to load insights", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateInsightStatus(id, status);

      setInsights((prev) =>
        prev.filter((insight) => insight._id !== id)
      );
    } catch (error) {
      console.error(
        "Failed to update insight status",
        error
      );
    }
  };

  if (loading) {
    return null;
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="card overflow-hidden">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="px-6 py-5 border-b border-base-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
            <Sparkles
              className="w-5 h-5 text-brand"
              fill="currentColor"
            />
          </div>

          <div>
            <h3 className="font-bold text-white text-lg">
              Finora Insights
            </h3>

            <p className="text-xs text-zinc-500 mt-0.5">
              Personalized intelligence for your finances
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          INSIGHTS
      ====================================== */}

      <div className="divide-y divide-base-border">
        {insights.map((insight) => (
          <div
            key={insight._id}
            className="p-4 transition hover:bg-base-hover/40"
          >
            <InsightCard
              insight={insight}
              onDismiss={(id) =>
                handleStatusUpdate(id, "DISMISSED")
              }
              onResolve={(id) =>
                handleStatusUpdate(id, "RESOLVED")
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
