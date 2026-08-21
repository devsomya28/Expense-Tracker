import { getFinancialIntelligence } from '../services/financial-intelligence.service.js';
import { calculateFinancialHealthScore } from '../services/health-score.service.js';

export const getOverview = async (req, res) => {
  try {
    const intelligence = await getFinancialIntelligence(req.user._id);
    res.status(200).json({ success: true, overview: intelligence });
  } catch (error) {
    console.error('Intelligence Overview Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch financial overview' });
  }
};

export const getHealthScore = async (req, res) => {
  try {
    const intelligence = await getFinancialIntelligence(req.user._id);
    const healthScore = calculateFinancialHealthScore(intelligence);
    
    res.status(200).json({
      success: true,
      health: healthScore
    });
  } catch (error) {
    console.error('Health Score Error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate health score' });
  }
};