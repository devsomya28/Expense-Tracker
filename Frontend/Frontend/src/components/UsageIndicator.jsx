import React from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const UsageIndicator = () => {
  const { subData, loading } = useSubscription();

  if (loading || !subData) {
    return null;
  }

  const aiUsed = subData?.usage?.aiUsed ?? 0;
  const aiLimit = subData?.usage?.aiLimit ?? 0;

  const isPro =
    subData?.subscription?.plan === "PRO";

  const percentage =
    aiLimit > 0
      ? Math.min((aiUsed / aiLimit) * 100, 100)
      : 0;

  const isNearLimit = percentage > 90;

  return (
    <div className="mt-4 p-4 rounded-xl bg-base-panel border border-base-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap
            className="w-3.5 h-3.5 text-brand"
            fill="currentColor"
          />

          <span className="text-xs font-semibold text-zinc-300">
            AI Copilot Uses
          </span>
        </div>

        <span className="text-xs text-zinc-500">
          {aiUsed} / {aiLimit}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-base-card overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isNearLimit
              ? "bg-red-500"
              : "bg-brand"
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {/* Percentage */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-zinc-600">
          {Math.round(percentage)}% used
        </span>

        {!isPro && (
          <Link
            to="/pricing"
            className="text-xs text-brand font-medium hover:text-violet-300 transition"
          >
            Upgrade for 100 uses/day
          </Link>
        )}
      </div>
    </div>
  );
};

export default UsageIndicator;
