import express from 'express';
import type { Request, Response } from 'express';
// import userRoutes from '../src/routes/userRoutes.js';
// import statRoutes from '../src/routes/wcstStatsRouter.js';
// import leaderboardRoutes from '../src/routes/wcstLeaderboardRouter.js';
import userRoutes from './routes/userRoutes.js';
import wcstStatRoutes from './routes/wcstStatsRouter.js';
import leaderboardRoutes from './routes/wcstLeaderboardRouter.js';

import knoxStatRouter from './routes/knoxStatsRouter.js';
import tolStatsRouter from './routes/tolStatsRouter.js';

import registerRouter from './routes/registerRouter.js';

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/wcstStats', wcstStatRoutes);
app.use('/leaderboard', leaderboardRoutes);

app.use('/knoxStats', knoxStatRouter);
app.use('/tolStats', tolStatsRouter);
app.use('/register', registerRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

// const port: number = 3000;
// // Spustenie servera na všetkých sieťových rozhraniach
// app.listen(port, '0.0.0.0', () => {
//     console.log(`Server running successfully on port ${port}`);
// });

export default app;

// import express from 'express';
// import type { Application, Request, Response } from 'express';
// import userRoutes from './routes/userRoutes.js';
// import wcstStatRoutes from './routes/wcstStatsRouter.js';
// import leaderboardRoutes from './routes/wcstLeaderboardRouter.js';


// const app: Application = express();
// const port: number = 3000;

// // toto bude treba este vysvetlit ako presne funguje
// app.use(express.json());

// // toto bude treba este vysvetlit ako presne funguje
// app.use('/users', userRoutes);
// app.use('/stats', wcstStatRoutes);
// app.use('/leaderboard', leaderboardRoutes);

// // toto bude treba este vysvetlit ako presne funguje
// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello world!');
// })

// // Spustenie servera na všetkých sieťových rozhraniach
// app.listen(port, '0.0.0.0', () => {
//     console.log(`Server running successfully on port ${port}`);
// });