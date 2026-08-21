import express from 'express';
import * as goalController from '../controllers/goal.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireFeature } from '../middleware/entitlement.middleware.js'; // From Phase 7

const router = express.Router();

router.use(protect);
router.use(requireFeature('financial_goals')); // SaaS Lock

router.route('/')
  .get(goalController.getGoals)
  .post(goalController.createGoal);

router.route('/:id')
  .get(goalController.getGoal)
  .put(goalController.updateGoal)
  .delete(goalController.deleteGoal);

export default router;