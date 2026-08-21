import React from "react";
import { Lock, Zap } from "lucide-react";
import { useSubscription } from "../context/SubscriptionContext";
import { Link } from "react-router-dom";

const FeatureLocked = ({
  feature,
  children,
  title = "This Feature",
  description = "Unlock this feature with Finora Pro.",
}) => {
  const { hasFeature, loading } = useSubscription();

  // Subscription information is still loading
  if (loading) {
    return (
      <div className="card min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />

          <p className="text-sm text-zinc-500">
            Checking your plan...
          </p>
        </div>
      </div>
    );
  }

  // User has access
  if (hasFeature(feature)) {
    return children;
  }

  // User does not have access
  return (
    <div className="relative overflow-hidden card min-h-[300px] p-8 flex flex-col items-center justify-center text-center">

      {/* =========================================
          BACKGROUND GLOW
      ========================================== */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-40 bg-brand/5 blur-3xl rounded-full" />
      </div>

      {/* =========================================
          PRO BADGE
      ========================================== */}

      <div className="absolute top-0 right-0">
        <div className="bg-gradient-to-r from-violet-500 to-brand text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl">
          PRO FEATURE
        </div>
      </div>

      {/* =========================================
          LOCK ICON
      ========================================== */}

      <div className="relative w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-5 shadow-glow">
        <Lock
          className="w-8 h-8 text-brand"
          strokeWidth={2}
        />
      </div>

      {/* =========================================
          TITLE
      ========================================== */}

      <h3 className="relative text-xl font-bold text-white mb-2">
        Unlock {title}
      </h3>

      {/* =========================================
          DESCRIPTION
      ========================================== */}

      <p className="relative text-sm text-zinc-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {/* =========================================
          UPGRADE BUTTON
      ========================================== */}

      <Link
        to="/pricing"
        className="relative btn-primary"
      >
        <Zap
          className="w-4 h-4"
          fill="currentColor"
        />

        Upgrade to Finora Pro
      </Link>

      {/* =========================================
          SMALL FOOTER
      ========================================== */}

      <p className="relative text-xs text-zinc-600 mt-4">
        Unlock advanced financial intelligence with Pro.
      </p>
    </div>
  );
};

export default FeatureLocked;
