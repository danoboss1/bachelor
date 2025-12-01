import express from 'express';
import { StatsController } from '../controllers/wcstStatsController.js';

const router = express.Router();

router.get('/:statId', StatsController.getStat);
router.post('/', StatsController.saveStat);
router.get('/percentile/trials-administered', StatsController.getTrialsAdministeredPercentile);

export default router;