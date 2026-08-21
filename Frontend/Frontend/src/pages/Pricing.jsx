import React, { useState } from "react";
import { devUpgradeToPro } from "../api/subscription";
import { useSubscription } from "../context/SubscriptionContext";
import {
  Check,
  Zap,
  Loader2,
  Crown,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const { subData, refreshSub } = useSubscription();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleDevUpgrade = async () => {
    setLoading(true);

    try {
      await devUpgradeToPro();

      await refreshSub();

      navigate("/");
    } catch (error) {
      console.error("Upgrade failed", error);

      setLoading(false);
    }
  };

  const isPro =
    subData?.subscription?.plan === "PRO";

  const basicFeatures = [
    "Expense & Income Tracking",
    "Basic Budgeting",
    "Standard Analytics",
    "5 AI Copilot Requests/day",
  ];

  const proFeatures = [
    "Everything in Basic",
    "Financial Health Score",
    "Proactive AI Insights",
    "Cash-Flow Forecasting",
    "What-If Scenarios",
    "100 AI Copilot Requests/day",
  ];

  return (
    <div className="space-y-8">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Finora Plans
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Simple, Transparent Pricing
        </h1>

        <p className="text-zinc-500 mt-3">
          Take control of your finances with Finora.
        </p>
      </div>

      {/* =====================================
          PRICING CARDS
      ====================================== */}

      <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {/* ===================================
            BASIC PLAN
        ==================================== */}

        <div className="card p-6 md:p-8 flex flex-col">
          {/* Plan icon */}
          <div className="w-11 h-11 rounded-xl bg-base-panel border border-base-border flex items-center justify-center mb-5">
            <Crown className="w-5 h-5 text-zinc-400" />
          </div>

          {/* Plan title */}
          <h2 className="text-xl font-bold text-white">
            Basic
          </h2>

          <p className="text-zinc-500 text-sm mt-1 mb-6">
            Essential tracking for individuals.
          </p>

          {/* Price */}
          <div className="text-4xl font-bold text-white mb-6">
            Free
          </div>

          {/* Features */}
          <ul className="space-y-4 mb-8 flex-1">
            {basicFeatures.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-zinc-300 text-sm"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </span>

                {feature}
              </li>
            ))}
          </ul>

          {/* Current plan */}
          <button
            disabled
            className="
              w-full
              py-3
              rounded-xl
              font-semibold
              bg-base-panel
              text-zinc-500
              border
              border-base-border
              cursor-not-allowed
            "
          >
            {isPro ? "Downgrade" : "Current Plan"}
          </button>
        </div>

        {/* ===================================
            PRO PLAN
        ==================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-brand/30
            bg-gradient-to-b
            from-brand/10
            via-base-card
            to-base-card
            p-6
            md:p-8
            flex
            flex-col
            shadow-glow
          "
        >
          {/* Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

          {/* Popular badge */}
          <div className="absolute top-0 right-0">
            <div className="bg-gradient-to-r from-violet-500 to-brand text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
              MOST POPULAR
            </div>
          </div>

          {/* Plan icon */}
          <div className="relative w-11 h-11 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-5">
            <Zap
              className="w-5 h-5 text-brand"
              fill="currentColor"
            />
          </div>

          {/* Plan title */}
          <h2 className="relative text-xl font-bold text-white">
            Finora Pro
          </h2>

          <p className="relative text-zinc-500 text-sm mt-1 mb-6">
            Advanced intelligence for your wealth.
          </p>

          {/* Price */}
          <div className="relative text-4xl font-bold text-white mb-6">
            $9
            <span className="text-lg text-zinc-500 font-normal">
              /mo
            </span>
          </div>

          {/* Features */}
          <ul className="relative space-y-4 mb-8 flex-1">
            {proFeatures.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-zinc-300 text-sm"
              >
                <span className="w-5 h-5 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-brand" />
                </span>

                {feature}
              </li>
            ))}
          </ul>

          {/* Button */}
          {isPro ? (
            <button
              disabled
              className="
                w-full
                py-3
                rounded-xl
                font-semibold
                bg-emerald-500/10
                text-emerald-400
                border
                border-emerald-500/20
                cursor-not-allowed
              "
            >
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Active Plan
              </span>
            </button>
          ) : (
            <button
              onClick={handleDevUpgrade}
              disabled={loading}
              className="
                w-full
                py-3
                rounded-xl
                font-semibold
                bg-brand
                hover:bg-brand-dark
                text-white
                transition
                flex
                items-center
                justify-center
                gap-2
                shadow-glow
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap
                    className="w-4 h-4"
                    fill="currentColor"
                  />
                  Upgrade Now (Demo)
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* =====================================
          FOOTER NOTE
      ====================================== */}

      <div className="text-center">
        <p className="text-xs text-zinc-600">
          Upgrade anytime. Your financial data remains
          secure and private.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
