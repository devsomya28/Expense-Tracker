import Insight from '../models/insight.model.js';
import { getFinancialIntelligence } from './financial-intelligence.service.js';
import { generateInsightExplanation } from '../ai/services/insight-explanation.service.js';
import { INSIGHT_TYPES, INSIGHT_SEVERITY, INSIGHT_STATUS } from '../config/insight.constants.js';

export const detectAndGenerateInsights = async (userId) => {
  const intelligence = await getFinancialIntelligence(userId);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthProgress = intelligence.period.currentDay / intelligence.period.daysInMonth;

  const newInsights = [];

  // 1. BUDGET RISK DETECTION
  if (intelligence.budget.total > 0) {
    const expectedUtilization = monthProgress * 100;
    const actualUtilization = intelligence.budget.utilizationPercentage;
    
    if (actualUtilization > expectedUtilization + 15 && actualUtilization < 100) {
      newInsights.push({
        type: INSIGHT_TYPES.BUDGET_RISK,
        severity: INSIGHT_SEVERITY.HIGH,
        title: 'High Budget Run Rate',
        description: `You have used ${actualUtilization}% of your budget, but we are only ${Math.round(expectedUtilization)}% through the month.`,
        percentage: actualUtilization,
        hash: `${INSIGHT_TYPES.BUDGET_RISK}_${currentMonth}_${currentYear}`
      });
    }
  }

  // 2. SAVINGS DROP DETECTION
  if (intelligence.savings.rate < 5 && intelligence.income.current > 0) {
    newInsights.push({
      type: INSIGHT_TYPES.SAVINGS_DROP,
      severity: INSIGHT_SEVERITY.MEDIUM,
      title: 'Low Savings Rate',
      description: `Your savings rate is currently at ${intelligence.savings.rate}%, which leaves little room for emergencies.`,
      percentage: intelligence.savings.rate,
      hash: `${INSIGHT_TYPES.SAVINGS_DROP}_${currentMonth}_${currentYear}`
    });
  }

  // 3. POSITIVE TREND DETECTION
  if (intelligence.savings.rate > 20 && intelligence.trends.expenseMomChangePercentage < 0) {
    newInsights.push({
      type: INSIGHT_TYPES.POSITIVE_TREND,
      severity: INSIGHT_SEVERITY.INFO,
      title: 'Excellent Financial Month',
      description: `You are saving well (${intelligence.savings.rate}%) and spending less than last month. Great job!`,
      percentage: Math.abs(intelligence.trends.expenseMomChangePercentage),
      hash: `${INSIGHT_TYPES.POSITIVE_TREND}_${currentMonth}_${currentYear}`
    });
  }

  // Process and save insights
  for (const rawInsight of newInsights) {
    // Duplicate Prevention Check
    const exists = await Insight.findOne({ 
      user: userId, 
      'metadata.hash': rawInsight.hash 
    }).lean();

    if (!exists) {
      // AI Enhancement for High/Critical Insights
      let finalDescription = rawInsight.description;
      if (rawInsight.severity === INSIGHT_SEVERITY.HIGH || rawInsight.severity === INSIGHT_SEVERITY.CRITICAL) {
        finalDescription = await generateInsightExplanation(rawInsight);
      }

      await Insight.create({
        user: userId,
        ...rawInsight,
        description: finalDescription,
        metadata: { month: currentMonth, year: currentYear, hash: rawInsight.hash },
        expiresAt: new Date(currentYear, currentMonth + 1, 0) // Expires end of month
      });
    }
  }
};