import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getIntelligenceOverview } from "../api/intelligence";
import { getGoals } from "../api/goals";

import FinancialHealthCard from "../components/FinancialHealthCard";
import ForecastCard from "../components/ForecastCard";
import InsightsPanel from "../components/InsightsPanel";
import AICommandCard from "../components/AICommandCard";
import BudgetProgress from "../components/BudgetProgress";
import GoalCard from "../components/GoalCard";
import StatCard from "../components/StatCard";
import FeatureLocked from "../components/FeatureLocked";

import {
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  ArrowRight,
  Target,
} from "lucide-react";

import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  const [intelligence, setIntelligence] = useState(null);
  const [topGoal, setTopGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================
      USER DISPLAY NAME
  ====================================== */

  const getDisplayName = () => {
    if (!user) {
      return "User";
    }

    if (user.name?.trim()) {
      return user.name.trim();
    }

    if (user.fullName?.trim()) {
      return user.fullName.trim();
    }

    const fullName = [
      user.firstName,
      user.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (fullName) {
      return fullName;
    }

    if (user.username?.trim()) {
      return user.username.trim();
    }

    if (user.email?.trim()) {
      return user.email
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    return "User";
  };

  const displayName = getDisplayName();

  /* =====================================
      DYNAMIC GREETING
  ====================================== */

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    }

    if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    }

    return "Good evening";
  };

  /* =====================================
      FETCH DASHBOARD DATA
  ====================================== */

  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [intelRes, goalsRes] = await Promise.all([
          getIntelligenceOverview(),

          getGoals().catch(() => ({
            success: false,
            goals: [],
          })),
        ]);

        if (cancelled) {
          return;
        }

        /* ================================
            INTELLIGENCE
        ================================= */

        if (intelRes?.success) {
          setIntelligence(intelRes.overview);
        }

        /* ================================
            GOALS
        ================================= */

        if (
          goalsRes?.success &&
          Array.isArray(goalsRes.goals) &&
          goalsRes.goals.length > 0
        ) {
          const activeGoals = goalsRes.goals
            .filter(
              (goal) =>
                !goal.status ||
                goal.status === "ACTIVE"
            )
            .sort((a, b) => {
              if (!a.targetDate) return 1;
              if (!b.targetDate) return -1;

              return (
                new Date(a.targetDate) -
                new Date(b.targetDate)
              );
            });

          if (activeGoals.length > 0) {
            setTopGoal(activeGoals[0]);
          }
        }
      } catch (err) {
        console.error(
          "Dashboard loading error:",
          err
        );

        if (!cancelled) {
          setError(
            "Failed to load financial overview. Please refresh."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================
      LOADING
  ====================================== */

  if (loading) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand mb-4" />

        <p className="text-zinc-500 font-medium animate-pulse text-center">
          Analyzing your finances...
        </p>
      </div>
    );
  }

  /* =====================================
      ERROR
  ====================================== */

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20">
          {error}
        </div>
      </div>
    );
  }

  /* =====================================
      SAFE DATA
  ====================================== */

  const data = intelligence || {
    income: {},
    expenses: {},
    savings: {},
    budget: {},
    recurring: {},
    trends: {},
    period: {},
  };

  const income = Number(
    data.income?.current || 0
  );

  const expenses = Number(
    data.expenses?.current || 0
  );

  const savings = Number(
    data.savings?.amount || 0
  );

  const recurring = Number(
    data.recurring?.totalMonthlyBurden || 0
  );

  const incomeChange = Number(
    data.income?.momChange || 0
  );

  const savingsRate = Number(
    data.savings?.rate || 0
  );

  const recurringRatio = Number(
    data.recurring?.burdenToIncomeRatio || 0
  );

  const avgDailySpending = Number(
    data.expenses?.avgDailySpending || 0
  );

  /* =====================================
      DASHBOARD
  ====================================== */

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 min-w-0">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">

          <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
            {getGreeting()}, {displayName}
          </h1>

          <p className="text-zinc-500 text-sm mt-1">
            Here's your financial intelligence for{" "}
            {data.period?.month || "this month"}.
          </p>

        </div>
      </div>

      {/* ==================================================
          MAIN DASHBOARD AREA
      ================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start min-w-0">

        {/* ==================================================
            LEFT COLUMN
        ================================================== */}

        <div className="min-w-0 flex flex-col gap-6">

          {/* ================================================
              FINANCIAL HEALTH
          ================================================= */}

          <div className="min-w-0 w-full">
            <FeatureLocked
              feature="financial_health"
              title="Financial Health"
              description="Unlock your 0-100 deterministic financial grade."
            >
              <FinancialHealthCard />
            </FeatureLocked>
          </div>

          {/* ================================================
              CORE STATS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">

            {/* INCOME */}

            <div className="min-w-0">
              <StatCard
                label="Income"
                value={income}
                sub={`${
                  incomeChange > 0 ? "+" : ""
                }${incomeChange}% from last month`}
                icon={TrendingUp}
                iconTone="emerald"
              />
            </div>

            {/* EXPENSES */}

            <div className="min-w-0">
              <StatCard
                label="Expenses"
                value={expenses}
                sub={`Avg $${avgDailySpending.toFixed(
                  2
                )}/day`}
                icon={TrendingDown}
                iconTone="amber"
              />
            </div>

            {/* SAVINGS */}

            <div className="min-w-0">
              <StatCard
                label="Savings"
                value={savings}
                sub={`${savingsRate}% Savings Rate`}
                icon={PiggyBank}
                iconTone="brand"
              />
            </div>

            {/* RECURRING BURDEN */}

            <div className="min-w-0">
              <StatCard
                label="Recurring Burden"
                value={recurring}
                sub={`${recurringRatio}% of Income`}
                icon={DollarSign}
                iconTone="amber"
              />
            </div>

          </div>
        </div>

        {/* ==================================================
            RIGHT COLUMN
        ================================================== */}

        <div className="min-w-0 w-full">
          <FeatureLocked
            feature="forecast"
            title="Cash-Flow Forecast"
            description="Project your balance 30 days into the future."
          >
            <ForecastCard />
          </FeatureLocked>
        </div>

      </div>

      {/* ==================================================
          LOWER DASHBOARD
      ================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-w-0">

        {/* ==================================================
            LEFT / MAIN CONTENT
        ================================================== */}

        <div className="xl:col-span-2 flex flex-col gap-6 min-w-0">

          {/* ================================================
              PROACTIVE INSIGHTS
          ================================================= */}

          <div className="min-w-0">
            <FeatureLocked
              feature="proactive_insights"
              title="Proactive Insights"
              description="Get AI alerts on spending anomalies and budget risks."
            >
              <InsightsPanel />
            </FeatureLocked>
          </div>

          {/* ================================================
              BUDGET
          ================================================= */}

          <div className="min-w-0">
            <BudgetProgress
              budgetData={data.budget}
            />
          </div>

        </div>

        {/* ==================================================
            RIGHT CONTENT
        ================================================== */}

        <div className="xl:col-span-1 flex flex-col gap-6 min-w-0">

          {/* ================================================
              AI COMMAND
          ================================================= */}

          <div className="min-w-0">
            <AICommandCard />
          </div>

          {/* ================================================
              PRIORITY GOAL
          ================================================= */}

          {topGoal ? (
            <div className="card p-5 sm:p-6 min-w-0 overflow-hidden">

              <div className="flex items-center justify-between gap-3 mb-4">

                <h3 className="font-semibold text-white">
                  Priority Goal
                </h3>

                <Link
                  to="/goals"
                  className="text-brand text-sm hover:text-violet-300 transition shrink-0"
                >
                  View All
                </Link>

              </div>

              <div className="min-w-0">
                <GoalCard
                  goal={topGoal}
                  compact
                />
              </div>

            </div>
          ) : (

            <div className="card p-6 text-center flex flex-col items-center justify-center min-h-[200px]">

              <Target className="w-10 h-10 text-zinc-700 mb-3" />

              <p className="text-zinc-500 font-medium mb-3">
                No active goals.
              </p>

              <Link
                to="/goals"
                className="text-brand font-semibold hover:text-violet-300 transition text-sm"
              >
                Create a Goal →
              </Link>

            </div>
          )}

        </div>
      </div>

      {/* ==================================================
          QUICK NAVIGATION
      ================================================== */}

      <div className="pt-6 border-t border-base-border">

        <div className="flex items-center justify-between mb-4">

          <h3 className="font-semibold text-white">
            Quick Navigation
          </h3>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* TRANSACTIONS */}

          <Link
            to="/expenses"
            className="
              card
              p-4
              hover:bg-base-hover
              transition
              group
              flex
              items-center
              justify-between
              gap-3
              min-w-0
            "
          >
            <span className="font-medium text-zinc-300 group-hover:text-white transition truncate">
              Transactions
            </span>

            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-brand transition shrink-0" />
          </Link>

          {/* ANALYTICS */}

          <Link
            to="/analytics"
            className="
              card
              p-4
              hover:bg-base-hover
              transition
              group
              flex
              items-center
              justify-between
              gap-3
              min-w-0
            "
          >
            <span className="font-medium text-zinc-300 group-hover:text-white transition truncate">
              Analytics
            </span>

            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-brand transition shrink-0" />
          </Link>

          {/* WHAT IF */}

          <Link
            to="/scenarios"
            className="
              card
              p-4
              hover:bg-base-hover
              transition
              group
              flex
              items-center
              justify-between
              gap-3
              min-w-0
            "
          >
            <span className="font-medium text-zinc-300 group-hover:text-white transition truncate">
              What-If Scenarios
            </span>

            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-brand transition shrink-0" />
          </Link>

          {/* SETTINGS */}

          <Link
            to="/settings"
            className="
              card
              p-4
              hover:bg-base-hover
              transition
              group
              flex
              items-center
              justify-between
              gap-3
              min-w-0
            "
          >
            <span className="font-medium text-zinc-300 group-hover:text-white transition truncate">
              Settings
            </span>

            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-brand transition shrink-0" />
          </Link>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;