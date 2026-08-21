import mongoose from 'mongoose';
import { PLANS, SUB_STATUS } from '../config/subscription.constants.js';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: Object.values(PLANS),
    default: PLANS.FREE
  },
  status: {
    type: String,
    enum: Object.values(SUB_STATUS),
    default: SUB_STATUS.ACTIVE
  },
  startedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  trialEndsAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);