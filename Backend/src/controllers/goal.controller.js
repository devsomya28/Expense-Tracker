import * as goalService from '../services/goal.service.js';

export const getGoals = async (req, res) => {
  try {
    const goals = await goalService.getUserGoals(req.user._id);
    res.status(200).json({ success: true, goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGoal = async (req, res) => {
  try {
    const goal = await goalService.getGoalById(req.user._id, req.params.id);
    res.status(200).json({ success: true, goal });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const createGoal = async (req, res) => {
  try {
    const goal = await goalService.createGoal(req.user._id, req.body);
    res.status(201).json({ success: true, goal });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create goal' });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await goalService.updateGoal(req.user._id, req.params.id, req.body);
    res.status(200).json({ success: true, goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    await goalService.deleteGoal(req.user._id, req.params.id);
    res.status(200).json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};