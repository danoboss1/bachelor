import express from 'express';
import { StatsController } from '../controllers/wcstStatsController.js';
import authMiddleware from "../controllers/authMiddleware.js";

const router = express.Router();

// router.get('/percentile/trials-administered', (req, res) => {
//     console.log("Percentile route hit");
//     res.send("ok");
// });

router.get("/trend", authMiddleware, StatsController.getTrendMessage);
router.get("/recentAverage", authMiddleware, StatsController.getRecentAverageSummary);

router.get('/percentile', StatsController.getPercentile);
router.get('/month', authMiddleware, StatsController.getMonthlyBestPerDay);

router.get('/:statId', StatsController.getStat);
router.post('/', StatsController.saveStat);


export default router;