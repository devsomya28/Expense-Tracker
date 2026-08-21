import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User as UserIcon,
  RefreshCw,
} from "lucide-react";
import { getSpendingAnalysisApi, askFinancialQuestionApi } from "../api/ai";
import { useAuth } from "../context/AuthContext";
import { ErrorBanner } from "../components/Feedback";
import AnalysisReport from "../components/ai/AnalysisReport";
import AnswerCard from "../components/ai/AnswerCard";

const SUGGESTED_QUESTIONS = [
  "How much did I spend on food this month?",
  "Am I on track with my budget?",
  "What's my biggest spending category?",
  "How does this month compare to last month?",
];

export default function AskAI() {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [chatError, setChatError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  const runAnalysis = async () => {
    setAnalysisLoading(true);
    setAnalysisError("");
    try {
      const res = await getSpendingAnalysisApi();
      setAnalysis(res.analysis);
    } catch (err) {
      setAnalysisError(err.message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const sendQuestion = async (text) => {
    const q = (text ?? question).trim();
    if (!q || asking) return;

    setChatError("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setQuestion("");
    setAsking(true);

    try {
      const res = await askFinancialQuestionApi(q);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.response },
      ]);
    } catch (err) {
      setChatError(err.message);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setAsking(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendQuestion();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Sparkles size={26} className="text-brand-light" /> Ask AI
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Get an AI-generated read on your spending, or ask a question about
          your finances.
        </p>
      </div>

      {/* Spending analysis */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-white">
              Monthly Spending Analysis
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              AI-generated summary of this month vs last month.
            </p>
          </div>
          <button
            onClick={runAnalysis}
            disabled={analysisLoading}
            className="btn-secondary text-sm"
          >
            {analysisLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <RefreshCw size={15} />
            )}
            {analysis ? "Regenerate" : "Analyze my spending"}
          </button>
        </div>

        <ErrorBanner message={analysisError} />

        {analysisLoading && !analysis ? (
          <div className="space-y-2">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        ) : analysis ? (
          <div className="bg-base-panel border border-base-border rounded-xl p-5">
            <AnalysisReport raw={analysis} />
          </div>
        ) : (
          <div className="text-sm text-zinc-500 py-6 text-center">
            No analysis yet — click "Analyze my spending" to get an
            AI-generated breakdown of your month.
          </div>
        )}
      </div>

      {/* Chat */}
      <div className="card flex flex-col h-[560px]">
        <div className="px-6 py-4 border-b border-base-border">
          <h3 className="font-semibold text-white">Ask a question</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Answers are generated from your own financial data only.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8">
              <div className="w-12 h-12 rounded-2xl bg-brand/15 flex items-center justify-center">
                <Bot size={22} className="text-brand-light" />
              </div>
              <p className="text-sm text-zinc-500 max-w-xs">
                Ask anything about your income, expenses, budget, or savings.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendQuestion(q)}
                    className="badge hover:border-brand/40 hover:text-brand-light transition text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-brand/15 flex items-center justify-center shrink-0">
                  <Bot size={15} className="text-brand-light" />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "max-w-[75%] bg-brand text-white rounded-br-sm whitespace-pre-wrap"
                    : "max-w-[85%] w-full bg-base-panel border border-base-border text-zinc-200 rounded-bl-sm"
                }`}
              >
                {m.role === "user" ? (
                  m.content
                ) : (
                  <AnswerCard raw={m.content} />
                )}
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-base-panel border border-base-border flex items-center justify-center shrink-0 text-xs font-semibold text-zinc-300">
                  {user?.username?.[0]?.toUpperCase() || <UserIcon size={13} />}
                </div>
              )}
            </div>
          ))}

          {asking && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-brand/15 flex items-center justify-center shrink-0">
                <Bot size={15} className="text-brand-light" />
              </div>
              <div className="bg-base-panel border border-base-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="px-6 py-4 border-t border-base-border">
          <ErrorBanner message={chatError} />
          <form onSubmit={onSubmit} className="flex items-center gap-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about your spending, budget, or savings..."
              maxLength={1000}
              className="input-field"
            />
            <button
              type="submit"
              disabled={asking || !question.trim()}
              className="btn-primary px-4 py-3 shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
