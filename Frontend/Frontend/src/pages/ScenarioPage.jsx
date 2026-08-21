import React, { useState } from "react";
import ScenarioBuilder from "../components/ScenarioBuilder";
import ScenarioResult from "../components/ScenarioResult";
import { simulateScenario } from "../api/scenarios";
import { Activity } from "lucide-react";

const ScenarioPage = () => {
  const [simulation, setSimulation] = useState(null);
  const [error, setError] = useState("");

  const handleSimulate = async (changes) => {
    setError("");

    try {
      const res = await simulateScenario(changes);

      if (res.success) {
        setSimulation(res.simulation);
      } else {
        setError(
          res.message || "Unable to run simulation."
        );
      }
    } catch (err) {
      console.error("Scenario simulation error:", err);

      setError(
        err.response?.data?.message ||
          "Simulation failed. Please try again."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* =====================================
          HEADER
      ====================================== */}

      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
            <Activity
              className="w-5 h-5 text-brand"
              strokeWidth={2}
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              What-If Scenarios
            </h1>

            <p className="text-zinc-500 text-sm mt-1">
              Test hypothetical changes to your income and
              spending.
            </p>
          </div>
        </div>

        <p className="text-zinc-500 text-sm mt-4 max-w-3xl">
          Explore different financial scenarios without
          affecting your actual financial data. Changes made
          here are only simulations.
        </p>
      </div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
          {error}
        </div>
      )}

      {/* =====================================
          SCENARIO BUILDER
      ====================================== */}

      <div className="grid grid-cols-1 gap-6">
        <ScenarioBuilder
          onSimulate={handleSimulate}
        />

        {/* =====================================
            SCENARIO RESULT
        ====================================== */}

        <ScenarioResult
          simulation={simulation}
        />
      </div>
    </div>
  );
};

export default ScenarioPage;
