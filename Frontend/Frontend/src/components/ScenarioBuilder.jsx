import React, { useState } from "react";
import { PlusCircle, Trash2, Sparkles, Play } from "lucide-react";

const ScenarioBuilder = ({ onSimulate }) => {
  const [changes, setChanges] = useState([]);

  const [currentChange, setCurrentChange] = useState({
    type: "CATEGORY_REDUCTION",
    category: "",
    percentage: "",
    amount: "",
  });

  const handleAddChange = () => {
    if (!currentChange.type) return;

    const formattedChange = {
      type: currentChange.type,
    };

    if (currentChange.type.includes("CATEGORY")) {
      if (
        !currentChange.category ||
        !currentChange.percentage
      ) {
        return;
      }

      formattedChange.category =
        currentChange.category.trim();

      formattedChange.percentage = Number(
        currentChange.percentage
      );
    } else if (
      currentChange.type.includes("PERCENTAGE") ||
      currentChange.type.includes("REDUCTION")
    ) {
      if (
        !currentChange.percentage &&
        !currentChange.amount
      ) {
        return;
      }

      if (currentChange.percentage) {
        formattedChange.percentage = Number(
          currentChange.percentage
        );
      }

      if (currentChange.amount) {
        formattedChange.amount = Number(
          currentChange.amount
        );
      }
    } else {
      if (!currentChange.amount) return;

      formattedChange.amount = Number(
        currentChange.amount
      );
    }

    setChanges((prev) => [
      ...prev,
      formattedChange,
    ]);

    setCurrentChange({
      type: "CATEGORY_REDUCTION",
      category: "",
      percentage: "",
      amount: "",
    });
  };

  const removeChange = (index) => {
    setChanges((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSimulate = () => {
    if (changes.length === 0) return;

    onSimulate(changes);
  };

  const isCategory =
    currentChange.type.includes("CATEGORY");

  const isPercentage =
    currentChange.type.includes("REDUCTION") ||
    currentChange.type.includes("CATEGORY");

  return (
    <div className="card p-6">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand" />
          </div>

          <h3 className="text-lg font-bold text-white">
            Build Scenario
          </h3>
        </div>

        <p className="text-sm text-zinc-500">
          Add hypothetical changes to see how they could
          affect your finances.
        </p>
      </div>

      {/* =====================================
          INPUT AREA
      ====================================== */}

      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        {/* CHANGE TYPE */}
        <select
          className="input-field lg:max-w-xs"
          value={currentChange.type}
          onChange={(e) =>
            setCurrentChange({
              ...currentChange,
              type: e.target.value,
              category: "",
              percentage: "",
              amount: "",
            })
          }
        >
          <option value="CATEGORY_REDUCTION">
            Reduce Category Spending (%)
          </option>

          <option value="TOTAL_EXPENSE_REDUCTION">
            Reduce Total Expenses (%)
          </option>

          <option value="INCOME_INCREASE">
            Increase Income ($)
          </option>
        </select>

        {/* CATEGORY */}
        {isCategory && (
          <input
            type="text"
            placeholder="Category (e.g. Food)"
            className="input-field"
            value={currentChange.category}
            onChange={(e) =>
              setCurrentChange({
                ...currentChange,
                category: e.target.value,
              })
            }
          />
        )}

        {/* VALUE */}
        {isPercentage ? (
          <div className="relative w-full lg:w-28">
            <input
              type="number"
              min="0"
              max="100"
              placeholder="%"
              className="input-field pr-8"
              value={currentChange.percentage}
              onChange={(e) =>
                setCurrentChange({
                  ...currentChange,
                  percentage: e.target.value,
                })
              }
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm pointer-events-none">
              %
            </span>
          </div>
        ) : (
          <div className="relative w-full lg:w-32">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm pointer-events-none">
              $
            </span>

            <input
              type="number"
              min="0"
              placeholder="Amount"
              className="input-field pl-7"
              value={currentChange.amount}
              onChange={(e) =>
                setCurrentChange({
                  ...currentChange,
                  amount: e.target.value,
                })
              }
            />
          </div>
        )}

        {/* ADD */}
        <button
          type="button"
          onClick={handleAddChange}
          className="btn-secondary lg:w-auto whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4 text-brand" />
          Add
        </button>
      </div>

      {/* =====================================
          CHANGES LIST
      ====================================== */}

      {changes.length > 0 ? (
        <div className="space-y-2 mb-6">
          <p className="text-xs uppercase tracking-wide font-medium text-zinc-500 mb-3">
            Scenario Changes
          </p>

          {changes.map((change, index) => {
            const value = change.percentage
              ? `${change.percentage}%`
              : `$${change.amount}`;

            return (
              <div
                key={index}
                className="flex items-center justify-between gap-3 bg-base-panel border border-base-border p-3 rounded-xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                    <span className="text-xs text-brand font-bold">
                      {index + 1}
                    </span>
                  </div>

                  <span className="text-sm text-zinc-300 truncate">
                    {change.type
                      .replace(/_/g, " ")}
                    {change.category
                      ? `: ${change.category}`
                      : ""}
                    {` — ${value}`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeChange(index)
                  }
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition shrink-0"
                  title="Remove change"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-6 p-5 rounded-xl border border-dashed border-base-border text-center">
          <p className="text-sm text-zinc-600">
            No changes added yet.
          </p>

          <p className="text-xs text-zinc-700 mt-1">
            Add one or more changes above to build your
            scenario.
          </p>
        </div>
      )}

      {/* =====================================
          ACTIONS
      ====================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={() =>
            alert(
              "AI optimization hook will connect here in future phases."
            )
          }
          className="btn-ghost text-brand hover:text-violet-300 justify-start"
        >
          <Sparkles className="w-4 h-4" />
          Optimize my savings
        </button>

        <button
          type="button"
          onClick={handleSimulate}
          disabled={changes.length === 0}
          className="btn-primary"
        >
          <Play className="w-4 h-4" />
          Run Simulation
        </button>
      </div>
    </div>
  );
};

export default ScenarioBuilder;
