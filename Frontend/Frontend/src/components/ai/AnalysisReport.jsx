import {
  Calculator,
  ListChecks,
  AlertTriangle,
  Scissors,
  PiggyBank,
  Repeat,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { parseAiJson } from "../../utils/parseAiJson";
import Markdown from "./Markdown";
import { formatCurrency } from "../../utils/format";
import {
  IntentBadge,
  SectionTitle,
  InsightList,
  CalculationCard,
  FactRow,
  StatusBadge,
  SeverityBadge,
  HypotheticalCard,
  MissingDataNote,
  DirectionIcon,
  isEmpty,
} from "./Bits";

export default function AnalysisReport({ raw }) {
  const data = parseAiJson(raw);

  if (!data || typeof data !== "object" || isEmpty(data.summary)) {
    return <Markdown>{typeof raw === "string" ? raw : ""}</Markdown>;
  }

  const {
    intent,
    summary,
    facts,
    calculations,
    spendingChange,
    topCategories,
    unusualSpending,
    reduceExpenses,
    budgetAnalysis,
    hypotheticalScenario,
    savingsAnalysis,
    recurringExpenses,
    savingsOpportunities,
    recommendations,
    missingData,
    finalAdvice,
  } = data;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-base text-zinc-100 leading-relaxed font-medium">
          {summary}
        </p>
        <IntentBadge intent={intent} />
      </div>

      {!isEmpty(spendingChange) &&
        spendingChange?.direction !== "not_applicable" && (
          <div className="flex items-center gap-3 rounded-xl bg-base-panel border border-base-border p-4">
            <DirectionIcon direction={spendingChange.direction} />
            <div className="flex-1">
              <p className="text-sm text-zinc-200">
                {spendingChange.explanation}
              </p>
            </div>
            {!isEmpty(spendingChange.percentage) && (
              <span
                className={`text-sm font-semibold shrink-0 ${
                  spendingChange.direction === "increased"
                    ? "text-red-400"
                    : spendingChange.direction === "decreased"
                    ? "text-emerald-400"
                    : "text-zinc-400"
                }`}
              >
                {spendingChange.percentage > 0 ? "+" : ""}
                {spendingChange.percentage}%
              </span>
            )}
          </div>
        )}

      {!isEmpty(facts) && (
        <div>
          <SectionTitle icon={ListChecks}>Facts</SectionTitle>
          <div className="rounded-xl bg-base-panel border border-base-border px-4">
            {facts.map((f, i) => (
              <FactRow key={i} {...f} />
            ))}
          </div>
        </div>
      )}

      {!isEmpty(calculations) && (
        <div>
          <SectionTitle icon={Calculator}>Calculations</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-3">
            {calculations.map((c, i) => (
              <CalculationCard key={i} {...c} />
            ))}
          </div>
        </div>
      )}

      {!isEmpty(topCategories) && (
        <div>
          <SectionTitle icon={TrendingUp}>Top Categories</SectionTitle>
          <div className="space-y-2">
            {topCategories.map((c, i) => (
              <div
                key={i}
                className="rounded-xl bg-base-panel border border-base-border p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">
                    {c.category}
                  </span>
                  <span className="text-sm font-mono text-zinc-200">
                    {formatCurrency(c.amount)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2">
                  {!isEmpty(c.percentageOfExpenses) && (
                    <span>{c.percentageOfExpenses}% of expenses</span>
                  )}
                  {!isEmpty(c.transactionCount) && (
                    <span>
                      {c.transactionCount} transaction
                      {c.transactionCount === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
                {!isEmpty(c.percentageOfExpenses) && (
                  <div className="h-1.5 rounded-full bg-base-hover overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{
                        width: `${Math.min(100, c.percentageOfExpenses)}%`,
                      }}
                    />
                  </div>
                )}
                {c.observation && (
                  <p className="text-xs text-zinc-400">{c.observation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isEmpty(unusualSpending) && (
        <div>
          <SectionTitle icon={AlertTriangle}>Unusual Spending</SectionTitle>
          <div className="space-y-2">
            {unusualSpending.map((u, i) => (
              <div
                key={i}
                className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">
                    {u.title}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-mono text-zinc-200">
                      {formatCurrency(u.amount)}
                    </span>
                    <SeverityBadge severity={u.severity} />
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mb-1">{u.category}</p>
                {u.reason && (
                  <p className="text-xs text-zinc-400">{u.reason}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isEmpty(reduceExpenses) && (
        <div>
          <SectionTitle icon={Scissors}>
            Where You Could Cut Back
          </SectionTitle>
          <div className="space-y-2">
            {reduceExpenses.map((r, i) => (
              <div
                key={i}
                className="rounded-xl bg-base-panel border border-base-border p-4"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-white">
                    {r.category}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {r.reductionPercentage}% reduction
                  </span>
                </div>
                {r.suggestion && (
                  <p className="text-xs text-zinc-400 mb-2">
                    {r.suggestion}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-zinc-500">
                    Current: {formatCurrency(r.currentAmount)}
                  </span>
                  <span className="text-emerald-400 font-medium">
                    Save ~{formatCurrency(r.potentialSaving)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isEmpty(budgetAnalysis) &&
        budgetAnalysis?.status !== "not_available" && (
          <div>
            <SectionTitle icon={PiggyBank}>Budget</SectionTitle>
            <div className="rounded-xl bg-base-panel border border-base-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="grid grid-cols-3 gap-4 flex-1">
                  <div>
                    <p className="text-xs text-zinc-500">Budget</p>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(budgetAnalysis.budget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Spent</p>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(budgetAnalysis.spent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Remaining</p>
                    <p
                      className={`text-sm font-semibold ${
                        budgetAnalysis.remaining < 0
                          ? "text-red-400"
                          : "text-brand-light"
                      }`}
                    >
                      {formatCurrency(budgetAnalysis.remaining)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={budgetAnalysis.status} />
              </div>
              {!isEmpty(budgetAnalysis.percentageUsed) && (
                <div className="h-2 rounded-full bg-base-hover overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${
                      budgetAnalysis.status === "exceeded"
                        ? "bg-red-500"
                        : "bg-brand"
                    }`}
                    style={{
                      width: `${Math.min(100, budgetAnalysis.percentageUsed)}%`,
                    }}
                  />
                </div>
              )}
              {budgetAnalysis.recommendation && (
                <p className="text-xs text-zinc-400">
                  {budgetAnalysis.recommendation}
                </p>
              )}
            </div>
          </div>
        )}

      <HypotheticalCard
        data={hypotheticalScenario}
        descriptionKey="description"
      />

      {!isEmpty(savingsAnalysis) && (
        <div>
          <SectionTitle icon={PiggyBank}>Savings</SectionTitle>
          <div className="rounded-xl bg-base-panel border border-base-border p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
              {[
                ["Income", savingsAnalysis.income],
                ["Expenses", savingsAnalysis.expenses],
                ["Current Savings", savingsAnalysis.currentSavings],
                [
                  "Savings Rate",
                  !isEmpty(savingsAnalysis.savingsRate)
                    ? `${savingsAnalysis.savingsRate}%`
                    : null,
                ],
              ]
                .filter(([, v]) => !isEmpty(v))
                .map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-zinc-500">{label}</p>
                    <p className="text-sm font-semibold text-white">
                      {typeof value === "number"
                        ? formatCurrency(value)
                        : value}
                    </p>
                  </div>
                ))}
            </div>
            {savingsAnalysis.explanation && (
              <p className="text-xs text-zinc-400">
                {savingsAnalysis.explanation}
              </p>
            )}
          </div>
        </div>
      )}

      {!isEmpty(recurringExpenses) && (
        <div>
          <SectionTitle icon={Repeat}>Recurring Expenses</SectionTitle>
          <div className="space-y-2">
            {recurringExpenses.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-base-panel border border-base-border p-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-white">{r.name}</p>
                  {r.observation && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {r.observation}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-white">
                    {formatCurrency(r.monthlyAmount)}/mo
                  </p>
                  {!isEmpty(r.annualAmount) && (
                    <p className="text-xs text-zinc-500">
                      {formatCurrency(r.annualAmount)}/yr
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isEmpty(savingsOpportunities) && (
        <div>
          <SectionTitle icon={Sparkles}>Savings Opportunities</SectionTitle>
          <div className="space-y-2">
            {savingsOpportunities.map((s, i) => (
              <div
                key={i}
                className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">
                    {s.area}
                  </span>
                  {!isEmpty(s.potentialSaving) && (
                    <span className="text-sm font-mono text-emerald-400">
                      +{formatCurrency(s.potentialSaving)}
                    </span>
                  )}
                </div>
                {s.reason && (
                  <p className="text-xs text-zinc-400 mb-1">{s.reason}</p>
                )}
                {s.suggestion && (
                  <p className="text-xs text-zinc-300">{s.suggestion}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isEmpty(recommendations) && (
        <div>
          <SectionTitle icon={ListChecks}>Recommendations</SectionTitle>
          <InsightList items={recommendations} icon={ListChecks} tone="emerald" />
        </div>
      )}

      <MissingDataNote items={missingData} />

      {finalAdvice && (
        <div className="rounded-xl bg-brand/10 border border-brand/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-light mb-1.5">
            Final Advice
          </p>
          <p className="text-sm text-zinc-100">{finalAdvice}</p>
        </div>
      )}
    </div>
  );
}
