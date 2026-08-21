import React from "react";
import {
  Sparkles,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NaturalLanguageExpense from "./ai/NaturalLanguageExpense";

const AICommandCard = () => {
  const navigate = useNavigate();

  const handleExpenseAdded = () => {
    window.location.reload();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/80 via-[#17112d] to-[#0d0b16] p-6 shadow-glow">

      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      <div className="absolute top-0 right-0 p-4 opacity-[0.06] pointer-events-none">
        <Sparkles className="w-32 h-32 text-violet-300" />
      </div>

      {/* Content */}
      <div className="relative z-10">

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>

          <h3 className="text-xl font-bold text-white">
            Finora Copilot
          </h3>
        </div>

        <p className="text-violet-200/70 text-sm mb-6 max-w-sm leading-relaxed">
          Log an expense instantly, or ask me to analyze
          your financial health, forecast, and goals.
        </p>

        {/* AI Expense Input */}
        <div className="rounded-xl bg-base-panel/60 border border-violet-500/20 shadow-lg overflow-hidden mb-4">
          <NaturalLanguageExpense
            onExpenseAdded={handleExpenseAdded}
          />
        </div>

        {/* Chat Button */}
        <button
          onClick={() => navigate("/ask-ai")}
          className="
            w-full
            flex
            items-center
            justify-between
            gap-3
            bg-violet-500/10
            hover:bg-violet-500/20
            border
            border-violet-500/20
            hover:border-violet-500/30
            transition
            px-4
            py-3
            rounded-xl
            text-sm
            font-medium
            text-zinc-200
          "
        >
          <span className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-400" />
            Chat with Financial Copilot
          </span>

          <ArrowRight className="w-4 h-4 text-violet-400" />
        </button>

      </div>
    </div>
  );
};

export default AICommandCard;
