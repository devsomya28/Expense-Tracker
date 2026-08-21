import mongoose from "mongoose";

const recurringSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
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

    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      default: "Monthly",
    },

    nextDueDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const RecurringModel = mongoose.model(
  "RecurringExpense",
  recurringSchema
);

export default RecurringModel;