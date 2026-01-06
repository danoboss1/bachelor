import express from 'express';
import { KnoxStatsController } from '../controllers/knoxStatsController.js';

const router = express.Router();


router.post('/', KnoxStatsController.saveStat);

export default router;