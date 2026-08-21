import Usage from '../models/usage.model.js';
import { getUserEntitlements } from './subscription.service.js';

export const checkAndIncrementAiUsage = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  const { limits } = await getUserEntitlements(userId);
  
  const usage = await Usage.findOneAndUpdate(
    { user: userId, feature: 'AI_REQUEST', date: today },
    { $setOnInsert: { count: 0 } },
    { new: true, upsert: true }
  );

  if (usage.count >= limits.aiDaily) {
    throw new Error(`AI Request limit reached. Your plan allows ${limits.aiDaily} requests per day.`);
  }

  usage.count += 1;
  await usage.save();
  
  return { used: usage.count, limit: limits.aiDaily };
};

export const getAiUsage = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  const usage = await Usage.findOne({ user: userId, feature: 'AI_REQUEST', date: today }).lean();
  return usage ? usage.count : 0;
};