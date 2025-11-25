import express from 'express';
import { StatsController } from '../controllers/wcstStatsController.js';

const router = express.Router();

router.get('/:statId', StatsController.getStat);
router.post('/', StatsController.saveStat);

export default router;