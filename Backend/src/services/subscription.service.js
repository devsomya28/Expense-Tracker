import Subscription from '../models/subscription.model.js';
import { PLANS, SUB_STATUS, ENTITLEMENTS, AI_LIMITS } from '../config/subscription.constants.js';

export const getUserSubscription = async (userId) => {
  const sub = await Subscription.findOne({ user: userId }).lean();
  
  // Implicit FREE plan for existing users without a document
  if (!sub || sub.status !== SUB_STATUS.ACTIVE) {
    return { plan: PLANS.FREE, status: SUB_STATUS.ACTIVE };
  }
  return sub;
};

export const getUserEntitlements = async (userId) => {
  const sub = await getUserSubscription(userId);
  return {
    plan: sub.plan,
    features: ENTITLEMENTS[sub.plan] || ENTITLEMENTS[PLANS.FREE],
    limits: { aiDaily: AI_LIMITS[sub.plan] || AI_LIMITS[PLANS.FREE] }
  };
};

export const devUpgradeToPro = async (userId) => {
  // DEV ONLY: Upsert PRO subscription
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  return await Subscription.findOneAndUpdate(
    { user: userId },
    { 
      plan: PLANS.PRO, 
      status: SUB_STATUS.ACTIVE,
      expiresAt 
    },
    { new: true, upsert: true }
  );
};