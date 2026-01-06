import express from 'express';
import { KnoxStatsController } from '../controllers/knoxStatsController.js';

const router = express.Router();

router.get('/:userId', KnoxStatsController.getStat);
router.post('/', KnoxStatsController.saveStat);

export default router;