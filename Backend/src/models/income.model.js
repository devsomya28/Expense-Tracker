import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
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

    source: {
      type: String,
      enum: [
        "Salary",
        "Freelancing",
        "Other",
      ],
      required: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  {
    timestamps: true,
  }
);

const IncomeModel = mongoose.model(
  "Income",
  incomeSchema
);

export default IncomeModel;