import AccountModel from "../models/account.model.js";

// CREATE ACCOUNT
export const createAccountController = async (req, res) => {
  try {
    const {
      name,
      type,
      balance = 0,
    } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and account type are required",
      });
    }

    const account = await AccountModel.create({
      user: req.user.userId,
      name,
      type,
      balance,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      account,
    });
  } catch (error) {
    console.error("Create Account Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ACCOUNTS
export const getAccountsController = async (req, res) => {
  try {
    const accounts = await AccountModel.find({
      user: req.user.userId,
    });

    return res.status(200).json({
      success: true,
      accounts,
    });
  } catch (error) {
    console.error("Get Accounts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};