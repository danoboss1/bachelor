import express from 'express';
import { TolStatsController } from '../controllers/tolStatsController.js';

const router = express.Router();

router.get(':/statId', TolStatsController.getStat);
router.post('/', TolStatsController.saveStat);

export default router;