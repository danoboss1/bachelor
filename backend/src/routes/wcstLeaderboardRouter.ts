import express from 'express';
import { LeaderboardController } from '../controllers/wcstLeaderboardController.js';

const router = express.Router();

router.get('', LeaderboardController.getLeaderboard);

export default router;