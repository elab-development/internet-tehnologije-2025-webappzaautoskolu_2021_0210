import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import testRoutes from './routes/testRoutes';


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);


app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

export default app;
