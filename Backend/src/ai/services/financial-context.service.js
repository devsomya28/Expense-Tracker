import { getFinancialIntelligence } from '../../services/financial-intelligence.service.js';
import { getUserGoals } from '../../services/goal.service.js';

export const buildFinancialContext = async (userId) => {
  try {
    // 1. Fetch pre-calculated deterministic facts
    const intelligence = await getFinancialIntelligence(userId);
    const goals = await getUserGoals(userId); // Fetch deterministic goals
    const activeGoals = goals.filter(g => g.status === 'ACTIVE');

    // 2. Format context for the LLM
    let context = `Financial Context for ${intelligence.period.month} ${intelligence.period.year}:\n`;
    context += `--- SUMMARY ---\n`;
    context += `- Income: $${intelligence.income.current}\n`;
    context += `- Expenses: $${intelligence.expenses.current}\n`;
    context += `- Savings: $${intelligence.savings.amount} (Rate: ${intelligence.savings.rate}%)\n`;
    context += `- Expense-to-Income Ratio: ${intelligence.trends.expenseToIncomeRatio}%\n`;
    context += `- Month-over-Month Spending Change: ${intelligence.trends.expenseMomChangePercentage}%\n\n`;

    context += `--- BUDGET ---\n`;
    context += `- Total Budget: $${intelligence.budget.total}\n`;
    context += `- Budget Utilization: ${intelligence.budget.utilizationPercentage}%\n`;
    context += `- Remaining Budget: $${intelligence.budget.remaining}\n`;
    context += `- Safe Daily Allowance Remaining: $${intelligence.budget.remainingDailyAllowance}\n\n`;

    context += `--- RISKS & ANOMALIES ---\n`;
    context += `\n--- FINANCIAL GOALS ---\n`;
    if (intelligence.riskIndicators.length > 0) {
      intelligence.riskIndicators.forEach(risk => context += `- WARNING: ${risk}\n`);
    } else {
      context += `- No immediate financial risks detected.\n`;
    }

    context += `\n--- CATEGORY BREAKDOWN ---\n`;
    for (const [cat, pct] of Object.entries(intelligence.categories.percentages)) {
      context += `- ${cat}: ${pct}% of total spending\n`;
    }

    if (activeGoals.length > 0) {
      activeGoals.forEach(g => {
        context += `- Goal: "${g.name}" ($${g.currentAmount} / $${g.targetAmount} saved)\n`;
        context += `  Progress: ${g.metrics.progressPercentage}% | Target Date: ${new Date(g.targetDate).toISOString().split('T')[0]}\n`;
        context += `  Status: ${g.metrics.onTrack ? 'ON TRACK' : 'FALLING BEHIND'}. Required Monthly: $${g.metrics.requiredMonthlyContribution}, Current Monthly: $${g.monthlyContribution}\n`;
        if (g.metrics.projectedCompletionDate) {
          context += `  Projected Completion: ${new Date(g.metrics.projectedCompletionDate).toISOString().split('T')[0]}\n`;
        }
      });
    } else {
      context += `- No active financial goals set.\n`;
    }

    return context;
  } catch (error) {
    console.error("Context Generation Error:", error);
    return "Error retrieving financial context.";
  }
};