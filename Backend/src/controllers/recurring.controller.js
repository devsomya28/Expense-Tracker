import RecurringModel from "../models/recurring.model.js";

// =========================
// CREATE RECURRING EXPENSE
// =========================

export const createRecurringController = async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      paymentMethod,
      frequency,
      nextDueDate,
    } = req.body;

    if (
      !title ||
      !amount ||
      !category ||
      !paymentMethod ||
      !frequency ||
      !nextDueDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All recurring expense fields are required",
      });
    }

    const recurringExpense = await RecurringModel.create({
      user: req.user.userId,
      title,
      amount,
      category,
      paymentMethod,
      frequency,
      nextDueDate,
    });

    return res.status(201).json({
      success: true,
      message: "Recurring expense created",
      recurringExpense,
    });
  } catch (error) {
    console.error("Create Recurring Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// GET RECURRING EXPENSES
// =========================

export const getRecurringController = async (req, res) => {
  try {
    const recurringExpenses = await RecurringModel.find({
      user: req.user.userId,
    }).sort({ nextDueDate: 1 });

    return res.status(200).json({
      success: true,
      recurringExpenses,
    });
  } catch (error) {
    console.error("Get Recurring Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// DELETE RECURRING EXPENSE
// =========================

export const deleteRecurringController = async (req, res) => {
  try {
    const { id } = req.params;

    const recurringExpense =
      await RecurringModel.findOneAndDelete({
        _id: id,
        user: req.user.userId,
      });

    if (!recurringExpense) {
      return res.status(404).json({
        success: false,
        message: "Recurring expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recurring expense deleted",
    });
  } catch (error) {
    console.error("Delete Recurring Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};