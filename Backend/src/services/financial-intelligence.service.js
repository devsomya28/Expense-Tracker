import Expense from '../models/expense.model.js';
import Income from '../models/income.model.js';
import Budget from '../models/budget.model.js';
import Recurring from '../models/recurring.model.js';

/**
 * Safely divide two numbers preventing Infinity and NaN
 */
const safeDiv = (num, den) => {
  if (!den || den === 0) return 0;
  const result = num / den;
  return Number.isFinite(result) && !Number.isNaN(result) ? result : 0;
};

export const getFinancialIntelligence = async (userId) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const daysInMonth = currentMonthEnd.getDate();
  const currentDay = now.getDate();
  const daysRemaining = daysInMonth - currentDay || 1; // Prevent div by 0 on last day

  // Parallel data fetching for performance
  const [
    currentExpenses, prevExpenses, 
    currentIncomes, prevIncomes, 
    budgets, recurring
  ] = await Promise.all([
    Expense.find({ user: userId, date: { $gte: currentMonthStart, $lte: currentMonthEnd } }).lean(),
    Expense.find({ user: userId, date: { $gte: prevMonthStart, $lte: prevMonthEnd } }).lean(),
    Income.find({ user: userId, date: { $gte: currentMonthStart, $lte: currentMonthEnd } }).lean(),
    Income.find({ user: userId, date: { $gte: prevMonthStart, $lte: prevMonthEnd } }).lean(),
    Budget.find({ user: userId }).lean(),
    Recurring.find({ user: userId, isActive: true }).lean()
  ]);

  // Aggregations
  const totalExpense = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPrevExpense = prevExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = currentIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalPrevIncome = prevIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyBudget, 0);
  const totalRecurring = recurring.reduce((sum, r) => sum + r.amount, 0);

  // Category Breakdown
  const categories = currentExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const categoryPercentages = {};
  for (const [cat, amt] of Object.entries(categories)) {
    categoryPercentages[cat] = Number((safeDiv(amt, totalExpense) * 100).toFixed(2));
  }

  // Derived Deterministic Facts
  const savings = totalIncome - totalExpense;
  const savingsRate = safeDiv(savings, totalIncome) * 100;
  const budgetUtilization = safeDiv(totalExpense, totalBudget) * 100;
  const remainingBudget = totalBudget - totalExpense;
  const expenseToIncome = safeDiv(totalExpense, totalIncome) * 100;
  const momChange = totalPrevExpense > 0 ? safeDiv((totalExpense - totalPrevExpense), totalPrevExpense) * 100 : 0;
  
  const avgDailySpending = safeDiv(totalExpense, currentDay);
  const remainingDailyAllowance = remainingBudget > 0 ? safeDiv(remainingBudget, daysRemaining) : 0;

  // Basic Anomaly & Risk Detection
  const riskIndicators = [];
  if (totalExpense > totalIncome && totalIncome > 0) riskIndicators.push("Spending exceeds income");
  if (budgetUtilization > 100) riskIndicators.push("Overall budget exceeded");
  if (savingsRate < 5 && totalIncome > 0) riskIndicators.push("Savings rate critically low");
  if (totalRecurring > totalIncome * 0.6) riskIndicators.push("High fixed recurring burden (>60%)");

  return {
    period: {
      month: now.toLocaleString('default', { month: 'long' }),
      year: now.getFullYear(),
      daysInMonth,
      currentDay,
      daysRemaining
    },
    income: {
      current: totalIncome,
      previous: totalPrevIncome,
      momChange: totalPrevIncome > 0 ? safeDiv((totalIncome - totalPrevIncome), totalPrevIncome) * 100 : 0
    },
    expenses: {
      current: totalExpense,
      previous: totalPrevExpense,
      avgDailySpending: Number(avgDailySpending.toFixed(2))
    },
    savings: {
      amount: savings,
      rate: Number(savingsRate.toFixed(2))
    },
    budget: {
      total: totalBudget,
      utilized: totalExpense,
      remaining: remainingBudget,
      utilizationPercentage: Number(budgetUtilization.toFixed(2)),
      remainingDailyAllowance: Number(remainingDailyAllowance.toFixed(2))
    },
    recurring: {
      totalMonthlyBurden: totalRecurring,
      burdenToIncomeRatio: Number((safeDiv(totalRecurring, totalIncome) * 100).toFixed(2))
    },
    categories: {
      totals: categories,
      percentages: categoryPercentages
    },
    trends: {
      expenseMomChangePercentage: Number(momChange.toFixed(2)),
      expenseToIncomeRatio: Number(expenseToIncome.toFixed(2))
    },
    riskIndicators
  };
};