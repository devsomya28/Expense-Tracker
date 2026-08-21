import ExpenseModel from "../../models/expense.model.js";
import IncomeModel from "../../models/income.model.js";
import BudgetModel from "../../models/budget.model.js";
import RecurringModel from "../../models/recurring.model.js";

export const getFinancialContext = async (userId) => {
  const now = new Date();

  const currentMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const currentMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  const previousMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const previousMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const [
    currentExpenses,
    previousExpenses,
    income,
    budget,
    recurringExpenses,
  ] = await Promise.all([
    ExpenseModel.find({
      user: userId,
      date: {
        $gte: currentMonthStart,
        $lt: currentMonthEnd,
      },
    }).lean(),

    ExpenseModel.find({
      user: userId,
      date: {
        $gte: previousMonthStart,
        $lt: previousMonthEnd,
      },
    }).lean(),

    IncomeModel.find({
      user: userId,
      date: {
        $gte: currentMonthStart,
        $lt: currentMonthEnd,
      },
    }).lean(),

    BudgetModel.findOne({
      user: userId,
    }).lean(),

    RecurringModel.find({
      user: userId,
      isActive: true,
    }).lean(),
  ]);

  const currentTotal = currentExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const previousTotal = previousExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const totalIncome = income.reduce(
    (total, item) => total + item.amount,
    0
  );

  const categorySpending = {};

  for (const expense of currentExpenses) {
    categorySpending[expense.category] =
      (categorySpending[expense.category] || 0) +
      expense.amount;
  }

  const spendingChange =
    previousTotal > 0
      ? ((currentTotal - previousTotal) /
          previousTotal) *
        100
      : null;

  return {
    period: {
      currentMonth: currentMonthStart.toISOString(),
      previousMonth: previousMonthStart.toISOString(),
    },

    currentMonth: {
      totalExpenses: currentTotal,
      transactionCount: currentExpenses.length,
      categorySpending,
    },

    previousMonth: {
      totalExpenses: previousTotal,
      transactionCount: previousExpenses.length,
    },

    spendingChange:
      spendingChange !== null
        ? Number(spendingChange.toFixed(2))
        : null,

    income: {
      total: totalIncome,
    },

    savings: {
      amount: totalIncome - currentTotal,
    },

    budget: {
      monthlyBudget: budget?.monthlyBudget || 0,
      remaining:
        (budget?.monthlyBudget || 0) - currentTotal,
    },

    recurringExpenses: recurringExpenses.map(
      (item) => ({
        title: item.title,
        amount: item.amount,
        frequency: item.frequency,
        category: item.category,
      })
    ),

    expenses: currentExpenses.map(
      (expense) => ({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        paymentMethod: expense.paymentMethod,
      })
    ),
  };
};