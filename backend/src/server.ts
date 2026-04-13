import app from './app.js';

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
}).on('error', (err) => {
    console.error('Error while starting the server:', err);
});

