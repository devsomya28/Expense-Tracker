import mongoose from 'mongoose';

const usageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feature: { type: String, required: true }, // e.g., 'AI_REQUEST'
  date: { type: String, required: true }, // YYYY-MM-DD
  count: { type: Number, default: 0 }
}, { timestamps: true });

// Fast lookups for daily quotas
usageSchema.index({ user: 1, feature: 1, date: 1 }, { unique: true });

export default mongoose.model('Usage', usageSchema);