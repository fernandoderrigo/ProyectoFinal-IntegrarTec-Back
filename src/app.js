import express from 'express';
import userRoutes from './routes/userRoutes.js';
import userHistoryRoutes from './routes/userHistoryRoutes.js';
import verifyMiddleware from './middlewares/verifyMiddleware.js';
import songRoutes from './routes/songRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import albumRoutes from './routes/albumRoutes.js';

const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/user-history', verifyMiddleware, userHistoryRoutes);
app.use('/songs', songRoutes);
app.use('/artists', artistRoutes)
app.use('/albums', albumRoutes)

export default app;