import express from 'express';
import type { Application, Request, Response } from 'express';
import userRoutes from './routes/userRoutes.js';
import statRoutes from './routes/wcstStatsRouter.js';
import leaderboardRoutes from './routes/wcstLeaderboardRouter.js';


const app: Application = express();
const port: number = 3000;

// toto bude treba este vysvetlit ako presne funguje
app.use(express.json());

// toto bude treba este vysvetlit ako presne funguje
app.use('/users', userRoutes);
app.use('/stats', statRoutes);
app.use('/leaderboard', leaderboardRoutes);

// toto bude treba este vysvetlit ako presne funguje
app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
})

app.listen(port, () => {
    console.log(`Connected succesfully on port ${port}`)
});
