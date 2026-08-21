import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Travel",
        "Shopping",
        "Bills",
        "Entertainment",
        "Other",
      ],
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: [
        "Cash",
        "UPI",
        "Credit Card",
        "Debit Card",
        "Bank Transfer",
        "Other",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const ExpenseModel = mongoose.model("Expense", expenseSchema);

export default ExpenseModel;