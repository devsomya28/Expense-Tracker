import {
  Lightbulb,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  FlaskConical,
  Info,
} from "lucide-react";
import { formatCurrency } from "../../utils/format";

const INTENT_LABELS = {
  calculation: "Calculation",
  analysis: "Analysis",
  comparison: "Comparison",
  hypothetical: "Hypothetical",
  budget: "Budget",
  savings: "Savings",
  affordability: "Affordability",
  recommendation: "Recommendation",
  general: "General",
  general_financial_query: "General",
};

export function IntentBadge({ intent }) {
  if (!intent) return null;
  return (
    <span className="badge text-brand-light border-brand/20 bg-brand/10">
      <Sparkles size={11} className="mr-1" />
      {INTENT_LABELS[intent] || intent}
    </span>
  );
}

export function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={14} className="text-zinc-500" />}
      <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {children}
      </h4>
    </div>
  );
}

const isEmpty = (v) =>
  v === null ||
  v === undefined ||
  v === "" ||
  (Array.isArray(v) && v.length === 0) ||
  v === "not_applicable";

export function InsightList({ items, icon: Icon = Lightbulb, tone = "zinc" }) {
  if (isEmpty(items)) return null;
  const toneClass =
    tone === "amber"
      ? "text-amber-400"
      : tone === "emerald"
      ? "text-emerald-400"
      : "text-brand-light";
  return (
    <ul className="space-y-2">
      {items.map((text, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
          <Icon size={14} className={`mt-0.5 shrink-0 ${toneClass}`} />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

export function CalculationCard({ description, formula, result, currency }) {
  if (isEmpty(result) && isEmpty(description) && isEmpty(formula))
    return null;
  return (
    <div className="rounded-xl bg-base-panel border border-base-border p-4">
      {description && (
        <p className="text-sm text-zinc-300 mb-2">{description}</p>
      )}
      {formula && (
        <p className="text-xs font-mono text-zinc-500 mb-2 break-words">
          {formula}
        </p>
      )}
      {!isEmpty(result) && (
        <p className="text-lg font-bold text-white">
          {typeof result === "number"
            ? currency
              ? formatCurrency(result)
              : result
            : result}
        </p>
      )}
    </div>
  );
}

export function FactRow({ description, amount, currency }) {
  return (
    <div className="flex items-center justify-between text-sm py-2 border-b border-base-border last:border-b-0">
      <span className="text-zinc-400">{description}</span>
      {!isEmpty(amount) && (
        <span className="font-mono text-zinc-200 shrink-0 ml-3">
          {typeof amount === "number" && currency
            ? formatCurrency(amount)
            : amount}
        </span>
      )}
    </div>
  );
}

export function DirectionIcon({ direction }) {
  if (direction === "increased")
    return <TrendingUp size={14} className="text-red-400" />;
  if (direction === "decreased")
    return <TrendingDown size={14} className="text-emerald-400" />;
  return <Minus size={14} className="text-zinc-500" />;
}

const STATUS_STYLES = {
  under_budget: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  near_budget: "text-amber-400 border-amber-500/20 bg-amber-500/10",
  exceeded: "text-red-400 border-red-500/20 bg-red-500/10",
  not_available: "text-zinc-500 border-base-border bg-base-panel",
};

const STATUS_LABELS = {
  under_budget: "Under budget",
  near_budget: "Near budget",
  exceeded: "Exceeded",
  not_available: "Not available",
};

export function StatusBadge({ status }) {
  if (!status) return null;
  return (
    <span
      className={`badge ${
        STATUS_STYLES[status] || "text-zinc-400 border-base-border"
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

const SEVERITY_STYLES = {
  low: "text-sky-400 border-sky-500/20 bg-sky-500/10",
  medium: "text-amber-400 border-amber-500/20 bg-amber-500/10",
  high: "text-red-400 border-red-500/20 bg-red-500/10",
};

export function SeverityBadge({ severity }) {
  if (!severity) return null;
  return (
    <span className={`badge ${SEVERITY_STYLES[severity] || ""}`}>
      {severity}
    </span>
  );
}

export function HypotheticalCard({ data, descriptionKey = "description" }) {
  if (!data || data.applicable === false) return null;
  const rows = [
    ["Baseline", data.baseline ?? data.baselineAmount],
    ["Change", data.changePercentage != null ? `${data.changePercentage}%` : data.changeAmount],
    ["New value", data.newValue ?? data.newAmount],
    ["Potential savings", data.potentialSavings],
  ].filter(([, v]) => !isEmpty(v));

  if (rows.length === 0 && isEmpty(data[descriptionKey])) return null;

  return (
    <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical size={14} className="text-brand-light" />
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-light">
          Hypothetical
        </p>
      </div>
      {data[descriptionKey] && (
        <p className="text-sm text-zinc-300 mb-3">{data[descriptionKey]}</p>
      )}
      {data.explanation && (
        <p className="text-sm text-zinc-300 mb-3">{data.explanation}</p>
      )}
      {rows.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-2">
              <span className="text-zinc-500">{label}</span>
              <span className="text-zinc-200 font-mono">
                {typeof value === "number" ? formatCurrency(value) : value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MissingDataNote({ items }) {
  if (isEmpty(items)) return null;
  return (
    <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
      <Info size={14} className="text-amber-400 mt-0.5 shrink-0" />
      <div className="text-sm text-amber-300">
        <p className="font-medium mb-1">Missing data</p>
        <ul className="space-y-0.5 text-amber-300/80">
          {items.map((m, i) => (
            <li key={i}>· {m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { isEmpty };
