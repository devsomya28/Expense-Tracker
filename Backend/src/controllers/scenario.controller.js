import { simulateScenarios } from '../services/scenario.service.js';

export const simulate = async (req, res) => {
  try {
    const { changes } = req.body;

    if (!Array.isArray(changes) || changes.length === 0) {
      return res.status(400).json({ success: false, message: 'Changes array is required' });
    }

    // Strict validation
    for (const change of changes) {
      if (!change.type) {
        return res.status(400).json({ success: false, message: 'Change type is required' });
      }
      if (change.percentage !== undefined) {
        if (typeof change.percentage !== 'number' || change.percentage <= 0 || change.percentage > 100) {
          return res.status(400).json({ success: false, message: 'Percentage must be between 1 and 100' });
        }
      }
      if (change.amount !== undefined) {
        if (typeof change.amount !== 'number' || change.amount <= 0) {
          return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
        }
      }
    }

    const simulation = await simulateScenarios(req.user._id, changes);

    res.status(200).json({
      success: true,
      simulation
    });
  } catch (error) {
    console.error('Scenario Simulation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to simulate scenario' });
  }
};