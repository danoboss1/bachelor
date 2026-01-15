import express from 'express';
import { KnoxStatsController } from '../controllers/knoxStatsController.js';

const router = express.Router();

router.get('/:statId', KnoxStatsController.getStat);
router.post('/', KnoxStatsController.saveStat);

export default router;