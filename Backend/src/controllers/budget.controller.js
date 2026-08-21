import BudgetModel from "../models/budget.model.js";

// =========================
// SET MONTHLY BUDGET
// =========================

export const setMonthlyBudgetController = async (
  req,
  res
) => {
  try {
    const { monthlyBudget } = req.body;

    if (
      monthlyBudget === undefined ||
      monthlyBudget < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid monthly budget is required",
      });
    }

    const budget = await BudgetModel.findOneAndUpdate(
      {
        user: req.user.userId,
      },
      {
        monthlyBudget,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Monthly budget updated successfully",
      budget,
    });
  } catch (error) {
    console.error(
      "Set Budget Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};