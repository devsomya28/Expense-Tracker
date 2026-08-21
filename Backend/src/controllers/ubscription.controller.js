import { getUserEntitlements, devUpgradeToPro } from '../services/subscription.service.js';
import { getAiUsage } from '../services/usage.service.js';

export const getMySubscription = async (req, res) => {
  try {
    const entitlements = await getUserEntitlements(req.user._id);
    const aiUsed = await getAiUsage(req.user._id);
    
    res.status(200).json({
      success: true,
      subscription: entitlements,
      usage: { aiUsed, aiLimit: entitlements.limits.aiDaily }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscription' });
  }
};

export const devUpgrade = async (req, res) => {
  try {
    await devUpgradeToPro(req.user._id);
    res.status(200).json({ success: true, message: 'Upgraded to PRO successfully (DEV MODE)' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upgrade failed' });
  }
};