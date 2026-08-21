import SplitModel from "../models/split.model.js";

// =========================
// CREATE SPLIT
// =========================

export const createSplitController = async (
  req,
  res
) => {
  try {
    const {
      title,
      totalAmount,
      participants,
    } = req.body;

    if (
      !title ||
      !totalAmount ||
      !participants ||
      participants.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, total amount and participants are required",
      });
    }

    const participantTotal = participants.reduce(
      (total, participant) =>
        total + participant.amount,
      0
    );

    if (participantTotal !== Number(totalAmount)) {
      return res.status(400).json({
        success: false,
        message:
          "Participant amounts must equal total amount",
      });
    }

    const split = await SplitModel.create({
      user: req.user.userId,
      title,
      totalAmount,
      participants,
    });

    return res.status(201).json({
      success: true,
      message: "Expense split created",
      split,
    });
  } catch (error) {
    console.error("Create Split Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// GET SPLITS
// =========================

export const getSplitsController = async (
  req,
  res
) => {
  try {
    const splits = await SplitModel.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      splits,
    });
  } catch (error) {
    console.error("Get Splits Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};