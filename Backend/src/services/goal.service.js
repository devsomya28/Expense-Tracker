import Goal from '../models/goal.model.js';
import { GOAL_STATUS } from '../config/goal.constants.js';

const safeDiv = (num, den) => {
  if (!den || den === 0) return 0;
  const result = num / den;
  return Number.isFinite(result) && !Number.isNaN(result) ? result : 0;
};

const calculateGoalMetrics = (goal) => {
  const now = new Date();
  const targetDate = new Date(goal.targetDate);
  
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
  const progressPercentage = Math.min(100, safeDiv(goal.currentAmount, goal.targetAmount) * 100);
  
  // Calculate months remaining safely
  let monthsRemaining = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());
  if (targetDate.getDate() < now.getDate()) monthsRemaining--; // Adjust for partial month
  monthsRemaining = Math.max(0, monthsRemaining);

  const requiredMonthlyContribution = monthsRemaining > 0 ? safeDiv(remainingAmount, monthsRemaining) : remainingAmount;
  
  let projectedCompletionDate = null;
  if (goal.monthlyContribution > 0) {
    const monthsRequired = Math.ceil(safeDiv(remainingAmount, goal.monthlyContribution));
    projectedCompletionDate = new Date(now.getFullYear(), now.getMonth() + monthsRequired, now.getDate());
  }

  const isOverdue = targetDate < now && remainingAmount > 0;
  const onTrack = !isOverdue && (goal.monthlyContribution >= requiredMonthlyContribution || remainingAmount === 0);

  return {
    ...goal,
    metrics: {
      remainingAmount: Number(remainingAmount.toFixed(2)),
      progressPercentage: Number(progressPercentage.toFixed(2)),
      monthsRemaining,
      requiredMonthlyContribution: Number(requiredMonthlyContribution.toFixed(2)),
      projectedCompletionDate,
      isOverdue,
      onTrack
    }
  };
};

export const getUserGoals = async (userId) => {
  const goals = await Goal.find({ user: userId }).sort({ targetDate: 1 }).lean();
  return goals.map(calculateGoalMetrics);
};

export const getGoalById = async (userId, goalId) => {
  const goal = await Goal.findOne({ _id: goalId, user: userId }).lean();
  if (!goal) throw new Error('Goal not found');
  return calculateGoalMetrics(goal);
};

export const createGoal = async (userId, data) => {
  const goal = await Goal.create({ ...data, user: userId });
  return calculateGoalMetrics(goal.toObject());
};

export const updateGoal = async (userId, goalId, data) => {
  const goal = await Goal.findOneAndUpdate({ _id: goalId, user: userId }, data, { new: true }).lean();
  if (!goal) throw new Error('Goal not found');
  return calculateGoalMetrics(goal);
};

export const deleteGoal = async (userId, goalId) => {
  const result = await Goal.findOneAndDelete({ _id: goalId, user: userId });
  if (!result) throw new Error('Goal not found');
  return true;
};