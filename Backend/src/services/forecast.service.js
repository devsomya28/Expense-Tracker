import Account from '../models/account.model.js';
import Expense from '../models/expense.model.js';
import Income from '../models/income.model.js';
import Recurring from '../models/recurring.model.js';

const safeDiv = (num, den) => {
  if (!den || den === 0) return 0;
  const result = num / den;
  return Number.isFinite(result) && !Number.isNaN(result) ? result : 0;
};

export const generateCashFlowForecast = async (userId, daysToForecast = 30) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const remainingDaysInMonth = daysInMonth - currentDay;

  // Determine forecast boundaries
  const forecastEnd = new Date(now);
  forecastEnd.setDate(now.getDate() + daysToForecast);

  const monthStart = new Date(currentYear, currentMonth, 1);
  const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

  const [accounts, currentExpenses, currentIncomes, prevIncomes, recurring] = await Promise.all([
    Account.find({ user: userId }).lean(),
    Expense.find({ user: userId, date: { $gte: monthStart, $lte: monthEnd } }).lean(),
    Income.find({ user: userId, date: { $gte: monthStart, $lte: monthEnd } }).lean(),
    Income.find({ user: userId, date: { $gte: new Date(currentYear, currentMonth - 1, 1), $lt: monthStart } }).lean(),
    Recurring.find({ user: userId, isActive: true }).lean()
  ]);

  // 1. Current Balance
  const currentBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // 2. Variable Spending Projection
  const totalExpenseSoFar = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const avgDailySpending = safeDiv(totalExpenseSoFar, currentDay);
  const projectedVariableExpenses = avgDailySpending * daysToForecast;

  // 3. Recurring Expenses & Income Projections
  let projectedRecurringExpenses = 0;
  let projectedIncome = 0;
  const assumptions = [
    `Average daily variable spending calculated at $${avgDailySpending.toFixed(2)} based on current month.`
  ];

  // Evaluate recurring items due within the next X days
  recurring.forEach(item => {
    // Assuming a 'type' field ('expense' or 'income') and a 'dayOfMonth' field exists
    // If dayOfMonth is missing, we conservatively assume it hits once in the forecast period
    const dayDue = item.dayOfMonth || 15; 
    const isDueThisMonth = dayDue >= currentDay;
    const isDueNextMonth = forecastEnd.getMonth() !== currentMonth && dayDue <= forecastEnd.getDate();

    const occurrenceCount = (isDueThisMonth ? 1 : 0) + (isDueNextMonth ? 1 : 0);

    if (item.type === 'income') {
      projectedIncome += item.amount * occurrenceCount;
    } else {
      projectedRecurringExpenses += item.amount * occurrenceCount;
    }
  });

  // Fallback for income if no recurring income exists
  if (projectedIncome === 0) {
    const prevMonthTotalIncome = prevIncomes.reduce((sum, i) => sum + i.amount, 0);
    const currentTotalIncome = currentIncomes.reduce((sum, i) => sum + i.amount, 0);
    if (prevMonthTotalIncome > currentTotalIncome) {
      projectedIncome = prevMonthTotalIncome - currentTotalIncome;
      assumptions.push("Projected income based on previous month's historical shortfall.");
    }
  }

  if (projectedRecurringExpenses > 0) assumptions.push(`Included active recurring expenses due within the next ${daysToForecast} days.`);

  // 4. Projected Balance
  const projectedMonthEndBalance = currentBalance + projectedIncome - projectedRecurringExpenses - projectedVariableExpenses;

  // 5. Daily Projection Array (for charts)
  const dailyProjection = [];
  let runningBalance = currentBalance;
  const dailyNetRecurring = safeDiv((projectedIncome - projectedRecurringExpenses), daysToForecast); // Smoothed for visualization

  for (let i = 1; i <= daysToForecast; i++) {
    const projDate = new Date(now);
    projDate.setDate(now.getDate() + i);
    
    runningBalance = runningBalance + dailyNetRecurring - avgDailySpending;
    
    dailyProjection.push({
      date: projDate.toISOString().split('T')[0],
      balance: Number(runningBalance.toFixed(2))
    });
  }

  // 6. Status & Confidence
  let status = 'STABLE';
  if (projectedMonthEndBalance < 0) status = 'RISK';
  else if (projectedMonthEndBalance < (currentBalance * 0.15)) status = 'WATCH'; // Less than 15% buffer

  let confidence = 'HIGH';
  if (currentDay < 5) confidence = 'LOW'; // Not enough days to establish a strong daily average
  else if (currentDay < 15) confidence = 'MEDIUM';

  return {
    currentBalance: Number(currentBalance.toFixed(2)),
    projectedIncome: Number(projectedIncome.toFixed(2)),
    projectedRecurringExpenses: Number(projectedRecurringExpenses.toFixed(2)),
    projectedVariableExpenses: Number(projectedVariableExpenses.toFixed(2)),
    projectedMonthEndBalance: Number(projectedMonthEndBalance.toFixed(2)),
    confidence,
    status,
    dailyProjection,
    assumptions
  };
};