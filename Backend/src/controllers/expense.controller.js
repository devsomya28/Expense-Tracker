import ExpenseModel from "../models/expense.model.js";

// =========================
// ADD EXPENSE
// =========================

export const addExpenseController = async (req, res) => {
  try {
    const {
      amount,
      title,
      category,
      date,
      paymentMethod,
    } = req.body;

    // Validation
    if (
      !amount ||
      !title ||
      !category ||
      !date ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "All expense fields are required",
      });
    }

    const expense = await ExpenseModel.create({
      user: req.user.userId,
      amount,
      title,
      category,
      date,
      paymentMethod,
    });

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Add Expense Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// GET ALL EXPENSES
// =========================

// =========================
// GET ALL EXPENSES
// FILTER + PAGINATION
// =========================

// =========================
// GET ALL EXPENSES
// FILTER + DATE RANGE + PAGINATION
// =========================

export const getAllExpensesController = async (req, res) => {
  try {
    const {
      category,
      paymentMethod,
      date,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Pagination
    const currentPage = Math.max(Number(page), 1);
    const itemsPerPage = Math.max(Number(limit), 1);

    const skip = (currentPage - 1) * itemsPerPage;

    // Base filter
    const filter = {
      user: req.user.userId,
    };

    // =========================
    // CATEGORY FILTER
    // =========================

    if (category) {
      filter.category = category;
    }

    // =========================
    // PAYMENT METHOD FILTER
    // =========================

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    // =========================
    // SINGLE DATE FILTER
    // =========================

    if (date) {
      const start = new Date(date);
      const end = new Date(date);

      end.setDate(end.getDate() + 1);

      filter.date = {
        $gte: start,
        $lt: end,
      };
    }

    // =========================
    // DATE RANGE FILTER
    // =========================

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);

        // Include the entire end date
        end.setDate(end.getDate() + 1);

        filter.date.$lt = end;
      }
    }

    // =========================
    // TOTAL EXPENSES
    // =========================

    const totalExpenses = await ExpenseModel.countDocuments(filter);

    // =========================
    // GET EXPENSES
    // =========================

    const expenses = await ExpenseModel.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(itemsPerPage);

    // =========================
    // PAGINATION
    // =========================

    const totalPages = Math.ceil(
      totalExpenses / itemsPerPage
    );

    return res.status(200).json({
      success: true,

      filters: {
        category: category || null,
        paymentMethod: paymentMethod || null,
        date: date || null,
        startDate: startDate || null,
        endDate: endDate || null,
      },

      pagination: {
        currentPage,
        itemsPerPage,
        totalExpenses,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },

      expenses,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// GET SINGLE EXPENSE
// =========================

export const getSingleExpenseController = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await ExpenseModel.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error("Get Single Expense Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// EDIT EXPENSE
// =========================

export const editExpenseController = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      amount,
      title,
      category,
      date,
      paymentMethod,
    } = req.body;

    const expense = await ExpenseModel.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Update only provided fields
    if (amount !== undefined) expense.amount = amount;
    if (title !== undefined) expense.title = title;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;
    if (paymentMethod !== undefined) {
      expense.paymentMethod = paymentMethod;
    }

    await expense.save();

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error("Edit Expense Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// DELETE EXPENSE
// =========================

export const deleteExpenseController = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await ExpenseModel.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};