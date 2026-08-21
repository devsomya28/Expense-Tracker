import express from 'express';
import { getForecast } from '../controllers/forecast.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireFeature } from '../middleware/entitlement.middleware.js';

const router = express.Router();

router.get('/', protect, requireFeature('forecast'), getForecast);

export default router;