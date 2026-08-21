import ExpenseModel from "../models/expense.model.js";
import BudgetModel from "../models/budget.model.js";

// =========================
// FINANCIAL ANALYTICS
// =========================

export const getFinancialAnalyticsController = async (req, res) => {
  try {
    const userId = req.user.userId;

    // =========================
    // DATE SETUP
    // =========================

    const now = new Date();

    // Current month
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    // Current week
    const weekStart = new Date(now);

    const day = weekStart.getDay();

    weekStart.setDate(
      weekStart.getDate() - day
    );

    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);

    weekEnd.setDate(
      weekEnd.getDate() + 7
    );

    // =========================
    // MONTHLY EXPENSES
    // =========================

    const monthlyExpenses = await ExpenseModel.find({
      user: userId,
      date: {
        $gte: monthStart,
        $lt: monthEnd,
      },
    });

    // =========================
    // MONTHLY TOTAL
    // =========================

    const monthlyTotal = monthlyExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    // =========================
    // WEEKLY EXPENSES
    // =========================

    const weeklyExpenses = await ExpenseModel.find({
      user: userId,
      date: {
        $gte: weekStart,
        $lt: weekEnd,
      },
    });

    const weeklyTotal = weeklyExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    // =========================
    // CATEGORY-WISE SPENDING
    // =========================

    const categorySpending = await ExpenseModel.aggregate([
      {
        $match: {
          user: monthlyExpenses.length
            ? monthlyExpenses[0].user
            : userId,
          date: {
            $gte: monthStart,
            $lt: monthEnd,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);

    // =========================
    // HIGHEST EXPENSE
    // =========================

    const highestExpense = await ExpenseModel.findOne({
      user: userId,
      date: {
        $gte: monthStart,
        $lt: monthEnd,
      },
    }).sort({
      amount: -1,
    });

    // =========================
    // AVERAGE EXPENSE
    // =========================

    const averageExpense =
      monthlyExpenses.length > 0
        ? monthlyTotal / monthlyExpenses.length
        : 0;

    // =========================
    // DAILY SPENDING
    // =========================

    const dailySpending = await ExpenseModel.aggregate([
      {
        $match: {
          user: monthlyExpenses.length
            ? monthlyExpenses[0].user
            : userId,
          date: {
            $gte: monthStart,
            $lt: monthEnd,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },

          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // =========================
    // MONTHLY BUDGET
    // =========================

    const budget = await BudgetModel.findOne({
      user: userId,
    });

    const monthlyBudget = budget
      ? budget.monthlyBudget
      : 0;

    // =========================
    // BUDGET REMAINING
    // =========================

    const budgetRemaining =
      monthlyBudget - monthlyTotal;

    // =========================
    // BUDGET EXCEEDED
    // =========================

    const budgetExceeded =
      monthlyTotal > monthlyBudget &&
      monthlyBudget > 0;

    return res.status(200).json({
      success: true,

      analytics: {
        monthlyTotal,
        weeklyTotal,

        categorySpending,

        highestExpense,

        averageExpense: Number(
          averageExpense.toFixed(2)
        ),

        dailySpending,

        monthlyBudget,

        budgetRemaining,

        budgetExceeded,

        budgetExceededAmount: budgetExceeded
          ? monthlyTotal - monthlyBudget
          : 0,
      },
    });
  } catch (error) {
    console.error(
      "Financial Analytics Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};