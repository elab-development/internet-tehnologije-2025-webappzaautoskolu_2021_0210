import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

export default app;
