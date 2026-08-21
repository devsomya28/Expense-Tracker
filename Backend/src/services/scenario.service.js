import { getFinancialIntelligence } from './financial-intelligence.service.js';

export const simulateScenarios = async (userId, changes) => {
  // 1. Fetch deterministic baseline
  const intelligence = await getFinancialIntelligence(userId);
  
  const baseline = {
    income: intelligence.income.current,
    expenses: intelligence.expenses.current,
    savings: intelligence.savings.amount,
    savingsRate: intelligence.savings.rate,
    categories: { ...intelligence.categories.totals }
  };

  // 2. Clone state for hypothetical scenario
  let sIncome = baseline.income;
  let sExpenses = baseline.expenses;
  const sCategories = { ...baseline.categories };
  const appliedChanges = [];

  // 3. Process changes deterministically
  for (const change of changes) {
    let impactAmount = 0;

    switch (change.type) {
      case 'CATEGORY_REDUCTION':
      case 'CATEGORY_INCREASE': {
        const catAmount = sCategories[change.category] || 0;
        if (catAmount > 0 && change.percentage) {
          impactAmount = catAmount * (change.percentage / 100);
          if (change.type === 'CATEGORY_REDUCTION') {
            sCategories[change.category] -= impactAmount;
            sExpenses -= impactAmount;
          } else {
            sCategories[change.category] += impactAmount;
            sExpenses += impactAmount;
          }
        }
        break;
      }
      case 'TOTAL_EXPENSE_REDUCTION': {
        if (change.percentage) {
          impactAmount = sExpenses * (change.percentage / 100);
          sExpenses -= impactAmount;
        }
        break;
      }
      case 'INCOME_INCREASE': {
        if (change.amount) {
          impactAmount = change.amount;
          sIncome += impactAmount;
        }
        break;
      }
      case 'INCOME_DECREASE': {
        if (change.amount) {
          impactAmount = change.amount;
          sIncome = Math.max(0, sIncome - impactAmount); // Prevent negative income
        }
        break;
      }
      case 'RECURRING_REDUCTION': {
        if (change.amount) {
          impactAmount = change.amount;
          sExpenses = Math.max(0, sExpenses - impactAmount);
        }
        break;
      }
    }

    if (impactAmount > 0) {
      appliedChanges.push({ ...change, impactAmount: Number(impactAmount.toFixed(2)) });
    }
  }

  // 4. Calculate hypothetical results
  const sSavings = sIncome - sExpenses;
  const sSavingsRate = sIncome > 0 ? (sSavings / sIncome) * 100 : 0;

  const monthlyImprovement = sSavings - baseline.savings;
  const annualImprovement = monthlyImprovement * 12;

  return {
    baseline: {
      income: Number(baseline.income.toFixed(2)),
      expenses: Number(baseline.expenses.toFixed(2)),
      savings: Number(baseline.savings.toFixed(2)),
      savingsRate: Number(baseline.savingsRate.toFixed(2))
    },
    scenario: {
      income: Number(sIncome.toFixed(2)),
      expenses: Number(sExpenses.toFixed(2)),
      savings: Number(sSavings.toFixed(2)),
      savingsRate: Number(sSavingsRate.toFixed(2)),
      categories: sCategories
    },
    impact: {
      monthlyImprovement: Number(monthlyImprovement.toFixed(2)),
      annualImprovement: Number(annualImprovement.toFixed(2))
    },
    changes: appliedChanges
  };
};