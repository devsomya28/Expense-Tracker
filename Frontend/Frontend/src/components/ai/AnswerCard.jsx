import { Calculator, Lightbulb, ListChecks } from "lucide-react";
import { parseAiJson } from "../../utils/parseAiJson";
import Markdown from "./Markdown";
import {
  IntentBadge,
  SectionTitle,
  InsightList,
  CalculationCard,
  HypotheticalCard,
  MissingDataNote,
  isEmpty,
} from "./Bits";

export default function AnswerCard({ raw }) {
  const data = parseAiJson(raw);

  // Not valid JSON (or missing the expected shape) — render as markdown/text
  // instead of dumping raw braces on the user.
  if (!data || typeof data !== "object" || isEmpty(data.answer)) {
    return <Markdown>{typeof raw === "string" ? raw : ""}</Markdown>;
  }

  const {
    answer,
    intent,
    calculation,
    insights,
    recommendations,
    hypothetical,
    missingData,
  } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-100 leading-relaxed">{answer}</p>
        <IntentBadge intent={intent} />
      </div>

      {calculation?.applicable !== false && (
        <div>
          <SectionTitle icon={Calculator}>Calculation</SectionTitle>
          <CalculationCard
            description={calculation?.description}
            formula={calculation?.formula}
            result={calculation?.result}
            currency={calculation?.currency}
          />
        </div>
      )}

      {!isEmpty(insights) && (
        <div>
          <SectionTitle icon={Lightbulb}>Insights</SectionTitle>
          <InsightList items={insights} icon={Lightbulb} />
        </div>
      )}

      {!isEmpty(recommendations) && (
        <div>
          <SectionTitle icon={ListChecks}>Recommendations</SectionTitle>
          <InsightList items={recommendations} icon={ListChecks} tone="emerald" />
        </div>
      )}

      <HypotheticalCard data={hypothetical} />

      <MissingDataNote items={missingData} />
    </div>
  );
}
