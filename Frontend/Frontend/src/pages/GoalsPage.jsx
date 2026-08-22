import React, { useEffect, useState } from "react";
import { getGoals, createGoal } from "../api/goals";
import GoalCard from "../components/GoalCard";
import FeatureLocked from "../components/FeatureLocked";
import {
  Loader2,
  Plus,
  Target,
  X,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl bg-[#0b0b0f] border border-zinc-800 px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 disabled:opacity-50";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "0",
    targetDate: "",
    description: "",
  });

  /* =====================================
      LOAD GOALS
  ====================================== */

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getGoals();

      if (res?.success) {
        setGoals(
          Array.isArray(res.goals)
            ? res.goals
            : []
        );
      } else {
        setError(
          res?.message ||
            "Failed to load goals."
        );
      }
    } catch (err) {
      console.error("Goals error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load goals."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
      INITIAL LOAD
  ====================================== */

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
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
            res?.message ||
              "Failed to load goals."
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Goals error:",
            err
          );

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

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================
      FORM CHANGE
  ====================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================
      OPEN CREATE FORM
  ====================================== */

  const openCreateForm = () => {
    setError("");
    setShowCreateForm(true);
  };

  /* =====================================
      CLOSE CREATE FORM
  ====================================== */

  const closeCreateForm = () => {
    if (creating) return;

    setShowCreateForm(false);

    setForm({
      title: "",
      targetAmount: "",
      currentAmount: "0",
      targetDate: "",
      description: "",
    });

    setError("");
  };

  /* =====================================
      CREATE GOAL
  ====================================== */

  const handleCreateGoal = async (e) => {
    e.preventDefault();

    setError("");

    /* -------------------------------
        VALIDATION
    -------------------------------- */

    if (!form.title.trim()) {
      setError("Please enter a goal name.");
      return;
    }

    if (
      !form.targetAmount ||
      Number(form.targetAmount) <= 0
    ) {
      setError(
        "Please enter a valid target amount."
      );
      return;
    }

    if (
      Number(form.currentAmount || 0) < 0
    ) {
      setError(
        "Current amount cannot be negative."
      );
      return;
    }

    if (
      Number(form.currentAmount || 0) >
      Number(form.targetAmount)
    ) {
      setError(
        "Current amount cannot be greater than the target amount."
      );
      return;
    }

    if (!form.targetDate) {
      setError(
        "Please select a target date."
      );
      return;
    }

    try {
      setCreating(true);

      const payload = {
        title: form.title.trim(),

        targetAmount: Number(
          form.targetAmount
        ),

        currentAmount: Number(
          form.currentAmount || 0
        ),

        targetDate: form.targetDate,

        description:
          form.description.trim(),
      };

      console.log(
        "Creating goal:",
        payload
      );

      const res = await createGoal(payload);

      console.log(
        "Create goal response:",
        res
      );

      if (!res?.success) {
        throw new Error(
          res?.message ||
            "Failed to create goal."
        );
      }

      /* -------------------------------
          RESET FORM
      -------------------------------- */

      setForm({
        title: "",
        targetAmount: "",
        currentAmount: "0",
        targetDate: "",
        description: "",
      });

      setShowCreateForm(false);

      /* -------------------------------
          REFRESH GOALS
      -------------------------------- */

      await loadGoals();
    } catch (err) {
      console.error(
        "Create goal error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create goal."
      );
    } finally {
      setCreating(false);
    }
  };

  /* =====================================
      RENDER
  ====================================== */

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
                Track your goals and build your
                financial future.
              </p>
            </div>

          </div>

          {/* NEW GOAL */}

          <button
            className="btn-primary"
            type="button"
            onClick={openCreateForm}
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
            CREATE FORM
        ====================================== */}

        {showCreateForm && (
          <div className="card p-6 sm:p-7">

            {/* FORM HEADER */}

            <div className="flex items-start justify-between gap-4 mb-6">

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Create a New Goal
                </h2>

                <p className="text-zinc-500 text-sm mt-1">
                  Set a target and start tracking
                  your progress.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateForm}
                disabled={creating}
                className="
                  w-9
                  h-9
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-zinc-500
                  hover:text-white
                  hover:bg-zinc-800
                  transition
                  shrink-0
                "
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleCreateGoal}
              className="space-y-5"
            >

              {/* GOAL NAME */}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Goal Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Emergency Fund"
                  className={inputClass}
                  disabled={creating}
                  autoComplete="off"
                />
              </div>

              {/* AMOUNTS */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Target Amount
                  </label>

                  <input
                    type="number"
                    name="targetAmount"
                    value={form.targetAmount}
                    onChange={handleChange}
                    placeholder="10000"
                    min="1"
                    step="0.01"
                    className={inputClass}
                    disabled={creating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Current Amount
                  </label>

                  <input
                    type="number"
                    name="currentAmount"
                    value={form.currentAmount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className={inputClass}
                    disabled={creating}
                  />
                </div>

              </div>

              {/* TARGET DATE */}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Target Date
                </label>

                <input
                  type="date"
                  name="targetDate"
                  value={form.targetDate}
                  onChange={handleChange}
                  className={inputClass}
                  style={{
                    colorScheme: "dark",
                  }}
                  disabled={creating}
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Description{" "}
                  <span className="text-zinc-600">
                    (optional)
                  </span>
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="What are you saving for?"
                  rows={3}
                  className={`${inputClass} resize-none`}
                  disabled={creating}
                />
              </div>

              {/* ACTION BUTTONS */}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeCreateForm}
                  disabled={creating}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-zinc-800
                    bg-[#0b0b0f]
                    text-zinc-300
                    font-medium
                    hover:bg-zinc-900
                    hover:text-white
                    transition
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Goal
                    </>
                  )}
                </button>

              </div>

            </form>
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
              Start planning for your future by
              creating your first financial goal.
            </p>

            <button
              className="btn-primary mx-auto"
              type="button"
              onClick={openCreateForm}
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