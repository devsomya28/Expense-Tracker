import IncomeModel from "../models/income.model.js";

// ADD INCOME
export const addIncomeController = async (req, res) => {
  try {
    const {
      amount,
      title,
      source,
      date,
      account,
    } = req.body;

    if (!amount || !title || !source) {
      return res.status(400).json({
        success: false,
        message: "Amount, title and source are required",
      });
    }

    const income = await IncomeModel.create({
      user: req.user.userId,
      amount,
      title,
      source,
      date,
      account,
    });

    return res.status(201).json({
      success: true,
      message: "Income added successfully",
      income,
    });
  } catch (error) {
    console.error("Add Income Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ALL INCOME
export const getIncomeController = async (req, res) => {
  try {
    const income = await IncomeModel.find({
      user: req.user.userId,
    }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      income,
    });
  } catch (error) {
    console.error("Get Income Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};