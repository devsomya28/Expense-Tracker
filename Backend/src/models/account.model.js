import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Cash",
        "Bank Account",
        "UPI",
        "Credit Card",
      ],
      required: true,
    },

    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const AccountModel = mongoose.model(
  "Account",
  accountSchema
);

export default AccountModel;