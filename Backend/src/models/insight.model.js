import mongoose from 'mongoose';
import { INSIGHT_TYPES, INSIGHT_SEVERITY, INSIGHT_STATUS } from '../config/insight.constants.js';

const insightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: Object.values(INSIGHT_TYPES),
    required: true
  },
  severity: {
    type: String,
    enum: Object.values(INSIGHT_SEVERITY),
    default: INSIGHT_SEVERITY.INFO
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String, // e.g., 'Food', 'General'
  },
  amount: {
    type: Number,
  },
  percentage: {
    type: Number,
  },
  metadata: {
    month: Number,
    year: Number,
    hash: String // Used to prevent duplicates (e.g., "BUDGET_RISK_8_2026")
  },
  status: {
    type: String,
    enum: Object.values(INSIGHT_STATUS),
    default: INSIGHT_STATUS.ACTIVE,
    index: true
  },
  expiresAt: {
    type: Date
  }
}, { timestamps: true });

// Compound index for fast fetching and duplicate prevention
insightSchema.index({ user: 1, status: 1, 'metadata.hash': 1 });

export default mongoose.model('FinancialInsight', insightSchema);