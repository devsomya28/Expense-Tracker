import { getUserEntitlements } from '../services/subscription.service.js';
import { checkAndIncrementAiUsage } from '../services/usage.service.js';

export const requireFeature = (featureName) => {
  return async (req, res, next) => {
    try {
      const entitlements = await getUserEntitlements(req.user._id);
      
      if (!entitlements.features.includes(featureName)) {
        return res.status(403).json({ 
          success: false, 
          error: 'FEATURE_LOCKED',
          message: `This feature requires a Pro subscription.` 
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Authorization check failed' });
    }
  };
};

export const requireAiQuota = async (req, res, next) => {
  try {
    const usageData = await checkAndIncrementAiUsage(req.user._id);
    req.usageData = usageData; // Pass down for headers if needed
    next();
  } catch (error) {
    return res.status(429).json({ 
      success: false, 
      error: 'QUOTA_EXCEEDED',
      message: error.message 
    });
  }
};