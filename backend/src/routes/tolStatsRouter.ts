import express from 'express';
import { TolStatsController } from '../controllers/tolStatsController.js';

const router = express.Router();

router.get(':/userId', TolStatsController.getStat);
router.post('/', TolStatsController.saveStat);

export default router;