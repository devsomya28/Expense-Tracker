import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paid: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const splitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    participants: {
      type: [participantSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SplitModel = mongoose.model(
  "SplitExpense",
  splitSchema
);

export default SplitModel;