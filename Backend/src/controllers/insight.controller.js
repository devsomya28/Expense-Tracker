import Insight from '../models/insight.model.js';
import { INSIGHT_STATUS, SEVERITY_WEIGHT } from '../config/insight.constants.js';

export const getActiveInsights = async (req, res) => {
  try {
    const insights = await Insight.find({ 
      user: req.user._id, 
      status: INSIGHT_STATUS.ACTIVE 
    }).lean();

    // Sort by severity (CRITICAL first, INFO last) and then by date
    insights.sort((a, b) => {
      if (SEVERITY_WEIGHT[a.severity] !== SEVERITY_WEIGHT[b.severity]) {
        return SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({ success: true, insights });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch insights' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Insight.countDocuments({ 
      user: req.user._id, 
      status: INSIGHT_STATUS.ACTIVE 
    });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch count' });
  }
};

export const updateInsightStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'DISMISSED' or 'RESOLVED'

  try {
    if (![INSIGHT_STATUS.DISMISSED, INSIGHT_STATUS.RESOLVED].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const insight = await Insight.findOneAndUpdate(
      { _id: id, user: req.user._id }, // Strict scoping
      { status },
      { new: true }
    );

    if (!insight) return res.status(404).json({ success: false, message: 'Insight not found' });

    res.status(200).json({ success: true, insight });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update insight' });
  }
};