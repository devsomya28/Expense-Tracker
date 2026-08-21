import mongoose from 'mongoose';
import { GOAL_STATUS } from '../config/goal.constants.js';

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true, min: 1 },
  currentAmount: { type: Number, default: 0, min: 0 },
  targetDate: { type: Date, required: true },
  monthlyContribution: { type: Number, default: 0, min: 0 },
  category: { type: String, default: 'General' },
  status: {
    type: String,
    enum: Object.values(GOAL_STATUS),
    default: GOAL_STATUS.ACTIVE,
    index: true
  }
}, { timestamps: true });

export default mongoose.model('FinancialGoal', goalSchema);