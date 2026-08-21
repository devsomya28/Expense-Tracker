import { SCORING_WEIGHTS, getStatusLabel } from '../config/scoring.constants.js';

const clamp = (val, min = 0, max = 100) => Math.max(min, Math.min(max, val));

const calculateBudgetDiscipline = (intelligence, reasons) => {
  const { utilizationPercentage, total } = intelligence.budget;
  if (total === 0) {
    reasons.push({ type: 'Budget', direction: 'neutral', impact: 'No budget set for the month.', value: 0 });
    return 50; // Neutral if no budget exists
  }

  let score = 100;
  if (utilizationPercentage > 80 && utilizationPercentage <= 100) {
    score = 100 - ((utilizationPercentage - 80) * 2.5); // Scales 100 to 50
  } else if (utilizationPercentage > 100) {
    score = 50 - ((utilizationPercentage - 100) * 2.5); // Scales 50 to 0
  }

  if (utilizationPercentage <= 80) {
    reasons.push({ type: 'Budget', direction: 'positive', impact: 'Excellent budget discipline.', value: utilizationPercentage });
  } else if (utilizationPercentage > 100) {
    reasons.push({ type: 'Budget', direction: 'negative', impact: 'Budget exceeded.', value: utilizationPercentage });
  }
  return clamp(score);
};

const calculateSavingsScore = (intelligence, reasons) => {
  const { rate } = intelligence.savings;
  const { current: income } = intelligence.income;
  
  if (income === 0) {
    reasons.push({ type: 'Savings', direction: 'negative', impact: 'No income logged this month.', value: 0 });
    return 0;
  }

  let score = 0;
  if (rate >= 20) score = 100;
  else if (rate >= 0) score = rate * 5; // Scales 0%->0 to 20%->100

  if (rate >= 20) {
    reasons.push({ type: 'Savings', direction: 'positive', impact: 'High savings rate.', value: rate });
  } else if (rate < 5) {
    reasons.push({ type: 'Savings', direction: 'negative', impact: 'Critically low savings rate.', value: rate });
  }
  return clamp(score);
};

const calculateSpendingStability = (intelligence, reasons) => {
  const { expenseMomChangePercentage: momChange } = intelligence.trends;
  const { previous } = intelligence.expenses;

  if (previous === 0) return 50; // Neutral if no previous data

  let score = 100;
  if (momChange > 0 && momChange <= 20) score = 100 - (momChange * 5); // Scales 0%->100 to 20%->0
  else if (momChange > 20) score = 0;

  if (momChange <= 0) {
    reasons.push({ type: 'Stability', direction: 'positive', impact: 'Spending is lower than last month.', value: momChange });
  } else if (momChange > 15) {
    reasons.push({ type: 'Stability', direction: 'negative', impact: 'High month-over-month spending increase.', value: momChange });
  }
  return clamp(score);
};

const calculateRecurringBurden = (intelligence, reasons) => {
  const { burdenToIncomeRatio: burden } = intelligence.recurring;
  const { current: income } = intelligence.income;

  if (income === 0 || burden === 0) return 50; 

  let score = 100;
  if (burden > 30 && burden <= 60) score = 100 - ((burden - 30) * 3.33); // Scales 30%->100 to 60%->0
  else if (burden > 60) score = 0;

  if (burden <= 25) {
    reasons.push({ type: 'Recurring', direction: 'positive', impact: 'Low fixed recurring expenses.', value: burden });
  } else if (burden >= 50) {
    reasons.push({ type: 'Recurring', direction: 'negative', impact: 'High recurring financial burden.', value: burden });
  }
  return clamp(score);
};

const calculateCashflowScore = (intelligence, reasons) => {
  const { expenseToIncomeRatio: e2i } = intelligence.trends;
  const { current: income } = intelligence.income;

  if (income === 0) return 0;

  let score = 100;
  if (e2i > 80 && e2i <= 100) score = 100 - ((e2i - 80) * 5); // Scales 80%->100 to 100%->0
  else if (e2i > 100) score = 0;

  if (e2i <= 70) {
    reasons.push({ type: 'Cashflow', direction: 'positive', impact: 'Healthy cashflow position.', value: e2i });
  } else if (e2i >= 90) {
    reasons.push({ type: 'Cashflow', direction: 'negative', impact: 'Tight cashflow, expenses almost exceed income.', value: e2i });
  }
  return clamp(score);
};

export const calculateFinancialHealthScore = (intelligence) => {
  const reasons = [];

  const budgetDiscipline = calculateBudgetDiscipline(intelligence, reasons);
  const savingsRate = calculateSavingsScore(intelligence, reasons);
  const spendingStability = calculateSpendingStability(intelligence, reasons);
  const recurringBurden = calculateRecurringBurden(intelligence, reasons);
  const cashflow = calculateCashflowScore(intelligence, reasons);

  const rawScore = 
    (budgetDiscipline * SCORING_WEIGHTS.BUDGET_DISCIPLINE) +
    (savingsRate * SCORING_WEIGHTS.SAVINGS_RATE) +
    (spendingStability * SCORING_WEIGHTS.SPENDING_STABILITY) +
    (recurringBurden * SCORING_WEIGHTS.RECURRING_BURDEN) +
    (cashflow * SCORING_WEIGHTS.CASHFLOW);

  const score = Math.round(clamp(rawScore));
  
  // Sort reasons: negative first, then positive
  reasons.sort((a, b) => a.direction === 'negative' ? -1 : 1);

  return {
    score,
    status: getStatusLabel(score),
    dimensions: {
      budgetDiscipline: Math.round(budgetDiscipline),
      savingsRate: Math.round(savingsRate),
      spendingStability: Math.round(spendingStability),
      recurringBurden: Math.round(recurringBurden),
      cashflow: Math.round(cashflow)
    },
    reasons
  };
};