import cron from 'node-cron';
import User from '../models/user.model.js';
import { detectAndGenerateInsights } from '../services/insight-detection.service.js';

// Runs every day at 02:00 AM
export const startInsightGeneratorJob = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log('[CRON] Starting Financial Insight Generation Job...');
    try {
      // In a real production system, paginate this to prevent memory bloat
      const users = await User.find({}).select('_id').lean();
      
      for (const user of users) {
        await detectAndGenerateInsights(user._id);
      }
      console.log('[CRON] Insight Generation Job Completed.');
    } catch (error) {
      console.error('[CRON] Error in Insight Generation:', error);
    }
  });
};