import express from 'express';
import { TolStatsController } from '../controllers/tolStatsController.js';
import authMiddleware from '../controllers/authMiddleware.js';

const router = express.Router();

router.get("/trend", authMiddleware, TolStatsController.getTrendMessage);
router.get("/recentAverage", authMiddleware, TolStatsController.getRecentAverageSummary);

router.get('/month', authMiddleware, TolStatsController.getMonthlyBestPerDay);

router.get('/:statId', TolStatsController.getStat);
router.post('/', authMiddleware, TolStatsController.saveStat);

export default router;