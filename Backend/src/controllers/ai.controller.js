import ExpenseModel from "../models/expense.model.js";
import IncomeModel from "../models/income.model.js";
import BudgetModel from "../models/budget.model.js";
import RecurringModel from "../models/recurring.model.js";
import { answerFinancialQuestion } from '../ai/services/financial-question.service.js';
import { parseExpenseText } from '../ai/services/expense-parser.service.js';

import {
  analyzeSpending,
} from "../ai/services/spending-analysis.service.js";

import {
  buildFinancialContext as getFinancialContext,
} from "../ai/services/financial-context.service.js";


export const analyzeFinancialSpendingController = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;

    const now = new Date();

    // Current month
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

    // Previous month
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

    // Current month expenses
    const currentExpenses = await ExpenseModel.find({
      user: userId,
      date: {
        $gte: currentMonthStart,
        $lt: currentMonthEnd,
      },
    });

    // Previous month expenses
    const previousExpenses = await ExpenseModel.find({
      user: userId,
      date: {
        $gte: previousMonthStart,
        $lt: previousMonthEnd,
      },
    });

    // Current month income
    const income = await IncomeModel.find({
      user: userId,
      date: {
        $gte: currentMonthStart,
        $lt: currentMonthEnd,
      },
    });

    // Budget
    const budget = await BudgetModel.findOne({
      user: userId,
    });

    // Recurring expenses
    const recurringExpenses =
      await RecurringModel.find({
        user: userId,
        isActive: true,
      });

    const currentTotal = currentExpenses.reduce(
      (total, expense) =>
        total + expense.amount,
      0
    );

    const previousTotal = previousExpenses.reduce(
      (total, expense) =>
        total + expense.amount,
      0
    );

    const totalIncome = income.reduce(
      (total, item) =>
        total + item.amount,
      0
    );

    const categorySpending = {};

    for (const expense of currentExpenses) {
      if (!categorySpending[expense.category]) {
        categorySpending[expense.category] = 0;
      }

      categorySpending[expense.category] +=
        expense.amount;
    }

    const spendingChange =
      previousTotal > 0
        ? ((currentTotal - previousTotal) /
            previousTotal) *
          100
        : 0;

    const financialData = {
      currentMonth: {
        totalExpenses: currentTotal,
        transactionCount:
          currentExpenses.length,
        categorySpending,
      },

      previousMonth: {
        totalExpenses: previousTotal,
        transactionCount:
          previousExpenses.length,
      },

      spendingChange: Number(
        spendingChange.toFixed(2)
      ),

      income: {
        total: totalIncome,
      },

      savings: {
        amount:
          totalIncome - currentTotal,
      },

      budget: {
        monthlyBudget:
          budget?.monthlyBudget || 0,
        remaining:
          (budget?.monthlyBudget || 0) -
          currentTotal,
      },

      recurringExpenses:
        recurringExpenses.map((item) => ({
          title: item.title,
          amount: item.amount,
          frequency: item.frequency,
          category: item.category,
        })),

      expenses: currentExpenses.map(
        (expense) => ({
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          paymentMethod:
            expense.paymentMethod,
        })
      ),
    };

    const analysis = await analyzeSpending(
      financialData
    );

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error(
      "AI Financial Analysis Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to analyze financial data",
    });
  }
};


export const askFinancialQuestionController = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;

    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      return res.status(400).json({
        success: false,
        message: "Question cannot be empty",
      });
    }

    if (trimmedQuestion.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Question is too long",
      });
    }

    // Get ONLY this user's financial data (kept for parity with
    // askQuestion's context-gathering; answerFinancialQuestion gathers
    // its own data internally)
    await getFinancialContext(userId);

    // Ask AI
    const answer = await answerFinancialQuestion(
      userId,
      trimmedQuestion
    );

    return res.status(200).json({
      success: true,
      question: trimmedQuestion,
      answer,
    });
  } catch (error) {
    console.error(
      "AI Financial Question Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to answer financial question",
    });
  }
};

export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ success: false, message: "Question is required" });

    const response = await answerFinancialQuestion(req.user._id, question);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to process question" });
  }
};

export const parseExpense = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Text is required" });

    const parsedData = await parseExpenseText(text);
    res.status(200).json({ success: true, parsedData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to parse text" });
  }
};