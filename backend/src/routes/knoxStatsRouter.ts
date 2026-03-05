import express from 'express';
import { KnoxStatsController } from '../controllers/knoxStatsController.js';
import authMiddleware from '../controllers/authMiddleware.js';

const router = express.Router();

router.get("/trend", authMiddleware, KnoxStatsController.getTrendMessage);

router.get("/month", authMiddleware, KnoxStatsController.getMonthlyBestPerDay);

router.get('/:statId', KnoxStatsController.getStat);
router.post('/', KnoxStatsController.saveStat);

export default router;